"use client";

import { useState } from "react";
import { triageDeal } from "@/actions/interactions";
import { toast } from "sonner";
import { ThumbsDown, Bookmark, Heart } from "lucide-react";

interface TriageButtonsProps {
  roundDropId: string;
  currentAction?: string | null;
}

export function TriageButtons({ roundDropId, currentAction }: TriageButtonsProps) {
  const [action, setAction] = useState(currentAction);
  const [loading, setLoading] = useState(false);

  async function handleTriage(newAction: "passed" | "tracked" | "interested") {
    if (loading) return;
    setLoading(true);
    try {
      await triageDeal(roundDropId, newAction);
      setAction(newAction);
      const messages = {
        passed: "Deal passed",
        tracked: "Added to watchlist",
        interested: "Interest sent to founder!",
      };
      toast.success(messages[newAction]);
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleTriage("passed")}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
          action === "passed"
            ? "border-gray-300 bg-gray-100 text-gray-700"
            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
        Pass
      </button>
      <button
        onClick={() => handleTriage("tracked")}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
          action === "tracked"
            ? "border-green-300 bg-green-50 text-green-700"
            : "border-gray-200 bg-white text-gray-500 hover:border-green-300 hover:text-green-700"
        }`}
      >
        <Bookmark className="h-3.5 w-3.5" />
        Track
      </button>
      <button
        onClick={() => handleTriage("interested")}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-px ${
          action === "interested"
            ? "bg-green-700 text-white"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        <Heart className="h-3.5 w-3.5" />
        Interested
      </button>
    </div>
  );
}
