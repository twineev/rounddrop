import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { Briefcase, TrendingUp, Plus, Download, Flame } from "lucide-react";

const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

const SECTOR_COLORS: Record<string, string> = {
  "AI/ML": "linear-gradient(135deg, #E8C026, #50C878)",
  SaaS: "#2E6BAD",
  Fintech: "#D4A017",
  Healthcare: "#2A9D5C",
  "Dev Tools": "#1B3A5C",
  Climate: "#0891b2",
  Consumer: "#7c3aed",
  EdTech: "#6b7280",
  default: "#6b7280",
};

function fmt(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Kpi({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold leading-none" style={{ color: "#0F1A2E" }}>{value}</p>
      {sub ? <p className="mt-1.5 text-[11px] font-medium" style={{ color: color || "#6b7280" }}>{sub}</p> : null}
    </div>
  );
}

export default async function PortfolioPage() {
  if (isPreview) {
    return <div className="mx-auto max-w-2xl"><p className="text-sm text-gray-500">Portfolio is disabled in preview mode.</p></div>;
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();
  if (!profile) redirect("/onboarding");

  const { data: investorProfile } = await supabase
    .from("investor_profiles")
    .select("id, firm_name, gp_name")
    .eq("profile_id", profile.id)
    .single();

  const portfolio = investorProfile
    ? (await supabase
        .from("portfolio_companies")
        .select("*")
        .eq("investor_profile_id", investorProfile.id)
        .order("year", { ascending: false })).data || []
    : [];

  const total_deployed = portfolio.reduce((s, c) => s + (c.check_size || 0), 0);
  const active = portfolio.filter((c) => c.status === "active");
  const exited = portfolio.filter((c) => c.status === "exited");
  const writeoffs = portfolio.filter((c) => c.status === "write_off");
  const avg_check = portfolio.length > 0 ? Math.round(total_deployed / portfolio.length) : 0;

  // Allocation by stage
  const stageAlloc: Record<string, { count: number; total: number }> = {};
  for (const c of portfolio) {
    const stage = c.round || "Other";
    if (!stageAlloc[stage]) stageAlloc[stage] = { count: 0, total: 0 };
    stageAlloc[stage].count++;
    stageAlloc[stage].total += c.check_size || 0;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>My investments</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>
            Portfolio{investorProfile?.firm_name ? ` · ${investorProfile.firm_name}` : ""}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {active.length} active investments · {fmt(total_deployed)} deployed
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
            <Plus className="h-3.5 w-3.5" />
            Log new check
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Total deployed" value={fmt(total_deployed)} />
        <Kpi label="Active" value={`${active.length}`} sub={`${exited.length} exited · ${writeoffs.length} writeoff`} />
        <Kpi label="Avg check" value={fmt(avg_check)} />
        <Kpi label="Companies" value={`${portfolio.length}`} />
        <Kpi label="Exits" value={`${exited.length}`} color="#2A9D5C" />
        <Kpi label="Write-offs" value={`${writeoffs.length}`} color={writeoffs.length > 0 ? "#dc2626" : undefined} />
      </div>

      {/* By stage */}
      {Object.keys(stageAlloc).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-3" style={{ color: "#0F1A2E" }}>By stage</h2>
          {Object.entries(stageAlloc).map(([stage, v]) => {
            const pct = total_deployed > 0 ? (v.total / total_deployed) * 100 : 0;
            return (
              <div key={stage} className="mb-2 flex items-center gap-3">
                <span className="text-xs text-gray-500 w-24 shrink-0">{stage}</span>
                <div className="flex-1 h-7 rounded-md bg-gray-50 relative overflow-hidden">
                  <div className="h-full rounded-md" style={{ width: `${pct}%`, background: "rgba(232,192,38,0.4)" }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">
                    {v.count} · {fmt(v.total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Portfolio table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Portfolio companies</h2>
            <p className="text-xs text-gray-500 mt-0.5">{portfolio.length} total · {active.length} active · {exited.length} exited · {writeoffs.length} write-off</p>
          </div>
        </div>

        {portfolio.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">No portfolio companies yet</p>
            <p className="text-xs text-gray-500 mt-1">Log your first check to start tracking your portfolio.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Header row */}
            <div className="hidden md:grid grid-cols-[1.6fr_0.8fr_0.7fr_0.6fr_0.9fr_0.8fr] gap-3 px-5 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <div>Company</div>
              <div>Stage / Date</div>
              <div>Sector</div>
              <div className="text-right">Check</div>
              <div className="text-right">Status</div>
              <div className="text-right">Year</div>
            </div>
            {portfolio.map((c) => {
              const status = c.status || "active";
              const statusColor =
                status === "exited" ? { background: "#f3f4f6", color: "#4b5563" } :
                status === "write_off" ? { background: "#fef2f2", color: "#dc2626" } :
                { background: "rgba(80,200,120,0.12)", color: "#2A9D5C" };
              const sectorBg = "#6b7280";
              return (
                <div key={c.id} className="grid grid-cols-1 md:grid-cols-[1.6fr_0.8fr_0.7fr_0.6fr_0.9fr_0.8fr] gap-3 px-5 py-3 items-center hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-extrabold text-xs shrink-0" style={{ background: sectorBg }}>
                      {initials(c.company_name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: "#0F1A2E" }}>{c.company_name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#0F1A2E" }}>{c.round || "—"}</p>
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">—</span>
                  </div>
                  <div className="md:text-right">
                    <p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{c.check_size ? fmt(c.check_size) : "—"}</p>
                  </div>
                  <div className="md:text-right">
                    <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize" style={statusColor}>
                      {status === "write_off" ? "Write-off" : status}
                    </span>
                  </div>
                  <div className="md:text-right text-[11px] text-gray-500">{c.year || "—"}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-bold mb-3" style={{ color: "#0F1A2E" }}>Recent portfolio activity</h2>
        <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
          <TrendingUp className="mx-auto h-6 w-6 text-gray-300 mb-1" />
          <p className="text-sm text-gray-500">Portfolio updates from your companies will appear here.</p>
        </div>
      </div>
    </div>
  );
}
