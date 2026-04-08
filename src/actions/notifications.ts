"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function getCurrentProfileId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");
  return profile.id;
}

export async function getNotifications() {
  const profileId = await getCurrentProfileId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error("Failed to fetch notifications: " + error.message);

  return data;
}

export async function getUnreadCount() {
  const profileId = await getCurrentProfileId();
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId)
    .is("read_at", null);

  if (error) return 0;
  return count || 0;
}

export async function markAsRead(notificationId: string) {
  const supabase = createAdminClient();

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);

  revalidatePath("/notifications");
}

export async function markAllAsRead() {
  const profileId = await getCurrentProfileId();
  const supabase = createAdminClient();

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("profile_id", profileId)
    .is("read_at", null);

  revalidatePath("/notifications");
}
