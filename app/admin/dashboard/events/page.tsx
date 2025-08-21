"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { format } from "date-fns"
import { Loader2, Eye, Edit, Trash2, Plus, Users, Calendar, MapPin } from "lucide-react"
import Image from "next/image"

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
  created_at: string
}

async function fetchAdminWorkshops(): Promise<Workshop[]> {
  const response = await fetch("/api/admin/events", {
    credentials: "include"
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to fetch workshops")
  }
  return response.json()
}

async function updateWorkshopStatus(workshopId: number, status: string): Promise<Workshop> {
  const response = await fetch(`/api/admin/events/${workshopId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update workshop status")
  }
  return response.json()
}

async function deleteWorkshop(workshopId: number): Promise<void> {
  const response = await fetch(`/api/admin/events/${workshopId}`, {
    method: "DELETE",
    credentials: "include"
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to delete workshop")
  }
}

export default function ManageEventsPage() {
  const queryClient = useQueryClient()

  const {
    data: workshops,
    isLoading,
    isError,
    error,
  } = useQuery<Workshop[], Error>({
    queryKey: ["adminWorkshops"],
    queryFn: fetchAdminWorkshops,
  })

  const updateStatusMutation = useMutation<Workshop, Error, { id: number; status: string }>({
    mutationFn: ({ id, status }) => updateWorkshopStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWorkshops"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] })
    },
    onError: (err) => {
      alert("Error updating status: " + err.message)
    },
  })

  const deleteWorkshopMutation = useMutation<void, Error, number>({
    mutationFn: deleteWorkshop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWorkshops"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] })
    },
    onError: (err) => {
      alert("Error deleting workshop: " + err.message)
    },
  })

  const handleStatusChange = (workshopId: number, currentStatus: string) => {
    const newStatus = currentStatus === "Open Application" ? "Closed" : "Open Application"
    if (confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
      updateStatusMutation.mutate({ id: workshopId, status: newStatus })
    }
  }

  const handleDeleteWorkshop = (workshopId: number, title: string) => {
    if (confirm(`Are you sure you want to delete the event "${title}"? This action cannot be undone.`)) {
      deleteWorkshopMutation.mutate(workshopId)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open application":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Open</Badge>
      case "closed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Closed</Badge>
      case "done":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Done</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#9B0000]" />
        <p className="ml-2 text-gray-700">Loading events...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading events: {error?.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage all events</p>
        </div>
        <Link href="/admin/dashboard/events/create">
          <Button className="bg-[#9B0000] hover:bg-[#8A0000]">
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-blue-600">{workshops?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-green-600">
                  {workshops?.filter((w) => w.status === "Open Application").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Completed Events</p>
                <p className="text-2xl font-bold text-purple-600">
                  {workshops?.filter((w) => w.status === "Done").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#9B0000]">All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Event Details</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshops?.map((workshop) => (
                  <TableRow key={workshop.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={workshop.image || "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="}
                          alt={workshop.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-2">{workshop.title}</p>
                        <p className="text-sm text-gray-500 capitalize">{workshop.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{workshop.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{format(new Date(workshop.date), "dd MMM yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(workshop.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(workshop.id, workshop.status)}
                          disabled={updateStatusMutation.isPending}
                          className="text-xs"
                        >
                          {updateStatusMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : workshop.status === "Open Application" ? (
                            "Close"
                          ) : (
                            "Open"
                          )}
                        </Button>
                        <Link href={`/admin/dashboard/events/edit/${workshop.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Link href={`/admin/dashboard/events/${workshop.id}/bookings`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteWorkshop(workshop.id, workshop.title)}
                          disabled={deleteWorkshopMutation.isPending}
                        >
                          {deleteWorkshopMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {workshops && workshops.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No events found</p>
              <Link href="/admin/dashboard/events/create">
                <Button className="bg-[#9B0000] hover:bg-[#8A0000]">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Event
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
