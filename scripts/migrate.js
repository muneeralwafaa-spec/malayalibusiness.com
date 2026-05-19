/**
 * MalayaliBusiness.com — WordPress → Supabase Migration Script
 * =============================================================
 * Usage:
 *   node migrate.js               — full live migration
 *   node migrate.js --test-scrape — scrape only, NO database writes
 *
 * Setup:
 *   1. Fill in scripts/.env  (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 *   2. npm install  (inside scripts/ directory)
 *   3. node migrate.js --test-scrape   ← always test first
 *   4. node migrate.js                 ← live run when happy
 *
 * Outputs:
 *   migration-report.json  — every successfully inserted listing
 *   error-log.json         — every failure with reason
 */

'use strict';

require('dotenv').config({ path: __dirname + '/.env' });

const fs      = require('fs');
const path    = require('path');
const axios   = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

// ─── CLI flags ────────────────────────────────────────────────────────────────
const TEST_SCRAPE  = process.argv.includes('--test-scrape');
const IMPORT_LIMIT = parseInt(process.env.IMPORT_LIMIT || '0', 10) || null;

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL              = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SOURCE_URL                = 'https://www.malayalibusiness.com';
const MIGRATION_EMAIL           = 'migration-bot@malayalibusiness.com';
const MIGRATION_NAME            = 'Migration Bot';
const REQUEST_DELAY_MS          = 1000;
const BATCH_SIZE                = 10;

// ─── Validate env ─────────────────────────────────────────────────────────────
if (!SUPABASE_URL || SUPABASE_URL === 'your_supabase_url') {
  console.error('\n❌  SUPABASE_URL is not set. Edit scripts/.env first.\n');
  process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === 'your_service_role_key') {
  console.error('\n❌  SUPABASE_SERVICE_ROLE_KEY is not set. Edit scripts/.env first.\n');
  process.exit(1);
}

// ─── Supabase (service_role bypasses Row Level Security) ──────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── HTTP client (1 UA header, 15 s timeout) ─────────────────────────────────
const http = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; MalayaliBizMigration/1.0)',
    'Accept':     'text/html,application/json,*/*',
  },
});

// =============================================================================
// CONSTANTS
// =============================================================================

// Gambling / spam keywords — block any listing whose text contains these
const BLOCKED_KEYWORDS = [
  'casino', 'gambling', 'poker', 'slot', 'slots', 'betting',
  'jokery', 'megablock', 'spielen', 'spielautomaten',
  'roulette', 'blackjack', 'baccarat', 'jackpot', 'wager',
  'sportsbet', 'free spins', 'online casino', 'crypto casino',
];

// WordPress REST API custom post type slugs to try
const WP_CPT_SLUGS = [
  'gd_place',       // GeoDirectory plugin
  'wpbdp_listing',  // Business Directory Plugin
  'listings',
  'listing',
  'directory',
  'business',
  'places',
  'posts',
];

// CSS selectors for directory index cards (tried in order)
const CARD_SELECTORS = [
  '.geodir-post-item',        // GeoDirectory
  '.geodir-listing',
  '.wpbdp-listing',           // Business Directory Plugin
  '.wpbdp-listing-summary',
  '.drts-entity',             // Directories Pro
  '.listing-item',
  '.business-listing',
  '.listing-card',
  '.business-card',
  'article.post',
  'article.type-post',
];

// CSS selectors for "next page" link
const NEXT_PAGE_SELECTORS = [
  '.next.page-numbers',
  'a.next',
  'a[rel="next"]',
  '.pagination .next a',
  '.nav-links .next a',
  '.geodir-next-page a',
  '.wpbdp-pagination .next a',
];

// Maps UAE location keywords → Supabase enum value
const EMIRATE_MAP = [
  { patterns: ['dubai', 'dxb'],                             value: 'dubai' },
  { patterns: ['abu dhabi', 'abudhabi', 'abu-dhabi', ' ad '], value: 'abu_dhabi' },
  { patterns: ['sharjah', 'shj'],                           value: 'sharjah' },
  { patterns: ['ajman'],                                    value: 'ajman' },
  { patterns: ['ras al khaimah', 'rak'],                    value: 'ras_al_khaimah' },
  { patterns: ['fujairah'],                                 value: 'fujairah' },
  { patterns: ['umm al quwain', 'uaq'],                     value: 'umm_al_quwain' },
];

// Maps category keywords → Supabase category slug
const CATEGORY_MAP = [
  { keywords: ['restaurant', 'food', 'catering', 'cafe', 'kitchen', 'biryani', 'bakery', 'dining'], slug: 'restaurants-food' },
  { keywords: ['grocery', 'supermarket', 'hypermarket', 'provisions'],                               slug: 'grocery-supermarket' },
  { keywords: ['real estate', 'property', 'realty', 'apartment', 'villa'],                           slug: 'real-estate' },
  { keywords: ['health', 'medical', 'clinic', 'doctor', 'hospital', 'pharmacy', 'dental'],           slug: 'healthcare-medical' },
  { keywords: ['education', 'training', 'tuition', 'school', 'college', 'academy', 'coaching'],      slug: 'education-training' },
  { keywords: ['beauty', 'salon', 'spa', 'wellness', 'parlour', 'threading', 'bridal'],              slug: 'beauty-wellness' },
  { keywords: ['technology', 'tech', 'it ', 'software', 'web', 'app', 'digital', 'computer'],       slug: 'technology-it' },
  { keywords: ['construction', 'interior', 'renovation', 'contracting', 'fit-out'],                  slug: 'construction-interiors' },
  { keywords: ['retail', 'fashion', 'clothing', 'boutique', 'jewellery'],                            slug: 'retail-fashion' },
  { keywords: ['legal', 'law', 'finance', 'accounting', 'tax', 'audit', 'insurance'],                slug: 'legal-finance' },
  { keywords: ['travel', 'tourism', 'tour', 'holiday', 'visa', 'ticket'],                            slug: 'travel-tourism' },
  { keywords: ['automotive', 'car', 'vehicle', 'garage', 'tyre', 'driving'],                         slug: 'automotive' },
];

// =============================================================================
// UTILITY HELPERS
// =============================================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Track slugs used in this run so we never insert a duplicate
const usedSlugs = new Set();

function makeSlug(name) {
  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

  if (!base) base = 'listing';

  let candidate = base;
  let i = 2;
  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${i++}`;
  }
  usedSlugs.add(candidate);
  return candidate;
}

function cleanPhone(raw) {
  if (!raw) return null;
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.length < 7) return null;
  if (digits.startsWith('00971')) return '+' + digits.slice(2);
  if (digits.startsWith('971') && !digits.startsWith('+')) return '+' + digits;
  if (/^0[45]/.test(digits)) return '+971' + digits.slice(1);
  return digits;
}

function cleanEmail(raw) {
  if (!raw) return null;
  const e = raw.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

function cleanUrl(raw) {
  if (!raw) return null;
  const t = raw.trim();
  if (!t) return null;
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  if (t.includes('.')) return 'https://' + t;
  return null;
}

function stripTags(html) {
  if (!html) return '';
  return cheerio.load(html).text().replace(/\s+/g, ' ').trim();
}

function isBlocked(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BLOCKED_KEYWORDS.some(kw => lower.includes(kw));
}

function detectEmirate(text) {
  const lower = (text || '').toLowerCase();
  for (const entry of EMIRATE_MAP) {
    if (entry.patterns.some(p => lower.includes(p))) return entry.value;
  }
  return 'dubai'; // safe default
}

function detectCategorySlug(text) {
  const lower = (text || '').toLowerCase();
  for (const entry of CATEGORY_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) return entry.slug;
  }
  return null;
}

// =============================================================================
// PHASE 1 — SCRAPING
// =============================================================================

// ── 1A: WordPress REST API ────────────────────────────────────────────────────

/**
 * Discover which CPTs the WP REST API exposes and return the ones
 * that look like business listings.
 */
async function discoverWpCPTs() {
  try {
    const res   = await http.get(`${SOURCE_URL}/wp-json/wp/v2/types`);
    const types = Object.values(res.data || {});

    return types.filter(t => {
      const slug = (t.slug || t.name || '').toLowerCase();
      return WP_CPT_SLUGS.includes(slug);
    });
  } catch {
    return [];
  }
}

/**
 * Fetch all items from one WP REST endpoint (handles WP pagination).
 */
async function fetchAllFromEndpoint(endpoint) {
  const results = [];
  let   page    = 1;
  let   maxPage = 1;

  while (page <= maxPage) {
    try {
      const res = await http.get(endpoint, {
        params: { per_page: 100, page, _embed: true },
      });

      maxPage = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
      const items = Array.isArray(res.data) ? res.data : [];
      results.push(...items);

      console.log(`    Page ${page}/${maxPage} — got ${items.length} items`);
      page++;
      if (page <= maxPage) await sleep(REQUEST_DELAY_MS);

    } catch (err) {
      const status = err.response && err.response.status;
      if (status === 400 || status === 404) break;
      console.warn(`    ⚠️  Endpoint error at page ${page}: ${err.message}`);
      break;
    }
  }

  return results;
}

/**
 * Convert one WP REST item to our "raw scraped" format.
 */
function parseWpItem(item) {
  const embedded  = item._embedded || {};
  const terms     = (embedded['wp:term'] || []).flat();
  const mediaObj  = (embedded['wp:featuredmedia'] || [])[0] || null;
  const meta      = item.meta || {};

  const catTerm   = terms.find(t => t.taxonomy === 'category' || t.taxonomy === 'gd_placecategory');

  // Contact — GeoDirectory / BDP store these as post meta
  const phone   = cleanPhone(meta.phone || meta._phone || meta.mobile || '');
  const email   = cleanEmail(meta.email || meta._email || '');
  const website = cleanUrl(meta.website || meta._website || '');
  const address = stripTags(String(meta.address || meta._address || meta.city || meta.location || ''));

  const logoUrl = mediaObj
    ? (mediaObj.source_url || (mediaObj.media_details && mediaObj.media_details.sizes && mediaObj.media_details.sizes.thumbnail && mediaObj.media_details.sizes.thumbnail.source_url) || null)
    : null;

  const name        = stripTags(item.title && item.title.rendered ? item.title.rendered : String(item.title || ''));
  const description = stripTags(
    (item.content && item.content.rendered) ||
    (item.excerpt && item.excerpt.rendered) ||
    ''
  );
  const category = catTerm ? catTerm.name : '';

  return {
    source:      'wp-api',
    sourceId:    String(item.id),
    name,
    description,
    category,
    address,
    phone,
    email,
    website,
    logoUrl,
    coverUrl:    logoUrl,
    rating:      Math.min(5, parseFloat(meta.rating || meta._rating || 0) || 0),
    rawText:     [name, description, category, address].join(' '),
  };
}

// ── 1B: HTML scraper (fallback) ───────────────────────────────────────────────

/**
 * Try common directory index paths and return the first URL that has listing cards.
 */
async function findDirectoryIndexUrl() {
  const candidates = [
    SOURCE_URL + '/directory/',
    SOURCE_URL + '/listings/',
    SOURCE_URL + '/business-directory/',
    SOURCE_URL + '/businesses/',
    SOURCE_URL + '/places/',
    SOURCE_URL + '/',
  ];

  for (const url of candidates) {
    try {
      const res = await http.get(url);
      const $   = cheerio.load(res.data);

      for (const sel of CARD_SELECTORS) {
        if ($(sel).length > 0) {
          console.log(`  📂  Found directory index: ${url}  (selector: "${sel}")`);
          return url;
        }
      }
    } catch { /* try next */ }
    await sleep(500);
  }

  console.log(`  ℹ️  No directory index found — defaulting to ${SOURCE_URL}/`);
  return SOURCE_URL + '/';
}

/**
 * Scrape a single index page.
 * Returns { listingUrls: string[], nextPageUrl: string|null }.
 */
async function scrapeIndexPage(url) {
  const listingUrls = [];
  let   nextPageUrl = null;

  try {
    const res = await http.get(url);
    const $   = cheerio.load(res.data);

    // Find cards
    let cards = null;
    for (const sel of CARD_SELECTORS) {
      const found = $(sel);
      if (found.length > 0) { cards = found; break; }
    }

    if (cards && cards.length > 0) {
      cards.each(function () {
        const link = $(this).find('a').first().attr('href') || $(this).closest('a').attr('href');
        if (link && link.startsWith('http') && !link.includes('#')) {
          listingUrls.push(link);
        }
      });
    } else {
      // Fallback: grab all internal links that look like listings
      $('a[href]').each(function () {
        const href = $(this).attr('href') || '';
        if (href.startsWith(SOURCE_URL) &&
            (href.includes('/listing/') || href.includes('/business/') ||
             href.includes('/place/')   || href.includes('/directory/'))) {
          listingUrls.push(href);
        }
      });
    }

    // Find next page
    for (const sel of NEXT_PAGE_SELECTORS) {
      const next = $(sel).attr('href');
      if (next) { nextPageUrl = next; break; }
    }

  } catch (err) {
    console.warn(`  ⚠️  Index page error (${url}): ${err.message}`);
  }

  return { listingUrls: [...new Set(listingUrls)], nextPageUrl };
}

/**
 * Scrape a single listing detail page and return raw data.
 */
async function scrapeDetailPage(url) {
  const res = await http.get(url);
  const $   = cheerio.load(res.data);

  // ── Name ──────────────────────────────────────────────────────────────────
  const name =
    $('h1.listing-title, h1.entry-title, .geodir-post-title h1, .business-name, h1').first().text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    '';

  // ── Description ───────────────────────────────────────────────────────────
  const description =
    $('.listing-description, .geodir-post-description, .wpbdp-field-description, .entry-content').first().text().trim().slice(0, 2000) ||
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';

  // ── Category ──────────────────────────────────────────────────────────────
  const category =
    $('.geodir-categories a, .listing-category a, .wpbdp-field-category a, .cat-links a').first().text().trim() ||
    $('.breadcrumb li').eq(-2).text().trim() ||
    '';

  // ── Address / Emirate ─────────────────────────────────────────────────────
  const address =
    $('[itemprop="address"], .geodir-field-address, .listing-address, .address').first().text().trim() ||
    $('meta[name="geo.placename"]').attr('content') ||
    '';

  // ── Phone ─────────────────────────────────────────────────────────────────
  let rawPhone =
    $('[itemprop="telephone"]').first().text().trim() ||
    ($('a[href^="tel:"]').first().attr('href') || '').replace('tel:', '') ||
    '';
  if (!rawPhone) {
    // regex scan for UAE phone patterns
    const match = $('body').text().match(/(\+971[\s\-]?\d{2}[\s\-]?\d{3}[\s\-]?\d{4}|0[45]\d[\s\-]?\d{3}[\s\-]?\d{4})/);
    rawPhone = match ? match[0] : '';
  }

  // ── Email ─────────────────────────────────────────────────────────────────
  let rawEmail =
    ($('a[href^="mailto:"]').first().attr('href') || '').replace('mailto:', '') ||
    $('[itemprop="email"]').first().text().trim() ||
    '';
  if (!rawEmail) {
    const match = $('body').text().match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
    rawEmail = match ? match[0] : '';
  }

  // ── Website ───────────────────────────────────────────────────────────────
  const rawWebsite =
    $('[itemprop="url"]').first().attr('href') ||
    $('a.listing-website, a.website-link, .geodir-website a').first().attr('href') ||
    '';

  // ── Images ────────────────────────────────────────────────────────────────
  const logoUrl =
    $('[itemprop="logo"] img').attr('src') ||
    $('.listing-logo img, .business-logo img').first().attr('src') ||
    $('meta[property="og:image"]').attr('content') ||
    null;

  // ── Rating ────────────────────────────────────────────────────────────────
  const ratingRaw =
    $('[itemprop="ratingValue"]').first().text() ||
    $('.geodir-star-rating').attr('data-rating') ||
    '0';
  const rating = Math.min(5, parseFloat(ratingRaw) || 0);

  return {
    source:      'html',
    sourceUrl:   url,
    name:        name.trim(),
    description: description.trim(),
    category:    category.trim(),
    address:     address.trim(),
    phone:       cleanPhone(rawPhone),
    email:       cleanEmail(rawEmail),
    website:     cleanUrl(rawWebsite),
    logoUrl,
    coverUrl:    logoUrl,
    rating,
    rawText:     [$('title').text(), name, description, category, address].join(' '),
  };
}

// =============================================================================
// PHASE 2 — TRANSFORM (raw → Supabase listings row)
// =============================================================================

function transform(raw, categoryIdMap, ownerId) {
  const emirate    = detectEmirate(raw.address + ' ' + raw.rawText);
  const catSlug    = detectCategorySlug(raw.category + ' ' + raw.rawText);
  const categoryId = catSlug ? categoryIdMap[catSlug] : null;
  const slug       = makeSlug(raw.name);

  return {
    owner_id:    ownerId,
    category_id: categoryId || null,
    slug,
    name:        raw.name.slice(0, 255),
    description: raw.description.slice(0, 5000) || null,
    phone:       raw.phone   || null,
    email:       raw.email   || null,
    website:     raw.website || null,
    logo_url:    raw.logoUrl  || null,
    cover_url:   raw.coverUrl || null,
    gallery_urls: [],
    emirate,
    plan:         'basic',
    status:       'pending',
    is_featured:  false,
    is_verified:  false,
    rating_avg:   raw.rating || 0,
    review_count: 0,
    languages:    ['English', 'Malayalam'],
    // Store original URL for traceability / re-review
    services:    raw.sourceUrl ? [`source:${raw.sourceUrl}`] : [],
  };
}

// =============================================================================
// PHASE 3 — SUPABASE SETUP
// =============================================================================

/**
 * Create the migration system user if it doesn't already exist.
 * Returns the profile UUID that becomes owner_id for all imported listings.
 */
async function getOrCreateMigrationUser() {
  console.log('\n👤  Setting up migration system user...');

  // Check profiles first
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', MIGRATION_EMAIL)
    .maybeSingle();

  if (existing && existing.id) {
    console.log(`  ✅  Found existing profile: ${existing.id}`);
    return existing.id;
  }

  // Create an auth user via the Admin API (needs service_role)
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email:         MIGRATION_EMAIL,
    email_confirm: true,
    user_metadata: { full_name: MIGRATION_NAME },
    password:      'Mig!' + Math.random().toString(36).slice(2) + 'Aa9',
  });

  if (authErr) {
    // Already exists in auth but profile row missing — look up by email
    if (authErr.message && (authErr.message.includes('already') || authErr.message.includes('exists'))) {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const found = users.find(u => u.email === MIGRATION_EMAIL);
      if (found) {
        await supabase.from('profiles').upsert({
          id: found.id, email: MIGRATION_EMAIL,
          full_name: MIGRATION_NAME, username: 'migration-bot',
        });
        console.log(`  ✅  Reused auth user, created profile: ${found.id}`);
        return found.id;
      }
    }
    throw new Error('Could not create migration auth user: ' + authErr.message);
  }

  const userId = authData.user.id;
  await supabase.from('profiles').upsert({
    id: userId, email: MIGRATION_EMAIL,
    full_name: MIGRATION_NAME, username: 'migration-bot',
  });

  console.log(`  ✅  Created migration user: ${userId}`);
  return userId;
}

/**
 * Fetch all categories from Supabase → { slug: uuid } map.
 */
async function loadCategoryMap() {
  const { data, error } = await supabase.from('categories').select('id, slug');
  if (error) throw new Error('Could not load categories: ' + error.message);
  const map = {};
  for (const c of data) map[c.slug] = c.id;
  console.log(`\n📁  Loaded ${data.length} categories`);
  return map;
}

// =============================================================================
// PHASE 4 — INSERT (batched, row-by-row fallback)
// =============================================================================

async function insertBatch(rows) {
  const { data, error } = await supabase
    .from('listings')
    .insert(rows)
    .select('id, slug, name');
  return { data, error };
}

async function insertRowByRow(rows, report, errors) {
  for (const row of rows) {
    const { data, error } = await supabase
      .from('listings')
      .insert([row])
      .select('id, slug, name')
      .maybeSingle();

    if (error) {
      errors.push({ name: row.name, slug: row.slug, reason: error.message });
    } else if (data) {
      report.inserted.push({ id: data.id, slug: data.slug, name: data.name, emirate: row.emirate });
    }
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  MalayaliBusiness  WordPress → Supabase Migration ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(` Source  : ${SOURCE_URL}`);
  console.log(` Target  : ${SUPABASE_URL}`);
  console.log(` Mode    : ${TEST_SCRAPE ? '🔵 TEST-SCRAPE (no DB writes)' : '🟢 LIVE'}`);
  if (IMPORT_LIMIT) console.log(` Limit   : ${IMPORT_LIMIT} listings`);
  console.log('');

  const report = {
    startedAt:   new Date().toISOString(),
    mode:        TEST_SCRAPE ? 'test-scrape' : 'live',
    totalScraped:  0,
    totalBlocked:  0,
    totalInserted: 0,
    totalFailed:   0,
    inserted:      [],
  };
  const errors = [];

  // ── Step 1: Scrape ─────────────────────────────────────────────────────────
  console.log('━━━  Step 1: Scraping  ━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const rawItems = [];

  // Try WordPress REST API
  console.log('  Trying WordPress REST API...');
  const cptTypes = await discoverWpCPTs();

  if (cptTypes.length > 0) {
    console.log(`  Found CPTs: ${cptTypes.map(t => t.slug).join(', ')}`);

    for (const cpt of cptTypes) {
      const endpoint = `${SOURCE_URL}/wp-json/wp/v2/${cpt.rest_base || cpt.slug}`;
      console.log(`\n  → Fetching: ${endpoint}`);
      await sleep(REQUEST_DELAY_MS);

      const items = await fetchAllFromEndpoint(endpoint);
      for (const item of items) {
        try { rawItems.push(parseWpItem(item)); } catch { /* skip bad item */ }
      }
    }
  } else {
    console.log('  REST API unavailable — switching to HTML scraper\n');
  }

  // HTML scraper fallback if REST gave nothing
  if (rawItems.length === 0) {
    console.log('  Starting HTML scraper...');
    const indexUrl      = await findDirectoryIndexUrl();
    let   currentUrl    = indexUrl;
    let   pageNumber    = 1;
    const visited       = new Set();
    const allDetailUrls = new Set();

    // Crawl index pages to collect listing URLs
    while (currentUrl && !visited.has(currentUrl)) {
      visited.add(currentUrl);
      console.log(`\n  Index page ${pageNumber}: ${currentUrl}`);

      const { listingUrls, nextPageUrl } = await scrapeIndexPage(currentUrl);
      listingUrls.forEach(u => allDetailUrls.add(u));
      console.log(`  Collected ${allDetailUrls.size} listing URLs so far`);

      currentUrl = nextPageUrl && !visited.has(nextPageUrl) ? nextPageUrl : null;
      pageNumber++;
      if (currentUrl) await sleep(REQUEST_DELAY_MS);
      if (pageNumber > 200) { console.warn('  ⚠️  Stopped at 200 index pages'); break; }
    }

    // Scrape each detail page
    console.log(`\n  Scraping ${allDetailUrls.size} detail pages...\n`);
    let count = 0;

    for (const url of allDetailUrls) {
      if (IMPORT_LIMIT && count >= IMPORT_LIMIT) break;
      await sleep(REQUEST_DELAY_MS);

      try {
        const item = await scrapeDetailPage(url);
        if (item.name && item.name.length >= 3) {
          rawItems.push(item);
          count++;
          process.stdout.write(`\r  Scraped: ${count} / ${allDetailUrls.size}   `);
        }
      } catch (err) {
        errors.push({ name: url, reason: 'Scrape error: ' + err.message });
      }

      // In test-scrape mode stop after 10 detail pages for a fast preview
      if (TEST_SCRAPE && count >= 10) {
        console.log('\n  [test-scrape] Stopping after 10 detail pages');
        break;
      }
    }
    console.log('');
  }

  report.totalScraped = rawItems.length;
  console.log(`\n  ✅  Scraped ${rawItems.length} raw items total`);

  // ── Step 2: Filter ─────────────────────────────────────────────────────────
  console.log('\n━━━  Step 2: Filtering  ━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const cleanItems = [];
  for (const item of rawItems) {
    if (isBlocked(item.rawText)) {
      report.totalBlocked++;
      console.log(`  🚫 Blocked: "${item.name.slice(0, 60)}"`);
    } else {
      cleanItems.push(item);
    }
  }
  console.log(`\n  ✅  ${cleanItems.length} passed  |  ${report.totalBlocked} blocked (spam/gambling)`);

  // ── TEST-SCRAPE: print findings and exit without touching DB ───────────────
  if (TEST_SCRAPE) {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║           TEST-SCRAPE RESULTS (no DB writes)       ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    const preview = cleanItems.slice(0, 10);
    preview.forEach((item, i) => {
      console.log(`\n  ── Listing ${i + 1} ${'─'.repeat(40)}`);
      console.log(`  Name     : ${item.name}`);
      console.log(`  Category : ${item.category || '(none detected)'}`);
      console.log(`  Address  : ${item.address  || '(none detected)'}`);
      console.log(`  Phone    : ${item.phone    || '(none detected)'}`);
      console.log(`  Email    : ${item.email    || '(none detected)'}`);
      console.log(`  Website  : ${item.website  || '(none detected)'}`);
      console.log(`  Rating   : ${item.rating   || '(none)'}`);
      console.log(`  Source   : ${item.sourceUrl || item.source}`);
    });

    console.log(`\n  Total scraped  : ${rawItems.length}`);
    console.log(`  Total blocked  : ${report.totalBlocked}`);
    console.log(`  Ready to import: ${cleanItems.length}`);
    console.log('\n  ✅  Re-run WITHOUT --test-scrape to import into Supabase.\n');
    return;
  }

  // ── Step 3: Transform ──────────────────────────────────────────────────────
  console.log('\n━━━  Step 3: Transform  ━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let ownerId, categoryIdMap;

  try {
    ownerId       = await getOrCreateMigrationUser();
    categoryIdMap = await loadCategoryMap();
  } catch (err) {
    console.error('\n❌  Supabase setup failed:', err.message);
    process.exit(1);
  }

  const limit  = IMPORT_LIMIT ? Math.min(IMPORT_LIMIT, cleanItems.length) : cleanItems.length;
  const dbRows = [];

  for (let i = 0; i < limit; i++) {
    try {
      const row = transform(cleanItems[i], categoryIdMap, ownerId);
      if (row.name) dbRows.push(row);
    } catch (err) {
      errors.push({ name: cleanItems[i].name, reason: 'Transform error: ' + err.message });
    }
  }

  console.log(`  ✅  ${dbRows.length} rows ready for insertion`);

  // ── Step 4: Insert ─────────────────────────────────────────────────────────
  console.log(`\n━━━  Step 4: Inserting  ━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`  ${dbRows.length} listings → batches of ${BATCH_SIZE} with ${REQUEST_DELAY_MS}ms delay\n`);

  const totalBatches = Math.ceil(dbRows.length / BATCH_SIZE);

  for (let i = 0; i < dbRows.length; i += BATCH_SIZE) {
    const batch    = dbRows.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    process.stdout.write(`\r  Batch ${batchNum}/${totalBatches} ...   `);

    const { data, error } = await insertBatch(batch);

    if (error) {
      // Batch failed — try each row individually to isolate the bad one
      process.stdout.write(`  ⚠️  batch error, retrying row-by-row\n`);
      await insertRowByRow(batch, report, errors);
    } else if (data) {
      for (let j = 0; j < data.length; j++) {
        report.inserted.push({
          id:      data[j].id,
          slug:    data[j].slug,
          name:    data[j].name,
          emirate: batch[j].emirate,
        });
      }
    }

    if (i + BATCH_SIZE < dbRows.length) await sleep(REQUEST_DELAY_MS);
  }

  console.log('');

  // ── Step 5: Write output files ─────────────────────────────────────────────
  report.finishedAt     = new Date().toISOString();
  report.totalInserted  = report.inserted.length;
  report.totalFailed    = errors.length;

  const reportPath = path.join(__dirname, 'migration-report.json');
  const errorPath  = path.join(__dirname, 'error-log.json');

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(errorPath,  JSON.stringify({ generatedAt: new Date().toISOString(), errors }, null, 2));

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║                Migration Complete                  ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(` Scraped  : ${report.totalScraped}`);
  console.log(` Blocked  : ${report.totalBlocked}  (gambling/spam filtered)`);
  console.log(` Inserted : ${report.totalInserted}  ✅`);
  console.log(` Failed   : ${report.totalFailed}`);
  console.log(`\n 📄  ${reportPath}`);
  console.log(` 📋  ${errorPath}\n`);
}

// ─── Run ──────────────────────────────────────────────────────────────────────
main().catch(err => {
  console.error('\n💥  Fatal error:', err.message);
  process.exit(1);
});
