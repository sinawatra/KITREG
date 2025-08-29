import { NextResponse } from "next/server"
import { createServerSupabaseClient, isAdmin } from "@/lib/serverUtils"

// GET bookings for a specific workshop
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    // Get workshop ID from params
    const workshopId = params.id

    // Fetch bookings for the specified workshop
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("workshop_id", workshopId)
      .order("booked_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings for workshop:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the bookings data for the response
    const formattedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      booked_at: booking.booked_at,
      user_name: booking.first_name || booking.username || "Anonymous",
      user_email: booking.email_address || booking.user_email || "No email provided",
      student_id: booking.student_id || "N/A",
      phone_number: booking.phone_number || "N/A",
      reason: booking.reason || "No reason provided",
    }))

    return NextResponse.json(formattedBookings)
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
