"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { addToPipeline } from "@/actions/pipeline";
import { toast } from "sonner";

interface AddToPipelineButtonProps {
  investorProfileId: string;
  isPreview?: boolean;
}

export function AddToPipelineButton({
  investorProfileId,
  isPreview,
}: AddToPipelineButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    if (added) return;

    if (isPreview) {
      setAdded(true);
      toast.success("Added to pipeline! (Preview mode)");
      return;
    }

    setLoading(true);
    try {
      await addToPipeline(investorProfileId);
      setAdded(true);
      toast.success("Added to your pipeline");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to pipeline");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={loading || added}
      className="gap-2"
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          In pipeline
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          {loading ? "Adding..." : "Add to pipeline"}
        </>
      )}
    </Button>
  );
}
