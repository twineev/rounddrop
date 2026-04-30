"use client";

import { useState } from "react";
import { adminToggleVerified } from "@/actions/admin";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  role: string | null;
  is_verified: boolean;
  linkedin_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

export function AdminUsersTable({ users }: { users: User[] }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(id: string, verified: boolean) {
    setBusy(id);
    try {
      await adminToggleVerified(id, verified);
      toast.success(verified ? "Verified ✓" : "Unverified");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="grid grid-cols-[2fr_100px_120px_140px_140px] gap-3 px-4 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        <div>Name</div><div>Role</div><div>Onboarded</div><div>Joined</div><div>Verified</div>
      </div>
      {users.length === 0 ? (
        <p className="p-6 text-center text-sm text-gray-500">No users yet.</p>
      ) : (
        users.map((u) => (
          <div key={u.id} className="grid grid-cols-[2fr_100px_120px_140px_140px] gap-3 px-4 py-3 items-center text-sm border-b border-gray-100 last:border-0">
            <div>
              <p className="font-bold" style={{ color: "#0F1A2E" }}>{u.full_name}</p>
              {u.linkedin_url ? <a href={u.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[11px] truncate block" style={{ color: "#2E6BAD" }}>{u.linkedin_url}</a> : null}
            </div>
            <div>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{u.role || "—"}</span>
            </div>
            <div className="text-xs text-gray-500">{u.onboarding_completed ? "✓" : "Pending"}</div>
            <div className="text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
            <button
              disabled={busy === u.id}
              onClick={() => toggle(u.id, !u.is_verified)}
              className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold w-fit"
              style={u.is_verified
                ? { background: "rgba(46,107,173,0.1)", color: "#2E6BAD", borderColor: "rgba(46,107,173,0.3)" }
                : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {u.is_verified ? "Verified" : "Unverified"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
