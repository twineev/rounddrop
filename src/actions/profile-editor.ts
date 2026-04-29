"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isHttpUrl(value: unknown): boolean {
  if (typeof value !== "string" || value.length === 0) return true; // empty ok
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

async function getUserProfileId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");
  return profile;
}

export interface FounderProfileInput {
  full_name?: string;
  email?: string;
  linkedin_url?: string;
  company_name?: string;
  year_founded?: number | null;
  description?: string;
  stage?: string;
  sector?: string[];
  one_liner?: string;
  company_website?: string;
  mrr?: number | null;
  arr?: number | null;
  traction_notes?: string;
  intro_video_url?: string;
  onepager_url?: string;
  pitch_deck_url?: string;
  calendar_link?: string;
  best_contact_method?: "email" | "linkedin" | "calendar";
}

export async function updateFounderProfile(input: FounderProfileInput) {
  const profile = await getUserProfileId();
  if (profile.role !== "founder") throw new Error("Not a founder");

  // Validate URLs
  for (const k of ["linkedin_url", "company_website", "intro_video_url", "onepager_url", "pitch_deck_url", "calendar_link"] as const) {
    if (input[k] && !isHttpUrl(input[k] as string)) {
      throw new Error(`Invalid URL for ${k}`);
    }
  }

  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new Error("Invalid email");
  }

  const supabase = createAdminClient();

  // Build slug from company name
  const slug = input.company_name ? slugify(input.company_name) : undefined;

  const payload: Record<string, unknown> = { ...input };
  if (slug) payload.slug = slug;
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("founder_profiles")
    .update(payload)
    .eq("profile_id", profile.id);

  if (error) throw new Error("Failed to update profile: " + error.message);

  revalidatePath("/profile");
  return { success: true };
}

export interface InvestorProfileInput {
  firm_name?: string;
  gp_name?: string;
  location?: string;
  linkedin_url?: string;
  contact_email?: string;
  investor_type?: string;
  years_investing?: number | null;
  main_markets?: string[];
  sectors?: string[];
  stage_preference?: string[];
  check_size_min?: number;
  check_size_max?: number;
  thesis?: string;
  deck_criteria?: string;
  founder_assessment?: string;
  value_add?: string;
  fund_website?: string;
  twitter_url?: string;
}

export async function updateInvestorProfile(input: InvestorProfileInput) {
  const profile = await getUserProfileId();
  if (profile.role !== "investor") throw new Error("Not an investor");

  for (const k of ["linkedin_url", "fund_website", "twitter_url"] as const) {
    if (input[k] && !isHttpUrl(input[k] as string)) {
      throw new Error(`Invalid URL for ${k}`);
    }
  }
  if (input.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contact_email)) {
    throw new Error("Invalid email");
  }

  const supabase = createAdminClient();

  const payload: Record<string, unknown> = { ...input };
  payload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("investor_profiles")
    .update(payload)
    .eq("profile_id", profile.id);

  if (error) throw new Error("Failed to update profile: " + error.message);

  revalidatePath("/profile");
  return { success: true };
}
