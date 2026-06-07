import { supabase } from './supabase'

export type ProfessionalCategory =
  | 'medical'
  | 'legal'
  | 'finance'
  | 'fitness'
  | 'entertainment'
  | 'influencer'
  | 'media'
  | 'education'
  | 'engineering'
  | 'technology'

export type Professional = {
  id: string
  slug: string
  name: string
  name_ml: string | null
  profession: string
  profession_ml: string | null
  category: ProfessionalCategory
  category_ml: string | null
  emirate: string
  emirate_ml: string | null
  photo_url: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  bio: string | null
  bio_ml: string | null
  rating_avg: number
  review_count: number
  verified: boolean
  featured: boolean
  followers: number | null
  tags: string[]
  status: 'active' | 'inactive'
  created_at: string
}

export const PROFESSIONAL_CATEGORIES: {
  slug: ProfessionalCategory
  name: string
  nameMl: string
  emoji: string
}[] = [
  { slug: 'medical',       name: 'Medical',              nameMl: 'വൈദ്യം',               emoji: '🩺' },
  { slug: 'legal',         name: 'Legal',                nameMl: 'നിയമം',                emoji: '⚖️' },
  { slug: 'finance',       name: 'Finance & Accounting', nameMl: 'ധനകാര്യം',             emoji: '💰' },
  { slug: 'fitness',       name: 'Fitness & Sports',     nameMl: 'ഫിറ്റ്നസ്',             emoji: '💪' },
  { slug: 'entertainment', name: 'Arts & Entertainment', nameMl: 'കല & വിനോദം',          emoji: '🎭' },
  { slug: 'influencer',    name: 'Influencers & Creators',nameMl: 'ഇൻഫ്ലുവൻസർ',          emoji: '🌟' },
  { slug: 'media',         name: 'Media Professionals',  nameMl: 'മീഡിയ',                emoji: '🎤' },
  { slug: 'education',     name: 'Education & Coaching', nameMl: 'വിദ്യാഭ്യാസം',         emoji: '🎓' },
  { slug: 'engineering',   name: 'Engineering & Design', nameMl: 'എഞ്ചിനീയറിംഗ്',        emoji: '🏗️' },
  { slug: 'technology',    name: 'Technology & IT',      nameMl: 'ടെക്നോളജി',             emoji: '💻' },
]

export type ProfessionalFilters = {
  category?: string
  emirate?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
}

export async function getProfessionals(filters: ProfessionalFilters = {}): Promise<Professional[]> {
  let q = supabase
    .from('professionals')
    .select('*')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('rating_avg', { ascending: false })
    .limit(filters.limit ?? 20)

  if (filters.category) q = q.eq('category', filters.category)
  if (filters.emirate)  q = q.eq('emirate', filters.emirate)
  if (filters.featured) q = q.eq('featured', true)
  if (filters.search)   q = q.or(`name.ilike.%${filters.search}%,profession.ilike.%${filters.search}%`)
  if (filters.offset)   q = q.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1)

  const { data, error } = await q
  if (error) { console.error('[getProfessionals]', error.message); return [] }
  return (data ?? []) as Professional[]
}

export async function getProfessional(slug: string): Promise<Professional | null> {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) { console.error('[getProfessional]', error.message); return null }
  return data as Professional
}
