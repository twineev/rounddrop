import Link from "next/link";
import { Rocket, TrendingUp, ArrowRight } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-xl w-full space-y-8 text-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-1.5 text-sm font-medium text-yellow-700 mb-6">
            Interactive Demo
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-4">
            Experience RoundDrop
          </h1>
          <p className="mt-3 text-gray-500">
            Walk through the platform as a founder or investor — no account needed
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/demo/founder/rounds">
            <div className="rounded-xl border-[1.5px] border-gray-200 bg-white p-6 pt-0 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 text-left">
              <div className="h-1 bg-green-500 -mx-6 mb-6" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 mb-3">
                <Rocket className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Founder Demo</h3>
              <p className="text-sm text-gray-500 mb-4">
                See how founders create rounds, track interest, and manage their raise
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                Start <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link href="/demo/investor/deals">
            <div className="rounded-xl border-[1.5px] border-gray-200 bg-white p-6 pt-0 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 text-left">
              <div className="h-1 bg-purple-500 -mx-6 mb-6" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 mb-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Investor Demo</h3>
              <p className="text-sm text-gray-500 mb-4">
                Browse deals, view traction, triage rounds, and manage your portfolio
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600">
                Start <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
