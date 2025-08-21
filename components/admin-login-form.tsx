"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // First, try to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError("Login failed: " + signInError.message)
        return
      }

      if (!data.user) {
        setError("Login failed: No user data received")
        return
      }

      // Check if the user is an admin
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin, name")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        setError("Error checking admin status: " + profileError.message)
        // Sign out the user since they can't access admin
        await supabase.auth.signOut()
        return
      }

      if (!profileData?.is_admin) {
        setError("Access Denied: Your account does not have admin privileges. Please contact an administrator.")
        // Sign out the user since they're not an admin
        await supabase.auth.signOut()
        return
      }

      // Success! Redirect to admin dashboard
      console.log("Admin login successful for:", profileData.name || email)
      router.push("/admin/dashboard")
    } catch (error: any) {
      setError("Unexpected error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#9B0000]">Admin Login</CardTitle>
        <CardDescription className="text-gray-600">
          Sign in to the admin panel to manage events and users.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
              {error.includes("admin privileges") && (
                <div className="mt-2 text-xs text-red-600">
                  <p>Need admin access? Contact your system administrator or:</p>
                  <Link href="/admin/setup" className="underline hover:no-underline">
                    Visit the Admin Setup page
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-[#9B0000] hover:bg-[#8A0000] text-white py-2" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Link href="/admin/setup" className="text-sm text-[#9B0000] hover:underline">
            Need admin access? Visit Admin Setup
          </Link>
          <br />
          <Link href="/" className="text-sm text-gray-600 hover:text-[#9B0000]">
            ← Back to Home
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
