CREATE TABLE investor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  firm_name TEXT,
  investor_type TEXT NOT NULL CHECK (investor_type IN ('angel', 'scout', 'micro_vc', 'solo_gp', 'fund', 'syndicate_lead')),
  check_size_min INTEGER NOT NULL,
  check_size_max INTEGER NOT NULL,
  sectors TEXT[] NOT NULL,
  stage_preference TEXT[] NOT NULL,
  thesis TEXT,
  notable_exits TEXT,
  value_add TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_investor_profiles_profile_id ON investor_profiles(profile_id);
