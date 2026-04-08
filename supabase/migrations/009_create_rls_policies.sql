-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get profile ID from Clerk JWT
CREATE OR REPLACE FUNCTION public.clerk_user_profile_id()
RETURNS UUID AS $$
  SELECT id FROM public.profiles WHERE clerk_user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Profiles: public read, owner write
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (id = public.clerk_user_profile_id());

-- Founder profiles: public read, owner write
CREATE POLICY "Founder profiles are viewable by everyone"
  ON founder_profiles FOR SELECT USING (true);

CREATE POLICY "Founders can insert own profile"
  ON founder_profiles FOR INSERT WITH CHECK (profile_id = public.clerk_user_profile_id());

CREATE POLICY "Founders can update own profile"
  ON founder_profiles FOR UPDATE USING (profile_id = public.clerk_user_profile_id());

-- Investor profiles: public read, owner write
CREATE POLICY "Investor profiles are viewable by everyone"
  ON investor_profiles FOR SELECT USING (true);

CREATE POLICY "Investors can insert own profile"
  ON investor_profiles FOR INSERT WITH CHECK (profile_id = public.clerk_user_profile_id());

CREATE POLICY "Investors can update own profile"
  ON investor_profiles FOR UPDATE USING (profile_id = public.clerk_user_profile_id());

-- Portfolio companies: public read, owner write
CREATE POLICY "Portfolio companies are viewable by everyone"
  ON portfolio_companies FOR SELECT USING (true);

CREATE POLICY "Investors can manage own portfolio companies"
  ON portfolio_companies FOR INSERT WITH CHECK (
    investor_profile_id IN (
      SELECT id FROM investor_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Investors can update own portfolio companies"
  ON portfolio_companies FOR UPDATE USING (
    investor_profile_id IN (
      SELECT id FROM investor_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Investors can delete own portfolio companies"
  ON portfolio_companies FOR DELETE USING (
    investor_profile_id IN (
      SELECT id FROM investor_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

-- Round drops: live/closing/closed are public, drafts only visible to owner
CREATE POLICY "Live rounds are viewable by everyone"
  ON round_drops FOR SELECT USING (
    status IN ('live', 'closing', 'closed')
    OR founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can create rounds"
  ON round_drops FOR INSERT WITH CHECK (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can update own rounds"
  ON round_drops FOR UPDATE USING (
    founder_profile_id IN (
      SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

-- Deal interactions: investors manage own, founders read on own rounds
CREATE POLICY "Investors can manage own interactions"
  ON deal_interactions FOR ALL USING (
    investor_profile_id IN (
      SELECT id FROM investor_profiles WHERE profile_id = public.clerk_user_profile_id()
    )
  );

CREATE POLICY "Founders can view interactions on own rounds"
  ON deal_interactions FOR SELECT USING (
    round_drop_id IN (
      SELECT id FROM round_drops WHERE founder_profile_id IN (
        SELECT id FROM founder_profiles WHERE profile_id = public.clerk_user_profile_id()
      )
    )
  );

-- Message threads: only participants
CREATE POLICY "Participants can view own threads"
  ON message_threads FOR SELECT USING (
    participant_1_id = public.clerk_user_profile_id()
    OR participant_2_id = public.clerk_user_profile_id()
  );

CREATE POLICY "Authenticated users can create threads"
  ON message_threads FOR INSERT WITH CHECK (
    participant_1_id = public.clerk_user_profile_id()
    OR participant_2_id = public.clerk_user_profile_id()
  );

CREATE POLICY "Participants can update own threads"
  ON message_threads FOR UPDATE USING (
    participant_1_id = public.clerk_user_profile_id()
    OR participant_2_id = public.clerk_user_profile_id()
  );

-- Messages: only participants
CREATE POLICY "Participants can view messages in their threads"
  ON messages FOR SELECT USING (
    sender_profile_id = public.clerk_user_profile_id()
    OR receiver_profile_id = public.clerk_user_profile_id()
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT WITH CHECK (
    sender_profile_id = public.clerk_user_profile_id()
  );

CREATE POLICY "Receivers can mark messages as read"
  ON messages FOR UPDATE USING (
    receiver_profile_id = public.clerk_user_profile_id()
  );

-- Notifications: owner only
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (
    profile_id = public.clerk_user_profile_id()
  );

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (
    profile_id = public.clerk_user_profile_id()
  );
