"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface Profile {
  id: string
  name: string
  position: string
  department: string
  is_admin: boolean
}

async function fetchProfile(): Promise<Profile> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  console.log("Fetching profile for user:", user.id)

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, position, department, is_admin")
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    console.error("Error fetching profile:", error)
    throw new Error(error.message)
  }

  // If profile doesn't exist, create one
  if (!profile) {
    console.log("Profile not found, creating new profile...")

    const defaultName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User"

    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name: defaultName,
        position: "",
        department: "",
        is_admin: false,
      })
      .select("id, name, position, department, is_admin")
      .single()

    if (insertError) {
      console.error("Error creating profile:", insertError)
      throw new Error(insertError.message)
    }

    console.log("New profile created:", newProfile)
    return newProfile
  }

  console.log("Profile found:", profile)
  return profile
}

async function updateProfile(profileData: { name: string; position: string; department: string }): Promise<Profile> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  console.log("Updating profile for user:", user.id, profileData)

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        name: profileData.name.trim(),
        position: profileData.position?.trim() || "",
        department: profileData.department?.trim() || "",
        // Don't update is_admin field from client
      },
      {
        onConflict: "id",
        ignoreDuplicates: false,
      },
    )
    .select("id, name, position, department, is_admin")
    .single()

  if (error) {
    console.error("Error updating profile:", error)
    throw new Error(error.message)
  }

  console.log("Profile updated successfully:", data)
  return data
}

export default function ProfileDetailsPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
  })

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery<Profile, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchProfile,
    retry: 2,
    retryDelay: 1000,
  })

  const updateProfileMutation = useMutation<Profile, Error, { name: string; position: string; department: string }>({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
      queryClient.invalidateQueries({ queryKey: ["headerUserProfile"] }) // Also invalidate header profile
      alert("Profile updated successfully!")
    },
    onError: (err) => {
      alert("Error updating profile: " + err.message)
    },
  })

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        position: profile.position || "",
        department: profile.department || "",
      })
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Name is required!")
      return
    }

    updateProfileMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#9B0000]" />
        <p className="ml-2 text-gray-700">Loading profile...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading profile: {error?.message}</p>
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ["userProfile"] })}
              className="mt-4 bg-[#9B0000] hover:bg-[#8A0000] text-white"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#9B0000]">Profile Details</CardTitle>
        <CardDescription className="text-gray-600">
          Manage your personal information and account settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer, Student"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="e.g., Computer Science, Engineering"
            />
          </div>

          {profile?.is_admin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">Admin Account</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">You have administrative privileges on this platform.</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (profile) {
                  setFormData({
                    name: profile.name || "",
                    position: profile.position || "",
                    department: profile.department || "",
                  })
                }
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-[#9B0000] hover:bg-[#8A0000] text-white"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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
