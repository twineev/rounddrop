"use client";

import { useRouter } from "next/navigation";
import { setUserRole } from "@/actions/profiles";
import { Rocket, TrendingUp } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  async function handleRoleSelect(role: "founder" | "investor") {
    await setUserRole(role);
    router.push(`/onboarding/${role}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 mb-6">
            Round<span className="text-green-600">Drop</span>
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome to RoundDrop
          </h1>
          <p className="mt-2 text-gray-500">
            How are you looking to use the platform?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div
            className="cursor-pointer rounded-xl border-[1.5px] border-gray-200 bg-white p-7 pt-0 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
            onClick={() => handleRoleSelect("founder")}
          >
            <div className="h-1 bg-green-500 -mx-7 mb-7" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 mb-4">
              <Rocket className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">I&apos;m raising a round</h3>
            <p className="text-sm text-gray-500 mb-5">
              Drop your round to verified investors
            </p>
            <ul className="space-y-2">
              {[
                "Publish your round to vetted investors",
                "Track who's interested in real-time",
                "Let investors book calls directly",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="cursor-pointer rounded-xl border-[1.5px] border-gray-200 bg-white p-7 pt-0 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
            onClick={() => handleRoleSelect("investor")}
          >
            <div className="h-1 bg-purple-500 -mx-7 mb-7" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 mb-4">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">I&apos;m looking to invest</h3>
            <p className="text-sm text-gray-500 mb-5">
              Get curated deal flow every week
            </p>
            <ul className="space-y-2">
              {[
                "Browse curated deal flow",
                "Book calls with founders directly",
                "Track and manage your pipeline",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
