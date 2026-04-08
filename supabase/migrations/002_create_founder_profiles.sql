CREATE TABLE founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  one_liner TEXT NOT NULL,
  sector TEXT[] NOT NULL,
  company_website TEXT,
  calendar_link TEXT NOT NULL,
  accelerator_affiliations TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_founder_profiles_profile_id ON founder_profiles(profile_id);
