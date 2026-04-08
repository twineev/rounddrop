import { Suspense } from "react";
import { getLiveRounds } from "@/actions/rounds";
import { DealFeed } from "@/components/deals/deal-feed";
import { DealFilters } from "@/components/deals/deal-filters";
import { MOCK_ROUNDS } from "@/lib/mock-data";

const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

interface DealsPageProps {
  searchParams: Promise<{
    sectors?: string;
    instrument?: string;
    minRaise?: string;
    maxRaise?: string;
  }>;
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const filters = {
    sectors: params.sectors?.split(",").filter(Boolean),
    instrumentType: params.instrument || undefined,
    minRaise: params.minRaise ? parseInt(params.minRaise) : undefined,
    maxRaise: params.maxRaise ? parseInt(params.maxRaise) : undefined,
  };

  let rounds: unknown[] = [];

  if (isPreview) {
    rounds = MOCK_ROUNDS;
    // Apply filters to mock data
    if (filters.sectors && filters.sectors.length > 0) {
      rounds = rounds.filter((r: any) =>
        filters.sectors!.some((s) => r.founder_profiles.sector.includes(s))
      );
    }
    if (filters.instrumentType) {
      rounds = rounds.filter((r: any) => r.instrument_type === filters.instrumentType);
    }
    if (filters.minRaise) {
      rounds = rounds.filter((r: any) => r.raise_amount >= filters.minRaise!);
    }
    if (filters.maxRaise) {
      rounds = rounds.filter((r: any) => r.raise_amount <= filters.maxRaise!);
    }
  } else {
    try {
      rounds = await getLiveRounds(filters);
    } catch {
      // Supabase not configured
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-green-600 mb-1">Deal Feed</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Discover rounds
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pre-seed and seed rounds from vetted founders
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Suspense>
          <DealFilters />
        </Suspense>
        <DealFeed rounds={rounds as Parameters<typeof DealFeed>[0]["rounds"]} />
      </div>
    </div>
  );
}
