import { notFound } from "next/navigation";
import Link from "next/link";
import { getInvestorBySlug } from "@/actions/investors";
import { ShareDeckDialog } from "@/components/investors/share-deck-dialog";
import { ClaimProfileButton } from "@/components/investors/claim-profile-button";
import { AddToPipelineButton } from "@/components/pipeline/add-to-pipeline-button";
import { MOCK_INVESTORS } from "@/lib/mock-data";
import { INVESTOR_TYPES, STAGE_PREFERENCES } from "@/lib/constants";
import {
  ArrowLeft,
  Building2,
  DollarSign,
  ExternalLink,
  Globe,
  Layers,
  Link2,
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
                  {!investor.is_claimed && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                      Unclaimed
                    </span>
                  )}
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
              {!investor.is_claimed && (
                <ClaimProfileButton
                  investorProfileId={investor.id}
                  firmName={investor.firm_name || "this investor"}
                  isPreview={isPreview}
                />
              )}
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

          {/* Value Add */}
          {investor.value_add && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Value Add</h3>
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
