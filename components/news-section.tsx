"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

const newsItems = [
  {
    id: 1,
    title: "5 Simple Tips on How to Choose the Right Major for Your Future",
    image: "/education-tips.png",
    category: "Education",
  },
  {
    id: 2,
    title: "Special Lecture by Dr. Thomas Leoang: Introducing the Design...",
    image: "/lecture-hall.png",
    category: "Lecture",
  },
  {
    id: 3,
    title: "Two Software Engineering Students Lead DX Projects in...",
    image: "/students-collaborating.png",
    category: "Achievement",
  },
]

export function NewsSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<typeof newsItems | null>(null)

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setData(newsItems)
      setIsLoading(false)
    }, 1500) // Simulate a 1.5 second loading time

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#9B0000] mb-4">RESERVE YOUR SEAT AS FAST AS POSSIBLE</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Landing a high-skilled job in Japan has never been easier. Follow these simple steps to apply, connect with
            top employers, and start your new career.
          </p>
          <p className="text-gray-600 mt-2">No one would share your International Experience like KIT Alumni did</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading
            ? // Render shimmer cards when loading
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden bg-white border-0 shadow-none">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
                  </div>
                  <CardContent className="p-6 space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-full animate-pulse"></div>
                    <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            : // Render actual news items when loaded
              data?.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden bg-white border-0 shadow-none hover:shadow-sm transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-[#9B0000] text-lg leading-tight">{item.title}</h3>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  )
}
