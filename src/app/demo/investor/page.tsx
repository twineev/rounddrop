"use client";

import { useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import {
  Briefcase, Users, Building2, MessageSquare, Bell, User, Calendar, BookOpen,
  ShieldCheck, Plus, Download, Eye, Send, UserPlus, Star, Sparkles, Link2,
  TrendingUp, Flame, ExternalLink, Upload, MapPin, Video, FileText,
} from "lucide-react";

const TABS = [
  { id: "investments", label: "My Investments", Icon: Briefcase },
  { id: "deals", label: "Deal Feed", Icon: TrendingUp },
  { id: "profile", label: "Profile", Icon: User },
  { id: "connections", label: "Connections", Icon: Users },
  { id: "messages", label: "Messages", Icon: MessageSquare, badge: 3 },
  { id: "notifications", label: "Notifications", Icon: Bell, badge: 2 },
  { id: "events", label: "Events", Icon: Calendar },
  { id: "resources", label: "Resources", Icon: BookOpen },
] as const;
type TabId = (typeof TABS)[number]["id"];

const demo = (label: string) => () => toast(`Demo mode — would ${label}`, { description: "Sign up to use the real action." });
const fmt = (a: number) => a >= 1_000_000 ? `$${(a / 1_000_000).toFixed(2).replace(/\.00$/, "")}M` : a >= 1_000 ? `$${Math.round(a / 1_000)}K` : `$${a}`;

function VerifiedPill() {
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}><ShieldCheck className="h-3 w-3" /> Verified</span>;
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

export default function InvestorDemo() {
  const [tab, setTab] = useState<TabId>("investments");
  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-[calc(100vh-44px)]">
      <Toaster position="top-right" />
      <aside className="border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-5 border-b border-gray-200">
          <span className="flex items-center gap-1.5 text-base font-bold" style={{ color: "#0F1A2E" }}>Round<span style={{ color: "#50C878" }}>Drop</span></span>
          <Link href="/demo/founder" className="rounded-md px-2 py-1 text-[10px] font-bold" style={{ background: "#f3f4f6", color: "#6b7280" }}>Switch to founder →</Link>
        </div>
        <nav className="space-y-1 p-3">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium" style={active ? { background: "rgba(46,107,173,0.1)", color: "#2E6BAD" } : { color: "#6b7280" }}>
                <t.Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{t.label}</span>
                {"badge" in t && t.badge ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">{t.badge}</span> : null}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="overflow-y-auto p-5 md:p-7">
        {tab === "investments" && <InvestmentsView />}
        {tab === "deals" && <DealsView />}
        {tab === "profile" && <ProfileView />}
        {tab === "connections" && <ConnectionsView />}
        {tab === "messages" && <MessagesView />}
        {tab === "notifications" && <NotificationsView />}
        {tab === "events" && <EventsView />}
        {tab === "resources" && <ResourcesView />}
      </main>
    </div>
  );
}

function InvestmentsView() {
  const portfolio = [
    { i: "TH", c: "linear-gradient(135deg, #E8C026, #50C878)", name: "Tavita Health", desc: "AI scribes for telehealth", stage: "Seed", date: "Mar 2026", sector: "Healthcare", check: 500_000, val: "$22M ↑ 2.4×", status: "Active" },
    { i: "RF", c: "#2E6BAD", name: "Rook Finance", desc: "Compliance for neobanks", stage: "Pre-Seed", date: "Feb 2026", sector: "Fintech", check: 250_000, val: "$11M ↑ 1.8×", status: "Active" },
    { i: "AL", c: "#D4A017", name: "Arcadia Labs", desc: "Dev tools for Rust embedded", stage: "Pre-Seed", date: "Jan 2026", sector: "Dev Tools", check: 350_000, val: "$15M ↑ 3.0×", status: "Active" },
    { i: "LM", c: "#50C878", name: "Lumen Models", desc: "Open-weight foundation models", stage: "Seed", date: "Nov 2025", sector: "AI/ML", check: 300_000, val: "$28M ↑ 4.7×", status: "Hot" },
    { i: "QI", c: "#1B3A5C", name: "Quill Insights", desc: "AI legal research", stage: "Pre-Seed", date: "Oct 2025", sector: "AI/ML", check: 200_000, val: "$8M flat", status: "Active" },
    { i: "VS", c: "linear-gradient(135deg, #2A9D5C, #5BA4E6)", name: "Vaultic Supply", desc: "Supply chain risk intel", stage: "Seed", date: "Aug 2025", sector: "SaaS", check: 250_000, val: "$18M ↑ 2.1×", status: "Active" },
    { i: "NH", c: "#7c3aed", name: "Nudge Health", desc: "Patient no-show reduction", stage: "Pre-Seed", date: "Jul 2025", sector: "Healthcare", check: 150_000, val: "$6M ↑ 1.5×", status: "Active" },
    { i: "GT", c: "#dc2626", name: "Gridtide Energy", desc: "Battery arbitrage marketplace", stage: "Pre-Seed", date: "Jun 2025", sector: "Climate", check: 175_000, val: "$9M ↑ 2.0×", status: "Active" },
    { i: "SP", c: "#0891b2", name: "Slate Protocol", desc: "Identity infra for AI agents", stage: "Pre-Seed", date: "May 2025", sector: "AI/ML", check: 100_000, val: "$12M ↑ 4.0×", status: "Follow-on" },
    { i: "CT", c: "#f59e0b", name: "CapTable.io", desc: "Cap table mgmt for solos", stage: "Pre-Seed", date: "Nov 2024", sector: "Fintech", check: 190_000, val: "$22M ↑ 7.5×", status: "Hot" },
    { i: "PT", c: "#6b7280", name: "Parsetree", desc: "Data pipelines for ML", stage: "Series A", date: "Aug 2024", sector: "SaaS", check: 250_000, val: "Acquired 5.4×", status: "Exited" },
    { i: "OL", c: "#525252", name: "Olive Labs", desc: "Marketplace for tutors", stage: "Pre-Seed", date: "Mar 2024", sector: "EdTech", check: 50_000, val: "Closed 0×", status: "Write-off" },
  ];
  const total = portfolio.reduce((s, p) => s + p.check, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>My investments</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Portfolio · Summit Seed Capital</h1>
          <p className="text-sm text-gray-500 mt-1">{portfolio.filter(p => p.status === "Active" || p.status === "Hot" || p.status === "Follow-on").length} active investments · {fmt(total)} deployed</p>
        </div>
        <div className="flex gap-2">
          <button onClick={demo("export portfolio CSV")} className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"><Download className="h-3.5 w-3.5" /> Export CSV</button>
          <button onClick={demo("log a new check")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}><Plus className="h-3.5 w-3.5" /> Log new check</button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Total deployed" value={fmt(total)} sub="+$650K this quarter" color="#2A9D5C" />
        <Kpi label="Active" value="9" sub="2 exited · 1 writeoff" />
        <Kpi label="Avg check" value={fmt(total / portfolio.length)} sub="Range: $50K – $500K" />
        <Kpi label="Markup" value="3.2×" sub="Top quartile pre-seed" color="#2A9D5C" />
        <Kpi label="Follow-ons due" value="2" sub="$300K reserved" color="#D4A017" />
        <Kpi label="DPI" value="0.18×" sub="2 partial exits" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>Allocation by sector</h2>
          <p className="text-xs text-gray-500 mb-4">Where the ${fmt(total)} went</p>
          <div className="flex h-9 rounded-lg overflow-hidden mb-4">
            <div style={{ width: "32%", background: "linear-gradient(135deg, #E8C026, #50C878)" }} className="flex items-center justify-center text-white text-xs font-bold">AI/ML 32%</div>
            <div style={{ width: "22%", background: "#2E6BAD" }} className="flex items-center justify-center text-white text-xs font-bold">SaaS 22%</div>
            <div style={{ width: "18%", background: "#D4A017" }} className="flex items-center justify-center text-white text-xs font-bold">Fintech 18%</div>
            <div style={{ width: "14%", background: "#2A9D5C" }} className="flex items-center justify-center text-white text-[11px] font-bold">Health</div>
            <div style={{ width: "14%", background: "#6b7280" }} className="flex items-center justify-center text-white text-[11px] font-bold">Other</div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>By stage</h2>
          <p className="text-xs text-gray-500 mb-4">Position at time of check</p>
          {[["Pre-Seed", 64, "7 · $1.45M"], ["Seed", 30, "3 · $750K"], ["Series A", 10, "1 · $250K"]].map(([l, w, c]) => (
            <div key={String(l)} className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-500 w-20">{l}</span>
              <div className="flex-1 h-6 rounded-md bg-gray-50 relative overflow-hidden">
                <div className="h-full rounded-md" style={{ width: `${w}%`, background: "rgba(232,192,38,0.4)" }} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">{c}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Portfolio companies</h2>
            <p className="text-xs text-gray-500 mt-0.5">{portfolio.length} total</p>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-[1.6fr_0.7fr_0.6fr_0.6fr_0.9fr_0.7fr] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <div>Company</div><div>Stage</div><div>Sector</div><div className="text-right">Check</div><div className="text-right">Last valuation</div><div className="text-right">Status</div>
        </div>
        {portfolio.map((p) => (
          <button key={p.name} onClick={demo(`open ${p.name} portfolio detail`)} className="w-full text-left grid grid-cols-1 md:grid-cols-[1.6fr_0.7fr_0.6fr_0.6fr_0.9fr_0.7fr] gap-3 px-4 py-3 items-center hover:bg-gray-50 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shrink-0" style={{ background: p.c }}>{p.i}</div>
              <div className="min-w-0"><p className="text-sm font-bold truncate" style={{ color: "#0F1A2E" }}>{p.name}</p><p className="text-[11px] text-gray-500 truncate">{p.desc}</p></div>
            </div>
            <div className="text-xs"><p className="font-semibold" style={{ color: "#0F1A2E" }}>{p.stage}</p><p className="text-[11px] text-gray-500">{p.date}</p></div>
            <div><span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{p.sector}</span></div>
            <div className="md:text-right"><p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{fmt(p.check)}</p></div>
            <div className="md:text-right text-xs">{p.val}</div>
            <div className="md:text-right">
              <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={
                p.status === "Active" ? { background: "rgba(80,200,120,0.12)", color: "#2A9D5C" } :
                p.status === "Hot" ? { background: "rgba(232,192,38,0.15)", color: "#D4A017" } :
                p.status === "Follow-on" ? { background: "rgba(46,107,173,0.1)", color: "#2E6BAD" } :
                p.status === "Exited" ? { background: "#f3f4f6", color: "#4b5563" } :
                { background: "#fef2f2", color: "#dc2626" }
              }>
                {p.status === "Hot" ? "🔥 Hot" : p.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DealsView() {
  const deals = [
    { name: "Arcana AI", desc: "AI-native legal research for solo practitioners", stage: "Pre-Seed", filled: 70, follows: 148, hot: false, closing: true, raise: "$1.2M", mrr: "$42K", growth: "3.8x MoM" },
    { name: "Vaultic", desc: "Supply chain risk intelligence for mid-market", stage: "Seed", filled: 45, follows: 94, raise: "$2.5M", arr: "$118K" },
    { name: "Nudge Health", desc: "Behavioral nudges that cut patient no-show rates by 60%", stage: "Pre-Seed", filled: 88, follows: 211, hot: true, raise: "$800K", impact: "-60% no-shows" },
    { name: "Lumen Models", desc: "Open-weight 7B foundation models", stage: "Seed", filled: 35, follows: 177, raise: "$3M" },
    { name: "Gridtide", desc: "Battery arbitrage marketplace for utilities", stage: "Pre-Seed", filled: 22, follows: 64, raise: "$650K" },
    { name: "Slate Protocol", desc: "Identity infra for AI agents", stage: "Pre-Seed", filled: 90, follows: 312, hot: true, raise: "$1.5M" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Deal feed</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Live rounds</h1>
        <p className="text-sm text-gray-500 mt-1">Founders raising right now.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <button key={d.name} onClick={demo(`open ${d.name} round`)} className="text-left rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{d.name}</h3>
              <div className="flex gap-1.5">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={d.stage === "Seed" ? { background: "rgba(80,200,120,0.15)", color: "#2A9D5C" } : { background: "rgba(232,192,38,0.15)", color: "#D4A017" }}>{d.stage}</span>
                {d.closing ? <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">Closing</span> : null}
                {d.hot ? <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">🔥</span> : null}
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">{d.desc}</p>
            <div className="flex gap-3 text-[10px] text-gray-500 mb-3">
              <div><span className="text-gray-400">Raise</span><p className="font-bold text-gray-900">{d.raise}</p></div>
              {d.mrr ? <div><span className="text-gray-400">MRR</span><p className="font-bold text-gray-900">{d.mrr}</p></div> : null}
              {d.arr ? <div><span className="text-gray-400">ARR</span><p className="font-bold text-gray-900">{d.arr}</p></div> : null}
              {d.growth ? <div><span className="text-gray-400">Growth</span><p className="font-bold text-gray-900">{d.growth}</p></div> : null}
              {d.impact ? <div><span className="text-gray-400">Impact</span><p className="font-bold text-gray-900">{d.impact}</p></div> : null}
            </div>
            <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden mb-2">
              <div className="h-full rounded-full" style={{ width: `${d.filled}%`, background: "linear-gradient(90deg, #E8C026, #50C878)" }} />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>{d.filled}% filled</span><span>{d.follows} follows</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Profile</p>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: "#0F1A2E" }}>Your profile <VerifiedPill /></h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-white font-extrabold text-2xl" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>TM</div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold" style={{ color: "#0F1A2E" }}>Tyler Moore</h2>
            <p className="text-sm text-gray-500">General Partner · Summit Seed Capital</p>
            <div className="mt-2 flex gap-2">
              <a href="#" onClick={(e) => { e.preventDefault(); demo("open LinkedIn in new tab")(); }} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700"><Link2 className="h-3 w-3" /> LinkedIn</a>
              <button onClick={demo("upload firm logo")} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700"><Upload className="h-3 w-3" /> Upload logo</button>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-4 text-sm">
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Email</p><p>tyler@summitseed.vc</p></div>
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Location</p><p>San Francisco, CA</p></div>
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Years investing</p><p>7</p></div>
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Check size</p><p className="font-bold">$100K – $750K</p></div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">What I look for in a pitch deck</p>
          <p className="text-sm text-gray-700 leading-relaxed">A sharp one-liner that lands in 15 seconds. A specific, numbered statement of what is broken today. Real distribution insight. A team slide that explains why YOU. Sharpest available signal of demand.</p>
        </div>
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">How I assess founders</p>
          <p className="text-sm text-gray-700 leading-relaxed">Two meetings. First is 30 minutes — I assess speed of thought and domain depth. Reference checks between meetings. Decision within 10 days.</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={demo("save profile changes")} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>Save profile</button>
        </div>
      </div>
    </div>
  );
}

function ConnectionsView() {
  const platform = [
    { i: "PN", c: "#50C878", n: "Priya Nair", r: "Founder · Nudge Health", d: "Apr 10" },
    { i: "TM", c: "linear-gradient(135deg, #E8C026, #50C878)", n: "Tyler Moore", r: "Founder · Arcana AI", d: "Apr 8" },
    { i: "MC", c: "#7c3aed", n: "Marcus Chen", r: "Founder · Vaultic Supply", d: "Apr 12" },
    { i: "EY", c: "#2E6BAD", n: "Elizabeth Yin", r: "GP · Hustle Fund", d: "Apr 14" },
    { i: "JP", c: "#be185d", n: "Jordan Park", r: "Founder · Lumen Labs", d: "Apr 9" },
    { i: "ET", c: "#1B3A5C", n: "Eric Tung", r: "Partner · Contrary", d: "Apr 15" },
  ];
  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Network</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Your connections</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: "#0F1A2E" }}>
          <Users className="h-4 w-4 text-gray-400" /> On RoundDrop
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">22</span>
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {platform.map((p) => (
            <div key={p.n} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white font-bold text-sm shrink-0" style={{ background: p.c }}>{p.i}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate flex items-center gap-1" style={{ color: "#0F1A2E" }}>{p.n} <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white" style={{ background: "#2E6BAD" }}><ShieldCheck className="h-2.5 w-2.5" /></span></p>
                <p className="text-xs text-gray-500 truncate">{p.r}</p>
                <p className="text-[10px] text-gray-400">Connected {p.d}</p>
              </div>
              <button onClick={demo(`message ${p.n}`)} className="rounded-lg border border-gray-200 px-2.5 py-1"><MessageSquare className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessagesView() {
  const threads = [
    { i: Send, c: "#2A9D5C", l: "Deck shared", n: "Tyler Moore · Arcana AI", p: "Sent you a deck — $750K SAFE @ $8M cap", t: "12m", unread: true, active: true },
    { i: Send, c: "#2A9D5C", l: "Deck shared", n: "Priya Nair · Nudge Health", p: "Pre-seed health AI — would love your read", t: "1h", unread: true },
    { i: UserPlus, c: "#2E6BAD", l: "Intro", n: "Marcus Chen · Vaultic", p: "Asked you to intro them to Garry Tan", t: "3h", unread: true },
    { i: MessageSquare, c: "#6b7280", l: null, n: "Charles Hudson · Precursor", p: "Down to co-invest on Tavita Health round", t: "1d" },
  ];
  return (
    <div className="space-y-5">
      <div><p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Messages</p><h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Your conversations</h1></div>
      <div className="grid lg:grid-cols-[360px_1fr] gap-4">
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {threads.map((t, i) => (
            <button key={i} onClick={demo(`open thread with ${t.n}`)} className="w-full flex items-start gap-3 p-3 border-b border-gray-100 last:border-0 text-left" style={t.active ? { background: "rgba(80,200,120,0.06)", borderLeft: "3px solid #50C878", paddingLeft: "9px" } : {}}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t.c}1A`, color: t.c }}><t.i className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {t.l && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: `${t.c}1A`, color: t.c }}>{t.l}</span>}
                  {t.unread && <span className="w-2 h-2 rounded-full bg-green-500" />}
                </div>
                <p className="text-xs font-bold truncate" style={{ color: "#0F1A2E" }}>{t.n}</p>
                <p className="text-[11px] text-gray-500 truncate">{t.p}</p>
              </div>
              <span className="text-[10px] text-gray-400">{t.t}</span>
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="rounded-xl p-3.5 border" style={{ background: "rgba(80,200,120,0.06)", borderColor: "rgba(80,200,120,0.2)" }}>
            <div className="flex items-center gap-2 mb-1"><Send className="h-3.5 w-3.5" style={{ color: "#2A9D5C" }} /><span className="text-xs font-bold" style={{ color: "#2A9D5C" }}>Deck shared</span></div>
            <p className="text-sm" style={{ color: "#0F1A2E" }}><strong>Tyler Moore</strong> shared their deck with you · 12 slides on DocSend</p>
            <p className="text-[11px] text-gray-500 mt-2">Arcana AI · Pre-Seed · $42K MRR / 3.8× MoM growth</p>
          </div>
          <div className="rounded-xl p-3 border border-gray-200 bg-gray-50 text-sm">Hey Tyler — saw the round drop on RoundDrop. Read the deck and the 3.8× MoM growth caught my eye. Got 15 mins this week to walk me through GTM?</div>
          <div className="flex gap-2 pt-3">
            <input className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Write a reply…" />
            <button onClick={demo("send a message")} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsView() {
  const notifs = [
    { Icon: Send, bg: "rgba(80,200,120,0.12)", c: "#2A9D5C", title: <><strong>Tyler Moore</strong> from <strong>Arcana AI</strong> shared their deck with you</>, sub: "12 slides · Pre-Seed · $750K SAFE at $8M cap. Already $400K committed (Precursor, Hustle Fund, Afore).", t: "12m", unread: true, actions: ["Open deck", "Pass"] },
    { Icon: Star, bg: "rgba(232,192,38,0.12)", c: "#D4A017", title: <>You&apos;re attending <strong>Investor Mixer: Solo GPs Only</strong></>, sub: "Wed, Jun 3 · 4:00 PM PT · Virtual. 12 solo GPs confirmed.", t: "2h", unread: true, actions: ["Add to calendar", "Event details"] },
    { Icon: TrendingUp, bg: "rgba(46,107,173,0.12)", c: "#2E6BAD", title: <><strong>CapTable.io</strong> closed Series A at $22M post</>, sub: "Led by Founders Fund. 7.5× markup on your $190K check.", t: "1d", actions: ["See engagement"] },
  ];
  return (
    <div className="space-y-5 max-w-3xl">
      <div><p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Notifications</p><h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>What&apos;s happening</h1></div>
      {notifs.map((n, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl border p-4" style={n.unread ? { background: "rgba(80,200,120,0.03)", borderColor: "rgba(80,200,120,0.25)" } : { borderColor: "#e5e7eb", background: "#fff" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: n.bg, color: n.c }}><n.Icon className="h-4 w-4" /></div>
          <div className="flex-1">
            <p className="text-sm" style={{ color: "#0F1A2E" }}>{n.title}</p>
            <p className="text-[13px] text-gray-500 mt-1">{n.sub}</p>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {n.actions.map((a, j) => (
                <button key={j} onClick={demo(a.toLowerCase())} className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">{a}</button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-gray-400">{n.t}</span>
          {n.unread && <span className="w-2 h-2 rounded-full mt-2 shrink-0 bg-green-500" />}
        </div>
      ))}
    </div>
  );
}

function EventsView() {
  const events = [
    { i: "PN", grad: "linear-gradient(135deg, #E8C026, #50C878)", title: "RoundDrop Pitch Night #1", date: "Wed, May 6 · 6:00 PM PT", desc: "8 founders pitching, 30+ investors confirmed.", virtual: true, featured: true },
    { i: "PD", grad: "linear-gradient(135deg, #2E6BAD, #5BA4E6)", title: "Investor Mixer: Solo GPs Only", date: "Wed, Jun 3 · 4:00 PM PT", desc: "Coordinate deal flow with other emerging fund managers.", virtual: true },
    { i: "DD", grad: "linear-gradient(135deg, #D4A017, #F0D848)", title: "Demo Day: Q2 Cohort", date: "Mon, Jun 23 · 10:00 AM PT", desc: "10 founders drop their rounds live.", virtual: true, featured: true },
    { i: "LP", grad: "linear-gradient(135deg, #2E6BAD, #5BA4E6)", title: "LP Update Workshop for Solo GPs", date: "Wed, Jun 17 · 12:00 PM PT", desc: "How to write LP updates that drive follow-on commits.", virtual: true },
  ];
  return (
    <div className="space-y-5">
      <div><p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Events</p><h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Upcoming events</h1></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <button key={e.title} onClick={demo(`RSVP to ${e.title}`)} className="text-left rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-video flex items-center justify-center text-white font-extrabold text-3xl" style={{ background: e.grad }}>{e.i}</div>
            <div className="p-4">
              <div className="flex gap-2 mb-2">
                {e.virtual ? <span className="rounded-full px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1" style={{ background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}><Video className="h-2.5 w-2.5" />Virtual</span> : null}
                {e.featured ? <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(232,192,38,0.12)", color: "#D4A017" }}>Featured</span> : null}
              </div>
              <p className="text-sm font-bold mb-1" style={{ color: "#0F1A2E" }}>{e.title}</p>
              <p className="text-[11px] text-gray-500 mb-2">{e.date}</p>
              <p className="text-[12px] text-gray-600">{e.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResourcesView() {
  const items = [
    { i: BookOpen, bg: "rgba(46,107,173,0.1)", c: "#2E6BAD", cat: "LP Updates", title: "LP Update Template for Solo GPs", desc: "Quarterly LP update format used by ten emerging fund managers." },
    { i: FileText, bg: "rgba(232,192,38,0.12)", c: "#D4A017", cat: "Memo Templates", title: "Investment Memo Template (Pre-Seed)", desc: "The one-pager memo format we use for every deal we evaluate." },
    { i: Sparkles, bg: "rgba(80,200,120,0.12)", c: "#2A9D5C", cat: "Benchmarks", title: "Pre-Seed Valuation Benchmarks Q1 2026", desc: "Median valuations and check sizes by sector across 200+ rounds." },
  ];
  return (
    <div className="space-y-5">
      <div><p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Resources</p><h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Investor toolkit</h1></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <button key={r.title} onClick={demo(`open the ${r.cat} resource`)} className="text-left rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: r.bg, color: r.c }}><r.i className="h-5 w-5" /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: r.c }}>{r.cat}</p>
            <p className="text-sm font-bold mb-1" style={{ color: "#0F1A2E" }}>{r.title}</p>
            <p className="text-[12px] text-gray-600 line-clamp-2">{r.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
