import Link from "next/link";
import { MOCK_FOUNDER_ROUNDS } from "@/lib/mock-data";
import { INSTRUMENT_TYPES, ROUND_STATUSES } from "@/lib/constants";
import { Plus, Eye, Heart, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DemoFounderRoundsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">My Rounds</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your fundraising rounds</p>
        </div>
        <Link
          href="/demo/founder/rounds/new"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
        >
          <Plus className="h-4 w-4" />
          New Round
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Views", value: "342", icon: Eye },
          { label: "Tracking", value: "28", icon: Bookmark },
          { label: "Interested", value: "12", icon: Heart },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 mb-2">
              <stat.icon className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {MOCK_FOUNDER_ROUNDS.map((round) => {
          const status = ROUND_STATUSES[round.status as keyof typeof ROUND_STATUSES];
          const instrument = INSTRUMENT_TYPES.find((t) => t.value === round.instrument_type);
          const progress = round.raise_amount > 0 ? Math.round((round.amount_raised / round.raise_amount) * 100) : 0;

          return (
            <Link key={round.id} href="/demo/founder/dashboard">
              <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">
                    {instrument?.label} — ${round.raise_amount.toLocaleString()}
                  </h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>${round.amount_raised.toLocaleString()} raised</span>
                    <span className="font-semibold text-gray-700">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full">
                    <div className="h-1.5 bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                  <span>Min check: ${round.min_check_size.toLocaleString()}</span>
                  <span>Close: {new Date(round.close_date).toLocaleDateString()}</span>
                  <span>Updated {formatDistanceToNow(new Date(round.updated_at), { addSuffix: true })}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
