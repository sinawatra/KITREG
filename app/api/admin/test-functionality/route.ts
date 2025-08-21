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

  const testResults = {
    timestamp: new Date().toISOString(),
    admin_check: false,
    tests: [],
  }

  try {
    // Test 1: Check if user is admin
    const adminStatus = await isAdmin(supabase)
    testResults.admin_check = adminStatus

    if (!adminStatus) {
      testResults.tests.push({
        name: "Admin Authentication",
        success: false,
        error: "User is not an admin or not authenticated",
      })
      return NextResponse.json(testResults)
    }

    // Test 2: Events API - GET
    try {
      const { data: events, error: eventsError } = await supabase.from("workshops").select("*").limit(5)
      testResults.tests.push({
        name: "Events API - GET",
        success: !eventsError,
        data: events?.length || 0,
        error: eventsError?.message,
      })
    } catch (error: any) {
      testResults.tests.push({
        name: "Events API - GET",
        success: false,
        error: error.message,
      })
    }

    // Test 3: Users API
    try {
      const { data: users, error: usersError } = await supabase.from("profiles").select("*").limit(5)
      testResults.tests.push({
        name: "Users API",
        success: !usersError,
        data: users?.length || 0,
        error: usersError?.message,
      })
    } catch (error: any) {
      testResults.tests.push({
        name: "Users API",
        success: false,
        error: error.message,
      })
    }

    // Test 4: Bookings API
    try {
      const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("*").limit(5)
      testResults.tests.push({
        name: "Bookings API",
        success: !bookingsError,
        data: bookings?.length || 0,
        error: bookingsError?.message,
      })
    } catch (error: any) {
      testResults.tests.push({
        name: "Bookings API",
        success: false,
        error: error.message,
      })
    }

    // Test 5: Check if workshops table has proper structure
    try {
      const { data: sampleWorkshop } = await supabase.from("workshops").select("*").limit(1).single()
      const expectedFields = ["id", "title", "status", "image", "location", "date", "type", "created_at"]
      const actualFields = sampleWorkshop ? Object.keys(sampleWorkshop) : []
      const missingFields = expectedFields.filter((field) => !actualFields.includes(field))

      testResults.tests.push({
        name: "Workshops Table Structure",
        success: missingFields.length === 0,
        expected_fields: expectedFields,
        actual_fields: actualFields,
        missing_fields: missingFields,
      })
    } catch (error: any) {
      testResults.tests.push({
        name: "Workshops Table Structure",
        success: false,
        error: error.message,
      })
    }

    // Test 6: Check if profiles table has admin field
    try {
      const { data: sampleProfile } = await supabase.from("profiles").select("*").limit(1).single()
      const hasAdminField = sampleProfile && "is_admin" in sampleProfile

      testResults.tests.push({
        name: "Profiles Table Admin Field",
        success: hasAdminField,
        has_admin_field: hasAdminField,
        sample_profile_fields: sampleProfile ? Object.keys(sampleProfile) : [],
      })
    } catch (error: any) {
      testResults.tests.push({
        name: "Profiles Table Admin Field",
        success: false,
        error: error.message,
      })
    }

    // Test 7: Check RLS policies
    try {
      // Try to access workshops as admin
      const { data: workshopsRLS, error: workshopsRLSError } = await supabase.from("workshops").select("count")

      testResults.tests.push({
        name: "RLS Policies - Workshops",
        success: !workshopsRLSError,
        error: workshopsRLSError?.message,
      })
    } catch (error: any) {
      testResults.tests.push({
        name: "RLS Policies - Workshops",
        success: false,
        error: error.message,
      })
    }

    return NextResponse.json(testResults)
  } catch (error: any) {
    testResults.tests.push({
      name: "Overall Test",
      success: false,
      error: error.message,
    })
    return NextResponse.json(testResults)
  }
}
