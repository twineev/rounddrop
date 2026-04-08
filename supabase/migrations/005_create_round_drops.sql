CREATE TABLE round_drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_profile_id UUID NOT NULL REFERENCES founder_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'closing', 'closed')),
  instrument_type TEXT NOT NULL CHECK (instrument_type IN ('safe', 'safe_mfn', 'convertible_note', 'priced_round')),
  raise_amount INTEGER NOT NULL,
  amount_raised INTEGER DEFAULT 0,
  valuation_cap INTEGER,
  discount_percent NUMERIC(5,2),
  min_check_size INTEGER NOT NULL,
  close_date DATE NOT NULL,
  traction_metrics JSONB DEFAULT '{}',
  pitch_deck_url TEXT,
  pitch_deck_filename TEXT,
  one_pager_url TEXT,
  demo_link TEXT,
  existing_investors TEXT[],
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'invite_only')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_round_drops_status ON round_drops(status);
CREATE INDEX idx_round_drops_founder ON round_drops(founder_profile_id);
