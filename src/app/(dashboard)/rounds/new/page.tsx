import { RoundForm } from "@/components/rounds/round-form";

export default function NewRoundPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-green-600 mb-1">New Round</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Create a Round Drop</h1>
        <p className="text-gray-500 text-sm mt-1">
          Package your round and get it in front of the right investors
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <RoundForm />
      </div>
    </div>
  );
}
