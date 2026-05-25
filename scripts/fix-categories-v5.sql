-- ============================================================
-- FIX v5: UUID-targeted cleanup of Retail & Fashion misfits
--         Based on manual review of all 74 remaining listings
-- Run in Supabase SQL Editor after fix-categories-v4.sql
-- ============================================================

-- ── Automotive misfits ────────────────────────────────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'automotive' LIMIT 1)
WHERE id IN (
  '0a7b295a-1f6b-43aa-a2c6-62a0ea3422aa',  -- Al Alwan Al Sehriah Auto Paint Trading
  '72654220-db2f-40e3-a4df-988d1fa569b9',  -- Metro Auto Maintenance Workshop LLC
  '58fca0f6-d850-4cb3-9254-e535cce06257'   -- PRESTIGE DIESEL TRADING LLC
);

-- ── Construction & Interiors misfits ─────────────────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'construction-interiors' LIMIT 1)
WHERE id IN (
  '0e9ff40e-b911-4496-90d3-e94151d89bbc',  -- Almuharikpumpstrading (pumps)
  'dc227953-911f-4a56-af9b-b3023152ad1b',  -- Mardan Furniture – Used Furniture Store
  '03bc4e0e-a527-4b27-8071-52e8009fbd96',  -- Mr Glass – Forum Group
  'a0b35396-7949-47a0-b2d0-8b0b03a7dd03',  -- Grease trap installation & supply
  'b68172c5-9c3b-4c99-9de9-a0258bf2d268',  -- Signmax Group UAE
  'd067bb14-c558-4a0c-baf1-2835b4eb6cb1'   -- Classic Equipment Trading Co LLC
);

-- ── Restaurants & Food misfits ────────────────────────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'restaurants-food' LIMIT 1)
WHERE id IN (
  '351359cd-1a88-4678-ab92-8289de38cfd3',  -- Dubai Trading & Confectionary Co. LLC
  'a6cd2c71-6664-42ce-994a-2b21c0d9d648'   -- Twayyibat Food & Beverages Trading
);

-- ── Technology & IT misfits ───────────────────────────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'technology-it' LIMIT 1)
WHERE id IN (
  '010cfd15-9fef-4dd6-be1d-2295cd0a825c',  -- POS Machine Touch Screen Billing Setup
  '857ad620-034d-4018-844f-cf03af0340d6'   -- Designs Of Planet Earth Adv LLC (Adv = advertising)
);

-- ── Legal & Finance misfits ───────────────────────────────────
UPDATE listings SET category_id = (SELECT id FROM categories WHERE slug = 'legal-finance' LIMIT 1)
WHERE id IN (
  '730a1e8a-e737-4855-8336-47014f63c45b',  -- MVAST CORPORATE SERVICES
  '54193ce1-8bc4-462e-9406-bf32ef207389',  -- Virtue Corporate Services
  '9287bf22-491c-4536-9c1a-27a3cbb5597b'   -- Elite Group of Companies
);

-- ── Final count check ─────────────────────────────────────────
SELECT c.name, c.slug, COUNT(l.id) AS listing_count
FROM categories c
LEFT JOIN listings l ON l.category_id = c.id AND l.status = 'active'
GROUP BY c.id, c.name, c.slug
ORDER BY listing_count DESC;
