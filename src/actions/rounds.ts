"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { roundDropSchema, type RoundDropInput } from "@/lib/validations/founder";
import { revalidatePath } from "next/cache";

async function getFounderProfileId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");

  const { data: founderProfile } = await supabase
    .from("founder_profiles")
    .select("id")
    .eq("profile_id", profile.id)
    .single();

  if (!founderProfile) throw new Error("Founder profile not found");

  return founderProfile.id;
}

export async function createRound(input: RoundDropInput) {
  const founderProfileId = await getFounderProfileId();
  const validated = roundDropSchema.parse(input);
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("round_drops")
    .insert({
      founder_profile_id: founderProfileId,
      status: "draft",
      instrument_type: validated.instrument_type,
      raise_amount: validated.raise_amount,
      amount_raised: validated.amount_raised || 0,
      valuation_cap: validated.valuation_cap ?? null,
      discount_percent: validated.discount_percent ?? null,
      min_check_size: validated.min_check_size,
      close_date: validated.close_date,
      traction_metrics: validated.traction_metrics || {},
      pitch_deck_url: validated.pitch_deck_url ?? null,
      pitch_deck_filename: validated.pitch_deck_filename ?? null,
      one_pager_url: validated.one_pager_url ?? null,
      demo_link: validated.demo_link ?? null,
      existing_investors: validated.existing_investors || [],
      visibility: validated.visibility || "public",
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create round: " + error.message);

  revalidatePath("/rounds");
  return data;
}

export async function publishRound(roundId: string) {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("round_drops")
    .update({
      status: "live",
      updated_at: new Date().toISOString(),
    })
    .eq("id", roundId)
    .eq("founder_profile_id", founderProfileId);

  if (error) throw new Error("Failed to publish round: " + error.message);

  revalidatePath("/rounds");
  revalidatePath(`/rounds/${roundId}`);
  return { success: true };
}

export async function updateRound(roundId: string, input: Partial<RoundDropInput>) {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("round_drops")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", roundId)
    .eq("founder_profile_id", founderProfileId);

  if (error) throw new Error("Failed to update round: " + error.message);

  revalidatePath("/rounds");
  revalidatePath(`/rounds/${roundId}`);
  return { success: true };
}

export async function closeRound(roundId: string) {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("round_drops")
    .update({
      status: "closed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", roundId)
    .eq("founder_profile_id", founderProfileId);

  if (error) throw new Error("Failed to close round: " + error.message);

  revalidatePath("/rounds");
  revalidatePath(`/rounds/${roundId}`);
  return { success: true };
}

export async function getMyRounds() {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("round_drops")
    .select("*")
    .eq("founder_profile_id", founderProfileId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error("Failed to fetch rounds: " + error.message);

  return data;
}

export async function getRound(roundId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("round_drops")
    .select(`
      *,
      founder_profiles (
        *,
        profiles (*)
      )
    `)
    .eq("id", roundId)
    .single();

  if (error) throw new Error("Failed to fetch round: " + error.message);

  return data;
}

export async function getLiveRounds(filters?: {
  sectors?: string[];
  instrumentType?: string;
  minRaise?: number;
  maxRaise?: number;
}) {
  const supabase = createAdminClient();

  let query = supabase
    .from("round_drops")
    .select(`
      *,
      founder_profiles (
        *,
        profiles (*)
      )
    `)
    .in("status", ["live", "closing"])
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (filters?.instrumentType) {
    query = query.eq("instrument_type", filters.instrumentType);
  }
  if (filters?.minRaise) {
    query = query.gte("raise_amount", filters.minRaise);
  }
  if (filters?.maxRaise) {
    query = query.lte("raise_amount", filters.maxRaise);
  }

  const { data, error } = await query;

  if (error) throw new Error("Failed to fetch rounds: " + error.message);

  // Filter by sector overlap if provided (Supabase doesn't support array overlap easily in query builder)
  if (filters?.sectors && filters.sectors.length > 0) {
    return data.filter((round) => {
      const founderSectors = (round.founder_profiles as Record<string, unknown>)?.sector as string[] | undefined;
      if (!founderSectors) return false;
      return filters.sectors!.some((s) => founderSectors.includes(s));
    });
  }

  return data;
}
