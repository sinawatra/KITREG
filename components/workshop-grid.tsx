'use client'

import { useState } from 'react'
import { WorkshopCard } from '@/components/workshop-card'
import { BookingModal } from '@/components/booking-modal'
import { useQuery } from '@tanstack/react-query'

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
}

// Simulate an API call to fetch workshops
async function fetchWorkshops(): Promise<Workshop[]> {
  // In a real application, you would fetch from your Node.js backend here
  // Example: const response = await fetch('/api/workshops');
  // const data = await response.json();
  // return data;

  // For now, we'll return the hardcoded data after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Workshop: Tips to pass for Job Application',
          status: 'Open Application',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2026-03-27',
          type: 'workshop'
        },
        {
          id: 2,
          title: 'Career Development Workshop',
          status: 'Open Application',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-01-20',
          type: 'workshop'
        },
        {
          id: 3,
          title: 'Technical Skills Enhancement',
          status: 'Open Application',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-01-25',
          type: 'workshop'
        },
        {
          id: 4,
          title: 'Leadership Training Program',
          status: 'Open Application',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-02-01',
          type: 'workshop'
        },
        {
          id: 5,
          title: 'Innovation Workshop',
          status: 'Open Application',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-02-05',
          type: 'workshop'
        },
        {
          id: 6,
          title: 'Entrepreneurship Bootcamp',
          status: 'Open Application',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-02-10',
          type: 'workshop'
        },
        {
          id: 7,
          title: 'Digital Marketing Workshop',
          status: 'Open Application',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-02-15',
          type: 'workshop'
        },
        {
          id: 8,
          title: 'Project Management Training',
          status: 'Open Application',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-02-20',
          type: 'workshop'
        },
        {
          id: 9,
          title: 'AI & Machine Learning Workshop',
          status: 'Closed',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-02-25',
          type: 'workshop'
        },
        {
          id: 10,
          title: 'Data Science Bootcamp',
          status: 'Closed',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-03-01',
          type: 'workshop'
        },
        {
          id: 11,
          title: 'Web Development Workshop',
          status: 'Closed',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-03-05',
          type: 'workshop'
        },
        {
          id: 12,
          title: 'Mobile App Development',
          status: 'Done',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-03-10',
          type: 'workshop'
        },
        {
          id: 13,
          title: 'Advanced Research Methods',
          status: 'Done',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-03-15',
          type: 'workshop'
        },
        {
          id: 14,
          title: 'Scientific Writing Workshop',
          status: 'Done',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-03-20',
          type: 'workshop'
        },
        {
          id: 15,
          title: 'Presentation Skills Training',
          status: 'Done',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-03-25',
          type: 'workshop'
        },
        {
          id: 16,
          title: 'Team Building Workshop',
          status: 'Done',
          image: '/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future',
          location: 'KIT',
          date: '2024-03-30',
          type: 'workshop'
        }
      ]);
    }, 500); // Simulate network delay
  });
}

export function WorkshopGrid() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use TanStack Query to fetch workshops
  const { data: workshops, isLoading, isError, error } = useQuery<Workshop[], Error>({
    queryKey: ['workshops'],
    queryFn: fetchWorkshops,
  })

  const handleBookNow = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <section className="py-12 bg-white text-center">
        <p className="text-gray-700">Loading workshops...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="py-12 bg-white text-center">
        <p className="text-red-600">Error loading workshops: {error?.message}</p>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Upcoming Event</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshops?.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onBookNow={() => handleBookNow(workshop)}
            />
          ))}
        </div>

        <BookingModal
          workshop={selectedWorkshop}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  )
}
