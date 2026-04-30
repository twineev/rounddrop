import { createAdminClient } from "@/lib/supabase/admin";
import { AdminUsersTable } from "@/components/admin/admin-users-table";

export default async function AdminUsersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("profiles").select("id, full_name, role, is_verified, linkedin_url, onboarding_completed, created_at").order("created_at", { ascending: false });
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Users</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Users</h1>
        <p className="text-sm text-gray-500 mt-1">Toggle verified status. Verified users get a blue badge across the site.</p>
      </div>
      <AdminUsersTable users={data || []} />
    </div>
  );
}
