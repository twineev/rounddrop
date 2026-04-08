import { getNotifications, markAllAsRead } from "@/actions/notifications";
import { Bell, CheckCheck, Heart, MessageSquare, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  interest: Heart,
  new_message: MessageSquare,
  view: Eye,
};

export default async function NotificationsPage() {
  let notifications: Awaited<ReturnType<typeof getNotifications>> = [];
  try { notifications = await getNotifications(); } catch { /* preview */ }

  async function handleMarkAllRead() {
    "use server";
    await markAllAsRead();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-green-600 mb-1">Notifications</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Stay updated</h1>
        </div>
        <form action={handleMarkAllRead}>
          <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        </form>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 mb-4">
            <Bell className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No notifications</h3>
          <p className="text-sm text-gray-500 mt-1">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
            const isUnread = !notification.read_at;

            return (
              <div
                key={notification.id}
                className={`rounded-xl border p-4 transition-all ${
                  isUnread
                    ? "border-green-200 bg-green-50/30"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${isUnread ? "bg-green-100" : "bg-gray-100"}`}>
                    <Icon className={`h-4 w-4 ${isUnread ? "text-green-600" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${isUnread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                      {notification.title}
                    </p>
                    {notification.body && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{notification.body}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
