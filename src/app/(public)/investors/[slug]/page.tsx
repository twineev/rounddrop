import { notFound } from "next/navigation";
import Link from "next/link";
import { getInvestorBySlug } from "@/actions/investors";
import { ShareDeckDialog } from "@/components/investors/share-deck-dialog";
import { AddToPipelineButton } from "@/components/pipeline/add-to-pipeline-button";
import { MOCK_INVESTORS } from "@/lib/mock-data";
import { INVESTOR_TYPES, STAGE_PREFERENCES } from "@/lib/constants";
import { getMutualConnections } from "@/actions/connections";
import {
  ArrowLeft,
  Building2,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Layers,
  Link2,
  MapPin,
  Target,
  Users,
  Briefcase,
} from "lucide-react";

const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

interface InvestorDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatCheckSize(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export default async function InvestorDetailPage({ params }: InvestorDetailPageProps) {
  const { slug } = await params;
  let investor: any = null;

  if (isPreview) {
    investor = MOCK_INVESTORS.find((inv) => inv.slug === slug);
  } else {
    try {
      investor = await getInvestorBySlug(slug);
    } catch {
      // Not found
    }
  }

  if (!investor) {
    notFound();
  }

  // Mutual connections (if signed in and investor has a linked profile)
  const mutuals = investor.profile_id
    ? await getMutualConnections(investor.profile_id).catch(() => ({ mutuals: [], knowsDirectly: false, count: 0 }))
    : { mutuals: [], knowsDirectly: false, count: 0 };

  const investorTypeLabel =
    INVESTOR_TYPES.find((t) => t.value === investor.investor_type)?.label ||
    investor.investor_type;
  const stages = investor.stage_preference
    .map((s: string) => STAGE_PREFERENCES.find((sp) => sp.value === s)?.label || s)
    .join(", ");

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/investors"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to directory
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50">
                <Building2 className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-gray-900">
                    {investor.firm_name || "Independent"}
                  </h1>
                </div>
                {investor.gp_name && (
                  <p className="text-sm text-gray-500 mt-0.5">{investor.gp_name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <ShareDeckDialog
                investorProfileId={investor.id}
                investorName={investor.firm_name || investor.gp_name || "Investor"}
                isPreview={isPreview}
              />
              <AddToPipelineButton
                investorProfileId={investor.id}
                isPreview={isPreview}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Key Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <DollarSign className="h-3.5 w-3.5" />
                Check Size
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatCheckSize(investor.check_size_min)} -{" "}
                {formatCheckSize(investor.check_size_max)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Briefcase className="h-3.5 w-3.5" />
                Type
              </div>
              <p className="text-sm font-bold text-gray-900">{investorTypeLabel}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Layers className="h-3.5 w-3.5" />
                Stage
              </div>
              <p className="text-sm font-bold text-gray-900">{stages}</p>
            </div>
          </div>

          {/* Thesis */}
          {investor.thesis && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Investment Thesis
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {investor.thesis}
              </p>
            </div>
          )}

          {/* Sectors */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Sectors</h3>
            <div className="flex flex-wrap gap-1.5">
              {investor.sectors.map((sector: string) => (
                <span
                  key={sector}
                  className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>

          {/* Mutual connections */}
          {(mutuals.count > 0 || mutuals.knowsDirectly) && (
            <div className="rounded-lg p-3 flex items-center gap-2" style={{ background: "rgba(46,107,173,0.08)", color: "#1B3A5C" }}>
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

          {/* Location + Years investing */}
          {(investor.location || investor.years_investing) && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {investor.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {investor.location}
                </span>
              )}
              {investor.years_investing && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {investor.years_investing} {investor.years_investing === 1 ? "year" : "years"} investing
                </span>
              )}
            </div>
          )}

          {/* Main markets */}
          {investor.main_markets && investor.main_markets.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Main markets</h3>
              <div className="flex flex-wrap gap-1.5">
                {investor.main_markets.map((market: string) => (
                  <span key={market} className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}>
                    {market}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Deck criteria */}
          {investor.deck_criteria && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-400" />
                What I look for in a pitch deck
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {investor.deck_criteria}
              </p>
            </div>
          )}

          {/* Founder assessment */}
          {investor.founder_assessment && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
                How I assess founders & companies
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {investor.founder_assessment}
              </p>
            </div>
          )}

          {/* Recent checks */}
          {investor.recent_checks && Array.isArray(investor.recent_checks) && investor.recent_checks.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Recent checks</h3>
              <div className="space-y-2">
                {(investor.recent_checks as Array<{ company_name: string; amount?: string; stage?: string; date?: string; note?: string }>).map((check, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-3 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{check.company_name}</p>
                      {check.note && <p className="text-xs text-gray-500 mt-0.5">{check.note}</p>}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      {check.stage && <span className="rounded-full bg-white border border-gray-200 px-2 py-0.5">{check.stage}</span>}
                      {check.amount && <span className="font-semibold text-gray-700">{check.amount}</span>}
                      {check.date && <span>{check.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Value Add */}
          {investor.value_add && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Value add</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {investor.value_add}
              </p>
            </div>
          )}

          {/* Notable Exits */}
          {investor.notable_exits && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Notable Exits
              </h3>
              <p className="text-sm text-gray-600">{investor.notable_exits}</p>
            </div>
          )}

          {/* Portfolio Companies */}
          {investor.portfolio_companies && investor.portfolio_companies.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Portfolio ({investor.portfolio_companies.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {investor.portfolio_companies.map((company: any) => (
                  <span
                    key={company.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700"
                  >
                    {company.company_name}
                    {company.round && (
                      <span className="text-gray-400 ml-1">({company.round})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
            {investor.linkedin_url && (
              <a
                href={investor.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors"
              >
                <Link2 className="h-3.5 w-3.5" />
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {investor.fund_website && (
              <a
                href={investor.fund_website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {investor.twitter_url && (
              <a
                href={investor.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors"
              >
                <Link2 className="h-3.5 w-3.5" />
                Twitter
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
