"use client"

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { useAnnouncements } from '@/hooks/use-announcements'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: announcements, isLoading, error } = useAnnouncements()
  
  // Log the state for debugging
  console.log('NotificationBell render state:', { 
    announcements, 
    isLoading, 
    error, 
    announcementsLength: announcements?.length 
  })
  
  // Count of unread notifications (in a real app, you would track read status)
  const notificationCount = announcements?.length || 0

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="py-2 px-3 font-medium text-sm">Announcements</div>
        <Separator />
        
        <ScrollArea className="h-64">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading announcements...</div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-500">
              {/* Failed to load announcements */}
             !! Announcement is Comming Soon !!
            </div>
          ) : announcements && announcements.length > 0 ? (
            announcements.map((announcement) => (
              <DropdownMenuItem key={announcement.id} className="cursor-default focus:bg-gray-50">
                <div className="w-full py-2">
                  <p className="font-medium text-sm text-gray-900">{announcement.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{announcement.subtitle}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">No announcements</div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
