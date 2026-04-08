"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function getInvestorProfileId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");

  const { data: investorProfile } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("profile_id", profile.id)
    .single();

  if (!investorProfile) throw new Error("Investor profile not found");

  return investorProfile.id;
}

export async function triageDeal(
  roundDropId: string,
  action: "passed" | "tracked" | "interested"
) {
  const investorProfileId = await getInvestorProfileId();
  const supabase = createAdminClient();

  const { error } = await supabase.from("deal_interactions").upsert(
    {
      round_drop_id: roundDropId,
      investor_profile_id: investorProfileId,
      action,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "round_drop_id,investor_profile_id",
    }
  );

  if (error) throw new Error("Failed to triage deal: " + error.message);

  // If interested, create a notification for the founder
  if (action === "interested") {
    const { userId } = await auth();
    const { data: investorData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("clerk_user_id", userId!)
      .single();

    const { data: round } = await supabase
      .from("round_drops")
      .select("founder_profile_id, founder_profiles(profile_id)")
      .eq("id", roundDropId)
      .single();

    if (round && investorData) {
      const founderProfiles = round.founder_profiles as unknown as { profile_id: string };
      await supabase.from("notifications").insert({
        profile_id: founderProfiles.profile_id,
        type: "interest",
        title: `${investorData.full_name} is interested in your round`,
        body: "An investor has expressed interest in your Round Drop",
        metadata: { round_drop_id: roundDropId },
      });
    }
  }

  revalidatePath("/deals");
  return { success: true };
}

export async function recordView(roundDropId: string) {
  const investorProfileId = await getInvestorProfileId();
  const supabase = createAdminClient();

  // Check if already has an interaction (don't downgrade from tracked/interested to viewed)
  const { data: existing } = await supabase
    .from("deal_interactions")
    .select("action")
    .eq("round_drop_id", roundDropId)
    .eq("investor_profile_id", investorProfileId)
    .single();

  if (existing) return; // Already has an interaction, don't overwrite

  await supabase.from("deal_interactions").upsert(
    {
      round_drop_id: roundDropId,
      investor_profile_id: investorProfileId,
      action: "viewed",
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "round_drop_id,investor_profile_id",
    }
  );
}

export async function getMyInteraction(roundDropId: string) {
  try {
    const investorProfileId = await getInvestorProfileId();
    const supabase = createAdminClient();

    const { data } = await supabase
      .from("deal_interactions")
      .select("action")
      .eq("round_drop_id", roundDropId)
      .eq("investor_profile_id", investorProfileId)
      .single();

    return data?.action || null;
  } catch {
    return null;
  }
}

export async function getRoundInteractions(roundDropId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("deal_interactions")
    .select(`
      *,
      investor_profiles (
        *,
        profiles (*)
      )
    `)
    .eq("round_drop_id", roundDropId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error("Failed to fetch interactions: " + error.message);

  return data;
}
