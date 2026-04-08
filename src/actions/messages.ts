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

export async function getOrCreateThread(
  otherProfileId: string,
  roundDropId?: string
) {
  const profileId = await getCurrentProfileId();
  const supabase = createAdminClient();

  // Ensure consistent participant ordering to avoid duplicates
  const [p1, p2] =
    profileId < otherProfileId
      ? [profileId, otherProfileId]
      : [otherProfileId, profileId];

  // Try to find existing thread
  let query = supabase
    .from("message_threads")
    .select("*")
    .eq("participant_1_id", p1)
    .eq("participant_2_id", p2);

  if (roundDropId) {
    query = query.eq("round_drop_id", roundDropId);
  }

  const { data: existing } = await query.single();

  if (existing) return existing;

  // Create new thread
  const { data: thread, error } = await supabase
    .from("message_threads")
    .insert({
      participant_1_id: p1,
      participant_2_id: p2,
      round_drop_id: roundDropId || null,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create thread: " + error.message);

  return thread;
}

export async function sendMessage(threadId: string, content: string) {
  const profileId = await getCurrentProfileId();
  const supabase = createAdminClient();

  // Get the thread to find the other participant
  const { data: thread } = await supabase
    .from("message_threads")
    .select("*")
    .eq("id", threadId)
    .single();

  if (!thread) throw new Error("Thread not found");

  const receiverId =
    thread.participant_1_id === profileId
      ? thread.participant_2_id
      : thread.participant_1_id;

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_profile_id: profileId,
      receiver_profile_id: receiverId,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) throw new Error("Failed to send message: " + error.message);

  // Update thread's last_message_at
  await supabase
    .from("message_threads")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", threadId);

  // Create notification for receiver
  const { data: sender } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", profileId)
    .single();

  if (sender) {
    await supabase.from("notifications").insert({
      profile_id: receiverId,
      type: "new_message",
      title: `New message from ${sender.full_name}`,
      body: content.trim().slice(0, 100),
      metadata: { thread_id: threadId },
    });
  }

  revalidatePath("/messages");
  return message;
}

export async function getThreads() {
  const profileId = await getCurrentProfileId();
  const supabase = createAdminClient();

  const { data: threads, error } = await supabase
    .from("message_threads")
    .select("*")
    .or(`participant_1_id.eq.${profileId},participant_2_id.eq.${profileId}`)
    .order("last_message_at", { ascending: false });

  if (error) throw new Error("Failed to fetch threads: " + error.message);

  // Enrich with other participant info and last message
  const enriched = await Promise.all(
    threads.map(async (thread) => {
      const otherParticipantId =
        thread.participant_1_id === profileId
          ? thread.participant_2_id
          : thread.participant_1_id;

      const [{ data: otherProfile }, { data: lastMessage }, { count: unreadCount }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("id", otherParticipantId)
            .single(),
          supabase
            .from("messages")
            .select("*")
            .eq("thread_id", thread.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("thread_id", thread.id)
            .eq("receiver_profile_id", profileId)
            .is("read_at", null),
        ]);

      return {
        ...thread,
        other_participant: otherProfile,
        last_message: lastMessage,
        unread_count: unreadCount || 0,
      };
    })
  );

  return enriched;
}

export async function getMessages(threadId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw new Error("Failed to fetch messages: " + error.message);

  return data;
}

export async function markThreadAsRead(threadId: string) {
  const profileId = await getCurrentProfileId();
  const supabase = createAdminClient();

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .eq("receiver_profile_id", profileId)
    .is("read_at", null);

  revalidatePath("/messages");
}
