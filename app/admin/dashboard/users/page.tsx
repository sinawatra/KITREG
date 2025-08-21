"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Loader2, Search, Users, Shield, ShieldCheck, UserPlus, Download, Filter } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string | null
  email: string | null
  position: string | null
  department: string | null
  is_admin: boolean
  created_at: string
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/admin/users")
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to fetch users")
  }
  return response.json()
}

async function toggleAdminStatus(userId: string, isAdmin: boolean): Promise<void> {
  const response = await fetch(`/api/admin/users/${userId}/admin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_admin: !isAdmin }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update admin status")
  }
}

export default function ManageUsersPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all")

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["adminUsers"],
    queryFn: fetchUsers,
  })

  const toggleAdminMutation = useMutation<void, Error, { userId: string; isAdmin: boolean }>({
    mutationFn: ({ userId, isAdmin }) => toggleAdminStatus(userId, isAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] })
    },
    onError: (err) => {
      alert("Error updating admin status: " + err.message)
    },
  })

  const handleToggleAdmin = (userId: string, currentStatus: boolean, userName: string) => {
    const action = currentStatus ? "remove admin privileges from" : "grant admin privileges to"
    if (confirm(`Are you sure you want to ${action} ${userName}?`)) {
      toggleAdminMutation.mutate({ userId, isAdmin: currentStatus })
    }
  }

  const exportUsers = () => {
    if (!users) return

    const csvContent = [
      ["Name", "Email", "Position", "Department", "Role", "Joined Date"].join(","),
      ...filteredUsers.map((user) =>
        [
          user.name || "N/A",
          user.email || "N/A",
          user.position || "N/A",
          user.department || "N/A",
          user.is_admin ? "Admin" : "User",
          format(new Date(user.created_at), "yyyy-MM-dd"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kit_reg_users_${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Filter users based on search term and role filter
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole =
      filterRole === "all" || (filterRole === "admin" && user.is_admin) || (filterRole === "user" && !user.is_admin)

    return matchesSearch && matchesRole
  })

  const stats = {
    total: users?.length || 0,
    admins: users?.filter((u) => u.is_admin).length || 0,
    regularUsers: users?.filter((u) => !u.is_admin).length || 0,
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#9B0000]" />
        <p className="ml-2 text-gray-700">Loading users...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading users: {error?.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all users and their permissions</p>
        </div>
        <Button onClick={exportUsers} className="bg-[#9B0000] hover:bg-[#8A0000]">
          <Download className="mr-2 h-4 w-4" />
          Export Users
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-green-600">{stats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Regular Users</p>
                <p className="text-2xl font-bold text-purple-600">{stats.regularUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, position, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterRole} onValueChange={(value: "all" | "admin" | "user") => setFilterRole(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admins Only</SelectItem>
                  <SelectItem value="user">Users Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl text-[#9B0000]">Platform Users</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {filteredUsers?.length || 0} of {stats.total}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/images/user-avatar.png" alt={user.name || "User"} />
                            <AvatarFallback className="bg-gray-100">
                              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{user.name || "No name provided"}</p>
                            <p className="text-sm text-gray-500 truncate max-w-48">{user.email || "No email"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{user.email || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.position || "Not specified"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.department || "Not specified"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.is_admin
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {user.is_admin ? (
                            <>
                              <ShieldCheck className="mr-1 h-3 w-3" />
                              Admin
                            </>
                          ) : (
                            <>
                              <Shield className="mr-1 h-3 w-3" />
                              User
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{format(new Date(user.created_at), "dd MMM yyyy")}</p>
                          <p className="text-xs text-gray-500">{format(new Date(user.created_at), "HH:mm")}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={user.is_admin ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleAdmin(user.id, user.is_admin, user.name || user.email || "User")}
                          disabled={toggleAdminMutation.isPending}
                          className={user.is_admin ? "" : "bg-green-600 hover:bg-green-700 text-white"}
                        >
                          {toggleAdminMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : user.is_admin ? (
                            <>
                              <Shield className="mr-1 h-3 w-3" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-1 h-3 w-3" />
                              Make Admin
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterRole !== "all" ? "No users found" : "No users yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterRole !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Users will appear here once they register for the platform."}
              </p>
              {(searchTerm || filterRole !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterRole("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
