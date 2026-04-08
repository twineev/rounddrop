"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { founderProfileSchema, type FounderProfileInput } from "@/lib/validations/founder";
import { createFounderProfile } from "@/actions/profiles";
import { SECTORS } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100 placeholder:text-gray-400";

export function FounderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [accelerators, setAccelerators] = useState<string[]>([]);
  const [acceleratorInput, setAcceleratorInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FounderProfileInput>({
    resolver: zodResolver(founderProfileSchema),
    defaultValues: {
      sector: [],
      accelerator_affiliations: [],
    },
  });

  function toggleSector(sector: string) {
    const updated = selectedSectors.includes(sector)
      ? selectedSectors.filter((s) => s !== sector)
      : [...selectedSectors, sector];
    setSelectedSectors(updated);
    setValue("sector", updated, { shouldValidate: true });
  }

  function addAccelerator() {
    const trimmed = acceleratorInput.trim();
    if (trimmed && !accelerators.includes(trimmed)) {
      const updated = [...accelerators, trimmed];
      setAccelerators(updated);
      setValue("accelerator_affiliations", updated);
      setAcceleratorInput("");
    }
  }

  function removeAccelerator(acc: string) {
    const updated = accelerators.filter((a) => a !== acc);
    setAccelerators(updated);
    setValue("accelerator_affiliations", updated);
  }

  async function onSubmit(data: FounderProfileInput) {
    setLoading(true);
    try {
      await createFounderProfile(data);
      toast.success("Profile created! Redirecting...");
      router.push("/rounds");
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
          <label className="text-sm font-medium text-gray-700">Company Name *</label>
          <input className={inputClass} placeholder="Acme Inc." {...register("company_name")} />
          {errors.company_name && (
            <p className="text-xs text-red-500">{errors.company_name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Website</label>
          <input className={inputClass} placeholder="https://acme.com" {...register("company_website")} />
          {errors.company_website && (
            <p className="text-xs text-red-500">{errors.company_website.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">One-liner *</label>
        <textarea
          className={`${inputClass} min-h-[80px] resize-none`}
          placeholder="What does your company do in one sentence?"
          maxLength={200}
          {...register("one_liner")}
        />
        {errors.one_liner && (
          <p className="text-xs text-red-500">{errors.one_liner.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Sector *</label>
        <div className="flex flex-wrap gap-1.5">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => toggleSector(sector)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedSectors.includes(sector)
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-green-300"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
        {errors.sector && (
          <p className="text-xs text-red-500">{errors.sector.message}</p>
        )}
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

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Calendar Link *</label>
        <input
          className={inputClass}
          placeholder="https://calendly.com/yourname/30min"
          {...register("calendar_link")}
        />
        <p className="text-xs text-gray-400">
          Calendly, Cal.com, or SavvyCal link so investors can book calls directly
        </p>
        {errors.calendar_link && (
          <p className="text-xs text-red-500">{errors.calendar_link.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Accelerator / Affiliations</label>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="YC S24, Techstars, etc."
            value={acceleratorInput}
            onChange={(e) => setAcceleratorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAccelerator();
              }
            }}
          />
          <button
            type="button"
            onClick={addAccelerator}
            className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Add
          </button>
        </div>
        {accelerators.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {accelerators.map((acc) => (
              <span
                key={acc}
                className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
              >
                {acc}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-green-900"
                  onClick={() => removeAccelerator(acc)}
                />
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
        Complete Profile
      </button>
    </form>
  );
}
