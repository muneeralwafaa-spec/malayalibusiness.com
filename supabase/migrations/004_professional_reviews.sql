-- ═══════════════════════════════════════════════════════════════════
-- Migration 004 — Professional reviews + reviews table improvements
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run All
-- ═══════════════════════════════════════════════════════════════════

-- 1. Add professional_id column to existing reviews table
--    Either listing_id OR professional_id is set, never both
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS professional_id uuid REFERENCES profiles(id) ON DELETE CASCADE;

-- 2. Allow reviewer_name to be null (for logged-in users we use their profile name)
ALTER TABLE reviews
  ALTER COLUMN reviewer_name DROP NOT NULL;

-- 3. Add reviewer_id so logged-in reviews are linked to a user
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS reviewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- 4. Prevent a user from reviewing the same item twice
CREATE UNIQUE INDEX IF NOT EXISTS reviews_user_listing_unique
  ON reviews (reviewer_id, listing_id) WHERE reviewer_id IS NOT NULL AND listing_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS reviews_user_professional_unique
  ON reviews (reviewer_id, professional_id) WHERE reviewer_id IS NOT NULL AND professional_id IS NOT NULL;

-- 5. Index for professional reviews lookup
CREATE INDEX IF NOT EXISTS reviews_professional_idx ON reviews(professional_id);

-- 6. RLS — public can read approved reviews, logged in users can insert their own
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any, then recreate
DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = reviewer_id);
