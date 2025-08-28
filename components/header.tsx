"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, UserIcon, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Phase2Modal } from "./phase2-modal"


interface UserProfile {
  name: string | null
  is_admin: boolean | null
}

async function fetchUserProfile(user: User | null): Promise<UserProfile | null> {
  if (!user) return null

  try {
    console.log("Fetching profile for user:", user.id)

    // Use client-side Supabase instead of API route to avoid session issues
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("name, is_admin")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching profile:", error)

      // If profile doesn't exist, try to create it
      if (error.code === "PGRST116" || !profile) {
        console.log("Profile not found, creating new profile...")

        const defaultName =
          user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User"

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            name: defaultName,
            position: "",
            department: "",
            is_admin: false,
          })
          .select("name, is_admin")
          .single()

        if (insertError) {
          console.error("Error creating profile:", insertError)
          // Return default profile if creation fails
          return {
            name: defaultName,
            is_admin: false,
          }
        }

        console.log("New profile created:", newProfile)
        return newProfile
      }

      // Return default profile for other errors
      return {
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
        is_admin: false,
      }
    }

    console.log("Profile fetched successfully:", profile)
    return profile
  } catch (error) {
    console.error("Unexpected error fetching profile:", error)
    // Return default profile on any error
    return {
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
      is_admin: false,
    }
  }
}

export function Header() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  // Get current user session
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        console.log("Header: Got session", {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
        })

        setUser(session?.user || null)
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
      } finally {
        setIsLoadingAuth(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Header: Auth state changed:", event, {
        hasSession: !!session,
        userId: session?.user?.id,
      })

      setUser(session?.user || null)
      setIsLoadingAuth(false)

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        queryClient.invalidateQueries({ queryKey: ["headerUserProfile"] })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  // Fetch user profile only when we have a user
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery<UserProfile | null, Error>({
    queryKey: ["headerUserProfile", user?.id],
    queryFn: () => fetchUserProfile(user),
    enabled: !!user, // Only run query when user exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Retry twice on failure
    retryDelay: 1000, // Wait 1 second between retries
  })

  // Log profile loading state
  useEffect(() => {
    if (user) {
      console.log("Header: Profile loading state", {
        isLoadingProfile,
        userProfile,
        profileError: profileError?.message,
      })
    }
  }, [user, isLoadingProfile, userProfile, profileError])

  const handleLogout = async () => {
    try {
      // Even if there's no session, we should still clear local state
      const { error } = await supabase.auth.signOut()
      
      // Don't show alert for "Auth session missing" error as we're logging out anyway
      if (error && !error.message.includes("Auth session missing")) {
        console.error("Error logging out:", error)
        alert("Error logging out: " + error.message)
      } 
      
      // Always perform these actions regardless of error
      setUser(null)
      router.push("/")
      queryClient.clear() // Clear all queries on logout
      
    } catch (error) {
      console.error("Unexpected error during logout:", error)
    }
  }

  const isLoading = isLoadingAuth || (user && isLoadingProfile)
  const [phase2Modal, setPhase2Modal] = useState({ isOpen: false, feature: "" })

  const showPhase2Modal = (feature: string) => {
    setPhase2Modal({ isOpen: true, feature })
  }

  const closePhase2Modal = () => {
    setPhase2Modal({ isOpen: false, feature: "" })
  }

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image src="/images/kit-reg-logo.png" alt="KIT REG Logo" width={150} height={50} className="h-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#9B0000] hover:text-[#8A0000] font-medium">
              Workshop
            </Link>
            <button 
              onClick={() => showPhase2Modal("Job Offers")} 
              className="text-[#9B0000] hover:text-[#8A0000] font-medium cursor-pointer bg-transparent border-none"
            >
              Job Offers
            </button>
            <button 
              onClick={() => showPhase2Modal("Announcement")} 
              className="text-[#9B0000] hover:text-[#8A0000] font-medium cursor-pointer bg-transparent border-none"
            >
              Announcement
            </button>
            <button 
              onClick={() => showPhase2Modal("Activity")} 
              className="text-[#9B0000] hover:text-[#8A0000] font-medium cursor-pointer bg-transparent border-none"
            >
              Activity
            </button>
          </nav>

          {/* User Profile or Login Button */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-full"></div>
            ) : user ? (
              <>
                {/* Notification Bell */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    2
                  </span>
                </Button>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-gray-100"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/images/user-avatar.png" alt={userProfile?.name || "User"} />
                        <AvatarFallback>
                          <UserIcon className="h-5 w-5 text-gray-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium text-gray-800">
                          {userProfile?.name || user.email?.split("@")[0] || "User"}
                        </span>
                        <span className="text-xs text-gray-500">{userProfile?.is_admin ? "Admin" : "User"}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                      Profile Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/tickets")}>My Tickets</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-[#9B0000] hover:bg-[#8A0000] text-white px-6">Log In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Phase 2 Modal */}
      <Phase2Modal
        isOpen={phase2Modal.isOpen}
        onClose={closePhase2Modal}
        feature={phase2Modal.feature}
      />
    </header>
  )
}
