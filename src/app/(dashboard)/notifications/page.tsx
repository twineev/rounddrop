import Link from "next/link";
import { getNotifications, markAllAsRead } from "@/actions/notifications";
import {
  Bell,
  CheckCheck,
  Eye,
  Download,
  Calendar,
  Star,
  BookOpen,
  Send,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";

interface NotifTemplate {
  Icon: typeof Bell;
  bg: string;
  color: string;
  category: "investor" | "meeting" | "event" | "deck" | "intro" | "resource" | "general";
}

const TYPE_TEMPLATES: Record<string, NotifTemplate> = {
  profile_view: { Icon: Eye, bg: "rgba(46,107,173,0.12)", color: "#2E6BAD", category: "investor" },
  view: { Icon: Eye, bg: "rgba(46,107,173,0.12)", color: "#2E6BAD", category: "investor" },
  deck_view: { Icon: Eye, bg: "rgba(46,107,173,0.12)", color: "#2E6BAD", category: "deck" },
  deck_download: { Icon: Download, bg: "rgba(80,200,120,0.12)", color: "#2A9D5C", category: "deck" },
  deck_shared: { Icon: Send, bg: "rgba(80,200,120,0.12)", color: "#2A9D5C", category: "deck" },
  call_booked: { Icon: Calendar, bg: "rgba(232,192,38,0.12)", color: "#D4A017", category: "meeting" },
  call_confirmed: { Icon: Calendar, bg: "#f3f4f6", color: "#6b7280", category: "meeting" },
  event_rsvp: { Icon: Star, bg: "rgba(232,192,38,0.12)", color: "#D4A017", category: "event" },
  new_resources: { Icon: BookOpen, bg: "rgba(80,200,120,0.12)", color: "#2A9D5C", category: "resource" },
  intro_request: { Icon: UserPlus, bg: "rgba(46,107,173,0.12)", color: "#2E6BAD", category: "intro" },
  interest: { Icon: TrendingUp, bg: "rgba(80,200,120,0.12)", color: "#2A9D5C", category: "investor" },
  new_message: { Icon: Send, bg: "#f3f4f6", color: "#6b7280", category: "general" },
};

interface Action { label: string; href: string; primary?: boolean; }

function getActions(type: string, metadata: Record<string, unknown>): Action[] {
  switch (type) {
    case "profile_view":
    case "view":
      return [
        { label: "View profile", href: (metadata?.profile_url as string) || "/connections" },
        { label: "Request an intro", href: "/connections" },
      ];
    case "deck_view":
    case "deck_download":
      return [
        { label: "See engagement", href: "/rounds" },
        { label: "Send follow-up", href: "/messages", primary: true },
      ];
    case "call_booked":
      return [
        { label: "Open calendar", href: (metadata?.calendar_link as string) || "#" },
        { label: "Reschedule", href: "/messages" },
      ];
    case "event_rsvp":
      return [
        { label: "Add to Google Calendar", href: (metadata?.gcal_link as string) || "/events" },
        { label: "Event details", href: "/events" },
      ];
    case "new_resources":
      return [{ label: "Browse resources", href: "/resources" }];
    case "intro_request":
      return [
        { label: "Accept", href: "/messages", primary: true },
        { label: "Decline", href: "/messages" },
      ];
    default:
      return [];
  }
}

function bucket(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 7) return "Earlier this week";
  if (days < 30) return "This month";
  return "Older";
}

export default async function NotificationsPage() {
  let notifications: Awaited<ReturnType<typeof getNotifications>> = [];
  try { notifications = await getNotifications(); } catch { /* preview */ }

  async function handleMarkAllRead() {
    "use server";
    await markAllAsRead();
  }

  const unread = notifications.filter((n) => !n.read_at).length;
  const grouped: Record<string, typeof notifications> = {};
  for (const n of notifications) {
    const k = bucket(n.created_at);
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(n);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Notifications</p>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>What&apos;s happening</h1>
          <p className="text-sm text-gray-500 mt-1">Investor activity, deck views, meetings, events, and resources.</p>
        </div>
        <form action={handleMarkAllRead}>
          <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        </form>
      </div>

      {/* Filter chips */}
      <div className="inline-flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
        <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold shadow-sm" style={{ color: "#0F1A2E" }}>
          All <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">{notifications.length}</span>
        </span>
        <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 cursor-pointer">
          Unread <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px]">{unread}</span>
        </span>
        <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 cursor-pointer">Investors</span>
        <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 cursor-pointer">Meetings</span>
        <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 cursor-pointer">Events</span>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl mb-4" style={{ background: "rgba(80,200,120,0.1)" }}>
            <Bell className="h-6 w-6" style={{ color: "#2A9D5C" }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: "#0F1A2E" }}>No notifications</h3>
          <p className="text-sm text-gray-500 mt-1">You&apos;re all caught up!</p>
        </div>
      ) : (
        Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">{group}</p>
            <div className="space-y-2">
              {items.map((n) => {
                const t = TYPE_TEMPLATES[n.type] || { Icon: Bell, bg: "#f3f4f6", color: "#6b7280", category: "general" as const };
                const Icon = t.Icon;
                const isUnread = !n.read_at;
                const actions = getActions(n.type, (n.metadata as Record<string, unknown>) || {});
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3.5 rounded-xl border p-4 transition-all ${
                      isUnread
                        ? "bg-[rgba(80,200,120,0.03)]"
                        : "border-gray-200 bg-white"
                    }`}
                    style={isUnread ? { borderColor: "rgba(80,200,120,0.25)" } : undefined}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: t.bg, color: t.color }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug" style={{ color: "#0F1A2E" }}>{n.title}</p>
                      {n.body ? <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{n.body}</p> : null}
                      {actions.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {actions.map((a, i) => (
                            <Link
                              key={i}
                              href={a.href}
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold ${
                                a.primary
                                  ? "text-white"
                                  : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              }`}
                              style={a.primary ? { background: "linear-gradient(135deg, #E8C026, #50C878)" } : undefined}
                            >
                              {a.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: false })}
                    </span>
                    {isUnread ? (
                      <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: "#50C878" }} />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
