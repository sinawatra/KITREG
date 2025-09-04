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

    console.log("Book Workshop - Auth check:", {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message
    })

    if (authError) {
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Authentication failed: " + authError.message }, { status: 401 })
    }

    if (!user) {
      console.log("No authenticated user found")
      return NextResponse.json({ error: "User not authenticated. Please log in to book workshops." }, { status: 401 })
    }

    const { workshopId, name, studentId, email, phone, reason } = await request.json()

    // Basic validation
    if (!workshopId || !name || !studentId || !email || !phone || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Attempting to insert booking for user:", user.id, "workshop:", workshopId)
    
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

    console.log("Booking inserted successfully:", data)
    return NextResponse.json({ message: "Booking successful!", data }, { status: 200 })
  } catch (error: any) {
    console.error("Booking API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
