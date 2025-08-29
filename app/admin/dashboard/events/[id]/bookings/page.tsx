"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import StatusBadge from "@/components/prismui/status-badge"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { Loader2, ArrowLeft, Users, Calendar, MapPin, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Helper function to map workshop status to StatusBadge variant
const getStatusVariant = (status: string): "pending" | "completed" | "failed" | "processing" | "draft" => {
  switch (status.toLowerCase()) {
    case "open application":
      return "completed";
    case "booked":
      return "processing";
    case "done":
      return "failed";
    case "cancelled":
    case "closed":
      return "draft";
    default:
      return "pending";
  }
}

interface Booking {
  id: string
  booked_at: string
  user_name: string
  user_email: string
  student_id: string
  phone_number: string
  reason: string
}

interface Workshop {
  id: number
  title: string
  location: string
  date: string
  image: string
  status: string
}

async function fetchWorkshopBookings(workshopId: string): Promise<Booking[]> {
  try {
    const response = await fetch(`/api/admin/events/${workshopId}/bookings`, { 
      credentials: "include" 
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch bookings")
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching bookings:", error)
    throw error
  }
}

async function fetchWorkshopDetails(workshopId: string): Promise<Workshop> {
  try {
    const response = await fetch(`/api/admin/events/${workshopId}`, {
      credentials: "include"
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch workshop details")
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching workshop details:", error)
    throw error
  }
}

export default function EventBookingsPage() {
  const params = useParams()
  const workshopId = params.id as string
  
  // Make sure we have a valid workshopId
  if (!workshopId) {
    return (
      <div className="text-center py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 max-w-lg mx-auto">
          <p className="text-amber-700 font-medium">Missing event ID</p>
          <p className="text-amber-600 mt-2">Unable to load event details without an ID</p>
        </div>
        <Link href="/admin/dashboard/events">
          <Button variant="outline" className="mt-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </Link>
      </div>
    )
  }

  const {
    data: bookings,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
    error: bookingsError,
  } = useQuery<Booking[], Error>({
    queryKey: ["workshopBookings", workshopId],
    queryFn: () => fetchWorkshopBookings(workshopId),
    retry: (failureCount, error) => {
      // Don't retry on 404 (not found) or 403 (unauthorized)
      if (
        error instanceof Error && 
        error.message.includes("404") || 
        error.message.includes("403")
      ) {
        return false;
      }
      return failureCount < 3;
    }
  })

  const {
    data: workshopDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
    error: detailsError,
  } = useQuery<Workshop, Error>({
    queryKey: ["workshopDetails", workshopId],
    queryFn: () => fetchWorkshopDetails(workshopId),
    retry: (failureCount, error) => {
      // Don't retry on 404 (not found) or 403 (unauthorized)
      if (
        error instanceof Error && 
        error.message.includes("404") || 
        error.message.includes("403")
      ) {
        return false;
      }
      return failureCount < 3;
    }
  })

  const exportBookings = () => {
    if (!bookings || !workshopDetails) return

    const csvContent = [
      ["Name", "Email", "Student ID", "Phone", "Reason", "Booked At"].join(","),
      ...bookings.map((booking) =>
        [
          booking.user_name,
          booking.user_email,
          booking.student_id,
          booking.phone_number,
          `"${booking.reason.replace(/"/g, '""')}"`,
          format(new Date(booking.booked_at), "yyyy-MM-dd HH:mm:ss"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${workshopDetails.title.replace(/[^a-zA-Z0-9]/g, "_")}_bookings.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoadingBookings || isLoadingDetails) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#9B0000] mb-4" />
        <p className="text-gray-700">Loading event details and bookings...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the data</p>
      </div>
    )
  }

  if (isErrorBookings || isErrorDetails) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-lg mx-auto">
          <p className="text-red-600 font-medium mb-2">Error loading data:</p>
          <p className="text-red-500">{bookingsError?.message || detailsError?.message}</p>
        </div>
        <Link href="/admin/dashboard/events">
          <Button variant="outline" className="mt-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Bookings</h1>
            <p className="text-gray-600 mt-1">Manage registrations for this event</p>
          </div>
        </div>
        {bookings && bookings.length > 0 && (
          <Button onClick={exportBookings} className="bg-[#9B0000] hover:bg-[#8A0000]">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Event Details Card */}
      {workshopDetails && (
        <Card className="border-l-4 border-l-[#9B0000]">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={workshopDetails.image || "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=/images/seeds-for-the-future-logo.png"}
                  alt={workshopDetails.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{workshopDetails.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{workshopDetails.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{format(new Date(workshopDetails.date), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{bookings?.length || 0} registrations</span>
                  </div>
                </div>
              </div>
              <StatusBadge 
                status={getStatusVariant(workshopDetails.status)}
                label={workshopDetails.status}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl text-[#9B0000]">Registered Participants</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {bookings?.length || 0} Total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Reason to Join</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking, index) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{booking.user_name}</p>
                          <p className="text-sm text-gray-500">#{index + 1}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{booking.user_email}</p>
                          <p className="text-sm text-gray-500">{booking.phone_number}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{booking.student_id}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{format(new Date(booking.booked_at), "dd MMM yyyy")}</p>
                          <p className="text-xs text-gray-500">{format(new Date(booking.booked_at), "HH:mm")}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm line-clamp-3">{booking.reason}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
              <p className="text-gray-600 mb-4">
                This event hasn't received any registrations yet. Share it with the community!
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={`/admin/dashboard/events/edit/${workshopId}`}>
                  <Button variant="outline">Edit Event</Button>
                </Link>
                <Link href="/admin/dashboard/events">
                  <Button className="bg-[#9B0000] hover:bg-[#8A0000]">View All Events</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
