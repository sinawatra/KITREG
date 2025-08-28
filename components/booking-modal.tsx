"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Calendar, Clock } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
}

interface BookingModalProps {
  workshop: Workshop | null
  isOpen: boolean
  onClose: () => void
  onConfirmBooking: (formData: {
    name: string
    studentId: string
    email: string
    phone: string
    reason: string
  }) => void // Updated prop
  isBookingLoading: boolean
}

export function BookingModal({ workshop, isOpen, onClose, onConfirmBooking, isBookingLoading }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    reason: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      if (!userId) {
        alert("Please sign in to book a workshop");
        return;
      }

      // When connected to your backend:
      // await supabase.from('bookings').insert({
      //   workshop_id: workshop.id,
      //   user_id: userId,
      //   name: formData.name,
      //   email: formData.email,
      //   phone: formData.phone,
      //   student_id: formData.studentId,
      //   reason: formData.reason
      // })
      
      // For development (localStorage):
      const savedWorkshops = localStorage.getItem("bookedWorkshops")
        ? JSON.parse(localStorage.getItem("bookedWorkshops") as string)
        : [];
      
      // Add user ID to the booking
      savedWorkshops.push({
        ...workshop,
        userId: userId,  // Add the user ID to track who booked this
        status: "Booked",
        bookingDetails: formData
      });
      
      localStorage.setItem('bookedWorkshops', JSON.stringify(savedWorkshops));
      
      console.log("Booking submitted:", { workshop: workshop?.id, userId, ...formData })
      
      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        studentId: "",
        reason: "",
      })
      
      // Call the onConfirmBooking prop and let the parent component handle success messaging
      onConfirmBooking(formData)
      
      // Close the modal
      onClose()
    } catch (error) {
      console.error("Error booking workshop:", error);
      alert("There was an error booking the workshop. Please try again.");
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!workshop) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#9B0000]">Book Workshop</DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete the form below to book your seat for this workshop.
          </DialogDescription>
        </DialogHeader>

        {/* Workshop Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">{workshop.title}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{workshop.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(workshop.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>9:00 AM - 5:00 PM</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
                placeholder="Enter your student ID"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="reason">Why do you want to attend this workshop?</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Tell us why you're interested in this workshop..."
              rows={3}
              required
            />
          </div>

          <DialogFooter className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isBookingLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#9B0000] hover:bg-[#8A0000] text-white" disabled={isBookingLoading}>
              {isBookingLoading ? "Submitting..." : "Submit Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
