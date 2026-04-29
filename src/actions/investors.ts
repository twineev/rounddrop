"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Columns safe to expose to anonymous visitors in the public directory.
// Deliberately excludes: claim_token, contact_email, fund_domain, profile_id, claimed_at.
const PUBLIC_INVESTOR_COLUMNS = `
  id,
  profile_id,
  firm_name,
  gp_name,
  investor_type,
  check_size_min,
  check_size_max,
  sectors,
  stage_preference,
  thesis,
  fund_website,
  twitter_url,
  linkedin_url,
  location,
  years_investing,
  main_markets,
  recent_checks,
  deck_criteria,
  founder_assessment,
  notable_exits,
  value_add,
  slug,
  is_claimed,
  created_at,
  portfolio_companies (*)
`;

export async function getInvestorDirectory(filters?: {
  sectors?: string[];
  stage?: string;
  checkSizeMin?: number;
  checkSizeMax?: number;
}) {
  const supabase = createAdminClient();

  let query = supabase
    .from("investor_profiles")
    .select(PUBLIC_INVESTOR_COLUMNS)
    .order("created_at", { ascending: false });

  if (filters?.stage) {
    query = query.contains("stage_preference", [filters.stage]);
  }
  if (filters?.checkSizeMin) {
    query = query.gte("check_size_max", filters.checkSizeMin);
  }
  if (filters?.checkSizeMax) {
    query = query.lte("check_size_min", filters.checkSizeMax);
  }

  const { data, error } = await query;

  if (error) throw new Error("Failed to fetch investor directory: " + error.message);

  let results = data || [];

  // Filter by sector overlap if provided
  if (filters?.sectors && filters.sectors.length > 0) {
    results = results.filter((investor) => {
      if (!investor.sectors) return false;
      return filters.sectors!.some((s) => investor.sectors.includes(s));
    });
  }

  return results;
}

export async function getInvestorBySlug(slug: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("investor_profiles")
    .select(PUBLIC_INVESTOR_COLUMNS)
    .eq("slug", slug)
    .single();

  if (error) throw new Error("Investor not found");

  return data;
}

