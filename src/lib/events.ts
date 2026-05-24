import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type EventCategory = 'cultural' | 'networking' | 'food' | 'business' | 'sports' | 'education'

export type MalayaliEvent = {
  id: string
  title: string
  title_ml: string | null
  description: string | null
  description_ml: string | null
  category: EventCategory
  event_date: string          // ISO date string
  event_time: string | null
  end_time: string | null
  emirate: string
  emirate_ml: string | null
  venue: string | null
  venue_ml: string | null
  price: number | null        // null = free
  capacity: number | null
  registered: number
  image_url: string | null
  organizer: string | null
  organizer_id: string | null
  tags: string[]
  featured: boolean
  status: 'active' | 'cancelled' | 'completed'
  created_at: string
}

export type EventRegistration = {
  id: number
  event_id: string
  user_id: string
  name: string | null
  email: string | null
  phone: string | null
  created_at: string
}

// ── Query helpers ─────────────────────────────────────────────────────────────

const SELECT_COLS = `
  id, title, title_ml, description, description_ml, category,
  event_date, event_time, end_time, emirate, emirate_ml,
  venue, venue_ml, price, capacity, registered, image_url,
  organizer, organizer_id, tags, featured, status, created_at
`

export type EventFilters = {
  category?: EventCategory
  emirate?: string
  featured?: boolean
  upcoming?: boolean
  search?: string
  limit?: number
}

export async function getEvents(filters: EventFilters = {}): Promise<MalayaliEvent[]> {
  let q = supabase
    .from('events')
    .select(SELECT_COLS)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('event_date', { ascending: true })
    .limit(filters.limit ?? 50)

  if (filters.category) q = q.eq('category', filters.category)
  if (filters.emirate)  q = q.eq('emirate', filters.emirate)
  if (filters.featured) q = q.eq('featured', true)

  if (filters.upcoming) {
    const today = new Date().toISOString().split('T')[0]
    q = q.gte('event_date', today)
  }

  if (filters.search) {
    q = q.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await q
  if (error) { console.error('[getEvents]', error.message); return [] }
  return (data ?? []) as MalayaliEvent[]
}

export async function getEvent(id: string): Promise<MalayaliEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .select(SELECT_COLS)
    .eq('id', id)
    .single()

  if (error) { console.error('[getEvent]', error.message); return null }
  return data as MalayaliEvent
}

export async function getFeaturedEvents(limit = 3): Promise<MalayaliEvent[]> {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('events')
    .select(SELECT_COLS)
    .eq('status', 'active')
    .eq('featured', true)
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(limit)

  if (error) { console.error('[getFeaturedEvents]', error.message); return [] }
  return (data ?? []) as MalayaliEvent[]
}

export async function registerForEvent(
  eventId: string,
  userId: string,
  details: { name?: string; email?: string; phone?: string }
): Promise<boolean> {
  const { error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      user_id: userId,
      name: details.name,
      email: details.email,
      phone: details.phone,
    })

  if (error) { console.error('[registerForEvent]', error.message); return false }

  // Increment registered count
  await supabase.rpc('increment_event_registered', { event_id: eventId }).maybeSingle()
  return true
}

export async function isRegisteredForEvent(eventId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle()

  return !!data
}

export async function getMyRegisteredEvents(userId: string): Promise<MalayaliEvent[]> {
  const { data, error } = await supabase
    .from('event_registrations')
    .select(`event_id, events(${SELECT_COLS})`)
    .eq('user_id', userId)

  if (error) { console.error('[getMyRegisteredEvents]', error.message); return [] }
  return ((data ?? []).map((r: any) => r.events).filter(Boolean)) as MalayaliEvent[]
}
