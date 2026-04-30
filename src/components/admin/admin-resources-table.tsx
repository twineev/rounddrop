"use client";

import { useState } from "react";
import { adminCreateResource, adminDeleteResource } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  url: string;
  audience: string;
  is_featured: boolean;
}

const inp = "block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";
const CATS = ["deck_template", "fundraising", "term_sheet", "legal", "hiring", "growth", "other"] as const;

export function AdminResourcesTable({ resources }: { resources: Resource[] }) {
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "fundraising" as typeof CATS[number],
    url: "",
    audience: "both" as "founder" | "investor" | "both",
    is_featured: false,
  });

  async function handleCreate() {
    if (!form.title || !form.url) { toast.error("Title and URL required"); return; }
    setBusy(true);
    try {
      await adminCreateResource(form);
      toast.success("Resource added");
      setForm({ ...form, title: "", description: "", url: "" });
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete?")) return;
    try { await adminDeleteResource(id); toast.success("Deleted"); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
          <Plus className="h-4 w-4" />{showForm ? "Cancel" : "New resource"}
        </button>
      </div>
      {showForm ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 col-span-2">Title<input className={inp + " mt-1 normal-case font-normal text-gray-900"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Category<select className={inp + " mt-1 normal-case font-normal text-gray-900"} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as typeof CATS[number] })}>{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Audience<select className={inp + " mt-1 normal-case font-normal text-gray-900"} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as "founder" | "investor" | "both" })}><option value="both">Both</option><option value="founder">Founders</option><option value="investor">Investors</option></select></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 col-span-2">URL<input className={inp + " mt-1 normal-case font-normal text-gray-900"} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 col-span-2">Description<textarea className={inp + " mt-1 normal-case font-normal text-gray-900"} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="flex items-center gap-2 col-span-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
          </div>
          <button disabled={busy} onClick={handleCreate} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "#0F1A2E" }}>{busy ? "Adding..." : "Add resource"}</button>
        </div>
      ) : null}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_120px_60px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <div>Title</div><div>Category · Audience</div><div>Featured</div><div></div>
        </div>
        {resources.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">No resources yet.</p>
        ) : (
          resources.map((r) => (
            <div key={r.id} className="grid grid-cols-[2fr_1fr_120px_60px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0">
              <div><p className="font-bold" style={{ color: "#0F1A2E" }}>{r.title}</p>{r.description ? <p className="text-[11px] text-gray-500 line-clamp-1">{r.description}</p> : null}</div>
              <div className="text-xs text-gray-600">{r.category} · {r.audience}</div>
              <div>{r.is_featured ? <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(232,192,38,0.12)", color: "#D4A017" }}>Featured</span> : <span className="text-xs text-gray-400">—</span>}</div>
              <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
