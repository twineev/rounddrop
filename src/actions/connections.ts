"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeLinkedinUrl } from "@/lib/linkedin";

async function getMyProfileId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, linkedin_url")
    .eq("clerk_user_id", userId)
    .single();
  if (!data) throw new Error("Profile not found");
  return data;
}

export async function addConnection(input: {
  linkedin_url: string;
  full_name?: string;
  headline?: string;
}) {
  const me = await getMyProfileId();
  const normalized = normalizeLinkedinUrl(input.linkedin_url);
  if (!normalized) throw new Error("Invalid LinkedIn URL");

  const supabase = createAdminClient();
  const { error } = await supabase.from("user_connections").insert({
    profile_id: me.id,
    linkedin_url: normalized,
    full_name: input.full_name || null,
    headline: input.headline || null,
  });
  if (error && !error.message.includes("duplicate")) {
    throw new Error("Failed to add connection: " + error.message);
  }
  revalidatePath("/profile");
  return { success: true };
}

export async function importConnectionsFromCsv(csv: string) {
  const me = await getMyProfileId();
  // LinkedIn's Connections.csv has: First Name, Last Name, URL, ... after a few header rows
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const rows: { linkedin_url: string; full_name: string | null }[] = [];
  for (const line of lines) {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    // Find the URL column (contains linkedin.com/in)
    const urlCol = cols.find((c) => /linkedin\.com\/in\//i.test(c));
    if (!urlCol) continue;
    const normalized = normalizeLinkedinUrl(urlCol);
    if (!normalized) continue;
    // Try to build full_name from First + Last if present
    const firstName = cols[0] || "";
    const lastName = cols[1] || "";
    const full_name = [firstName, lastName].filter(Boolean).join(" ") || null;
    rows.push({ linkedin_url: normalized, full_name });
  }

  if (rows.length === 0) {
    return { success: true, imported: 0 };
  }

  const supabase = createAdminClient();
  const batchSize = 200;
  let imported = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize).map((r) => ({
      profile_id: me.id,
      linkedin_url: r.linkedin_url,
      full_name: r.full_name,
    }));
    const { error, count } = await supabase
      .from("user_connections")
      .upsert(batch, { onConflict: "profile_id,linkedin_url", count: "exact", ignoreDuplicates: true });
    if (!error) imported += count ?? batch.length;
  }
  revalidatePath("/profile");
  return { success: true, imported };
}

export async function removeConnection(connectionId: string) {
  const me = await getMyProfileId();
  const supabase = createAdminClient();
  await supabase
    .from("user_connections")
    .delete()
    .eq("id", connectionId)
    .eq("profile_id", me.id);
  revalidatePath("/profile");
  return { success: true };
}

export async function getMyConnections() {
  const me = await getMyProfileId();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("user_connections")
    .select("*")
    .eq("profile_id", me.id)
    .order("created_at", { ascending: false });
  return data || [];
}

/**
 * Compute mutual connections between the current user and another profile.
 * A mutual connection is any LinkedIn URL that appears in both users'
 * user_connections lists.
 *
 * Also returns true if the other user's own LinkedIn URL appears in my
 * connections (i.e. I know them directly).
 */
export async function getMutualConnections(otherProfileId: string) {
  const { userId } = await auth();
  if (!userId) return { mutuals: [], knowsDirectly: false, count: 0 };

  const supabase = createAdminClient();
  const { data: me } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();
  if (!me) return { mutuals: [], knowsDirectly: false, count: 0 };

  // Get the other user's LinkedIn URL
  const { data: other } = await supabase
    .from("profiles")
    .select("id, linkedin_url")
    .eq("id", otherProfileId)
    .single();
  const otherLinkedin = other?.linkedin_url ? normalizeLinkedinUrl(other.linkedin_url) : null;

  // My connections
  const { data: mine } = await supabase
    .from("user_connections")
    .select("linkedin_url, full_name, headline")
    .eq("profile_id", me.id);

  // Their connections
  const { data: theirs } = await supabase
    .from("user_connections")
    .select("linkedin_url")
    .eq("profile_id", otherProfileId);

  const theirSet = new Set((theirs || []).map((t) => t.linkedin_url));
  const mutuals = (mine || [])
    .filter((m) => theirSet.has(m.linkedin_url))
    .map((m) => ({
      linkedin_url: m.linkedin_url,
      full_name: m.full_name,
      headline: m.headline,
    }));

  const knowsDirectly = !!otherLinkedin && (mine || []).some(
    (m) => m.linkedin_url === otherLinkedin
  );

  return {
    mutuals: mutuals.slice(0, 5),
    knowsDirectly,
    count: mutuals.length,
  };
}
