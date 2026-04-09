import Link from "next/link";
import { Building2, DollarSign, Layers } from "lucide-react";
import { INVESTOR_TYPES, STAGE_PREFERENCES } from "@/lib/constants";

interface InvestorCardProps {
  investor: {
    id: string;
    firm_name: string | null;
    gp_name: string | null;
    investor_type: string;
    check_size_min: number;
    check_size_max: number;
    sectors: string[];
    stage_preference: string[];
    thesis: string | null;
    is_claimed: boolean;
    slug: string | null;
    portfolio_companies?: { id: string; company_name: string }[];
  };
}

function formatCheckSize(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export function InvestorCard({ investor }: InvestorCardProps) {
  const investorTypeLabel =
    INVESTOR_TYPES.find((t) => t.value === investor.investor_type)?.label ||
    investor.investor_type;
  const stages = investor.stage_preference
    .map((s) => STAGE_PREFERENCES.find((sp) => sp.value === s)?.label || s)
    .join(", ");

  return (
    <Link href={`/investors/${investor.slug}`}>
      <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                {investor.firm_name || "Independent"}
              </h3>
              {investor.gp_name && (
                <p className="text-xs text-gray-500">{investor.gp_name}</p>
              )}
            </div>
          </div>
          {!investor.is_claimed && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
              Unclaimed
            </span>
          )}
        </div>

        {investor.thesis && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {investor.thesis}
          </p>
        )}

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <DollarSign className="h-3.5 w-3.5" />
            <span>
              {formatCheckSize(investor.check_size_min)} -{" "}
              {formatCheckSize(investor.check_size_max)}
            </span>
            <span className="mx-1 text-gray-300">|</span>
            <span>{investorTypeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Layers className="h-3.5 w-3.5" />
            <span>{stages}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {investor.sectors.slice(0, 3).map((sector) => (
              <span
                key={sector}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {sector}
              </span>
            ))}
            {investor.sectors.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                +{investor.sectors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
