/**
 * MalayaliBusiness.com — WordPress → Supabase Migration Script
 * =============================================================
 * Usage:
 *   node migrate.js                               — full live migration (REST API only)
 *   node migrate.js --deep-scrape                 — REST API + HTML scrape each listing page
 *   node migrate.js --test-scrape                 — scrape only, NO database writes
 *   node migrate.js --test-scrape --deep-scrape   — deep-scrape first 10, NO database writes
 *
 * Setup:
 *   1. Fill in scripts/.env  (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 *   2. npm install  (inside scripts/ directory)
 *   3. node migrate.js --test-scrape --deep-scrape   ← always test first
 *   4. node migrate.js --deep-scrape                 ← live run when happy
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
const DEEP_SCRAPE  = process.argv.includes('--deep-scrape');
const EXPORT_SQL   = process.argv.includes('--export-sql');   // NEW: generate SQL file
const IMPORT_LIMIT = parseInt(process.env.IMPORT_LIMIT || '0', 10) || null;

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL              = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SOURCE_URL                = 'https://www.malayalibusiness.com';
const LISTING_BASE_URL          = SOURCE_URL + '/listing/'; // individual page pattern
const MIGRATION_EMAIL           = 'migration-bot@malayalibusiness.com';
const MIGRATION_NAME            = 'Migration Bot';
const REQUEST_DELAY_MS          = 1000;  // between index/REST requests
const DEEP_SCRAPE_DELAY_MS      = 2000;  // between individual listing page fetches
const DEEP_SCRAPE_BATCH_SIZE    = 5;     // parallel listing pages per batch
const INSERT_BATCH_SIZE         = 10;

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

// ─── HTTP client ──────────────────────────────────────────────────────────────
const http = axios.create({
  timeout: 20000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; MalayaliBizMigration/1.0)',
    'Accept':     'text/html,application/json,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
  },
});

// =============================================================================
// CONSTANTS
// =============================================================================

const BLOCKED_KEYWORDS = [
  'casino', 'gambling', 'poker', 'slot', 'slots', 'betting',
  'jokery', 'megablock', 'spielen', 'spielautomaten',
  'roulette', 'blackjack', 'baccarat', 'jackpot', 'wager',
  'sportsbet', 'free spins', 'online casino', 'crypto casino',
];

const WP_CPT_SLUGS = [
  'gd_place', 'wpbdp_listing', 'listings', 'listing',
  'directory', 'business', 'places', 'posts',
];

// CSS selectors for directory index cards
const CARD_SELECTORS = [
  '.geodir-post-item', '.geodir-listing', '.wpbdp-listing',
  '.wpbdp-listing-summary', '.drts-entity', '.listing-item',
  '.business-listing', '.listing-card', '.business-card',
  'article.post', 'article.type-post',
];

// CSS selectors for "next page" link
const NEXT_PAGE_SELECTORS = [
  '.next.page-numbers', 'a.next', 'a[rel="next"]',
  '.pagination .next a', '.nav-links .next a',
  '.geodir-next-page a', '.wpbdp-pagination .next a',
];

// Emirates keyword → Supabase enum
const EMIRATE_MAP = [
  { patterns: ['dubai', 'dxb'],                               value: 'dubai' },
  { patterns: ['abu dhabi', 'abudhabi', 'abu-dhabi', ' ad '], value: 'abu_dhabi' },
  { patterns: ['sharjah', 'shj'],                             value: 'sharjah' },
  { patterns: ['ajman'],                                      value: 'ajman' },
  { patterns: ['ras al khaimah', 'rak'],                      value: 'ras_al_khaimah' },
  { patterns: ['fujairah'],                                   value: 'fujairah' },
  { patterns: ['umm al quwain', 'uaq'],                       value: 'umm_al_quwain' },
];

// Category keyword → Supabase category slug
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

const usedSlugs = new Set();

function makeSlug(name) {
  let base = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

  if (!base) base = 'listing';
  let candidate = base;
  let i = 2;
  while (usedSlugs.has(candidate)) candidate = `${base}-${i++}`;
  usedSlugs.add(candidate);
  return candidate;
}

function cleanPhone(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/[^\d+]/g, '');
  if (digits.length < 7) return null;
  if (digits.startsWith('00971')) return '+' + digits.slice(2);
  if (digits.startsWith('971') && !digits.startsWith('+')) return '+' + digits;
  if (/^0[45]/.test(digits)) return '+971' + digits.slice(1);
  return digits;
}

function cleanEmail(raw) {
  if (!raw) return null;
  const e = String(raw).trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

function cleanUrl(raw) {
  if (!raw) return null;
  const t = String(raw).trim();
  if (!t || t === '#' || t.startsWith('tel:') || t.startsWith('mailto:')) return null;
  // Reject obviously invalid values (single words with no dot, "No", "N/A", "none", etc.)
  const lower = t.toLowerCase().replace(/^https?:\/\//, '');
  if (/^(no|none|n\/a|na|null|undefined|yes|-)$/i.test(lower)) return null;
  // Must contain a dot in the domain part to be a valid URL
  if (!lower.includes('.')) return null;
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  return 'https://' + t;
}

function stripTags(html) {
  if (!html) return '';
  return cheerio.load(String(html)).text().replace(/\s+/g, ' ').trim();
}

// First non-empty value from a list
function firstVal(...vals) {
  for (const v of vals) {
    const s = (v || '').toString().trim();
    if (s && s !== 'undefined' && s !== 'null') return s;
  }
  return '';
}

function isBlocked(text) {
  if (!text) return false;
  const lower = String(text).toLowerCase();
  return BLOCKED_KEYWORDS.some(kw => lower.includes(kw));
}

function detectEmirate(text) {
  const lower = (text || '').toLowerCase();
  for (const entry of EMIRATE_MAP) {
    if (entry.patterns.some(p => lower.includes(p))) return entry.value;
  }
  // Return null if no UAE emirate detected — transform() will default to 'dubai'
  // This avoids tagging non-UAE listings (e.g. Oman, Saudi) as dubai
  return null;
}

function detectCategorySlug(text) {
  const lower = (text || '').toLowerCase();
  for (const entry of CATEGORY_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) return entry.slug;
  }
  return null;
}

// Extract a phone number from arbitrary text using regex
function extractPhoneFromText(text) {
  if (!text) return null;
  const match = String(text).match(
    /(\+971[\s\-.]?\d{2}[\s\-.]?\d{3}[\s\-.]?\d{4}|00971\d{9}|0[45]\d[\s\-.]?\d{3}[\s\-.]?\d{4})/
  );
  return match ? cleanPhone(match[0]) : null;
}

// Extract an email from arbitrary text using regex
function extractEmailFromText(text) {
  if (!text) return null;
  const match = String(text).match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match ? cleanEmail(match[0]) : null;
}

// =============================================================================
// PHASE 1A — WORDPRESS REST API
// =============================================================================

async function discoverWpCPTs() {
  try {
    const res   = await http.get(`${SOURCE_URL}/wp-json/wp/v2/types`);
    const types = Object.values(res.data || {});
    return types.filter(t => WP_CPT_SLUGS.includes((t.slug || t.name || '').toLowerCase()));
  } catch {
    return [];
  }
}

async function fetchAllFromEndpoint(endpoint) {
  const results = [];
  let page = 1, maxPage = 1;

  while (page <= maxPage) {
    try {
      const res = await http.get(endpoint, {
        params: { per_page: 100, page, _embed: true },
      });
      maxPage = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
      const items = Array.isArray(res.data) ? res.data : [];
      results.push(...items);
      console.log(`    Page ${page}/${maxPage} — ${items.length} items`);
      page++;
      if (page <= maxPage) await sleep(REQUEST_DELAY_MS);
    } catch (err) {
      const status = err.response && err.response.status;
      if (status === 400 || status === 404) break;
      console.warn(`    ⚠️  Page ${page} error: ${err.message}`);
      break;
    }
  }
  return results;
}

/**
 * Parse a WP REST API item.
 * Extracts everything available from the API response including:
 * - Basic fields (title, content, excerpt)
 * - _embedded terms (categories)
 * - _embedded featured_media (logo)
 * - meta fields (various plugin meta keys)
 * - acf (Advanced Custom Fields)
 */
function parseWpItem(item) {
  const embedded = item._embedded || {};
  const terms    = (embedded['wp:term'] || []).flat();
  const media    = (embedded['wp:featuredmedia'] || [])[0] || null;
  const meta     = item.meta || {};
  const acf      = item.acf  || {};

  // ── Name ──────────────────────────────────────────────────────────────────
  const name = stripTags(
    firstVal(item.title && item.title.rendered, item.title)
  );

  // ── Description ───────────────────────────────────────────────────────────
  const description = stripTags(
    firstVal(
      item.content && item.content.rendered,
      item.excerpt && item.excerpt.rendered,
      acf.description, acf.about, acf.overview,
      meta.description, meta._description
    )
  );

  // ── Category — from embedded WP terms ────────────────────────────────────
  const catTerms = terms.filter(t =>
    t.taxonomy === 'category'           ||
    t.taxonomy === 'gd_placecategory'   ||
    t.taxonomy === 'listing_category'   ||
    t.taxonomy === 'wpbdp_category'     ||
    t.taxonomy === 'business_category'
  );
  const category = catTerms.map(t => t.name).join(', ');

  // ── Tags ──────────────────────────────────────────────────────────────────
  const tagTerms = terms.filter(t =>
    t.taxonomy === 'post_tag' || t.taxonomy === 'listing_tag'
  );
  const tags = tagTerms.map(t => t.name).join(', ');

  // ── Phone ─────────────────────────────────────────────────────────────────
  // Try every common meta / ACF key used by directory plugins
  const rawPhone = firstVal(
    acf.phone, acf.telephone, acf.mobile, acf.phone_number, acf.contact_phone,
    meta.phone, meta._phone, meta.mobile, meta.telephone, meta.contact_phone,
    meta['geodir_phone'], meta['geo_phone'], meta['wpbdp-field-phone'],
    meta['listing_phone'], meta['business_phone']
  );
  const phone = cleanPhone(rawPhone) || extractPhoneFromText(description);

  // ── Email ─────────────────────────────────────────────────────────────────
  const rawEmail = firstVal(
    acf.email, acf.email_address, acf.contact_email,
    meta.email, meta._email, meta.email_address, meta.contact_email,
    meta['geodir_email'], meta['wpbdp-field-email'], meta['listing_email']
  );
  const email = cleanEmail(rawEmail) || extractEmailFromText(description);

  // ── Website ───────────────────────────────────────────────────────────────
  const rawWebsite = firstVal(
    acf.website, acf.website_url, acf.url, acf.web,
    meta.website, meta._website, meta.website_url, meta.url,
    meta['geodir_website'], meta['wpbdp-field-website'], meta['listing_website']
  );
  const website = cleanUrl(rawWebsite);

  // ── Address ───────────────────────────────────────────────────────────────
  const address = firstVal(
    acf.address, acf.full_address, acf.location, acf.street_address,
    meta.address, meta._address, meta.full_address, meta.location,
    meta['geodir_address'], meta['wpbdp-field-address'],
    meta.city, meta._city, meta.area, acf.city, acf.area
  );

  // ── Logo / Cover ──────────────────────────────────────────────────────────
  // featured_media gives us the main image
  let logoUrl = null;
  if (media) {
    logoUrl = media.source_url ||
      (media.media_details &&
       media.media_details.sizes &&
       (
         (media.media_details.sizes.medium && media.media_details.sizes.medium.source_url) ||
         (media.media_details.sizes.thumbnail && media.media_details.sizes.thumbnail.source_url)
       )) ||
      null;
  }
  // ACF image fields
  if (!logoUrl) {
    const acfImg = acf.logo || acf.image || acf.listing_image || acf.business_logo;
    logoUrl = (acfImg && typeof acfImg === 'object') ? acfImg.url || acfImg.src || null
            : (typeof acfImg === 'string') ? acfImg || null
            : null;
  }

  // ── Rating ────────────────────────────────────────────────────────────────
  const ratingRaw = firstVal(
    acf.rating, acf.average_rating,
    meta.rating, meta._rating, meta.average_rating, meta['geodir_rating']
  );
  const rating = Math.min(5, parseFloat(ratingRaw) || 0);

  // ── Listing page URL (for deep scrape second pass) ────────────────────────
  // GeoDirectory / most plugins use slug-based URLs
  const listingSlug    = item.slug || '';
  const listingPageUrl = listingSlug
    ? `${LISTING_BASE_URL}${listingSlug}/`
    : item.link || '';

  return {
    source:       'wp-api',
    sourceId:     String(item.id),
    sourceUrl:    item.link || listingPageUrl,
    listingSlug,
    listingPageUrl,
    name,
    description,
    category,
    tags,
    address,
    phone,
    email,
    website,
    logoUrl,
    coverUrl:     logoUrl,
    rating,
    rawText:      [name, description, category, tags, address].join(' '),
  };
}

// =============================================================================
// PHASE 1B — DEEP SCRAPE (individual listing pages via cheerio)
// =============================================================================

/**
 * Scrape a single listing detail page.
 * Returns every field we can find — caller merges with REST API data.
 *
 * Tries selectors for GeoDirectory, WP Business Directory,
 * Directories Pro, and generic WordPress themes.
 */
async function deepScrapePage(url) {
  const result = {
    phone: null, email: null, website: null,
    address: null, category: null, rating: 0,
    description: null, logoUrl: null, coverUrl: null,
    emirate: null, rawPageText: '',
  };

  let $;
  try {
    const res = await http.get(url);
    $ = cheerio.load(res.data);
  } catch (err) {
    throw new Error(`HTTP ${err.response ? err.response.status : 'timeout'}: ${err.message}`);
  }

  const bodyText = $('body').text();
  result.rawPageText = bodyText.replace(/\s+/g, ' ').slice(0, 3000);

  // ── Phone ─────────────────────────────────────────────────────────────────
  // 1. tel: href links — most reliable
  const telLink = $('a[href^="tel:"]').first().attr('href') || '';
  // 2. Schema.org
  const schemaTel = $('[itemprop="telephone"]').first().text().trim();
  // 3. Common class/data patterns across directory plugins
  const classPhone = $(
    '.geodir-field-phone, .gd-phone, .listing-phone, .business-phone,' +
    '.contact-phone, .phone-number, [class*="phone"], [data-phone],' +
    '.wpbdp-field-phone, .field-phone, .biz-phone, .detail-phone'
  ).first().text().trim();
  // 4. Regex scan of body text
  result.phone =
    cleanPhone(telLink.replace('tel:', '')) ||
    cleanPhone(schemaTel) ||
    cleanPhone(classPhone) ||
    extractPhoneFromText(bodyText);

  // ── Email ─────────────────────────────────────────────────────────────────
  const mailtoLink = ($('a[href^="mailto:"]').first().attr('href') || '').replace('mailto:', '');
  const schemaEmail = $('[itemprop="email"]').first().text().trim();
  const classEmail = $(
    '.geodir-field-email, .gd-email, .listing-email, .business-email,' +
    '.contact-email, [class*="email"], .wpbdp-field-email, .field-email'
  ).first().text().trim();
  result.email =
    cleanEmail(mailtoLink) ||
    cleanEmail(schemaEmail) ||
    cleanEmail(classEmail) ||
    extractEmailFromText(bodyText);

  // ── Website ───────────────────────────────────────────────────────────────
  const schemaUrl = $('[itemprop="url"]').first().attr('href') || '';
  const classWebsite = $(
    'a.listing-website, a.website-link, a.business-website,' +
    '.geodir-website a, .geodir-field-website a,' +
    '.wpbdp-field-website a, [class*="website"] a, .biz-website a,' +
    'a[rel="nofollow"][target="_blank"]:not([href*="wa.me"]):not([href*="whatsapp"])'
  ).first().attr('href') || '';
  result.website = cleanUrl(schemaUrl) || cleanUrl(classWebsite);
  // Remove self-referential URLs
  if (result.website && result.website.includes('malayalibusiness.com')) {
    result.website = null;
  }

  // ── Address ───────────────────────────────────────────────────────────────
  const schemaAddress = $('[itemprop="address"], [itemprop="streetAddress"]').first().text().trim();
  const classAddress = $(
    '.geodir-field-address, .gd-address, .listing-address, .business-address,' +
    '.address, .location, [class*="address"], [class*="location"],' +
    '.wpbdp-field-address, .field-address, .biz-location, .detail-address'
  ).first().text().trim();
  const geoMeta = $('meta[name="geo.placename"]').attr('content') || '';
  result.address = firstVal(schemaAddress, classAddress, geoMeta);

  // ── WhatsApp (extract phone if not yet found) ─────────────────────────────
  if (!result.phone) {
    const waLink = $('a[href*="wa.me"], a[href*="whatsapp"]').first().attr('href') || '';
    if (waLink) {
      const waMatch = waLink.match(/wa\.me\/(\d+)/);
      if (waMatch) result.phone = cleanPhone(waMatch[1]);
    }
  }

  // ── Category ──────────────────────────────────────────────────────────────
  const catLinks = $(
    '.geodir-categories a, .gd-category a, .listing-category a,' +
    '.wpbdp-field-category a, .cat-links a, .entry-categories a,' +
    '[rel="category tag"], .business-category, .category-name,' +
    '.breadcrumb li:nth-last-child(2) a'
  );
  const catNames = [];
  catLinks.each(function () { catNames.push($(this).text().trim()); });
  result.category = catNames.filter(Boolean).join(', ');

  // ── Rating ────────────────────────────────────────────────────────────────
  const schemaRating = $('[itemprop="ratingValue"]').first().text().trim();
  const dataRating   = $(
    '.geodir-star-rating, .gd-rating, .listing-rating, .star-rating,' +
    '[data-rating], [class*="rating"]'
  ).first().attr('data-rating') || '';
  const classRating  = $(
    '.geodir-star-rating, .gd-rating, .rating-value, [itemprop="ratingValue"]'
  ).first().text().trim();
  result.rating = Math.min(5, parseFloat(schemaRating || dataRating || classRating) || 0);

  // ── Description ───────────────────────────────────────────────────────────
  const schemaDesc = $('[itemprop="description"]').first().text().trim();
  const classDesc  = $(
    '.geodir-post-description, .gd-description, .listing-description,' +
    '.business-description, .about-business, .entry-content,' +
    '.listing-content, .post-content, .wpbdp-field-description,' +
    '.field-description, .overview, .business-about, .listing-about'
  ).first().text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const ogDesc   = $('meta[property="og:description"]').attr('content') || '';
  result.description = firstVal(schemaDesc, classDesc, metaDesc, ogDesc).slice(0, 2000);

  // ── Logo / Business image ─────────────────────────────────────────────────
  // Priority: schema logo → specific class → og:image → first big image
  const schemaLogo = $('[itemprop="logo"] img').attr('src') ||
                     $('[itemprop="logo"]').attr('src') || '';
  const classLogo  = $(
    '.listing-logo img, .business-logo img, .company-logo img,' +
    '.geodir-post-image img, .gd-post-image img,' +
    '.listing-thumbnail img, .biz-logo img'
  ).first().attr('src') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  // First <img> inside the listing header/hero area
  const heroImg = $(
    '.listing-header img, .listing-hero img, .geodir-image img,' +
    '.gd-post-images img, .listing-gallery img'
  ).first().attr('src') || '';

  // Filter out empty/placeholder SVG data URIs (0×0 viewBox = no real image)
  const cleanLogo = (u) => (!u || u.startsWith('data:') ? null : u);
  result.logoUrl  = cleanLogo(firstVal(schemaLogo, classLogo, ogImage)) || null;
  result.coverUrl = cleanLogo(firstVal(ogImage, heroImg, schemaLogo, classLogo)) || null;

  // ── Emirate detection ─────────────────────────────────────────────────────
  const emirateText = [result.address, result.rawPageText.slice(0, 500)].join(' ');
  result.emirate = detectEmirate(emirateText);

  return result;
}

/**
 * Run deepScrapePage for a batch of items (5 at a time, 2 s between batches).
 * Mutates each item in-place, merging scraped data with REST API data.
 * HTML page data wins over REST API data when both are present.
 */
async function deepScrapeInBatches(items, label) {
  const total = items.length;
  let   done  = 0;

  for (let i = 0; i < total; i += DEEP_SCRAPE_BATCH_SIZE) {
    const batch = items.slice(i, i + DEEP_SCRAPE_BATCH_SIZE);

    // Fetch batch items sequentially (polite to server, easier error handling)
    for (const item of batch) {
      const pageUrl = item.listingPageUrl || item.sourceUrl || '';
      if (!pageUrl) {
        item._deepScrapeSkipped = 'no URL';
        done++;
        continue;
      }

      try {
        const scraped = await deepScrapePage(pageUrl);

        // Merge: page-scraped data wins when it has a value
        item.phone       = scraped.phone       || item.phone       || null;
        item.email       = scraped.email       || item.email       || null;
        item.website     = scraped.website     || item.website     || null;
        item.address     = scraped.address     || item.address     || '';
        item.category    = scraped.category    || item.category    || '';
        item.rating      = scraped.rating      || item.rating      || 0;
        item.description = scraped.description || item.description || '';
        item.logoUrl     = scraped.logoUrl     || item.logoUrl     || null;
        item.coverUrl    = scraped.coverUrl    || item.coverUrl    || null;
        item._scraped    = true;

        // Rebuild rawText with freshly scraped content
        item.rawText = [
          item.name, item.description, item.category, item.address,
          scraped.rawPageText.slice(0, 500),
        ].join(' ');

        done++;
        process.stdout.write(`\r  ${label}: ${done}/${total} deep-scraped   `);

      } catch (err) {
        item._deepScrapeError = err.message;
        done++;
        process.stdout.write(`\r  ${label}: ${done}/${total} (${err.message.slice(0, 40)})   `);
      }

      await sleep(DEEP_SCRAPE_DELAY_MS);
    }

    // Extra pause between batches of 5
    if (i + DEEP_SCRAPE_BATCH_SIZE < total) {
      await sleep(DEEP_SCRAPE_DELAY_MS);
    }
  }
  console.log('');
}

// =============================================================================
// PHASE 1C — HTML INDEX SCRAPER (fallback if REST API returns nothing)
// =============================================================================

async function findDirectoryIndexUrl() {
  const candidates = [
    SOURCE_URL + '/directory/', SOURCE_URL + '/listings/',
    SOURCE_URL + '/business-directory/', SOURCE_URL + '/businesses/',
    SOURCE_URL + '/places/', SOURCE_URL + '/',
  ];
  for (const url of candidates) {
    try {
      const res = await http.get(url);
      const $   = cheerio.load(res.data);
      for (const sel of CARD_SELECTORS) {
        if ($(sel).length > 0) {
          console.log(`  📂  Directory index: ${url}  (selector: "${sel}")`);
          return url;
        }
      }
    } catch { /* try next */ }
    await sleep(500);
  }
  return SOURCE_URL + '/';
}

async function scrapeIndexPage(url) {
  const listingUrls = [];
  let   nextPageUrl = null;
  try {
    const res = await http.get(url);
    const $   = cheerio.load(res.data);
    let cards = null;
    for (const sel of CARD_SELECTORS) {
      const found = $(sel);
      if (found.length > 0) { cards = found; break; }
    }
    if (cards && cards.length > 0) {
      cards.each(function () {
        const link = $(this).find('a').first().attr('href') ||
                     $(this).closest('a').attr('href');
        if (link && link.startsWith('http') && !link.includes('#')) {
          listingUrls.push(link);
        }
      });
    } else {
      $('a[href]').each(function () {
        const href = $(this).attr('href') || '';
        if (href.startsWith(SOURCE_URL) &&
            (href.includes('/listing/') || href.includes('/business/') ||
             href.includes('/place/')   || href.includes('/directory/'))) {
          listingUrls.push(href);
        }
      });
    }
    for (const sel of NEXT_PAGE_SELECTORS) {
      const next = $(sel).attr('href');
      if (next) { nextPageUrl = next; break; }
    }
  } catch (err) {
    console.warn(`  ⚠️  Index page error (${url}): ${err.message}`);
  }
  return { listingUrls: [...new Set(listingUrls)], nextPageUrl };
}

async function scrapeDetailPageFallback(url) {
  const res = await http.get(url);
  const $   = cheerio.load(res.data);

  const name = $('h1.listing-title, h1.entry-title, .geodir-post-title h1, h1').first().text().trim() ||
               $('meta[property="og:title"]').attr('content') || '';

  const scraped = await deepScrapePage(url).catch(() => ({}));

  return {
    source:      'html',
    sourceUrl:   url,
    listingPageUrl: url,
    name:        name.trim(),
    description: scraped.description || '',
    category:    scraped.category    || '',
    address:     scraped.address     || '',
    phone:       scraped.phone       || null,
    email:       scraped.email       || null,
    website:     scraped.website     || null,
    logoUrl:     scraped.logoUrl     || null,
    coverUrl:    scraped.coverUrl    || null,
    rating:      scraped.rating      || 0,
    rawText:     [name, scraped.description, scraped.category, scraped.address].join(' '),
    _scraped:    true,
  };
}

// =============================================================================
// PHASE 2 — TRANSFORM (raw → Supabase listings row)
// =============================================================================

function transform(raw, categoryIdMap, ownerId) {
  const emirate    = raw.emirate || detectEmirate(raw.address + ' ' + raw.rawText) || 'dubai';
  const catSlug    = detectCategorySlug(raw.category + ' ' + raw.rawText);
  const categoryId = catSlug ? categoryIdMap[catSlug] : null;
  const slug       = makeSlug(raw.name);

  return {
    owner_id:     ownerId,
    category_id:  categoryId || null,
    slug,
    name:         (raw.name || '').slice(0, 255),
    description:  (raw.description || '').slice(0, 5000) || null,
    phone:        raw.phone   || null,
    email:        raw.email   || null,
    website:      raw.website || null,
    logo_url:     raw.logoUrl  || null,
    cover_url:    raw.coverUrl || null,
    gallery_urls: [],
    emirate,
    plan:         'basic',
    status:       'pending',
    is_featured:  false,
    is_verified:  false,
    rating_avg:   raw.rating || 0,
    review_count: 0,
    languages:    ['English', 'Malayalam'],
    services:     raw.sourceUrl ? [`source:${raw.sourceUrl}`] : [],
  };
}

// =============================================================================
// PHASE 2b — SQL EXPORT  (--export-sql flag)
// Generates a ready-to-run migration.sql file.
// Paste it into Supabase → SQL Editor → Run.  No API keys needed.
// =============================================================================

function esc(v) {
  // Escape a value for a SQL string literal
  if (v === null || v === undefined) return 'NULL';
  return "'" + String(v).replace(/'/g, "''") + "'";
}

function escArr(arr) {
  // Escape a text[] array literal
  if (!arr || !arr.length) return "'{}'";
  return "ARRAY[" + arr.map(esc).join(', ') + "]";
}

async function exportToSql(cleanItems) {
  const MIGRATION_BOT_ID = '00000000-0000-0000-0000-000000000099';
  const MIGRATION_EMAIL  = 'migration-bot@malayalibusiness.com';

  const lines = [];

  lines.push('-- =========================================================');
  lines.push('-- MalayaliBusiness.com — WordPress data import');
  lines.push(`-- Generated : ${new Date().toISOString()}`);
  lines.push(`-- Listings  : ${cleanItems.length}`);
  lines.push('-- Run this in: Supabase → SQL Editor → Run');
  lines.push('-- =========================================================');
  lines.push('');

  // 1. Migration bot user
  lines.push('-- STEP 1: Create migration-bot auth user');
  lines.push(`INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password,`);
  lines.push(`  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,`);
  lines.push(`  confirmation_token, recovery_token, email_change, email_change_token_new, is_super_admin)`);
  lines.push(`VALUES (`);
  lines.push(`  '${MIGRATION_BOT_ID}', '00000000-0000-0000-0000-000000000000',`);
  lines.push(`  'authenticated', 'authenticated',`);
  lines.push(`  '${MIGRATION_EMAIL}',`);
  lines.push(`  '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012',`);
  lines.push(`  now(), '{"provider":"email","providers":["email"]}',`);
  lines.push(`  '{"full_name":"Migration Bot"}',`);
  lines.push(`  now(), now(), '', '', '', '', false`);
  lines.push(`) ON CONFLICT (id) DO NOTHING;`);
  lines.push('');

  // 2. Migration bot profile
  lines.push('-- STEP 2: Create migration-bot profile');
  lines.push(`INSERT INTO profiles (id, email, full_name, username)`);
  lines.push(`VALUES ('${MIGRATION_BOT_ID}', '${MIGRATION_EMAIL}', 'Migration Bot', 'migration-bot')`);
  lines.push(`ON CONFLICT (id) DO NOTHING;`);
  lines.push('');

  // 3. Category slug → id lookup via a temp variable block
  lines.push('-- STEP 3: Insert listings');
  lines.push('DO $$');
  lines.push('DECLARE');
  lines.push(`  _owner uuid := '${MIGRATION_BOT_ID}';`);
  // Category vars
  const CATEGORY_SLUGS = [
    'restaurants-food', 'grocery-supermarket', 'real-estate', 'healthcare-medical',
    'education-training', 'beauty-wellness', 'technology-it', 'construction-interiors',
    'retail-fashion', 'legal-finance', 'travel-tourism', 'automotive',
  ];
  for (const slug of CATEGORY_SLUGS) {
    const varName = 'cat_' + slug.replace(/-/g, '_');
    lines.push(`  ${varName} uuid;`);
  }
  lines.push('BEGIN');
  for (const slug of CATEGORY_SLUGS) {
    const varName = 'cat_' + slug.replace(/-/g, '_');
    lines.push(`  SELECT id INTO ${varName} FROM categories WHERE slug = '${slug}';`);
  }
  lines.push('');

  // CATEGORY_MAP mirrors the one in migrate.js — map each listing to a category var
  const CATEGORY_MAP_SQL = [
    { slug: 'restaurants-food',      keywords: ['restaurant','food','cafe','coffee','catering','kitchen','bakery','pizza','burger','biryani','meal','dining','eatery','snack','juice','grill','bbq','seafood','kerala food'] },
    { slug: 'grocery-supermarket',   keywords: ['grocery','supermarket','hypermarket','market','provisions','wholesale','fruits','vegetables'] },
    { slug: 'real-estate',           keywords: ['real estate','property','realty','apartment','villa','rental','lease','mortgage','brokerage','housing','land','plot'] },
    { slug: 'healthcare-medical',    keywords: ['health','medical','clinic','hospital','doctor','pharmacy','dental','dentist','physiotherapy','optician','laboratory','diagnostic','nursing','wellness center','ayurved'] },
    { slug: 'education-training',    keywords: ['education','school','college','university','tutor','coaching','training','institute','academy','language','computer class','driving school'] },
    { slug: 'beauty-wellness',       keywords: ['beauty','salon','spa','hair','skin','facial','massage','nail','waxing','mehendi','bridal','makeup','barber','wellness','gym','fitness','yoga','pilates'] },
    { slug: 'technology-it',         keywords: ['technology','tech','it ','software','app','web','digital','computer','laptop','phone repair','networking','cloud','cyber','ai ','startup','ecommerce','pos','billing'] },
    { slug: 'construction-interiors',keywords: ['construction','interior','renovation','contracting','building','architecture','plumbing','electrical','painting','flooring','landscaping','fit-out','aluminium','glass','ac installation','hvac'] },
    { slug: 'retail-fashion',        keywords: ['retail','fashion','clothing','apparel','textile','shoes','footwear','jewellery','jewelry','accessories','boutique','garment','uniform','gift','printing'] },
    { slug: 'legal-finance',         keywords: ['legal','law','finance','accounting','audit','tax','chartered','financial','insurance','investment','bank','money','forex','consulting','advisory','business setup','visa','typing'] },
    { slug: 'travel-tourism',        keywords: ['travel','tourism','airline','hotel','holiday','tour','holiday','vacation','ticketing','hajj','umrah','cargo','logistics','shipping','freight','movers','transport'] },
    { slug: 'automotive',            keywords: ['auto','car','vehicle','garage','workshop','tyre','spare','motor','rent a car','driving'] },
  ];

  function detectCatVar(raw) {
    const lower = (raw || '').toLowerCase();
    for (const entry of CATEGORY_MAP_SQL) {
      if (entry.keywords.some(kw => lower.includes(kw))) {
        return 'cat_' + entry.slug.replace(/-/g, '_');
      }
    }
    return 'NULL'; // no category matched
  }

  for (const item of cleanItems) {
    const emirate   = item.emirate || detectEmirate((item.address || '') + ' ' + (item.rawText || '')) || 'dubai';
    const slug      = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
    const name      = (item.name || '').slice(0, 255);
    const desc      = (item.description || '').slice(0, 5000);
    const catVar    = detectCatVar((item.category || '') + ' ' + (item.rawText || ''));
    const catExpr   = catVar === 'NULL' ? 'NULL' : catVar;
    const services  = item.sourceUrl ? [`source:${item.sourceUrl}`] : (item.listingPageUrl ? [`source:${item.listingPageUrl}`] : []);

    lines.push(`  INSERT INTO listings (`);
    lines.push(`    owner_id, category_id, slug, name, description,`);
    lines.push(`    phone, email, website, logo_url, cover_url,`);
    lines.push(`    address, emirate, plan, status, is_featured, is_verified,`);
    lines.push(`    rating_avg, review_count, languages, services, gallery_urls`);
    lines.push(`  ) VALUES (`);
    lines.push(`    _owner, ${catExpr}, ${esc(slug)}, ${esc(name)}, ${esc(desc || null)},`);
    lines.push(`    ${esc(item.phone || null)}, ${esc(item.email || null)}, ${esc(item.website || null)},`);
    lines.push(`    ${esc(item.logoUrl || null)}, ${esc(item.coverUrl || null)},`);
    lines.push(`    ${esc(item.address || null)}, '${emirate}', 'basic', 'pending', false, false,`);
    lines.push(`    ${item.rating || 0}, 0,`);
    lines.push(`    ${escArr(['English', 'Malayalam'])},`);
    lines.push(`    ${escArr(services)},`);
    lines.push(`    '{}'`);
    lines.push(`  ) ON CONFLICT (slug) DO NOTHING;`);
    lines.push('');
  }

  lines.push('END;');
  lines.push('$$;');
  lines.push('');
  lines.push(`-- Done. ${cleanItems.length} listings inserted (duplicates skipped via ON CONFLICT).`);

  const outPath = path.join(__dirname, 'migration.sql');
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`\n✅  SQL file written: scripts/migration.sql  (${kb} KB)`);
  console.log(`\n   Next steps:`);
  console.log(`   1. Go to: https://supabase.com/dashboard/project/huhtrnmdnypljrsjhzty/sql/new`);
  console.log(`   2. Open scripts/migration.sql in any text editor`);
  console.log(`   3. Select All → Copy → Paste into SQL Editor → Click RUN`);
  console.log(`   4. Done! Check Table Editor → listings\n`);
}

// =============================================================================
// PHASE 3 — SUPABASE SETUP
// =============================================================================

async function getOrCreateMigrationUser() {
  console.log('\n👤  Setting up migration system user...');

  const { data: existing } = await supabase
    .from('profiles').select('id').eq('email', MIGRATION_EMAIL).maybeSingle();

  if (existing && existing.id) {
    console.log(`  ✅  Found existing profile: ${existing.id}`);
    return existing.id;
  }

  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email:         MIGRATION_EMAIL,
    email_confirm: true,
    user_metadata: { full_name: MIGRATION_NAME },
    password:      'Mig!' + Math.random().toString(36).slice(2) + 'Aa9',
  });

  if (authErr) {
    if (authErr.message && (authErr.message.includes('already') || authErr.message.includes('exists'))) {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const found = users.find(u => u.email === MIGRATION_EMAIL);
      if (found) {
        await supabase.from('profiles').upsert({
          id: found.id, email: MIGRATION_EMAIL,
          full_name: MIGRATION_NAME, username: 'migration-bot',
        });
        console.log(`  ✅  Reused auth user: ${found.id}`);
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

async function loadCategoryMap() {
  const { data, error } = await supabase.from('categories').select('id, slug');
  if (error) throw new Error('Could not load categories: ' + error.message);
  const map = {};
  for (const c of data) map[c.slug] = c.id;
  console.log(`  📁  Loaded ${data.length} categories`);
  return map;
}

// =============================================================================
// PHASE 4 — INSERT (batched + row-by-row fallback)
// =============================================================================

async function insertBatch(rows) {
  const { data, error } = await supabase
    .from('listings').insert(rows).select('id, slug, name');
  return { data, error };
}

async function insertRowByRow(rows, report, errors) {
  for (const row of rows) {
    const { data, error } = await supabase
      .from('listings').insert([row]).select('id, slug, name').maybeSingle();
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
  const flags = [
    TEST_SCRAPE  && '🔵 TEST-SCRAPE',
    DEEP_SCRAPE  && '🔍 DEEP-SCRAPE',
    !TEST_SCRAPE && !DEEP_SCRAPE && '🟢 LIVE',
  ].filter(Boolean).join(' + ');

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  MalayaliBusiness  WordPress → Supabase Migration ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(` Source  : ${SOURCE_URL}`);
  console.log(` Target  : ${SUPABASE_URL}`);
  console.log(` Mode    : ${flags}`);
  if (IMPORT_LIMIT) console.log(` Limit   : ${IMPORT_LIMIT} listings`);
  console.log('');

  const report = {
    startedAt: new Date().toISOString(),
    mode: flags,
    totalScraped: 0, totalBlocked: 0, totalInserted: 0, totalFailed: 0,
    inserted: [],
  };
  const errors = [];

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1 — COLLECT RAW ITEMS
  // ─────────────────────────────────────────────────────────────────────────
  console.log('━━━  Step 1: Collect listings  ━━━━━━━━━━━━━━━━━━━━\n');

  const rawItems = [];

  // ── 1A: WordPress REST API ────────────────────────────────────────────────
  console.log('  Trying WordPress REST API...');
  const cptTypes = await discoverWpCPTs();

  if (cptTypes.length > 0) {
    console.log(`  Found post types: ${cptTypes.map(t => t.slug).join(', ')}\n`);

    for (const cpt of cptTypes) {
      const endpoint = `${SOURCE_URL}/wp-json/wp/v2/${cpt.rest_base || cpt.slug}`;
      console.log(`  → ${endpoint}`);
      await sleep(REQUEST_DELAY_MS);

      const items = await fetchAllFromEndpoint(endpoint);
      for (const item of items) {
        try { rawItems.push(parseWpItem(item)); } catch { /* skip bad item */ }
      }
      console.log(`  Subtotal after "${cpt.slug}": ${rawItems.length}\n`);
    }
  } else {
    console.log('  REST API unavailable — switching to HTML scraper\n');
  }

  // ── 1B: HTML fallback if REST gave nothing ────────────────────────────────
  if (rawItems.length === 0) {
    console.log('  Starting HTML index scraper...');
    const indexUrl      = await findDirectoryIndexUrl();
    let   currentUrl    = indexUrl;
    let   pageNumber    = 1;
    const visited       = new Set();
    const allDetailUrls = new Set();

    while (currentUrl && !visited.has(currentUrl)) {
      visited.add(currentUrl);
      console.log(`\n  Index page ${pageNumber}: ${currentUrl}`);
      const { listingUrls, nextPageUrl } = await scrapeIndexPage(currentUrl);
      listingUrls.forEach(u => allDetailUrls.add(u));
      console.log(`  Collected ${allDetailUrls.size} URLs`);
      currentUrl = nextPageUrl && !visited.has(nextPageUrl) ? nextPageUrl : null;
      pageNumber++;
      if (currentUrl) await sleep(REQUEST_DELAY_MS);
      if (pageNumber > 200) { console.warn('  ⚠️  Stopped at 200 index pages'); break; }
    }

    console.log(`\n  Scraping ${allDetailUrls.size} detail pages...`);
    let count = 0;
    for (const url of allDetailUrls) {
      if (IMPORT_LIMIT && count >= IMPORT_LIMIT) break;
      await sleep(REQUEST_DELAY_MS);
      try {
        const item = await scrapeDetailPageFallback(url);
        if (item.name && item.name.length >= 3) {
          rawItems.push(item);
          count++;
          process.stdout.write(`\r  Scraped: ${count}/${allDetailUrls.size}   `);
        }
      } catch (err) {
        errors.push({ name: url, reason: 'Scrape: ' + err.message });
      }
      if (TEST_SCRAPE && count >= 10) {
        console.log('\n  [test-scrape] Stopped at 10'); break;
      }
    }
    console.log('');
  }

  report.totalScraped = rawItems.length;
  console.log(`\n  ✅  Collected ${rawItems.length} raw items`);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2 — DEEP SCRAPE (second pass on individual listing pages)
  // ─────────────────────────────────────────────────────────────────────────
  if (DEEP_SCRAPE && rawItems.length > 0) {
    console.log('\n━━━  Step 2: Deep scrape listing pages  ━━━━━━━━━━━\n');

    // Limit to first 10 when combined with --test-scrape
    const itemsToScrape = TEST_SCRAPE
      ? rawItems.slice(0, 10)
      : (IMPORT_LIMIT ? rawItems.slice(0, IMPORT_LIMIT) : rawItems);

    console.log(`  Fetching ${itemsToScrape.length} listing pages`);
    console.log(`  Batch size: ${DEEP_SCRAPE_BATCH_SIZE}  |  Delay: ${DEEP_SCRAPE_DELAY_MS}ms\n`);

    await deepScrapeInBatches(itemsToScrape, 'Deep scrape');

    const succeeded = itemsToScrape.filter(i => i._scraped).length;
    const failed    = itemsToScrape.filter(i => i._deepScrapeError).length;
    const skipped   = itemsToScrape.filter(i => i._deepScrapeSkipped).length;
    console.log(`  ✅  Succeeded: ${succeeded}  |  ❌  Failed: ${failed}  |  ⏭️  Skipped: ${skipped}`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3 — FILTER
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n━━━  Step 3: Filter spam/gambling  ━━━━━━━━━━━━━━━━\n');

  const cleanItems = [];
  for (const item of rawItems) {
    if (!item.name || item.name.length < 2) continue; // no name → skip silently
    if (isBlocked(item.rawText)) {
      report.totalBlocked++;
      console.log(`  🚫  "${item.name.slice(0, 70)}"`);
    } else {
      cleanItems.push(item);
    }
  }
  console.log(`\n  ✅  ${cleanItems.length} clean  |  ${report.totalBlocked} blocked`);

  // ─────────────────────────────────────────────────────────────────────────
  // TEST-SCRAPE exit — print findings, no DB writes
  // ─────────────────────────────────────────────────────────────────────────
  if (TEST_SCRAPE) {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║       TEST-SCRAPE RESULTS  (no DB writes)          ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    const preview = cleanItems.slice(0, DEEP_SCRAPE ? 10 : 10);
    preview.forEach((item, i) => {
      const deepFlag = item._scraped ? ' ✓ deep' : item._deepScrapeError ? ' ✗ deep' : '';
      console.log(`\n  ── Listing ${i + 1}${deepFlag}  ${'─'.repeat(38)}`);
      console.log(`  Name     : ${item.name}`);
      console.log(`  Category : ${item.category || '(none)'}`);
      console.log(`  Address  : ${item.address  || '(none)'}`);
      console.log(`  Emirate  : ${item.emirate  || detectEmirate(item.rawText)}`);
      console.log(`  Phone    : ${item.phone    || '(none)'}`);
      console.log(`  Email    : ${item.email    || '(none)'}`);
      console.log(`  Website  : ${item.website  || '(none)'}`);
      console.log(`  Logo     : ${item.logoUrl  || '(none)'}`);
      console.log(`  Rating   : ${item.rating   || '(none)'}`);
      console.log(`  Desc     : ${(item.description || '').slice(0, 120)}${item.description && item.description.length > 120 ? '…' : ''}`);
      console.log(`  Source   : ${item.listingPageUrl || item.sourceUrl || item.source}`);
      if (item._deepScrapeError) console.log(`  ⚠️  Deep err: ${item._deepScrapeError}`);
    });

    console.log(`\n  Total collected : ${rawItems.length}`);
    console.log(`  Total blocked   : ${report.totalBlocked}`);
    console.log(`  Ready to import : ${cleanItems.length}`);

    if (!DEEP_SCRAPE) {
      console.log('\n  💡  Re-run with --deep-scrape to populate empty fields:');
      console.log('      node migrate.js --test-scrape --deep-scrape\n');
    } else {
      const withPhone   = cleanItems.filter(i => i.phone).length;
      const withEmail   = cleanItems.filter(i => i.email).length;
      const withWebsite = cleanItems.filter(i => i.website).length;
      const withDesc    = cleanItems.filter(i => i.description && i.description.length > 20).length;
      console.log('\n  Field coverage after deep scrape:');
      console.log(`   Phone   : ${withPhone}/${cleanItems.length} (${Math.round(withPhone/cleanItems.length*100)||0}%)`);
      console.log(`   Email   : ${withEmail}/${cleanItems.length} (${Math.round(withEmail/cleanItems.length*100)||0}%)`);
      console.log(`   Website : ${withWebsite}/${cleanItems.length} (${Math.round(withWebsite/cleanItems.length*100)||0}%)`);
      console.log(`   Desc    : ${withDesc}/${cleanItems.length} (${Math.round(withDesc/cleanItems.length*100)||0}%)`);
      console.log('\n  ✅  Remove --test-scrape to import into Supabase.\n');
    }
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORT-SQL exit — write migration.sql, no DB connection needed
  // ─────────────────────────────────────────────────────────────────────────
  if (EXPORT_SQL) {
    console.log('\n━━━  Step 4: Export SQL file  ━━━━━━━━━━━━━━━━━━━━\n');
    await exportToSql(cleanItems);
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 4 — TRANSFORM
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n━━━  Step 4: Transform to Supabase schema  ━━━━━━━━\n');

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
      errors.push({ name: cleanItems[i].name, reason: 'Transform: ' + err.message });
    }
  }
  console.log(`  ✅  ${dbRows.length} rows ready`);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 5 — INSERT
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`\n━━━  Step 5: Insert into Supabase  ━━━━━━━━━━━━━━━━\n`);
  console.log(`  ${dbRows.length} rows → batches of ${INSERT_BATCH_SIZE}  |  ${REQUEST_DELAY_MS}ms delay\n`);

  const totalBatches = Math.ceil(dbRows.length / INSERT_BATCH_SIZE);

  for (let i = 0; i < dbRows.length; i += INSERT_BATCH_SIZE) {
    const batch    = dbRows.slice(i, i + INSERT_BATCH_SIZE);
    const batchNum = Math.floor(i / INSERT_BATCH_SIZE) + 1;
    process.stdout.write(`\r  Batch ${batchNum}/${totalBatches} ...   `);

    const { data, error } = await insertBatch(batch);

    if (error) {
      process.stdout.write(`  ⚠️  batch ${batchNum} failed, retrying row-by-row\n`);
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

    if (i + INSERT_BATCH_SIZE < dbRows.length) await sleep(REQUEST_DELAY_MS);
  }
  console.log('');

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 6 — WRITE REPORTS
  // ─────────────────────────────────────────────────────────────────────────
  report.finishedAt    = new Date().toISOString();
  report.totalInserted = report.inserted.length;
  report.totalFailed   = errors.length;

  const reportPath = path.join(__dirname, 'migration-report.json');
  const errorPath  = path.join(__dirname, 'error-log.json');

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(errorPath,  JSON.stringify({ generatedAt: new Date().toISOString(), errors }, null, 2));

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║                 Migration Complete                 ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(` Scraped  : ${report.totalScraped}`);
  console.log(` Blocked  : ${report.totalBlocked}  (gambling/spam)`);
  console.log(` Inserted : ${report.totalInserted}  ✅`);
  console.log(` Failed   : ${report.totalFailed}`);
  console.log(`\n 📄  ${reportPath}`);
  console.log(` 📋  ${errorPath}\n`);
}

main().catch(err => {
  console.error('\n💥  Fatal error:', err.message);
  process.exit(1);
});
