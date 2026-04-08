import Link from "next/link";
import { Eye, Bookmark, Heart, MessageSquare, ArrowLeft, Calendar } from "lucide-react";

const MOCK_ACTIVITY = [
  { name: "David Chen", firm: "Precursor Ventures", action: "interested", time: "2 hours ago" },
  { name: "Sarah Kim", firm: "Angel", action: "tracked", time: "5 hours ago" },
  { name: "James Wright", firm: "Hustle Fund", action: "interested", time: "1 day ago" },
  { name: "Maria Santos", firm: "Backstage Capital", action: "tracked", time: "1 day ago" },
  { name: "Alex Turner", firm: "Angel", action: "viewed", time: "2 days ago" },
  { name: "Priya Gupta", firm: "Soma Capital", action: "interested", time: "3 days ago" },
];

const actionConfig: Record<string, { label: string; color: string }> = {
  interested: { label: "Interested", color: "bg-green-100 text-green-800" },
  tracked: { label: "Tracking", color: "bg-green-50 text-green-700" },
  viewed: { label: "Viewed", color: "bg-gray-100 text-gray-600" },
};

export default function DemoFounderDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/demo/founder/rounds" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">SAFE — $1,200,000</h1>
              <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">Live</span>
            </div>
            <p className="text-sm text-gray-500">Closes April 25, 2026</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">$864,000 of $1,200,000</span>
          <span className="font-semibold text-gray-900">72%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-green-500 rounded-full" style={{ width: "72%" }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Eye, label: "Views", value: "342", bg: "bg-gray-50", color: "text-gray-500" },
          { icon: Bookmark, label: "Tracking", value: "28", bg: "bg-green-50", color: "text-green-600" },
          { icon: Heart, label: "Interested", value: "12", bg: "bg-green-50", color: "text-green-600" },
          { icon: Calendar, label: "Calls Booked", value: "6", bg: "bg-green-50", color: "text-green-600" },
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

      {/* Activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-bold text-gray-900 mb-4">Investor Activity</h2>
        <div className="space-y-2">
          {MOCK_ACTIVITY.map((item, i) => {
            const config = actionConfig[item.action];
            return (
              <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-700 text-xs font-bold">
                    {item.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.firm}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.color}`}>{config.label}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
