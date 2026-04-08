import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getMessages, markThreadAsRead } from "@/actions/messages";
import { createAdminClient } from "@/lib/supabase/admin";
import { MessageInput } from "@/components/messages/message-input";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ThreadPageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { threadId } = await params;
  const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

  let currentProfileId = "preview";

  if (!isPreview) {
    const { userId } = await auth();
    if (!userId) notFound();
    const supabase = createAdminClient();
    const { data: currentProfile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
    if (!currentProfile) notFound();
    currentProfileId = currentProfile.id;
  }

  const supabase = createAdminClient();
  const { data: thread } = await supabase.from("message_threads").select("*").eq("id", threadId).single();
  if (!thread) notFound();

  const otherParticipantId = thread.participant_1_id === currentProfileId ? thread.participant_2_id : thread.participant_1_id;
  const { data: otherProfile } = await supabase.from("profiles").select("*").eq("id", otherParticipantId).single();
  if (!otherProfile) notFound();

  const [messages] = await Promise.all([
    getMessages(threadId),
    markThreadAsRead(threadId),
  ]);

  return (
    <div className="mx-auto max-w-2xl flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white p-4 rounded-t-xl">
        <Link href="/messages" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-700 text-xs font-bold">
          {otherProfile.full_name.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{otherProfile.full_name}</p>
          <p className="text-xs text-gray-500 capitalize">{otherProfile.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_profile_id === currentProfileId;
            return (
              <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] rounded-xl px-4 py-2.5",
                  isMine ? "bg-green-600 text-white" : "bg-white border border-gray-200"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={cn("text-[10px] mt-1", isMine ? "text-green-200" : "text-gray-400")}>
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <MessageInput threadId={threadId} />
    </div>
  );
}
