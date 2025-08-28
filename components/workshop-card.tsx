"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Info, XCircle } from "lucide-react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import React from "react"

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
}

export interface WorkshopCardProps {
  workshop: Workshop
  onBookNow?: () => void
  onViewDetails?: () => void
  onCancelBooking?: () => void
  isCancelling?: boolean
  showBookButton?: boolean
  isDashboard?: boolean
}

export function WorkshopCard({
  workshop,
  onBookNow,
  onViewDetails,
  onCancelBooking,
  isCancelling = false,
  showBookButton = true,
  isDashboard = false,
}: WorkshopCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {workshop.image && (
        <img
          src={workshop.image}
          alt={workshop.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{workshop.title}</h3>

        <div className="mt-2 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {workshop.date}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {workshop.location}
          </div>

          <div className="flex items-center text-sm">
        <span
  className={`px-2 py-1 rounded-full text-xs font-medium ${
    workshop.status === "Available" && workshop.type === "Booked"
      ? "bg-green-100 text-green-800"
      : workshop.status === "Done"
        ? "bg-red-100 text-red-800"
        : workshop.status === "Closed"
          ? "bg-gray-100 text-gray-500"
          : "bg-green-100 text-green-800" // default/fallback
  }`}
>
  {workshop.status}
</span>
    
           <span className="ml-2 text-xs text-black-500 font-bold">
  {workshop.type.toUpperCase()}
</span>

          </div>
        </div>

        <div className="mt-4 flex justify-between">
          {isDashboard ? (
            <>
              <button
                onClick={onViewDetails}
                className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                View Details
              </button>

              <button
                onClick={onCancelBooking}
                disabled={isCancelling}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
              >
                {isCancelling ? "Cancelling..." : "Cancel"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onViewDetails || onBookNow}
                className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                View Details
              </button>

              {showBookButton && workshop.status !== "Booked" && (
                <button
                  onClick={onBookNow}
                  className="px-4 py-2 text-sm font-medium bg-[#9B0000] text-white rounded hover:bg-[#800000]"
                >
                  Book Now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
