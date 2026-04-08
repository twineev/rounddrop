CREATE TABLE deal_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_drop_id UUID NOT NULL REFERENCES round_drops(id) ON DELETE CASCADE,
  investor_profile_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('viewed', 'passed', 'tracked', 'interested')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(round_drop_id, investor_profile_id)
);

CREATE INDEX idx_deal_interactions_round ON deal_interactions(round_drop_id);
CREATE INDEX idx_deal_interactions_investor ON deal_interactions(investor_profile_id);
CREATE INDEX idx_deal_interactions_action ON deal_interactions(action);
