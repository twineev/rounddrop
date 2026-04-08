import { notFound } from "next/navigation";
import Link from "next/link";
import { getRound } from "@/actions/rounds";
import { getMyInteraction, recordView } from "@/actions/interactions";
import { TriageButtons } from "@/components/deals/triage-buttons";
import { CalendarEmbed } from "@/components/calendar/calendar-embed";
import { INSTRUMENT_TYPES, TRACTION_METRIC_OPTIONS } from "@/lib/constants";
import { MOCK_ROUNDS } from "@/lib/mock-data";
import { ExternalLink, Link2, Globe, MessageSquare, Calendar, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { TractionMetrics } from "@/types";

const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

interface DealDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params;

  let round: any;

  if (isPreview) {
    round = MOCK_ROUNDS.find((r) => r.id === id);
    if (!round) notFound();
  } else {
    try { round = await getRound(id); } catch { notFound(); }
    if (!round || !["live", "closing"].includes(round.status)) notFound();
    try { await recordView(id); } catch { /* not an investor */ }
  }

  const currentAction = isPreview ? null : await getMyInteraction(id);

  const founder = round.founder_profiles as {
    company_name: string;
    one_liner: string;
    sector: string[];
    calendar_link: string;
    company_website: string | null;
    accelerator_affiliations: string[] | null;
    profiles: { full_name: string; avatar_url: string | null; linkedin_url: string | null; id?: string };
  };

  const instrument = INSTRUMENT_TYPES.find((t) => t.value === round.instrument_type);
  const progress = round.raise_amount > 0 ? Math.round((round.amount_raised / round.raise_amount) * 100) : 0;
  const metrics = (round.traction_metrics || {}) as TractionMetrics;
  const metricEntries = Object.entries(metrics);

  const stageTag = round.instrument_type === "safe" || round.instrument_type === "safe_mfn"
    ? { label: "Pre-Seed", bg: "#fef3c7", color: "#92400e" }
    : { label: "Seed", bg: "#dcfce7", color: "#15803d" };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{founder.company_name}</h1>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: stageTag.bg, color: stageTag.color }}>
              {stageTag.label}
            </span>
            {progress >= 75 && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">Hot</span>
            )}
          </div>
          <p className="text-lg text-gray-500 mt-1">{founder.one_liner}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {founder.sector.map((s: string) => (
              <span key={s} className="rounded-full bg-white border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">{s}</span>
            ))}
          </div>
        </div>
        <TriageButtons roundDropId={round.id} currentAction={currentAction} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main */}
        <div className="space-y-5">
          {/* Round Terms */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900 mb-4">Round Terms</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Instrument", value: instrument?.label },
                { label: "Target Raise", value: `$${round.raise_amount.toLocaleString()}` },
                { label: "Raised So Far", value: `$${round.amount_raised.toLocaleString()} (${progress}%)` },
                { label: "Min Check", value: `$${round.min_check_size.toLocaleString()}` },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{progress}% filled</span>
                <span>${round.amount_raised.toLocaleString()} / ${round.raise_amount.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Traction */}
          {metricEntries.length > 0 && (
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
                        {"prefix" in def ? def.prefix : ""}
                        {typeof value === "number" ? value.toLocaleString() : value}
                        {"suffix" in def ? def.suffix : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Materials */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900 mb-4">Materials</h2>
            <div className="space-y-3">
              {round.pitch_deck_filename && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">{round.pitch_deck_filename}</span>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">PDF</span>
                </div>
              )}
              {round.demo_link && (
                <a href={round.demo_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
                  <ExternalLink className="h-4 w-4" /> Demo / Video
                </a>
              )}
            </div>
          </div>

          {/* Existing Investors */}
          {round.existing_investors && round.existing_investors.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-bold text-gray-900 mb-3">Investors in This Round</h2>
              <div className="flex flex-wrap gap-1.5">
                {round.existing_investors.map((inv: string) => (
                  <span key={inv} className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{inv}</span>
                ))}
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <CalendarEmbed calendarLink={founder.calendar_link} founderName={founder.profiles.full_name} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700 text-sm font-bold">
                {founder.profiles.full_name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{founder.profiles.full_name}</p>
                <p className="text-xs text-gray-500">Founder</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              {founder.profiles.linkedin_url && (
                <a href={founder.profiles.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                  <Link2 className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {founder.company_website && (
                <a href={founder.company_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                  <Globe className="h-4 w-4" /> Website
                </a>
              )}
            </div>

            {founder.accelerator_affiliations && founder.accelerator_affiliations.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500 mb-2">Affiliations</p>
                <div className="flex flex-wrap gap-1">
                  {founder.accelerator_affiliations.map((a: string) => (
                    <span key={a} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{a}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <Link
                href={`/messages?to=${founder.profiles.id || ""}&round=${round.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
              >
                <MessageSquare className="h-4 w-4" /> Message Founder
              </Link>
              <a
                href={founder.calendar_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4" /> Book a Call
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <p className="text-xs text-gray-500">Round closes</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(round.close_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(round.close_date), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
