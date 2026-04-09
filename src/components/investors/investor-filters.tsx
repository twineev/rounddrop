"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SECTORS, STAGE_PREFERENCES } from "@/lib/constants";
import { Search } from "lucide-react";

const CHECK_SIZE_RANGES = [
  { label: "Any size", min: "", max: "" },
  { label: "Under $100K", min: "", max: "100000" },
  { label: "$100K - $500K", min: "100000", max: "500000" },
  { label: "$500K - $1M", min: "500000", max: "1000000" },
  { label: "$1M+", min: "1000000", max: "" },
];

export function InvestorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSectors = searchParams.get("sectors")?.split(",").filter(Boolean) || [];
  const currentStage = searchParams.get("stage") || "";
  const currentCheckMin = searchParams.get("checkMin") || "";
  const currentCheckMax = searchParams.get("checkMax") || "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/investors?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleSector = (sector: string) => {
    const next = currentSectors.includes(sector)
      ? currentSectors.filter((s) => s !== sector)
      : [...currentSectors, sector];
    updateParams({ sectors: next.join(",") });
  };

  const clearAll = () => {
    router.push("/investors");
  };

  const hasFilters = currentSectors.length > 0 || currentStage || currentCheckMin || currentCheckMax;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-green-600 hover:text-green-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Stage
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            onClick={() => updateParams({ stage: "" })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !currentStage
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {STAGE_PREFERENCES.map((stage) => (
            <button
              key={stage.value}
              onClick={() =>
                updateParams({ stage: currentStage === stage.value ? "" : stage.value })
              }
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                currentStage === stage.value
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Check Size
        </label>
        <div className="mt-2 flex flex-col gap-1.5">
          {CHECK_SIZE_RANGES.map((range) => {
            const isActive = currentCheckMin === range.min && currentCheckMax === range.max;
            return (
              <button
                key={range.label}
                onClick={() =>
                  updateParams({
                    checkMin: isActive ? "" : range.min,
                    checkMax: isActive ? "" : range.max,
                  })
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-medium text-left transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Sectors
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => toggleSector(sector)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                currentSectors.includes(sector)
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
