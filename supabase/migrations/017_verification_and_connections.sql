-- Migration 017: Verified badge + platform connections
-- Adds verification status to profiles and a platform_connections table
-- to track in-app connections (founders ↔ investors who have interacted).

-- Verified flag on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_source TEXT;
-- verification_source: 'email_domain' | 'linkedin' | 'admin' | 'manual'

CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);

-- Platform connections (in-app, not LinkedIn).
-- A row represents a directed connection request that has been accepted
-- (or auto-accepted when one user actively engages with another, e.g.
-- founder shares deck with investor → both can see each other in
-- "On RoundDrop" connections).
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source TEXT, -- 'deck_share', 'intro_request', 'manual', 'event_rsvp'
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Always store with profile_a_id < profile_b_id alphabetically so we get
  -- a single row per pair, regardless of who initiated.
  CONSTRAINT platform_connections_ordered CHECK (profile_a_id < profile_b_id),
  UNIQUE(profile_a_id, profile_b_id)
);

CREATE INDEX IF NOT EXISTS idx_platform_connections_a ON platform_connections(profile_a_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_b ON platform_connections(profile_b_id);

ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

-- Anyone in the connection can view it
CREATE POLICY "Users can view their own platform connections" ON platform_connections
  FOR SELECT USING (
    profile_a_id = public.clerk_user_profile_id()
    OR profile_b_id = public.clerk_user_profile_id()
  );

-- Mutations go through the admin client / server actions, no RLS insert/update
-- policy needed.
