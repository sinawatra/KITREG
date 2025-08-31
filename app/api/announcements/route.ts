import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Use the existing supabase client
    // This assumes your supabaseClient.ts is properly configured for server-side operations

    // Fetch the announcements from the database
    const { data, error } = await supabase
      .from('announcement')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching announcements:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ announcements: data }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}
