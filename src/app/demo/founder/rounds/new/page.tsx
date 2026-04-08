"use client";

import { useState } from "react";
import { INSTRUMENT_TYPES, TRACTION_METRIC_OPTIONS } from "@/lib/constants";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const inputClass = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100 placeholder:text-gray-400";
const selectClass = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100";
const STEPS = ["Round Terms", "Traction", "Materials", "Social Proof", "Review"];

export default function DemoCreateRoundPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["mrr", "growth_rate_pct"]);

  function toggleMetric(key: string) {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-green-600 mb-1">New Round</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Create a Round Drop</h1>
        <p className="text-gray-500 text-sm mt-1">Package your round and get it in front of investors</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            {STEPS.map((s, i) => (
              <span key={s} className={i <= step ? "text-green-600 font-semibold" : ""}>{s}</span>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div className="h-1.5 bg-green-500 rounded-full transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Instrument Type *</label>
              <select className={selectClass} defaultValue="safe">
                {INSTRUMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Target Raise ($) *</label>
                <input className={inputClass} type="number" defaultValue="1500000" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Already Raised ($)</label>
                <input className={inputClass} type="number" defaultValue="350000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Valuation Cap ($)</label>
                <input className={inputClass} type="number" defaultValue="10000000" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                <input className={inputClass} type="number" defaultValue="20" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Minimum Check Size ($) *</label>
              <input className={inputClass} type="number" defaultValue="10000" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Select metrics that apply</label>
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
              const defaults: Record<string, string> = { mrr: "42000", growth_rate_pct: "38", users: "1200" };
              return (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{metric.label}</label>
                  <input className={inputClass} type="number" defaultValue={defaults[key] || ""} placeholder={`Enter ${metric.label.toLowerCase()}`} />
                </div>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Pitch Deck (PDF) *</label>
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <span className="flex-1 text-sm text-green-700">my-startup-deck-v3.pdf</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">One-Pager URL</label>
              <input className={inputClass} defaultValue="https://docs.google.com/document/d/1abc..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Demo / Video Link</label>
              <input className={inputClass} defaultValue="https://loom.com/share/demo-xyz" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Round Close Date *</label>
              <input className={inputClass} type="date" defaultValue="2026-05-15" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Existing Investors</label>
              <div className="flex flex-wrap gap-1.5">
                {["First Round Capital", "Naval Ravikant"].map((inv) => (
                  <span key={inv} className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{inv}</span>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Visibility</label>
              <select className={selectClass} defaultValue="public">
                <option value="public">Public Feed</option>
                <option value="invite_only">Invite Only</option>
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Review Your Round Drop</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Instrument</span><p className="font-semibold text-gray-900">SAFE</p></div>
              <div><span className="text-gray-500">Target Raise</span><p className="font-semibold text-gray-900">$1,500,000</p></div>
              <div><span className="text-gray-500">Valuation Cap</span><p className="font-semibold text-gray-900">$10,000,000</p></div>
              <div><span className="text-gray-500">Discount</span><p className="font-semibold text-gray-900">20%</p></div>
              <div><span className="text-gray-500">Min Check</span><p className="font-semibold text-gray-900">$10,000</p></div>
              <div><span className="text-gray-500">Close Date</span><p className="font-semibold text-gray-900">May 15, 2026</p></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">Traction</span>
              <div className="flex gap-4 mt-1">
                <div className="text-xs"><span className="text-gray-500">MRR</span><p className="font-semibold text-gray-900">$42,000</p></div>
                <div className="text-xs"><span className="text-gray-500">Growth</span><p className="font-semibold text-gray-900">38% MoM</p></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">Investors</span>
              <div className="flex gap-1.5 mt-1">
                {["First Round Capital", "Naval Ravikant"].map((inv) => (
                  <span key={inv} className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">{inv}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                toast.success("Round dropped! (Demo mode)");
                router.push("/demo/founder/dashboard");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
            >
              <Check className="h-4 w-4" /> Drop Round
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
