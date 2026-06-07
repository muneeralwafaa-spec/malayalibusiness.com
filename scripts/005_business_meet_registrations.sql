-- Business Meet Event Registrations Table
-- Run this in Supabase SQL editor

CREATE TABLE IF NOT EXISTS business_meet_registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Personal info
  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  whatsapp        TEXT,
  email           TEXT NOT NULL,

  -- Business info
  company         TEXT NOT NULL,
  designation     TEXT,
  industry        TEXT,
  emirate         TEXT NOT NULL,
  how_heard       TEXT,
  message         TEXT,

  -- Event info
  event_name      TEXT NOT NULL DEFAULT 'UAE Malayali Business Meet',
  pass_type       TEXT NOT NULL DEFAULT 'Entry Pass',
  amount          NUMERIC(10,2) NOT NULL DEFAULT 250,
  currency        TEXT NOT NULL DEFAULT 'AED',

  -- Registration status
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled'))
);

-- Enable RLS
ALTER TABLE business_meet_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (public registration form)
CREATE POLICY "Anyone can register"
  ON business_meet_registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admin) can read registrations
CREATE POLICY "Authenticated users can view registrations"
  ON business_meet_registrations FOR SELECT
  TO authenticated
  USING (true);

-- Index for quick lookups by email
CREATE INDEX IF NOT EXISTS idx_bm_reg_email ON business_meet_registrations(email);
CREATE INDEX IF NOT EXISTS idx_bm_reg_status ON business_meet_registrations(status);
CREATE INDEX IF NOT EXISTS idx_bm_reg_created ON business_meet_registrations(created_at DESC);
