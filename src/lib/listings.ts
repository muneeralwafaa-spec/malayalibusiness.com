import { supabase } from './supabase'
import type { ListingRow, CategoryRow, ServiceRow, ReviewRow, TeamMemberRow, ShopListingRow } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ListingFilters = {
  query?:    string
  category?: string
  emirate?:  string
  verified?: boolean
  featured?: boolean
  plan?:     string
  sort?:     'relevance' | 'rating' | 'reviews' | 'newest'
  page?:     number
  perPage?:  number
}

export type ListingsResult = {
  listings: ListingRow[]
  total:    number
  page:     number
  perPage:  number
  pages:    number
  error?:   string
}

// ── Shared select fields (query listings table directly — bypasses view perms) ─

const LISTING_SELECT = `
  id, slug, name, name_ml, tagline, tagline_ml,
  logo_url, cover_url, emirate, area, address,
  phone, whatsapp, email, website, description,
  plan, is_featured, is_verified,
  rating_avg, review_count, views_count, created_at,
  gallery_urls, services, languages,
  category_id
` as const

// ── Fetch listings (paginated + filtered) ─────────────────────────────────────

export async function getListings(filters: ListingFilters = {}): Promise<ListingsResult> {
  const {
    query    = '',
    category = '',
    emirate  = '',
    verified,
    featured,
    plan,
    sort     = 'relevance',
    page     = 1,
    perPage  = 9,
  } = filters

  // Resolve category slug → ID (one cheap lookup)
  let categoryId: string | null = null
  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()
    if (!cat) return { listings: [], total: 0, page, perPage, pages: 0 }
    categoryId = cat.id as string
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase
    .from('listings')
    .select(LISTING_SELECT, { count: 'exact' })
    .eq('status', 'active')

  if (query)      q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  if (categoryId) q = q.eq('category_id', categoryId)
  if (emirate)    q = q.eq('emirate', emirate)
  if (verified)   q = q.eq('is_verified', true)
  if (featured)   q = q.eq('is_featured', true)
  if (plan)       q = q.eq('plan', plan)

  if (sort === 'rating')       q = q.order('rating_avg',   { ascending: false })
  else if (sort === 'reviews') q = q.order('review_count', { ascending: false })
  else if (sort === 'newest')  q = q.order('created_at',   { ascending: false })
  else q = q.order('is_featured', { ascending: false }).order('rating_avg', { ascending: false })

  const from = (page - 1) * perPage
  q = q.range(from, from + perPage - 1)

  const { data, error, count } = await q
  if (error) { console.error('[getListings]', error.message); return { listings: [], total: 0, page, perPage, pages: 0, error: error.message } }

  const total = count ?? 0
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listings: (data ?? []) as any[],
    total,
    page,
    perPage,
    pages: Math.ceil(total / perPage),
  }
}

// ── Fetch single listing by slug ──────────────────────────────────────────────

export async function getListing(slug: string): Promise<ListingRow | null> {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) { console.error('[getListing]', error.message); return null }
  return data as unknown as ListingRow
}

// ── Fetch featured listings (for homepage) ────────────────────────────────────

export async function getFeaturedListings(limit = 6): Promise<ListingRow[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('rating_avg',  { ascending: false })
    .limit(limit)

  if (error) { console.error('[getFeaturedListings]', error.message); return [] }
  return (data ?? []) as unknown as ListingRow[]
}

// ── Fetch all categories ──────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('[getCategories]', error.message)
    return []
  }
  return (data ?? []) as CategoryRow[]
}

// ── Increment view count ──────────────────────────────────────────────────────

export async function incrementViews(slug: string) {
  await supabase.rpc('increment_listing_views', { listing_slug: slug })
}

// ── Fetch services for a listing ─────────────────────────────────────────────

export async function getServices(listingId: string): Promise<ServiceRow[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('listing_id', listingId)
    .eq('is_active', true)
    .order('sort_order')

  if (error) { console.error('[getServices]', error.message); return [] }
  return (data ?? []) as ServiceRow[]
}

// ── Fetch reviews for a listing ───────────────────────────────────────────────

export async function getReviews(listingId: string): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false })

  if (error) { console.error('[getReviews]', error.message); return [] }
  return (data ?? []) as ReviewRow[]
}

// ── Submit a review ───────────────────────────────────────────────────────────

export async function submitReview(params: {
  listingId:     string
  reviewerName:  string
  rating:        number
  body:          string
}): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('reviews').insert({
    listing_id:    params.listingId,
    reviewer_name: params.reviewerName,
    rating:        params.rating,
    body:          params.body,
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// ── Vote a review helpful ─────────────────────────────────────────────────────

export async function voteHelpful(reviewId: string, voterFp: string): Promise<boolean> {
  const { error } = await supabase
    .from('review_helpful_votes')
    .insert({ review_id: reviewId, voter_fp: voterFp })
  return !error
}

// ── Fetch team members for a listing ─────────────────────────────────────────

export async function getTeamMembers(listingId: string): Promise<TeamMemberRow[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('listing_id', listingId)
    .order('sort_order')

  if (error) { console.error('[getTeamMembers]', error.message); return [] }
  return (data ?? []) as TeamMemberRow[]
}

// ── Fetch shop listings for a listing ────────────────────────────────────────

export async function getShopListings(listingId: string): Promise<ShopListingRow[]> {
  const { data, error } = await supabase
    .from('shop_listings')
    .select('*')
    .eq('listing_id', listingId)
    .eq('is_active', true)
    .order('sort_order')

  if (error) { console.error('[getShopListings]', error.message); return [] }
  return (data ?? []) as ShopListingRow[]
}

// ── Real category counts from DB ─────────────────────────────────────────────

export async function getCategoryCounts(): Promise<Record<string, number>> {
  // Count listings per category by joining category_id with categories table
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .select('id, slug')

  if (catErr) { console.error('[getCategoryCounts cats]', catErr.message); return {} }

  const { data, error } = await supabase
    .from('listings')
    .select('category_id')
    .eq('status', 'active')

  if (error) { console.error('[getCategoryCounts]', error.message); return {} }

  // Build id→slug map
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idToSlug: Record<string, string> = (cats ?? []).reduce((acc: Record<string, string>, c: any) => {
    acc[c.id] = c.slug; return acc
  }, {})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).reduce((acc: Record<string, number>, row: any) => {
    const slug = idToSlug[row.category_id]
    if (slug) acc[slug] = (acc[slug] || 0) + 1
    return acc
  }, {})
}

// ── Real emirate counts from DB ───────────────────────────────────────────────

export async function getEmirateCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('listings')
    .select('emirate')
    .eq('status', 'active')

  if (error) { console.error('[getEmirateCounts]', error.message); return {} }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).reduce((acc: Record<string, number>, row: any) => {
    const slug = row.emirate?.toLowerCase()
    if (slug) acc[slug] = (acc[slug] || 0) + 1
    return acc
  }, {})
}

// ── Map Supabase row → frontend-friendly shape ────────────────────────────────
// Use this to adapt ListingRow to what UI components expect

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptListing(row: ListingRow | any, categoryMap?: Record<string, { name: string; name_ml: string; slug: string }>) {
  // Support both flat (public_listings view) and nested (direct table query) shapes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cat = categoryMap && row.category_id
    ? categoryMap[row.category_id]
    : ((row as any).categories as { slug?: string; name?: string; name_ml?: string } | null)
  return {
    id:           row.id,
    name:         row.name,
    nameMl:       row.name_ml        ?? row.name,
    slug:         row.slug,
    category:     cat?.name          ?? row.category_name  ?? '',
    categoryMl:   cat?.name_ml       ?? row.category_name_ml ?? cat?.name ?? '',
    categorySlug: cat?.slug          ?? row.category_slug  ?? '',
    location:     [row.area, row.emirate].filter(Boolean).join(', '),
    locationMl:   [row.area, row.emirate].filter(Boolean).join(', '),
    emirate:      row.emirate,
    emirateSlug:  row.emirate,
    address:      row.address        ?? '',
    phone:        row.phone          ?? '',
    whatsapp:     row.whatsapp       ?? row.phone ?? '',
    website:      row.website        ?? '',
    email:        row.email          ?? '',
    rating:       Number(row.rating_avg)  || 0,
    reviewCount:  row.review_count   || 0,
    priceRange:   row.plan === 'elite' ? 4 : row.plan === 'premium' ? 3 : row.plan === 'basic' ? 2 : 1,
    image:        row.cover_url      ?? row.logo_url ?? '',
    logo:         row.logo_url       ?? '',
    photos:       row.gallery_urls   ?? [],
    description:  row.description    ?? '',
    descriptionMl:row.description    ?? '',
    tags:         row.services?.filter((s: string) => !s.startsWith('source:')) ?? [],
    tagsMl:       [],
    verified:     row.is_verified,
    featured:     row.is_featured,
    premium:      row.plan === 'premium' || row.plan === 'elite',
    open:         true,
    hours:        '',
    established:  undefined,
    employees:    undefined,
    languages:    row.languages ?? ['English', 'Malayalam'],
  }
}
