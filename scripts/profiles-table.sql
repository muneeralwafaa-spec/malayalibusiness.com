-- ─────────────────────────────────────────────────────────────────────────────
-- profiles table  –  run once in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create the table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id                 UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email              TEXT         NOT NULL,
  full_name          TEXT,
  avatar_url         TEXT,
  phone              TEXT,
  is_admin           BOOLEAN      NOT NULL DEFAULT FALSE,
  is_business_owner  BOOLEAN      NOT NULL DEFAULT FALSE,
  is_verified        BOOLEAN      NOT NULL DEFAULT FALSE,
  preferred_locale   TEXT         NOT NULL DEFAULT 'en',
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 2. Updated-at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own"  ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own"  ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all"   ON profiles;

-- Users can read & update their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "profiles_admin_all"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
  );

-- 4. Index
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
