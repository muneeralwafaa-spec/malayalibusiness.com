/**
 * MalayaliBusiness.com — WordPress → Supabase Migration Script
 * ─────────────────────────────────────────────────────────────
 * Usage:
 *   node migrate.mjs               # full run
 *   node migrate.mjs --dry-run     # scrape & transform only, no DB writes
 *   node migrate.mjs --test-scrape # scrape first 5 listings and print them
 *
 * Prerequisites:
 *   npm install   (inside scripts/ directory)
 *   Copy .env.migration.example → .env.migration and fill in your values
 *
 * Outputs (written to scripts/ directory):
 *   migration-report.json   – all successfully imported listings
 *   error-log.json          – all failures with reasons
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// ─── Load .env.migration (takes priority over .env) ──────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath   = path.join(__dirname, '.env.migration')
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
  console.log('✅  Loaded .env.migration')
} else {
  console.warn('⚠️   .env.migration not found — falling back to environment variables')
}

// ─── CLI flags ────────────────────────────────────────────────────────────────
const DRY_RUN     = process.argv.includes('--dry-run')
const TEST_SCRAPE = process.argv.includes('--test-scrape')
const IMPORT_LIMIT = parseInt(process.env.IMPORT_LIMIT ?? '0', 10) || null

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL             = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY= process.env.SUPABASE_SERVICE_ROLE_KEY
const SOURCE_URL               = (process.env.SOURCE_URL ?? 'https://www.malayalibusiness.com').replace(/\/$/, '')
const MIGRATION_USER_EMAIL     = process.env.MIGRATION_USER_EMAIL ?? 'migration-bot@malayalibusiness.com'
const MIGRATION_USER_NAME      = process.env.MIGRATION_USER_NAME  ?? 'Migration Bot'
const REQUEST_DELAY_MS         = parseInt(process.env.REQUEST_DELAY_MS ?? '1000', 10)
const BATCH_SIZE               = 10

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.migration')
  process.exit(1)
}

// ─── Supabase client (service role bypasses RLS) ──────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── HTTP client ──────────────────────────────────────────────────────────────
const http = axios.create({
  timeout: 15_000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; MigrationBot/1.0; +https://malayalibusiness.com)',
    'Accept': 'text/html,application/json,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
  },
})

// ─── Gambling / spam keywords to block ───────────────────────────────────────
const BLOCKED_KEYWORDS = [
  'casino', 'gambling', 'poker', 'slot', 'slots', 'betting', 'bet',
  'jokery', 'megablock', 'roulette', 'blackjack', 'baccarat', 'jackpot',
  'sportsbet', 'wager', 'wagering', 'online casino', 'live casino',
  'crypto casino', 'bitcoin casino', 'spin', 'free spins',
  'lottery', 'lotto', 'sweepstakes',
]

// ─── Emirates mapping ─────────────────────────────────────────────────────────
// Maps freetext → Supabase enum value
const EMIRATE_MAP = [
  { patterns: ['dubai', 'dxb'],                             value: 'dubai' },
  { patterns: ['abu dhabi', 'abudhabi', 'abu-dhabi', 'ad'], value: 'abu_dhabi' },
  { patterns: ['sharjah', 'shj'],                           value: 'sharjah' },
  { patterns: ['ajman'],                                    value: 'ajman' },
  { patterns: ['ras al khaimah', 'ras-al-khaimah', 'rak'],  value: 'ras_al_khaimah' },
  { patterns: ['fujairah', 'fuj'],                          value: 'fujairah' },
  { patterns: ['umm al quwain', 'uaq'],                     value: 'umm_al_quwain' },
]

// ─── Category keyword mapping ─────────────────────────────────────────────────
// Maps WordPress category names / descriptions → Supabase category slug
const CATEGORY_KEYWORD_MAP = [
  { keywords: ['restaurant', 'food', 'catering', 'cafe', 'kitchen', 'biryani', 'bakery', 'dining'],    slug: 'restaurants-food' },
  { keywords: ['grocery', 'supermarket', 'hypermarket', 'provisions', 'store'],                         slug: 'grocery-supermarket' },
  { keywords: ['real estate', 'property', 'realty', 'apartment', 'villa', 'rent', 'lease'],             slug: 'real-estate' },
  { keywords: ['health', 'medical', 'clinic', 'doctor', 'hospital', 'pharmacy', 'dental', 'ayurveda'], slug: 'healthcare-medical' },
  { keywords: ['education', 'training', 'tuition', 'school', 'college', 'academy', 'coaching'],         slug: 'education-training' },
  { keywords: ['beauty', 'salon', 'spa', 'wellness', 'parlour', 'threading', 'bridal'],                 slug: 'beauty-wellness' },
  { keywords: ['technology', 'tech', 'it', 'software', 'web', 'app', 'digital', 'computer'],           slug: 'technology-it' },
  { keywords: ['construction', 'interior', 'renovation', 'contracting', 'fit-out', 'design'],           slug: 'construction-interiors' },
  { keywords: ['retail', 'fashion', 'clothing', 'garment', 'boutique', 'jewellery', 'shop'],            slug: 'retail-fashion' },
  { keywords: ['legal', 'law', 'finance', 'accounting', 'tax', 'audit', 'insurance', 'investment'],     slug: 'legal-finance' },
  { keywords: ['travel', 'tourism', 'tour', 'holiday', 'visa', 'ticket', 'hotel'],                      slug: 'travel-tourism' },
  { keywords: ['automotive', 'car', 'vehicle', 'garage', 'auto', 'tyres', 'driving'],                   slug: 'automotive' },
]

// ─── Report accumulators ──────────────────────────────────────────────────────
const report = {
  startedAt: new Date().toISOString(),
  sourceUrl: SOURCE_URL,
  mode: DRY_RUN ? 'dry-run' : 'live',
  totalScraped: 0,
  totalFiltered: 0,
  totalInserted: 0,
  totalFailed: 0,
  listings: [],
}
const errors = []

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

// Ensure slugs are unique within this run
const usedSlugs = new Set()
function uniqueSlug(base) {
  let slug = slugify(base)
  if (!slug) slug = 'listing'
  let candidate = slug
  let i = 2
  while (usedSlugs.has(candidate)) {
    candidate = `${slug}-${i++}`
  }
  usedSlugs.add(candidate)
  return candidate
}

function sanitizePhone(raw) {
  if (!raw) return null
  const digits = raw.replace(/[^\d+]/g, '')
  if (digits.length < 7) return null
  // Normalise UAE numbers
  if (digits.startsWith('00971')) return '+' + digits.slice(2)
  if (digits.startsWith('971') && !digits.startsWith('+')) return '+' + digits
  if (digits.startsWith('05') || digits.startsWith('04')) return '+971' + digits.slice(1)
  return digits
}

function sanitizeUrl(raw) {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.includes('.')) return 'https://' + trimmed
  return null
}

function sanitizeEmail(raw) {
  if (!raw) return null
  const trimmed = raw.trim().toLowerCase()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return trimmed
  return null
}

/**
 * Returns true if any blocked keyword appears in the given text.
 */
function isBlocked(text) {
  if (!text) return false
  const lower = text.toLowerCase()
  return BLOCKED_KEYWORDS.some(kw => lower.includes(kw))
}

/**
 * Detect UAE emirate from any freetext string.
 */
function detectEmirate(text) {
  if (!text) return 'dubai' // safe default
  const lower = text.toLowerCase()
  for (const entry of EMIRATE_MAP) {
    if (entry.patterns.some(p => lower.includes(p))) return entry.value
  }
  return 'dubai'
}

/**
 * Map a WP category name / text to our Supabase category slug.
 */
function detectCategorySlug(text) {
  if (!text) return null
  const lower = text.toLowerCase()
  for (const entry of CATEGORY_KEYWORD_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) return entry.slug
  }
  return null
}

/**
 * Strip HTML tags and decode entities from a string.
 */
function stripHtml(html) {
  if (!html) return ''
  return cheerio.load(html).text().trim()
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORDPRESS REST API SCRAPER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Discover all available custom post types via the WP REST API.
 * Returns array of { name, rest_base } for post types that look like listings.
 */
async function discoverWpPostTypes() {
  try {
    const res = await http.get(`${SOURCE_URL}/wp-json/wp/v2/types`)
    const types = Object.values(res.data)
    // Filter to post types likely to be business listings
    const listingTypes = types.filter(t => {
      const name = (t.slug ?? t.name ?? '').toLowerCase()
      return (
        name.includes('listing') ||
        name.includes('business') ||
        name.includes('place') ||
        name.includes('directory') ||
        name.includes('vendor') ||
        name === 'gd_place' ||
        name === 'wpbdp_listing' ||
        name === 'post'
      )
    })
    return listingTypes
  } catch {
    return []
  }
}

/**
 * Fetch all listings from a WP REST API endpoint (paginated).
 */
async function fetchWpRestListings(endpoint) {
  const allItems = []
  let page = 1
  let totalPages = 1

  console.log(`  🔗  REST API: ${endpoint}`)

  while (page <= totalPages) {
    try {
      const res = await http.get(endpoint, {
        params: { per_page: 100, page, _embed: true },
      })

      // WP returns total pages in header
      totalPages = parseInt(res.headers['x-wp-totalpages'] ?? '1', 10)
      const items = Array.isArray(res.data) ? res.data : []
      allItems.push(...items)

      console.log(`     Page ${page}/${totalPages} — ${items.length} items`)
      page++

      if (page <= totalPages) await sleep(REQUEST_DELAY_MS)
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 404) break
      console.warn(`     ⚠️  Page ${page} error: ${err.message}`)
      break
    }
  }

  return allItems
}

/**
 * Transform a WP REST API item into our raw scraped format.
 */
function transformWpItem(item) {
  const embedded = item._embedded ?? {}
  const terms    = embedded['wp:term']?.flat() ?? []
  const media    = embedded['wp:featuredmedia']?.[0] ?? null

  // Category detection from WP terms
  const catTerm   = terms.find(t => t.taxonomy === 'category' || t.taxonomy === 'gd_placecategory')
  const catText   = catTerm?.name ?? ''

  // Location from various plugins
  const location  =
    item.geodir_location  ??
    item.meta?.location   ??
    item.meta?.address    ??
    item.meta?.city       ??
    item.meta?._city      ??
    ''

  // Contact details (GeoDirectory stores these in meta)
  const phone  = sanitizePhone(item.meta?.phone ?? item.meta?._phone ?? item.meta?.mobile ?? '')
  const email  = sanitizeEmail(item.meta?.email ?? item.meta?._email ?? '')
  const website= sanitizeUrl(item.meta?.website ?? item.meta?._website ?? item.link ?? '')

  const logo  = media?.source_url ??
    embedded['wp:featuredmedia']?.[0]?.media_details?.sizes?.thumbnail?.source_url ??
    null
  const cover = media?.source_url ?? null

  return {
    source:      'wp-api',
    sourceId:    String(item.id),
    name:        stripHtml(item.title?.rendered ?? item.title ?? ''),
    description: stripHtml(item.content?.rendered ?? item.excerpt?.rendered ?? ''),
    category:    catText,
    location:    stripHtml(String(location)),
    phone,
    email,
    website,
    logoUrl:     logo,
    coverUrl:    cover,
    rating:      parseFloat(item.meta?.rating ?? item.meta?._rating ?? 0) || 0,
    rawText:     [
      stripHtml(item.title?.rendered ?? ''),
      stripHtml(item.content?.rendered ?? ''),
      catText,
      String(location),
    ].join(' '),
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTML / CHEERIO SCRAPER (fallback)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Common CSS selectors used by popular WP directory plugins.
 * We try each in order and use the first one that matches.
 */
const LISTING_CARD_SELECTORS = [
  // GeoDirectory
  '.geodir-post-item',
  '.geodir-listing',
  '.geodir_post_title',
  // Business Directory Plugin (BDP / WPBDP)
  '.wpbdp-listing',
  '.wpbdp-listing-summary',
  // Directories Pro
  '.drts-view-entities',
  '.drts-entity',
  // Generic / custom themes
  '.listing-item',
  '.business-listing',
  '.directory-listing',
  '.listing-card',
  '.business-card',
  '.biz-listing',
  '.listing',
  // Fallback: WP post articles
  'article.post',
  'article.type-post',
]

const PAGINATION_SELECTORS = [
  '.next.page-numbers',
  'a.next',
  '.geodir-next-page a',
  '.wpbdp-pagination .next a',
  'a[rel="next"]',
  '.pagination .next a',
  '.nav-links .next a',
]

/**
 * Find all listing URLs from a directory index page.
 */
async function scrapeIndexPage(pageUrl) {
  const listings = []
  let nextUrl    = null

  try {
    const res = await http.get(pageUrl)
    const $   = cheerio.load(res.data)

    // Find listing cards and extract their links
    let cards = null
    for (const sel of LISTING_CARD_SELECTORS) {
      const found = $(sel)
      if (found.length > 0) {
        cards = found
        console.log(`     Selector matched: "${sel}" — ${found.length} cards`)
        break
      }
    }

    if (cards && cards.length > 0) {
      cards.each((_, el) => {
        const link = $(el).find('a').first().attr('href') ||
                     $(el).closest('a').attr('href')
        if (link && link.startsWith('http') && !link.includes('#')) {
          listings.push(link)
        }
      })
    } else {
      // Last resort: extract all internal /listing/ or /business/ links
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href') ?? ''
        if (
          href.includes(SOURCE_URL) &&
          (
            href.includes('/listing/') ||
            href.includes('/business/') ||
            href.includes('/place/') ||
            href.includes('/directory/')
          )
        ) {
          listings.push(href)
        }
      })
      console.log(`     ℹ️  No cards matched — found ${listings.length} raw links`)
    }

    // Find pagination next link
    for (const sel of PAGINATION_SELECTORS) {
      const next = $(sel).attr('href')
      if (next) { nextUrl = next; break }
    }

  } catch (err) {
    console.warn(`     ⚠️  Index page error (${pageUrl}): ${err.message}`)
  }

  return { listings: [...new Set(listings)], nextUrl }
}

/**
 * Scrape a single listing detail page.
 */
async function scrapeDetailPage(url) {
  try {
    const res = await http.get(url)
    const $   = cheerio.load(res.data)

    // ── Name ──────────────────────────────────────────────────────────────────
    const name =
      $('h1.listing-title, h1.entry-title, .business-name, .geodir-post-title h1, h1').first().text().trim() ||
      $('meta[property="og:title"]').attr('content')?.trim() ||
      ''

    // ── Description ───────────────────────────────────────────────────────────
    const description =
      $('.listing-description, .geodir-post-description, .wpbdp-field-description, .entry-content').first().text().trim() ||
      $('meta[property="og:description"]').attr('content')?.trim() ||
      $('meta[name="description"]').attr('content')?.trim() ||
      ''

    // ── Category ──────────────────────────────────────────────────────────────
    const category =
      $('.listing-category a, .geodir-categories a, .wpbdp-field-category a, .cat-links a').first().text().trim() ||
      $('.breadcrumb li').eq(-2).text().trim() ||
      ''

    // ── Location / Emirate ────────────────────────────────────────────────────
    const location =
      $('.listing-address, .geodir-field-address, .wpbdp-field-location, .address, [class*="location"]').first().text().trim() ||
      $('meta[name="geo.placename"]').attr('content')?.trim() ||
      ''

    // ── Contact details ───────────────────────────────────────────────────────
    // Phone — try schema.org, then tel: links, then text patterns
    let phone = $('[itemprop="telephone"]').first().text().trim() ||
                $('a[href^="tel:"]').first().attr('href')?.replace('tel:', '') ||
                ''
    // Extract phone from page text via regex
    if (!phone) {
      const bodyText = $('body').text()
      const match = bodyText.match(/(\+971[\s\-]?\d{2}[\s\-]?\d{3}[\s\-]?\d{4}|0[45]\d[\s\-]?\d{3}[\s\-]?\d{4})/)?.[0]
      phone = match ?? ''
    }

    // Email — try mailto links, schema, then regex
    let email = $('a[href^="mailto:"]').first().attr('href')?.replace('mailto:', '') ||
                $('[itemprop="email"]').first().text().trim() ||
                ''
    if (!email) {
      const bodyText = $('body').text()
      const match = bodyText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)?.[0]
      email = match ?? ''
    }

    // Website
    const website =
      $('[itemprop="url"]').first().attr('href') ||
      $('a.listing-website, a.website-link, .geodir-website a').first().attr('href') ||
      ''

    // ── Images ────────────────────────────────────────────────────────────────
    const logoUrl =
      $('[itemprop="logo"] img').attr('src') ||
      $('.listing-logo img, .business-logo img').first().attr('src') ||
      $('meta[property="og:image"]').attr('content') ||
      null

    const galleryUrls = []
    $('.listing-gallery img, .geodir-gallery img, .gallery img').each((_, el) => {
      const src = $(el).attr('src')
      if (src && !src.includes('placeholder')) galleryUrls.push(src)
    })

    // ── Rating ────────────────────────────────────────────────────────────────
    const ratingText =
      $('[itemprop="ratingValue"]').first().text() ||
      $('.geodir-star-rating').attr('data-rating') ||
      ''
    const rating = parseFloat(ratingText) || 0

    const rawText = [$('title').text(), name, description, category, location].join(' ')

    return {
      source:      'html',
      sourceUrl:   url,
      name,
      description,
      category,
      location,
      phone:       sanitizePhone(phone),
      email:       sanitizeEmail(email),
      website:     sanitizeUrl(website),
      logoUrl,
      galleryUrls: galleryUrls.slice(0, 5),
      rating:      rating > 5 ? 0 : rating,
      rawText,
    }
  } catch (err) {
    throw new Error(`Failed to scrape ${url}: ${err.message}`)
  }
}

/**
 * Try common directory index URLs for the WordPress site.
 */
async function findDirectoryUrls() {
  const candidates = [
    `${SOURCE_URL}/directory/`,
    `${SOURCE_URL}/listings/`,
    `${SOURCE_URL}/business-directory/`,
    `${SOURCE_URL}/businesses/`,
    `${SOURCE_URL}/places/`,
    `${SOURCE_URL}/`,
  ]

  for (const url of candidates) {
    try {
      const res = await http.get(url)
      const $   = cheerio.load(res.data)
      // Check if it has listing-like content
      for (const sel of LISTING_CARD_SELECTORS) {
        if ($(sel).length > 0) {
          console.log(`  📂  Found directory at: ${url} (selector: ${sel})`)
          return url
        }
      }
    } catch { /* ignore and try next */ }
    await sleep(500)
  }
  return `${SOURCE_URL}/` // fallback
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get or create the migration system user profile.
 * Returns the profile UUID that becomes owner_id for all migrated listings.
 */
async function getOrCreateMigrationUser() {
  console.log('\n👤  Setting up migration system user...')

  // Check if profile already exists (by email)
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', MIGRATION_USER_EMAIL)
    .maybeSingle()

  if (existing?.id) {
    console.log(`  ✅  Found existing migration user: ${existing.id}`)
    return existing.id
  }

  // Create auth user via Admin API (service_role key required)
  const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
    email:          MIGRATION_USER_EMAIL,
    email_confirm:  true,
    user_metadata:  { full_name: MIGRATION_USER_NAME },
    password:       crypto.randomUUID() + '!Aa1', // random strong password, never used
  })

  if (authErr) {
    // If user already exists in auth but not profiles, get their ID
    if (authErr.message?.includes('already been registered') || authErr.message?.includes('already exists')) {
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const found = users.find(u => u.email === MIGRATION_USER_EMAIL)
      if (found) {
        console.log(`  ℹ️   Auth user exists, creating profile: ${found.id}`)
        await supabase.from('profiles').insert({
          id:               found.id,
          email:            MIGRATION_USER_EMAIL,
          full_name:        MIGRATION_USER_NAME,
          username:         'migration-bot',
          is_business_owner: false,
          is_admin:         false,
        })
        return found.id
      }
    }
    throw new Error(`Failed to create migration auth user: ${authErr.message}`)
  }

  // Create matching profile row
  const userId = authUser.user.id
  const { error: profileErr } = await supabase.from('profiles').insert({
    id:               userId,
    email:            MIGRATION_USER_EMAIL,
    full_name:        MIGRATION_USER_NAME,
    username:         'migration-bot',
    is_business_owner: false,
    is_admin:         false,
  })

  if (profileErr && !profileErr.message?.includes('duplicate')) {
    throw new Error(`Failed to create migration profile: ${profileErr.message}`)
  }

  console.log(`  ✅  Created migration user: ${userId}`)
  return userId
}

/**
 * Fetch all categories from Supabase and build a slug → id map.
 */
async function getCategoryMap() {
  const { data, error } = await supabase.from('categories').select('id, slug, name')
  if (error) throw new Error(`Failed to fetch categories: ${error.message}`)
  const map = {}
  for (const cat of data) map[cat.slug] = cat.id
  return map
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSFORM — raw scraped data → listings table row
// ═══════════════════════════════════════════════════════════════════════════════

function transformToDbRow(scraped, categoryMap, ownerId) {
  const emirate     = detectEmirate(scraped.location ?? scraped.rawText ?? '')
  const catSlug     = detectCategorySlug(scraped.category ?? scraped.rawText ?? '')
  const category_id = catSlug ? categoryMap[catSlug] : null
  const slug        = uniqueSlug(scraped.name)

  return {
    owner_id:    ownerId,
    category_id,
    slug,
    name:        scraped.name.slice(0, 255),
    description: scraped.description?.slice(0, 5000) || null,
    phone:       scraped.phone  || null,
    email:       scraped.email  || null,
    website:     scraped.website || null,
    logo_url:    scraped.logoUrl || null,
    cover_url:   scraped.coverUrl || scraped.galleryUrls?.[0] || null,
    gallery_urls: scraped.galleryUrls?.slice(1, 5) ?? [],
    emirate,
    plan:        'basic',
    status:      'pending',
    is_featured: false,
    is_verified: false,
    rating_avg:  scraped.rating > 0 ? scraped.rating : 0,
    review_count: 0,
    languages:   ['English', 'Malayalam'],
    // Store original source URL for traceability
    services:    scraped.sourceUrl ? [`source:${scraped.sourceUrl}`] : [],
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATCH INSERT
// ═══════════════════════════════════════════════════════════════════════════════

async function insertBatch(rows) {
  const { data, error } = await supabase
    .from('listings')
    .insert(rows)
    .select('id, slug, name')

  return { data, error }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════

async function runMigration() {
  console.log('\n═══════════════════════════════════════════════')
  console.log(' MalayaliBusiness — WordPress → Supabase Migration')
  console.log('═══════════════════════════════════════════════')
  console.log(` Source  : ${SOURCE_URL}`)
  console.log(` Target  : ${SUPABASE_URL}`)
  console.log(` Mode    : ${DRY_RUN ? '🔵 DRY RUN (no DB writes)' : '🟢 LIVE'}`)
  if (IMPORT_LIMIT) console.log(` Limit   : ${IMPORT_LIMIT} listings`)
  console.log('═══════════════════════════════════════════════\n')

  // ── Step 1: Setup ────────────────────────────────────────────────────────
  let ownerId, categoryMap

  if (!DRY_RUN) {
    try {
      ownerId     = await getOrCreateMigrationUser()
      categoryMap = await getCategoryMap()
      console.log(`\n📁  Loaded ${Object.keys(categoryMap).length} categories from Supabase`)
    } catch (err) {
      console.error(`\n❌  Setup failed: ${err.message}`)
      process.exit(1)
    }
  } else {
    ownerId     = '00000000-0000-0000-0000-000000000000'
    categoryMap = { 'restaurants-food': 'cat-1', 'technology-it': 'cat-2' }
    console.log('  (dry-run: skipping Supabase setup)')
  }

  // ── Step 2: Scrape ───────────────────────────────────────────────────────
  console.log('\n🔍  Phase 1: Scraping source site...')

  const scrapedItems = []

  // ── 2a: Try WordPress REST API first ─────────────────────────────────────
  console.log('\n  Trying WordPress REST API...')
  const postTypes = await discoverWpPostTypes()

  if (postTypes.length > 0) {
    console.log(`  Found ${postTypes.length} post type(s): ${postTypes.map(t => t.slug).join(', ')}`)

    for (const pt of postTypes) {
      await sleep(REQUEST_DELAY_MS)
      const endpoint = `${SOURCE_URL}/wp-json/wp/v2/${pt.rest_base ?? pt.slug}`
      const items    = await fetchWpRestListings(endpoint)

      for (const item of items) {
        try {
          scrapedItems.push(transformWpItem(item))
        } catch (err) {
          errors.push({ source: endpoint, error: err.message })
        }
      }
    }
  } else {
    console.log('  No REST API post types found — falling back to HTML scraping')
  }

  // ── 2b: HTML scraping if REST API gave no results ─────────────────────────
  if (scrapedItems.length === 0) {
    console.log('\n  Starting HTML scraper...')
    const startUrl = await findDirectoryUrls()
    let   currentUrl = startUrl
    let   pageNum    = 1
    const visitedUrls = new Set()
    const listingUrls = new Set()

    // Collect listing URLs from index pages
    while (currentUrl) {
      if (visitedUrls.has(currentUrl)) break
      visitedUrls.add(currentUrl)

      console.log(`\n  📄  Index page ${pageNum}: ${currentUrl}`)
      const { listings, nextUrl } = await scrapeIndexPage(currentUrl)
      listings.forEach(u => listingUrls.add(u))
      console.log(`     Collected ${listingUrls.size} unique listing URLs so far`)

      currentUrl = nextUrl && !visitedUrls.has(nextUrl) ? nextUrl : null
      pageNum++
      if (currentUrl) await sleep(REQUEST_DELAY_MS)

      // Safety cap on index pages
      if (pageNum > 200) { console.warn('     ⚠️  Hit 200-page cap on index scraping'); break }
    }

    console.log(`\n  Found ${listingUrls.size} listing URLs. Scraping details...`)

    let count = 0
    for (const url of listingUrls) {
      if (IMPORT_LIMIT && count >= IMPORT_LIMIT) break
      await sleep(REQUEST_DELAY_MS)

      try {
        const item = await scrapeDetailPage(url)
        if (item.name) {
          scrapedItems.push(item)
          count++
          process.stdout.write(`\r     Scraped: ${count}/${listingUrls.size}   `)
        }
      } catch (err) {
        errors.push({ source: url, error: err.message })
      }

      if (TEST_SCRAPE && count >= 5) {
        console.log('\n\n  [test-scrape] Stopping after 5 listings')
        break
      }
    }
    console.log()
  }

  report.totalScraped = scrapedItems.length
  console.log(`\n✅  Scraped ${scrapedItems.length} raw items`)

  // ── Step 3: Filter ───────────────────────────────────────────────────────
  console.log('\n🚫  Phase 2: Filtering blocked content...')

  const cleanItems = []
  for (const item of scrapedItems) {
    // Must have a name
    if (!item.name || item.name.length < 3) {
      report.totalFiltered++
      continue
    }
    // Block gambling/spam
    if (isBlocked(item.rawText)) {
      report.totalFiltered++
      console.log(`     🚫  Blocked: "${item.name.slice(0, 60)}"`)
      continue
    }
    cleanItems.push(item)
  }

  console.log(`  ✅  ${cleanItems.length} listings passed filter (${report.totalFiltered} blocked)`)

  // ── Step 4: Transform ────────────────────────────────────────────────────
  console.log('\n🔄  Phase 3: Transforming to Supabase schema...')

  const limit = IMPORT_LIMIT ? Math.min(IMPORT_LIMIT, cleanItems.length) : cleanItems.length
  const dbRows = []

  for (let i = 0; i < limit; i++) {
    try {
      const row = transformToDbRow(cleanItems[i], categoryMap, ownerId)
      if (row.name) dbRows.push(row)
    } catch (err) {
      errors.push({ source: cleanItems[i].name, error: `Transform failed: ${err.message}` })
    }
  }

  console.log(`  ✅  ${dbRows.length} rows ready for insertion`)

  if (TEST_SCRAPE) {
    console.log('\n[test-scrape] First 5 transformed rows:')
    console.log(JSON.stringify(dbRows.slice(0, 5), null, 2))
    return
  }

  // ── Step 5: Insert (batched) ─────────────────────────────────────────────
  if (DRY_RUN) {
    console.log('\n🔵  DRY RUN — skipping database insertion')
    console.log(`  Would insert ${dbRows.length} listings in ${Math.ceil(dbRows.length / BATCH_SIZE)} batches`)
    report.listings = dbRows.map(r => ({ slug: r.slug, name: r.name, emirate: r.emirate, status: 'dry-run' }))
  } else {
    console.log(`\n📦  Phase 4: Inserting ${dbRows.length} listings in batches of ${BATCH_SIZE}...`)

    for (let i = 0; i < dbRows.length; i += BATCH_SIZE) {
      const batch     = dbRows.slice(i, i + BATCH_SIZE)
      const batchNum  = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(dbRows.length / BATCH_SIZE)

      process.stdout.write(`\r  Batch ${batchNum}/${totalBatches}...   `)

      const { data, error } = await insertBatch(batch)

      if (error) {
        console.log(`\n  ❌  Batch ${batchNum} failed: ${error.message}`)
        // Try inserting one-by-one to isolate the bad row
        for (const row of batch) {
          const { data: single, error: singleErr } = await supabase
            .from('listings')
            .insert([row])
            .select('id, slug, name')
            .single()

          if (singleErr) {
            report.totalFailed++
            errors.push({
              source: row.name,
              slug:   row.slug,
              error:  singleErr.message,
            })
          } else if (single) {
            report.totalInserted++
            report.listings.push({
              id:      single.id,
              slug:    single.slug,
              name:    single.name,
              emirate: row.emirate,
              status:  'inserted',
            })
          }
        }
      } else if (data) {
        report.totalInserted += data.length
        for (const inserted of data) {
          report.listings.push({
            id:      inserted.id,
            slug:    inserted.slug,
            name:    inserted.name,
            emirate: dbRows[i]?.emirate,
            status:  'inserted',
          })
        }
      }

      await sleep(200) // short pause between batches
    }
    console.log()
  }

  // ── Step 6: Write reports ────────────────────────────────────────────────
  report.finishedAt    = new Date().toISOString()
  report.totalFailed   = errors.length
  report.totalInserted = report.listings.filter(l => l.status === 'inserted').length

  const reportPath = path.join(__dirname, 'migration-report.json')
  const errorPath  = path.join(__dirname, 'error-log.json')

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  fs.writeFileSync(errorPath,  JSON.stringify({ errors, generatedAt: new Date().toISOString() }, null, 2))

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════')
  console.log(' Migration Complete')
  console.log('═══════════════════════════════════════════════')
  console.log(` Scraped     : ${report.totalScraped}`)
  console.log(` Filtered    : ${report.totalFiltered}  (gambling/spam blocked)`)
  console.log(` Inserted    : ${report.totalInserted}  ${DRY_RUN ? '(dry-run)' : '✅'}`)
  console.log(` Failed      : ${report.totalFailed}`)
  console.log(`\n 📄  Report  : ${reportPath}`)
  console.log(` 📋  Errors  : ${errorPath}`)
  console.log('═══════════════════════════════════════════════\n')
}

// ─── Run ──────────────────────────────────────────────────────────────────────
runMigration().catch(err => {
  console.error('\n💥  Unexpected error:', err)
  process.exit(1)
})
