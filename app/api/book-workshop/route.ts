import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/serverUtils"

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const { workshopId, name, studentId, email, phone, reason } = await request.json()

    // Basic validation
    if (!workshopId || !name || !studentId || !email || !phone || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        workshop_id: workshopId,
        first_name: name,
        student_id: studentId,
        email_address: email,
        phone_number: phone,
        reason: reason,
      })
      .select()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Booking successful!", data }, { status: 200 })
  } catch (error: any) {
    console.error("Booking API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
