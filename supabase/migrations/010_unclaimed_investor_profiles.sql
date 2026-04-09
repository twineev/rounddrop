-- Make profile_id nullable to support unclaimed investor profiles
ALTER TABLE investor_profiles ALTER COLUMN profile_id DROP NOT NULL;

-- Add columns for unclaimed/claimed investor profiles
ALTER TABLE investor_profiles ADD COLUMN is_claimed BOOLEAN DEFAULT FALSE;
ALTER TABLE investor_profiles ADD COLUMN gp_name TEXT;
ALTER TABLE investor_profiles ADD COLUMN fund_website TEXT;
ALTER TABLE investor_profiles ADD COLUMN twitter_url TEXT;
ALTER TABLE investor_profiles ADD COLUMN contact_email TEXT;
ALTER TABLE investor_profiles ADD COLUMN fund_domain TEXT;
ALTER TABLE investor_profiles ADD COLUMN slug TEXT UNIQUE;
ALTER TABLE investor_profiles ADD COLUMN claim_token TEXT;
ALTER TABLE investor_profiles ADD COLUMN claimed_at TIMESTAMPTZ;

-- Indexes for slug lookup and filtering unclaimed profiles
CREATE INDEX idx_investor_profiles_slug ON investor_profiles(slug);
CREATE INDEX idx_investor_profiles_is_claimed ON investor_profiles(is_claimed);
