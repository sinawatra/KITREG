import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/serverUtils"

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const { workshopId } = await request.json()

    if (!workshopId) {
      return NextResponse.json({ error: "Missing workshopId" }, { status: 400 })
    }

    // Delete the booking record for the current user and specific workshop
    const { error } = await supabase.from("bookings").delete().eq("user_id", user.id).eq("workshop_id", workshopId)

    if (error) {
      console.error("Supabase delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Booking cancelled successfully!" }, { status: 200 })
  } catch (error: any) {
    console.error("Cancel booking API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
