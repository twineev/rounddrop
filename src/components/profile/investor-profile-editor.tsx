"use client";

import { useState } from "react";
import { updateInvestorProfile } from "@/actions/profile-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Briefcase, Plus, Trash2 } from "lucide-react";

const SECTORS = [
  "SaaS", "AI/ML", "Fintech", "Healthcare", "Consumer", "Marketplace",
  "Developer Tools", "Climate", "Creator Economy", "E-commerce", "Cybersecurity",
  "Gaming", "Web3", "Biotech", "Other",
];

const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B+"];
const INVESTOR_TYPES = [
  { value: "angel", label: "Angel" },
  { value: "fund", label: "VC / Fund" },
  { value: "accelerator", label: "Accelerator" },
  { value: "family_office", label: "Family Office" },
  { value: "corporate", label: "Corporate VC" },
];

interface RecentCheck {
  company_name: string;
  amount?: string;
  stage?: string;
  date?: string;
  note?: string;
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{label}</label>
      {help && <p className="text-xs text-gray-500 mt-0.5 mb-1">{help}</p>}
      <div className={help ? "" : "mt-1"}>{children}</div>
    </div>
  );
}

const input = "block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";
const textarea = input + " resize-y min-h-[80px]";

export function InvestorProfileEditor({ profile }: { profile: Record<string, unknown> }) {
  const [state, setState] = useState(() => ({
    firm_name: (profile.firm_name as string) || "",
    gp_name: (profile.gp_name as string) || "",
    location: (profile.location as string) || "",
    linkedin_url: (profile.linkedin_url as string) || "",
    contact_email: (profile.contact_email as string) || "",
    investor_type: (profile.investor_type as string) || "fund",
    years_investing: (profile.years_investing as number) || "",
    main_markets: ((profile.main_markets as string[]) || []) as string[],
    sectors: ((profile.sectors as string[]) || []) as string[],
    stage_preference: ((profile.stage_preference as string[]) || []) as string[],
    check_size_min: (profile.check_size_min as number) || "",
    check_size_max: (profile.check_size_max as number) || "",
    thesis: (profile.thesis as string) || "",
    deck_criteria: (profile.deck_criteria as string) || "",
    founder_assessment: (profile.founder_assessment as string) || "",
    value_add: (profile.value_add as string) || "",
    fund_website: (profile.fund_website as string) || "",
    twitter_url: (profile.twitter_url as string) || "",
  }));
  const [recentChecks, setRecentChecks] = useState<RecentCheck[]>(
    (profile.recent_checks as RecentCheck[]) || []
  );
  const [marketInput, setMarketInput] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof state>(key: K, value: typeof state[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }
  function toggleArray(key: "sectors" | "stage_preference", v: string) {
    const cur = state[key];
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    set(key, next);
  }
  function addMarket() {
    const trimmed = marketInput.trim();
    if (trimmed && !state.main_markets.includes(trimmed)) {
      set("main_markets", [...state.main_markets, trimmed]);
      setMarketInput("");
    }
  }
  function removeMarket(m: string) {
    set("main_markets", state.main_markets.filter((x) => x !== m));
  }
  function addCheck() {
    setRecentChecks([...recentChecks, { company_name: "" }]);
  }
  function updateCheck(i: number, patch: Partial<RecentCheck>) {
    setRecentChecks(recentChecks.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }
  function removeCheck(i: number) {
    setRecentChecks(recentChecks.filter((_, idx) => idx !== i));
  }

  async function onSave() {
    setSaving(true);
    try {
      await updateInvestorProfile({
        ...state,
        years_investing: state.years_investing ? Number(state.years_investing) : null,
        check_size_min: state.check_size_min ? Number(state.check_size_min) : 0,
        check_size_max: state.check_size_max ? Number(state.check_size_max) : 0,
      });

      // recent_checks via a separate helper — update investor_profiles only with the JSON blob
      // Use updateInvestorProfile path for recent_checks by sending it through a second call is not needed;
      // extend action instead? For v1 we update via direct call:
      await fetch("/api/investor/recent-checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recent_checks: recentChecks.filter((c) => c.company_name.trim()) }),
      });

      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-bold" style={{ color: "#0F1A2E" }}>Investor details</h2>
      </div>

      {/* Identity */}
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Firm name">
          <input className={input} value={state.firm_name} onChange={(e) => set("firm_name", e.target.value)} placeholder="Acme Capital" />
        </Field>
        <Field label="Your name (GP)">
          <input className={input} value={state.gp_name} onChange={(e) => set("gp_name", e.target.value)} placeholder="Jane Doe" />
        </Field>
        <Field label="Location">
          <input className={input} value={state.location} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco, CA" />
        </Field>
        <Field label="Contact email">
          <input className={input} type="email" value={state.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="jane@acme.vc" />
        </Field>
        <Field label="LinkedIn profile">
          <input className={input} value={state.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="Investor type">
          <select className={input} value={state.investor_type} onChange={(e) => set("investor_type", e.target.value)}>
            {INVESTOR_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
      </div>

      {/* Investment focus */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Investment focus</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Years investing">
            <input className={input} type="number" value={state.years_investing} onChange={(e) => set("years_investing", e.target.value as unknown as number)} placeholder="5" />
          </Field>
          <Field label="Min check size ($)">
            <input className={input} type="number" value={state.check_size_min} onChange={(e) => set("check_size_min", e.target.value as unknown as number)} placeholder="25000" />
          </Field>
          <Field label="Max check size ($)">
            <input className={input} type="number" value={state.check_size_max} onChange={(e) => set("check_size_max", e.target.value as unknown as number)} placeholder="500000" />
          </Field>
        </div>
        <Field label="Main markets" help="Geographies or vertical markets you focus on.">
          <div className="flex gap-2 mb-2">
            <input
              className={input}
              value={marketInput}
              onChange={(e) => setMarketInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMarket(); } }}
              placeholder="e.g. US, LATAM, Europe, Healthcare"
            />
            <Button type="button" variant="outline" onClick={addMarket} className="gap-1"><Plus className="h-4 w-4" />Add</Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {state.main_markets.map((m) => (
              <span key={m} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}>
                {m}
                <button type="button" onClick={() => removeMarket(m)} className="hover:opacity-70"><Trash2 className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        </Field>
        <Field label="Sectors">
          <div className="flex flex-wrap gap-1.5">
            {SECTORS.map((s) => (
              <button type="button" key={s} onClick={() => toggleArray("sectors", s)} className="rounded-full px-3 py-1 text-xs font-medium"
                style={state.sectors.includes(s) ? { background: "rgba(80,200,120,0.15)", color: "#2A9D5C" } : { background: "#f3f4f6", color: "#6b7280" }}>
                {s}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Stage preference">
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <button type="button" key={s} onClick={() => toggleArray("stage_preference", s)} className="rounded-full px-3 py-1 text-xs font-medium"
                style={state.stage_preference.includes(s) ? { background: "rgba(232,192,38,0.15)", color: "#D4A017" } : { background: "#f3f4f6", color: "#6b7280" }}>
                {s}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Thesis + criteria */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Thesis & criteria</h3>
        <Field label="Investment thesis" help="What do you invest in and why?">
          <textarea className={textarea} value={state.thesis} onChange={(e) => set("thesis", e.target.value)} rows={3} />
        </Field>
        <Field label="What I look for in a pitch deck" help="Tell founders exactly what you want to see.">
          <textarea className={textarea} value={state.deck_criteria} onChange={(e) => set("deck_criteria", e.target.value)} rows={4} />
        </Field>
        <Field label="How I assess founders & companies" help="Your evaluation process.">
          <textarea className={textarea} value={state.founder_assessment} onChange={(e) => set("founder_assessment", e.target.value)} rows={4} />
        </Field>
        <Field label="Value add" help="What you bring beyond capital.">
          <textarea className={textarea} value={state.value_add} onChange={(e) => set("value_add", e.target.value)} rows={2} />
        </Field>
      </div>

      {/* Recent checks */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Recent checks written</h3>
          <Button type="button" variant="outline" size="sm" onClick={addCheck} className="gap-1"><Plus className="h-4 w-4" />Add check</Button>
        </div>
        {recentChecks.length === 0 && <p className="text-sm text-gray-500">No recent checks yet. Add a few so founders see you&apos;re active.</p>}
        {recentChecks.map((c, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
            <div className="grid md:grid-cols-2 gap-2">
              <input className={input} placeholder="Company name" value={c.company_name} onChange={(e) => updateCheck(i, { company_name: e.target.value })} />
              <input className={input} placeholder="Amount (e.g. $250K)" value={c.amount || ""} onChange={(e) => updateCheck(i, { amount: e.target.value })} />
              <input className={input} placeholder="Stage (Pre-Seed, Seed, etc.)" value={c.stage || ""} onChange={(e) => updateCheck(i, { stage: e.target.value })} />
              <input className={input} placeholder="Date (e.g. Mar 2026)" value={c.date || ""} onChange={(e) => updateCheck(i, { date: e.target.value })} />
            </div>
            <input className={input} placeholder="Quick note (optional)" value={c.note || ""} onChange={(e) => updateCheck(i, { note: e.target.value })} />
            <button type="button" onClick={() => removeCheck(i)} className="text-xs text-red-600 hover:underline">Remove</button>
          </div>
        ))}
      </div>

      {/* Links */}
      <div className="pt-4 border-t border-gray-100 grid md:grid-cols-2 gap-4">
        <Field label="Fund website">
          <input className={input} value={state.fund_website} onChange={(e) => set("fund_website", e.target.value)} placeholder="https://acme.vc" />
        </Field>
        <Field label="Twitter / X">
          <input className={input} value={state.twitter_url} onChange={(e) => set("twitter_url", e.target.value)} placeholder="https://x.com/yourhandle" />
        </Field>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <Button onClick={onSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
