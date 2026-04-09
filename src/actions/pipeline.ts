"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

export async function getMyPipeline() {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("pipeline_entries")
    .select(`
      *,
      investor_profiles (*)
    `)
    .eq("founder_profile_id", founderProfileId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error("Failed to fetch pipeline: " + error.message);

  return data;
}

export async function addToPipeline(investorProfileId: string) {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("pipeline_entries")
    .upsert(
      {
        founder_profile_id: founderProfileId,
        investor_profile_id: investorProfileId,
        status: "researching",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "founder_profile_id,investor_profile_id",
        ignoreDuplicates: true,
      }
    )
    .select()
    .single();

  if (error) throw new Error("Failed to add to pipeline: " + error.message);

  revalidatePath("/pipeline");
  return data;
}

export async function updatePipelineStatus(
  entryId: string,
  status: "researching" | "deck_shared" | "viewed" | "meeting_scheduled" | "passed"
) {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("pipeline_entries")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId)
    .eq("founder_profile_id", founderProfileId);

  if (error) throw new Error("Failed to update pipeline status: " + error.message);

  revalidatePath("/pipeline");
  return { success: true };
}

export async function updatePipelineNotes(entryId: string, notes: string) {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("pipeline_entries")
    .update({
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId)
    .eq("founder_profile_id", founderProfileId);

  if (error) throw new Error("Failed to update pipeline notes: " + error.message);

  revalidatePath("/pipeline");
  return { success: true };
}

export async function removeFromPipeline(entryId: string) {
  const founderProfileId = await getFounderProfileId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("pipeline_entries")
    .delete()
    .eq("id", entryId)
    .eq("founder_profile_id", founderProfileId);

  if (error) throw new Error("Failed to remove from pipeline: " + error.message);

  revalidatePath("/pipeline");
  return { success: true };
}
