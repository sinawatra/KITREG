"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter, useParams } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string // YYYY-MM-DD format
  type: string
  created_at: string
}

async function fetchWorkshopById(id: string): Promise<Workshop> {
  const response = await fetch(`/api/admin/events/${id}`, {
    credentials: "include"
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to fetch workshop")
  }
  return response.json()
}

async function updateWorkshop(workshop: Partial<Workshop> & { id: number }): Promise<Workshop> {
  const response = await fetch(`/api/admin/events/${workshop.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(workshop),
  })
  if (!response.ok) {
    let errorText = await response.text()
    console.error("Update failed:", response.status, errorText)
    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = {}
    }
    throw new Error(errorData.error || `Failed to update workshop (status ${response.status})`)
  }
  const text = await response.text()
  if (!text) {
    throw new Error("No response from server")
  }
  return JSON.parse(text)
}
export default function EditEventPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const workshopId = params.id as string

  const {
    data: workshop,
    isLoading: isLoadingWorkshop,
    isError: isErrorWorkshop,
    error: workshopError,
  } = useQuery<Workshop, Error>({
    queryKey: ["adminWorkshop", workshopId],
    queryFn: () => fetchWorkshopById(workshopId),
  })

  const [formData, setFormData] = useState<Partial<Workshop>>({
    title: "",
    status: "Open Application",
    image: "",
    location: "",
    date: "",
    type: "workshop",
  })

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        status: workshop.status,
        image: workshop.image,
        location: workshop.location,
        date: format(new Date(workshop.date), "yyyy-MM-dd"), // Format date for input type="date"
        type: workshop.type,
      })
    }
  }, [workshop])

  const updateWorkshopMutation = useMutation<Workshop, Error, Partial<Workshop> & { id: number }>({
    mutationFn: updateWorkshop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWorkshops"] }) // Invalidate list
      queryClient.invalidateQueries({ queryKey: ["adminWorkshop", workshopId] }) // Invalidate single item
      alert("Workshop updated successfully!")
      router.push("/admin/dashboard/events")
    },
    onError: (err) => {
      alert("Error updating workshop: " + err.message)
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: keyof Partial<Workshop>, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (workshopId) {
      updateWorkshopMutation.mutate({ id: Number(workshopId), ...formData })
    }
  }

  if (isLoadingWorkshop) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#9B0000]" />
        <p className="ml-2 text-gray-700">Loading event details...</p>
      </div>
    )
  }

  if (isErrorWorkshop) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading event: {workshopError?.message}</p>
        <Link href="/admin/dashboard/events">
          <Button variant="outline" className="mt-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#9B0000]">Edit Event: {workshop?.title}</CardTitle>
        <CardDescription className="text-gray-600">Update the details for this workshop or event.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., AI & Machine Learning Workshop"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., KIT Campus"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="bootcamp">Bootcamp</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open Application">Open Application</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="e.g., /images/my-event-banner.png"
            />
            <p className="text-sm text-gray-500">
              Use a relative path for images in your public folder, or a full URL.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Link href="/admin/dashboard/events">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#9B0000] hover:bg-[#8A0000] text-white py-2"
              disabled={updateWorkshopMutation.isPending}
            >
              {updateWorkshopMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
