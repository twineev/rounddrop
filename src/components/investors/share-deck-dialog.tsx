"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { shareDeck } from "@/actions/deck-shares";
import { toast } from "sonner";

interface ShareDeckDialogProps {
  investorProfileId: string;
  investorName: string;
  isPreview?: boolean;
}

export function ShareDeckDialog({
  investorProfileId,
  investorName,
  isPreview,
}: ShareDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [deckUrl, setDeckUrl] = useState("");
  const [deckFilename, setDeckFilename] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isPreview) {
      toast.success("Deck shared! (Preview mode)");
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      await shareDeck({
        investor_profile_id: investorProfileId,
        deck_url: deckUrl,
        deck_filename: deckFilename || undefined,
        message: message || undefined,
      });
      toast.success(`Deck shared with ${investorName}`);
      setOpen(false);
      setDeckUrl("");
      setDeckFilename("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to share deck");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Share your deck
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share deck with {investorName}</DialogTitle>
          <DialogDescription>
            Send your pitch deck directly to this investor. They will be notified
            when they claim their profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">
              Deck URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={deckUrl}
              onChange={(e) => setDeckUrl(e.target.value)}
              placeholder="https://docsend.com/your-deck"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">
              Filename
            </label>
            <input
              type="text"
              value={deckFilename}
              onChange={(e) => setDeckFilename(e.target.value)}
              placeholder="my-pitch-deck.pdf"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'd love for you to take a look at what we're building..."
              rows={3}
              maxLength={500}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-400">{message.length}/500</p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !deckUrl}>
              {loading ? "Sharing..." : "Share deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
