import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getMyPlatformConnections,
  getSuggestedConnections,
} from "@/actions/platform-connections";
import { ConnectionsManager } from "@/components/profile/connections-manager";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { Users, MessageSquare, Plus, Sparkles, Link2 } from "lucide-react";
import Link from "next/link";

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function relativeDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function ConnectionsPage() {
  const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");
  if (isPreview) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-gray-500">Connections page is disabled in preview mode.</p>
      </div>
    );
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, linkedin_url")
    .eq("clerk_user_id", userId)
    .single();
  if (!profile) redirect("/onboarding");

  const [platform, suggested, linkedinConns] = await Promise.all([
    getMyPlatformConnections().catch(() => []),
    getSuggestedConnections(6).catch(() => []),
    supabase
      .from("user_connections")
      .select("id, linkedin_url, full_name, headline")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(500)
      .then((r) => r.data || []),
  ]);

  const investors = platform.filter((p) => p.role === "investor");
  const founders = platform.filter((p) => p.role === "founder");

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Network</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Your connections</h1>
        <p className="text-sm text-gray-500 mt-1">
          People you&apos;ve connected with on RoundDrop and from your LinkedIn network.
        </p>
      </div>

      {/* On RoundDrop */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#0F1A2E" }}>
              <Users className="h-4 w-4 text-gray-400" />
              On RoundDrop
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                {platform.length}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Founders and investors you&apos;ve interacted with on the platform.
            </p>
          </div>
          {platform.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgba(80,200,120,0.12)", color: "#2A9D5C" }}>All {platform.length}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">Investors {investors.length}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">Founders {founders.length}</span>
            </div>
          )}
        </div>

        {platform.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">No platform connections yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Connect by sharing decks, accepting intros, or RSVPing to events together.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {platform.map((c) => {
              const subtitle =
                c.role === "founder"
                  ? c.company_name || "Founder"
                  : c.role === "investor"
                  ? `${c.gp_name ? c.gp_name + " · " : ""}${c.firm_name || "Investor"}`
                  : "";
              return (
                <div key={c.profile_id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 hover:border-green-300 hover:shadow-sm transition-all">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
                    {initials(c.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate flex items-center gap-1" style={{ color: "#0F1A2E" }}>
                      {c.full_name}
                      {c.is_verified && <VerifiedBadge size="xs" showLabel={false} />}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Connected {relativeDate(c.created_at)}</p>
                  </div>
                  <Link href="/messages" className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-green-400 hover:text-green-700">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggested */}
      {suggested.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#0F1A2E" }}>
                <Sparkles className="h-4 w-4 text-gray-400" />
                Suggested for you
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Based on mutual connections in your imported LinkedIn network.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggested.map((s) => {
              const subtitle =
                s.role === "founder"
                  ? s.company_name || "Founder"
                  : s.role === "investor"
                  ? `${s.gp_name ? s.gp_name + " · " : ""}${s.firm_name || "Investor"}`
                  : "";
              return (
                <div key={s.profile_id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm bg-gray-400">
                    {initials(s.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "#0F1A2E" }}>{s.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#2E6BAD" }}>
                      {s.mutual_count} mutual connection{s.mutual_count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}>
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LinkedIn import */}
      <ConnectionsManager
        connections={linkedinConns}
        linkedinUrl={(profile.linkedin_url as string | null) || ""}
      />
    </div>
  );
}
