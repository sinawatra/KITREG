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
    // Fetch users from profiles table with auth user data
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(`
        id, 
        name, 
        position, 
        department, 
        is_admin,
        updated_at
      `)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching profiles:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // For each profile, try to get email from auth metadata or use a placeholder
    const usersWithData = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      position: profile.position,
      department: profile.department,
      is_admin: profile.is_admin,
      email: `user-${profile.id.slice(0, 8)}@kit.edu.kh`, // Placeholder email format
      created_at: profile.updated_at,
    }))

    return NextResponse.json(usersWithData)
  } catch (error: any) {
    console.error("Unexpected error fetching users:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
