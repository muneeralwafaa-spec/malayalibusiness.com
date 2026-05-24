import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type Classified = {
  id: number
  title: string
  title_ml: string | null
  description: string | null
  description_ml: string | null
  category: string
  category_ml: string | null
  subcategory: string | null
  price: string | null
  price_numeric: number | null
  negotiable: boolean
  type: 'sale' | 'rent' | 'wanted' | 'service'
  condition: 'new' | 'like-new' | 'good' | 'fair' | null
  emirate: string
  location: string | null
  location_ml: string | null
  images: string[]
  views: number
  featured: boolean
  urgent: boolean
  phone: string | null
  whatsapp: string | null
  seller_name: string | null
  seller_name_ml: string | null
  seller_avatar: string | null
  owner_id: string | null
  status: 'active' | 'sold' | 'expired' | 'pending'
  expires_at: string | null
  created_at: string
}

export type ClassifiedCategory = {
  slug: string
  name: string
  nameMl: string
  icon: string
}

export const classifiedCategories: ClassifiedCategory[] = [
  { slug: 'vehicles',    name: 'Vehicles',           nameMl: 'വാഹനങ്ങൾ',             icon: '🚗' },
  { slug: 'property',   name: 'Property',            nameMl: 'പ്രോപ്പർടി',            icon: '🏠' },
  { slug: 'electronics',name: 'Electronics',         nameMl: 'ഇലക്ട്രോണിക്സ്',        icon: '📱' },
  { slug: 'furniture',  name: 'Furniture',           nameMl: 'ഫർണിച്ചർ',             icon: '🛋️' },
  { slug: 'jobs',       name: 'Jobs & Services',     nameMl: 'ജോലി & സേവനം',         icon: '💼' },
  { slug: 'fashion',    name: 'Fashion',             nameMl: 'ഫാഷൻ',                icon: '👗' },
  { slug: 'food',       name: 'Food & Homemade',     nameMl: 'ഭക്ഷണം & ഹോം',        icon: '🍲' },
  { slug: 'kids',       name: 'Kids & Baby',         nameMl: 'കുട്ടികൾ & ബേബി',      icon: '👶' },
  { slug: 'books',      name: 'Books & Education',   nameMl: 'പുസ്തകം & വിദ്യ',      icon: '📚' },
  { slug: 'community',  name: 'Community Help',      nameMl: 'കമ്മ്യൂണിറ്റി',          icon: '🤝' },
]

// ── Query helpers ─────────────────────────────────────────────────────────────

const SELECT_COLS = `
  id, title, title_ml, description, description_ml,
  category, category_ml, subcategory, price, price_numeric,
  negotiable, type, condition, emirate, location, location_ml,
  images, views, featured, urgent, phone, whatsapp,
  seller_name, seller_name_ml, seller_avatar, owner_id,
  status, expires_at, created_at
`

export type ClassifiedFilters = {
  category?: string
  type?: string
  emirate?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
}

export async function getClassifieds(filters: ClassifiedFilters = {}): Promise<Classified[]> {
  let q = supabase
    .from('classifieds')
    .select(SELECT_COLS)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(filters.limit ?? 50)

  if (filters.category) q = q.eq('category', filters.category)
  if (filters.type)     q = q.eq('type', filters.type)
  if (filters.emirate)  q = q.eq('emirate', filters.emirate)
  if (filters.featured) q = q.eq('featured', true)
  if (filters.offset)   q = q.range(filters.offset, (filters.offset + (filters.limit ?? 50)) - 1)

  if (filters.search) {
    q = q.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await q
  if (error) { console.error('[getClassifieds]', error.message); return [] }
  return (data ?? []) as Classified[]
}

export async function getClassified(id: number): Promise<Classified | null> {
  const { data, error } = await supabase
    .from('classifieds')
    .select(SELECT_COLS)
    .eq('id', id)
    .single()

  if (error) { console.error('[getClassified]', error.message); return null }
  return data as Classified
}

export async function getFeaturedClassifieds(limit = 6): Promise<Classified[]> {
  const { data, error } = await supabase
    .from('classifieds')
    .select(SELECT_COLS)
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('[getFeaturedClassifieds]', error.message); return [] }
  return (data ?? []) as Classified[]
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('classifieds')
    .select('category')
    .eq('status', 'active')

  if (error) { console.error('[getClassifiedCategoryCounts]', error.message); return {} }
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] ?? 0) + 1
  }
  return counts
}

export async function incrementClassifiedViews(id: number): Promise<void> {
  // Try RPC first; ignore errors (RPC may not exist yet)
  await supabase.rpc('increment_classified_views', { classified_id: id }).maybeSingle()
}

export async function createClassified(
  data: Omit<Classified, 'id' | 'views' | 'created_at' | 'expires_at' | 'status'>
): Promise<Classified | null> {
  const { data: row, error } = await supabase
    .from('classifieds')
    .insert(data)
    .select(SELECT_COLS)
    .single()

  if (error) { console.error('[createClassified]', error.message); return null }
  return row as Classified
}

export async function getMyClassifieds(ownerId: string): Promise<Classified[]> {
  const { data, error } = await supabase
    .from('classifieds')
    .select(SELECT_COLS)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) { console.error('[getMyClassifieds]', error.message); return [] }
  return (data ?? []) as Classified[]
}
