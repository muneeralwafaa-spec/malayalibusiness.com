import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Maps to DB enum values (lowercase_underscore)
const EMIRATE_MAP: Record<string, string> = {
  dubai: 'dubai',
  'abu dhabi': 'abu_dhabi', abudhabi: 'abu_dhabi',
  sharjah: 'sharjah', ajman: 'ajman',
  'ras al khaimah': 'ras_al_khaimah', rak: 'ras_al_khaimah',
  fujairah: 'fujairah',
  'umm al quwain': 'umm_al_quwain',
}

function detectEmirate(text: string): string | null {
  const lower = text.toLowerCase()
  for (const [key, val] of Object.entries(EMIRATE_MAP)) {
    if (lower.includes(key)) return val
  }
  return null
}

// Use Claude to extract search intent from conversation
async function extractIntent(conversation: string): Promise<{ searchTerm: string | null; emirate: string | null; isSpecificBusiness: boolean }> {
  const emirate = detectEmirate(conversation)

  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 80,
    system: `Extract what the user is searching for. Reply in this exact format:
TERM: <the business name or type, 1-5 words>
SPECIFIC: <yes if they named a specific business, no if they want a category>
If no business search, reply: TERM: none`,
    messages: [{ role: 'user', content: `Conversation: ${conversation.slice(-500)}` }],
  })

  const text = res.content[0].type === 'text' ? res.content[0].text.trim() : ''
  const termMatch = text.match(/TERM:\s*(.+)/i)
  const specificMatch = text.match(/SPECIFIC:\s*(yes|no)/i)
  const searchTerm = termMatch ? termMatch[1].trim().replace(/^"|"$/g, '') : null
  const isSpecificBusiness = specificMatch ? specificMatch[1].toLowerCase() === 'yes' : false

  return { searchTerm: searchTerm === 'none' ? null : searchTerm, emirate, isSpecificBusiness }
}

type Listing = { id: string; name: string; slug: string; tagline?: string; emirate: string; phone?: string; whatsapp?: string }

function merge(existing: Listing[], incoming: Listing[], limit = 8): Listing[] {
  const seen = new Set(existing.map(r => r.id))
  return [...existing, ...(incoming || []).filter(r => !seen.has(r.id))].slice(0, limit)
}

async function searchListings(searchTerm: string, emirate: string | null, isSpecificBusiness: boolean): Promise<Listing[]> {
  const keywords = searchTerm.toLowerCase().split(' ').filter(w => w.length > 1)
  const SELECT = 'id, name, slug, tagline, emirate, phone, whatsapp'
  let results: Listing[] = []

  const applyEmirate = (q: any) => emirate ? q.eq('emirate', emirate) : q

  // 1. Exact / name-first for specific business queries
  if (isSpecificBusiness) {
    const orName = keywords.map(k => `name.ilike.%${k}%`).join(',')
    const { data } = await supabase.from('listings').select(SELECT)
      .eq('status', 'active').or(orName)
      .order('is_featured', { ascending: false }).limit(5)
    results = merge(results, data as Listing[])
    if (results.length >= 3) return results
  }

  // 2. Category name match
  const { data: cats } = await supabase.from('categories').select('id')
    .or(keywords.map(k => `name.ilike.%${k}%`).join(','))
  if (cats && cats.length > 0) {
    const catIds = cats.map((c: { id: string }) => c.id)
    const { data } = await applyEmirate(
      supabase.from('listings').select(SELECT).eq('status', 'active')
        .in('category_id', catIds).order('is_featured', { ascending: false }).limit(6)
    )
    results = merge(results, data as Listing[])
  }

  // 3. Full-text across name, tagline, description, area, address, services array
  const orParts = keywords.flatMap(k => [
    `name.ilike.%${k}%`,
    `tagline.ilike.%${k}%`,
    `description.ilike.%${k}%`,
    `area.ilike.%${k}%`,
    `address.ilike.%${k}%`,
  ]).join(',')
  const { data: byContent } = await applyEmirate(
    supabase.from('listings').select(SELECT).eq('status', 'active')
      .or(orParts).order('is_featured', { ascending: false }).limit(6)
  )
  results = merge(results, byContent as Listing[])

  // 4. Search services table — find listings that offer this service
  if (results.length < 3) {
    const { data: svcRows } = await supabase.from('services').select('listing_id')
      .or(keywords.map(k => `name.ilike.%${k}%,description.ilike.%${k}%`).join(','))
      .limit(10)
    if (svcRows && svcRows.length > 0) {
      const ids = Array.from(new Set((svcRows as { listing_id: string }[]).map(s => s.listing_id)))
      const { data } = await applyEmirate(
        supabase.from('listings').select(SELECT).eq('status', 'active')
          .in('id', ids).order('is_featured', { ascending: false }).limit(5)
      )
      results = merge(results, data as Listing[])
    }
  }

  // 5. Retry everything without emirate filter if still empty
  if (results.length === 0 && emirate) {
    const orAll = keywords.flatMap(k => [
      `name.ilike.%${k}%`, `tagline.ilike.%${k}%`, `description.ilike.%${k}%`,
    ]).join(',')
    const { data } = await supabase.from('listings').select(SELECT)
      .eq('status', 'active').or(orAll)
      .order('is_featured', { ascending: false }).limit(5)
    results = merge(results, data as Listing[])
  }

  return results.slice(0, 6)
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    const fullConversation = [...(history || []).map((h: { content: string }) => h.content), message].join(' ')

    // Extract what user is searching for
    const { searchTerm, emirate, isSpecificBusiness } = await extractIntent(fullConversation)

    let listings: Listing[] = []
    if (searchTerm) {
      listings = await searchListings(searchTerm, emirate, isSpecificBusiness)
    }

    let listingsContext = ''
    if (listings.length > 0) {
      listingsContext = `\n\nLISTINGS FOUND for "${searchTerm}"${emirate ? ' in ' + emirate : ''}:\n` +
        listings.map(l =>
          `• [${l.name}](https://www.malayalibusiness.com/company/${l.slug}) — ${l.emirate}${l.tagline ? ' | ' + l.tagline : ''}`
        ).join('\n') +
        `\n\nShow these results with clickable links. Be brief and direct. Do not suggest searching the directory — you already have the results.`
    } else if (searchTerm) {
      listingsContext = `\n\nNo listings found for "${searchTerm}"${emirate ? ' in ' + emirate : ''}. Tell the user honestly, invite them to list their business at [Malayalibusiness.com](https://www.malayalibusiness.com/dashboard), and offer to search a different category or emirate.`
    }

    const systemPrompt = `You are Sallu, the AI assistant for Malayalibusiness.com — the World's First AI-Powered Malayali Marketplace in the UAE.

- When listings are provided, show them with clickable links immediately — do not redirect users to search manually
- Keep responses short and direct
- Understand Manglish (Malayalam + English mix) naturally
- No excessive emojis
${listingsContext}`

    const messages = [
      ...(history || []),
      { role: 'user' as const, content: message }
    ]

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages,
    })

    const reply = response.content[0]
    if (reply.type !== 'text') return NextResponse.json({ error: 'Unexpected response' }, { status: 500 })

    return NextResponse.json({ reply: reply.text, listingsFound: listings.length })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}
