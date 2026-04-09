CREATE TABLE deck_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_profile_id UUID NOT NULL REFERENCES founder_profiles(id) ON DELETE CASCADE,
  investor_profile_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
  deck_url TEXT NOT NULL,
  deck_filename TEXT,
  message TEXT,
  view_count INTEGER DEFAULT 0,
  first_viewed_at TIMESTAMPTZ,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(founder_profile_id, investor_profile_id)
);

CREATE INDEX idx_deck_shares_founder ON deck_shares(founder_profile_id);
CREATE INDEX idx_deck_shares_investor ON deck_shares(investor_profile_id);
