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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const workshopId = params.id

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*, profiles(name, email, student_id, phone_number, reason)") // Join with profiles for user details
      .eq("workshop_id", workshopId)
      .order("booked_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings for workshop:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Flatten the data for easier consumption
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      booked_at: booking.booked_at,
      user_name: booking.profiles?.name || "N/A",
      user_email: booking.email_address, // Use the email from the booking record
      student_id: booking.student_id,
      phone_number: booking.phone_number,
      reason: booking.reason,
    }))

    return NextResponse.json(formattedBookings)
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
