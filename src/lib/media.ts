import { supabase } from './supabase'

export type MediaType = 'tv' | 'radio' | 'digital' | 'newspaper' | 'magazine' | 'podcast'

export type MediaHouse = {
  id: string
  slug: string
  name: string
  name_ml: string | null
  media_type: MediaType
  description: string | null
  description_ml: string | null
  logo_url: string | null
  cover_url: string | null
  website: string | null
  youtube_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  emirate: string | null
  founded_year: number | null
  reach: string | null
  featured: boolean
  verified: boolean
  status: 'active' | 'inactive'
  created_at: string
}

export const MEDIA_TYPE_META: Record<MediaType, { label: string; labelMl: string; color: string; emoji: string }> = {
  tv:        { label: 'TV Channel',    labelMl: 'ടിവി ചാനൽ',      color: 'bg-red-100 text-red-700',    emoji: '📺' },
  radio:     { label: 'Radio',         labelMl: 'റേഡിയോ',          color: 'bg-blue-100 text-blue-700',  emoji: '📻' },
  digital:   { label: 'Digital Media', labelMl: 'ഡിജിറ്റൽ',        color: 'bg-purple-100 text-purple-700', emoji: '🎬' },
  newspaper: { label: 'Newspaper',     labelMl: 'പത്രം',            color: 'bg-gray-100 text-gray-700',  emoji: '📰' },
  magazine:  { label: 'Magazine',      labelMl: 'മാഗസിൻ',          color: 'bg-pink-100 text-pink-700',  emoji: '📖' },
  podcast:   { label: 'Podcast',       labelMl: 'പോഡ്കാസ്റ്റ്',    color: 'bg-orange-100 text-orange-700', emoji: '🎙️' },
}

export async function getMediaHouses(opts: { featured?: boolean; type?: MediaType; limit?: number } = {}): Promise<MediaHouse[]> {
  let q = supabase
    .from('media_houses')
    .select('*')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .limit(opts.limit ?? 20)

  if (opts.featured) q = q.eq('featured', true)
  if (opts.type)     q = q.eq('media_type', opts.type)

  const { data, error } = await q
  if (error) { console.error('[getMediaHouses]', error.message); return [] }
  return (data ?? []) as MediaHouse[]
}
