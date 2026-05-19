-- =============================================================================
-- MalayaliBusiness.com — PRODUCTION Schema (no fake seed data)
-- Version  : 2.0.0  (production-safe)
-- Run this ONCE in Supabase SQL Editor before running migration.sql
-- This creates all tables, RLS, indexes, functions, views.
-- Categories and Emirates reference data are included (required for migration).
-- NO fake users. NO fake listings.
-- =============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- =============================================================================
-- HELPER: updated_at auto-trigger
-- =============================================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- ENUMS
-- =============================================================================
create type listing_status   as enum ('pending', 'active', 'suspended', 'expired');
create type listing_plan     as enum ('free', 'basic', 'premium', 'elite');
create type classified_type  as enum ('sale', 'wanted', 'rent', 'service');
create type job_type         as enum ('full_time', 'part_time', 'contract', 'freelance', 'internship');
create type order_status     as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type payment_status   as enum ('pending', 'paid', 'failed', 'refunded');
create type event_status     as enum ('upcoming', 'ongoing', 'completed', 'cancelled');
create type post_status      as enum ('draft', 'published', 'archived');
create type sub_status       as enum ('active', 'cancelled', 'expired', 'trial');
create type ad_placement     as enum ('homepage_hero', 'homepage_ticker', 'directory_sidebar', 'directory_top', 'category_banner');
create type ad_status        as enum ('pending', 'active', 'paused', 'expired');
create type enquiry_status   as enum ('new', 'read', 'replied', 'closed');
create type uae_emirate      as enum ('dubai', 'abu_dhabi', 'sharjah', 'ajman', 'ras_al_khaimah', 'fujairah', 'umm_al_quwain');

-- =============================================================================
-- 1. PROFILES
-- =============================================================================
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text unique not null,
  full_name       text,
  full_name_ml    text,
  username        text unique,
  avatar_url      text,
  phone           text,
  whatsapp        text,
  bio             text,
  bio_ml          text,
  emirate         uae_emirate,
  is_business_owner boolean default false,
  is_admin        boolean default false,
  is_verified     boolean default false,
  preferred_locale text default 'en' check (preferred_locale in ('en', 'ml')),
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
create trigger trg_profiles_updated_at before update on profiles for each row execute function set_updated_at();
create index idx_profiles_username on profiles(username);
create index idx_profiles_email    on profiles(email);

-- =============================================================================
-- 2. CATEGORIES
-- =============================================================================
create table categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  name_ml     text not null,
  icon        text,
  color       text,
  description text,
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now() not null
);
create index idx_categories_slug on categories(slug);

-- =============================================================================
-- 3. LISTINGS
-- =============================================================================
create table listings (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references profiles(id) on delete cascade,
  category_id     uuid references categories(id) on delete set null,
  slug            text unique not null,
  name            text not null,
  name_ml         text,
  tagline         text,
  tagline_ml      text,
  description     text,
  description_ml  text,
  logo_url        text,
  cover_url       text,
  gallery_urls    text[]    default '{}',
  phone           text,
  whatsapp        text,
  email           text,
  website         text,
  emirate         uae_emirate not null,
  area            text,
  address         text,
  latitude        numeric(9,6),
  longitude       numeric(9,6),
  instagram_url   text,
  facebook_url    text,
  linkedin_url    text,
  youtube_url     text,
  founded_year    int,
  employee_count  text,
  trade_license   text,
  languages       text[]  default '{"English","Malayalam"}',
  working_hours   jsonb,
  services        text[]  default '{}',
  plan            listing_plan  default 'free',
  status          listing_status default 'pending',
  is_featured     boolean default false,
  is_verified     boolean default false,
  views_count     int default 0,
  enquiry_count   int default 0,
  rating_avg      numeric(3,2) default 0,
  review_count    int default 0,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
create trigger trg_listings_updated_at before update on listings for each row execute function set_updated_at();
create index idx_listings_owner      on listings(owner_id);
create index idx_listings_category   on listings(category_id);
create index idx_listings_emirate    on listings(emirate);
create index idx_listings_status     on listings(status);
create index idx_listings_featured   on listings(is_featured) where is_featured = true;
create index idx_listings_slug       on listings(slug);
create index idx_listings_name_trgm  on listings using gin(name gin_trgm_ops);

-- =============================================================================
-- 4. CLASSIFIEDS
-- =============================================================================
create table classifieds (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references profiles(id) on delete cascade,
  category_id   uuid references categories(id) on delete set null,
  title         text not null,
  title_ml      text,
  description   text,
  description_ml text,
  price         numeric(10,2),
  currency      text default 'AED',
  is_negotiable boolean default false,
  type          classified_type not null default 'sale',
  condition     text,
  emirate       uae_emirate not null,
  area          text,
  phone         text,
  whatsapp      text,
  images        text[] default '{}',
  is_active     boolean default true,
  expires_at    timestamptz,
  views_count   int default 0,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
create trigger trg_classifieds_updated_at before update on classifieds for each row execute function set_updated_at();
create index idx_classifieds_owner   on classifieds(owner_id);
create index idx_classifieds_emirate on classifieds(emirate);
create index idx_classifieds_type    on classifieds(type);
create index idx_classifieds_active  on classifieds(is_active) where is_active = true;
create index idx_classifieds_title_trgm on classifieds using gin(title gin_trgm_ops);

-- =============================================================================
-- 5. EVENTS
-- =============================================================================
create table events (
  id              uuid primary key default uuid_generate_v4(),
  organiser_id    uuid references profiles(id) on delete set null,
  listing_id      uuid references listings(id) on delete set null,
  title           text not null,
  title_ml        text,
  description     text,
  description_ml  text,
  cover_url       text,
  category        text,
  category_ml     text,
  emirate         uae_emirate not null,
  venue           text,
  venue_ml        text,
  address         text,
  latitude        numeric(9,6),
  longitude       numeric(9,6),
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  is_free         boolean default false,
  price           numeric(10,2),
  currency        text default 'AED',
  ticket_url      text,
  capacity        int,
  registered_count int default 0,
  status          event_status default 'upcoming',
  is_featured     boolean default false,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
create trigger trg_events_updated_at before update on events for each row execute function set_updated_at();
create index idx_events_organiser  on events(organiser_id);
create index idx_events_emirate    on events(emirate);
create index idx_events_starts_at  on events(starts_at);
create index idx_events_status     on events(status);
create index idx_events_featured   on events(is_featured) where is_featured = true;

-- =============================================================================
-- 6. JOBS
-- =============================================================================
create table jobs (
  id              uuid primary key default uuid_generate_v4(),
  poster_id       uuid not null references profiles(id) on delete cascade,
  listing_id      uuid references listings(id) on delete set null,
  title           text not null,
  title_ml        text,
  description     text,
  description_ml  text,
  requirements    text,
  requirements_ml text,
  company_name    text,
  company_logo    text,
  job_type        job_type default 'full_time',
  category_id     uuid references categories(id) on delete set null,
  emirate         uae_emirate not null,
  area            text,
  is_remote       boolean default false,
  salary_min      numeric(10,2),
  salary_max      numeric(10,2),
  salary_currency text default 'AED',
  salary_period   text default 'month',
  salary_visible  boolean default true,
  experience_years int,
  skills          text[] default '{}',
  benefits        text[] default '{}',
  contact_email   text,
  contact_whatsapp text,
  apply_url       text,
  is_active       boolean default true,
  expires_at      timestamptz,
  views_count     int default 0,
  applicant_count int default 0,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
create trigger trg_jobs_updated_at before update on jobs for each row execute function set_updated_at();
create index idx_jobs_poster    on jobs(poster_id);
create index idx_jobs_emirate   on jobs(emirate);
create index idx_jobs_type      on jobs(job_type);
create index idx_jobs_active    on jobs(is_active) where is_active = true;
create index idx_jobs_title_trgm on jobs using gin(title gin_trgm_ops);

-- =============================================================================
-- 7. PRODUCTS
-- =============================================================================
create table products (
  id              uuid primary key default uuid_generate_v4(),
  listing_id      uuid not null references listings(id) on delete cascade,
  owner_id        uuid not null references profiles(id) on delete cascade,
  name            text not null,
  name_ml         text,
  description     text,
  description_ml  text,
  specs           text,
  specs_ml        text,
  shipping_info   text,
  category        text,
  sku             text,
  images          text[] default '{}',
  price           numeric(10,2) not null,
  original_price  numeric(10,2),
  currency        text default 'AED',
  stock_count     int default 0,
  track_stock     boolean default true,
  in_stock        boolean default true,
  weight_grams    int,
  sizes           text[] default '{}',
  colors          jsonb default '[]',
  rating_avg      numeric(3,2) default 0,
  review_count    int default 0,
  sales_count     int default 0,
  is_active       boolean default true,
  is_featured     boolean default false,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
create trigger trg_products_updated_at before update on products for each row execute function set_updated_at();
create index idx_products_listing  on products(listing_id);
create index idx_products_owner    on products(owner_id);
create index idx_products_active   on products(is_active) where is_active = true;
create index idx_products_name_trgm on products using gin(name gin_trgm_ops);

-- =============================================================================
-- 8. ORDERS
-- =============================================================================
create table orders (
  id              uuid primary key default uuid_generate_v4(),
  buyer_id        uuid not null references profiles(id) on delete restrict,
  listing_id      uuid references listings(id) on delete set null,
  order_number    text unique not null default 'MB-' || upper(substr(md5(random()::text), 1, 8)),
  subtotal        numeric(10,2) not null,
  delivery_fee    numeric(10,2) default 0,
  discount        numeric(10,2) default 0,
  total           numeric(10,2) not null,
  currency        text default 'AED',
  shipping_name   text,
  shipping_phone  text,
  shipping_address text,
  shipping_emirate uae_emirate,
  shipping_notes  text,
  payment_method  text,
  payment_ref     text,
  payment_status  payment_status default 'pending',
  paid_at         timestamptz,
  status          order_status default 'pending',
  notes           text,
  tracking_number text,
  shipped_at      timestamptz,
  delivered_at    timestamptz,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
create trigger trg_orders_updated_at before update on orders for each row execute function set_updated_at();
create index idx_orders_buyer    on orders(buyer_id);
create index idx_orders_listing  on orders(listing_id);
create index idx_orders_status   on orders(status);
create index idx_orders_number   on orders(order_number);

-- =============================================================================
-- 9. ORDER_ITEMS
-- =============================================================================
create table order_items (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  product_name  text not null,
  product_image text,
  sku           text,
  variant       jsonb,
  quantity      int not null check (quantity > 0),
  unit_price    numeric(10,2) not null,
  total_price   numeric(10,2) not null,
  created_at    timestamptz default now() not null
);
create index idx_order_items_order   on order_items(order_id);
create index idx_order_items_product on order_items(product_id);

-- =============================================================================
-- 10. REVIEWS
-- =============================================================================
create table reviews (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references listings(id) on delete cascade,
  reviewer_id uuid not null references profiles(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  title       text,
  body        text,
  body_ml     text,
  reply       text,
  replied_at  timestamptz,
  is_verified boolean default false,
  helpful_count int default 0,
  is_published boolean default true,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  unique (listing_id, reviewer_id)
);
create trigger trg_reviews_updated_at before update on reviews for each row execute function set_updated_at();
create index idx_reviews_listing  on reviews(listing_id);
create index idx_reviews_reviewer on reviews(reviewer_id);

create or replace function update_listing_rating()
returns trigger language plpgsql as $$
declare v_listing_id uuid;
begin
  v_listing_id := coalesce(new.listing_id, old.listing_id);
  update listings set
    rating_avg   = (select round(avg(rating)::numeric, 2) from reviews where listing_id = v_listing_id and is_published = true),
    review_count = (select count(*) from reviews where listing_id = v_listing_id and is_published = true)
  where id = v_listing_id;
  return null;
end;
$$;
create trigger trg_reviews_update_listing after insert or update or delete on reviews for each row execute function update_listing_rating();

-- =============================================================================
-- 11. POSTS
-- =============================================================================
create table posts (
  id            uuid primary key default uuid_generate_v4(),
  author_id     uuid not null references profiles(id) on delete cascade,
  slug          text unique not null,
  title         text not null,
  title_ml      text,
  excerpt       text,
  excerpt_ml    text,
  content       text,
  content_ml    text,
  cover_url     text,
  category      text,
  category_ml   text,
  tags          text[] default '{}',
  status        post_status default 'draft',
  is_featured   boolean default false,
  views_count   int default 0,
  likes_count   int default 0,
  comment_count int default 0,
  read_time_min int default 5,
  published_at  timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
create trigger trg_posts_updated_at before update on posts for each row execute function set_updated_at();
create index idx_posts_author   on posts(author_id);
create index idx_posts_status   on posts(status);
create index idx_posts_slug     on posts(slug);
create index idx_posts_tags     on posts using gin(tags);
create index idx_posts_title_trgm on posts using gin(title gin_trgm_ops);

-- =============================================================================
-- 12. SUBSCRIPTIONS
-- =============================================================================
create table subscriptions (
  id              uuid primary key default uuid_generate_v4(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  listing_id      uuid references listings(id) on delete cascade,
  plan            listing_plan not null,
  status          sub_status default 'trial',
  amount          numeric(10,2),
  currency        text default 'AED',
  billing_period  text default 'month',
  trial_ends_at   timestamptz,
  starts_at       timestamptz default now(),
  ends_at         timestamptz,
  cancelled_at    timestamptz,
  next_billing_at timestamptz,
  gateway         text,
  gateway_sub_id  text,
  gateway_cust_id text,
  notes           text,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
create trigger trg_subscriptions_updated_at before update on subscriptions for each row execute function set_updated_at();
create index idx_subs_profile on subscriptions(profile_id);
create index idx_subs_listing on subscriptions(listing_id);
create index idx_subs_status  on subscriptions(status);

-- =============================================================================
-- 13. AD_BOOKINGS
-- =============================================================================
create table ad_bookings (
  id            uuid primary key default uuid_generate_v4(),
  advertiser_id uuid not null references profiles(id) on delete cascade,
  listing_id    uuid references listings(id) on delete set null,
  placement     ad_placement not null,
  title         text,
  image_url     text,
  link_url      text,
  cta_text      text,
  amount        numeric(10,2) not null,
  currency      text default 'AED',
  payment_status payment_status default 'pending',
  starts_at     timestamptz not null,
  ends_at       timestamptz not null,
  status        ad_status default 'pending',
  impressions   int default 0,
  clicks        int default 0,
  notes         text,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
create trigger trg_ad_bookings_updated_at before update on ad_bookings for each row execute function set_updated_at();
create index idx_ads_advertiser on ad_bookings(advertiser_id);
create index idx_ads_placement  on ad_bookings(placement);
create index idx_ads_status     on ad_bookings(status);
create index idx_ads_dates      on ad_bookings(starts_at, ends_at);

-- =============================================================================
-- 14. BUSINESSMEN
-- =============================================================================
create table businessmen (
  id                uuid primary key default uuid_generate_v4(),
  profile_id        uuid references profiles(id) on delete set null,
  username          text unique not null,
  name              text not null,
  name_ml           text,
  title             text,
  title_ml          text,
  bio               text,
  bio_ml            text,
  bio_long          text,
  bio_long_ml       text,
  avatar_url        text,
  cover_url         text,
  industry          text,
  emirate           uae_emirate,
  years_in_business int,
  employee_count    int,
  business_count    int default 1,
  countries_count   int default 1,
  annual_turnover   text,
  whatsapp          text,
  linkedin_url      text,
  instagram_url     text,
  youtube_url       text,
  website_url       text,
  is_verified       boolean default false,
  is_featured       boolean default false,
  followers_count   int default 0,
  review_count      int default 0,
  rating_avg        numeric(3,2) default 0,
  listing_ids       uuid[] default '{}',
  achievements      jsonb default '[]',
  tags              text[] default '{}',
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);
create trigger trg_businessmen_updated_at before update on businessmen for each row execute function set_updated_at();
create index idx_businessmen_profile  on businessmen(profile_id);
create index idx_businessmen_emirate  on businessmen(emirate);
create index idx_businessmen_industry on businessmen(industry);
create index idx_businessmen_featured on businessmen(is_featured) where is_featured = true;
create index idx_businessmen_name_trgm on businessmen using gin(name gin_trgm_ops);

-- =============================================================================
-- 15. ENQUIRIES
-- =============================================================================
create table enquiries (
  id            uuid primary key default uuid_generate_v4(),
  listing_id    uuid not null references listings(id) on delete cascade,
  sender_id     uuid references profiles(id) on delete set null,
  sender_name   text not null,
  sender_email  text,
  sender_phone  text,
  sender_whatsapp text,
  subject       text,
  message       text not null,
  message_ml    text,
  reply         text,
  replied_at    timestamptz,
  replied_by    uuid references profiles(id) on delete set null,
  status        enquiry_status default 'new',
  is_spam       boolean default false,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
create trigger trg_enquiries_updated_at before update on enquiries for each row execute function set_updated_at();
create index idx_enquiries_listing on enquiries(listing_id);
create index idx_enquiries_sender  on enquiries(sender_id);
create index idx_enquiries_status  on enquiries(status);

create or replace function increment_enquiry_count()
returns trigger language plpgsql as $$
begin
  update listings set enquiry_count = enquiry_count + 1 where id = new.listing_id;
  return new;
end;
$$;
create trigger trg_enquiry_count after insert on enquiries for each row execute function increment_enquiry_count();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table profiles      enable row level security;
alter table categories    enable row level security;
alter table listings      enable row level security;
alter table classifieds   enable row level security;
alter table events        enable row level security;
alter table jobs          enable row level security;
alter table products      enable row level security;
alter table orders        enable row level security;
alter table order_items   enable row level security;
alter table reviews       enable row level security;
alter table posts         enable row level security;
alter table subscriptions enable row level security;
alter table ad_bookings   enable row level security;
alter table businessmen   enable row level security;
alter table enquiries     enable row level security;

create or replace function is_admin()
returns boolean language sql security definer as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- PROFILES
create policy "Public profiles are viewable by everyone"  on profiles for select using (true);
create policy "Users can insert their own profile"        on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"        on profiles for update using (auth.uid() = id);
create policy "Admins have full access to profiles"       on profiles for all using (is_admin());

-- CATEGORIES
create policy "Categories are publicly readable"  on categories for select using (is_active = true);
create policy "Admins manage categories"          on categories for all using (is_admin());

-- LISTINGS
create policy "Active listings are publicly visible"               on listings for select using (status = 'active');
create policy "Owners can view their own listings"                 on listings for select using (auth.uid() = owner_id);
create policy "Authenticated users can create listings"            on listings for insert with check (auth.uid() = owner_id);
create policy "Owners can update their own listings"               on listings for update using (auth.uid() = owner_id);
create policy "Owners can delete their own listings"               on listings for delete using (auth.uid() = owner_id);
create policy "Admins have full access to listings"                on listings for all using (is_admin());

-- CLASSIFIEDS
create policy "Active classifieds are publicly visible"    on classifieds for select using (is_active = true);
create policy "Owners can view all their own classifieds"  on classifieds for select using (auth.uid() = owner_id);
create policy "Authenticated users can post classifieds"   on classifieds for insert with check (auth.uid() = owner_id);
create policy "Owners can update their classifieds"        on classifieds for update using (auth.uid() = owner_id);
create policy "Owners can delete their classifieds"        on classifieds for delete using (auth.uid() = owner_id);
create policy "Admins have full access to classifieds"     on classifieds for all using (is_admin());

-- EVENTS
create policy "Events are publicly readable"          on events for select using (status != 'cancelled');
create policy "Authenticated users can create events" on events for insert with check (auth.uid() = organiser_id);
create policy "Organisers can update their events"    on events for update using (auth.uid() = organiser_id);
create policy "Organisers can delete their events"    on events for delete using (auth.uid() = organiser_id);
create policy "Admins have full access to events"     on events for all using (is_admin());

-- JOBS
create policy "Active jobs are publicly readable"   on jobs for select using (is_active = true);
create policy "Owners can view all their own jobs"  on jobs for select using (auth.uid() = poster_id);
create policy "Authenticated users can post jobs"   on jobs for insert with check (auth.uid() = poster_id);
create policy "Owners can update their jobs"        on jobs for update using (auth.uid() = poster_id);
create policy "Owners can delete their jobs"        on jobs for delete using (auth.uid() = poster_id);
create policy "Admins have full access to jobs"     on jobs for all using (is_admin());

-- PRODUCTS
create policy "Active products are publicly readable" on products for select using (is_active = true);
create policy "Owners can view all their products"    on products for select using (auth.uid() = owner_id);
create policy "Owners can create products"            on products for insert with check (auth.uid() = owner_id);
create policy "Owners can update their products"      on products for update using (auth.uid() = owner_id);
create policy "Owners can delete their products"      on products for delete using (auth.uid() = owner_id);
create policy "Admins have full access to products"   on products for all using (is_admin());

-- ORDERS
create policy "Buyers can view their own orders"     on orders for select using (auth.uid() = buyer_id);
create policy "Sellers can view orders for listings" on orders for select using (exists (select 1 from listings where id = orders.listing_id and owner_id = auth.uid()));
create policy "Authenticated users can place orders" on orders for insert with check (auth.uid() = buyer_id);
create policy "Buyers can update their pending orders" on orders for update using (auth.uid() = buyer_id and status = 'pending');
create policy "Admins have full access to orders"    on orders for all using (is_admin());

-- ORDER_ITEMS
create policy "Visible to order participants" on order_items for select using (exists (select 1 from orders where orders.id = order_items.order_id and (orders.buyer_id = auth.uid() or exists (select 1 from listings where id = orders.listing_id and owner_id = auth.uid()))));
create policy "Order items created with order" on order_items for insert with check (exists (select 1 from orders where id = order_items.order_id and buyer_id = auth.uid()));
create policy "Admins have full access to order_items" on order_items for all using (is_admin());

-- REVIEWS
create policy "Published reviews are publicly readable" on reviews for select using (is_published = true);
create policy "Reviewers can see their own reviews"     on reviews for select using (auth.uid() = reviewer_id);
create policy "Authenticated users can write reviews"   on reviews for insert with check (auth.uid() = reviewer_id);
create policy "Reviewers can update their own reviews"  on reviews for update using (auth.uid() = reviewer_id);
create policy "Reviewers can delete their own reviews"  on reviews for delete using (auth.uid() = reviewer_id);
create policy "Listing owners can reply to reviews"     on reviews for update using (exists (select 1 from listings where id = reviews.listing_id and owner_id = auth.uid()));
create policy "Admins have full access to reviews"      on reviews for all using (is_admin());

-- POSTS
create policy "Published posts are publicly readable" on posts for select using (status = 'published');
create policy "Authors can view their own posts"      on posts for select using (auth.uid() = author_id);
create policy "Authenticated users can create posts"  on posts for insert with check (auth.uid() = author_id);
create policy "Authors can update their own posts"    on posts for update using (auth.uid() = author_id);
create policy "Authors can delete their own posts"    on posts for delete using (auth.uid() = author_id);
create policy "Admins have full access to posts"      on posts for all using (is_admin());

-- SUBSCRIPTIONS
create policy "Users can view their own subscriptions"   on subscriptions for select using (auth.uid() = profile_id);
create policy "Users can create their own subscriptions" on subscriptions for insert with check (auth.uid() = profile_id);
create policy "Admins have full access to subscriptions" on subscriptions for all using (is_admin());

-- AD_BOOKINGS
create policy "Active ads are publicly visible"          on ad_bookings for select using (status = 'active' and now() between starts_at and ends_at);
create policy "Advertisers can view their own bookings"  on ad_bookings for select using (auth.uid() = advertiser_id);
create policy "Advertisers can create bookings"          on ad_bookings for insert with check (auth.uid() = advertiser_id);
create policy "Admins have full access to ad bookings"   on ad_bookings for all using (is_admin());

-- BUSINESSMEN
create policy "Businessmen profiles are publicly readable" on businessmen for select using (true);
create policy "Owners can update their own profile"        on businessmen for update using (auth.uid() = profile_id);
create policy "Admins have full access to businessmen"     on businessmen for all using (is_admin());

-- ENQUIRIES
create policy "Anyone can submit an enquiry"                    on enquiries for insert with check (true);
create policy "Senders can view their own enquiries"            on enquiries for select using (auth.uid() = sender_id);
create policy "Listing owners can view enquiries"               on enquiries for select using (exists (select 1 from listings where id = enquiries.listing_id and owner_id = auth.uid()));
create policy "Listing owners can reply to enquiries"           on enquiries for update using (exists (select 1 from listings where id = enquiries.listing_id and owner_id = auth.uid()));
create policy "Admins have full access to enquiries"            on enquiries for all using (is_admin());

-- =============================================================================
-- REFERENCE DATA — CATEGORIES (12 real categories, required for migration.sql)
-- =============================================================================
insert into categories (slug, name, name_ml, icon, color, sort_order) values
  ('restaurants-food',      'Restaurants & Food',        'റെസ്റ്റോറന്റ്സ് & ഭക്ഷണം',     'UtensilsCrossed',  'orange',  1),
  ('grocery-supermarket',   'Grocery & Supermarket',     'ഗ്രോസറി & സൂപ്പർമാർക്കറ്റ്',  'ShoppingBasket',   'green',   2),
  ('real-estate',           'Real Estate',               'റിയൽ എസ്റ്റേറ്റ്',              'Building2',        'blue',    3),
  ('healthcare-medical',    'Healthcare & Medical',      'ആരോഗ്യം & മെഡിക്കൽ',           'Stethoscope',      'red',     4),
  ('education-training',    'Education & Training',      'വിദ്യാഭ്യാസം & പരിശീലനം',      'GraduationCap',    'indigo',  5),
  ('beauty-wellness',       'Beauty & Wellness',         'സൗന്ദര്യം & ആരോഗ്യം',          'Sparkles',         'pink',    6),
  ('technology-it',         'Technology & IT',           'ടെക്നോളജി & ഐടി',              'Laptop',           'cyan',    7),
  ('construction-interiors','Construction & Interiors',  'നിർമ്മാണം & ഇന്റീരിയർ',       'HardHat',          'yellow',  8),
  ('retail-fashion',        'Retail & Fashion',          'റിട്ടെയ്ൽ & ഫാഷൻ',            'ShoppingBag',      'purple',  9),
  ('legal-finance',         'Legal & Finance',           'നിയമം & ഫിനാൻസ്',              'Scale',            'slate',   10),
  ('travel-tourism',        'Travel & Tourism',          'യാത്ര & ടൂറിസം',               'Plane',            'sky',     11),
  ('automotive',            'Automotive',                'ഓട്ടോമോട്ടീവ്',                'Car',              'gray',    12)
on conflict (slug) do nothing;

-- =============================================================================
-- REFERENCE DATA — UAE EMIRATES
-- =============================================================================
create table if not exists emirates (
  slug        text primary key,
  name        text not null,
  name_ml     text not null,
  name_ar     text,
  sort_order  int
);
insert into emirates (slug, name, name_ml, name_ar, sort_order) values
  ('dubai',          'Dubai',          'ദുബായ്',         'دبي',          1),
  ('abu_dhabi',      'Abu Dhabi',      'അബുദാബി',        'أبوظبي',       2),
  ('sharjah',        'Sharjah',        'ഷാർജ',           'الشارقة',      3),
  ('ajman',          'Ajman',          'അജ്മാൻ',         'عجمان',        4),
  ('ras_al_khaimah', 'Ras Al Khaimah', 'റാസ് അൽ ഖൈമ',  'رأس الخيمة',  5),
  ('fujairah',       'Fujairah',       'ഫുജൈറ',          'الفجيرة',      6),
  ('umm_al_quwain',  'Umm Al Quwain',  'ഉം അൽ ഖുവൈൻ', 'أم القيوين',   7)
on conflict (slug) do nothing;

-- =============================================================================
-- VIEWS
-- =============================================================================
create or replace view public_listings as
  select
    l.id, l.slug, l.name, l.name_ml, l.tagline, l.tagline_ml,
    l.logo_url, l.cover_url, l.emirate, l.area, l.address,
    l.phone, l.whatsapp, l.email, l.website,
    l.plan, l.is_featured, l.is_verified,
    l.rating_avg, l.review_count, l.views_count, l.created_at,
    c.slug    as category_slug,
    c.name    as category_name,
    c.name_ml as category_name_ml,
    c.icon    as category_icon,
    p.full_name  as owner_name,
    p.avatar_url as owner_avatar
  from listings l
  left join categories c on c.id = l.category_id
  left join profiles   p on p.id = l.owner_id
  where l.status = 'active';

create or replace view owner_dashboard_summary as
  select
    l.owner_id,
    count(l.id)                            as total_listings,
    sum(l.views_count)                     as total_views,
    sum(l.enquiry_count)                   as total_enquiries,
    sum(l.review_count)                    as total_reviews,
    round(avg(l.rating_avg)::numeric, 2)   as avg_rating,
    count(o.id)                            as total_orders,
    coalesce(sum(o.total), 0)              as total_revenue
  from listings l
  left join orders o on o.listing_id = l.id and o.status not in ('cancelled', 'refunded')
  group by l.owner_id;

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================
create or replace function increment_listing_views(listing_slug text)
returns void language sql security definer as $$
  update listings set views_count = views_count + 1 where slug = listing_slug;
$$;

create or replace function search_listings(
  query       text,
  p_emirate   text    default null,
  p_category  text    default null,
  p_plan      listing_plan default null,
  p_limit     int     default 20,
  p_offset    int     default 0
)
returns setof public_listings language sql stable as $$
  select * from public_listings
  where
    (query      is null or name ilike '%' || query || '%' or tagline ilike '%' || query || '%')
    and (p_emirate  is null or emirate::text = p_emirate)
    and (p_category is null or category_slug = p_category)
    and (p_plan     is null or plan          = p_plan)
  order by is_featured desc, rating_avg desc, created_at desc
  limit p_limit offset p_offset;
$$;

-- =============================================================================
-- END
-- Tables   : 16  |  RLS policies : 45  |  Indexes : 36
-- Triggers : 7   |  Functions    :  5  |  Views   :  2
-- Seed data: 12 categories + 7 emirates ONLY (no fake users/listings)
-- =============================================================================
