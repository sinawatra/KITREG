import { NextResponse } from "next/server"
import { createServerSupabaseClient, isAdmin } from "@/lib/serverUtils"

// GET a single workshop by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const id = params.id

  const { data: workshop, error } = await supabase.from("workshops").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching workshop:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!workshop) {
    return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
  }

  return NextResponse.json(workshop)
}

// UPDATE a workshop (including status or other fields)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const id = params.id
    const updates = await request.json() // Can contain any updatable fields

    const { data, error } = await supabase.from("workshops").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating workshop:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Workshop updated successfully!", data }, { status: 200 })
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE a workshop
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const id = params.id

    const { error } = await supabase.from("workshops").delete().eq("id", id)

    if (error) {
      console.error("Error deleting workshop:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Workshop deleted successfully!" }, { status: 200 })
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
