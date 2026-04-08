"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roundDropSchema, type RoundDropInput } from "@/lib/validations/founder";
import { createRound, publishRound } from "@/actions/rounds";
import { INSTRUMENT_TYPES, TRACTION_METRIC_OPTIONS } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2, Upload, X, ArrowLeft, ArrowRight, Check } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100 placeholder:text-gray-400";

const selectClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100";

const STEPS = ["Round Terms", "Traction", "Materials", "Social Proof", "Review"];

export function RoundForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [investors, setInvestors] = useState<string[]>([]);
  const [investorInput, setInvestorInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RoundDropInput>({
    resolver: zodResolver(roundDropSchema),
    defaultValues: {
      instrument_type: "safe",
      traction_metrics: {},
      existing_investors: [],
      visibility: "public",
    },
  });

  const formValues = watch();

  function toggleMetric(key: string) {
    const updated = selectedMetrics.includes(key)
      ? selectedMetrics.filter((m) => m !== key)
      : [...selectedMetrics, key];
    setSelectedMetrics(updated);
    if (!updated.includes(key)) {
      const metrics = { ...formValues.traction_metrics } as Record<string, number>;
      delete metrics[key];
      setValue("traction_metrics", metrics);
    }
  }

  function addInvestor() {
    const trimmed = investorInput.trim();
    if (trimmed && !investors.includes(trimmed)) {
      const updated = [...investors, trimmed];
      setInvestors(updated);
      setValue("existing_investors", updated);
      setInvestorInput("");
    }
  }

  function removeInvestor(name: string) {
    const updated = investors.filter((i) => i !== name);
    setInvestors(updated);
    setValue("existing_investors", updated);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/pitch-deck", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      const { path, filename } = await res.json();
      setValue("pitch_deck_url", path);
      setValue("pitch_deck_filename", filename);
      toast.success("Deck uploaded!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function nextStep() {
    const stepFields: Record<number, (keyof RoundDropInput)[]> = {
      0: ["instrument_type", "raise_amount", "min_check_size"],
      1: [],
      2: [],
      3: ["close_date"],
    };
    const fields = stepFields[step];
    if (fields && fields.length > 0) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(data: RoundDropInput) {
    setLoading(true);
    try {
      const round = await createRound(data);
      await publishRound(round.id);
      toast.success("Round dropped! Your round is now live.");
      router.push(`/rounds/${round.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const instrumentType = watch("instrument_type");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          {STEPS.map((s, i) => (
            <span key={s} className={i <= step ? "text-green-600 font-semibold" : ""}>
              {s}
            </span>
          ))}
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full">
          <div
            className="h-1.5 bg-green-500 rounded-full transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Round Terms */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Instrument Type *</label>
            <select
              className={selectClass}
              value={formValues.instrument_type}
              onChange={(e) =>
                setValue("instrument_type", e.target.value as RoundDropInput["instrument_type"], { shouldValidate: true })
              }
            >
              {INSTRUMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Target Raise ($) *</label>
              <input className={inputClass} type="number" placeholder="1500000" {...register("raise_amount", { valueAsNumber: true })} />
              {errors.raise_amount && <p className="text-xs text-red-500">{errors.raise_amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Already Raised ($)</label>
              <input className={inputClass} type="number" placeholder="0" {...register("amount_raised", { valueAsNumber: true })} />
            </div>
          </div>

          {(instrumentType === "safe" || instrumentType === "safe_mfn" || instrumentType === "convertible_note") && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Valuation Cap ($)</label>
                <input className={inputClass} type="number" placeholder="10000000" {...register("valuation_cap", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                <input className={inputClass} type="number" placeholder="20" {...register("discount_percent", { valueAsNumber: true })} />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Minimum Check Size ($) *</label>
            <input className={inputClass} type="number" placeholder="5000" {...register("min_check_size", { valueAsNumber: true })} />
            {errors.min_check_size && <p className="text-xs text-red-500">{errors.min_check_size.message}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Traction */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Select the metrics that apply</label>
            <div className="flex flex-wrap gap-1.5">
              {TRACTION_METRIC_OPTIONS.map((metric) => (
                <button
                  key={metric.key}
                  type="button"
                  onClick={() => toggleMetric(metric.key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedMetrics.includes(metric.key)
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-green-300"
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>

          {selectedMetrics.map((key) => {
            const metric = TRACTION_METRIC_OPTIONS.find((m) => m.key === key);
            if (!metric) return null;
            return (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {"prefix" in metric && metric.prefix}{metric.label}{"suffix" in metric && ` (${metric.suffix})`}
                </label>
                <input
                  className={inputClass}
                  type="number"
                  placeholder={`Enter ${metric.label.toLowerCase()}`}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      const metrics = { ...(formValues.traction_metrics as Record<string, number>) };
                      metrics[key] = val;
                      setValue("traction_metrics", metrics);
                    }
                  }}
                />
              </div>
            );
          })}

          {selectedMetrics.length === 0 && (
            <p className="text-sm text-gray-400">Select at least one metric to show investors your traction</p>
          )}
        </div>
      )}

      {/* Step 3: Materials */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Pitch Deck (PDF) *</label>
            {formValues.pitch_deck_filename ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <span className="flex-1 text-sm text-green-700">{formValues.pitch_deck_filename}</span>
                <button
                  type="button"
                  onClick={() => { setValue("pitch_deck_url", null); setValue("pitch_deck_filename", null); }}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-8 transition-all hover:border-green-300 hover:bg-green-50/30">
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
                <span className="text-sm text-gray-500">
                  {uploading ? "Uploading..." : "Click to upload your pitch deck (PDF, max 20MB)"}
                </span>
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">One-Pager URL</label>
            <input className={inputClass} placeholder="https://docs.google.com/..." {...register("one_pager_url")} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Demo / Video Link</label>
            <input className={inputClass} placeholder="https://loom.com/..." {...register("demo_link")} />
          </div>
        </div>
      )}

      {/* Step 4: Social Proof */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Round Close Date *</label>
            <input className={inputClass} type="date" {...register("close_date")} />
            {errors.close_date && <p className="text-xs text-red-500">{errors.close_date.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Existing Investors in This Round</label>
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Investor name"
                value={investorInput}
                onChange={(e) => setInvestorInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInvestor(); } }}
              />
              <button
                type="button"
                onClick={addInvestor}
                className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Add
              </button>
            </div>
            {investors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {investors.map((inv) => (
                  <span key={inv} className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {inv}
                    <X className="h-3 w-3 cursor-pointer hover:text-green-900" onClick={() => removeInvestor(inv)} />
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Visibility</label>
            <select
              className={selectClass}
              value={formValues.visibility || "public"}
              onChange={(e) => setValue("visibility", e.target.value as "public" | "invite_only")}
            >
              <option value="public">Public Feed</option>
              <option value="invite_only">Invite Only</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Review Your Round Drop</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Instrument</span>
                <p className="font-semibold text-gray-900">
                  {INSTRUMENT_TYPES.find((t) => t.value === formValues.instrument_type)?.label}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Target Raise</span>
                <p className="font-semibold text-gray-900">${formValues.raise_amount?.toLocaleString()}</p>
              </div>
              {formValues.valuation_cap && (
                <div>
                  <span className="text-gray-500">Valuation Cap</span>
                  <p className="font-semibold text-gray-900">${formValues.valuation_cap.toLocaleString()}</p>
                </div>
              )}
              {formValues.discount_percent && (
                <div>
                  <span className="text-gray-500">Discount</span>
                  <p className="font-semibold text-gray-900">{formValues.discount_percent}%</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Min Check</span>
                <p className="font-semibold text-gray-900">${formValues.min_check_size?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Close Date</span>
                <p className="font-semibold text-gray-900">{formValues.close_date}</p>
              </div>
            </div>

            {formValues.pitch_deck_filename && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Pitch Deck</span>
                <p className="text-sm font-semibold text-gray-900">{formValues.pitch_deck_filename}</p>
              </div>
            )}

            {investors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Existing Investors</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {investors.map((inv) => (
                    <span key={inv} className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">{inv}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Drop Round
          </button>
        )}
      </div>
    </form>
  );
}
