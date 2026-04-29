import { getResources } from "@/actions/events-resources";
import { BookOpen, ExternalLink, FileText, Scale, TrendingUp, Users, Sparkles } from "lucide-react";

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  deck_template: { label: "Deck Templates", icon: FileText, color: "#D4A017", bg: "rgba(232,192,38,0.12)" },
  fundraising: { label: "Fundraising", icon: Sparkles, color: "#2A9D5C", bg: "rgba(80,200,120,0.12)" },
  term_sheet: { label: "Term Sheets", icon: Scale, color: "#2E6BAD", bg: "rgba(46,107,173,0.1)" },
  legal: { label: "Legal", icon: Scale, color: "#6b7280", bg: "#f3f4f6" },
  hiring: { label: "Hiring", icon: Users, color: "#2A9D5C", bg: "rgba(80,200,120,0.12)" },
  growth: { label: "Growth", icon: TrendingUp, color: "#D4A017", bg: "rgba(232,192,38,0.12)" },
  other: { label: "Other", icon: BookOpen, color: "#6b7280", bg: "#f3f4f6" },
};

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>
          Resources
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>
          Fundraising toolkit
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Deck templates, term sheet primers, fundraising guides, and more — curated for pre-seed and seed founders.
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <h3 className="font-bold text-gray-900">Resources coming soon</h3>
          <p className="text-sm text-gray-500 mt-1">
            We&apos;re putting together the best fundraising resources. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => {
            const meta = CATEGORY_META[r.category || "other"] || CATEGORY_META.other;
            const Icon = meta.icon;
            return (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {r.is_featured && (
                    <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{ background: "rgba(232,192,38,0.12)", color: "#D4A017" }}>
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                  {r.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                {r.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{r.description}</p>
                )}
                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#2E6BAD" }}>
                  Open resource <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
