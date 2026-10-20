import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  // Get distinct emirate values actually stored in DB
  const { data } = await supabase
    .from('listings')
    .select('emirate')
    .limit(20)

  const seen: Record<string, boolean> = {}
  const unique = (data || []).map((l: { emirate: string }) => l.emirate).filter((e: string) => { if (seen[e]) return false; seen[e] = true; return true })

  return NextResponse.json({ emirateValues: unique })
}
