"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SECTORS, INSTRUMENT_TYPES } from "@/lib/constants";
import { X } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100 placeholder:text-gray-400";

const selectClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100";

export function DealFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSectors = searchParams.get("sectors")?.split(",").filter(Boolean) || [];
  const instrumentType = searchParams.get("instrument") || "";
  const minRaise = searchParams.get("minRaise") || "";
  const maxRaise = searchParams.get("maxRaise") || "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/deals?${params.toString()}`);
  }

  function toggleSector(sector: string) {
    const updated = activeSectors.includes(sector)
      ? activeSectors.filter((s) => s !== sector)
      : [...activeSectors, sector];
    updateParams("sectors", updated.join(","));
  }

  function clearFilters() {
    router.push("/deals");
  }

  const hasFilters = activeSectors.length > 0 || instrumentType || minRaise || maxRaise;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500">Sectors</label>
        <div className="flex flex-wrap gap-1.5">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => toggleSector(sector)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                activeSectors.includes(sector)
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-green-300"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500">Instrument</label>
        <select
          className={selectClass}
          value={instrumentType}
          onChange={(e) => updateParams("instrument", e.target.value === "all" ? "" : e.target.value)}
        >
          <option value="all">Any</option>
          {INSTRUMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Min Raise ($)</label>
          <input
            type="number"
            placeholder="0"
            value={minRaise}
            onChange={(e) => updateParams("minRaise", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Max Raise ($)</label>
          <input
            type="number"
            placeholder="Any"
            value={maxRaise}
            onChange={(e) => updateParams("maxRaise", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
