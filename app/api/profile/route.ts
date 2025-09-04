import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Helper function to create a server-side Supabase client
function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      async get(name: string) {
        return (await cookieStore).get(name)?.value
      },
      async set(name: string, value: string, options: any) {
        (await cookieStore).set({ name, value, ...options })
      },
      async remove(name: string, options: any) {
        (await cookieStore).set({ name, value: "", ...options })
      },
    },
  })
}

// GET - Fetch user profile
export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // Step 1: Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      return NextResponse.json({ error: "Authentication failed: " + authError.message }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Step 2: Try to fetch the profile

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id, name, position, department, is_admin")
      .eq("id", user.id)
      .maybeSingle()

    if (fetchError) {
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
        .select("id, name, position, department, is_admin")
        .single()

      if (insertError) {
        // Return a default profile if insert fails
        const fallbackProfile = {
          id: user.id,
          name: defaultName,
          position: "",
          department: "",
          is_admin: false,
        }

        return NextResponse.json(fallbackProfile)
      }

      return NextResponse.json(newProfile)
    }

    return NextResponse.json(profile)
  } catch (error: any) {
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Profile updated successfully!", data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }

  
}
