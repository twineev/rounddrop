CREATE TABLE portfolio_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_profile_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  round TEXT,
  check_size INTEGER,
  year INTEGER,
  status TEXT CHECK (status IN ('active', 'exited', 'write_off')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portfolio_companies_investor ON portfolio_companies(investor_profile_id);
