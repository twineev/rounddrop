import { notFound } from "next/navigation";
import Link from "next/link";
import { getRound, closeRound } from "@/actions/rounds";
import { getRoundInteractions } from "@/actions/interactions";
import { INSTRUMENT_TYPES } from "@/lib/constants";
import { Eye, Bookmark, Heart, MessageSquare, XCircle, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RoundDashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoundDashboardPage({ params }: RoundDashboardPageProps) {
  const { id } = await params;

  let round;
  try { round = await getRound(id); } catch { notFound(); }
  if (!round) notFound();

  const interactions = await getRoundInteractions(id);

  const stats = {
    views: interactions.filter((i) => i.action === "viewed").length,
    tracked: interactions.filter((i) => i.action === "tracked").length,
    interested: interactions.filter((i) => i.action === "interested").length,
    passed: interactions.filter((i) => i.action === "passed").length,
  };

  const instrument = INSTRUMENT_TYPES.find((t) => t.value === round.instrument_type);
  const progress = round.raise_amount > 0 ? Math.round((round.amount_raised / round.raise_amount) * 100) : 0;

  async function handleClose() {
    "use server";
    await closeRound(id);
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    live: "bg-green-50 text-green-700",
    closing: "bg-yellow-50 text-yellow-700",
    closed: "bg-red-50 text-red-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/rounds" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                {instrument?.label} — ${round.raise_amount.toLocaleString()}
              </h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[round.status] || ""}`}>
                {round.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Closes {new Date(round.close_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        {round.status !== "closed" && (
          <form action={handleClose}>
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100">
              <XCircle className="h-4 w-4" />
              Close Round
            </button>
          </form>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">${round.amount_raised.toLocaleString()} of ${round.raise_amount.toLocaleString()}</span>
          <span className="font-semibold text-gray-900">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Eye, label: "Views", value: stats.views, color: "text-gray-500", bg: "bg-gray-50" },
          { icon: Bookmark, label: "Tracking", value: stats.tracked, color: "text-green-600", bg: "bg-green-50" },
          { icon: Heart, label: "Interested", value: stats.interested, color: "text-green-600", bg: "bg-green-50" },
          { icon: MessageSquare, label: "Engaged", value: stats.interested + stats.tracked, color: "text-green-600", bg: "bg-green-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Investor Activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-bold text-gray-900 mb-4">Investor Activity</h2>
        {interactions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No investor activity yet. Your round will start getting traction once it&apos;s live!
          </p>
        ) : (
          <div className="space-y-2">
            {interactions
              .filter((i) => i.action !== "viewed")
              .map((interaction) => {
                const investor = interaction.investor_profiles as unknown as {
                  firm_name: string | null;
                  investor_type: string;
                  profiles: { full_name: string; avatar_url: string | null };
                };

                const actionConfig: Record<string, { label: string; color: string }> = {
                  tracked: { label: "Tracking", color: "bg-green-50 text-green-700" },
                  interested: { label: "Interested", color: "bg-green-100 text-green-800" },
                  passed: { label: "Passed", color: "bg-gray-100 text-gray-600" },
                };

                const config = actionConfig[interaction.action] || { label: interaction.action, color: "bg-gray-100 text-gray-600" };

                return (
                  <div key={interaction.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-700 text-xs font-bold">
                        {investor?.profiles?.full_name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{investor?.profiles?.full_name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{investor?.firm_name || investor?.investor_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.color}`}>{config.label}</span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(interaction.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
