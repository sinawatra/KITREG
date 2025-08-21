import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/serverUtils"

// Hardcoded fallback data (same as before)
const fallbackWorkshops = [
  {
    id: 1,
    title: "Workshop: Tips to pass for Job Application",
    status: "Open Application",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2026-03-27",
    type: "workshop",
  },
  {
    id: 2,
    title: "Career Development Workshop",
    status: "Open Application",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-01-20",
    type: "workshop",
  },
  {
    id: 3,
    title: "Technical Skills Enhancement",
    status: "Open Application",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-01-25",
    type: "workshop",
  },
  {
    id: 4,
    title: "Leadership Training Program",
    status: "Open Application",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-02-01",
    type: "workshop",
  },
  {
    id: 5,
    title: "Innovation Workshop",
    status: "Open Application",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-02-05",
    type: "workshop",
  },
  {
    id: 6,
    title: "Entrepreneurship Bootcamp",
    status: "Open Application",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-02-10",
    type: "workshop",
  },
  {
    id: 7,
    title: "Digital Marketing Workshop",
    status: "Open Application",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-02-15",
    type: "workshop",
  },
  {
    id: 8,
    title: "Project Management Training",
    status: "Open Application",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-02-20",
    type: "workshop",
  },
  {
    id: 9,
    title: "AI & Machine Learning Workshop",
    status: "Closed",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-02-25",
    type: "workshop",
  },
  {
    id: 10,
    title: "Data Science Bootcamp",
    status: "Closed",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-03-01",
    type: "workshop",
  },
  {
    id: 11,
    title: "Web Development Workshop",
    status: "Closed",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-03-05",
    type: "workshop",
  },
  {
    id: 12,
    title: "Mobile App Development",
    status: "Done",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-03-10",
    type: "workshop",
  },
  {
    id: 13,
    title: "Advanced Research Methods",
    status: "Done",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-03-15",
    type: "workshop",
  },
  {
    id: 14,
    title: "Scientific Writing Workshop",
    status: "Done",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-03-20",
    type: "workshop",
  },
  {
    id: 15,
    title: "Presentation Skills Training",
    status: "Done",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-03-25",
    type: "workshop",
  },
  {
    id: 16,
    title: "Team Building Workshop",
    status: "Done",
    image: "/images/seeds-for-the-future-logo.png",
    location: "KIT",
    date: "2024-03-30",
    type: "workshop",
  },
]

export async function GET() {
  const supabase = await createServerSupabaseClient()

  console.log("=== WORKSHOPS API DEBUG ===")
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("Supabase Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  try {
    const { data: workshops, error } = await supabase.from("workshops").select("*").order("date", { ascending: true })

    console.log("Database query result:")
    console.log("- Error:", error)
    console.log("- Data count:", workshops?.length || 0)
    console.log("- First workshop:", workshops?.[0])

    if (error) {
      console.error("Error fetching workshops from Supabase:", error)
      // Fallback to hardcoded data if there's a database error
      console.log("Falling back to hardcoded data")
      return NextResponse.json(fallbackWorkshops)
    }

    console.log("Returning workshops from database")
    return NextResponse.json(workshops)
  } catch (e: any) {
    console.error("Unexpected error in /api/workshops:", e)
    // Fallback to hardcoded data for any unexpected errors
    console.log("Falling back to hardcoded data due to exception")
    return NextResponse.json(fallbackWorkshops)
  }
}
