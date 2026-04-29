import { getUpcomingEvents } from "@/actions/events-resources";
import { Calendar, MapPin, ExternalLink, Video } from "lucide-react";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>
          Events
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>
          Upcoming events
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pitch nights, investor meetups, and founder-only events.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <h3 className="font-bold text-gray-900">No upcoming events yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            We&apos;re curating the best founder and investor events. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <a
              key={event.id}
              href={event.url || "#"}
              target={event.url ? "_blank" : undefined}
              rel={event.url ? "noopener noreferrer" : undefined}
              className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all"
            >
              {event.cover_image_url && (
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {event.event_type === "virtual" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5" style={{ background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}>
                      <Video className="h-3 w-3" />
                      Virtual
                    </span>
                  ) : event.event_type === "irl" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5" style={{ background: "rgba(80,200,120,0.12)", color: "#2A9D5C" }}>
                      <MapPin className="h-3 w-3" />
                      In Person
                    </span>
                  ) : null}
                  {event.is_featured && (
                    <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{ background: "rgba(232,192,38,0.12)", color: "#D4A017" }}>
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{formatDate(event.starts_at)}</p>
                {event.location && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </p>
                )}
                {event.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                )}
                {event.url && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: "#2E6BAD" }}>
                    View event <ExternalLink className="h-3 w-3" />
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
