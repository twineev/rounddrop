import { notFound } from "next/navigation";
import Link from "next/link";
import { getFounderBySlug } from "@/actions/founder-public";
import { getMutualConnections } from "@/actions/connections";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  Mail,
  Play,
  TrendingUp,
  Users,
} from "lucide-react";

interface FounderPageProps {
  params: Promise<{ slug: string }>;
}

function formatMoney(amount: number | null | undefined): string | null {
  if (amount == null) return null;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export default async function FounderProfilePage({ params }: FounderPageProps) {
  const { slug } = await params;
  const founder = await getFounderBySlug(slug);
  if (!founder) notFound();

  const mutuals = await getMutualConnections(founder.profile_id).catch(() => ({
    mutuals: [],
    knowsDirectly: false,
    count: 0,
  }));

  const growth = (founder.growth_numbers as Record<string, string | number>) || {};
  const growthEntries = Object.entries(growth).filter(([, v]) => v != null && v !== "");

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Header card */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4 flex-wrap">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl text-white font-bold text-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}
            >
              {(founder.company_name || "?").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold" style={{ color: "#0F1A2E" }}>
                {founder.company_name}
              </h1>
              {founder.full_name && (
                <p className="text-sm text-gray-600 mt-1">
                  Founded by <span className="font-semibold">{founder.full_name}</span>
                  {founder.year_founded ? ` · ${founder.year_founded}` : ""}
                </p>
              )}
              {founder.one_liner && (
                <p className="text-base text-gray-700 mt-2">{founder.one_liner}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {founder.stage && (
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: "rgba(232,192,38,0.15)", color: "#D4A017" }}>
                    {founder.stage}
                  </span>
                )}
                {(founder.sector || []).map((s: string) => (
                  <span key={s} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mutual connections */}
          {(mutuals.count > 0 || mutuals.knowsDirectly) && (
            <div className="mt-4 rounded-lg p-3 flex items-center gap-2" style={{ background: "rgba(46,107,173,0.08)", color: "#1B3A5C" }}>
              <Users className="h-4 w-4" style={{ color: "#2E6BAD" }} />
              <p className="text-sm">
                {mutuals.knowsDirectly && (
                  <span className="font-semibold">You&apos;re connected on LinkedIn</span>
                )}
                {mutuals.knowsDirectly && mutuals.count > 0 && <span> · </span>}
                {mutuals.count > 0 && (
                  <>
                    <span className="font-semibold">{mutuals.count} mutual connection{mutuals.count === 1 ? "" : "s"}</span>
                    {mutuals.mutuals.length > 0 && (
                      <span className="text-gray-600">
                        {" "}— {mutuals.mutuals.map((m) => m.full_name).filter(Boolean).slice(0, 3).join(", ")}
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {founder.calendar_link && (
              <a
                href={founder.calendar_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-105"
                style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}
              >
                <Calendar className="h-4 w-4" />
                Book a call
              </a>
            )}
            {founder.linkedin_url && (
              <a
                href={founder.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300"
              >
                <Link2 className="h-4 w-4" />
                LinkedIn
              </a>
            )}
            {founder.company_website && (
              <a
                href={founder.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {founder.description && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">About</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{founder.description}</p>
            </div>
          )}

          {/* Intro video */}
          {founder.intro_video_url && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Intro video</h2>
              <a
                href={founder.intro_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-all w-full md:w-auto"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-white shrink-0" style={{ background: "#2E6BAD" }}>
                  <Play className="h-4 w-4 fill-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Watch intro from the founder</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {new URL(founder.intro_video_url).hostname}
                    <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              </a>
            </div>
          )}

          {/* Metrics */}
          {(founder.mrr || founder.arr || growthEntries.length > 0) && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Traction</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {founder.mrr != null && (
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      MRR
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-1">{formatMoney(founder.mrr)}</p>
                  </div>
                )}
                {founder.arr != null && (
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      ARR
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-1">{formatMoney(founder.arr)}</p>
                  </div>
                )}
                {growthEntries.map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-500 capitalize">{k.replace(/_/g, " ")}</div>
                    <p className="text-lg font-bold text-gray-900 mt-1">{String(v)}</p>
                  </div>
                ))}
              </div>
              {founder.traction_notes && (
                <p className="text-sm text-gray-700 mt-3 whitespace-pre-line">{founder.traction_notes}</p>
              )}
            </div>
          )}

          {/* Documents */}
          {(founder.pitch_deck_url || founder.onepager_url) && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Documents</h2>
              <div className="flex flex-wrap gap-2">
                {founder.pitch_deck_url && (
                  <a
                    href={founder.pitch_deck_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
                  >
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Pitch deck</span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </a>
                )}
                {founder.onepager_url && (
                  <a
                    href={founder.onepager_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
                  >
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">One-pager</span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Get in touch</h2>
            <p className="text-sm text-gray-600">
              {founder.best_contact_method === "calendar" && founder.calendar_link
                ? "Prefers a direct booking — use the Book a call button above."
                : founder.best_contact_method === "linkedin" && founder.linkedin_url
                ? "Best reached via LinkedIn."
                : "Reach out through any of the channels above."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
