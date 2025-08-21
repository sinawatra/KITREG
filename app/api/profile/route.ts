import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Helper function to create a server-side Supabase client
function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// GET - Fetch user profile
export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  console.log("=== PROFILE API: Starting GET request ===")

  try {
    // Step 1: Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("Auth check:", {
      user_id: user?.id,
      user_email: user?.email,
      auth_error: authError?.message,
    })

    if (authError) {
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Authentication failed: " + authError.message }, { status: 401 })
    }

    if (!user) {
      console.error("No user found in session")
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Step 2: Try to fetch the profile
    console.log("Fetching profile for user:", user.id)

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id, name, position, department, is_admin")
      .eq("id", user.id)
      .maybeSingle()

    console.log("Profile fetch result:", {
      profile,
      error: fetchError?.message,
      error_code: fetchError?.code,
      error_details: fetchError?.details,
    })

    if (fetchError) {
      console.error("Error fetching profile:", fetchError)
      return NextResponse.json(
        {
          error: "Database error: " + fetchError.message,
          code: fetchError.code,
          details: fetchError.details,
        },
        { status: 500 },
      )
    }

    // Step 3: If profile doesn't exist, create one
    if (!profile) {
      console.log("Profile not found, creating new profile...")

      const defaultName =
        user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User"

      console.log("Creating profile with name:", defaultName)

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

      console.log("Profile creation result:", {
        newProfile,
        error: insertError?.message,
        error_code: insertError?.code,
      })

      if (insertError) {
        console.error("Error creating profile:", insertError)

        // Return a default profile if insert fails
        const fallbackProfile = {
          id: user.id,
          name: defaultName,
          position: "",
          department: "",
          is_admin: false,
        }

        console.log("Returning fallback profile:", fallbackProfile)
        return NextResponse.json(fallbackProfile)
      }

      console.log("New profile created successfully:", newProfile)
      return NextResponse.json(newProfile)
    }

    console.log("Existing profile found:", profile)
    return NextResponse.json(profile)
  } catch (error: any) {
    console.error("Unexpected error in profile API:", error)
    return NextResponse.json(
      {
        error: "Internal server error: " + error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

// PUT - Update user profile
export async function PUT(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  console.log("=== PROFILE API: Starting PUT request ===")

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const { name, position, department } = await request.json()

    // Basic validation
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    console.log("Updating profile for user:", user.id, { name, position, department })

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          name: name.trim(),
          position: position?.trim() || "",
          department: department?.trim() || "",
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Profile updated successfully:", data)
    return NextResponse.json({ message: "Profile updated successfully!", data }, { status: 200 })
  } catch (error: any) {
    console.error("Profile update API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
