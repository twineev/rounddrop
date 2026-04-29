"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { requestIntro } from "@/actions/intros";

interface Investor {
  id: string;
  firm_name: string | null;
  gp_name: string | null;
}

export function RequestIntroButton({
  fromFounderProfileId,
  viaInvestorProfileId,
  investors,
}: {
  fromFounderProfileId: string;
  viaInvestorProfileId: string;
  investors: Investor[];
}) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!target) return;
    setLoading(true);
    try {
      await requestIntro({
        fromFounderProfileId,
        toInvestorProfileId: target,
        viaInvestorProfileId,
        message,
      });
      toast.success("Intro request sent");
      setOpen(false);
      setTarget("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to request intro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Request an intro
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request an investor intro</DialogTitle>
          <DialogDescription>
            Ask this founder to introduce you to another investor on Round Drop.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Which investor?
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            >
              <option value="">Select an investor…</option>
              {investors.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.firm_name || inv.gp_name || "Investor"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why would this intro be valuable?"
              rows={3}
              maxLength={500}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !target}>
              {loading ? "Sending..." : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
