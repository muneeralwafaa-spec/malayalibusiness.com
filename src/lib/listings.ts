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
}

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

  let q = supabase
    .from('public_listings')
    .select('*', { count: 'exact' })

  // Text search
  if (query) {
    q = q.or(`name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`)
  }

  // Filters
  if (category) q = q.eq('category_slug', category)
  if (emirate)  q = q.eq('emirate', emirate)
  if (verified) q = q.eq('is_verified', true)
  if (featured) q = q.eq('is_featured', true)
  if (plan)     q = q.eq('plan', plan)

  // Sorting
  if (sort === 'rating')    q = q.order('rating_avg',   { ascending: false })
  else if (sort === 'reviews') q = q.order('review_count', { ascending: false })
  else if (sort === 'newest')  q = q.order('created_at',   { ascending: false })
  else {
    // relevance: featured first, then by rating
    q = q.order('is_featured', { ascending: false })
         .order('rating_avg',  { ascending: false })
  }

  // Pagination
  const from = (page - 1) * perPage
  const to   = from + perPage - 1
  q = q.range(from, to)

  const { data, error, count } = await q

  if (error) {
    console.error('[getListings]', error.message)
    return { listings: [], total: 0, page, perPage, pages: 0 }
  }

  const total = count ?? 0
  return {
    listings: (data ?? []) as ListingRow[],
    total,
    page,
    perPage,
    pages: Math.ceil(total / perPage),
  }
}

// ── Fetch single listing by slug ──────────────────────────────────────────────

export async function getListing(slug: string): Promise<ListingRow | null> {
  const { data, error } = await supabase
    .from('public_listings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('[getListing]', error.message)
    return null
  }
  return data as ListingRow
}

// ── Fetch featured listings (for homepage) ────────────────────────────────────

export async function getFeaturedListings(limit = 6): Promise<ListingRow[]> {
  const { data, error } = await supabase
    .from('public_listings')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('rating_avg',  { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[getFeaturedListings]', error.message)
    return []
  }
  return (data ?? []) as ListingRow[]
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
  const { data, error } = await supabase
    .from('public_listings')
    .select('category_slug')

  if (error) { console.error('[getCategoryCounts]', error.message); return {} }
  return (data ?? []).reduce((acc: Record<string, number>, row: { category_slug: string | null }) => {
    const slug = row.category_slug
    if (slug) acc[slug] = (acc[slug] || 0) + 1
    return acc
  }, {})
}

// ── Real emirate counts from DB ───────────────────────────────────────────────

export async function getEmirateCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('public_listings')
    .select('emirate')

  if (error) { console.error('[getEmirateCounts]', error.message); return {} }
  return (data ?? []).reduce((acc: Record<string, number>, row: { emirate: string | null }) => {
    const slug = row.emirate?.toLowerCase().replace(/\s+/g, '-')
    if (slug) acc[slug] = (acc[slug] || 0) + 1
    return acc
  }, {})
}

// ── Map Supabase row → frontend-friendly shape ────────────────────────────────
// Use this to adapt ListingRow to what UI components expect

export function adaptListing(row: ListingRow) {
  return {
    id:           row.id,
    name:         row.name,
    nameMl:       row.name_ml        ?? row.name,
    slug:         row.slug,
    category:     row.category_name  ?? '',
    categoryMl:   row.category_name_ml ?? row.category_name ?? '',
    categorySlug: row.category_slug  ?? '',
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
    tags:         row.services?.filter(s => !s.startsWith('source:')) ?? [],
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
