import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ListingType = 'product' | 'appointment' | 'quote' | 'direct_service' | 'contact_only'

export type MarketplaceListing = {
  id:                string
  listing_id:        string | null
  // Vendor info (embedded for marketplace use)
  vendor_slug:       string
  vendor_name:       string
  vendor_name_ml:    string | null
  vendor_logo_url:   string | null
  vendor_emirate:    string
  vendor_emirate_ml: string | null
  vendor_verified:   boolean
  vendor_whatsapp:   string | null
  vendor_phone:      string | null
  // Product info
  listing_type:      ListingType
  name:              string
  name_ml:           string | null
  description:       string | null
  description_ml:    string | null
  category:          string
  category_ml:       string | null
  price:             number
  original_price:    number | null
  currency:          string
  unit:              string | null
  unit_ml:           string | null
  image_url:         string | null
  images:            string[]
  rating_avg:        number
  review_count:      number
  is_active:         boolean
  is_featured:       boolean
  is_bestseller:     boolean
  duration:          string | null
  slots:             string[]
  tags:              string[]
  tags_ml:           string[]
  sort_order:        number
  created_at:        string
}

export type ShopFilters = {
  search?:     string
  category?:   string
  type?:       ListingType | 'all'
  emirate?:    string
  vendor?:     string
  featured?:   boolean
  limit?:      number
}

// ── LISTING_TYPE_META ─────────────────────────────────────────────────────────

export const LISTING_TYPE_META: Record<ListingType, {
  label: string; labelMl: string; color: string; icon: string;
  actionLabel: string; actionLabelMl: string
}> = {
  product:        { label: 'Product',          labelMl: 'ഉൽപ്പന്നം',          color: 'bg-blue-100 text-blue-700',    icon: '📦', actionLabel: 'Add to Cart',    actionLabelMl: 'കാർട്ടിൽ ചേർക്കൂ' },
  appointment:    { label: 'Book Appointment', labelMl: 'അപ്പോയ്ന്റ്മെന്റ്',   color: 'bg-green-100 text-green-700',  icon: '📅', actionLabel: 'Book Now',       actionLabelMl: 'ബുക്ക് ചെയ്യൂ' },
  quote:          { label: 'Get Quote',        labelMl: 'ക്വോട്ട് ലഭിക്കൂ',   color: 'bg-orange-100 text-orange-700', icon: '💬', actionLabel: 'Request Quote',  actionLabelMl: 'ക്വോട്ട് ചോദിക്കൂ' },
  direct_service: { label: 'Service',          labelMl: 'സർവ്വീസ്',            color: 'bg-purple-100 text-purple-700', icon: '⚡', actionLabel: 'Buy Now',        actionLabelMl: 'ഇപ്പോൾ വാങ്ങൂ' },
  contact_only:   { label: 'Enquire',          labelMl: 'അന്വേഷിക്കൂ',        color: 'bg-gray-100 text-gray-600',    icon: '📞', actionLabel: 'Contact Vendor', actionLabelMl: 'ബന്ധപ്പെടൂ' },
}

// ── Query: all marketplace listings ──────────────────────────────────────────

export async function getMarketplaceListings(filters: ShopFilters = {}): Promise<MarketplaceListing[]> {
  const { search, category, type, emirate, vendor, featured, limit = 200 } = filters

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase
    .from('shop_listings')
    .select('*')
    .eq('is_active', true)

  if (search) {
    q = q.or(`name.ilike.%${search}%,vendor_name.ilike.%${search}%,tags.cs.{${search}}`)
  }
  if (category && category !== 'All') q = q.eq('category', category)
  if (type && type !== 'all')         q = q.eq('listing_type', type)
  if (emirate && emirate !== 'All')   q = q.eq('vendor_emirate', emirate)
  if (vendor && vendor !== 'All')     q = q.eq('vendor_name', vendor)
  if (featured)                       q = q.eq('is_featured', true)

  q = q.order('is_featured', { ascending: false }).order('sort_order').limit(limit)

  const { data, error } = await q
  if (error) { console.error('[getMarketplaceListings]', error.message); return [] }
  return (data ?? []) as MarketplaceListing[]
}

// ── Query: single listing by id ───────────────────────────────────────────────

export async function getMarketplaceListing(id: string): Promise<MarketplaceListing | null> {
  const { data, error } = await supabase
    .from('shop_listings')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) { console.error('[getMarketplaceListing]', error.message); return null }
  return data as unknown as MarketplaceListing
}

// ── Query: related listings (same vendor or category) ────────────────────────

export async function getRelatedListings(current: MarketplaceListing, limit = 4): Promise<MarketplaceListing[]> {
  const { data, error } = await supabase
    .from('shop_listings')
    .select('*')
    .eq('is_active', true)
    .neq('id', current.id)
    .or(`vendor_slug.eq.${current.vendor_slug},category.eq.${current.category}`)
    .order('is_featured', { ascending: false })
    .limit(limit)

  if (error) { console.error('[getRelatedListings]', error.message); return [] }
  return (data ?? []) as MarketplaceListing[]
}
