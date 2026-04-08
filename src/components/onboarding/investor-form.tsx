"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { investorProfileSchema, type InvestorProfileInput } from "@/lib/validations/investor";
import { createInvestorProfile } from "@/actions/profiles";
import { SECTORS, INVESTOR_TYPES, STAGE_PREFERENCES, PORTFOLIO_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100 placeholder:text-gray-400";

const selectClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100";

export function InvestorForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<InvestorProfileInput>({
    resolver: zodResolver(investorProfileSchema),
    defaultValues: {
      sectors: [],
      stage_preference: [],
      portfolio_companies: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolio_companies",
  });

  function toggleSector(sector: string) {
    const updated = selectedSectors.includes(sector)
      ? selectedSectors.filter((s) => s !== sector)
      : [...selectedSectors, sector];
    setSelectedSectors(updated);
    setValue("sectors", updated, { shouldValidate: true });
  }

  function toggleStage(stage: string) {
    const updated = selectedStages.includes(stage)
      ? selectedStages.filter((s) => s !== stage)
      : [...selectedStages, stage];
    setSelectedStages(updated);
    setValue("stage_preference", updated as ("pre_seed" | "seed")[], {
      shouldValidate: true,
    });
  }

  async function onSubmit(data: InvestorProfileInput) {
    setLoading(true);
    try {
      await createInvestorProfile(data);
      toast.success("Profile created! Redirecting...");
      router.push("/deals");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Firm / Fund Name</label>
          <input
            className={inputClass}
            placeholder="Precursor Ventures (or leave blank for angel)"
            {...register("firm_name")}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Investor Type *</label>
          <select
            className={selectClass}
            onChange={(e) =>
              setValue("investor_type", e.target.value as InvestorProfileInput["investor_type"], {
                shouldValidate: true,
              })
            }
          >
            <option value="">Select type</option>
            {INVESTOR_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.investor_type && (
            <p className="text-xs text-red-500">{errors.investor_type.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">LinkedIn URL *</label>
        <input
          className={inputClass}
          placeholder="https://linkedin.com/in/yourprofile"
          {...register("linkedin_url")}
        />
        {errors.linkedin_url && (
          <p className="text-xs text-red-500">{errors.linkedin_url.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Min Check Size ($) *</label>
          <input
            className={inputClass}
            type="number"
            placeholder="5000"
            {...register("check_size_min", { valueAsNumber: true })}
          />
          {errors.check_size_min && (
            <p className="text-xs text-red-500">{errors.check_size_min.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Max Check Size ($) *</label>
          <input
            className={inputClass}
            type="number"
            placeholder="100000"
            {...register("check_size_max", { valueAsNumber: true })}
          />
          {errors.check_size_max && (
            <p className="text-xs text-red-500">{errors.check_size_max.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Sectors of Interest *</label>
        <div className="flex flex-wrap gap-1.5">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => toggleSector(sector)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedSectors.includes(sector)
                  ? "bg-purple-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-purple-300"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
        {errors.sectors && (
          <p className="text-xs text-red-500">{errors.sectors.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Stage Preference *</label>
        <div className="flex gap-2">
          {STAGE_PREFERENCES.map((stage) => (
            <button
              key={stage.value}
              type="button"
              onClick={() => toggleStage(stage.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                selectedStages.includes(stage.value)
                  ? "bg-purple-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-purple-300"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
        {errors.stage_preference && (
          <p className="text-xs text-red-500">{errors.stage_preference.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Investment Thesis</label>
        <textarea
          className={`${inputClass} min-h-[80px] resize-none`}
          placeholder="What excites you? What do you look for in founders and companies?"
          maxLength={1000}
          {...register("thesis")}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Value-Add</label>
        <textarea
          className={`${inputClass} min-h-[60px] resize-none`}
          placeholder="What do you bring beyond capital? (intros, ops help, hiring, domain expertise)"
          maxLength={500}
          {...register("value_add")}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Notable Exits</label>
        <input
          className={inputClass}
          placeholder="Company A (acquired by X), Company B (IPO)"
          {...register("notable_exits")}
        />
      </div>

      {/* Portfolio Companies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Portfolio Companies</label>
          <button
            type="button"
            onClick={() =>
              append({ company_name: "", round: "", check_size: null, year: null, status: null })
            }
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add Company
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Company {index + 1}</span>
              <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input className={inputClass} placeholder="Company name *" {...register(`portfolio_companies.${index}.company_name`)} />
              <input className={inputClass} placeholder="Round (e.g., Pre-seed, Seed)" {...register(`portfolio_companies.${index}.round`)} />
              <input className={inputClass} type="number" placeholder="Check size ($)" {...register(`portfolio_companies.${index}.check_size`, { valueAsNumber: true })} />
              <input className={inputClass} type="number" placeholder="Year" {...register(`portfolio_companies.${index}.year`, { valueAsNumber: true })} />
              <select
                className={selectClass}
                onChange={(e) =>
                  setValue(`portfolio_companies.${index}.status`, e.target.value as "active" | "exited" | "write_off")
                }
              >
                <option value="">Status</option>
                {PORTFOLIO_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-700 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
        Complete Profile
      </button>
    </form>
  );
}
