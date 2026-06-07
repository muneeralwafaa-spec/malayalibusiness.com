import { supabase } from './supabase'

export type FavouriteType = 'listing' | 'professional' | 'media' | 'job' | 'event' | 'classified'

export interface Favourite {
  id:         string
  user_id:    string
  item_type:  FavouriteType
  item_id:    string
  created_at: string
}

// ── Toggle (add if not exists, remove if exists) ──────────────────────────────
export async function toggleFavourite(
  userId:   string,
  itemType: FavouriteType,
  itemId:   string,
): Promise<{ isFavourited: boolean; error: string | null }> {
  // Check if it already exists
  const { data: existing } = await supabase
    .from('favourites')
    .select('id')
    .eq('user_id',   userId)
    .eq('item_type', itemType)
    .eq('item_id',   itemId)
    .maybeSingle()

  if (existing) {
    // Remove
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('id', existing.id)
    return { isFavourited: false, error: error?.message ?? null }
  } else {
    // Add
    const { error } = await supabase
      .from('favourites')
      .insert({ user_id: userId, item_type: itemType, item_id: itemId })
    return { isFavourited: true, error: error?.message ?? null }
  }
}

// ── Check a single item ───────────────────────────────────────────────────────
export async function isFavourited(
  userId:   string,
  itemType: FavouriteType,
  itemId:   string,
): Promise<boolean> {
  const { data } = await supabase
    .from('favourites')
    .select('id')
    .eq('user_id',   userId)
    .eq('item_type', itemType)
    .eq('item_id',   itemId)
    .maybeSingle()
  return !!data
}

// ── Get all favourites for a user (optionally filtered by type) ───────────────
export async function getFavourites(
  userId:   string,
  itemType?: FavouriteType,
): Promise<Favourite[]> {
  let q = supabase
    .from('favourites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (itemType) q = q.eq('item_type', itemType)

  const { data, error } = await q
  if (error) { console.error('[getFavourites]', error.message); return [] }
  return (data ?? []) as Favourite[]
}

// ── Check multiple items at once (for a page of cards) ────────────────────────
export async function getFavouritedIds(
  userId:   string,
  itemType: FavouriteType,
  itemIds:  string[],
): Promise<Set<string>> {
  if (!itemIds.length) return new Set()
  const { data } = await supabase
    .from('favourites')
    .select('item_id')
    .eq('user_id',   userId)
    .eq('item_type', itemType)
    .in('item_id',   itemIds)
  return new Set((data ?? []).map(r => r.item_id))
}
