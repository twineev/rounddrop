-- Enable RLS on new tables
ALTER TABLE deck_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_entries ENABLE ROW LEVEL SECURITY;

-- Deck shares: Founders can manage their own shares
CREATE POLICY "Founders can view own deck shares"
  ON deck_shares FOR SELECT USING (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can create deck shares"
  ON deck_shares FOR INSERT WITH CHECK (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can update own deck shares"
  ON deck_shares FOR UPDATE USING (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can delete own deck shares"
  ON deck_shares FOR DELETE USING (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

-- Deck shares: Investors can view shares targeting them
CREATE POLICY "Investors can view deck shares targeting them"
  ON deck_shares FOR SELECT USING (
    investor_profile_id IN (
      SELECT id FROM investor_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

-- Pipeline entries: Founders can manage their own entries (private)
CREATE POLICY "Founders can view own pipeline entries"
  ON pipeline_entries FOR SELECT USING (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can create pipeline entries"
  ON pipeline_entries FOR INSERT WITH CHECK (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can update own pipeline entries"
  ON pipeline_entries FOR UPDATE USING (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can delete own pipeline entries"
  ON pipeline_entries FOR DELETE USING (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

-- Update investor_profiles SELECT policy to ensure unclaimed profiles are publicly readable
-- The existing policy already allows SELECT for everyone (USING true), so unclaimed profiles are covered.
-- No changes needed for investor_profiles SELECT policy.
