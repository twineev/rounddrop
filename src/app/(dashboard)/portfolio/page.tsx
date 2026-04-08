import Link from "next/link";
import { Briefcase, TrendingUp, ExternalLink } from "lucide-react";

const MOCK_PORTFOLIO = [
  {
    id: "port-1",
    company_name: "Nudge Health",
    sector: "Health / Biotech",
    round: "Pre-Seed",
    check_size: 25000,
    invested_date: "2026-03-20",
    status: "active",
    current_raise: "$800K",
    valuation_cap: "$8M",
    founder: "Priya Patel",
    notes: "Strong traction with 14 clinic clients, -60% no-show rate impact",
  },
  {
    id: "port-2",
    company_name: "DataForge",
    sector: "Developer Tools",
    round: "Seed",
    check_size: 50000,
    invested_date: "2025-11-10",
    status: "active",
    current_raise: "$2M",
    valuation_cap: "$15M",
    founder: "Wei Zhang",
    notes: "Real-time data pipeline for ML teams. $85K ARR, 12 enterprise clients",
  },
  {
    id: "port-3",
    company_name: "GreenRoute",
    sector: "Climate / Energy",
    round: "Pre-Seed",
    check_size: 15000,
    invested_date: "2025-08-05",
    status: "exited",
    current_raise: "$500K",
    valuation_cap: "$5M",
    founder: "Lena Müller",
    notes: "Acquired by Convoy in Q1 2026. 3.2x return.",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  exited: "bg-purple-50 text-purple-700",
  write_off: "bg-red-50 text-red-600",
};

export default function PortfolioPage() {
  const totalInvested = MOCK_PORTFOLIO.reduce((sum, p) => sum + p.check_size, 0);
  const activeCount = MOCK_PORTFOLIO.filter((p) => p.status === "active").length;
  const exitedCount = MOCK_PORTFOLIO.filter((p) => p.status === "exited").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-green-600 mb-1">Portfolio</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Your investments</h1>
        <p className="text-gray-500 text-sm mt-1">Track your portfolio companies and returns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Invested", value: `$${totalInvested.toLocaleString()}`, icon: Briefcase },
          { label: "Companies", value: MOCK_PORTFOLIO.length.toString(), icon: TrendingUp },
          { label: "Active", value: activeCount.toString(), icon: TrendingUp },
          { label: "Exited", value: exitedCount.toString(), icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 mb-3">
              <stat.icon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Portfolio List */}
      <div className="space-y-3">
        {MOCK_PORTFOLIO.map((company) => (
          <div key={company.id} className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{company.company_name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[company.status]}`}>
                    {company.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{company.sector}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">${company.check_size.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{company.round}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-3">
              <div>
                <span className="text-xs text-gray-500">Founder</span>
                <p className="text-sm font-medium text-gray-900">{company.founder}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Round Size</span>
                <p className="text-sm font-medium text-gray-900">{company.current_raise}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Val Cap</span>
                <p className="text-sm font-medium text-gray-900">{company.valuation_cap}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Invested</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(company.invested_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 border-t border-gray-100 pt-3">{company.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
