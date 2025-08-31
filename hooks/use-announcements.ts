import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface Announcement {
  id: string
  title: string
  subtitle: string
  created_at: string
}

async function fetchAnnouncements(): Promise<Announcement[]> {
  const response = await fetch('/api/announcement')
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to fetch announcements')
  }
  
  const data = await response.json()
  return data.announcements
}

export function useAnnouncements() {
  return useQuery<Announcement[], Error>({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
