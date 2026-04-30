import { createAdminClient } from "@/lib/supabase/admin";
import { Users, Building2, Rocket, Send, MessageSquare, Calendar, BookOpen, ShieldCheck } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const supabase = createAdminClient();
  const tables = ["profiles", "founder_profiles", "investor_profiles", "round_drops", "deck_shares", "messages", "events", "resources"];
  const counts = await Promise.all(
    tables.map((t) =>
      supabase
        .from(t)
        .select("*", { count: "exact", head: true })
        .then((r) => r.count || 0)
    )
  );
  const [profiles, founders, investors, rounds, deckShares, messages, events, resources] = counts;

  // Verified counts
  const { count: verified } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", true);

  const { count: claimedInvestors } = await supabase
    .from("investor_profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_claimed", true);

  return {
    profiles, founders, investors, rounds, deckShares, messages, events, resources,
    verified: verified || 0,
    claimedInvestors: claimedInvestors || 0,
  };
}

function Tile({ label, value, icon: Icon, href }: { label: string; value: number; icon: React.ElementType; href?: string }) {
  const inner = (
    <div className="rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-5 w-5 text-gray-400" />
        <p className="text-3xl font-extrabold" style={{ color: "#0F1A2E" }}>{value.toLocaleString()}</p>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Top-level platform stats. All counts are live.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Tile label="Users" value={stats.profiles} icon={Users} href="/admin/users" />
        <Tile label="Founders" value={stats.founders} icon={Rocket} />
        <Tile label="Investor profiles" value={stats.investors} icon={Building2} href="/admin/investors" />
        <Tile label="Live rounds" value={stats.rounds} icon={Rocket} />
        <Tile label="Deck shares" value={stats.deckShares} icon={Send} />
        <Tile label="Messages" value={stats.messages} icon={MessageSquare} />
        <Tile label="Events" value={stats.events} icon={Calendar} href="/admin/events" />
        <Tile label="Resources" value={stats.resources} icon={BookOpen} href="/admin/resources" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4" style={{ color: "#2E6BAD" }} />
            <h2 className="text-sm font-bold" style={{ color: "#0F1A2E" }}>Verification</h2>
          </div>
          <p className="text-2xl font-extrabold" style={{ color: "#0F1A2E" }}>
            {stats.verified} <span className="text-sm font-medium text-gray-500">/ {stats.profiles} verified</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{stats.profiles > 0 ? Math.round((stats.verified / stats.profiles) * 100) : 0}% of users have a verified badge.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4" style={{ color: "#2A9D5C" }} />
            <h2 className="text-sm font-bold" style={{ color: "#0F1A2E" }}>Investor profiles</h2>
          </div>
          <p className="text-2xl font-extrabold" style={{ color: "#0F1A2E" }}>
            {stats.claimedInvestors} <span className="text-sm font-medium text-gray-500">/ {stats.investors} claimed</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{stats.investors - stats.claimedInvestors} unclaimed (admin-seeded) profiles in the directory.</p>
        </div>
      </div>
    </div>
  );
}
