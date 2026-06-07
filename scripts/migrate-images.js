/**
 * MalayaliBusiness.com — Image Migration Script
 * ==============================================
 * Downloads every logo/cover image from the WordPress site and
 * uploads them to Supabase Storage, then generates update-images.sql
 * with UPDATE statements to swap all URLs in the listings table.
 *
 * Usage:
 *   node migrate-images.js                  — full run (download + upload + generate SQL)
 *   node migrate-images.js --dry-run        — download only, no uploads, shows what would happen
 *
 * Prerequisites:
 *   1. Run schema (002_production_schema.sql) in Supabase SQL Editor
 *   2. Run migration.sql in Supabase SQL Editor  (listings must exist first)
 *   3. scripts/.env must have SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * Output:
 *   scripts/images/           — downloaded images (kept as local backup)
 *   scripts/update-images.sql — run this in Supabase SQL Editor to update URLs
 */

'use strict';

require('dotenv').config({ path: __dirname + '/.env' });

const fs   = require('fs');
const path = require('path');
const http = require('https');
const httpPlain = require('http');
const axios = require('axios');

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL  = process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN       = process.argv.includes('--dry-run');
const DELAY_MS      = 500;   // between downloads (be polite to WP server)
const BATCH_SIZE    = 10;    // concurrent uploads to Supabase Storage
const IMAGES_DIR    = path.join(__dirname, 'images');
const SQL_OUT       = path.join(__dirname, 'update-images.sql');
const REPORT_OUT    = path.join(__dirname, 'image-report.json');

// Supabase Storage bucket names (must exist — created in setup below)
const BUCKET_LOGOS  = 'logos';
const BUCKET_COVERS = 'covers';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('\n❌  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in scripts/.env\n');
  process.exit(1);
}

// Strip trailing slash from URL
const BASE = SUPABASE_URL.replace(/\/$/, '');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function safeFilename(url) {
  // Turn URL into a safe local filename while preserving extension
  try {
    const u    = new URL(url);
    const base = path.basename(u.pathname);          // e.g. logo-123.jpg
    const ext  = path.extname(base) || '.jpg';
    // Use last two path segments + hash of full URL for uniqueness
    const hash = Buffer.from(url).toString('base64').slice(-8).replace(/[^a-zA-Z0-9]/g, '');
    return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60) + '_' + hash + ext;
  } catch {
    return 'image_' + Date.now() + '.jpg';
  }
}

function mimeFromExt(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
                '.gif': 'image/gif',  '.webp': 'image/webp', '.svg': 'image/svg+xml' };
  return map[ext] || 'image/jpeg';
}

function isValidImageUrl(url) {
  if (!url) return false;
  if (url.startsWith('data:')) return false;        // inline SVG / base64
  if (!url.startsWith('http')) return false;
  try { new URL(url); return true; } catch { return false; }
}

// ─── Download a single image to disk ─────────────────────────────────────────
async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? http : httpPlain;
    const req = mod.get(url, { timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MigrationBot/1.0)' }
    }, (res) => {
      // Follow one redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const ct = res.headers['content-type'] || '';
      if (!ct.startsWith('image/')) return reject(new Error(`Not an image: ${ct}`));

      const out = fs.createWriteStream(destPath);
      res.pipe(out);
      out.on('finish', () => out.close(resolve));
      out.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ─── Upload a file to Supabase Storage ───────────────────────────────────────
async function uploadToStorage(localPath, bucket, storagePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const mime = mimeFromExt(localPath);

  const uploadUrl = `${BASE}/storage/v1/object/${bucket}/${storagePath}`;

  const res = await axios.post(uploadUrl, fileBuffer, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  mime,
      'x-upsert':      'true',   // overwrite if already exists
    },
    maxBodyLength: 20 * 1024 * 1024,   // 20 MB max
    timeout: 30000,
  });

  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Upload failed: ${res.status} ${JSON.stringify(res.data)}`);
  }

  // Return the public URL
  return `${BASE}/storage/v1/object/public/${bucket}/${storagePath}`;
}

// ─── Create storage buckets if they don't exist ───────────────────────────────
async function ensureBuckets() {
  for (const bucket of [BUCKET_LOGOS, BUCKET_COVERS]) {
    try {
      await axios.post(`${BASE}/storage/v1/bucket`, { id: bucket, name: bucket, public: true }, {
        headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      console.log(`  ✅  Created bucket: ${bucket}`);
    } catch (e) {
      // 409 = already exists, that's fine
      const status = e.response ? e.response.status : null;
      if (status === 409 || (e.response && JSON.stringify(e.response.data).includes('already'))) {
        console.log(`  ✅  Bucket exists: ${bucket}`);
      } else {
        console.log(`  ⚠️   Bucket ${bucket}: ${e.response ? JSON.stringify(e.response.data) : e.message}`);
      }
    }
  }
}

// ─── Collect all image URLs from migration.sql ───────────────────────────────
function parseUrlsFromSql() {
  const sqlPath = path.join(__dirname, 'migration.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('\n❌  migration.sql not found. Run this first:\n    node migrate.js --deep-scrape --export-sql\n');
    process.exit(1);
  }

  const sql    = fs.readFileSync(sqlPath, 'utf8');
  const urlMap = {};  // url → { slug, field }

  // Match INSERT blocks: extract slug + logo_url + cover_url
  // Pattern: look for lines that set logo_url / cover_url values
  const lines = sql.split('\n');
  let currentSlug = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect slug from INSERT line context (slug appears a few lines before url)
    const slugMatch = line.match(/,\s*'([a-z0-9-]{3,100})'\s*,\s*'[^']{1,255}'\s*,/);
    if (slugMatch) currentSlug = slugMatch[1];

    // Extract any https://malayalibusiness URL from this line
    const urlMatches = line.matchAll(/'(https?:\/\/[^']+\.(jpg|jpeg|png|gif|webp|svg)[^']*)'/gi);
    for (const m of urlMatches) {
      const url = m[1];
      if (!isValidImageUrl(url)) continue;
      if (!urlMap[url]) {
        urlMap[url] = { slug: currentSlug, occurrences: 0 };
      }
      urlMap[url].occurrences++;
    }
  }

  return urlMap;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║     MalayaliBusiness — Image Migration           ║');
  console.log(`║     Mode: ${DRY_RUN ? '🔍 DRY RUN (no uploads)       ' : '🚀 LIVE (download + upload)    '}   ║`);
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Ensure local images directory exists
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  if (!fs.existsSync(path.join(IMAGES_DIR, 'logos')))  fs.mkdirSync(path.join(IMAGES_DIR, 'logos'));
  if (!fs.existsSync(path.join(IMAGES_DIR, 'covers'))) fs.mkdirSync(path.join(IMAGES_DIR, 'covers'));

  // ── Step 1: Collect URLs from migration.sql ──
  console.log('━━━  Step 1: Parse image URLs from migration.sql  ━━━\n');
  const urlMap = parseUrlsFromSql();
  const allUrls = Object.keys(urlMap).filter(isValidImageUrl);
  console.log(`  Found ${allUrls.length} unique image URLs to migrate\n`);

  if (allUrls.length === 0) {
    console.log('  ⚠️   No images found. Make sure migration.sql was generated with --export-sql');
    return;
  }

  // ── Step 2: Create Supabase Storage buckets ──
  if (!DRY_RUN) {
    console.log('━━━  Step 2: Ensure storage buckets exist  ━━━━━━━━\n');
    await ensureBuckets();
    console.log('');
  }

  // ── Step 3: Download + Upload ──
  console.log(`━━━  Step 3: Download & upload images  ━━━━━━━━━━━━\n`);
  console.log(`  Total  : ${allUrls.length}`);
  console.log(`  Batches: ${Math.ceil(allUrls.length / BATCH_SIZE)} × ${BATCH_SIZE}\n`);

  const urlRemap = {};   // oldUrl → newUrl
  const results  = { success: 0, failed: 0, skipped: 0, errors: [] };

  for (let i = 0; i < allUrls.length; i++) {
    const url       = allUrls[i];
    const filename  = safeFilename(url);
    // Decide bucket: if URL contains logo/icon/favicon → logos, else covers
    const isLogo    = /logo|icon|favicon|avatar|brand/i.test(url);
    const bucket    = isLogo ? BUCKET_LOGOS : BUCKET_COVERS;
    const subdir    = isLogo ? 'logos' : 'covers';
    const localPath = path.join(IMAGES_DIR, subdir, filename);
    const storagePath = `${filename}`;   // flat structure inside bucket

    process.stdout.write(`  [${i + 1}/${allUrls.length}] ${filename.slice(0, 50).padEnd(50)} `);

    // Download (skip if already on disk)
    let downloaded = false;
    if (!fs.existsSync(localPath)) {
      try {
        await downloadImage(url, localPath);
        downloaded = true;
      } catch (e) {
        process.stdout.write(`❌ download: ${e.message}\n`);
        results.failed++;
        results.errors.push({ url, step: 'download', error: e.message });
        await sleep(DELAY_MS);
        continue;
      }
    } else {
      downloaded = false; // already cached
    }

    if (DRY_RUN) {
      process.stdout.write(`✅ would upload to ${bucket}/${storagePath}\n`);
      urlRemap[url] = `${BASE}/storage/v1/object/public/${bucket}/${storagePath}`;
      results.success++;
      await sleep(100);
      continue;
    }

    // Upload to Supabase Storage
    try {
      const newUrl = await uploadToStorage(localPath, bucket, storagePath);
      urlRemap[url] = newUrl;
      process.stdout.write(`✅ ${downloaded ? 'downloaded+' : 'cached+'}uploaded\n`);
      results.success++;
    } catch (e) {
      process.stdout.write(`❌ upload: ${e.response ? JSON.stringify(e.response.data) : e.message}\n`);
      results.failed++;
      results.errors.push({ url, step: 'upload', error: e.message });
    }

    await sleep(DELAY_MS);
  }

  // ── Step 4: Generate update-images.sql ──
  console.log(`\n━━━  Step 4: Generate update-images.sql  ━━━━━━━━━━\n`);

  const sqlLines = [];
  sqlLines.push('-- =========================================================');
  sqlLines.push('-- MalayaliBusiness.com — Image URL Update');
  sqlLines.push(`-- Generated : ${new Date().toISOString()}`);
  sqlLines.push(`-- Images migrated: ${results.success}  |  Failed: ${results.failed}`);
  sqlLines.push('-- Run this in: Supabase → SQL Editor → Run');
  sqlLines.push('-- =========================================================');
  sqlLines.push('');

  let updateCount = 0;
  for (const [oldUrl, newUrl] of Object.entries(urlRemap)) {
    if (oldUrl === newUrl) continue;
    const esc = (s) => s.replace(/'/g, "''");
    // Update logo_url
    sqlLines.push(`UPDATE listings SET logo_url  = '${esc(newUrl)}' WHERE logo_url  = '${esc(oldUrl)}';`);
    // Update cover_url
    sqlLines.push(`UPDATE listings SET cover_url = '${esc(newUrl)}' WHERE cover_url = '${esc(oldUrl)}';`);
    updateCount++;
  }

  sqlLines.push('');
  sqlLines.push(`-- ${updateCount} image URLs updated.`);

  fs.writeFileSync(SQL_OUT, sqlLines.join('\n'), 'utf8');
  const kb = Math.round(fs.statSync(SQL_OUT).size / 1024);
  console.log(`  ✅  update-images.sql written  (${kb} KB, ${updateCount} URL replacements)`);

  // ── Step 5: Save report ──
  const report = {
    generatedAt: new Date().toISOString(),
    total: allUrls.length,
    success: results.success,
    failed: results.failed,
    errors: results.errors,
    remapCount: updateCount,
  };
  fs.writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2));

  // ── Summary ──
  console.log('\n━━━  Summary  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`  ✅  Migrated : ${results.success}`);
  console.log(`  ❌  Failed   : ${results.failed}`);
  if (results.errors.length) {
    console.log('\n  Failed URLs:');
    results.errors.slice(0, 10).forEach(e => console.log(`    ${e.step}: ${e.url.slice(0, 80)}`));
  }

  if (!DRY_RUN && updateCount > 0) {
    console.log('\n  📋  Final step:');
    console.log(`  1. Go to: https://supabase.com/dashboard/project/huhtrnmdnypljrsjhzty/sql/new`);
    console.log(`  2. Open scripts/update-images.sql → Copy → Paste → Run`);
    console.log(`  3. All listing image URLs now point to Supabase Storage ✅\n`);
  } else if (DRY_RUN) {
    console.log('\n  💡  Dry run complete. Remove --dry-run to do the real upload.\n');
  }
}

main().catch(e => {
  console.error('\n❌  FATAL:', e.message);
  if (e.stack) console.error(e.stack.slice(0, 400));
  process.exit(1);
});
