"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PlatformConnection {
  profile_id: string;
  full_name: string;
  role: "founder" | "investor" | null;
  is_verified: boolean;
  avatar_url: string | null;
  linkedin_url: string | null;
  // Role-specific
  company_name: string | null; // founder
  firm_name: string | null;    // investor
  gp_name: string | null;       // investor
  investor_type: string | null; // investor
  source: string | null;
  created_at: string;
}

async function myProfileId() {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();
  return data?.id || null;
}

/**
 * Create a platform connection between two profiles. Idempotent — uses
 * UNIQUE(profile_a_id, profile_b_id) ordering to dedupe.
 */
export async function ensurePlatformConnection(
  profileIdA: string,
  profileIdB: string,
  source: "deck_share" | "intro_request" | "manual" | "event_rsvp"
) {
  if (profileIdA === profileIdB) return { success: false };
  const [a, b] = profileIdA < profileIdB ? [profileIdA, profileIdB] : [profileIdB, profileIdA];
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("platform_connections")
    .upsert(
      { profile_a_id: a, profile_b_id: b, source },
      { onConflict: "profile_a_id,profile_b_id", ignoreDuplicates: true }
    );
  if (error && !error.message.includes("duplicate")) {
    console.error("Failed to ensure connection:", error.message);
    return { success: false };
  }
  return { success: true };
}

/**
 * Returns the current user's platform connections, joined with the
 * connected user's profile + role-specific fields.
 */
export async function getMyPlatformConnections(): Promise<PlatformConnection[]> {
  const me = await myProfileId();
  if (!me) return [];

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("platform_connections")
    .select("profile_a_id, profile_b_id, source, created_at")
    .or(`profile_a_id.eq.${me},profile_b_id.eq.${me}`)
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) return [];

  const otherIds = data.map((c) => (c.profile_a_id === me ? c.profile_b_id : c.profile_a_id));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url, linkedin_url, is_verified")
    .in("id", otherIds);

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  const founderIds = (profiles || []).filter((p) => p.role === "founder").map((p) => p.id);
  const investorIds = (profiles || []).filter((p) => p.role === "investor").map((p) => p.id);

  const { data: founders } = founderIds.length
    ? await supabase
        .from("founder_profiles")
        .select("profile_id, company_name")
        .in("profile_id", founderIds)
    : { data: [] };

  const { data: investors } = investorIds.length
    ? await supabase
        .from("investor_profiles")
        .select("profile_id, firm_name, gp_name, investor_type")
        .in("profile_id", investorIds)
    : { data: [] };

  const founderMap = new Map((founders || []).map((f) => [f.profile_id, f]));
  const investorMap = new Map((investors || []).map((i) => [i.profile_id, i]));

  return data
    .map((c) => {
      const otherId = c.profile_a_id === me ? c.profile_b_id : c.profile_a_id;
      const p = profileMap.get(otherId);
      if (!p) return null;
      const f = founderMap.get(otherId);
      const i = investorMap.get(otherId);
      return {
        profile_id: p.id,
        full_name: p.full_name,
        role: p.role,
        is_verified: p.is_verified,
        avatar_url: p.avatar_url,
        linkedin_url: p.linkedin_url,
        company_name: f?.company_name || null,
        firm_name: i?.firm_name || null,
        gp_name: i?.gp_name || null,
        investor_type: i?.investor_type || null,
        source: c.source,
        created_at: c.created_at,
      } as PlatformConnection;
    })
    .filter((x): x is PlatformConnection => x !== null);
}

/**
 * Suggested connections: people who share at least one LinkedIn connection
 * with the current user but aren't already connected on the platform.
 * Returns up to `limit` suggestions ranked by mutual count.
 */
export async function getSuggestedConnections(limit = 6) {
  const me = await myProfileId();
  if (!me) return [];

  const supabase = createAdminClient();

  // My LinkedIn URLs
  const { data: myLinks } = await supabase
    .from("user_connections")
    .select("linkedin_url")
    .eq("profile_id", me);
  const mySet = new Set((myLinks || []).map((l) => l.linkedin_url));
  if (mySet.size === 0) return [];

  // Existing platform connections (so we exclude them)
  const { data: existing } = await supabase
    .from("platform_connections")
    .select("profile_a_id, profile_b_id")
    .or(`profile_a_id.eq.${me},profile_b_id.eq.${me}`);
  const existingIds = new Set<string>([me]);
  (existing || []).forEach((c) => {
    existingIds.add(c.profile_a_id);
    existingIds.add(c.profile_b_id);
  });

  // For every other user with LinkedIn connections, count overlap
  const { data: allConns } = await supabase
    .from("user_connections")
    .select("profile_id, linkedin_url");
  const overlap = new Map<string, number>();
  (allConns || []).forEach((c) => {
    if (existingIds.has(c.profile_id)) return;
    if (mySet.has(c.linkedin_url)) {
      overlap.set(c.profile_id, (overlap.get(c.profile_id) || 0) + 1);
    }
  });

  const sortedIds = [...overlap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
  if (sortedIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url, is_verified")
    .in("id", sortedIds);
  const founderIds = (profiles || []).filter((p) => p.role === "founder").map((p) => p.id);
  const investorIds = (profiles || []).filter((p) => p.role === "investor").map((p) => p.id);

  const { data: founders } = founderIds.length
    ? await supabase.from("founder_profiles").select("profile_id, company_name").in("profile_id", founderIds)
    : { data: [] };
  const { data: investors } = investorIds.length
    ? await supabase.from("investor_profiles").select("profile_id, firm_name, gp_name").in("profile_id", investorIds)
    : { data: [] };

  const founderMap = new Map((founders || []).map((f) => [f.profile_id, f]));
  const investorMap = new Map((investors || []).map((i) => [i.profile_id, i]));

  return (profiles || []).map((p) => ({
    profile_id: p.id,
    full_name: p.full_name,
    role: p.role,
    avatar_url: p.avatar_url,
    is_verified: p.is_verified,
    company_name: founderMap.get(p.id)?.company_name || null,
    firm_name: investorMap.get(p.id)?.firm_name || null,
    gp_name: investorMap.get(p.id)?.gp_name || null,
    mutual_count: overlap.get(p.id) || 0,
  }));
}
