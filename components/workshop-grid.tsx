"use client"

import { useState } from "react"
import { WorkshopCard } from "@/components/workshop-card"
import { BookingModal } from "@/components/booking-modal"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ShimmerCard } from "@/components/shimmer-card"
import { FeedbackModal } from "./feedback-modal"

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
}

async function fetchWorkshops(): Promise<Workshop[]> {
  const response = await fetch("/api/workshops", {
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch workshops")
  }
  return response.json()
}

export function WorkshopGrid() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean
    type: "success" | "error"
    title: string
    message: string
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  })
  const queryClient = useQueryClient()

  const {
    data: workshops,
    isLoading,
    isError,
    error,
  } = useQuery<Workshop[], Error>({
    queryKey: ["workshops"],
    queryFn: fetchWorkshops,
  })

  const bookWorkshopMutation = useMutation({
    mutationFn: async (bookingDetails: {
      workshopId: number
      name: string
      studentId: string
      email: string
      phone: string
      reason: string
    }) => {
      const response = await fetch("/api/book-workshop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingDetails),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to book workshop")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookedWorkshops"] })
      setFeedbackModal({
        isOpen: true,
        type: "success",
        title: "Booking Confirmed!",
        message: "Your workshop has been booked successfully. You'll receive a confirmation email shortly.",
      })
      setIsModalOpen(false)
    },
    onError: (err) => {
      setFeedbackModal({
        isOpen: true,
        type: "error",
        title: "Booking Failed",
        // message: `We couldn't complete your booking: ${err.message}. Please create and account and sign in to book`,
        message: `The system is explicitly suggesting that the most likely reason is that you are not signed in. Signing in ensures that the system can verify your account, associate the booking with you, and authorize any payments if needed.`,
      })
    },
  })

  const handleBookNow = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setIsModalOpen(true)
  }

  const handleConfirmBooking = async (formData: {
    name: string
    studentId: string
    email: string
    phone: string
    reason: string
  }) => {
    if (selectedWorkshop) {
      bookWorkshopMutation.mutate({
        workshopId: selectedWorkshop.id,
        ...formData,
      })
    }
  }

  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Upcoming Event</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => <ShimmerCard key={index} />)
          ) : isError ? (
            <div className="col-span-full text-center text-red-600">
              <p>Error loading workshops: {error?.message}</p>
            </div>
          ) : (
            workshops?.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} onBookNow={() => handleBookNow(workshop)} />
            ))
          )}
        </div>

        <BookingModal
          workshop={selectedWorkshop}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmBooking={handleConfirmBooking}
          isBookingLoading={bookWorkshopMutation.isPending}
        />

        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={closeFeedbackModal}
          type={feedbackModal.type}
          title={feedbackModal.title}
          message={feedbackModal.message}
        />
      </div>
    </section>
  )
}
