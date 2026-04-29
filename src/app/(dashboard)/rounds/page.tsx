import Link from "next/link";
import { getRoundDashboard } from "@/actions/round-dashboard";
import { Plus, Rocket, Share2, Pencil, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

function fmt(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount}`;
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

function FunnelRow({ label, count, max, fill }: { label: string; count: number; max: number; fill: string }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5 mb-2">
      <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-6 rounded-md bg-gray-50 relative overflow-hidden">
        <div className="h-full rounded-md" style={{ width: `${pct}%`, background: fill }} />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">{count}</span>
      </div>
    </div>
  );
}

export default async function RoundsPage() {
  const data = isPreview ? null : await getRoundDashboard().catch(() => null);

  if (!data || !data.round) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>My Round</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your fundraising round</p>
          </div>
          <Link
            href="/rounds/new"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}
          >
            <Plus className="h-4 w-4" />
            Drop your round
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl mb-4" style={{ background: "rgba(80,200,120,0.1)" }}>
            <Rocket className="h-6 w-6" style={{ color: "#2A9D5C" }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: "#0F1A2E" }}>No live round yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Drop your round to get in front of pre-seed and seed investors. We track every view, deck open, and commit in real time.
          </p>
        </div>
      </div>
    );
  }

  const { round, company_name, stage, kpis, pipeline_funnel, eyes, activity, committed_investors } = data;
  const pct = round.raise_amount > 0 ? (round.amount_raised / round.raise_amount) * 100 : 0;
  const dailyNeeded = kpis.days_left > 0 ? kpis.remaining / kpis.days_left : 0;
  const maxFunnel = Math.max(pipeline_funnel.viewing, pipeline_funnel.deck_shared, 1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>My round</p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>
              {company_name}{stage ? ` · ${stage}` : ""}
            </h1>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={
                round.status === "live"
                  ? { background: "rgba(80,200,120,0.15)", color: "#2A9D5C" }
                  : { background: "#f3f4f6", color: "#6b7280" }
              }
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full" style={{ background: round.status === "live" ? "#50C878" : "#9ca3af" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: round.status === "live" ? "#50C878" : "#9ca3af" }} />
              </span>
              {round.status[0].toUpperCase() + round.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {fmt(round.raise_amount)} {round.instrument_type.toUpperCase()}
            {round.valuation_cap ? ` · ${fmt(round.valuation_cap)} post-money cap` : ""}
            {round.discount_percent ? ` · ${round.discount_percent}% discount` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <Link
            href={`/rounds/${round.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Close round
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Raised" value={fmt(kpis.raised)} sub={kpis.weekly_raised > 0 ? `+${fmt(kpis.weekly_raised)} this week` : undefined} color="#2A9D5C" />
        <Kpi label="Target" value={fmt(kpis.target)} sub={`${Math.round(pct)}% of goal`} />
        <Kpi label="Remaining" value={fmt(kpis.remaining)} />
        <Kpi label="Investors" value={`${kpis.investor_count}`} sub={kpis.weekly_new_investors > 0 ? `+${kpis.weekly_new_investors} this week` : undefined} color="#2A9D5C" />
        <Kpi label="Days left" value={`${kpis.days_left}`} sub={`Closes ${new Date(round.close_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`} />
        <Kpi label="Watching" value={`${kpis.watching}`} sub={kpis.weekly_unique_viewers > 0 ? `${kpis.weekly_unique_viewers} unique this week` : undefined} color="#2E6BAD" />
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Round progress</h2>
            <p className="text-xs text-gray-500 mt-0.5">{fmt(kpis.raised)} of {fmt(kpis.target)} committed</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold leading-none" style={{ color: "#0F1A2E" }}>{Math.round(pct)}%</p>
            <p className="text-[11px] text-gray-500">filled</p>
          </div>
        </div>
        <div className="h-3.5 rounded-full bg-gray-100 overflow-hidden relative">
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: "linear-gradient(90deg, #E8C026, #50C878)" }} />
          <div className="absolute top-0 bottom-0" style={{ left: "33.3%", width: "2px", background: "rgba(0,0,0,0.1)" }} />
          <div className="absolute top-0 bottom-0" style={{ left: "66.6%", width: "2px", background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
          <span>$0</span>
          <span>{fmt(kpis.target * 0.33)} · lead</span>
          <span>{fmt(kpis.target * 0.66)} · momentum</span>
          <span>{fmt(kpis.target)} · close</span>
        </div>
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs font-semibold" style={{ color: "#0F1A2E" }}>{kpis.days_left} days remaining</p>
              <p className="text-[11px] text-gray-500">
                Opened {formatDistanceToNow(new Date(round.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          {kpis.days_left > 0 && kpis.remaining > 0 ? (
            <div className="text-right">
              <p className="text-xs font-semibold" style={{ color: "#D4A017" }}>
                {fmt(dailyNeeded)} / day needed to close
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Two-column: Investors + Right sidebar */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Investors committed</h2>
              <p className="text-xs text-gray-500 mt-0.5">{committed_investors.length} checks</p>
            </div>
            <button className="text-xs font-semibold text-gray-600 hover:text-gray-900 inline-flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add check
            </button>
          </div>
          {committed_investors.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
              <p className="text-sm font-semibold text-gray-700">No commits yet</p>
              <p className="text-xs text-gray-500 mt-1">Log your first check above as soon as an investor commits.</p>
            </div>
          ) : (
            committed_investors.map((c) => (
              <div key={c.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-xs shrink-0" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#0F1A2E" }}>
                    {c.name}
                    {c.is_lead ? (
                      <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded" style={{ background: "rgba(80,200,120,0.15)", color: "#2A9D5C" }}>
                        LEAD
                      </span>
                    ) : null}
                  </p>
                  <p className="text-[11px] text-gray-500">{c.gp ? `${c.gp} · ` : ""}Committed {new Date(c.committed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{fmt(c.amount)}</p>
                  <p className="text-[10px] text-gray-500">{c.pct.toFixed(1)}%</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold mb-3" style={{ color: "#0F1A2E" }}>Pipeline</h2>
            <FunnelRow label="Viewing" count={pipeline_funnel.viewing} max={maxFunnel} fill="rgba(46,107,173,0.18)" />
            <FunnelRow label="Deck shared" count={pipeline_funnel.deck_shared} max={maxFunnel} fill="rgba(232,192,38,0.25)" />
            <FunnelRow label="Deck opened" count={pipeline_funnel.deck_opened} max={maxFunnel} fill="rgba(232,192,38,0.4)" />
            <FunnelRow label="Meeting" count={pipeline_funnel.meeting} max={maxFunnel} fill="rgba(80,200,120,0.3)" />
            <FunnelRow label="Committed" count={pipeline_funnel.committed} max={maxFunnel} fill="linear-gradient(90deg, #E8C026, #50C878)" />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Eyes on you</h2>
                <p className="text-xs text-gray-500 mt-0.5">Last 7 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold leading-none" style={{ color: "#0F1A2E" }}>{eyes.last7_total}</p>
                {eyes.delta_pct !== 0 ? (
                  <p className="text-[11px] font-semibold" style={{ color: eyes.delta_pct > 0 ? "#2A9D5C" : "#dc2626" }}>
                    {eyes.delta_pct > 0 ? "↑" : "↓"} {Math.abs(eyes.delta_pct)}%
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-16 mt-4">
              {eyes.daily.map((v, i) => {
                const max = Math.max(...eyes.daily, 1);
                const isToday = i === eyes.daily.length - 1;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{
                      height: `${(v / max) * 100}%`,
                      background: isToday ? "linear-gradient(180deg, #50C878, #2A9D5C)" : "#e5e7eb",
                      minHeight: "4px",
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Unique</p>
                <p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{eyes.last7_unique}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Deck opens</p>
                <p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{eyes.deck_opens}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Repeat</p>
                <p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{eyes.repeat_visits}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Recent activity</h2>
          <Link href="/notifications" className="text-xs font-semibold" style={{ color: "#2E6BAD" }}>View all</Link>
        </div>
        {activity.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
            <TrendingUp className="mx-auto h-6 w-6 text-gray-300 mb-1" />
            <p className="text-sm text-gray-500">No activity yet — share your round to start tracking views and commits.</p>
          </div>
        ) : (
          activity.map((a, i) => {
            const dotColor =
              a.type === "committed" ? "#50C878" :
              a.type === "call_booked" ? "#D4A017" :
              a.type === "deck_download" || a.type === "deck_view" || a.type === "profile_view" ? "#2E6BAD" :
              "#6b7280";
            return (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: dotColor }} />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "#0F1A2E" }}>
                    <strong>{a.name}</strong> {a.detail}
                    {a.amount ? <strong> {fmt(a.amount)}</strong> : null}
                  </p>
                  <p className="text-[11px] text-gray-500">{formatDistanceToNow(new Date(a.when), { addSuffix: true })}</p>
                </div>
                {a.amount ? (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(80,200,120,0.12)", color: "#2A9D5C" }}>
                    +{fmt(a.amount)}
                  </span>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
