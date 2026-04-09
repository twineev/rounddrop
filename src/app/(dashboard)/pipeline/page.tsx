import Link from "next/link";
import { getMyPipeline } from "@/actions/pipeline";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { MOCK_PIPELINE } from "@/lib/mock-data";
import { Target, ArrowRight } from "lucide-react";

const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

export default async function PipelinePage() {
  let entries: any[] = [];

  if (isPreview) {
    entries = MOCK_PIPELINE;
  } else {
    try {
      entries = await getMyPipeline();
    } catch {
      // Not authenticated or Supabase not configured
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-green-600 mb-1">Pipeline</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Fundraising Pipeline
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your outreach to investors
          </p>
        </div>
        <Link
          href="/investors"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
        >
          Browse investors
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 mb-4">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Your pipeline is empty
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Start building your fundraising pipeline by browsing the investor
            directory.
          </p>
          <Link
            href="/investors"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
          >
            Browse investors
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <PipelineBoard entries={entries} isPreview={isPreview} />
      )}
    </div>
  );
}
