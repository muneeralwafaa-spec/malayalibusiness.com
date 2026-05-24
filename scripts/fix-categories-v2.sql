-- ============================================================
-- FIX v2: Catch businesses missed by v1 (keyword-poor names)
-- Run in Supabase SQL Editor after fix-categories.sql
-- ============================================================

-- STEP 1 ── See what's currently uncategorised or wrongly placed
-- Run this block first to understand the scope
-- ============================================================
SELECT id, name, slug,
       c.name AS current_category
FROM listings l
LEFT JOIN categories c ON c.id = l.category_id
WHERE l.status = 'active'
ORDER BY c.name NULLS FIRST, l.name
LIMIT 200;


-- ============================================================
-- STEP 2 ── Extend Legal & Finance patterns
--           (auditing, accounting, consultancy, management)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'legal-finance' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%audit%'            OR
  LOWER(name) LIKE '%accounting%'       OR
  LOWER(name) LIKE '%accountant%'       OR
  LOWER(name) LIKE '%chartered%'        OR
  LOWER(name) LIKE '%bookkeep%'         OR
  LOWER(name) LIKE '%vat%'              OR
  LOWER(name) LIKE '%tax consult%'      OR
  LOWER(name) LIKE '%payroll%'          OR
  LOWER(name) LIKE '%financial consult%'OR
  LOWER(name) LIKE '%wealth manage%'    OR
  LOWER(name) LIKE '%business consult%' OR
  LOWER(name) LIKE '%management consult%' OR
  LOWER(name) LIKE '%corporate service%' OR
  LOWER(name) LIKE '%company formation%' OR
  LOWER(name) LIKE '%business setup%'   OR
  LOWER(name) LIKE '%pro service%'      OR
  LOWER(name) LIKE '%trademark%'        OR
  LOWER(name) LIKE '%legal service%'    OR
  LOWER(name) LIKE '%notari%'
)
AND (SELECT id FROM categories WHERE slug = 'legal-finance' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 3 ── Travel, Logistics & Freight (often missed)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%freight%'          OR
  LOWER(name) LIKE '%logistics%'        OR
  LOWER(name) LIKE '%shipping%'         OR
  LOWER(name) LIKE '%cargo%'            OR
  LOWER(name) LIKE '%courier%'          OR
  LOWER(name) LIKE '%clearance%'        OR
  LOWER(name) LIKE '%customs%'          OR
  LOWER(name) LIKE '%movers%'           OR
  LOWER(name) LIKE '%moving%'           OR
  LOWER(name) LIKE '%relocation%'       OR
  LOWER(name) LIKE '%rent a car%'       OR
  LOWER(name) LIKE '%car hire%'         OR
  LOWER(name) LIKE '%limo%'             OR
  LOWER(name) LIKE '%charter%'          OR
  LOWER(name) LIKE '%yacht%'
)
AND LOWER(name) NOT LIKE '%real estate%'
AND (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 4 ── Construction & Maintenance (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%maintenance%'      OR
  LOWER(name) LIKE '%facility%'         OR
  LOWER(name) LIKE '%fitout%'           OR
  LOWER(name) LIKE '%fit-out%'          OR
  LOWER(name) LIKE '%cleaning service%' OR
  LOWER(name) LIKE '%deep clean%'       OR
  LOWER(name) LIKE '%pest control%'     OR
  LOWER(name) LIKE '%landscap%'         OR
  LOWER(name) LIKE '%pool service%'     OR
  LOWER(name) LIKE '%ac service%'       OR
  LOWER(name) LIKE '%hvac%'             OR
  LOWER(name) LIKE '%marble%'           OR
  LOWER(name) LIKE '%glass%'            OR
  LOWER(name) LIKE '%aluminium%'        OR
  LOWER(name) LIKE '%steel fabricat%'   OR
  LOWER(name) LIKE '%welding%'          OR
  LOWER(name) LIKE '%scaffold%'
)
AND LOWER(name) NOT LIKE '%car%'
AND LOWER(name) NOT LIKE '%medical%'
AND (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 5 ── Technology & IT (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%cctv%'             OR
  LOWER(name) LIKE '%security system%'  OR
  LOWER(name) LIKE '%surveillance%'     OR
  LOWER(name) LIKE '%it support%'       OR
  LOWER(name) LIKE '%managed service%'  OR
  LOWER(name) LIKE '%cloud%'            OR
  LOWER(name) LIKE '%erp%'              OR
  LOWER(name) LIKE '%pos system%'       OR
  LOWER(name) LIKE '%printing solution%'OR
  LOWER(name) LIKE '%telecom%'          OR
  LOWER(name) LIKE '%internet service%' OR
  LOWER(name) LIKE '%smart home%'       OR
  LOWER(name) LIKE '%automation%'
)
AND (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 6 ── Education & Training (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'education-training' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%driving school%'   OR
  LOWER(name) LIKE '%driving class%'    OR
  LOWER(name) LIKE '%language class%'   OR
  LOWER(name) LIKE '%ielts%'            OR
  LOWER(name) LIKE '%spoken english%'   OR
  LOWER(name) LIKE '%skill training%'   OR
  LOWER(name) LIKE '%preschool%'        OR
  LOWER(name) LIKE '%daycare%'          OR
  LOWER(name) LIKE '%day care%'         OR
  LOWER(name) LIKE '%montessori%'       OR
  LOWER(name) LIKE '%vocational%'       OR
  LOWER(name) LIKE '%certification%'    OR
  LOWER(name) LIKE '%manpower%'         OR
  LOWER(name) LIKE '%recruitment%'      OR
  LOWER(name) LIKE '%staffing%'         OR
  LOWER(name) LIKE '%hr consult%'       OR
  LOWER(name) LIKE '%placement%'
)
AND (SELECT id FROM categories WHERE slug = 'education-training' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 7 ── Retail & Fashion (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%printing%'         OR
  LOWER(name) LIKE '%signage%'          OR
  LOWER(name) LIKE '%branding%'         OR
  LOWER(name) LIKE '%advertising%'      OR
  LOWER(name) LIKE '%marketing%'        OR
  LOWER(name) LIKE '%event manage%'     OR
  LOWER(name) LIKE '%events%'           OR
  LOWER(name) LIKE '%exhibition%'       OR
  LOWER(name) LIKE '%photography%'      OR
  LOWER(name) LIKE '%videograph%'       OR
  LOWER(name) LIKE '%media product%'    OR
  LOWER(name) LIKE '%uniform%'          OR
  LOWER(name) LIKE '%laundry%'          OR
  LOWER(name) LIKE '%tailoring%'        OR
  LOWER(name) LIKE '%alteration%'
)
AND LOWER(name) NOT LIKE '%real estate%'
AND LOWER(name) NOT LIKE '%tech%'
AND (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 8 ── Healthcare (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'healthcare-medical' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%home care%'        OR
  LOWER(name) LIKE '%elder care%'       OR
  LOWER(name) LIKE '%nursing home%'     OR
  LOWER(name) LIKE '%polyclinic%'       OR
  LOWER(name) LIKE '%specialist%'       OR
  LOWER(name) LIKE '%rehabilitation%'   OR
  LOWER(name) LIKE '%speech therapy%'   OR
  LOWER(name) LIKE '%occupational%'     OR
  LOWER(name) LIKE '%orthopedic%'       OR
  LOWER(name) LIKE '%ophthalm%'         OR
  LOWER(name) LIKE '%eye clinic%'       OR
  LOWER(name) LIKE '%hearing%'          OR
  LOWER(name) LIKE '%nutrition%'        OR
  LOWER(name) LIKE '%dietitian%'        OR
  LOWER(name) LIKE '%psycholog%'        OR
  LOWER(name) LIKE '%mental health%'    OR
  LOWER(name) LIKE '%ayurved%'          OR
  LOWER(name) LIKE '%homeopath%'
)
AND (SELECT id FROM categories WHERE slug = 'healthcare-medical' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 9 ── Restaurants & Food (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'restaurants-food' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%food%'             OR
  LOWER(name) LIKE '%dining%'           OR
  LOWER(name) LIKE '%grill%'            OR
  LOWER(name) LIKE '%shawarma%'         OR
  LOWER(name) LIKE '%pizza%'            OR
  LOWER(name) LIKE '%burger%'           OR
  LOWER(name) LIKE '%sushi%'            OR
  LOWER(name) LIKE '%chinese%'          OR
  LOWER(name) LIKE '%indian%'           OR
  LOWER(name) LIKE '%arabic%'           OR
  LOWER(name) LIKE '%tiffin%'           OR
  LOWER(name) LIKE '%meal%'             OR
  LOWER(name) LIKE '%delivery food%'    OR
  LOWER(name) LIKE '%cloud kitchen%'
)
AND LOWER(name) NOT LIKE '%real estate%'
AND LOWER(name) NOT LIKE '%grocery%'
AND (SELECT id FROM categories WHERE slug = 'restaurants-food' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 10 ── Beauty & Wellness (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'beauty-wellness' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%medspa%'           OR
  LOWER(name) LIKE '%med spa%'          OR
  LOWER(name) LIKE '%laser%'            OR
  LOWER(name) LIKE '%slimming%'         OR
  LOWER(name) LIKE '%weight loss%'      OR
  LOWER(name) LIKE '%hair transplant%'  OR
  LOWER(name) LIKE '%lash%'             OR
  LOWER(name) LIKE '%microblading%'     OR
  LOWER(name) LIKE '%threading%'        OR
  LOWER(name) LIKE '%waxing%'           OR
  LOWER(name) LIKE '%facial%'           OR
  LOWER(name) LIKE '%pedicure%'         OR
  LOWER(name) LIKE '%manicure%'         OR
  LOWER(name) LIKE '%meditation%'       OR
  LOWER(name) LIKE '%pilates%'          OR
  LOWER(name) LIKE '%crossfit%'
)
AND LOWER(name) NOT LIKE '%medical%'
AND LOWER(name) NOT LIKE '%clinic%'
AND (SELECT id FROM categories WHERE slug = 'beauty-wellness' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 11 ── Grocery (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'grocery-supermarket' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%indian grocery%'   OR
  LOWER(name) LIKE '%kerala store%'     OR
  LOWER(name) LIKE '%spice%'            OR
  LOWER(name) LIKE '%organic store%'    OR
  LOWER(name) LIKE '%fresh produce%'    OR
  LOWER(name) LIKE '%butcher%'          OR
  LOWER(name) LIKE '%meat shop%'        OR
  LOWER(name) LIKE '%fish%'             OR
  LOWER(name) LIKE '%vegetable%'        OR
  LOWER(name) LIKE '%general store%'    OR
  LOWER(name) LIKE '%cold store%'       OR
  LOWER(name) LIKE '%superstore%'
)
AND LOWER(name) NOT LIKE '%real estate%'
AND (SELECT id FROM categories WHERE slug = 'grocery-supermarket' LIMIT 1) IS NOT NULL;


-- ============================================================
-- STEP 12 ── Automotive (more patterns)
-- ============================================================
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%auto parts%'       OR
  LOWER(name) LIKE '%spare parts%'      OR
  LOWER(name) LIKE '%used car%'         OR
  LOWER(name) LIKE '%second hand car%'  OR
  LOWER(name) LIKE '%car service%'      OR
  LOWER(name) LIKE '%car care%'         OR
  LOWER(name) LIKE '%oil change%'       OR
  LOWER(name) LIKE '%denting%'          OR
  LOWER(name) LIKE '%window tint%'      OR
  LOWER(name) LIKE '%car polish%'       OR
  LOWER(name) LIKE '%motorcycle%'       OR
  LOWER(name) LIKE '%bike repair%'
)
AND (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1) IS NOT NULL;


-- ============================================================
-- FINAL ── Show final counts + any listings still uncategorised
-- ============================================================

-- Category counts after v2 fix
SELECT c.name, c.slug, COUNT(l.id) AS listing_count
FROM categories c
LEFT JOIN listings l ON l.category_id = c.id AND l.status = 'active'
GROUP BY c.id, c.name, c.slug
ORDER BY listing_count DESC;

-- Listings with no matching category (category_id is NULL)
SELECT COUNT(*) AS uncategorised_count
FROM listings
WHERE status = 'active'
AND (category_id IS NULL OR category_id NOT IN (SELECT id FROM categories));

-- Show the uncategorised ones so you can manually assign
SELECT id, name, slug
FROM listings
WHERE status = 'active'
AND (category_id IS NULL OR category_id NOT IN (SELECT id FROM categories))
ORDER BY name
LIMIT 50;
