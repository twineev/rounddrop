"use client";

import { useState } from "react";
import { updateFounderProfile } from "@/actions/profile-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Building2 } from "lucide-react";

const SECTORS = [
  "SaaS", "AI/ML", "Fintech", "Healthcare", "Consumer", "Marketplace",
  "Developer Tools", "Climate", "Creator Economy", "E-commerce", "Cybersecurity",
  "Gaming", "Web3", "Biotech", "Other",
];

const STAGES = ["Idea", "Pre-Seed", "Seed", "Series A", "Series B+"];
const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "calendar", label: "Book a call" },
];

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

export function FounderProfileEditor({ profile }: { profile: Record<string, unknown> }) {
  const [state, setState] = useState(() => ({
    full_name: (profile.full_name as string) || "",
    email: (profile.email as string) || "",
    linkedin_url: (profile.linkedin_url as string) || "",
    company_name: (profile.company_name as string) || "",
    year_founded: (profile.year_founded as number) || "",
    description: (profile.description as string) || "",
    one_liner: (profile.one_liner as string) || "",
    stage: (profile.stage as string) || "",
    sector: ((profile.sector as string[]) || []) as string[],
    company_website: (profile.company_website as string) || "",
    mrr: (profile.mrr as number) || "",
    arr: (profile.arr as number) || "",
    traction_notes: (profile.traction_notes as string) || "",
    intro_video_url: (profile.intro_video_url as string) || "",
    onepager_url: (profile.onepager_url as string) || "",
    pitch_deck_url: (profile.pitch_deck_url as string) || "",
    calendar_link: (profile.calendar_link as string) || "",
    best_contact_method: (profile.best_contact_method as string) || "email",
  }));
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof state>(key: K, value: typeof state[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function toggleSector(s: string) {
    const next = state.sector.includes(s)
      ? state.sector.filter((x) => x !== s)
      : [...state.sector, s];
    set("sector", next);
  }

  async function onSave() {
    setSaving(true);
    try {
      await updateFounderProfile({
        ...state,
        year_founded: state.year_founded ? Number(state.year_founded) : null,
        mrr: state.mrr ? Number(state.mrr) : null,
        arr: state.arr ? Number(state.arr) : null,
        best_contact_method: state.best_contact_method as "email" | "linkedin" | "calendar",
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
        <Building2 className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-bold" style={{ color: "#0F1A2E" }}>Founder details</h2>
      </div>

      {/* Personal */}
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Full name">
          <input className={input} value={state.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Jane Founder" />
        </Field>
        <Field label="Email">
          <input className={input} type="email" value={state.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.com" />
        </Field>
        <Field label="LinkedIn profile" help="https://linkedin.com/in/yourhandle">
          <input className={input} value={state.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="Best way to contact">
          <select className={input} value={state.best_contact_method} onChange={(e) => set("best_contact_method", e.target.value)}>
            {CONTACT_METHODS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Company */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Company</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Company name">
            <input className={input} value={state.company_name} onChange={(e) => set("company_name", e.target.value)} />
          </Field>
          <Field label="Year founded">
            <input className={input} type="number" value={state.year_founded} onChange={(e) => set("year_founded", e.target.value as unknown as number)} placeholder="2024" />
          </Field>
          <Field label="Website">
            <input className={input} value={state.company_website} onChange={(e) => set("company_website", e.target.value)} placeholder="https://yourcompany.com" />
          </Field>
          <Field label="Stage">
            <select className={input} value={state.stage} onChange={(e) => set("stage", e.target.value)}>
              <option value="">Select…</option>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="One-liner" help="A crisp 1-sentence description investors scan first.">
          <input className={input} value={state.one_liner} onChange={(e) => set("one_liner", e.target.value)} placeholder="We help X do Y by Z." />
        </Field>
        <Field label="Description" help="What are you building and why now?">
          <textarea className={textarea} value={state.description} onChange={(e) => set("description", e.target.value)} rows={4} />
        </Field>
        <Field label="Sectors" help="Pick all that apply.">
          <div className="flex flex-wrap gap-1.5">
            {SECTORS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSector(s)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                style={state.sector.includes(s)
                  ? { background: "rgba(80,200,120,0.15)", color: "#2A9D5C" }
                  : { background: "#f3f4f6", color: "#6b7280" }}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Traction */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Traction & growth</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="MRR ($)">
            <input className={input} type="number" value={state.mrr} onChange={(e) => set("mrr", e.target.value as unknown as number)} placeholder="42000" />
          </Field>
          <Field label="ARR ($)">
            <input className={input} type="number" value={state.arr} onChange={(e) => set("arr", e.target.value as unknown as number)} placeholder="500000" />
          </Field>
        </div>
        <Field label="Traction notes" help="Users, retention, partnerships, growth rate, unit economics — anything you'd tell an investor.">
          <textarea className={textarea} value={state.traction_notes} onChange={(e) => set("traction_notes", e.target.value)} rows={4} />
        </Field>
      </div>

      {/* Media */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Intro video & documents</h3>
        <Field label="Intro video URL" help="Loom, YouTube, Vimeo — ~60 seconds about you and the company.">
          <input className={input} value={state.intro_video_url} onChange={(e) => set("intro_video_url", e.target.value)} placeholder="https://loom.com/share/..." />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Pitch deck URL" help="Google Drive, DocSend, Notion, etc.">
            <input className={input} value={state.pitch_deck_url} onChange={(e) => set("pitch_deck_url", e.target.value)} placeholder="https://docsend.com/..." />
          </Field>
          <Field label="One-pager URL">
            <input className={input} value={state.onepager_url} onChange={(e) => set("onepager_url", e.target.value)} />
          </Field>
        </div>
        <Field label="Calendar link" help="Calendly, SavvyCal, Cal.com — for a 'Book a call' CTA.">
          <input className={input} value={state.calendar_link} onChange={(e) => set("calendar_link", e.target.value)} placeholder="https://cal.com/..." />
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
