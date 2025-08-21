"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { CalendarCheck, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  totalEvents: number
  totalUsers: number
  totalBookings: number
  activeEvents: number
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const [eventsRes, usersRes, bookingsRes] = await Promise.all([
    fetch("/api/admin/events"),
    fetch("/api/admin/users"),
    fetch("/api/admin/bookings/stats"),
  ])

  const events = eventsRes.ok ? await eventsRes.json() : []
  const users = usersRes.ok ? await usersRes.json() : []
  const bookings = bookingsRes.ok ? await bookingsRes.json() : { total: 0 }

  const activeEvents = events.filter((event: any) => event.status === "Open Application").length

  return {
    totalEvents: events.length || 0,
    totalUsers: users.length || 0,
    totalBookings: bookings.total || 0,
    activeEvents,
  }
}

export default function AdminDashboardPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<DashboardStats, Error>({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading dashboard: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your KIT REG platform efficiently</p>
        </div>
        <Link href="/admin/dashboard/events/create">
          <Button className="bg-[#9B0000] hover:bg-[#8A0000]">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalEvents || 0}</div>
            <p className="text-xs text-gray-600">All events in system</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.activeEvents || 0}</div>
            <p className="text-xs text-gray-600">Open for registration</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-gray-600">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.totalBookings || 0}</div>
            <p className="text-xs text-gray-600">Event registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#9B0000]">Event Management</CardTitle>
            <CardDescription>Create, edit, and manage your events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
  <div className="mb-2">
    <Link href="/admin/dashboard/events">
      <Button variant="outline" className="w-full justify-start bg-transparent space-y-3">
        <CalendarCheck className="mr-2 h-4 w-4" />
        View All Events
      </Button>
    </Link>
  </div>
  <div>
    <Link href="/admin/dashboard/events/create">
      <Button className="w-full justify-start bg-[#9B0000] hover:bg-[#8A0000]">
        <CalendarCheck className="mr-2 h-4 w-4" />
        Create New Event
      </Button>
    </Link>
  </div>
</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#9B0000]">User Management</CardTitle>
            <CardDescription>Manage users and their permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="mb-2">
              <Link href="/admin/dashboard/users">
              <Button variant="outline" className="w-full justify-start bg-transparent space-y-3">
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Button>
            </Link>
              </div>
              <div className="mb-2">
            <Link href="/admin/setup">
              <Button variant="outline" className="w-full justify-start bg-transparent space-y-3">
                <Users className="mr-2 h-4 w-4" />
                Admin Setup
              </Button>
            </Link>
            </div>
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
