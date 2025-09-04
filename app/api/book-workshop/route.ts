import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/serverUtils"

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()

  try {
    // Use getUser() for secure authentication as recommended by Supabase
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError) {
      return NextResponse.json({ error: "Authentication failed: " + authError.message }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not authenticated. Please log in to book workshops." }, { status: 401 })
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Booking successful!", data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
