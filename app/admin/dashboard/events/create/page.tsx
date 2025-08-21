"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Loader2, Upload, Calendar, MapPin, Type, ImageIcon } from "lucide-react"
import Image from "next/image"

interface NewWorkshop {
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
  description?: string
}

async function createWorkshop(workshop: NewWorkshop): Promise<NewWorkshop> {
  const response = await fetch("/api/admin/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(workshop),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create workshop")
  }
  return response.json()
}

export default function CreateEventPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [formData, setFormData] = useState<NewWorkshop>({
    title: "",
    status: "Open Application",
    image: "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=",
    location: "",
    date: "",
    type: "workshop",
    description: "",
  })

  const createWorkshopMutation = useMutation<NewWorkshop, Error, NewWorkshop>({
    mutationFn: createWorkshop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWorkshops"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] })
      alert("Event created successfully!")
      router.push("/admin/dashboard/events")
    },
    onError: (err) => {
      alert("Error creating event: " + err.message)
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: keyof NewWorkshop, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Event title is required!")
      return
    }

    if (!formData.location.trim()) {
      alert("Location is required!")
      return
    }

    if (!formData.date) {
      alert("Date is required!")
      return
    }

    createWorkshopMutation.mutate(formData)
  }

  const predefinedImages = [
    { name: "Seeds for Future", path: "/images/seeds-for-the-future-logo.png" },
    { name: "AI Workshop", path: "/images/ai-workshop.png" },
    { name: "Data Science", path: "/images/data-science-workshop.png" },
    { name: "Career Seeds", path: "/images/future-career-seeds.png" },
    { name: "Tech Seeds", path: "/images/future-tech-seeds.png" },
    { name: "Innovation Seeds", path: "/images/future-innovation-seeds.png" },
    { name: "Startup Seeds", path: "/images/future-startup-seeds.png" },
    { name: "Marketing Seeds", path: "/images/seeds-future-marketing.png" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-1">Fill in the details to create a new workshop or event</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#9B0000] to-[#8A0000] text-white">
          <CardTitle className="text-2xl flex justify-center">
            ! Complete Your Event Details Below !
          </CardTitle>
    
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center">
                  <Type className="mr-2 h-4 w-4" />
                  Event Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., AI & Machine Learning Workshop"
                  className="border-2 focus:border-[#9B0000]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Location *
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., KIT Campus - Room A101"
                  className="border-2 focus:border-[#9B0000]"
                  required
                />
              </div>
            </div>

            {/* Date and Type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="border-2 focus:border-[#9B0000]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className="border-2 focus:border-[#9B0000]">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Event Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger className="border-2 focus:border-[#9B0000]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open Application">Open Application</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what participants will learn and experience..."
                rows={4}
                className="border-2 focus:border-[#9B0000]"
              />
            </div>

            {/* Image Selection */}
            <div className="space-y-4">
              <Label className="flex items-center">
                <ImageIcon className="mr-2 h-4 w-4" />
                Event Image
              </Label>

              {/* Current Image Preview */}
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100 border-2">
                  <Image src={formData.image || "/placeholder.svg"} alt="Event preview" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">Current Image</p>
                  <p className="text-xs text-gray-500">{formData.image}</p>
                </div>
              </div>

              {/* Image Options */}
        

              {/* Custom Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Or enter custom image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg or /images/my-image.png"
                  className="border-2 focus:border-[#9B0000]"
                />
                <p className="text-sm text-gray-500">
                  Use a relative path for images in your public folder, or a full URL for external images.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard/events")}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#9B0000] hover:bg-[#8A0000] text-white px-8"
                disabled={createWorkshopMutation.isPending}
              >
                {createWorkshopMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
