import Link from "next/link";
import { MOCK_ROUNDS } from "@/lib/mock-data";
import { INSTRUMENT_TYPES, TRACTION_METRIC_OPTIONS } from "@/lib/constants";
import { DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { TractionMetrics } from "@/types";

export default function DemoInvestorDealsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-green-600 mb-1">Deal Feed</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Discover rounds</h1>
        <p className="text-gray-500 text-sm mt-1">Pre-seed and seed rounds from vetted founders</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_ROUNDS.map((round) => {
          const founder = round.founder_profiles;
          const progress = round.raise_amount > 0 ? Math.round((round.amount_raised / round.raise_amount) * 100) : 0;
          const metrics = (round.traction_metrics || {}) as TractionMetrics;
          const metricEntries = Object.entries(metrics).slice(0, 3);

          const stageTag = round.instrument_type === "safe" || round.instrument_type === "safe_mfn"
            ? { label: "Pre-Seed", bg: "#fef3c7", color: "#92400e" }
            : { label: "Seed", bg: "#dcfce7", color: "#15803d" };

          return (
            <Link key={round.id} href="/demo/investor/deal">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{founder.company_name}</h3>
                  <div className="flex gap-1.5">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: stageTag.bg, color: stageTag.color }}>
                      {stageTag.label}
                    </span>
                    {progress >= 75 && (
                      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">Hot</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{founder.one_liner}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {founder.sector.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs text-gray-600">{s}</span>
                  ))}
                </div>
                {metricEntries.length > 0 && (
                  <div className="flex gap-4 mb-4">
                    {metricEntries.map(([key, value]) => {
                      const def = TRACTION_METRIC_OPTIONS.find((m) => m.key === key);
                      if (!def) return null;
                      return (
                        <div key={key} className="text-xs">
                          <span className="text-gray-500">{def.label}</span>
                          <p className="font-semibold text-gray-900">
                            {"prefix" in def ? def.prefix : ""}{typeof value === "number" ? value.toLocaleString() : value}{"suffix" in def ? def.suffix : ""}
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
                <div className="mb-2">
                  <div className="h-1.5 w-full rounded-full bg-gray-200">
                    <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{progress}% filled</span>
                  <span>Closes {formatDistanceToNow(new Date(round.close_date), { addSuffix: true })}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
