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

async function isAdmin(supabase: ReturnType<typeof createClient>): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  return !error && profile?.is_admin === true
}

export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    // Get total bookings count
    const { count: totalBookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })

    if (bookingsError) {
      console.error("Error fetching bookings stats:", bookingsError)
      return NextResponse.json({ error: bookingsError.message }, { status: 500 })
    }

    return NextResponse.json({
      total: totalBookings || 0,
    })
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
