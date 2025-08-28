"use client"

import Link from "next/link"
import { WorkshopCard } from "@/components/workshop-card"
import { BookingModal } from "@/components/booking-modal"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import StatusBadge from "@/components/prismui/status-badge"

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
  userId?: string // Add userId to track who booked this workshop
}

// Modified to fetch only the current user's bookings
const fetchBookedWorkshops = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      console.log("No user logged in");
      return [];
    }
    
    // For development: retrieve from localStorage and filter by userId
    const savedWorkshops = localStorage.getItem('bookedWorkshops')
    if (savedWorkshops) {
      const allWorkshops = JSON.parse(savedWorkshops) as Workshop[];
      // Only return workshops booked by the current user
      return allWorkshops.filter(workshop => workshop.userId === userId);
    }
    
    // When you connect to your backend, replace this with:
    // const { data, error } = await supabase
    //   .from('bookings')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .join('workshops', { foreignKey: 'workshop_id' })
    
    return []
  } catch (error) {
    console.error("Error fetching booked workshops:", error);
    return [];
  }
}

export default function TicketsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    
    fetchUser();
  }, []);
  
  // Use React Query to fetch and cache booked workshops
  const { data: bookedWorkshops = [], isLoading, isError } = useQuery({
    queryKey: ['bookedWorkshops', currentUserId],
    queryFn: fetchBookedWorkshops,
    enabled: !!currentUserId, // Only run the query if we have a user ID
  })
  
  const queryClient = useQueryClient()
  
  const cancelMutation = useMutation({
    mutationFn: async (workshopId: number) => {
      // When connected to your backend:
      // await supabase.from('bookings').delete().eq('workshop_id', workshopId).eq('user_id', currentUserId)
      
      // For development:
      const current = localStorage.getItem('bookedWorkshops') 
        ? JSON.parse(localStorage.getItem('bookedWorkshops') as string) 
        : []
      
      const updated = current.filter((w: Workshop) => !(w.id === workshopId && w.userId === currentUserId))
      localStorage.setItem('bookedWorkshops', JSON.stringify(updated))
      return workshopId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookedWorkshops', currentUserId] })
    }
  })

  const handleViewDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setIsDetailsModalOpen(true)
  }

  const handleCancelBooking = (workshopId: number, workshopTitle: string) => {
    if (confirm(`Are you sure you want to cancel your booking for "${workshopTitle}"?`)) {
      cancelMutation.mutate(workshopId)
    }
  }

  const handleConfirmBooking = async (formData: {
    name: string
    studentId: string
    email: string
    phone: string
    reason: string
  }) => {
    // This function should be used when booking new workshops,
    // not needed for the tickets view
    setIsModalOpen(false)
  }

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Booked Tickets</h2>

      {!currentUserId ? (
        <div className="text-center py-8 text-gray-600">
          <p>Please sign in to view your tickets.</p>
          <Link href="/auth/signin" className="text-[#9B0000] hover:underline mt-2 block">
            Sign In
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#9B0000] border-t-transparent" />
          <p className="ml-2 text-gray-700">Loading your booked tickets...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading tickets</p>
        </div>
      ) : bookedWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedWorkshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={{...workshop, status: "Booked"}}
              onViewDetails={() => handleViewDetails(workshop)}
              onCancelBooking={() => handleCancelBooking(workshop.id, workshop.title)}
              isCancelling={cancelMutation.isPending}
              showBookButton={false}
              isDashboard={true}
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

      {/* Workshop Details Modal */}
      {isDetailsModalOpen && selectedWorkshop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900">{selectedWorkshop.title}</h3>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {selectedWorkshop.image && (
              <img 
                src={selectedWorkshop.image} 
                alt={selectedWorkshop.title}
                className="w-full h-48 object-cover rounded-md my-4"
              />
            )}
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-700">{selectedWorkshop.date}</p>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-700">{selectedWorkshop.location}</p>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <p className="text-gray-700">{selectedWorkshop.type}</p>
              </div>
              
              <div className="flex items-center">
                <StatusBadge status="completed" label="Ticket Booked" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false)
                  handleCancelBooking(selectedWorkshop.id, selectedWorkshop.title)
                }}
                className="px-4 py-2 ml-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
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
