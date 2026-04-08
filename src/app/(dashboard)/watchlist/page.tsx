import Link from "next/link";
import { MOCK_ROUNDS } from "@/lib/mock-data";
import { INSTRUMENT_TYPES, TRACTION_METRIC_OPTIONS } from "@/lib/constants";
import { Bookmark, Bell, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { TractionMetrics } from "@/types";

// Simulate tracked deals
const trackedRounds = MOCK_ROUNDS.slice(0, 3);

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-green-600 mb-1">Watchlist</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Tracked rounds</h1>
        <p className="text-gray-500 text-sm mt-1">
          Rounds you&apos;re watching — get notified on updates
        </p>
      </div>

      {trackedRounds.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 mb-4">
            <Bookmark className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No tracked rounds</h3>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Browse the deal feed and click &quot;Track&quot; to add rounds to your watchlist
          </p>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
          >
            Browse Deals
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {trackedRounds.map((round) => {
            const founder = round.founder_profiles;
            const instrument = INSTRUMENT_TYPES.find((t) => t.value === round.instrument_type);
            const progress = round.raise_amount > 0 ? Math.round((round.amount_raised / round.raise_amount) * 100) : 0;
            const metrics = (round.traction_metrics || {}) as TractionMetrics;
            const topMetric = Object.entries(metrics)[0];
            const metricDef = topMetric ? TRACTION_METRIC_OPTIONS.find((m) => m.key === topMetric[0]) : null;

            const stageTag = round.instrument_type === "safe" || round.instrument_type === "safe_mfn"
              ? { label: "Pre-Seed", bg: "#fef3c7", color: "#92400e" }
              : { label: "Seed", bg: "#dcfce7", color: "#15803d" };

            return (
              <Link key={round.id} href={`/deals/${round.id}`}>
                <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{founder.company_name}</h3>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: stageTag.bg, color: stageTag.color }}>
                          {stageTag.label}
                        </span>
                        {progress >= 75 && (
                          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">Closing Soon</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{founder.one_liner}</p>

                      <div className="flex items-center gap-6 mt-3">
                        <div className="text-xs">
                          <span className="text-gray-500">Raising</span>
                          <p className="font-semibold text-gray-900">${round.raise_amount.toLocaleString()}</p>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Filled</span>
                          <p className="font-semibold text-gray-900">{progress}%</p>
                        </div>
                        {topMetric && metricDef && (
                          <div className="text-xs">
                            <span className="text-gray-500">{metricDef.label}</span>
                            <p className="font-semibold text-gray-900">
                              {"prefix" in metricDef ? metricDef.prefix : ""}
                              {typeof topMetric[1] === "number" ? topMetric[1].toLocaleString() : topMetric[1]}
                              {"suffix" in metricDef ? metricDef.suffix : ""}
                            </p>
                          </div>
                        )}
                        <div className="text-xs">
                          <span className="text-gray-500">Closes</span>
                          <p className="font-semibold text-gray-900">
                            {formatDistanceToNow(new Date(round.close_date), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <Bookmark className="h-3 w-3" />
                        Tracking
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-200 rounded-full">
                      <div className="h-1.5 bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
