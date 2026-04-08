"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { founderProfileSchema, type FounderProfileInput } from "@/lib/validations/founder";
import { investorProfileSchema, type InvestorProfileInput } from "@/lib/validations/investor";
import { revalidatePath } from "next/cache";

export async function getCurrentProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  return data;
}

export async function setUserRole(role: "founder" | "investor") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("clerk_user_id", userId);

  if (error) throw new Error("Failed to set role");

  return { success: true };
}

export async function createFounderProfile(input: FounderProfileInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validated = founderProfileSchema.parse(input);
  const supabase = createAdminClient();

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");

  // Update linkedin on profiles table
  await supabase
    .from("profiles")
    .update({
      linkedin_url: validated.linkedin_url,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  // Create founder profile
  const { error } = await supabase.from("founder_profiles").insert({
    profile_id: profile.id,
    company_name: validated.company_name,
    one_liner: validated.one_liner,
    sector: validated.sector,
    company_website: validated.company_website || null,
    calendar_link: validated.calendar_link,
    accelerator_affiliations: validated.accelerator_affiliations || [],
  });

  if (error) throw new Error("Failed to create founder profile: " + error.message);

  // Update Clerk metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "founder",
      onboardingComplete: true,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function createInvestorProfile(input: InvestorProfileInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validated = investorProfileSchema.parse(input);
  const supabase = createAdminClient();

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");

  // Update linkedin on profiles table
  await supabase
    .from("profiles")
    .update({
      linkedin_url: validated.linkedin_url,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  // Create investor profile
  const { data: investorProfile, error } = await supabase
    .from("investor_profiles")
    .insert({
      profile_id: profile.id,
      firm_name: validated.firm_name || null,
      investor_type: validated.investor_type,
      check_size_min: validated.check_size_min,
      check_size_max: validated.check_size_max,
      sectors: validated.sectors,
      stage_preference: validated.stage_preference,
      thesis: validated.thesis || null,
      notable_exits: validated.notable_exits || null,
      value_add: validated.value_add || null,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create investor profile: " + error.message);

  // Insert portfolio companies
  if (validated.portfolio_companies && validated.portfolio_companies.length > 0) {
    const portfolioEntries = validated.portfolio_companies.map((pc) => ({
      investor_profile_id: investorProfile.id,
      company_name: pc.company_name,
      round: pc.round || null,
      check_size: pc.check_size || null,
      year: pc.year || null,
      status: pc.status || null,
    }));

    await supabase.from("portfolio_companies").insert(portfolioEntries);
  }

  // Update Clerk metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "investor",
      onboardingComplete: true,
    },
  });

  revalidatePath("/");
  return { success: true };
}
