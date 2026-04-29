"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getUpcomingEvents(limit = 20) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);
  return data || [];
}

export async function getFeaturedEvents() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_featured", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(3);
  return data || [];
}

export async function getResources(category?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from("resources")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  const { data } = await query;
  return data || [];
}

export async function getFeaturedResources() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return data || [];
}
