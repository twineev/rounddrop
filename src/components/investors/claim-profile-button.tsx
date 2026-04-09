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
import { UserCheck } from "lucide-react";
import { claimInvestorProfile } from "@/actions/investors";
import { toast } from "sonner";

interface ClaimProfileButtonProps {
  investorProfileId: string;
  firmName: string;
  isPreview?: boolean;
}

export function ClaimProfileButton({
  investorProfileId,
  firmName,
  isPreview,
}: ClaimProfileButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isPreview) {
      setSubmitted(true);
      toast.success("Claim request sent! (Preview mode)");
      return;
    }

    setLoading(true);
    try {
      await claimInvestorProfile(investorProfileId, email);
      setSubmitted(true);
      toast.success("Claim request sent! Check your email.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to claim profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Claim this profile
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim {firmName} profile</DialogTitle>
          <DialogDescription>
            Verify your identity to claim and manage this investor profile.
            You will receive a verification email.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-700 font-medium">Verification email sent!</p>
            <p className="text-xs text-gray-500 mt-1">
              Check your inbox for a link to complete the claim.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Your work email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fund.com"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Use your fund email for faster verification.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading || !email}>
                {loading ? "Sending..." : "Send verification"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
