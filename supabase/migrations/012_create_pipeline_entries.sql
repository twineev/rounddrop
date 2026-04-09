CREATE TABLE pipeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_profile_id UUID NOT NULL REFERENCES founder_profiles(id) ON DELETE CASCADE,
  investor_profile_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'researching' CHECK (status IN ('researching', 'deck_shared', 'viewed', 'meeting_scheduled', 'passed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(founder_profile_id, investor_profile_id)
);

CREATE INDEX idx_pipeline_entries_founder_status ON pipeline_entries(founder_profile_id, status);
