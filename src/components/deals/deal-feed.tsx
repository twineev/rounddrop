import Link from "next/link";
import { INSTRUMENT_TYPES, TRACTION_METRIC_OPTIONS } from "@/lib/constants";
import { TriageButtons } from "./triage-buttons";
import { formatDistanceToNow } from "date-fns";
import { DollarSign } from "lucide-react";
import type { TractionMetrics } from "@/types";

interface DealFeedProps {
  rounds: Array<{
    id: string;
    instrument_type: string;
    raise_amount: number;
    amount_raised: number;
    min_check_size: number;
    close_date: string;
    traction_metrics: unknown;
    created_at: string;
    founder_profiles: {
      company_name: string;
      one_liner: string;
      sector: string[];
      calendar_link: string;
      profiles: {
        full_name: string;
        avatar_url: string | null;
      };
    };
  }>;
}

export function DealFeed({ rounds }: DealFeedProps) {
  if (rounds.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 mb-4">
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No deals found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rounds.map((round) => {
        const founder = round.founder_profiles;
        const instrument = INSTRUMENT_TYPES.find((t) => t.value === round.instrument_type);
        const progress = round.raise_amount > 0 ? Math.round((round.amount_raised / round.raise_amount) * 100) : 0;
        const metrics = (round.traction_metrics || {}) as TractionMetrics;
        const metricEntries = Object.entries(metrics).slice(0, 3);

        const stageTag = round.instrument_type === "safe" || round.instrument_type === "safe_mfn"
          ? { label: "Pre-Seed", bg: "#fef3c7", color: "#92400e" }
          : { label: "Seed", bg: "#dcfce7", color: "#15803d" };

        return (
          <div key={round.id} className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <Link href={`/deals/${round.id}`}>
                <h3 className="font-bold text-gray-900 hover:text-green-600 transition-colors">
                  {founder.company_name}
                </h3>
              </Link>
              <div className="flex gap-1.5">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: stageTag.bg, color: stageTag.color }}
                >
                  {stageTag.label}
                </span>
                {progress >= 75 && (
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                    Hot
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{founder.one_liner}</p>

            {/* Sectors */}
            <div className="flex flex-wrap gap-1 mb-3">
              {founder.sector.slice(0, 3).map((s: string) => (
                <span key={s} className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs text-gray-600">
                  {s}
                </span>
              ))}
            </div>

            {/* Metrics */}
            {metricEntries.length > 0 && (
              <div className="flex gap-4 mb-4">
                {metricEntries.map(([key, value]) => {
                  const def = TRACTION_METRIC_OPTIONS.find((m) => m.key === key);
                  if (!def) return null;
                  return (
                    <div key={key} className="text-xs">
                      <span className="text-gray-500">{def.label}</span>
                      <p className="font-semibold text-gray-900">
                        {"prefix" in def ? def.prefix : ""}
                        {typeof value === "number" ? value.toLocaleString() : value}
                        {"suffix" in def ? def.suffix : ""}
                      </p>
                    </div>
                  );
                })}
                <div className="text-xs">
                  <span className="text-gray-500">Raising</span>
                  <p className="font-semibold text-gray-900">${round.raise_amount.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="mb-2">
              <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full bg-green-500 transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{progress}% filled</span>
              <span>
                Closes {formatDistanceToNow(new Date(round.close_date), { addSuffix: true })}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <TriageButtons roundDropId={round.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
