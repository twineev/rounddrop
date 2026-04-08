"use client";

import { useState } from "react";
import { MOCK_ROUNDS } from "@/lib/mock-data";
import { INSTRUMENT_TYPES, TRACTION_METRIC_OPTIONS } from "@/lib/constants";
import { ExternalLink, Link2, Globe, MessageSquare, Calendar, FileText, ThumbsDown, Bookmark, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { TractionMetrics } from "@/types";

export default function DemoInvestorDealPage() {
  const round = MOCK_ROUNDS[0]; // Arcana AI
  const [triage, setTriage] = useState<string | null>(null);
  const founder = round.founder_profiles;
  const instrument = INSTRUMENT_TYPES.find((t) => t.value === round.instrument_type);
  const progress = Math.round((round.amount_raised / round.raise_amount) * 100);
  const metrics = round.traction_metrics as TractionMetrics;
  const metricEntries = Object.entries(metrics);

  function handleTriage(action: string) {
    setTriage(action);
    const msgs: Record<string, string> = { passed: "Deal passed", tracked: "Added to watchlist!", interested: "Interest sent to founder!" };
    toast.success(msgs[action] + " (Demo)");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{founder.company_name}</h1>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>Pre-Seed</span>
          </div>
          <p className="text-lg text-gray-500">{founder.one_liner}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {founder.sector.map((s) => (
              <span key={s} className="rounded-full bg-white border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">{s}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleTriage("passed")} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${triage === "passed" ? "border-gray-300 bg-gray-100 text-gray-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
            <ThumbsDown className="h-3.5 w-3.5" /> Pass
          </button>
          <button onClick={() => handleTriage("tracked")} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${triage === "tracked" ? "border-green-300 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-500 hover:border-green-300"}`}>
            <Bookmark className="h-3.5 w-3.5" /> Track
          </button>
          <button onClick={() => handleTriage("interested")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-px ${triage === "interested" ? "bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700"}`}>
            <Heart className="h-3.5 w-3.5" /> Interested
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900 mb-4">Round Terms</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div><span className="text-xs text-gray-500">Instrument</span><p className="font-semibold text-gray-900 text-sm">{instrument?.label}</p></div>
              <div><span className="text-xs text-gray-500">Target Raise</span><p className="font-semibold text-gray-900 text-sm">${round.raise_amount.toLocaleString()}</p></div>
              <div><span className="text-xs text-gray-500">Raised So Far</span><p className="font-semibold text-gray-900 text-sm">${round.amount_raised.toLocaleString()} ({progress}%)</p></div>
              <div><span className="text-xs text-gray-500">Min Check</span><p className="font-semibold text-gray-900 text-sm">${round.min_check_size.toLocaleString()}</p></div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{progress}% filled</span></div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900 mb-4">Traction</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {metricEntries.map(([key, value]) => {
                const def = TRACTION_METRIC_OPTIONS.find((m) => m.key === key);
                if (!def) return null;
                return (
                  <div key={key}>
                    <span className="text-xs text-gray-500">{def.label}</span>
                    <p className="text-xl font-bold text-gray-900">
                      {"prefix" in def ? def.prefix : ""}{typeof value === "number" ? value.toLocaleString() : value}{"suffix" in def ? def.suffix : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900 mb-4">Materials</h2>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-700">{round.pitch_deck_filename}</span>
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">PDF</span>
            </div>
          </div>

          {round.existing_investors.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900 mb-3">Investors in This Round</h2>
              <div className="flex flex-wrap gap-1.5">
                {round.existing_investors.map((inv) => (
                  <span key={inv} className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{inv}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700 text-sm font-bold">SC</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{founder.profiles.full_name}</p>
                <p className="text-xs text-gray-500">Founder</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500"><Link2 className="h-4 w-4" /> LinkedIn</div>
              <div className="flex items-center gap-2 text-sm text-gray-500"><Globe className="h-4 w-4" /> Website</div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 mb-2">Affiliations</p>
              {founder.accelerator_affiliations?.map((a) => (
                <span key={a} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{a}</span>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <button onClick={() => toast.success("Message thread opened! (Demo)")} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px">
                <MessageSquare className="h-4 w-4" /> Message Founder
              </button>
              <button onClick={() => toast.success("Calendar opened! (Demo)")} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50">
                <Calendar className="h-4 w-4" /> Book a Call
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-xs text-gray-500">Round closes</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(round.close_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(round.close_date), { addSuffix: true })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
