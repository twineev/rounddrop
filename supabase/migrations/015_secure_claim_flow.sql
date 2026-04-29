-- Add pending claim tracking columns so we don't overwrite contact_email
-- during an unverified claim attempt (prevents account takeover).
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS pending_claim_email TEXT;
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS pending_claim_user_id TEXT;
ALTER TABLE investor_profiles ADD COLUMN IF NOT EXISTS pending_claim_requested_at TIMESTAMPTZ;

-- Defense in depth: tighten the investor_profiles SELECT policy so that even
-- via the anon Supabase key, the claim_token and contact_email columns cannot
-- be read. The app uses the admin client and an explicit allowlist for the
-- public directory; this ensures direct REST access via the anon key can't
-- leak sensitive columns either.
--
-- We achieve this by replacing the permissive "USING (true)" SELECT policy
-- with a policy that depends on schema-level column grants. Revoke column
-- access on sensitive columns from the anon/authenticated roles.
REVOKE SELECT (claim_token, contact_email, pending_claim_email, pending_claim_user_id, pending_claim_requested_at, fund_domain)
  ON investor_profiles FROM anon, authenticated;

-- Claim tokens must never be queryable by clients. Only the service_role
-- (admin client) should ever read them to verify an email-verification link.
