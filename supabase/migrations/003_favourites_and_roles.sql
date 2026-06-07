-- ═══════════════════════════════════════════════════════════════════
-- Migration 003 — Favourites table + is_professional / is_media cols
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════

-- 1. Add is_professional and is_media to profiles
-- (safe — does nothing if columns already exist)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_professional boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_media        boolean NOT NULL DEFAULT false;

-- 2. Favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type  text        NOT NULL CHECK (item_type IN ('listing', 'professional', 'media', 'job', 'event', 'classified')),
  item_id    text        NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);

-- 3. Row-level security
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own favourites
CREATE POLICY "Users manage own favourites"
  ON favourites FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS favourites_user_idx ON favourites(user_id);
CREATE INDEX IF NOT EXISTS favourites_type_idx ON favourites(user_id, item_type);
