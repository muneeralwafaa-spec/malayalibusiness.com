import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserProfile = {
  id:                string
  email:             string
  full_name:         string | null
  avatar_url:        string | null
  phone:             string | null
  is_admin:          boolean
  is_business_owner: boolean
  is_professional:   boolean
  is_media:          boolean
  is_verified:       boolean
  preferred_locale:  string
}

// All possible roles a user can have (multi-select at signup)
export const USER_ROLES = [
  { key: 'is_business_owner', label: 'Business Owner',   labelMl: 'ബിസിനസ് ഉടമ',     emoji: '🏢', desc: 'List and manage your business' },
  { key: 'is_professional',   label: 'Professional',     labelMl: 'പ്രൊഫഷണൽ',          emoji: '👨‍⚕️', desc: 'Doctor, Advocate, CA, Coach, Artist...' },
  { key: 'is_media',          label: 'Media / Press',    labelMl: 'മീഡിയ',              emoji: '📺', desc: 'TV, Radio, Digital media, Newspaper' },
] as const

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { user: data.user, session: data.session, error }
}

export async function signUp(params: {
  email:           string
  password:        string
  fullName:        string
  phone?:          string
  isBusiness?:     boolean
  isProfessional?: boolean
  isMedia?:        boolean
  businessName?:   string
}) {
  const { data, error } = await supabase.auth.signUp({
    email:    params.email,
    password: params.password,
    options: {
      data: {
        full_name:         params.fullName,
        phone:             params.phone ?? '',
        is_business_owner: params.isBusiness     ?? false,
        is_professional:   params.isProfessional ?? false,
        is_media:          params.isMedia        ?? false,
        business_name:     params.businessName   ?? '',
      },
    },
  })

  // Create profile row immediately after sign-up
  if (data.user && !error) {
    await supabase.from('profiles').upsert({
      id:                data.user.id,
      email:             params.email,
      full_name:         params.fullName        || null,
      phone:             params.phone           || null,
      is_business_owner: params.isBusiness     ?? false,
      is_professional:   params.isProfessional ?? false,
      is_media:          params.isMedia        ?? false,
    }, { onConflict: 'id', ignoreDuplicates: true })
  }

  return { user: data.user, session: data.session, error }
}

export async function signInWithGoogle(locale = 'en') {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/${locale}/auth/callback`,
    },
  })
  return { error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, phone, is_admin, is_business_owner, is_professional, is_media, is_verified, preferred_locale')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as UserProfile
}

// ── Owner's listings ──────────────────────────────────────────────────────────

export async function getMyListings(ownerId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      id, slug, name, name_ml, description, logo_url, cover_url,
      emirate, area, phone, whatsapp, website, email,
      plan, status, is_featured, is_verified,
      rating_avg, review_count, views_count,
      category_id, created_at,
      categories ( name, name_ml, slug )
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) { console.error('[getMyListings]', error.message); return [] }
  return data ?? []
}

// ── Admin helpers ─────────────────────────────────────────────────────────────

export async function adminGetListings(status?: string, limit = 50) {
  let q = supabase
    .from('listings')
    .select(`
      id, slug, name, plan, status, is_featured, is_verified,
      rating_avg, review_count, views_count, emirate, created_at,
      profiles ( full_name, email ),
      categories ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) { console.error('[adminGetListings]', error.message); return [] }
  return data ?? []
}

export async function adminUpdateListingStatus(id: string, status: 'active' | 'suspended' | 'pending') {
  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', id)
  return !error
}

export async function adminGetStats() {
  const [listingsRes, usersRes, reviewsRes] = await Promise.all([
    supabase.from('listings').select('id, status, plan', { count: 'exact' }),
    supabase.from('profiles').select('id, is_business_owner, created_at', { count: 'exact' }),
    supabase.from('reviews').select('id', { count: 'exact' }),
  ])

  const listings = listingsRes.data ?? []
  return {
    totalListings:   listingsRes.count ?? 0,
    activeListings:  listings.filter(l => l.status === 'active').length,
    pendingListings: listings.filter(l => l.status === 'pending').length,
    totalUsers:      usersRes.count ?? 0,
    totalReviews:    reviewsRes.count ?? 0,
    premiumListings: listings.filter(l => l.plan === 'premium' || l.plan === 'elite').length,
  }
}

export async function adminGetUsers(limit = 50) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, is_admin, is_business_owner, is_verified, created_at, preferred_locale')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('[adminGetUsers]', error.message); return [] }
  return data ?? []
}
