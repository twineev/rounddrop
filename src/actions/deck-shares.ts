"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { shareDeckSchema, type ShareDeckInput } from "@/lib/validations/investor-directory";
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

export async function shareDeck(input: ShareDeckInput) {
  const founderProfileId = await getFounderProfileId();
  const validated = shareDeckSchema.parse(input);
  const supabase = createAdminClient();

  // Create or update deck share
  const { data, error } = await supabase
    .from("deck_shares")
    .upsert(
      {
        founder_profile_id: founderProfileId,
        investor_profile_id: validated.investor_profile_id,
        deck_url: validated.deck_url,
        deck_filename: validated.deck_filename ?? null,
        message: validated.message ?? null,
      },
      {
        onConflict: "founder_profile_id,investor_profile_id",
      }
    )
    .select()
    .single();

  if (error) throw new Error("Failed to share deck: " + error.message);

  // Create or update pipeline entry to 'deck_shared'
  await supabase
    .from("pipeline_entries")
    .upsert(
      {
        founder_profile_id: founderProfileId,
        investor_profile_id: validated.investor_profile_id,
        status: "deck_shared",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "founder_profile_id,investor_profile_id",
      }
    );

  revalidatePath("/pipeline");
  revalidatePath("/investors");
  return data;
}

export async function getMySharedDecks() {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("deck_shares")
    .select(`
      *,
      investor_profiles (*)
    `)
    .eq("founder_profile_id", founderProfileId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch shared decks: " + error.message);

  return data;
}

export async function getDeckSharesForInvestor() {
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

  const { data, error } = await supabase
    .from("deck_shares")
    .select(`
      *,
      founder_profiles (
        *,
        profiles (*)
      )
    `)
    .eq("investor_profile_id", investorProfile.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch deck shares: " + error.message);

  return data;
}

export async function trackDeckView(shareId: string) {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // Get current share to check first_viewed_at
  const { data: share } = await supabase
    .from("deck_shares")
    .select("first_viewed_at, view_count")
    .eq("id", shareId)
    .single();

  if (!share) throw new Error("Deck share not found");

  const { error } = await supabase
    .from("deck_shares")
    .update({
      view_count: (share.view_count || 0) + 1,
      first_viewed_at: share.first_viewed_at || now,
      last_viewed_at: now,
    })
    .eq("id", shareId);

  if (error) throw new Error("Failed to track view: " + error.message);

  return { success: true };
}
