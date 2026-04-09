"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getInvestorDirectory(filters?: {
  sectors?: string[];
  stage?: string;
  checkSizeMin?: number;
  checkSizeMax?: number;
}) {
  const supabase = createAdminClient();

  let query = supabase
    .from("investor_profiles")
    .select(`
      *,
      portfolio_companies (*)
    `)
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
    .select(`
      *,
      portfolio_companies (*)
    `)
    .eq("slug", slug)
    .single();

  if (error) throw new Error("Investor not found");

  return data;
}

export async function claimInvestorProfile(investorProfileId: string, email: string) {
  const supabase = createAdminClient();

  // Verify the profile exists and is unclaimed
  const { data: profile, error: fetchError } = await supabase
    .from("investor_profiles")
    .select("id, is_claimed, contact_email")
    .eq("id", investorProfileId)
    .single();

  if (fetchError || !profile) throw new Error("Investor profile not found");
  if (profile.is_claimed) throw new Error("This profile has already been claimed");

  // Generate a claim token
  const claimToken = crypto.randomUUID();

  // Store the claim token and email
  const { error: updateError } = await supabase
    .from("investor_profiles")
    .update({
      claim_token: claimToken,
      contact_email: email,
    })
    .eq("id", investorProfileId);

  if (updateError) throw new Error("Failed to initiate claim: " + updateError.message);

  return { success: true, message: "Claim initiated. Check your email for verification." };
}
