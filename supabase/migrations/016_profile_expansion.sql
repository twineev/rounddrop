-- Migration 016: Expand founder + investor profiles, add connections, events, resources

-- Remove unused claim flow columns (the feature was removed)
ALTER TABLE investor_profiles DROP COLUMN IF EXISTS claim_token;
ALTER TABLE investor_profiles DROP COLUMN IF EXISTS pending_claim_email;
ALTER TABLE investor_profiles DROP COLUMN IF EXISTS pending_claim_user_id;
ALTER TABLE investor_profiles DROP COLUMN IF EXISTS pending_claim_requested_at;

-- ==========================================================================
-- INVESTOR PROFILE expansion
-- ==========================================================================
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS years_investing INTEGER;
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS main_markets TEXT[];
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS recent_checks JSONB DEFAULT '[]'::JSONB;
-- recent_checks is an array of { company_name, amount, stage, date, note }
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS deck_criteria TEXT;
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS founder_assessment TEXT;

-- ==========================================================================
-- FOUNDER PROFILE expansion
-- ==========================================================================
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS year_founded INTEGER;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS mrr NUMERIC;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS arr NUMERIC;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS traction_notes TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS growth_numbers JSONB DEFAULT '{}'::JSONB;
-- growth_numbers: { users, revenue_growth_mom, retention, nps, etc. }
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS intro_video_url TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS onepager_url TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS pitch_deck_url TEXT;
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS best_contact_method TEXT;
-- best_contact_method: 'email' | 'linkedin' | 'calendar'

-- Public discoverability slug for founder profiles
ALTER TABLE founder_profiles ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_founder_profiles_slug ON founder_profiles(slug);

-- ==========================================================================
-- USER CONNECTIONS (mutual-connections feature)
-- Each row represents a LinkedIn contact a user has in their network.
-- When two users share the same normalized linkedin URL in this table,
-- we can surface them as a mutual connection.
-- ==========================================================================
CREATE TABLE IF NOT EXISTS user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  linkedin_url TEXT NOT NULL,
  full_name TEXT,
  headline TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, linkedin_url)
);

CREATE INDEX IF NOT EXISTS idx_user_connections_profile ON user_connections(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_linkedin ON user_connections(linkedin_url);

ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

-- Users can manage their own connections
CREATE POLICY "Users can view own connections" ON user_connections
  FOR SELECT USING (profile_id = public.clerk_user_profile_id());
CREATE POLICY "Users can insert own connections" ON user_connections
  FOR INSERT WITH CHECK (profile_id = public.clerk_user_profile_id());
CREATE POLICY "Users can delete own connections" ON user_connections
  FOR DELETE USING (profile_id = public.clerk_user_profile_id());

-- For mutual-connection lookups we go through the service_role (admin client)
-- so no additional read policy is needed.

-- ==========================================================================
-- EVENTS
-- Admin-curated events visible to all signed-in users.
-- ==========================================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('virtual', 'irl', 'hybrid')),
  location TEXT,
  url TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  audience TEXT CHECK (audience IN ('founder', 'investor', 'both')) DEFAULT 'both',
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_starts_at ON events(starts_at);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);

-- ==========================================================================
-- RESOURCES
-- Admin-curated content: deck templates, fundraising guides, term sheets, etc.
-- ==========================================================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('deck_template', 'fundraising', 'term_sheet', 'legal', 'hiring', 'growth', 'other')),
  url TEXT NOT NULL,
  audience TEXT CHECK (audience IN ('founder', 'investor', 'both')) DEFAULT 'both',
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);

-- ==========================================================================
-- Revoke sensitive columns from anon role (defense in depth)
-- ==========================================================================
REVOKE SELECT (email) ON founder_profiles FROM anon, authenticated;
REVOKE SELECT (contact_email) ON investor_profiles FROM anon, authenticated;
