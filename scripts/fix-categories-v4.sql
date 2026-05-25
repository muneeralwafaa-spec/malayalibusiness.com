-- ============================================================
-- FIX v4: Redistribute businesses wrongly dumped into Retail & Fashion
--         by v2's broad keyword rules (advertising, events, printing etc.)
-- Run in Supabase SQL Editor after fix-categories-v3.sql
-- ============================================================


-- ── Advertising / Marketing / Branding → Technology & IT ─────
-- These are service businesses, not retail shops
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1)
WHERE status = 'active'
AND category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
AND (
  LOWER(name) LIKE '%advertising%'    OR
  LOWER(name) LIKE '%advertisement%'  OR
  LOWER(name) LIKE '%marketing%'      OR
  LOWER(name) LIKE '%branding%'       OR
  LOWER(name) LIKE '%digital media%'  OR
  LOWER(name) LIKE '%media product%'  OR
  LOWER(name) LIKE '%media service%'  OR
  LOWER(name) LIKE '%seo%'            OR
  LOWER(name) LIKE '%social media%'   OR
  LOWER(name) LIKE '%graphic design%' OR
  LOWER(name) LIKE '%web design%'     OR
  LOWER(name) LIKE '%creative agency%'
)
AND (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1) IS NOT NULL;


-- ── Photography / Videography → Technology & IT ──────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1)
WHERE status = 'active'
AND category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
AND (
  LOWER(name) LIKE '%photography%'    OR
  LOWER(name) LIKE '%photographer%'   OR
  LOWER(name) LIKE '%videograph%'     OR
  LOWER(name) LIKE '%videographer%'   OR
  LOWER(name) LIKE '%film product%'   OR
  LOWER(name) LIKE '%production house%'
)
AND (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1) IS NOT NULL;


-- ── Events / Exhibitions → Travel & Tourism ──────────────────
-- Events management, exhibitions, conferences sit better here
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1)
WHERE status = 'active'
AND category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
AND (
  LOWER(name) LIKE '%event manage%'   OR
  LOWER(name) LIKE '%events manage%'  OR
  LOWER(name) LIKE '%event plan%'     OR
  LOWER(name) LIKE '%events plan%'    OR
  LOWER(name) LIKE '%event company%'  OR
  LOWER(name) LIKE '%events company%' OR
  LOWER(name) LIKE '%exhibition%'     OR
  LOWER(name) LIKE '%expo%'           OR
  LOWER(name) LIKE '%conference%'     OR
  LOWER(name) LIKE '%wedding plan%'   OR
  LOWER(name) LIKE '%event organ%'
)
AND (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1) IS NOT NULL;


-- ── Printing / Signage → Construction & Interiors ────────────
-- Physical printing, signage installation, display boards
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1)
WHERE status = 'active'
AND category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
AND (
  LOWER(name) LIKE '%signage%'        OR
  LOWER(name) LIKE '%sign board%'     OR
  LOWER(name) LIKE '%sign making%'    OR
  LOWER(name) LIKE '%neon sign%'      OR
  LOWER(name) LIKE '%hoarding%'       OR
  LOWER(name) LIKE '%banner print%'
)
AND (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1) IS NOT NULL;


-- ── General Printing → Technology & IT ───────────────────────
-- Printing companies (offset, digital, large format) not caught above
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1)
WHERE status = 'active'
AND category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
AND (
  LOWER(name) LIKE '%printing%'       OR
  LOWER(name) LIKE '%print shop%'     OR
  LOWER(name) LIKE '%print solution%'
)
AND LOWER(name) NOT LIKE '%3d print%'
AND (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1) IS NOT NULL;


-- ── Laundry → Construction & Interiors ───────────────────────
-- Laundry services are facility/maintenance type, not retail
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1)
WHERE status = 'active'
AND category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
AND (
  LOWER(name) LIKE '%laundry%'        OR
  LOWER(name) LIKE '%dry clean%'      OR
  LOWER(name) LIKE '%ironing%'
)
AND (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1) IS NOT NULL;


-- ── Verify final counts ───────────────────────────────────────
SELECT c.name, c.slug, COUNT(l.id) AS listing_count
FROM categories c
LEFT JOIN listings l ON l.category_id = c.id AND l.status = 'active'
GROUP BY c.id, c.name, c.slug
ORDER BY listing_count DESC;
