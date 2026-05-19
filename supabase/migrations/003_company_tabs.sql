-- ============================================================
-- 003_company_tabs.sql
-- Tables for company detail page: services, reviews, team, shop
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── 1. SERVICES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id   uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  name         text NOT NULL,
  name_ml      text,
  description  text,
  description_ml text,
  price        numeric(10,2),
  price_unit   text DEFAULT 'AED',
  image_url    text,
  is_active    boolean DEFAULT true,
  sort_order   int DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_listing_id ON services(listing_id);
CREATE INDEX IF NOT EXISTS idx_services_active     ON services(listing_id, is_active, sort_order);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Anyone can read active services
CREATE POLICY "services_public_read" ON services
  FOR SELECT USING (is_active = true);

-- Owner can manage their services
CREATE POLICY "services_owner_write" ON services
  FOR ALL USING (
    listing_id IN (
      SELECT id FROM listings WHERE owner_id = auth.uid()
    )
  );


-- ── 2. REVIEWS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id      uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name   text NOT NULL,
  reviewer_avatar text,
  rating          int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body            text,
  is_verified     boolean DEFAULT false,
  helpful_count   int DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created    ON reviews(listing_id, created_at DESC);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);

-- Authenticated users can insert a review
CREATE POLICY "reviews_auth_insert" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Reviewer can update/delete their own review
CREATE POLICY "reviews_owner_update" ON reviews
  FOR UPDATE USING (reviewer_id = auth.uid());

CREATE POLICY "reviews_owner_delete" ON reviews
  FOR DELETE USING (reviewer_id = auth.uid());


-- ── Trigger: keep listings.rating_avg + review_count in sync ─
CREATE OR REPLACE FUNCTION sync_listing_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE listings
  SET
    rating_avg   = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE listing_id = COALESCE(NEW.listing_id, OLD.listing_id)),
    review_count = (SELECT COUNT(*)                  FROM reviews WHERE listing_id = COALESCE(NEW.listing_id, OLD.listing_id))
  WHERE id = COALESCE(NEW.listing_id, OLD.listing_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_listing_rating ON reviews;
CREATE TRIGGER trg_sync_listing_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION sync_listing_rating();


-- ── 3. TEAM MEMBERS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id   uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  name         text NOT NULL,
  name_ml      text,
  role         text,
  role_ml      text,
  photo_url    text,
  bio          text,
  years_exp    int,
  sort_order   int DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_listing_id ON team_members(listing_id);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_public_read" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "team_owner_write" ON team_members
  FOR ALL USING (
    listing_id IN (
      SELECT id FROM listings WHERE owner_id = auth.uid()
    )
  );


-- ── 4. SHOP LISTINGS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shop_listings (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id     uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  name           text NOT NULL,
  name_ml        text,
  description    text,
  description_ml text,
  listing_type   text DEFAULT 'product'
                 CHECK (listing_type IN ('product','service','appointment','quote','contact_only','direct_service')),
  price          numeric(10,2) DEFAULT 0,
  original_price numeric(10,2),
  image_url      text,
  whatsapp       text,              -- override vendor WhatsApp for this item
  is_active      boolean DEFAULT true,
  is_bestseller  boolean DEFAULT false,
  stock_status   text DEFAULT 'in_stock'
                 CHECK (stock_status IN ('in_stock','out_of_stock','pre_order')),
  sort_order     int DEFAULT 0,
  rating_avg     numeric(3,2) DEFAULT 0,
  review_count   int DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shop_listing_id ON shop_listings(listing_id);
CREATE INDEX IF NOT EXISTS idx_shop_active     ON shop_listings(listing_id, is_active, sort_order);

ALTER TABLE shop_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shop_public_read" ON shop_listings
  FOR SELECT USING (is_active = true);

CREATE POLICY "shop_owner_write" ON shop_listings
  FOR ALL USING (
    listing_id IN (
      SELECT id FROM listings WHERE owner_id = auth.uid()
    )
  );


-- ── 5. Helpful votes (anonymous, rate-limited by IP in app) ──
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  review_id  uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  voter_fp   text NOT NULL,   -- browser fingerprint / session id from client
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (review_id, voter_fp)
);

ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "helpful_public_insert" ON review_helpful_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "helpful_public_select" ON review_helpful_votes
  FOR SELECT USING (true);

-- Trigger: keep reviews.helpful_count in sync
CREATE OR REPLACE FUNCTION sync_helpful_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE reviews
  SET helpful_count = (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = COALESCE(NEW.review_id, OLD.review_id))
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_helpful_count ON review_helpful_votes;
CREATE TRIGGER trg_sync_helpful_count
  AFTER INSERT OR DELETE ON review_helpful_votes
  FOR EACH ROW EXECUTE FUNCTION sync_helpful_count();
