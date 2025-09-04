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

async function isAdmin(supabase: ReturnType<typeof createClient>): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  return !error && profile?.is_admin === true
}

// PUT - Toggle admin status for a user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const userId = params.id
    const { is_admin } = await request.json()

    // Validate input
    if (typeof is_admin !== "boolean") {
      return NextResponse.json({ error: "is_admin must be a boolean" }, { status: 400 })
    }

    // Get current user to prevent self-demotion
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (currentUser?.id === userId && !is_admin) {
      return NextResponse.json({ error: "You cannot remove your own admin privileges" }, { status: 400 })
    }

    // Update the user's admin status
    const { data, error } = await supabase
      .from("profiles")
      .update({ is_admin })
      .eq("id", userId)
      .select("id, name, is_admin")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: `User ${is_admin ? "promoted to" : "demoted from"} admin successfully!`,
      data,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
