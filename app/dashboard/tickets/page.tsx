"use client"

import Link from "next/link"
import { WorkshopCard } from "@/components/workshop-card"
import { BookingModal } from "@/components/booking-modal"
import { useState } from "react"
// TEMPORARILY COMMENTED OUT FOR PREVIEW
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { supabase } from "@/lib/supabaseClient"
// import { Loader2 } from 'lucide-react'

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
}

// TEMPORARILY USING MOCK DATA FOR PREVIEW
const mockBookedWorkshops: Workshop[] = [
  // {
  //   id: 1,
  //   title: "Workshop: Tips to pass for Job Application",
  //   status: "Booked",
  //   image: "/images/seeds-for-the-future-logo.png",
  //   location: "KIT",
  //   date: "2024-03-27",
  //   type: "workshop",
  // },
 
]

export default function TicketsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // TEMPORARILY USING MOCK DATA FOR PREVIEW
  const bookedWorkshops = mockBookedWorkshops
  const isLoading = false
  const isError = false

  const handleBookNow = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setIsModalOpen(true)
  }

  const handleCancelBooking = (workshopId: number, workshopTitle: string) => {
    if (confirm(`Are you sure you want to cancel your booking for "${workshopTitle}"?`)) {
      // TEMPORARILY JUST SHOW ALERT FOR PREVIEW
      alert("Cancel booking functionality will be connected later!")
    }
  }

  const handleConfirmBooking = async (formData: {
    name: string
    studentId: string
    email: string
    phone: string
    reason: string
  }) => {
    alert("This modal is for viewing booked workshop details.")
    setIsModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#9B0000] border-t-transparent" />
        <p className="ml-2 text-gray-700">Loading your booked tickets...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading tickets</p>
      </div>
    )
  }

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Booked Tickets</h2>

      {bookedWorkshops && bookedWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedWorkshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onBookNow={() => handleBookNow(workshop)}
              onCancelBooking={() => handleCancelBooking(workshop.id, workshop.title)}
              isCancelling={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          <p>You haven't booked any workshops yet.</p>
          <Link href="/" className="text-[#9B0000] hover:underline mt-2 block">
            Browse available workshops
          </Link>
        </div>
      )}

      <BookingModal
        workshop={selectedWorkshop}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
        isBookingLoading={false}
      />
    </div>
  )
}
