-- =============================================================================
-- MalayaliBusiness UAE — Migration v2  (DROP & RECREATE — clean slate)
-- Run in Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- DROP everything in reverse-dependency order (safe on empty/partial tables)
-- ─────────────────────────────────────────────────────────────────────────────
-- Drop indexes explicitly first (in case tables can't be dropped cleanly)
DROP INDEX IF EXISTS idx_classifieds_category;
DROP INDEX IF EXISTS idx_classifieds_emirate;
DROP INDEX IF EXISTS idx_classifieds_type;
DROP INDEX IF EXISTS idx_classifieds_status;
DROP INDEX IF EXISTS idx_classifieds_featured;
DROP INDEX IF EXISTS idx_classifieds_created;
DROP INDEX IF EXISTS idx_events_date;
DROP INDEX IF EXISTS idx_events_category;
DROP INDEX IF EXISTS idx_events_emirate;
DROP INDEX IF EXISTS idx_events_featured;
DROP INDEX IF EXISTS idx_jobs_category;
DROP INDEX IF EXISTS idx_jobs_emirate;
DROP INDEX IF EXISTS idx_jobs_type;
DROP INDEX IF EXISTS idx_jobs_featured;
DROP INDEX IF EXISTS idx_jobs_created;
DROP INDEX IF EXISTS idx_posts_slug;
DROP INDEX IF EXISTS idx_posts_category;
DROP INDEX IF EXISTS idx_posts_featured;
DROP INDEX IF EXISTS idx_posts_trending;
DROP INDEX IF EXISTS idx_posts_pub;
DROP INDEX IF EXISTS idx_comments_post;
DROP INDEX IF EXISTS idx_shop_vendor_slug;
DROP INDEX IF EXISTS idx_shop_category;
DROP INDEX IF EXISTS idx_shop_emirate;
DROP INDEX IF EXISTS idx_shop_featured;
DROP INDEX IF EXISTS idx_shop_type;

-- Drop tables in reverse-dependency order
DROP TABLE IF EXISTS community_comments   CASCADE;
DROP TABLE IF EXISTS community_posts      CASCADE;
DROP TABLE IF EXISTS job_applications     CASCADE;
DROP TABLE IF EXISTS jobs                 CASCADE;
DROP TABLE IF EXISTS event_registrations  CASCADE;
DROP TABLE IF EXISTS events               CASCADE;
DROP TABLE IF EXISTS classifieds          CASCADE;
DROP TABLE IF EXISTS shop_listings        CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CLASSIFIEDS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE classifieds (
  id             bigserial    PRIMARY KEY,
  title          text         NOT NULL,
  title_ml       text,
  description    text,
  description_ml text,
  category       text         NOT NULL DEFAULT 'community',
  category_ml    text,
  subcategory    text,
  price          text,
  price_numeric  numeric,
  negotiable     boolean      NOT NULL DEFAULT false,
  type           text         NOT NULL DEFAULT 'sale',
  condition      text,
  emirate        text         NOT NULL DEFAULT 'Dubai',
  location       text,
  location_ml    text,
  images         text[]       NOT NULL DEFAULT '{}',
  views          integer      NOT NULL DEFAULT 0,
  featured       boolean      NOT NULL DEFAULT false,
  urgent         boolean      NOT NULL DEFAULT false,
  phone          text,
  whatsapp       text,
  seller_name    text,
  seller_name_ml text,
  seller_avatar  text,
  owner_id       uuid         REFERENCES auth.users(id) ON DELETE SET NULL,
  status         text         NOT NULL DEFAULT 'active',
  expires_at     timestamptz  DEFAULT (now() + interval '60 days'),
  created_at     timestamptz  NOT NULL DEFAULT now(),
  updated_at     timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE classifieds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classifieds_public_read"  ON classifieds FOR SELECT USING (status = 'active');
CREATE POLICY "classifieds_auth_insert"  ON classifieds FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "classifieds_owner_update" ON classifieds FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "classifieds_owner_delete" ON classifieds FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_classifieds_category ON classifieds(category);
CREATE INDEX IF NOT EXISTS idx_classifieds_emirate  ON classifieds(emirate);
CREATE INDEX IF NOT EXISTS idx_classifieds_type     ON classifieds(type);
CREATE INDEX IF NOT EXISTS idx_classifieds_status   ON classifieds(status);
CREATE INDEX IF NOT EXISTS idx_classifieds_featured ON classifieds(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_classifieds_created  ON classifieds(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. EVENTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE events (
  id             text         PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title          text         NOT NULL,
  title_ml       text,
  description    text,
  description_ml text,
  category       text         NOT NULL DEFAULT 'cultural',
  event_date     date         NOT NULL,
  event_time     text,
  end_time       text,
  emirate        text         NOT NULL DEFAULT 'Dubai',
  emirate_ml     text,
  venue          text,
  venue_ml       text,
  price          numeric,
  capacity       integer,
  registered     integer      NOT NULL DEFAULT 0,
  image_url      text,
  organizer      text,
  organizer_id   uuid         REFERENCES auth.users(id) ON DELETE SET NULL,
  tags           text[]       NOT NULL DEFAULT '{}',
  featured       boolean      NOT NULL DEFAULT false,
  status         text         NOT NULL DEFAULT 'active',
  created_at     timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read"      ON events FOR SELECT USING (status = 'active');
CREATE POLICY "events_auth_insert"      ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "events_organizer_update" ON events FOR UPDATE TO authenticated USING (organizer_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_events_date     ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_emirate  ON events(emirate);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured) WHERE featured = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. EVENT REGISTRATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE event_registrations (
  id         bigserial    PRIMARY KEY,
  event_id   text         NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id    uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text,
  email      text,
  phone      text,
  created_at timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_reg_read_own"   ON event_registrations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "event_reg_insert"     ON event_registrations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "event_reg_delete_own" ON event_registrations FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. JOBS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE jobs (
  id              text         PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title           text         NOT NULL,
  title_ml        text,
  company         text         NOT NULL,
  company_ml      text,
  logo_url        text,
  emirate         text         NOT NULL DEFAULT 'Dubai',
  emirate_ml      text,
  location        text,
  location_ml     text,
  job_type        text         NOT NULL DEFAULT 'full-time',
  experience      text         NOT NULL DEFAULT 'mid',
  salary_min      numeric,
  salary_max      numeric,
  category        text         NOT NULL DEFAULT 'Technology',
  category_ml     text,
  description     text,
  description_ml  text,
  requirements    text[]       NOT NULL DEFAULT '{}',
  requirements_ml text[]       NOT NULL DEFAULT '{}',
  deadline        date,
  applicants      integer      NOT NULL DEFAULT 0,
  featured        boolean      NOT NULL DEFAULT false,
  urgent          boolean      NOT NULL DEFAULT false,
  verified        boolean      NOT NULL DEFAULT false,
  poster_id       uuid         REFERENCES auth.users(id) ON DELETE SET NULL,
  status          text         NOT NULL DEFAULT 'active',
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_public_read"   ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "jobs_auth_insert"   ON jobs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "jobs_poster_update" ON jobs FOR UPDATE TO authenticated USING (poster_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_emirate  ON jobs(emirate);
CREATE INDEX IF NOT EXISTS idx_jobs_type     ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_jobs_created  ON jobs(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. JOB APPLICATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE job_applications (
  id         bigserial    PRIMARY KEY,
  job_id     text         NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id    uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_note text,
  resume_url text,
  status     text         NOT NULL DEFAULT 'pending',
  created_at timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (job_id, user_id)
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "job_app_read_own" ON job_applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "job_app_insert"   ON job_applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. COMMUNITY POSTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE community_posts (
  id             text         PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug           text         UNIQUE NOT NULL,
  title          text         NOT NULL,
  title_ml       text,
  excerpt        text,
  excerpt_ml     text,
  body           text,
  body_ml        text,
  category       text         NOT NULL DEFAULT 'Business',
  category_ml    text,
  author_name    text         NOT NULL DEFAULT 'Anonymous',
  author_name_ml text,
  author_avatar  text,
  author_role    text,
  author_role_ml text,
  image_url      text,
  read_time      integer      NOT NULL DEFAULT 5,
  views          integer      NOT NULL DEFAULT 0,
  likes          integer      NOT NULL DEFAULT 0,
  comments_count integer      NOT NULL DEFAULT 0,
  featured       boolean      NOT NULL DEFAULT false,
  trending       boolean      NOT NULL DEFAULT false,
  tags           text[]       NOT NULL DEFAULT '{}',
  author_id      uuid         REFERENCES auth.users(id) ON DELETE SET NULL,
  status         text         NOT NULL DEFAULT 'published',
  published_at   timestamptz  NOT NULL DEFAULT now(),
  created_at     timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read"   ON community_posts FOR SELECT USING (status = 'published');
CREATE POLICY "posts_auth_insert"   ON community_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "posts_author_update" ON community_posts FOR UPDATE TO authenticated USING (author_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_posts_slug     ON community_posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON community_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_posts_trending ON community_posts(trending) WHERE trending = true;
CREATE INDEX IF NOT EXISTS idx_posts_pub      ON community_posts(published_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. COMMUNITY COMMENTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE community_comments (
  id            bigserial    PRIMARY KEY,
  post_id       text         NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id       uuid         REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name   text         NOT NULL DEFAULT 'Anonymous',
  author_avatar text,
  body          text         NOT NULL,
  likes         integer      NOT NULL DEFAULT 0,
  created_at    timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_public_read"   ON community_comments FOR SELECT USING (true);
CREATE POLICY "comments_auth_insert"   ON community_comments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "comments_author_delete" ON community_comments FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. SHOP LISTINGS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE shop_listings (
  id                text         PRIMARY KEY DEFAULT gen_random_uuid()::text,
  listing_id        uuid,
  vendor_slug       text,
  vendor_name       text         NOT NULL DEFAULT '',
  vendor_name_ml    text,
  vendor_logo_url   text,
  vendor_emirate    text         NOT NULL DEFAULT 'Dubai',
  vendor_emirate_ml text,
  vendor_verified   boolean      NOT NULL DEFAULT false,
  vendor_whatsapp   text,
  vendor_phone      text,
  listing_type      text         NOT NULL DEFAULT 'product',
  name              text         NOT NULL,
  name_ml           text,
  description       text,
  description_ml    text,
  category          text         NOT NULL DEFAULT 'General',
  category_ml       text,
  price             numeric      NOT NULL DEFAULT 0,
  original_price    numeric,
  currency          text         NOT NULL DEFAULT 'AED',
  unit              text,
  unit_ml           text,
  image_url         text,
  images            text[]       NOT NULL DEFAULT '{}',
  rating_avg        numeric      NOT NULL DEFAULT 0,
  review_count      integer      NOT NULL DEFAULT 0,
  is_active         boolean      NOT NULL DEFAULT true,
  is_featured       boolean      NOT NULL DEFAULT false,
  is_bestseller     boolean      NOT NULL DEFAULT false,
  duration          text,
  slots             text[]       NOT NULL DEFAULT '{}',
  tags              text[]       NOT NULL DEFAULT '{}',
  tags_ml           text[]       NOT NULL DEFAULT '{}',
  sort_order        integer      NOT NULL DEFAULT 0,
  created_at        timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE shop_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_listings_public_read" ON shop_listings FOR SELECT USING (is_active = true);
CREATE POLICY "shop_listings_auth_insert" ON shop_listings FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_shop_vendor_slug ON shop_listings(vendor_slug);
CREATE INDEX IF NOT EXISTS idx_shop_category    ON shop_listings(category);
CREATE INDEX IF NOT EXISTS idx_shop_emirate     ON shop_listings(vendor_emirate);
CREATE INDEX IF NOT EXISTS idx_shop_featured    ON shop_listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_shop_type        ON shop_listings(listing_type);

-- ─────────────────────────────────────────────────────────────────────────────
-- ADMIN HELPER
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE((SELECT is_admin FROM profiles WHERE id = auth.uid()), false);
$$;

CREATE POLICY "classifieds_admin_all" ON classifieds     FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "events_admin_all"      ON events          FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "jobs_admin_all"        ON jobs            FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "posts_admin_all"       ON community_posts FOR ALL TO authenticated USING (is_admin());

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- CLASSIFIEDS
INSERT INTO classifieds (title, title_ml, description, description_ml, category, category_ml, subcategory, price, price_numeric, negotiable, type, condition, emirate, location, location_ml, images, views, featured, urgent, phone, whatsapp, seller_name, seller_name_ml, seller_avatar, status) VALUES
('2021 Toyota Camry 2.5L — Excellent Condition', '2021 Toyota Camry 2.5L', 'Single owner, full service history. Only 42,000km. GCC spec, sunroof, leather seats, reverse camera. Selling due to relocation to Kerala.', 'ഒറ്റ ഉടമ. 42,000km. GCC സ്‌പെക്.', 'vehicles', 'വാഹനങ്ങൾ', 'Sedan', 'AED 62,000', 62000, true, 'sale', 'like-new', 'Dubai', 'Al Barsha', 'അൽ ബർഷ', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'], 1842, true, false, '+971501234567', '+971501234567', 'Anoop Kumar', 'അനൂപ് കുമാർ', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', 'active'),
('2BHK Apartment for Rent — JVC, Dubai', 'JVC 2BHK അപ്പാർട്ടുമെന്റ്', 'Spacious 2BHK in JVC. 1350 sqft, gym, pool, covered parking, 24/7 security. Chiller-free.', 'JVC-ൽ 1350 sqft 2BHK. ജിം, പൂൾ, പാർക്കിംഗ്.', 'property', 'പ്രോപ്പർടി', 'Apartment', 'AED 70,000/yr', 70000, true, 'rent', NULL, 'Dubai', 'JVC', 'JVC', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'], 3241, true, false, '+971552345678', '+971552345678', 'Deepa Suresh', 'ദീപ സുരേഷ്', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', 'active'),
('iPhone 15 Pro Max 256GB — Natural Titanium', 'iPhone 15 Pro Max 256GB', 'Used 4 months. Excellent condition. Full kit. AppleCare+ till Dec 2025.', '4 മാസം ഉപയോഗിച്ചത്. AppleCare+ ഡിസംബർ 2025 വരെ.', 'electronics', 'ഇലക്ട്രോണിക്സ്', 'Smartphones', 'AED 4,200', 4200, false, 'sale', 'like-new', 'Sharjah', 'Al Nahda', 'അൽ നഹ്ദ', ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80'], 987, false, true, '+971561234567', '+971561234567', 'Vishnu Prasad', 'വിഷ്ണു പ്രസാദ്', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', 'active'),
('L-Shape Sofa Set — IKEA KIVIK — Like New', 'IKEA KIVIK L-Shape Sofa', 'IKEA KIVIK L-shape sofa. Light grey, removable covers. 6 months old. Self-collect Mussafah.', 'IKEA KIVIK L-ഷേപ്പ് സോഫ. 6 മാസം. Mussafah.', 'furniture', 'ഫർണിച്ചർ', 'Sofas', 'AED 1,800', 1800, true, 'sale', 'like-new', 'Abu Dhabi', 'Mussafah', 'മുസ്സഫ', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'], 654, false, false, '+971507654321', '+971507654321', 'Reena Thomas', 'രീന തോമസ്', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', 'active'),
('Kerala Home-Cooked Meals — Delivery Dubai', 'കേരള ഭക്ഷണം — ദുബായ് ഡെലിവറി', 'Authentic Kerala meals cooked fresh daily. Fish curry, sambar, appam & stew. Tiffin AED 35/day.', 'പ്രതിദിനം കേരള ഭക്ഷണം. AED 35/ദിവസം.', 'food', 'ഭക്ഷണം', 'Home Food', 'AED 35/day', 35, false, 'service', NULL, 'Dubai', 'Karama', 'കരമ', ARRAY['https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80'], 2340, true, false, '+971568765432', '+971568765432', 'Meena Pillai', 'മീന പിള്ള', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', 'active'),
('Samsung 65" QLED 4K Smart TV', 'Samsung 65" QLED 4K TV', 'Samsung Neo QLED 4K 2023. 120Hz, Gaming Mode. Moving abroad.', 'Samsung QLED 4K 2023. 120Hz. Moving abroad.', 'electronics', 'ഇലക്ട്രോണിക്സ്', 'TVs', 'AED 3,500', 3500, false, 'sale', 'good', 'Dubai', 'Al Quoz', 'അൽ ഖൂസ്', ARRAY['https://images.unsplash.com/photo-1593359677879-a4bb92f4ace?w=800&q=80'], 1120, false, false, '+971554321987', '+971554321987', 'Sanjay Menon', 'സഞ്ജയ് മേനോൻ', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', 'active'),
('Studio for Rent — Al Nahda Sharjah', 'Studio വാടക — Al Nahda Sharjah', '650 sqft studio near Dubai border. Balcony, chiller-free, free parking. AED 21,000/yr.', '650 sqft studio. Dubai border അടുത്ത്. AED 21,000/yr.', 'property', 'പ്രോപ്പർടി', 'Studio', 'AED 21,000/yr', 21000, true, 'rent', NULL, 'Sharjah', 'Al Nahda', 'അൽ നഹ്ദ', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'], 1890, false, false, '+971505566778', '+971505566778', 'Biju Varghese', 'ബിജു വർഗ്ഗീസ്', 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?w=100&q=80', 'active'),
('Traditional Kerala Saree Collection', 'കേരള കസവ് സാരി', '6 premium Kerala kasavu sarees. 2 worn once, 4 unused. Palakkad handloom. AED 150-350 each.', '6 Kerala കസവ് സാരി. പാലക്കാട് ഹാൻഡ്‌ലൂം.', 'fashion', 'ഫാഷൻ', 'Traditional Wear', 'AED 150-350', 150, true, 'sale', 'new', 'Dubai', 'Deira', 'ദേര', ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'], 567, false, false, '+971558899001', '+971558899001', 'Lakshmi Rao', 'ലക്ഷ്മി റാവ്', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80', 'active');

-- EVENTS
INSERT INTO events (id, title, title_ml, description, description_ml, category, event_date, event_time, end_time, emirate, emirate_ml, venue, venue_ml, price, capacity, registered, image_url, organizer, tags, featured, status) VALUES
('onam-2025', 'Grand Onam Celebration 2025', 'ഗ്രാൻഡ് ഓണം ആഘോഷം 2025', 'Join thousands of Malayalis for the biggest Onam celebration in Dubai. Pookalam competition, Vallam Kali, Onasadya, cultural performances.', 'ദുബായിലെ ഏറ്റവും വലിയ ഓണം ആഘോഷം. പൂക്കളം, വള്ളം കളി, ഓണസദ്യ.', 'cultural', '2025-09-06', '10:00 AM', '10:00 PM', 'Dubai', 'ദുബായ്', 'Dubai World Trade Centre', 'ദുബായ് വേൾഡ് ട്രേഡ് സെന്റർ', NULL, 5000, 3847, 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=1200&q=80', 'Dubai Malayali Association', ARRAY['Onam','Cultural','Family','Free Entry'], true, 'active'),
('kerala-business-summit', 'Kerala Business Summit 2025', 'കേരള ബിസിനസ് സമ്മിറ്റ് 2025', 'Connect with 500+ Malayali entrepreneurs, investors, and business leaders. Keynote speeches, panel discussions, and networking dinner.', '500+ മലയാളി സംരംഭകർ. കീനോട്ട്, പാനൽ ചർച്ചകൾ.', 'business', '2025-10-15', '9:00 AM', '8:00 PM', 'Abu Dhabi', 'അബൂദബി', 'ADNEC Convention Centre', 'ADNEC കൺവെൻഷൻ സെന്റർ', 150, 500, 312, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80', 'Malayali Business Council UAE', ARRAY['Business','Networking','Investment'], true, 'active'),
('kerala-food-festival', 'Kerala Food Festival — Dubai', 'കേരള ഫുഡ് ഫെസ്റ്റിവൽ — ദുബായ്', 'Three days of authentic Kerala cuisine. 50+ food stalls, cooking competitions, celebrity chef demonstrations.', 'മൂന്ന് ദിവസം കേരള ഭക്ഷണം. 50+ സ്‌റ്റോളുകൾ.', 'food', '2025-11-21', '11:00 AM', '11:00 PM', 'Dubai', 'ദുബായ്', 'Dubai Festival City', 'ദുബായ് ഫെസ്റ്റിവൽ സിറ്റി', 25, 2000, 847, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80', 'Kerala Culinary Association Dubai', ARRAY['Food','Culture','Family'], true, 'active'),
('malayali-cricket-t20', 'Malayali Premier League — T20 Cricket', 'മലയാളി പ്രീമിയർ ലീഗ് — T20 ക്രിക്കറ്റ്', 'Annual T20 cricket tournament for Malayali teams across UAE. 16 teams, AED 50,000 prize pool.', 'UAE മലയാളി T20 ടൂർണ്ണമെന്റ്. 16 ടീം, AED 50,000.', 'sports', '2025-12-05', '7:00 AM', '7:00 PM', 'Sharjah', 'ഷാർജ', 'Sharjah Cricket Stadium', 'ഷാർജ ക്രിക്കറ്റ് സ്‌റ്റേഡിയം', NULL, 1500, 623, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80', 'Gulf Malayali Cricket Association', ARRAY['Cricket','Sports','Free Entry'], false, 'active'),
('uae-kerala-career-fair', 'UAE-Kerala Career Fair 2025', 'UAE-Kerala കരിയർ ഫെയർ 2025', 'Meet 80+ top companies hiring Malayalis. Free resume review, mock interviews, on-spot offers.', '80+ കമ്പനികൾ. ഫ്രീ resume review, mock interview.', 'education', '2025-10-25', '10:00 AM', '6:00 PM', 'Dubai', 'ദുബായ്', 'Madinat Jumeirah', 'മദീനത് ജുമൈറ', NULL, 3000, 1240, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80', 'NRI Career Connect', ARRAY['Jobs','Career','Free Entry'], false, 'active'),
('keralite-networking-night', 'Keralite Professionals Networking Night', 'കേരളൈറ്റ് പ്രൊഫഷണൽ നെറ്റ്‌വർക്കിംഗ് നൈറ്റ്', 'Monthly professionals meet-up in Dubai. Drinks, dinner, and meaningful conversations. 100-seat event.', 'ദുബായ് പ്രൊഫഷണൽ മീറ്റ്-അപ്പ്. ഡ്രിങ്ക്സ്, ഡിന്നർ, 100 സീറ്റ്.', 'networking', '2025-08-15', '7:00 PM', '11:00 PM', 'Dubai', 'ദുബായ്', 'Coya Dubai, DIFC', 'Coya Dubai, DIFC', 200, 100, 87, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80', 'Malayali Professionals UAE', ARRAY['Networking','Professionals','DIFC'], false, 'active');

-- JOBS
INSERT INTO jobs (id, title, title_ml, company, company_ml, logo_url, emirate, emirate_ml, location, location_ml, job_type, experience, salary_min, salary_max, category, category_ml, description, description_ml, requirements, requirements_ml, deadline, applicants, featured, urgent, verified, status) VALUES
('sr-software-engineer-techventures', 'Senior Software Engineer', 'സീനിയർ സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയർ', 'TechVentures MENA', 'TechVentures MENA', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80', 'Dubai', 'ദുബായ്', 'Dubai Internet City', 'ദുബായ് ഇന്റർനെറ്റ് സിറ്റി', 'full-time', 'senior', 20000, 30000, 'Technology', 'ടെക്നോളജി', 'Looking for a Senior Software Engineer for our fintech team. Build scalable backend services using Node.js, Go, and AWS.', 'Fintech team-ൽ Senior Software Engineer ആവശ്യം.', ARRAY['5+ years experience','Node.js / Go','AWS / GCP','System Design'], ARRAY['5+ വർഷം','Node.js / Go','AWS / GCP'], '2025-07-14', 47, true, false, true, 'active'),
('relationship-manager-nri-banking', 'Relationship Manager — NRI Banking', 'റിലേഷൻഷിപ്പ് മാനേജർ — NRI ബാങ്കിംഗ്', 'Emirates National Bank', 'Emirates National Bank', 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=100&q=80', 'Dubai', 'ദുബായ്', 'DIFC', 'DIFC', 'full-time', 'mid', 12000, 18000, 'Finance', 'ഫിനാൻസ്', 'Manage relationships with high-value NRI clients. Malayalam language fluency preferred.', 'NRI ക്ലയന്റ് മാനേജ്‌മെന്റ്. Malayalam ഭാഷ plus.', ARRAY['3+ years banking','Malayalam + English','KYC / AML'], ARRAY['3+ വർഷം ബാങ്കിംഗ്','Malayalam + English'], '2025-06-30', 23, true, true, true, 'active'),
('healthcare-nurse-abu-dhabi', 'Registered Nurse — ICU / CCU', 'RN — ICU / CCU', 'Cleveland Clinic Abu Dhabi', 'Cleveland Clinic Abu Dhabi', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80', 'Abu Dhabi', 'അബൂദബി', 'Al Maryah Island', 'അൽ മരിയ ഐലൻഡ്', 'full-time', 'mid', 9000, 14000, 'Healthcare', 'ഹെൽത്ത്‌കെയർ', 'RN position in ICU/CCU. DOH licence required or assistance provided. Relocation + housing + flights.', 'ICU/CCU RN. DOH licence. Relocation + housing + flights.', ARRAY['BSc Nursing','2+ years ICU','DOH / DHA licence','BLS / ACLS'], ARRAY['BSc Nursing','2+ years ICU','DOH licence'], '2025-08-01', 61, true, false, true, 'active'),
('real-estate-agent-dubai', 'Real Estate Consultant', 'റിയൽ എസ്‌റ്റേറ്റ് കൺസൾട്ടന്റ്', 'Emaar Properties', 'Emaar Properties', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=100&q=80', 'Dubai', 'ദുബായ്', 'Downtown Dubai', 'ഡൗൺടൗൺ ദുബായ്', 'full-time', 'mid', 5000, 25000, 'Real Estate', 'റിയൽ എസ്‌റ്റേറ്റ്', 'Multilingual real estate consultants. Malayalam + English a huge advantage. RERA licence sponsorship.', 'Malayalam + English consultant. RERA licence sponsorship.', ARRAY['RERA licence','Malayalam + English','UAE driving licence'], ARRAY['RERA licence','Malayalam + English'], '2025-07-31', 34, false, true, true, 'active'),
('digital-marketing-manager', 'Digital Marketing Manager', 'ഡിജിറ്റൽ മാർക്കറ്റിംഗ് മാനേജർ', 'Gulf Retail Group', 'Gulf Retail Group', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&q=80', 'Dubai', 'ദുബായ്', 'Business Bay', 'ബിസിനസ് ബേ', 'full-time', 'mid', 10000, 16000, 'Marketing', 'മാർക്കറ്റിംഗ്', 'Lead digital marketing for a retail group with 25 stores across UAE. Manage SEO, paid ads, social media.', '25 stores retail group. SEO, paid ads, social media.', ARRAY['4+ years digital marketing','Meta & Google Ads','SEO & analytics'], ARRAY['4+ years','Meta & Google certified','SEO'], '2025-06-28', 28, false, false, true, 'active'),
('teacher-kerala-curriculum', 'Malayalam & Social Studies Teacher', 'Malayalam ടീച്ചർ', 'Indian High School Dubai', 'Indian High School Dubai', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&q=80', 'Dubai', 'ദുബായ്', 'Oud Metha', 'ഔദ് മേഥ', 'full-time', 'mid', 5000, 8000, 'Education', 'വിദ്യാഭ്യാസം', 'CBSE curriculum grades 6-10. Must be native Malayalam speaker. Accommodation assistance.', 'CBSE Grades 6-10. Native Malayalam speaker.', ARRAY['B.Ed required','Malayalam native speaker','CBSE experience'], ARRAY['B.Ed','Native Malayalam','CBSE'], '2025-07-10', 9, false, false, true, 'active');

-- COMMUNITY POSTS
INSERT INTO community_posts (id, slug, title, title_ml, excerpt, excerpt_ml, category, category_ml, author_name, author_name_ml, author_avatar, author_role, author_role_ml, image_url, read_time, views, likes, comments_count, featured, trending, tags, body, status) VALUES
('post-uae-business-setup', 'uae-business-setup-guide', 'Complete Guide to Starting a Business in UAE as a Malayali', 'UAE-ൽ ഒരു മലയാളി ബിസിനസ് ആരംഭിക്കുന്നതിനുള്ള ഗൈഡ്', 'From free zone vs mainland to visa sponsorship — everything a Malayali entrepreneur needs to know.', 'ഫ്രീ സോൺ vs മെയിൻലാൻഡ് മുതൽ വിസ സ്പോൺസർഷിപ്പ് വരെ.', 'Business', 'ബിസിനസ്', 'Rajan Nair', 'രാജൻ നായർ', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', 'Business Consultant', 'ബിസിനസ് കൺസൾട്ടന്റ്', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', 8, 12450, 342, 47, true, true, ARRAY['Business Setup','Freezone','Visa'], 'Starting a business in the UAE can be one of the most rewarding decisions for a Malayali entrepreneur. The UAE offers a tax-free environment, world-class infrastructure, and access to a global market.', 'published'),
('post-uae-golden-visa', 'uae-golden-visa-malayalis', 'UAE Golden Visa: How Malayalis Can Qualify in 2025', 'UAE ഗോൾഡൻ വിസ: 2025-ൽ മലയാളികൾ എങ്ങനെ അർഹത നേടാം', 'The UAE Golden Visa has new categories in 2025. Here is which Malayali professionals qualify.', 'UAE ഗോൾഡൻ വിസ 2025-ൽ പുതിയ ക്യാറ്റഗറികൾ. ഏതൊക്കെ മലയാളികൾക്ക് അർഹതയുണ്ട്.', 'Legal', 'നിയമം', 'Advocate Priya Nambiar', 'അഡ്വക്കേറ്റ് പ്രിയ നമ്പ്യാർ', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80', 'Immigration Lawyer', 'ഇമിഗ്രേഷൻ അഭിഭാഷക', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80', 6, 8920, 287, 31, true, true, ARRAY['Golden Visa','Immigration','Legal'], 'The UAE Golden Visa program continues to expand in 2025. From investors to skilled professionals, here is a complete guide for Malayalis on how to qualify and apply.', 'published'),
('post-kerala-food-dubai', 'best-kerala-restaurants-dubai', 'Top 10 Authentic Kerala Restaurants in Dubai', 'ദുബായിലെ മികച്ച 10 Kerala റസ്‌റ്റോറന്റുകൾ', 'We visited 30+ restaurants claiming Kerala food. Here are the 10 that actually deliver.', '30+ Kerala restaurant സന്ദർശിച്ചു. ഇതാ 10 best.', 'Food', 'ഭക്ഷണം', 'Meena Pillai', 'മീന പിള്ള', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', 'Food Blogger', 'ഫുഡ് ബ്ലോഗർ', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80', 7, 21300, 534, 89, false, true, ARRAY['Food','Restaurants','Kerala Cuisine'], 'Dubai has hundreds of restaurants claiming to serve authentic Kerala food. After visiting over 30 establishments, we narrowed it down to the best 10 that truly deliver on the promise of home-cooked Kerala flavours.', 'published'),
('post-remittance-guide', 'best-money-transfer-kerala-2025', 'Cheapest Ways to Send Money from UAE to Kerala in 2025', '2025-ൽ UAE-ൽ നിന്ന് കേരളത്തിലേക്ക് പണം അയക്കാനുള്ള ഏറ്റവും ചെലവ് കുറഞ്ഞ വഴി', 'We compared 12 remittance services — exchange rates, fees, and speed. Save thousands of dirhams a year.', '12 remittance services താരതമ്യം. ആയിരക്കണക്കിന് dirham ലാഭിക്കൂ.', 'Finance', 'ഫിനാൻസ്', 'Sanjay Menon', 'സഞ്ജയ് മേനോൻ', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', 'Financial Advisor', 'ഫിനാൻഷ്യൽ അഡൈ്വസർ', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80', 5, 9870, 198, 24, false, false, ARRAY['Remittance','Finance','Money Transfer'], 'Every dirham counts. We analyzed 12 major remittance services in the UAE and compared their exchange rates, fees, and transfer speed to Kerala.', 'published'),
('post-malayali-success-story', 'from-kerala-to-ceo-uae', 'From Kerala to CEO: The Inspirational Journey of Anoop Kumar', 'Kerala-ൽ നിന്ന് CEO-ലേക്ക്: അനൂപ് കുമാറിന്റെ യാത്ര', 'Anoop arrived in Dubai with AED 500. Today he runs a AED 120 million logistics company.', 'AED 500 ഉം ആയി ദുബായ് ലാൻഡ് ആയ അനൂപ്. ഇന്ന് AED 120 million company.', 'Inspiration', 'പ്രചോദനം', 'Editorial Team', 'എഡിറ്റോറിയൽ ടീം', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', 'Editor', 'എഡിറ്റർ', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80', 10, 18900, 623, 102, true, false, ARRAY['Success Story','Entrepreneur','Inspiration'], 'Fifteen years ago, Anoop Kumar stepped off a flight at Dubai International Airport with AED 500. Today he is the founder and CEO of KL Logistics, moving 2,000+ containers monthly across the GCC.', 'published');

-- COMMUNITY COMMENTS
INSERT INTO community_comments (post_id, author_name, author_avatar, body) VALUES
('post-uae-business-setup', 'Suresh Pillai', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80', 'Very helpful guide. I used this to set up my trading company in Jebel Ali last month. Everything is exactly as described.'),
('post-uae-business-setup', 'Aisha Mohammed', 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&q=80', 'Does this apply for a solo consultant too, or only for product-based businesses?'),
('post-uae-business-setup', 'Rajan Nair', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', 'Yes, applies for consultants too. Freelance permit through Dubai Economy is a great option.'),
('post-kerala-food-dubai', 'Deepa Suresh', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', 'Spice Route in Jumeirah is a must-visit! The fish curry is exactly like what amma makes.'),
('post-kerala-food-dubai', 'Vishnu Prasad', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', 'Calicut Notebook in Business Bay has the best Malabar biryani outside Kerala in my opinion.'),
('post-malayali-success-story', 'Priya Nambiar', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80', 'Incredible story. Anoop anna is an inspiration to all Malayalis in the Gulf.'),
('post-uae-golden-visa', 'Biju Varghese', 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?w=100&q=80', 'Nurses now qualify under the skilled worker category. Great news!'),
('post-remittance-guide', 'Reena Thomas', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', 'Switched to LuLu Money after reading this. Saved AED 200 per month. Highly recommend.');

-- SHOP LISTINGS
INSERT INTO shop_listings (id, vendor_slug, vendor_name, vendor_name_ml, vendor_logo_url, vendor_emirate, vendor_emirate_ml, vendor_verified, vendor_whatsapp, vendor_phone, listing_type, name, name_ml, description, description_ml, category, category_ml, price, original_price, currency, unit, unit_ml, image_url, images, rating_avg, review_count, is_active, is_featured, is_bestseller, duration, slots, tags, tags_ml, sort_order) VALUES
('kk-biryani-pack', 'kerala-kitchen-dubai', 'Kerala Kitchen Dubai', 'Kerala Kitchen Dubai', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80', 'Dubai', 'Dubai', true, '+971501234567', '+971501234567', 'product', 'Malabar Biryani Meal Pack (2 pax)', 'Malabar Biryani Pack', 'Authentic Malabar chicken biryani with raita, pickle, pappadam. Flash-frozen, ready to heat. Serves 2.', 'Malabar biryani.', 'Food & Grocery', 'Food', 55, 68, 'AED', NULL, NULL, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80'], 4.9, 312, true, true, true, NULL, ARRAY[]::text[], ARRAY['Biryani','Frozen','Ready to Heat'], ARRAY['Biryani'], 1),
('kk-sadya-pack', 'kerala-kitchen-dubai', 'Kerala Kitchen Dubai', 'Kerala Kitchen Dubai', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80', 'Dubai', 'Dubai', true, '+971501234567', '+971501234567', 'product', 'Kerala Sadya Box (10 items)', 'Kerala Sadya Box', 'Full Kerala Sadya: rice, sambar, rasam, avial, olan, thoran, payasam. Perfect for Onam.', 'Kerala Sadya box.', 'Food & Grocery', 'Food', 120, NULL, 'AED', NULL, NULL, 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80'], 4.8, 189, true, true, false, NULL, ARRAY[]::text[], ARRAY['Sadya','Onam','Traditional'], ARRAY['Sadya'], 2),
('kk-catering', 'kerala-kitchen-dubai', 'Kerala Kitchen Dubai', 'Kerala Kitchen Dubai', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80', 'Dubai', 'Dubai', true, '+971501234567', '+971501234567', 'quote', 'Event Catering Package', 'Event Catering', 'Full Kerala catering for weddings, corporate events, celebrations. 20-500+ guests.', 'Kerala catering.', 'Services', 'Services', 0, NULL, 'AED', 'Custom quote', 'Custom quote', 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80'], 4.7, 56, true, false, false, NULL, ARRAY[]::text[], ARRAY['Catering','Events','Wedding'], ARRAY['Catering'], 3),
('mh-gp-consult', 'menon-health-clinic-sharjah', 'Menon Health Clinic', 'Menon Health Clinic', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80', 'Sharjah', 'Sharjah', true, '+971555678901', '+971555678901', 'appointment', 'GP Consultation', 'GP Consultation', 'General physician consultation with Malayalam-speaking doctor. Includes basic health check.', 'GP consultation.', 'Healthcare', 'Healthcare', 120, NULL, 'AED', 'per session', 'per session', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80'], 4.9, 428, true, true, true, '30 min', ARRAY['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'], ARRAY['Doctor','GP','Consultation'], ARRAY['Doctor'], 4),
('mh-dental', 'menon-health-clinic-sharjah', 'Menon Health Clinic', 'Menon Health Clinic', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80', 'Sharjah', 'Sharjah', true, '+971555678901', '+971555678901', 'appointment', 'Dental Checkup & Cleaning', 'Dental Checkup', 'Full dental examination with scaling and cleaning. X-ray included.', 'Dental checkup.', 'Healthcare', 'Healthcare', 250, NULL, 'AED', 'per session', 'per session', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80'], 4.7, 203, true, false, false, '45 min', ARRAY['9:30 AM','11:00 AM','2:30 PM','4:00 PM'], ARRAY['Dental','Cleaning'], ARRAY['Dental'], 5),
('mh-health-package', 'menon-health-clinic-sharjah', 'Menon Health Clinic', 'Menon Health Clinic', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80', 'Sharjah', 'Sharjah', true, '+971555678901', '+971555678901', 'direct_service', 'Annual Family Health Package', 'Family Health Package', 'Comprehensive package for 4 family members: blood tests, ECG, X-ray, doctor consultation.', 'Family health package.', 'Healthcare', 'Healthcare', 799, 1200, 'AED', NULL, NULL, 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80'], 4.8, 87, true, true, true, NULL, ARRAY[]::text[], ARRAY['Health Package','Family'], ARRAY['Health'], 6),
('ab-bridal', 'asha-beauty-salon-ajman', 'Asha Beauty Salon', 'Asha Beauty Salon', 'https://images.unsplash.com/photo-1560066984-138daaa0c1c0?w=100&q=80', 'Ajman', 'Ajman', true, '+971506789012', '+971506789012', 'appointment', 'Kerala Bridal Package', 'Bridal Package', 'Full bridal makeover: Kerala Ayurvedic facial, saree draping, bridal mehendi, hair, makeup.', 'Bridal package.', 'Beauty & Wellness', 'Beauty', 850, 1100, 'AED', 'full day', 'full day', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80'], 5.0, 94, true, true, true, '5-6 hours', ARRAY['8:00 AM','9:00 AM'], ARRAY['Bridal','Mehendi','Makeup'], ARRAY['Bridal'], 7),
('ab-facial', 'asha-beauty-salon-ajman', 'Asha Beauty Salon', 'Asha Beauty Salon', 'https://images.unsplash.com/photo-1560066984-138daaa0c1c0?w=100&q=80', 'Ajman', 'Ajman', true, '+971506789012', '+971506789012', 'appointment', 'Kerala Ayurvedic Facial', 'Ayurvedic Facial', 'Rejuvenating Ayurvedic facial using natural herbal ingredients from Kerala.', 'Ayurvedic facial.', 'Beauty & Wellness', 'Beauty', 180, NULL, 'AED', 'per session', 'per session', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'], 4.8, 167, true, false, true, '60 min', ARRAY['10:00 AM','11:30 AM','1:00 PM','3:00 PM','5:00 PM'], ARRAY['Facial','Ayurvedic','Skincare'], ARRAY['Facial'], 8),
('ab-mehendi', 'asha-beauty-salon-ajman', 'Asha Beauty Salon', 'Asha Beauty Salon', 'https://images.unsplash.com/photo-1560066984-138daaa0c1c0?w=100&q=80', 'Ajman', 'Ajman', true, '+971506789012', '+971506789012', 'contact_only', 'Custom Mehendi Design', 'Mehendi Design', 'Traditional and Arabic mehendi for hands and feet. Home visits for bridal parties.', 'Mehendi design.', 'Beauty & Wellness', 'Beauty', 120, NULL, 'AED', 'from', 'from', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80'], 4.9, 78, true, false, false, NULL, ARRAY[]::text[], ARRAY['Mehendi','Henna'], ARRAY['Mehendi'], 9),
('tm-website', 'techmalayali-it-solutions', 'TechMalayali IT Solutions', 'TechMalayali IT', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d4?w=100&q=80', 'Dubai', 'Dubai', true, '+971521234599', '+971521234599', 'quote', 'Business Website Development', 'Website Development', '5-page professional website with mobile, SEO, contact form, WhatsApp. Delivered in 2 weeks.', 'Website development.', 'Technology', 'Technology', 2500, NULL, 'AED', 'from', 'from', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80'], 4.9, 43, true, true, true, NULL, ARRAY[]::text[], ARRAY['Website','Web Dev','SEO'], ARRAY['Website'], 10),
('tm-app', 'techmalayali-it-solutions', 'TechMalayali IT Solutions', 'TechMalayali IT', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d4?w=100&q=80', 'Dubai', 'Dubai', true, '+971521234599', '+971521234599', 'quote', 'Mobile App Development', 'App Development', 'iOS & Android app development. UI/UX design, API integration, app store submission.', 'Mobile app.', 'Technology', 'Technology', 8000, NULL, 'AED', 'from', 'from', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80'], 4.8, 28, true, false, false, NULL, ARRAY[]::text[], ARRAY['App','iOS','Android'], ARRAY['App'], 11),
('tm-seo', 'techmalayali-it-solutions', 'TechMalayali IT Solutions', 'TechMalayali IT', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d4?w=100&q=80', 'Dubai', 'Dubai', true, '+971521234599', '+971521234599', 'direct_service', 'Monthly SEO & Social Media Package', 'SEO & Social Media', 'Monthly SEO, Google My Business, Instagram + Facebook (12 posts/month), monthly report.', 'SEO and social media.', 'Technology', 'Technology', 1200, NULL, 'AED', 'per month', 'per month', 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80'], 4.7, 61, true, true, false, NULL, ARRAY[]::text[], ARRAY['SEO','Social Media','Marketing'], ARRAY['SEO'], 12),
('nl-visa', 'nair-associates-legal', 'Nair & Associates Legal', 'Nair & Associates', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&q=80', 'Abu Dhabi', 'Abu Dhabi', true, '+971554567890', '+971554567890', 'appointment', 'Visa Consultation (Golden Visa / Employment)', 'Visa Consultation', '1-hour with UAE visa specialist. Covers Golden Visa eligibility, family visa, employment visa.', 'Visa consultation.', 'Legal & Finance', 'Legal', 350, NULL, 'AED', 'per consultation', 'per consultation', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80'], 4.9, 156, true, true, true, '60 min', ARRAY['10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'], ARRAY['Visa','Golden Visa','Legal'], ARRAY['Visa'], 13),
('nl-company', 'nair-associates-legal', 'Nair & Associates Legal', 'Nair & Associates', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&q=80', 'Abu Dhabi', 'Abu Dhabi', true, '+971554567890', '+971554567890', 'quote', 'Company Formation in UAE', 'Company Formation', 'Complete setup: LLC, Freezone, or Mainland. Trade license, MOA, bank account opening.', 'Company formation.', 'Legal & Finance', 'Legal', 3500, NULL, 'AED', 'from', 'from', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80'], 4.8, 72, true, true, false, NULL, ARRAY[]::text[], ARRAY['Company','Freezone','LLC'], ARRAY['Company'], 14);
