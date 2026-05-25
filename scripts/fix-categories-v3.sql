-- ============================================================
-- FIX v3: Targeted UUID fixes for specific mismatched businesses
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Automotive spare parts wrongly in Beauty & Wellness ──────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1)
WHERE id IN (
  '54fcbce5-5d04-40d2-a7f7-ddca00d63a39',  -- Al Amani Spare Parts LLC
  '4ba4b94d-8a47-40bb-b4b4-20505189fd3b'   -- KJ AUTO SPARE PARTS CO. LLC
);

-- ── Technology / IT wrongly placed ───────────────────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1)
WHERE id IN (
  '1c8e7bc6-1521-41d0-b83a-8f9edd392a8b',  -- API Security Testing (was Construction)
  'c898673d-eed5-4c22-b3ca-8f72885f4490',  -- Dr.IT Fixing (was Healthcare)
  '177df48e-8bbb-4392-ad1e-cdec5f18278b'   -- Planworks Communications (was Grocery)
);

-- ── Karate / Martial Arts / Sports wrongly spread around ─────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'education-training' LIMIT 1)
WHERE id IN (
  '6eaae12c-7715-41c8-93d4-014e50626918',  -- NIMR AL KHALEEJ KARATE (was Healthcare)
  '9fd515a7-0321-4abd-a96f-c53e6b4aee2b',  -- SHOTOKAN KARATE CLUB JKA DUBAI (was Healthcare)
  '17894f5c-872b-4011-82fc-e62b46b5d936',  -- ULTIMATE KARATE CENTRE (was Healthcare)
  '40608973-5c03-424a-a0af-a9e7621b6839',  -- Karate Kid Martial Arts (was Grocery)
  '8980f4a7-c7da-4bb5-a153-e3ba2b7e3ad5',  -- Universal Martial Arts Academy (was Grocery)
  'aaf65d27-3216-47ff-b64c-1bb44bc4afee',  -- Engage Sports Arena (was Healthcare)
  '66d8c133-312e-4816-a98d-d0b0ecd7a91a',  -- Shorin Ryu Karate Centre (already Education - confirm)
  '28fc0206-f233-4111-a5fb-d33b798f04ec'   -- Silver Star Karate Sharjah (already Education - confirm)
);

-- ── Facility Management / Interiors wrongly in Healthcare ────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1)
WHERE id IN (
  '5b4a552a-fc1e-4ce3-a30e-a6933b3d1fc1',  -- FLEX FACILITY MANAGEMENT LLC (was Healthcare)
  '0121d4bc-4e1d-42b2-a071-3b8fb9711720',  -- SPACE INTERIORS AND EXHIBITIONS (was Beauty)
  '0e70f82d-84fe-4f9f-87cb-1f3d55fff121',  -- Marts gulf contracting LLC (was Grocery)
  'd2876e3d-cca6-4ee1-b175-ebf598cec24d',  -- Coolland Aircondition Spare Parts (was Beauty)
  '3a941201-5b49-42c5-8c1e-cc00697c890e'   -- ARABARCH Consulting (architecture - was Legal)
);

-- ── Hospitality wrongly in Healthcare → Travel & Tourism ─────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1)
WHERE id IN (
  '55aa2fb5-53d7-43aa-b066-eba869c84b75'   -- Rainbow Hospitality (was Healthcare)
);

-- ── Healthcare items wrongly in Grocery ──────────────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'healthcare-medical' LIMIT 1)
WHERE id IN (
  'c2c90caa-3fe4-48c2-87f0-1cab5e9563bd',  -- Jamil Optics (was Grocery)
  '8f526f4d-0a2f-45a3-8068-b1a20ce8d969'   -- AURA AYURVEDA (was Grocery)
);

-- ── Beauty items wrongly in Grocery ──────────────────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'beauty-wellness' LIMIT 1)
WHERE id IN (
  '6b484876-a4e2-4778-8825-d59e43e2ba40'   -- Smart Hair Fixing (was Grocery)
);

-- ── Consultancy / Advisory wrongly in Healthcare ─────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'legal-finance' LIMIT 1)
WHERE id IN (
  'd73f6087-6feb-4a8e-8877-b182038578fe'   -- WHETSTONE CONSULTANCY (was Healthcare)
);

-- ── Events Management wrongly in Legal & Finance ─────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
WHERE id IN (
  '9733685c-ce93-4c90-a82b-99dc26665a66'   -- GCC VISION EVENTS MANAGEMENT (was Legal)
);

-- ── Advertising / Design in Grocery → Retail & Fashion ───────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'retail-fashion' LIMIT 1)
WHERE id IN (
  '857ad620-034d-4018-844f-cf03af0340d6',  -- Designs Of Planet Earth Adv LLC (was Grocery)
  'af762bea-eb5f-44cb-a0cc-d1a0b6426786'   -- Colourzone (was Grocery)
);

-- ── Improve keyword rules to prevent future mismatches ───────
-- Spare parts always → Automotive
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%spare part%' OR
  LOWER(name) LIKE '%auto spare%' OR
  LOWER(name) LIKE '%car spare%'
)
AND (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1) IS NOT NULL;

-- Facility management → Construction
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%facility manage%' OR
  LOWER(name) LIKE '%facilities manage%' OR
  LOWER(name) LIKE '%building manage%'
)
AND (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1) IS NOT NULL;

-- Karate / martial arts → Education (broad catch)
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'education-training' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%karate%' OR
  LOWER(name) LIKE '%martial art%' OR
  LOWER(name) LIKE '%taekwondo%' OR
  LOWER(name) LIKE '%judo%' OR
  LOWER(name) LIKE '%jiu jitsu%' OR
  LOWER(name) LIKE '%muay thai%' OR
  LOWER(name) LIKE '%boxing class%' OR
  LOWER(name) LIKE '%sports academy%' OR
  LOWER(name) LIKE '%sports arena%'
)
AND (SELECT id FROM categories WHERE slug = 'education-training' LIMIT 1) IS NOT NULL;

-- Optics → Healthcare
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'healthcare-medical' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%optic%' OR
  LOWER(name) LIKE '%optician%' OR
  LOWER(name) LIKE '%eye care%' OR
  LOWER(name) LIKE '%eyewear%' OR
  LOWER(name) LIKE '%lenses%'
)
AND (SELECT id FROM categories WHERE slug = 'healthcare-medical' LIMIT 1) IS NOT NULL;

-- Hospitality → Travel & Tourism
UPDATE listings
SET category_id = (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1)
WHERE status = 'active'
AND (
  LOWER(name) LIKE '%hospitality%' OR
  LOWER(name) LIKE '%guest house%' OR
  LOWER(name) LIKE '%bed and breakfast%'
)
AND (SELECT id FROM categories WHERE slug = 'travel-tourism' LIMIT 1) IS NOT NULL;

-- ── Final count check ─────────────────────────────────────────
SELECT c.name, c.slug, COUNT(l.id) AS listing_count
FROM categories c
LEFT JOIN listings l ON l.category_id = c.id AND l.status = 'active'
GROUP BY c.id, c.name, c.slug
ORDER BY listing_count DESC;
