"use client";

import { useState } from "react";
import { adminCreateEvent, adminDeleteEvent } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string | null;
  location: string | null;
  url: string | null;
  starts_at: string;
  audience: string;
  is_featured: boolean;
}

const inp = "block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";

export function AdminEventsTable({ events }: { events: Event[] }) {
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_type: "virtual" as "virtual" | "irl" | "hybrid",
    location: "",
    url: "",
    starts_at: "",
    audience: "both" as "founder" | "investor" | "both",
    is_featured: false,
  });

  async function handleCreate() {
    if (!form.title || !form.starts_at) {
      toast.error("Title and start time required");
      return;
    }
    setBusy(true);
    try {
      await adminCreateEvent(form);
      toast.success("Event created");
      setForm({ ...form, title: "", description: "", location: "", url: "", starts_at: "" });
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    try {
      await adminDeleteEvent(id);
      toast.success("Deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "New event"}
        </button>
      </div>

      {showForm ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 col-span-2">Title<input className={inp + " mt-1 normal-case font-normal text-gray-900"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Type<select className={inp + " mt-1 normal-case font-normal text-gray-900"} value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value as "virtual" | "irl" | "hybrid" })}><option value="virtual">Virtual</option><option value="irl">In Person</option><option value="hybrid">Hybrid</option></select></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Audience<select className={inp + " mt-1 normal-case font-normal text-gray-900"} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as "founder" | "investor" | "both" })}><option value="both">Both</option><option value="founder">Founders</option><option value="investor">Investors</option></select></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Starts at (ISO datetime)<input className={inp + " mt-1 normal-case font-normal text-gray-900"} type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Location<input className={inp + " mt-1 normal-case font-normal text-gray-900"} placeholder="(blank if virtual)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 col-span-2">URL<input className={inp + " mt-1 normal-case font-normal text-gray-900"} placeholder="https://lu.ma/..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 col-span-2">Description<textarea className={inp + " mt-1 normal-case font-normal text-gray-900"} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="flex items-center gap-2 col-span-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
          </div>
          <button disabled={busy} onClick={handleCreate} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "#0F1A2E" }}>{busy ? "Creating..." : "Create event"}</button>
        </div>
      ) : null}

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_120px_60px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <div>Title</div><div>Starts</div><div>Type · Audience</div><div>Featured</div><div></div>
        </div>
        {events.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">No events yet.</p>
        ) : (
          events.map((e) => (
            <div key={e.id} className="grid grid-cols-[2fr_1fr_1fr_120px_60px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0">
              <div>
                <p className="font-bold" style={{ color: "#0F1A2E" }}>{e.title}</p>
                {e.location ? <p className="text-[11px] text-gray-500">{e.location}</p> : null}
              </div>
              <div className="text-xs text-gray-600">{new Date(e.starts_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
              <div className="text-xs text-gray-600">{e.event_type} · {e.audience}</div>
              <div>{e.is_featured ? <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(232,192,38,0.12)", color: "#D4A017" }}>Featured</span> : <span className="text-xs text-gray-400">—</span>}</div>
              <button onClick={() => handleDelete(e.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
