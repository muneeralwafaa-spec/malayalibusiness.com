import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser / client-side client (uses anon key, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnon)

// ── Supabase row types ────────────────────────────────────────────────────────

export type ListingRow = {
  id:           string
  slug:         string
  name:         string
  name_ml:      string | null
  tagline:      string | null
  description:  string | null
  logo_url:     string | null
  cover_url:    string | null
  gallery_urls: string[]
  phone:        string | null
  whatsapp:     string | null
  email:        string | null
  website:      string | null
  emirate:      string
  area:         string | null
  address:      string | null
  plan:         string
  status:       string
  is_featured:  boolean
  is_verified:  boolean
  rating_avg:   number
  review_count: number
  views_count:  number
  languages:    string[]
  services:     string[]
  created_at:   string
  // joined
  category_slug:     string | null
  category_name:     string | null
  category_name_ml:  string | null
  category_icon:     string | null
  owner_name:        string | null
  owner_avatar:      string | null
}

export type CategoryRow = {
  id:         string
  slug:       string
  name:       string
  name_ml:    string
  icon:       string | null
  color:      string | null
  sort_order: number
  is_active:  boolean
}

export type ServiceRow = {
  id:             string
  listing_id:     string
  name:           string
  name_ml:        string | null
  description:    string | null
  description_ml: string | null
  price:          number | null
  price_unit:     string
  image_url:      string | null
  is_active:      boolean
  sort_order:     number
  created_at:     string
}

export type ReviewRow = {
  id:               string
  listing_id:       string
  reviewer_id:      string | null
  reviewer_name:    string
  reviewer_avatar:  string | null
  rating:           number
  body:             string | null
  is_verified:      boolean
  helpful_count:    number
  created_at:       string
}

export type TeamMemberRow = {
  id:          string
  listing_id:  string
  name:        string
  name_ml:     string | null
  role:        string | null
  role_ml:     string | null
  photo_url:   string | null
  bio:         string | null
  years_exp:   number | null
  sort_order:  number
  created_at:  string
}

export type ShopListingRow = {
  id:             string
  listing_id:     string
  name:           string
  name_ml:        string | null
  description:    string | null
  description_ml: string | null
  listing_type:   'product' | 'service' | 'appointment' | 'quote' | 'contact_only' | 'direct_service'
  price:          number
  original_price: number | null
  image_url:      string | null
  whatsapp:       string | null
  is_active:      boolean
  is_bestseller:  boolean
  stock_status:   'in_stock' | 'out_of_stock' | 'pre_order'
  sort_order:     number
  rating_avg:     number
  review_count:   number
  created_at:     string
}
