import Link from "next/link";
import { getThreads } from "@/actions/messages";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function MessagesPage() {
  let threads: Awaited<ReturnType<typeof getThreads>> = [];
  try { threads = await getThreads(); } catch { /* preview */ }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-green-600 mb-1">Messages</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Your conversations</h1>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 mb-4">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No messages yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Start a conversation from a deal page or when an investor reaches out
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => {
            const other = thread.other_participant;
            if (!other) return null;

            return (
              <Link key={thread.id} href={`/messages/${thread.id}`}>
                <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md hover:-translate-y-0.5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 text-sm font-bold">
                    {other.full_name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm truncate">{other.full_name}</span>
                      {thread.unread_count > 0 && (
                        <span className="rounded-full bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {thread.unread_count}
                        </span>
                      )}
                    </div>
                    {thread.last_message && (
                      <p className="text-xs text-gray-500 truncate">{thread.last_message.content}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
