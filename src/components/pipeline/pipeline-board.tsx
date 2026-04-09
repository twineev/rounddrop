"use client";

import { useState } from "react";
import Link from "next/link";
import { PIPELINE_STATUSES, INVESTOR_TYPES } from "@/lib/constants";
import { updatePipelineStatus, updatePipelineNotes, removeFromPipeline } from "@/actions/pipeline";
import { Building2, ExternalLink, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PipelineEntry {
  id: string;
  investor_profile_id: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  investor_profiles: {
    id: string;
    firm_name: string | null;
    gp_name: string | null;
    investor_type: string;
    check_size_min: number;
    check_size_max: number;
    sectors: string[];
    slug: string | null;
  };
}

interface PipelineBoardProps {
  entries: PipelineEntry[];
  isPreview?: boolean;
}

function formatCheckSize(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

function PipelineRow({ entry, isPreview }: { entry: PipelineEntry; isPreview?: boolean }) {
  const [status, setStatus] = useState(entry.status);
  const [notes, setNotes] = useState(entry.notes || "");
  const [editingNotes, setEditingNotes] = useState(false);
  const [updating, setUpdating] = useState(false);

  const statusInfo = PIPELINE_STATUSES[status as keyof typeof PIPELINE_STATUSES] || PIPELINE_STATUSES.researching;
  const investorTypeLabel =
    INVESTOR_TYPES.find((t) => t.value === entry.investor_profiles.investor_type)?.label ||
    entry.investor_profiles.investor_type;

  async function handleStatusChange(newStatus: string) {
    if (isPreview) {
      setStatus(newStatus);
      toast.success("Status updated! (Preview mode)");
      return;
    }

    setUpdating(true);
    try {
      await updatePipelineStatus(entry.id, newStatus as any);
      setStatus(newStatus);
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  async function handleNotesBlur() {
    setEditingNotes(false);
    if (notes === (entry.notes || "")) return;

    if (isPreview) {
      toast.success("Notes saved! (Preview mode)");
      return;
    }

    try {
      await updatePipelineNotes(entry.id, notes);
    } catch {
      toast.error("Failed to save notes");
    }
  }

  async function handleRemove() {
    if (isPreview) {
      toast.success("Removed from pipeline! (Preview mode)");
      return;
    }

    try {
      await removeFromPipeline(entry.id);
      toast.success("Removed from pipeline");
    } catch {
      toast.error("Failed to remove");
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50">
            <Building2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm truncate">
                {entry.investor_profiles.firm_name || "Independent"}
              </h3>
              {entry.investor_profiles.slug && (
                <Link
                  href={`/investors/${entry.investor_profiles.slug}`}
                  className="text-gray-400 hover:text-green-600 transition-colors shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {entry.investor_profiles.gp_name && `${entry.investor_profiles.gp_name} · `}
              {investorTypeLabel} · {formatCheckSize(entry.investor_profiles.check_size_min)}-{formatCheckSize(entry.investor_profiles.check_size_max)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className={`appearance-none rounded-full pl-3 pr-7 py-1 text-xs font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-green-500 ${statusInfo.color}`}
            >
              {Object.entries(PIPELINE_STATUSES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-60" />
          </div>
          <button
            onClick={handleRemove}
            className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Remove from pipeline"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-3">
        {editingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            autoFocus
            rows={2}
            placeholder="Add notes about this investor..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
          />
        ) : (
          <button
            onClick={() => setEditingNotes(true)}
            className="w-full text-left rounded-lg px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
          >
            {notes ? (
              <span className="text-gray-600">{notes}</span>
            ) : (
              <span className="text-gray-400 italic">Click to add notes...</span>
            )}
          </button>
        )}
      </div>

      {/* Sectors */}
      <div className="flex flex-wrap gap-1 mt-2">
        {entry.investor_profiles.sectors.slice(0, 4).map((sector) => (
          <span
            key={sector}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
          >
            {sector}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PipelineBoard({ entries, isPreview }: PipelineBoardProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = filterStatus === "all"
    ? entries
    : entries.filter((e) => e.status === filterStatus);

  const statusCounts = Object.keys(PIPELINE_STATUSES).reduce(
    (acc, key) => {
      acc[key] = entries.filter((e) => e.status === key).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4">
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterStatus("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filterStatus === "all"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({entries.length})
        </button>
        {Object.entries(PIPELINE_STATUSES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterStatus === key
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {val.label} ({statusCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            {filterStatus === "all"
              ? "No investors in your pipeline yet. Browse the investor directory to get started."
              : "No investors with this status."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((entry) => (
            <PipelineRow key={entry.id} entry={entry} isPreview={isPreview} />
          ))}
        </div>
      )}
    </div>
  );
}
