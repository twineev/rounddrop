"use client";

import { useState } from "react";
import Link from "next/link";
import { adminToggleInvestorClaimed } from "@/actions/admin";
import { toast } from "sonner";

interface Investor {
  id: string;
  firm_name: string | null;
  gp_name: string | null;
  slug: string | null;
  is_claimed: boolean;
  location: string | null;
  check_size_min: number;
  check_size_max: number;
}

const fmt = (a: number) => a >= 1_000_000 ? `$${(a / 1_000_000).toFixed(1)}M` : `$${Math.round(a / 1_000)}K`;

export function AdminInvestorsTable({ investors }: { investors: Investor[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const filtered = investors.filter(
    (i) =>
      !filter ||
      i.firm_name?.toLowerCase().includes(filter.toLowerCase()) ||
      i.gp_name?.toLowerCase().includes(filter.toLowerCase())
  );

  async function toggle(id: string, claimed: boolean) {
    setBusy(id);
    try {
      await adminToggleInvestorClaimed(id, claimed);
      toast.success(claimed ? "Marked claimed" : "Marked unclaimed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <input
        placeholder="Search by firm or GP..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_120px_120px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <div>Firm</div><div>Location</div><div>Check size</div><div>Status</div><div></div>
        </div>
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">No matches.</p>
        ) : (
          filtered.map((i) => (
            <div key={i.id} className="grid grid-cols-[2fr_1fr_1fr_120px_120px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0">
              <div>
                <p className="font-bold" style={{ color: "#0F1A2E" }}>{i.firm_name}</p>
                <p className="text-[11px] text-gray-500">{i.gp_name}</p>
              </div>
              <div className="text-xs text-gray-600">{i.location || "—"}</div>
              <div className="text-xs text-gray-600">{fmt(i.check_size_min)} – {fmt(i.check_size_max)}</div>
              <button
                disabled={busy === i.id}
                onClick={() => toggle(i.id, !i.is_claimed)}
                className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold w-fit"
                style={i.is_claimed
                  ? { background: "rgba(80,200,120,0.12)", color: "#2A9D5C", borderColor: "rgba(80,200,120,0.3)" }
                  : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }}
              >
                {i.is_claimed ? "Claimed" : "Unclaimed"}
              </button>
              {i.slug ? (
                <Link href={`/investors/${i.slug}`} target="_blank" className="text-xs font-semibold" style={{ color: "#2E6BAD" }}>View →</Link>
              ) : <span className="text-xs text-gray-400">no slug</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
