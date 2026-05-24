-- ============================================================
-- FIX: Reassign listing categories based on business name keywords
-- Run this in Supabase SQL Editor → it is safe to run multiple times
-- ============================================================

-- Step 0: Confirm categories table slugs exist before running
-- SELECT slug FROM categories ORDER BY slug;

-- ── 1. Technology & IT ───────────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%gaming%'       OR
  LOWER(name) LIKE '%laptop%'       OR
  LOWER(name) LIKE '%computer%'     OR
  LOWER(name) LIKE '%software%'     OR
  LOWER(name) LIKE '%tech%'         OR
  LOWER(name) LIKE '%it solution%'  OR
  LOWER(name) LIKE '%digital%'      OR
  LOWER(name) LIKE '%electronics%'  OR
  LOWER(name) LIKE '%mobile app%'   OR
  LOWER(name) LIKE '%web develop%'  OR
  LOWER(name) LIKE '%cybersec%'     OR
  LOWER(name) LIKE '%network%'      OR
  LOWER(name) LIKE '%data center%'
)
AND (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1) IS NOT NULL;

-- ── 2. Automotive ────────────────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%auto body%'    OR
  LOWER(name) LIKE '%auto repair%'  OR
  LOWER(name) LIKE '%car wash%'     OR
  LOWER(name) LIKE '%car rental%'   OR
  LOWER(name) LIKE '%car dealer%'   OR
  LOWER(name) LIKE '%garage%'       OR
  LOWER(name) LIKE '%mechanic%'     OR
  LOWER(name) LIKE '%tyre%'         OR
  LOWER(name) LIKE '%tire%'         OR
  LOWER(name) LIKE '%vehicle%'      OR
  LOWER(name) LIKE '%turbo buff%'   OR
  LOWER(name) LIKE '%bodyshop%'     OR
  (LOWER(name) LIKE '%motor%' AND LOWER(name) NOT LIKE '%motorola%')
)
AND (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1) IS NOT NULL;

-- ── 3. Healthcare & Medical ───────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'healthcare-medical' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%medical%'        OR
  LOWER(name) LIKE '%clinic%'         OR
  LOWER(name) LIKE '%hospital%'       OR
  LOWER(name) LIKE '%doctor%'         OR
  LOWER(name) LIKE '%health%'         OR
  LOWER(name) LIKE '%dental%'         OR
  LOWER(name) LIKE '%dentist%'        OR
  LOWER(name) LIKE '%pharmacy%'       OR
  LOWER(name) LIKE '%pharmacist%'     OR
  LOWER(name) LIKE '%gynecol%'        OR
  LOWER(name) LIKE '%obstetric%'      OR
  LOWER(name) LIKE '%physiother%'     OR
  LOWER(name) LIKE '%dermatol%'       OR
  LOWER(name) LIKE '%optom%'          OR
  LOWER(name) LIKE '%optician%'       OR
  LOWER(name) LIKE '%diagnostic%'     OR
  LOWER(name) LIKE '%laboratory%'     OR
  LOWER(name) LIKE '%lab test%'       OR
  LOWER(name) LIKE '%nursing%'        OR
  LOWER(name) LIKE '%aesthetic%'
)
AND (SELECT id FROM categories WHERE slug = 'healthcare-medical' LIMIT 1) IS NOT NULL;

-- ── 4. Restaurants & Food ─────────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'restaurants-food' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%restaurant%'   OR
  LOWER(name) LIKE '%cafe%'         OR
  LOWER(name) LIKE '%biryani%'      OR
  LOWER(name) LIKE '%malabar%'      OR
  LOWER(name) LIKE '%kerala food%'  OR
  LOWER(name) LIKE '%catering%'     OR
  LOWER(name) LIKE '%bakery%'       OR
  LOWER(name) LIKE '%kitchen%'      OR
  LOWER(name) LIKE '%eatery%'       OR
  LOWER(name) LIKE '%food court%'   OR
  LOWER(name) LIKE '%sweets%'       OR
  LOWER(name) LIKE '%snacks%'       OR
  LOWER(name) LIKE '%juice bar%'    OR
  LOWER(name) LIKE '%coffee shop%'
)
AND (SELECT id FROM categories WHERE slug = 'restaurants-food' LIMIT 1) IS NOT NULL;

-- ── 5. Real Estate ────────────────────────────────────────────
-- Re-assign real estate so ONLY genuine property businesses remain
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'real-estate' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%real estate%'      OR
  LOWER(name) LIKE '%property%'         OR
  LOWER(name) LIKE '%realty%'           OR
  LOWER(name) LIKE '%homes rental%'     OR
  LOWER(name) LIKE '%vacation home%'    OR
  LOWER(name) LIKE '%holiday home%'     OR
  LOWER(name) LIKE '%apartment rental%' OR
  LOWER(name) LIKE '%villa rental%'     OR
  LOWER(name) LIKE '%rent apartment%'   OR
  LOWER(name) LIKE '%property manage%'  OR
  LOWER(name) LIKE '%zapbed%'
)
AND (SELECT id FROM categories WHERE slug = 'real-estate' LIMIT 1) IS NOT NULL;

-- ── 6. Travel & Tourism ───────────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%travel%'       OR
  LOWER(name) LIKE '%tourism%'      OR
  LOWER(name) LIKE '%tour package%' OR
  LOWER(name) LIKE '%holiday%'      OR
  LOWER(name) LIKE '%bus rental%'   OR
  LOWER(name) LIKE '%bus hire%'     OR
  LOWER(name) LIKE '%limousine%'    OR
  LOWER(name) LIKE '%taxi%'         OR
  LOWER(name) LIKE '%transport%'    OR
  LOWER(name) LIKE '%visa service%' OR
  LOWER(name) LIKE '%flight%'       OR
  LOWER(name) LIKE '%hotel%'
)
AND LOWER(name) NOT LIKE '%real estate%'
AND (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1) IS NOT NULL;

-- ── 7. Construction & Interiors ───────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%construction%'  OR
  LOWER(name) LIKE '%interior%'      OR
  LOWER(name) LIKE '%building%'      OR
  LOWER(name) LIKE '%timber%'        OR
  LOWER(name) LIKE '%furniture%'     OR
  LOWER(name) LIKE '%renovation%'    OR
  LOWER(name) LIKE '%fitout%'        OR
  LOWER(name) LIKE '%fit out%'       OR
  LOWER(name) LIKE '%flooring%'      OR
  LOWER(name) LIKE '%plumbing%'      OR
  LOWER(name) LIKE '%electrical%'    OR
  LOWER(name) LIKE '%painting%'      OR
  LOWER(name) LIKE '%carpentry%'     OR
  LOWER(name) LIKE '%masonry%'
)
AND LOWER(name) NOT LIKE '%real estate%'
AND (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1) IS NOT NULL;

-- ── 8. Education & Training ───────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'education-training' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%school%'        OR
  LOWER(name) LIKE '%college%'       OR
  LOWER(name) LIKE '%tutor%'         OR
  LOWER(name) LIKE '%coaching%'      OR
  LOWER(name) LIKE '%training%'      OR
  LOWER(name) LIKE '%academy%'       OR
  LOWER(name) LIKE '%institute%'     OR
  LOWER(name) LIKE '%education%'     OR
  LOWER(name) LIKE '%learning%'      OR
  LOWER(name) LIKE '%nursery%'       OR
  LOWER(name) LIKE '%kindergarten%'
)
AND (SELECT id FROM categories WHERE slug = 'education-training' LIMIT 1) IS NOT NULL;

-- ── 9. Beauty & Wellness ──────────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'beauty-wellness' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%salon%'         OR
  LOWER(name) LIKE '%spa%'           OR
  LOWER(name) LIKE '%beauty%'        OR
  LOWER(name) LIKE '%wellness%'      OR
  LOWER(name) LIKE '%barber%'        OR
  LOWER(name) LIKE '%nail%'          OR
  LOWER(name) LIKE '%massage%'       OR
  LOWER(name) LIKE '%yoga%'          OR
  LOWER(name) LIKE '%gym%'           OR
  LOWER(name) LIKE '%fitness%'       OR
  LOWER(name) LIKE '%grooming%'
)
AND LOWER(name) NOT LIKE '%medical%'
AND LOWER(name) NOT LIKE '%clinic%'
AND (SELECT id FROM categories WHERE slug = 'beauty-wellness' LIMIT 1) IS NOT NULL;

-- ── 10. Legal & Finance ───────────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'legal-finance' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%lawyer%'        OR
  LOWER(name) LIKE '%legal%'         OR
  LOWER(name) LIKE '%law firm%'      OR
  LOWER(name) LIKE '%advocate%'      OR
  LOWER(name) LIKE '%notary%'        OR
  LOWER(name) LIKE '%bank%'          OR
  LOWER(name) LIKE '%finance%'       OR
  LOWER(name) LIKE '%accounting%'    OR
  LOWER(name) LIKE '%tax%'           OR
  LOWER(name) LIKE '%audit%'         OR
  LOWER(name) LIKE '%insurance%'     OR
  LOWER(name) LIKE '%investment%'    OR
  LOWER(name) LIKE '%money exchange%'OR
  LOWER(name) LIKE '%forex%'
)
AND (SELECT id FROM categories WHERE slug = 'legal-finance' LIMIT 1) IS NOT NULL;

-- ── 11. Retail & Fashion ──────────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%fashion%'       OR
  LOWER(name) LIKE '%clothing%'      OR
  LOWER(name) LIKE '%boutique%'      OR
  LOWER(name) LIKE '%jewellery%'     OR
  LOWER(name) LIKE '%jewelry%'       OR
  LOWER(name) LIKE '%store%'         OR
  LOWER(name) LIKE '%shop%'          OR
  LOWER(name) LIKE '%supermart%'     OR
  LOWER(name) LIKE '%textiles%'      OR
  LOWER(name) LIKE '%gifts%'
)
AND LOWER(name) NOT LIKE '%real estate%'
AND LOWER(name) NOT LIKE '%car%'
AND LOWER(name) NOT LIKE '%gaming%'
AND (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1) IS NOT NULL;

-- ── 12. Grocery & Supermarket ─────────────────────────────────
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'grocery-supermarket' LIMIT 1)
WHERE (
  LOWER(name) LIKE '%grocery%'       OR
  LOWER(name) LIKE '%supermarket%'   OR
  LOWER(name) LIKE '%hypermarket%'   OR
  LOWER(name) LIKE '%mart%'          OR
  LOWER(name) LIKE '%minimart%'      OR
  LOWER(name) LIKE '%fresh market%'  OR
  LOWER(name) LIKE '%indian store%'  OR
  LOWER(name) LIKE '%provision%'
)
AND (SELECT id FROM categories WHERE slug = 'grocery-supermarket' LIMIT 1) IS NOT NULL;

-- ── Verify counts after fix ────────────────────────────────────
SELECT c.name, c.slug, COUNT(l.id) AS listing_count
FROM categories c
LEFT JOIN listings l ON l.category_id = c.id AND l.status = 'active'
GROUP BY c.id, c.name, c.slug
ORDER BY listing_count DESC;
