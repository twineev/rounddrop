"use client";

import { useState } from "react";
import { sendMessage } from "@/actions/messages";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  threadId: string;
}

export function MessageInput({ threadId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(threadId, content);
      setContent("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex gap-2 border-t border-gray-200 bg-white p-4 rounded-b-xl">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 min-h-[44px] max-h-32 resize-none rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100 placeholder:text-gray-400"
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={!content.trim() || sending}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white transition-all hover:bg-green-700 disabled:opacity-40"
      >
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </button>
    </div>
  );
}
