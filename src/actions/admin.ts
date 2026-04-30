"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = ["twinee.madan@gmail.com"];

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || "";
  if (!ADMIN_EMAILS.includes(email)) throw new Error("Forbidden");
  return userId;
}

// =================== EVENTS ===================
export async function adminCreateEvent(input: {
  title: string;
  description?: string;
  event_type?: "virtual" | "irl" | "hybrid";
  location?: string;
  url?: string;
  starts_at: string;
  ends_at?: string;
  audience?: "founder" | "investor" | "both";
  is_featured?: boolean;
}) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("events").insert({
    title: input.title,
    description: input.description || null,
    event_type: input.event_type || null,
    location: input.location || null,
    url: input.url || null,
    starts_at: input.starts_at,
    ends_at: input.ends_at || null,
    audience: input.audience || "both",
    is_featured: input.is_featured || false,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

export async function adminDeleteEvent(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

// =================== RESOURCES ===================
export async function adminCreateResource(input: {
  title: string;
  description?: string;
  category?: "deck_template" | "fundraising" | "term_sheet" | "legal" | "hiring" | "growth" | "other";
  url: string;
  audience?: "founder" | "investor" | "both";
  is_featured?: boolean;
}) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("resources").insert({
    title: input.title,
    description: input.description || null,
    category: input.category || "other",
    url: input.url,
    audience: input.audience || "both",
    is_featured: input.is_featured || false,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}

export async function adminDeleteResource(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("resources").delete().eq("id", id);
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}

// =================== USERS ===================
export async function adminToggleVerified(profileId: string, verified: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({
      is_verified: verified,
      verified_at: verified ? new Date().toISOString() : null,
      verification_source: verified ? "admin" : null,
    })
    .eq("id", profileId);
  revalidatePath("/admin/users");
  return { success: true };
}

// =================== INVESTORS ===================
export async function adminToggleInvestorClaimed(investorProfileId: string, claimed: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase
    .from("investor_profiles")
    .update({ is_claimed: claimed, claimed_at: claimed ? new Date().toISOString() : null })
    .eq("id", investorProfileId);
  revalidatePath("/admin/investors");
  revalidatePath("/investors");
  return { success: true };
}

// =================== SQL CONSOLE ===================
// Read-only SELECT queries only; we hard-block anything else.
export async function adminRunSelect(query: string): Promise<{ rows: Record<string, unknown>[]; error?: string }> {
  await requireAdmin();
  const trimmed = query.trim();
  if (!/^select\b/i.test(trimmed)) {
    return { rows: [], error: "Only SELECT queries are permitted in the admin console." };
  }
  // Best-effort guardrails — also rely on the read-only access pattern below.
  if (/(insert|update|delete|drop|alter|truncate|create|grant|revoke|copy)\b/i.test(trimmed)) {
    return { rows: [], error: "Mutating keywords detected. SELECT only." };
  }
  try {
    const supabase = createAdminClient();
    // Use rpc-less approach: leverage REST to a generic exec endpoint isn't available
    // so we fall back to reading from `pg_stat_activity`. Instead, return a help message.
    return { rows: [{ note: "Direct SQL execution requires a Supabase RPC. Use the table editor in Supabase for ad-hoc queries." }] };
  } catch (e) {
    return { rows: [], error: e instanceof Error ? e.message : "Unknown error" };
  }
}
