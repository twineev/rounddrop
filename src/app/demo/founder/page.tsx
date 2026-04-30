"use client";

import { useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import {
  Rocket, Users, Target, Calendar, BookOpen, MessageSquare, Bell, User,
  Building2, ShieldCheck, Plus, Share2, Pencil, CheckCircle2, Clock,
  TrendingUp, Eye, Download, Send, UserPlus, Star, Sparkles, Link2,
  Upload, ExternalLink, MapPin, Video, FileText, Play,
} from "lucide-react";

const TABS = [
  { id: "rounds", label: "My Round", Icon: Rocket },
  { id: "profile", label: "Profile", Icon: User },
  { id: "connections", label: "Connections", Icon: Users },
  { id: "pipeline", label: "Pipeline", Icon: Target },
  { id: "investors", label: "Investors", Icon: Building2 },
  { id: "messages", label: "Messages", Icon: MessageSquare, badge: 2 },
  { id: "notifications", label: "Notifications", Icon: Bell, badge: 4 },
  { id: "events", label: "Events", Icon: Calendar },
  { id: "resources", label: "Resources", Icon: BookOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

function demo(label: string) {
  return () => toast(`Demo mode — would ${label}`, { description: "Sign up to use the real action." });
}

const fmt = (a: number) =>
  a >= 1_000_000 ? `$${(a / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`
  : a >= 1_000 ? `$${Math.round(a / 1_000)}K`
  : `$${a}`;

function VerifiedPill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}>
      <ShieldCheck className="h-3 w-3" /> Verified
    </span>
  );
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

export default function FounderDemo() {
  const [tab, setTab] = useState<TabId>("rounds");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-[calc(100vh-44px)]">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-5 border-b border-gray-200">
          <span className="flex items-center gap-1.5 text-base font-bold" style={{ color: "#0F1A2E" }}>
            Round<span style={{ color: "#50C878" }}>Drop</span>
          </span>
          <Link href="/demo/investor" className="rounded-md px-2 py-1 text-[10px] font-bold" style={{ background: "#f3f4f6", color: "#6b7280" }}>
            Switch to investor →
          </Link>
        </div>
        <nav className="space-y-1 p-3">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all"
                style={
                  active
                    ? { background: "rgba(80,200,120,0.1)", color: "#2A9D5C" }
                    : { color: "#6b7280" }
                }
              >
                <t.Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{t.label}</span>
                {"badge" in t && t.badge ? (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">{t.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="overflow-y-auto p-5 md:p-7">
        {tab === "rounds" && <RoundsView />}
        {tab === "profile" && <ProfileView />}
        {tab === "connections" && <ConnectionsView />}
        {tab === "pipeline" && <PipelineView />}
        {tab === "investors" && <InvestorsView />}
        {tab === "messages" && <MessagesView />}
        {tab === "notifications" && <NotificationsView />}
        {tab === "events" && <EventsView />}
        {tab === "resources" && <ResourcesView />}
      </main>
    </div>
  );
}

// ==========================================================================
// Rounds (founder dashboard)
// ==========================================================================
function RoundsView() {
  const target = 750_000;
  const raised = 525_000;
  const pct = (raised / target) * 100;

  const investors = [
    { id: 1, init: "PV", grad: "linear-gradient(135deg, #E8C026, #50C878)", name: "Precursor Ventures", lead: true, gp: "Charles Hudson", date: "Apr 8", amount: 200_000, pct: 26.7 },
    { id: 2, init: "HF", color: "#2E6BAD", name: "Hustle Fund", gp: "Elizabeth Yin", date: "Apr 10", amount: 100_000, pct: 13.3 },
    { id: 3, init: "AF", color: "#D4A017", name: "Afore Capital", gp: "Anamitra Banerji", date: "Apr 12", amount: 75_000, pct: 10 },
    { id: 4, init: "CO", color: "#50C878", name: "Chapter One", gp: "Jeff Morris Jr.", date: "Apr 14", amount: 75_000, pct: 10 },
    { id: 5, init: "CT", color: "#1B3A5C", name: "Contrary", gp: "Eric Tung", date: "Apr 15", amount: 50_000, pct: 6.7 },
    { id: 6, init: "SS", grad: "linear-gradient(135deg, #2A9D5C, #5BA4E6)", name: "Summit Seed Capital", gp: "Tyler Moore", date: "Apr 16", amount: 15_000, pct: 2 },
    { id: 7, init: "AI", color: "#7c3aed", name: "Aisha Khan (Angel)", gp: "Individual", date: "Apr 17", amount: 10_000, pct: 1.3 },
  ];

  const funnel = [
    { label: "Viewing", count: 42, fill: "rgba(46,107,173,0.18)" },
    { label: "Deck shared", count: 27, fill: "rgba(232,192,38,0.25)" },
    { label: "Deck opened", count: 20, fill: "rgba(232,192,38,0.4)" },
    { label: "Meeting", count: 13, fill: "rgba(80,200,120,0.3)" },
    { label: "Committed", count: 7, fill: "linear-gradient(90deg, #E8C026, #50C878)" },
  ];
  const max = 42;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>My round</p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Arcana AI · Pre-Seed</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: "rgba(80,200,120,0.15)", color: "#2A9D5C" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full" style={{ background: "#50C878" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#50C878" }} />
              </span>
              Live
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">$750K SAFE · $8M post-money cap · 20% discount</p>
        </div>
        <div className="flex gap-2">
          <button onClick={demo("share the round link")} className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button onClick={demo("edit the round")} className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button onClick={demo("close the round")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Close round
          </button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Raised" value="$525K" sub="+$75K this week" color="#2A9D5C" />
        <Kpi label="Target" value="$750K" sub="70% of goal" />
        <Kpi label="Remaining" value="$225K" sub="~5 more checks" />
        <Kpi label="Investors" value="7" sub="+2 this week" color="#2A9D5C" />
        <Kpi label="Days left" value="18" sub="Closes May 5" />
        <Kpi label="Watching" value="42" sub="12 unique this week" color="#2E6BAD" />
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Round progress</h2>
            <p className="text-xs text-gray-500 mt-0.5">$525,000 of $750,000 committed</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold leading-none" style={{ color: "#0F1A2E" }}>{Math.round(pct)}%</p>
            <p className="text-[11px] text-gray-500">filled</p>
          </div>
        </div>
        <div className="h-3.5 rounded-full bg-gray-100 overflow-hidden relative">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #E8C026, #50C878)" }} />
          <div className="absolute top-0 bottom-0" style={{ left: "33.3%", width: "2px", background: "rgba(0,0,0,0.1)" }} />
          <div className="absolute top-0 bottom-0" style={{ left: "66.6%", width: "2px", background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
          <span>$0</span><span>$250K · lead</span><span>$500K · momentum</span><span>$750K · close</span>
        </div>
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs font-semibold" style={{ color: "#0F1A2E" }}>18 days remaining</p>
              <p className="text-[11px] text-gray-500">Opened Apr 2 · Closes May 5</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold" style={{ color: "#D4A017" }}>$12.5K / day needed to close</p>
            <p className="text-[11px] text-gray-500">You&apos;re averaging $15.9K/day</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* Investors */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Investors committed</h2>
              <p className="text-xs text-gray-500 mt-0.5">7 checks · avg $75K · largest $200K</p>
            </div>
            <button onClick={demo("add a check")} className="text-xs font-semibold text-gray-600 inline-flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add check
            </button>
          </div>
          {investors.map((i) => (
            <div key={i.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-xs shrink-0" style={{ background: i.grad || i.color }}>{i.init}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#0F1A2E" }}>
                  {i.name}
                  {i.lead ? <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded" style={{ background: "rgba(80,200,120,0.15)", color: "#2A9D5C" }}>LEAD</span> : null}
                </p>
                <p className="text-[11px] text-gray-500">{i.gp} · Committed {i.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{fmt(i.amount)}</p>
                <p className="text-[10px] text-gray-500">{i.pct.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: funnel + eyes */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold mb-3" style={{ color: "#0F1A2E" }}>Pipeline</h2>
            {funnel.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 mb-2">
                <span className="text-xs text-gray-500 w-20 shrink-0">{f.label}</span>
                <div className="flex-1 h-6 rounded-md bg-gray-50 relative overflow-hidden">
                  <div className="h-full rounded-md" style={{ width: `${(f.count / max) * 100}%`, background: f.fill }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">{f.count}</span>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
              <strong style={{ color: "#2A9D5C" }}>17% close rate</strong> — above pre-seed median (9%)
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Eyes on you</h2>
                <p className="text-xs text-gray-500 mt-0.5">Last 7 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold leading-none" style={{ color: "#0F1A2E" }}>42</p>
                <p className="text-[11px] font-semibold" style={{ color: "#2A9D5C" }}>↑ 18%</p>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-16 mt-4">
              {[30, 45, 55, 42, 78, 68, 100].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i === 6 ? "linear-gradient(180deg, #50C878, #2A9D5C)" : "#e5e7eb", minHeight: "4px" }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
              <div><p className="text-[10px] uppercase tracking-wider text-gray-500">Unique</p><p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>28</p></div>
              <div><p className="text-[10px] uppercase tracking-wider text-gray-500">Deck opens</p><p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>20</p></div>
              <div><p className="text-[10px] uppercase tracking-wider text-gray-500">Repeat</p><p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>14</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-bold mb-3" style={{ color: "#0F1A2E" }}>Recent activity</h2>
        {[
          { color: "#50C878", text: <><strong>Aisha Khan</strong> committed <strong>$10K</strong> to your round</>, sub: "via SAFE · 2 hours ago", chip: "+$10K" },
          { color: "#2E6BAD", text: <><strong>Charles Hudson</strong> (Precursor) downloaded your deck</>, sub: "Spent 4m 12s on the GTM slide · 3 hours ago" },
          { color: "#D4A017", text: <><strong>Jeff Morris Jr.</strong> (Chapter One) booked a call</>, sub: "Fri Apr 25 · 10:30 AM PT · 4 hours ago" },
          { color: "#2E6BAD", text: <><strong>Elizabeth Yin</strong> (Hustle Fund) viewed your profile</>, sub: "2m 14s on page · 5 hours ago" },
          { color: "#50C878", text: <><strong>Tyler Moore</strong> (Summit Seed) committed <strong>$15K</strong></>, sub: "via SAFE · yesterday", chip: "+$15K" },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: a.color }} />
            <div className="flex-1">
              <p className="text-sm" style={{ color: "#0F1A2E" }}>{a.text}</p>
              <p className="text-[11px] text-gray-500">{a.sub}</p>
            </div>
            {a.chip ? <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(80,200,120,0.12)", color: "#2A9D5C" }}>{a.chip}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
// Profile (founder)
// ==========================================================================
function ProfileView() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Profile</p>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: "#0F1A2E" }}>
          Your profile <VerifiedPill />
        </h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-white font-extrabold text-2xl" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>TM</div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold" style={{ color: "#0F1A2E" }}>Tyler Moore</h2>
            <p className="text-sm text-gray-500">Founder & CEO at Arcana AI</p>
            <div className="mt-2 flex gap-2">
              <a href="#" onClick={(e) => { e.preventDefault(); demo("open LinkedIn in new tab")(); }} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700">
                <Link2 className="h-3 w-3" /> LinkedIn
              </a>
              <button onClick={demo("upload company logo")} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700">
                <Upload className="h-3 w-3" /> Upload logo
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-4 text-sm">
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Email</p><p>tyler@arcanaai.com</p></div>
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Company</p><p>Arcana AI</p></div>
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Year founded</p><p>2024</p></div>
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Stage</p><p>Pre-Seed</p></div>
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">MRR</p><p className="font-bold">$42K</p></div>
          <div><p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">ARR</p><p className="font-bold">$504K</p></div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">One-liner</p>
          <p className="text-sm">AI-native legal research for solo practitioners.</p>
        </div>

        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Description</p>
          <p className="text-sm text-gray-700 leading-relaxed">We&apos;re building the research copilot solo and small-firm attorneys never had. GPT-4.1-class reasoning over state and federal case law, cheap enough to run on every billable matter.</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={demo("save profile changes")} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// Connections
// ==========================================================================
function ConnectionsView() {
  const platform = [
    { i: "EY", c: "linear-gradient(135deg, #E8C026, #50C878)", n: "Elizabeth Yin", r: "GP · Hustle Fund", d: "Apr 14" },
    { i: "CH", c: "#2E6BAD", n: "Charles Hudson", r: "Founder · Precursor Ventures", d: "Apr 8" },
    { i: "JM", c: "#D4A017", n: "Jeff Morris Jr.", r: "GP · Chapter One", d: "Apr 14" },
    { i: "ET", c: "#1B3A5C", n: "Eric Tung", r: "Partner · Contrary", d: "Apr 15" },
    { i: "PN", c: "#50C878", n: "Priya Nair", r: "Founder · Nudge Health", d: "Apr 10" },
    { i: "MC", c: "#7c3aed", n: "Marcus Chen", r: "Founder · Vaultic Supply", d: "Apr 12" },
    { i: "JP", c: "#be185d", n: "Jordan Park", r: "Founder · Lumen Labs", d: "Apr 9" },
    { i: "SA", c: "#0891b2", n: "Sofia Alvarez", r: "Founder · Gridtide Energy", d: "Apr 5" },
  ];
  const suggested = [
    { i: "RW", n: "Ryan Wischoff", r: "Solo GP · Wischoff Ventures", m: 14 },
    { i: "RH", n: "Ryan Hoover", r: "GP · Weekend Fund", m: 9 },
    { i: "DT", n: "David Tisch", r: "MP · BoxGroup", m: 7 },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Network</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Your connections</h1>
        <p className="text-sm text-gray-500 mt-1">People you&apos;ve connected with on RoundDrop and from your LinkedIn network.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#0F1A2E" }}>
            <Users className="h-4 w-4 text-gray-400" /> On RoundDrop
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">28</span>
          </h2>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgba(80,200,120,0.12)", color: "#2A9D5C" }}>All 28</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">Investors 14</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">Founders 11</span>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {platform.map((p) => (
            <div key={p.n} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white font-bold text-sm shrink-0" style={{ background: p.c }}>{p.i}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate flex items-center gap-1" style={{ color: "#0F1A2E" }}>
                  {p.n}
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white" style={{ background: "#2E6BAD" }}><ShieldCheck className="h-2.5 w-2.5" /></span>
                </p>
                <p className="text-xs text-gray-500 truncate">{p.r}</p>
                <p className="text-[10px] text-gray-400">Connected {p.d}</p>
              </div>
              <button onClick={demo(`message ${p.n}`)} className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700">
                <MessageSquare className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#0F1A2E" }}>
          <Sparkles className="h-4 w-4 text-gray-400" /> Suggested for you
        </h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">Based on mutual connections in your imported LinkedIn network.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suggested.map((s) => (
            <div key={s.n} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-400 text-white font-bold text-sm shrink-0">{s.i}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#0F1A2E" }}>{s.n}</p>
                <p className="text-xs text-gray-500 truncate">{s.r}</p>
                <p className="text-[10px]" style={{ color: "#2E6BAD" }}>{s.m} mutual connections</p>
              </div>
              <button onClick={demo(`request to connect with ${s.n}`)} className="rounded-lg px-2.5 py-1 text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#0F1A2E" }}>
          <Link2 className="h-4 w-4 text-gray-400" /> LinkedIn network
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">312</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">Used to surface mutual connections — not visible to anyone else.</p>
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 flex items-center justify-between flex-wrap gap-3 bg-gray-50">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-bold">Import Connections.csv</p>
              <p className="text-xs text-gray-500">Direct from LinkedIn data export</p>
            </div>
          </div>
          <button onClick={demo("import LinkedIn connections")} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
            Choose file
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// Pipeline
// ==========================================================================
function PipelineView() {
  const rows = [
    { firm: "Precursor Ventures", gp: "Charles Hudson · $100K–$500K", status: "Meeting", color: "rgba(80,200,120,0.12)", text: "#2A9D5C", date: "Apr 12", note: "Call Tuesday 2pm. Interested in our GTM motion." },
    { firm: "Hustle Fund", gp: "Elizabeth Yin · $25K–$200K", status: "Viewed", color: "rgba(46,107,173,0.1)", text: "#2E6BAD", date: "Apr 10", note: "Opened deck 3x. Follow up Friday." },
    { firm: "Afore Capital", gp: "Anamitra Banerji · $500K–$2M", status: "Deck shared", color: "rgba(232,192,38,0.12)", text: "#D4A017", date: "Apr 9", note: "Sent via DocSend. Waiting for response." },
    { firm: "Chapter One", gp: "Jeff Morris Jr. · $250K–$1M", status: "Deck shared", color: "rgba(232,192,38,0.12)", text: "#D4A017", date: "Apr 8", note: "Strong product focus — good fit." },
    { firm: "Contrary", gp: "Eric Tung · $100K–$2M", status: "Researching", color: "#f3f4f6", text: "#6b7280", date: "Apr 7", note: "Good uni network. Check if they do B2B SaaS." },
    { firm: "First Round Capital", gp: "Josh Kopelman · $500K–$3M", status: "Researching", color: "#f3f4f6", text: "#6b7280", date: "Apr 6", note: "Big name. Might be too early for us." },
    { firm: "Floodgate", gp: "Mike Maples Jr. · $250K–$2M", status: "Passed", color: "#fef2f2", text: "#dc2626", date: "Apr 3", note: "Not investing in our sector right now." },
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Pipeline</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Your fundraising pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">Track outreach, deck shares, and meetings in one place.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[["All","7"],["Researching","2"],["Deck Shared","2"],["Viewed","1"],["Meeting","1"],["Passed","1"]].map(([l, c], i) => (
          <span key={l} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold" style={i === 0 ? { background: "rgba(80,200,120,0.12)", color: "#2A9D5C" } : { background: "#f3f4f6", color: "#6b7280" }}>
            {l} <span className="rounded-full bg-black/5 px-1.5 text-[10px]">{c}</span>
          </span>
        ))}
      </div>

      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-[1fr_120px_80px_1.5fr_60px] gap-3 items-center rounded-xl border border-gray-200 bg-white p-4">
            <div>
              <p className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{r.firm}</p>
              <p className="text-[11px] text-gray-500">{r.gp}</p>
            </div>
            <span className="inline-flex justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold w-fit" style={{ background: r.color, color: r.text }}>{r.status}</span>
            <span className="text-[11px] text-gray-400">{r.date}</span>
            <p className="text-[12px] text-gray-600 italic">{r.note}</p>
            <button onClick={demo(`open pipeline detail for ${r.firm}`)} className="text-xs font-semibold" style={{ color: "#2E6BAD" }}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
// Investors directory (founder side)
// ==========================================================================
function InvestorsView() {
  const list = [
    { i: "PV", c: "linear-gradient(135deg, #E8C026, #50C878)", name: "Precursor Ventures", gp: "Charles Hudson", check: "$100K–$500K", stage: "Pre-Seed, Seed", sectors: ["SaaS","Fintech","Consumer"] },
    { i: "HF", c: "#2E6BAD", name: "Hustle Fund", gp: "Elizabeth Yin", check: "$25K–$200K", stage: "Pre-Seed", sectors: ["SaaS","Consumer","Marketplace"] },
    { i: "AF", c: "#D4A017", name: "Afore Capital", gp: "Anamitra Banerji", check: "$500K–$2M", stage: "Pre-Seed", sectors: ["SaaS","Dev Tools","AI/ML"] },
    { i: "CO", c: "#50C878", name: "Chapter One", gp: "Jeff Morris Jr.", check: "$250K–$1M", stage: "Pre-Seed, Seed", sectors: ["Consumer","Creator Economy","Marketplace"] },
    { i: "CT", c: "#1B3A5C", name: "Contrary", gp: "Eric Tung", check: "$100K–$2M", stage: "Pre-Seed, Seed", sectors: ["SaaS","AI/ML","Dev Tools","Fintech"] },
    { i: "FR", c: "linear-gradient(135deg, #2A9D5C, #5BA4E6)", name: "First Round Capital", gp: "Josh Kopelman", check: "$500K–$3M", stage: "Seed", sectors: ["SaaS","Consumer","Marketplace","Fintech"] },
  ];
  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Investor Directory</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Find the right investors</h1>
        <p className="text-sm text-gray-500 mt-1">Browse 30+ pre-seed and seed investors. Share your deck directly.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((i) => (
          <div key={i.name} className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg cursor-pointer" onClick={demo(`open ${i.name} profile`)}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm" style={{ background: i.c }}>{i.i}</div>
              <div><p className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{i.name}</p><p className="text-xs text-gray-500">{i.gp}</p></div>
            </div>
            <div className="flex gap-3 text-xs text-gray-600 mb-3">
              <div><span className="text-gray-400">Check</span><p className="font-semibold">{i.check}</p></div>
              <div><span className="text-gray-400">Stage</span><p className="font-semibold">{i.stage}</p></div>
            </div>
            <div className="flex flex-wrap gap-1">
              {i.sectors.map((s) => <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
// Messages
// ==========================================================================
function MessagesView() {
  const threads = [
    { id: 0, kind: "intro", icon: UserPlus, color: "#2E6BAD", label: "Intro request", name: "Tyler Moore · Arcana AI", preview: "Request an Intro to Elizabeth Yin, from Hustle Fund", t: "2m", unread: true, active: true },
    { id: 1, kind: "deck", icon: Send, color: "#2A9D5C", label: "Deck shared", name: "Priya Nair · Nudge Health", preview: 'Shared a pitch deck: "Nudge-Deck-Apr26.pdf"', t: "38m", unread: true },
    { id: 2, kind: "intro", icon: UserPlus, color: "#2E6BAD", label: "Intro request", name: "Marcus Chen · Vaultic", preview: "Request an Intro to Garry Tan, from Initialized Capital", t: "2h" },
    { id: 3, kind: "msg", icon: MessageSquare, color: "#6b7280", label: null, name: "Elizabeth Yin · Hustle Fund", preview: "Happy to chat! Sending you a Calendly link now.", t: "1d" },
    { id: 4, kind: "deck", icon: Send, color: "#2A9D5C", label: "Deck shared", name: "Jordan Park · Lumen Labs", preview: "Viewed 4 times · Deck opened yesterday at 9:42 PM", t: "2d" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Messages</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Your conversations</h1>
        <p className="text-sm text-gray-500 mt-1">Intro requests, deck shares, and direct messages.</p>
      </div>
      <div className="grid lg:grid-cols-[360px_1fr] gap-4">
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex justify-between text-[11px] text-gray-500">
            <span>5 threads</span>
          </div>
          {threads.map((t) => (
            <button key={t.id} onClick={demo(`open thread with ${t.name}`)} className="w-full flex items-start gap-3 p-3 border-b border-gray-100 last:border-0 text-left" style={t.active ? { background: "rgba(80,200,120,0.06)", borderLeft: "3px solid #50C878", paddingLeft: "9px" } : {}}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t.color}1A`, color: t.color }}><t.icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {t.label && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: `${t.color}1A`, color: t.color }}>{t.label}</span>}
                  {t.unread && <span className="w-2 h-2 rounded-full bg-green-500" />}
                </div>
                <p className="text-xs font-bold truncate" style={{ color: "#0F1A2E" }}>{t.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{t.preview}</p>
              </div>
              <span className="text-[10px] text-gray-400">{t.t}</span>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="rounded-xl p-3.5 border" style={{ background: "rgba(46,107,173,0.06)", borderColor: "rgba(46,107,173,0.2)" }}>
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="h-3.5 w-3.5" style={{ color: "#2E6BAD" }} />
              <span className="text-xs font-bold" style={{ color: "#1B3A5C" }}>Intro request</span>
            </div>
            <p className="text-sm" style={{ color: "#0F1A2E" }}><strong>Tyler Moore</strong> (Arcana AI) is asking for an intro to <strong>Elizabeth Yin</strong> at <strong>Hustle Fund</strong>.</p>
            <p className="text-[11px] text-gray-500 mt-2">14 mutual connections with Elizabeth · Hustle Fund: Pre-Seed, $25K–$200K</p>
          </div>
          <div className="rounded-xl p-3 border border-gray-200 bg-gray-50 text-sm">
            Hey! Saw you&apos;re connected to Elizabeth on LinkedIn. We&apos;re doing $750K SAFE at $8M cap — already have $400K committed. Would love an intro if she invests in legal/AI pre-seed.
          </div>
          <div className="flex gap-2 pt-3">
            <input className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Write a reply…" />
            <button onClick={demo("send a message")} className="rounded-lg px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-1.5" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// Notifications
// ==========================================================================
function NotificationsView() {
  const notifs = [
    { Icon: Eye, bg: "rgba(46,107,173,0.12)", c: "#2E6BAD", title: <><strong>Elizabeth Yin</strong> from <strong>Hustle Fund</strong> viewed your profile</>, sub: "She spent 2m 14s on your page — longer than 82% of visits. You share 14 mutual connections.", t: "12m", unread: true, actions: ["View profile", "Request an intro"] },
    { Icon: Download, bg: "rgba(80,200,120,0.12)", c: "#2A9D5C", title: <><strong>Charles Hudson</strong> from <strong>Precursor Ventures</strong> downloaded your deck</>, sub: '"Arcana-Deck-Apr26.pdf" — he\'s spent 4m 12s on slide 6 (GTM).', t: "1h", unread: true, actions: ["See engagement", "Send follow-up"] },
    { Icon: Calendar, bg: "rgba(232,192,38,0.12)", c: "#D4A017", title: <><strong>Jeff Morris Jr.</strong> from <strong>Chapter One</strong> booked a call with you</>, sub: "Fri, Apr 25 · 10:30 AM PT · 30-min intro via Zoom.", t: "3h", unread: true, actions: ["Open calendar", "Reschedule"] },
    { Icon: Star, bg: "rgba(232,192,38,0.12)", c: "#D4A017", title: <>You&apos;re attending <strong>RoundDrop Pitch Night #1</strong></>, sub: "Wed, May 6 · 6:00 PM PT · Virtual. 8 founders pitching, 34 investors confirmed.", t: "5h", unread: true, actions: ["Add to calendar", "Event details"] },
    { Icon: BookOpen, bg: "rgba(80,200,120,0.12)", c: "#2A9D5C", title: <><strong>3 new resources</strong> added to the toolkit</>, sub: '"Pre-Seed Deck Template", "SAFE vs. Convertible Note Primer", "First 100 Customers Playbook".', t: "1d", actions: ["Browse resources"] },
  ];
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Notifications</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>What&apos;s happening</h1>
        </div>
        <button onClick={demo("mark all notifications as read")} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
          Mark all read
        </button>
      </div>
      {notifs.map((n, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl border p-4" style={n.unread ? { background: "rgba(80,200,120,0.03)", borderColor: "rgba(80,200,120,0.25)" } : { borderColor: "#e5e7eb", background: "#fff" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: n.bg, color: n.c }}><n.Icon className="h-4 w-4" /></div>
          <div className="flex-1">
            <p className="text-sm" style={{ color: "#0F1A2E" }}>{n.title}</p>
            <p className="text-[13px] text-gray-500 mt-1">{n.sub}</p>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {n.actions.map((a, j) => (
                <button key={j} onClick={demo(a.toLowerCase())} className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                  {a}
                </button>
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

// ==========================================================================
// Events
// ==========================================================================
function EventsView() {
  const events = [
    { i: "PN", grad: "linear-gradient(135deg, #E8C026, #50C878)", title: "RoundDrop Pitch Night #1", date: "Wed, May 6 · 6:00 PM PT", desc: "8 pre-seed founders pitch to 30+ early-stage investors.", virtual: true, featured: true },
    { i: "SF", grad: "linear-gradient(135deg, #2E6BAD, #5BA4E6)", title: "SF Pre-Seed Meetup", date: "Thu, May 14 · 5:30 PM PT · Mission, SF", desc: "Drinks and demos at Shack15. 50 seats.", irl: true },
    { i: "FW", grad: "linear-gradient(135deg, #D4A017, #F0D848)", title: "Fundraising Workshop: What Seed VCs Want to See", date: "Tue, May 20 · 12:00 PM PT", desc: "Elizabeth Yin (Hustle Fund) and Jeff Morris Jr. (Chapter One) on building a deck that converts.", virtual: true },
    { i: "NY", grad: "linear-gradient(135deg, #E8C026, #50C878)", title: "NYC Founder Breakfast", date: "Fri, May 23 · 8:30 AM ET · Williamsburg", desc: "Intimate breakfast for 20 pre-seed and seed founders.", irl: true },
    { i: "PD", grad: "linear-gradient(135deg, #2E6BAD, #5BA4E6)", title: "Investor Mixer: Solo GPs Only", date: "Wed, Jun 3 · 4:00 PM PT", desc: "For solo GPs running emerging funds <$30M.", virtual: true },
    { i: "DD", grad: "linear-gradient(135deg, #D4A017, #F0D848)", title: "Demo Day: Q2 Cohort", date: "Mon, Jun 23 · 10:00 AM PT", desc: "10 founders from our Q2 cohort drop their rounds live.", virtual: true },
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Events</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Upcoming events</h1>
        <p className="text-sm text-gray-500 mt-1">Pitch nights, investor meetups, and founder-only events.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <button key={e.title} onClick={demo(`RSVP to ${e.title}`)} className="text-left rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-video flex items-center justify-center text-white font-extrabold text-3xl" style={{ background: e.grad }}>{e.i}</div>
            <div className="p-4">
              <div className="flex gap-2 mb-2 flex-wrap">
                {e.virtual ? <span className="rounded-full px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1" style={{ background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}><Video className="h-2.5 w-2.5" />Virtual</span> : null}
                {e.irl ? <span className="rounded-full px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1" style={{ background: "rgba(80,200,120,0.12)", color: "#2A9D5C" }}><MapPin className="h-2.5 w-2.5" />In Person</span> : null}
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

// ==========================================================================
// Resources
// ==========================================================================
function ResourcesView() {
  const items = [
    { i: FileText, bg: "rgba(232,192,38,0.12)", c: "#D4A017", cat: "Deck Templates", title: "Pre-Seed Deck Template (Keynote + Figma)", desc: "The exact 12-slide template we use with our portfolio companies." },
    { i: BookOpen, bg: "rgba(46,107,173,0.1)", c: "#2E6BAD", cat: "Term Sheets", title: "SAFE vs. Convertible Note Primer", desc: "When to use which, how the math works, and the 3 clauses to watch." },
    { i: Sparkles, bg: "rgba(80,200,120,0.12)", c: "#2A9D5C", cat: "Fundraising", title: "Pre-Seed Round Anatomy: 50 Recent Rounds", desc: "What they raised, at what valuation, who led, what the deck looked like." },
    { i: TrendingUp, bg: "rgba(232,192,38,0.12)", c: "#D4A017", cat: "Growth", title: "First 100 Customers Playbook", desc: "Founder-to-founder war stories from 20 early-stage teams." },
    { i: Users, bg: "rgba(80,200,120,0.12)", c: "#2A9D5C", cat: "Hiring", title: "First 10 Hires: A Pre-Seed Playbook", desc: "Who to hire first, how to pay them, the 5 questions that predict fit." },
    { i: BookOpen, bg: "#f3f4f6", c: "#6b7280", cat: "Legal", title: "Delaware C-Corp Formation Checklist", desc: "Everything you need for a clean structure before your first investor meeting." },
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Resources</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Fundraising toolkit</h1>
        <p className="text-sm text-gray-500 mt-1">Curated for pre-seed and seed founders.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <button key={r.title} onClick={demo(`open the ${r.cat} resource`)} className="text-left rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: r.bg, color: r.c }}><r.i className="h-5 w-5" /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: r.c }}>{r.cat}</p>
            <p className="text-sm font-bold mb-1" style={{ color: "#0F1A2E" }}>{r.title}</p>
            <p className="text-[12px] text-gray-600 line-clamp-2">{r.desc}</p>
            <p className="text-[11px] font-bold mt-3 inline-flex items-center gap-1" style={{ color: "#2E6BAD" }}>Open resource <ExternalLink className="h-2.5 w-2.5" /></p>
          </button>
        ))}
      </div>
    </div>
  );
}
