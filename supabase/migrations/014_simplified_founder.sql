-- Make one_liner nullable
ALTER TABLE founder_profiles ALTER COLUMN one_liner DROP NOT NULL;

-- Make calendar_link nullable
ALTER TABLE founder_profiles ALTER COLUMN calendar_link DROP NOT NULL;

-- Add stage column
ALTER TABLE founder_profiles ADD COLUMN stage TEXT;
