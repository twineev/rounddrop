"use client";

import { useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import {
  LayoutDashboard, Users, Building2, Rocket, Send, MessageSquare, Calendar,
  BookOpen, ShieldCheck, DollarSign, TrendingUp, TrendingDown, Eye,
  ArrowUpRight, Activity, Zap, AlertCircle, Database, FileText,
  CheckCircle2, Clock, Filter, Layers,
} from "lucide-react";

type Tab = "overview" | "users" | "investors" | "spvs" | "events" | "resources" | "payments" | "engagement";

const demo = (label: string) => () => toast(`Demo mode — would ${label}`, { description: "This is a demo admin dashboard." });

const fmt = (a: number) =>
  a >= 1_000_000 ? `$${(a / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`
  : a >= 1_000 ? `$${(a / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  : `$${a}`;

export default function DemoAdminPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:sticky md:top-0 md:h-screen border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-5 border-b border-gray-200 shrink-0">
          <span className="flex items-center gap-1.5 text-base font-bold" style={{ color: "#0F1A2E" }}>
            Round<span style={{ color: "#50C878" }}>Drop</span>
          </span>
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">ADMIN</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem id="overview" label="Overview" icon={LayoutDashboard} tab={tab} setTab={setTab} />
          <NavItem id="users" label="Users" icon={Users} tab={tab} setTab={setTab} count={1247} />
          <NavItem id="investors" label="Investors" icon={Building2} tab={tab} setTab={setTab} count={342} />
          <NavItem id="spvs" label="SPVs" icon={Layers} tab={tab} setTab={setTab} count={47} />
          <NavItem id="payments" label="Payments" icon={DollarSign} tab={tab} setTab={setTab} />
          <NavItem id="engagement" label="Engagement" icon={Activity} tab={tab} setTab={setTab} />
          <NavItem id="events" label="Events" icon={Calendar} tab={tab} setTab={setTab} count={12} />
          <NavItem id="resources" label="Resources" icon={BookOpen} tab={tab} setTab={setTab} count={10} />

          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Quick previews</p>
            <Link href="/demo/founder" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <Rocket className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Founder app</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link href="/demo/investor" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <TrendingUp className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Investor app</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed top-[44px] left-0 right-0 z-40 flex gap-2 overflow-x-auto bg-white border-b border-gray-200 px-3 py-2">
        {(["overview", "users", "investors", "spvs", "payments", "engagement", "events", "resources"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
            style={tab === t ? { background: "#0F1A2E", color: "#fff" } : { background: "#f3f4f6", color: "#6b7280" }}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 p-5 md:p-7 mt-12 md:mt-0">
        {tab === "overview" && <OverviewView />}
        {tab === "users" && <UsersView />}
        {tab === "investors" && <InvestorsView />}
        {tab === "spvs" && <SpvsView />}
        {tab === "payments" && <PaymentsView />}
        {tab === "engagement" && <EngagementView />}
        {tab === "events" && <EventsView />}
        {tab === "resources" && <ResourcesView />}
      </main>
    </div>
  );
}

function NavItem({ id, label, icon: Icon, tab, setTab, count }: { id: Tab; label: string; icon: React.ElementType; tab: Tab; setTab: (t: Tab) => void; count?: number }) {
  const active = tab === id;
  return (
    <button onClick={() => setTab(id)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all"
      style={active ? { background: "#0F1A2E", color: "#fff" } : { color: "#6b7280" }}>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {count != null ? <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={active ? { background: "rgba(255,255,255,0.15)", color: "#fff" } : { background: "#f3f4f6", color: "#6b7280" }}>{count}</span> : null}
    </button>
  );
}

function Kpi({ label, value, sub, color, trend, icon: Icon }: { label: string; value: string; sub?: string; color?: string; trend?: "up" | "down"; icon?: React.ElementType }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-gray-400" /> : null}
      </div>
      <p className="text-3xl font-extrabold leading-none" style={{ color: "#0F1A2E" }}>{value}</p>
      {sub ? (
        <p className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: color || "#6b7280" }}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
          {sub}
        </p>
      ) : null}
    </div>
  );
}

// ==========================================================================
function OverviewView() {
  const sparkline = [42, 51, 58, 71, 68, 89, 102, 118, 134, 147, 165, 183, 201, 218];
  const max = Math.max(...sparkline);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Overview</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Platform health</h1>
          <p className="text-sm text-gray-500 mt-1">Live data across all pages, payments, and engagement.</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500">Last 30 days</span>
          <button onClick={demo("export overview as CSV")} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">Export</button>
        </div>
      </div>

      {/* North-star metrics */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Kpi label="Total users" value="1,247" sub="+184 this month (+17.3%)" color="#2A9D5C" trend="up" icon={Users} />
        <Kpi label="Active founders" value="287" sub="158 active rounds" color="#2A9D5C" trend="up" icon={Rocket} />
        <Kpi label="Active investors" value="342" sub="+24 this week" color="#2A9D5C" trend="up" icon={Building2} />
        <Kpi label="Total raised on platform" value="$24.7M" sub="across 158 live rounds" icon={DollarSign} />
        <Kpi label="MRR" value="$32.4K" sub="+$5.1K MoM" color="#2A9D5C" trend="up" icon={DollarSign} />
        <Kpi label="ARR" value="$388K" sub="86% gross margin" icon={TrendingUp} />
        <Kpi label="Decks shared" value="2,184" sub="+412 last 7 days" color="#2A9D5C" trend="up" icon={Send} />
        <Kpi label="Avg deck open rate" value="68%" sub="vs 24% via cold email" color="#2A9D5C" icon={Eye} />
        <Kpi label="Active SPVs" value="47" sub="+11 this month" color="#2A9D5C" trend="up" icon={Layers} />
        <Kpi label="LP capital tracked" value="$8.4M" sub="across 47 SPVs" icon={DollarSign} />
        <Kpi label="SPV revenue (a la carte)" value="$23.5K" sub="47 × $499" color="#2A9D5C" icon={DollarSign} />
        <Kpi label="Wire success rate" value="84%" sub="industry avg ~70%" color="#2A9D5C" icon={CheckCircle2} />
      </div>

      {/* Growth chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>Daily signups</h2>
            <p className="text-xs text-gray-500 mt-0.5">Last 14 days · 1,847 total</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold leading-none" style={{ color: "#0F1A2E" }}>218</p>
            <p className="text-[11px] font-semibold" style={{ color: "#2A9D5C" }}>↑ 32% vs prior 14d</p>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-32">
          {sparkline.map((v, i) => (
            <div key={i} className="flex-1 rounded-t-md" style={{
              height: `${(v / max) * 100}%`,
              background: i === sparkline.length - 1 ? "linear-gradient(180deg, #50C878, #2A9D5C)" : "#e5e7eb",
              minHeight: "4px",
            }} />
          ))}
        </div>
      </div>

      {/* Two-column: conversion funnel + top rounds */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>Founder conversion funnel</h2>
          <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
          {[
            { label: "Visited landing", count: 14_823, fill: "rgba(46,107,173,0.18)" },
            { label: "Signed up", count: 1_847, fill: "rgba(232,192,38,0.25)" },
            { label: "Completed onboarding", count: 1_421, fill: "rgba(232,192,38,0.4)" },
            { label: "Dropped a round", count: 287, fill: "rgba(80,200,120,0.3)" },
            { label: "Shared deck", count: 198, fill: "linear-gradient(90deg, #E8C026, #50C878)" },
          ].map((f, i) => {
            const max = 14_823;
            return (
              <div key={f.label} className="flex items-center gap-2.5 mb-2">
                <span className="text-xs text-gray-500 w-32 shrink-0">{f.label}</span>
                <div className="flex-1 h-7 rounded-md bg-gray-50 relative overflow-hidden">
                  <div className="h-full rounded-md" style={{ width: `${(f.count / max) * 100}%`, background: f.fill }} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">{f.count.toLocaleString()}</span>
                </div>
                {i > 0 ? <span className="text-[10px] text-gray-400 w-10 shrink-0">{((f.count / [14_823, 1_847, 1_421, 287, 198][i - 1]) * 100).toFixed(1)}%</span> : <span className="w-10" />}
              </div>
            );
          })}
          <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
            Visit→signup: <strong style={{ color: "#2A9D5C" }}>12.5%</strong> ·
            Signup→drop: <strong style={{ color: "#2A9D5C" }}>15.5%</strong> ·
            Drop→share: <strong style={{ color: "#2A9D5C" }}>69%</strong>
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>Top performing rounds</h2>
          <p className="text-xs text-gray-500 mb-4">By eyes + deck opens this week</p>
          {[
            { name: "Arcana AI", stage: "Pre-Seed", filled: 70, eyes: 287, opens: 142 },
            { name: "Lumen Models", stage: "Seed", filled: 35, eyes: 245, opens: 118 },
            { name: "Nudge Health", stage: "Pre-Seed", filled: 88, eyes: 211, opens: 96 },
            { name: "Slate Protocol", stage: "Pre-Seed", filled: 90, eyes: 312, opens: 88 },
            { name: "Vaultic", stage: "Seed", filled: 45, eyes: 178, opens: 79 },
          ].map((r) => (
            <div key={r.name} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#0F1A2E" }}>{r.name}</p>
                <p className="text-[11px] text-gray-500">{r.stage} · {r.filled}% filled</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold" style={{ color: "#2E6BAD" }}>{r.eyes} <span className="text-[10px] font-normal text-gray-500">eyes</span></p>
                <p className="text-[10px] text-gray-500">{r.opens} deck opens</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-bold mb-3" style={{ color: "#0F1A2E" }}>Recent platform activity</h2>
        {[
          { color: "#50C878", text: "New founder signed up: Marcus Chen / Vaultic Supply", t: "2 min ago" },
          { color: "#2E6BAD", text: "Investor downloaded deck: Charles Hudson opened Arcana AI", t: "4 min ago" },
          { color: "#D4A017", text: "Round dropped: Lumen Models · $3M Seed at $28M cap", t: "12 min ago" },
          { color: "#7c3aed", text: "Subscription upgrade: Summit Seed → Pro plan ($199/mo)", t: "23 min ago" },
          { color: "#50C878", text: "Deck shared: Tyler/Arcana → 5 new investors", t: "31 min ago" },
          { color: "#2E6BAD", text: "Call booked: Jeff Morris (Chapter One) ↔ Tyler/Arcana for Apr 25", t: "1 hour ago" },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: a.color }} />
            <div className="flex-1 text-sm" style={{ color: "#0F1A2E" }}>{a.text}</div>
            <span className="text-[11px] text-gray-400 shrink-0">{a.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
function UsersView() {
  const users = [
    { name: "Tyler Moore", email: "tyler@arcanaai.com", role: "founder", co: "Arcana AI", verified: true, joined: "Apr 2", plan: "Pro", lastActive: "12m ago" },
    { name: "Priya Nair", email: "priya@nudgehealth.io", role: "founder", co: "Nudge Health", verified: true, joined: "Apr 5", plan: "Free", lastActive: "1h ago" },
    { name: "Marcus Chen", email: "marcus@vaultic.io", role: "founder", co: "Vaultic Supply", verified: false, joined: "Apr 12", plan: "Free", lastActive: "3h ago" },
    { name: "Elizabeth Yin", email: "ey@hustlefund.vc", role: "investor", co: "Hustle Fund", verified: true, joined: "Apr 14", plan: "Investor", lastActive: "5m ago" },
    { name: "Charles Hudson", email: "charles@precursorvc.com", role: "investor", co: "Precursor Ventures", verified: true, joined: "Apr 8", plan: "Investor", lastActive: "2h ago" },
    { name: "Jordan Park", email: "jordan@lumenlabs.ai", role: "founder", co: "Lumen Labs", verified: false, joined: "Apr 9", plan: "Free", lastActive: "1d ago" },
    { name: "Sofia Alvarez", email: "sofia@gridtide.io", role: "founder", co: "Gridtide Energy", verified: true, joined: "Apr 5", plan: "Pro", lastActive: "4h ago" },
    { name: "Eric Tung", email: "eric@contrary.com", role: "investor", co: "Contrary", verified: true, joined: "Apr 15", plan: "Investor", lastActive: "30m ago" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Users</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Users</h1>
          <p className="text-sm text-gray-500 mt-1">All registered founders and investors. Toggle verification.</p>
        </div>
        <div className="flex gap-2">
          <input placeholder="Search..." className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm" />
          <button onClick={demo("filter users")} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"><Filter className="h-3.5 w-3.5" /> Filter</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Total" value="1,247" />
        <Kpi label="Founders" value="592" sub="47.5% of users" />
        <Kpi label="Investors" value="342" sub="27.4% of users" />
        <Kpi label="Verified" value="421" sub="33.8%" color="#2E6BAD" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_100px_120px_100px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <div>User</div><div>Role · Company</div><div>Plan</div><div>Verified</div><div>Joined</div><div>Last active</div>
        </div>
        {users.map((u) => (
          <div key={u.email} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_100px_120px_100px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0">
            <div>
              <p className="font-bold" style={{ color: "#0F1A2E" }}>{u.name}</p>
              <p className="text-[11px] text-gray-500">{u.email}</p>
            </div>
            <div>
              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={u.role === "founder" ? { background: "rgba(80,200,120,0.12)", color: "#2A9D5C" } : { background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}>{u.role}</span>
              <p className="text-[11px] text-gray-500 mt-0.5">{u.co}</p>
            </div>
            <div className="text-xs"><span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">{u.plan}</span></div>
            <button onClick={demo(`toggle verified for ${u.name}`)} className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold w-fit"
              style={u.verified ? { background: "rgba(46,107,173,0.1)", color: "#2E6BAD", borderColor: "rgba(46,107,173,0.3)" } : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }}>
              <ShieldCheck className="h-3 w-3" />{u.verified ? "Verified" : "—"}
            </button>
            <div className="text-xs text-gray-500">{u.joined}</div>
            <div className="text-xs text-gray-500">{u.lastActive}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
function InvestorsView() {
  const list = [
    { firm: "Precursor Ventures", gp: "Charles Hudson", check: "$100K-$500K", deals: 7, claimed: true, signups: 24 },
    { firm: "Hustle Fund", gp: "Elizabeth Yin", check: "$25K-$200K", deals: 12, claimed: true, signups: 38 },
    { firm: "Chapter One", gp: "Jeff Morris Jr.", check: "$250K-$1M", deals: 5, claimed: true, signups: 19 },
    { firm: "Afore Capital", gp: "Anamitra Banerji", check: "$500K-$2M", deals: 3, claimed: true, signups: 14 },
    { firm: "Contrary", gp: "Eric Tung", check: "$100K-$2M", deals: 6, claimed: true, signups: 22 },
    { firm: "Pear VC", gp: "Pejman Nozad", check: "$250K-$2M", deals: 0, claimed: false, signups: 0 },
    { firm: "Initialized Capital", gp: "Garry Tan", check: "$500K-$3M", deals: 0, claimed: false, signups: 0 },
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Investors</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Investor profiles</h1>
        <p className="text-sm text-gray-500 mt-1">Curated directory + claimed accounts. {list.filter(l => l.claimed).length} claimed of {list.length}.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Total profiles" value="342" sub="30 admin-seeded + 312 claimed" />
        <Kpi label="Claimed" value="312" sub="91.2%" color="#2A9D5C" />
        <Kpi label="Active this week" value="187" sub="61% of claimed" />
        <Kpi label="Avg deals viewed/wk" value="14.3" sub="per active investor" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_100px_100px_100px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <div>Firm · GP</div><div>Check size</div><div>Status</div><div>Deals</div><div>Signups</div>
        </div>
        {list.map((i) => (
          <div key={i.firm} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_100px_100px_100px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0">
            <div>
              <p className="font-bold" style={{ color: "#0F1A2E" }}>{i.firm}</p>
              <p className="text-[11px] text-gray-500">{i.gp}</p>
            </div>
            <div className="text-xs text-gray-600">{i.check}</div>
            <div>
              <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={i.claimed ? { background: "rgba(80,200,120,0.12)", color: "#2A9D5C" } : { background: "#f3f4f6", color: "#6b7280" }}>{i.claimed ? "Claimed" : "Unclaimed"}</span>
            </div>
            <div className="text-sm font-semibold" style={{ color: "#0F1A2E" }}>{i.deals}</div>
            <div className="text-sm" style={{ color: i.signups > 0 ? "#2A9D5C" : "#9ca3af" }}>{i.signups > 0 ? `+${i.signups}` : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
function PaymentsView() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Payments</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Revenue & subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">Stripe subscriptions, plan distribution, churn, expansion.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Kpi label="MRR" value="$32.4K" sub="+$5.1K this month" color="#2A9D5C" trend="up" icon={DollarSign} />
        <Kpi label="ARR" value="$388K" sub="+$61K (+18%)" color="#2A9D5C" trend="up" />
        <Kpi label="Paying customers" value="247" sub="+34 this month" color="#2A9D5C" />
        <Kpi label="ARPU" value="$131" sub="up from $122" color="#2A9D5C" trend="up" />
        <Kpi label="Free → Paid conversion" value="12.4%" sub="of onboarded users" />
        <Kpi label="Net revenue retention" value="118%" sub="trailing 90 days" color="#2A9D5C" />
        <Kpi label="Churn (monthly)" value="3.8%" sub="industry median: 5%" color="#2A9D5C" trend="down" />
        <Kpi label="LTV" value="$3.4K" sub="3.5 yr avg lifetime" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>Plan distribution</h2>
          <p className="text-xs text-gray-500 mb-4">By active subscription</p>
          <div className="flex h-9 rounded-lg overflow-hidden mb-4">
            <div style={{ width: "62%", background: "#2A9D5C" }} className="flex items-center justify-center text-white text-xs font-bold">Free 62%</div>
            <div style={{ width: "26%", background: "linear-gradient(135deg, #E8C026, #50C878)" }} className="flex items-center justify-center text-white text-xs font-bold">Pro 26%</div>
            <div style={{ width: "9%", background: "#2E6BAD" }} className="flex items-center justify-center text-white text-[11px] font-bold">Inv</div>
            <div style={{ width: "3%", background: "#1B3A5C" }} className="flex items-center justify-center text-white text-[10px] font-bold">Ent</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div><p className="text-gray-500">Free</p><p className="font-bold text-base" style={{ color: "#0F1A2E" }}>772 · $0/mo</p></div>
            <div><p className="text-gray-500">Pro Founder</p><p className="font-bold text-base" style={{ color: "#0F1A2E" }}>156 · $79/mo</p></div>
            <div><p className="text-gray-500">Investor</p><p className="font-bold text-base" style={{ color: "#0F1A2E" }}>78 · $199/mo</p></div>
            <div><p className="text-gray-500">Enterprise</p><p className="font-bold text-base" style={{ color: "#0F1A2E" }}>13 · $999/mo</p></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>MRR breakdown</h2>
          <p className="text-xs text-gray-500 mb-4">By plan</p>
          {[
            { name: "Pro Founder", mrr: 12_324, share: 38 },
            { name: "Investor", mrr: 15_522, share: 48 },
            { name: "Enterprise", mrr: 12_987, share: 40 },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{p.name}</p>
                <div className="h-1.5 rounded-full bg-gray-100 mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.share}%`, background: "linear-gradient(90deg, #E8C026, #50C878)" }} />
                </div>
              </div>
              <p className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{fmt(p.mrr)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-bold mb-3" style={{ color: "#0F1A2E" }}>Recent transactions</h2>
        {[
          { name: "Summit Seed Capital", plan: "Investor · $199/mo", action: "Renewal", amount: 199, t: "2h ago", success: true },
          { name: "Tavita Health (Tyler)", plan: "Pro Founder · $79/mo", action: "New subscription", amount: 79, t: "5h ago", success: true },
          { name: "Hustle Fund", plan: "Investor · $199/mo", action: "Renewal", amount: 199, t: "8h ago", success: true },
          { name: "Acme Ventures", plan: "Enterprise · $999/mo", action: "Upgrade from Pro", amount: 920, t: "1d ago", success: true },
          { name: "BoxGroup", plan: "Investor · $199/mo", action: "Failed payment", amount: 199, t: "2d ago", success: false },
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={p.success ? { background: "rgba(80,200,120,0.12)", color: "#2A9D5C" } : { background: "#fef2f2", color: "#dc2626" }}>
              {p.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: "#0F1A2E" }}>{p.name}</p>
              <p className="text-[11px] text-gray-500">{p.plan} · {p.action}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold" style={{ color: p.success ? "#0F1A2E" : "#dc2626" }}>{fmt(p.amount)}</p>
              <p className="text-[10px] text-gray-400">{p.t}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
function EngagementView() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Engagement</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Product engagement</h1>
        <p className="text-sm text-gray-500 mt-1">DAU/WAU, retention, and key product actions.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Kpi label="DAU" value="487" sub="+12% WoW" color="#2A9D5C" trend="up" icon={Activity} />
        <Kpi label="WAU" value="1,124" sub="90.1% of active users" color="#2A9D5C" />
        <Kpi label="MAU" value="2,341" sub="up from 1,987" color="#2A9D5C" trend="up" />
        <Kpi label="DAU/MAU stickiness" value="20.8%" sub="strong (15-20% target)" color="#2A9D5C" />
        <Kpi label="Avg session" value="8m 34s" sub="+1m vs last week" color="#2A9D5C" trend="up" />
        <Kpi label="D7 retention (founders)" value="72%" sub="industry median: 35%" color="#2A9D5C" />
        <Kpi label="D30 retention" value="48%" sub="strong" color="#2A9D5C" />
        <Kpi label="NPS" value="+62" sub="surveyed last 30d" color="#2A9D5C" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>Top product actions</h2>
          <p className="text-xs text-gray-500 mb-4">Last 7 days</p>
          {[
            { Icon: Eye, label: "Investor profile views", count: 14_823, color: "#2E6BAD" },
            { Icon: Send, label: "Decks shared", count: 412, color: "#2A9D5C" },
            { Icon: Eye, label: "Decks opened by VCs", count: 287, color: "#D4A017" },
            { Icon: Calendar, label: "Calls booked", count: 53, color: "#7c3aed" },
            { Icon: Zap, label: "Intro requests sent", count: 89, color: "#2E6BAD" },
            { Icon: MessageSquare, label: "Messages sent", count: 1_847, color: "#6b7280" },
          ].map((a) => (
            <div key={a.label} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${a.color}1A`, color: a.color }}>
                <a.Icon className="h-4 w-4" />
              </div>
              <p className="flex-1 text-sm font-medium" style={{ color: "#0F1A2E" }}>{a.label}</p>
              <p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{a.count.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>Cohort retention</h2>
          <p className="text-xs text-gray-500 mb-4">% of cohort returning each week</p>
          {[
            { week: "W1 cohort (Apr 1)", d1: 92, d7: 78, d14: 64, d30: 51 },
            { week: "W2 cohort (Apr 8)", d1: 94, d7: 81, d14: 67, d30: null },
            { week: "W3 cohort (Apr 15)", d1: 96, d7: 84, d14: null, d30: null },
            { week: "W4 cohort (Apr 22)", d1: 95, d7: null, d14: null, d30: null },
          ].map((c) => (
            <div key={c.week} className="py-2 border-b border-gray-100 last:border-0">
              <p className="text-xs text-gray-600 mb-1.5">{c.week}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {[c.d1, c.d7, c.d14, c.d30].map((v, i) => (
                  <div key={i} className="rounded-md text-center py-1.5 text-[11px] font-bold"
                    style={v == null ? { background: "#f9fafb", color: "#d1d5db" } : { background: `rgba(80,200,120,${0.05 + (v / 100) * 0.4})`, color: v >= 70 ? "#2A9D5C" : v >= 50 ? "#D4A017" : "#6b7280" }}>
                    {v == null ? "—" : `${v}%`}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-1.5 mt-2 text-[10px] text-gray-400 text-center">
            <span>D1</span><span>D7</span><span>D14</span><span>D30</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
function EventsView() {
  const events = [
    { title: "RoundDrop Pitch Night #1", date: "May 6", rsvps: 87, type: "virtual", featured: true },
    { title: "SF Pre-Seed Meetup", date: "May 14", rsvps: 42, type: "irl" },
    { title: "Fundraising Workshop", date: "May 20", rsvps: 124, type: "virtual", featured: true },
    { title: "NYC Founder Breakfast", date: "May 23", rsvps: 18, type: "irl" },
    { title: "Investor Mixer: Solo GPs", date: "Jun 3", rsvps: 31, type: "virtual" },
    { title: "Demo Day: Q2 Cohort", date: "Jun 23", rsvps: 156, type: "virtual", featured: true },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Events</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Manage events</h1>
        </div>
        <button onClick={demo("create new event")} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
          + New event
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Kpi label="Upcoming" value="12" />
        <Kpi label="RSVPs (total)" value="458" sub="+89 this week" color="#2A9D5C" />
        <Kpi label="Avg attendance rate" value="73%" sub="of RSVPs show up" color="#2A9D5C" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-[2fr_100px_100px_100px_60px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <div>Event</div><div>Date</div><div>Type</div><div>RSVPs</div><div></div>
        </div>
        {events.map((e) => (
          <div key={e.title} className="grid grid-cols-[2fr_100px_100px_100px_60px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
              <p className="font-bold" style={{ color: "#0F1A2E" }}>{e.title}</p>
              {e.featured ? <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: "rgba(232,192,38,0.12)", color: "#D4A017" }}>★</span> : null}
            </div>
            <div className="text-xs text-gray-600">{e.date}</div>
            <div><span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{e.type}</span></div>
            <div className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{e.rsvps}</div>
            <button onClick={demo(`edit event ${e.title}`)} className="text-xs font-semibold" style={{ color: "#2E6BAD" }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
function ResourcesView() {
  const items = [
    { title: "Pre-Seed Deck Template", cat: "Deck Templates", views: 1_847, downloads: 1_124 },
    { title: "SAFE vs. Convertible Note Primer", cat: "Term Sheets", views: 1_287, downloads: 0 },
    { title: "Pre-Seed Round Anatomy", cat: "Fundraising", views: 974, downloads: 0 },
    { title: "First 100 Customers Playbook", cat: "Growth", views: 642, downloads: 0 },
    { title: "First 10 Hires Playbook", cat: "Hiring", views: 587, downloads: 0 },
    { title: "Delaware C-Corp Checklist", cat: "Legal", views: 421, downloads: 318 },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Resources</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Manage resources</h1>
        </div>
        <button onClick={demo("upload new resource")} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
          + New resource
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Kpi label="Total resources" value="10" />
        <Kpi label="Views (last 30d)" value="5,758" sub="+18% WoW" color="#2A9D5C" trend="up" />
        <Kpi label="Top resource" value="Deck Template" sub="1,847 views" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_100px_100px_60px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <div>Title</div><div>Category</div><div>Views</div><div>Downloads</div><div></div>
        </div>
        {items.map((r) => (
          <div key={r.title} className="grid grid-cols-[2fr_1fr_100px_100px_60px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0">
            <div><p className="font-bold" style={{ color: "#0F1A2E" }}>{r.title}</p></div>
            <div className="text-xs"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">{r.cat}</span></div>
            <div className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{r.views.toLocaleString()}</div>
            <div className="text-sm text-gray-600">{r.downloads > 0 ? r.downloads.toLocaleString() : "—"}</div>
            <button onClick={demo(`edit ${r.title}`)} className="text-xs font-semibold" style={{ color: "#2E6BAD" }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
function SpvsView() {
  const spvs = [
    { operator: "Summit Seed Capital", co: "Tavita Health", target: 500_000, committed: 387_000, lps: 14, wired: 9, status: "Closing", days: 12, fee: 499 },
    { operator: "Wischoff Ventures", co: "Lumen Models", target: 750_000, committed: 250_000, lps: 8, wired: 3, status: "Building", days: 28, fee: 499 },
    { operator: "Summit Seed Capital", co: "CapTable.io", target: 250_000, committed: 250_000, lps: 11, wired: 11, status: "Closed", days: 0, fee: 499 },
    { operator: "Weekend Fund", co: "Slate Protocol", target: 500_000, committed: 425_000, lps: 17, wired: 14, status: "Closing", days: 6, fee: 499 },
    { operator: "1517 Fund Scout", co: "Arcadia Labs", target: 350_000, committed: 350_000, lps: 9, wired: 9, status: "Closed", days: 0, fee: 499 },
    { operator: "Hustle Fund Scout", co: "BalconyHQ", target: 200_000, committed: 145_000, lps: 12, wired: 7, status: "Building", days: 21, fee: 499 },
    { operator: "Soma Capital Scout", co: "Vaultic Supply", target: 400_000, committed: 380_000, lps: 16, wired: 13, status: "Closing", days: 4, fee: 499 },
  ];
  const totalLPs = spvs.reduce((s, x) => s + x.lps, 0);
  const totalWired = spvs.reduce((s, x) => s + x.wired, 0);
  const totalCommitted = spvs.reduce((s, x) => s + x.committed, 0);
  const totalTarget = spvs.reduce((s, x) => s + x.target, 0);
  const wireRate = totalLPs > 0 ? (totalWired / totalLPs) * 100 : 0;

  const topOperators = [
    { name: "Summit Seed Capital", spvs: 6, raised: 1_847_000, lps: 64 },
    { name: "Weekend Fund", spvs: 5, raised: 1_250_000, lps: 52 },
    { name: "Wischoff Ventures", spvs: 4, raised: 980_000, lps: 38 },
    { name: "Hustle Fund Scout", spvs: 4, raised: 720_000, lps: 41 },
    { name: "Soma Capital Scout", spvs: 3, raised: 950_000, lps: 33 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · SPVs</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Special Purpose Vehicles</h1>
          <p className="text-sm text-gray-500 mt-1">Per-deal syndicate tracking. {spvs.filter(s => s.status !== "Closed").length} active SPVs across {topOperators.length} operators.</p>
        </div>
        <button onClick={demo("export SPV roster CSV")} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">Export</button>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Active SPVs" value={`${spvs.filter(s => s.status !== "Closed").length}`} sub={`${spvs.length} all-time`} icon={Layers} />
        <Kpi label="LP capital tracked" value="$8.4M" sub={`avg ${fmt(totalCommitted / spvs.length)}/SPV`} icon={DollarSign} />
        <Kpi label="Total LPs" value={`${totalLPs}`} sub="+18 this month" color="#2A9D5C" trend="up" icon={Users} />
        <Kpi label="SPV revenue" value="$23.5K" sub="47 × $499 a la carte" color="#2A9D5C" icon={DollarSign} />
        <Kpi label="Wire success rate" value={`${wireRate.toFixed(0)}%`} sub="industry avg ~70%" color="#2A9D5C" icon={CheckCircle2} />
        <Kpi label="Avg SPV size" value={fmt(totalCommitted / spvs.length)} sub="median $325K" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* SPV table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-base font-bold" style={{ color: "#0F1A2E" }}>All SPVs</h2>
              <p className="text-xs text-gray-500 mt-0.5">{spvs.length} total · {spvs.filter(s => s.status === "Closing").length} closing this week</p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_120px_80px_100px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <div>Operator · Company</div><div>Committed / Target</div><div>LPs</div><div>Wired</div><div>Status</div>
          </div>
          {spvs.map((s, i) => {
            const pct = (s.committed / s.target) * 100;
            return (
              <button key={i} onClick={demo(`open SPV detail for ${s.co}`)} className="w-full text-left grid grid-cols-1 md:grid-cols-[1.5fr_1fr_120px_80px_100px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <div>
                  <p className="font-bold" style={{ color: "#0F1A2E" }}>{s.co}</p>
                  <p className="text-[11px] text-gray-500">{s.operator}</p>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{fmt(s.committed)} <span className="text-[11px] font-normal text-gray-500">/ {fmt(s.target)}</span></p>
                  <div className="h-1 rounded-full bg-gray-100 mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #E8C026, #50C878)" }} />
                  </div>
                </div>
                <div className="text-sm font-bold" style={{ color: "#0F1A2E" }}>{s.lps}</div>
                <div className="text-sm">
                  <span style={{ color: s.wired === s.lps ? "#2A9D5C" : "#0F1A2E" }} className="font-bold">{s.wired}</span>
                  <span className="text-[11px] text-gray-500">/{s.lps}</span>
                </div>
                <div>
                  <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={
                      s.status === "Closed" ? { background: "#f3f4f6", color: "#4b5563" } :
                      s.status === "Closing" ? { background: "rgba(232,192,38,0.15)", color: "#D4A017" } :
                      { background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }
                    }>
                    {s.status}{s.days > 0 ? ` · ${s.days}d` : ""}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Top operators leaderboard */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>Top SPV operators</h2>
          <p className="text-xs text-gray-500 mb-4">By LP capital raised</p>
          {topOperators.map((o, i) => (
            <div key={o.name} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-extrabold text-xs shrink-0"
                style={{ background: i === 0 ? "linear-gradient(135deg, #E8C026, #50C878)" : i === 1 ? "#2E6BAD" : "#6b7280" }}>
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#0F1A2E" }}>{o.name}</p>
                <p className="text-[11px] text-gray-500">{o.spvs} SPVs · {o.lps} LPs</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold" style={{ color: "#0F1A2E" }}>{fmt(o.raised)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By underlying company / status split */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>SPVs by underlying company stage</h2>
          <p className="text-xs text-gray-500 mb-4">Where the LP capital is going</p>
          <div className="flex h-9 rounded-lg overflow-hidden mb-4">
            <div style={{ width: "55%", background: "rgba(232,192,38,0.4)" }} className="flex items-center justify-center text-xs font-bold" >Pre-Seed 55%</div>
            <div style={{ width: "32%", background: "rgba(80,200,120,0.45)" }} className="flex items-center justify-center text-xs font-bold">Seed 32%</div>
            <div style={{ width: "13%", background: "rgba(46,107,173,0.25)" }} className="flex items-center justify-center text-[11px] font-bold">A 13%</div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div><p className="text-gray-500">Pre-Seed SPVs</p><p className="font-bold text-base" style={{ color: "#0F1A2E" }}>26 · $4.6M</p></div>
            <div><p className="text-gray-500">Seed SPVs</p><p className="font-bold text-base" style={{ color: "#0F1A2E" }}>15 · $2.7M</p></div>
            <div><p className="text-gray-500">Series A SPVs</p><p className="font-bold text-base" style={{ color: "#0F1A2E" }}>6 · $1.1M</p></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold mb-1" style={{ color: "#0F1A2E" }}>SPV pipeline</h2>
          <p className="text-xs text-gray-500 mb-4">Status across all SPVs</p>
          {[
            { label: "Building", count: 18, fill: "rgba(46,107,173,0.18)" },
            { label: "Open for commits", count: 14, fill: "rgba(232,192,38,0.25)" },
            { label: "Closing this week", count: 9, fill: "rgba(232,192,38,0.4)" },
            { label: "Wires due", count: 6, fill: "rgba(220,38,38,0.15)" },
            { label: "Closed", count: 14, fill: "linear-gradient(90deg, #E8C026, #50C878)" },
          ].map((p, i) => {
            const max = 18;
            return (
              <div key={p.label} className="flex items-center gap-2.5 mb-2">
                <span className="text-xs text-gray-500 w-32 shrink-0">{p.label}</span>
                <div className="flex-1 h-6 rounded-md bg-gray-50 relative overflow-hidden">
                  <div className="h-full rounded-md" style={{ width: `${(p.count / max) * 100}%`, background: p.fill }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">{p.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent SPV activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-bold mb-3" style={{ color: "#0F1A2E" }}>Recent SPV activity</h2>
        {[
          { color: "#50C878", text: "New SPV created: Summit Seed → BalconyHQ ($200K target, 12 LPs invited)", t: "1h ago" },
          { color: "#2E6BAD", text: "Wire received: Acme Family Office → $100K to Tavita Health SPV", t: "3h ago" },
          { color: "#D4A017", text: "Sub docs sent: Vaultic Supply SPV → 5 LPs via DocuSign", t: "6h ago" },
          { color: "#dc2626", text: "Wire overdue: Olivia Reyes → Tavita Health SPV ($32K, 4 days late)", t: "1d ago" },
          { color: "#50C878", text: "SPV closed: 1517 Fund Scout → Arcadia Labs ($350K, 9/9 wired)", t: "2d ago" },
          { color: "#7c3aed", text: "Subscription billed: Weekend Fund → $499 SPV fee for Slate Protocol", t: "3d ago" },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: a.color }} />
            <div className="flex-1 text-sm" style={{ color: "#0F1A2E" }}>{a.text}</div>
            <span className="text-[11px] text-gray-400 shrink-0">{a.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
