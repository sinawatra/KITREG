"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function AdminSetupPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState<any[]>([])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Get current user to check if they're admin
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage("You must be logged in to view users")
        return
      }

      // Check if current user is admin
      const { data: currentProfile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

      if (!currentProfile?.is_admin) {
        setMessage("Only admins can view this page")
        return
      }

      // Fetch all users with their profiles
      const { data: profiles, error } = await supabase.from("profiles").select("id, name, is_admin").order("name")

      if (error) {
        setMessage("Error fetching users: " + error.message)
        return
      }

      setUsers(profiles || [])
      setMessage("Users loaded successfully")
    } catch (error: any) {
      setMessage("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const makeAdmin = async (userId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("profiles").update({ is_admin: true }).eq("id", userId)

      if (error) {
        setMessage("Error making user admin: " + error.message)
        return
      }

      setMessage("User successfully made admin!")
      fetchUsers() // Refresh the list
    } catch (error: any) {
      setMessage("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeAdmin = async (userId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("profiles").update({ is_admin: false }).eq("id", userId)

      if (error) {
        setMessage("Error removing admin: " + error.message)
        return
      }

      setMessage("Admin privileges removed!")
      fetchUsers() // Refresh the list
    } catch (error: any) {
      setMessage("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#9B0000]">Admin Setup</h1>
          <p className="text-gray-600 mt-2">Manage admin users for the KIT REG system</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <Link href="/admin/login">
            <Button className="bg-[#9B0000] hover:bg-[#8A0000]">Admin Login</Button>
          </Link>
        </div>

        {/* Load Users Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Users</CardTitle>
            <CardDescription>View and manage admin privileges for existing users</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchUsers} disabled={loading} className="mb-4">
              {loading ? "Loading..." : "Load Users"}
            </Button>

            {users.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Users in System:</h3>
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">{user.name || "No name"}</span>
                      <span className="ml-2 text-sm text-gray-500">{user.is_admin ? "(Admin)" : "(Regular User)"}</span>
                    </div>
                    <div className="space-x-2">
                      {!user.is_admin ? (
                     <Button
                      size="sm"
                      onClick={loading ? undefined : () => makeAdmin(user.id)} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Make Admin
                    </Button>
                      ) : (
                        <Button size="sm" variant="destructive" onClick={() => removeAdmin(user.id)} disabled={loading}>
                          Remove Admin
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Display */}
        {message && (
          <Card>
            <CardContent className="p-4">
              <p className={`text-center ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Method 1: Using SQL (Recommended)</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to your Supabase Dashboard → SQL Editor</li>
                <li>
                  Run the script: <code className="bg-gray-100 px-2 py-1 rounded">011_create_admin_user.sql</code>
                </li>
                <li>
                  Replace <code className="bg-gray-100 px-2 py-1 rounded">'your-email@example.com'</code> with your
                  actual email
                </li>
                <li>Execute the script</li>
                <li>
                  Sign in with that email at <code>/admin/login</code>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Method 2: Using This Page</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>First, create a regular account by signing up normally</li>
                <li>Then have an existing admin use the "Load Users" button above</li>
                <li>Click "Make Admin" next to your account</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h4 className="font-semibold text-yellow-800">Important Notes:</h4>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>You need at least one admin to access the CRUD functionality</li>
                <li>
                  Admins can access <code>/admin/dashboard</code> to manage events and users
                </li>
                <li>Regular users can only book workshops and manage their profiles</li>
                <li>Use Method 1 (SQL) to create your first admin user</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
