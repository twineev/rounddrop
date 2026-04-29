"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const PUBLIC_FOUNDER_COLUMNS = `
  id,
  profile_id,
  company_name,
  one_liner,
  sector,
  company_website,
  calendar_link,
  accelerator_affiliations,
  stage,
  full_name,
  linkedin_url,
  year_founded,
  description,
  mrr,
  arr,
  traction_notes,
  growth_numbers,
  intro_video_url,
  onepager_url,
  pitch_deck_url,
  best_contact_method,
  slug,
  created_at
`;

export async function getFounderBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("founder_profiles")
    .select(PUBLIC_FOUNDER_COLUMNS)
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function listPublicFounders(limit = 50) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("founder_profiles")
    .select(PUBLIC_FOUNDER_COLUMNS)
    .not("slug", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}
