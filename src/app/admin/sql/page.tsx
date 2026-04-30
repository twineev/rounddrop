import Link from "next/link";

export default function AdminSqlPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · SQL</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>SQL console</h1>
        <p className="text-sm text-gray-500 mt-1">For ad-hoc queries, use the Supabase SQL editor directly.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <p className="text-sm text-gray-700">
          Direct SQL execution from the admin app would require an exposed Postgres function or a custom RPC. For now, use:
        </p>
        <ul className="space-y-2 text-sm text-gray-700 ml-4 list-disc">
          <li>
            <Link href="https://supabase.com/dashboard" target="_blank" className="underline" style={{ color: "#2E6BAD" }}>
              Supabase Dashboard
            </Link>{" "}
            — Table Editor and SQL Editor
          </li>
          <li>
            The CRUD pages in this admin section for events, resources, users, and investors
          </li>
        </ul>
      </div>
    </div>
  );
}
