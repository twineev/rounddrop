import { FounderForm } from "@/components/onboarding/founder-form";

export default function FounderOnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 mb-4">
            Round<span className="text-green-600">Drop</span>
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Set up your founder profile
          </h1>
          <p className="mt-2 text-gray-500">
            Tell investors about your company so they can find you
          </p>
        </div>
        <div className="rounded-xl border-[1.5px] border-gray-200 bg-white p-8 pt-0 overflow-hidden">
          <div className="h-1 bg-green-500 -mx-8 mb-8" />
          <FounderForm />
        </div>
      </div>
    </div>
  );
}
