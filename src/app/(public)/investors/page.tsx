import { Suspense } from "react";
import { getInvestorDirectory } from "@/actions/investors";
import { InvestorCard } from "@/components/investors/investor-card";
import { InvestorFilters } from "@/components/investors/investor-filters";
import { MOCK_INVESTORS } from "@/lib/mock-data";
import { Building2 } from "lucide-react";

const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

interface InvestorsPageProps {
  searchParams: Promise<{
    sectors?: string;
    stage?: string;
    checkMin?: string;
    checkMax?: string;
  }>;
}

export default async function InvestorsPage({ searchParams }: InvestorsPageProps) {
  const params = await searchParams;
  const filters = {
    sectors: params.sectors?.split(",").filter(Boolean),
    stage: params.stage || undefined,
    checkSizeMin: params.checkMin ? parseInt(params.checkMin) : undefined,
    checkSizeMax: params.checkMax ? parseInt(params.checkMax) : undefined,
  };

  let investors: any[] = [];

  if (isPreview) {
    investors = MOCK_INVESTORS;
    // Apply filters to mock data
    if (filters.sectors && filters.sectors.length > 0) {
      investors = investors.filter((inv: any) =>
        filters.sectors!.some((s) => inv.sectors.includes(s))
      );
    }
    if (filters.stage) {
      investors = investors.filter((inv: any) =>
        inv.stage_preference.includes(filters.stage)
      );
    }
    if (filters.checkSizeMin) {
      investors = investors.filter(
        (inv: any) => inv.check_size_max >= filters.checkSizeMin!
      );
    }
    if (filters.checkSizeMax) {
      investors = investors.filter(
        (inv: any) => inv.check_size_min <= filters.checkSizeMax!
      );
    }
  } else {
    try {
      investors = await getInvestorDirectory(filters);
    } catch {
      // Supabase not configured
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-green-600 mb-1">
          Investor Directory
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Find the right investors
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse pre-seed and seed investors. Share your deck directly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Suspense>
          <InvestorFilters />
        </Suspense>
        <div>
          {investors.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 mb-4">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No investors match your filters
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {investors.map((investor: any) => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
