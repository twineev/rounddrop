import { createAdminClient } from "@/lib/supabase/admin";
import { AdminInvestorsTable } from "@/components/admin/admin-investors-table";

export default async function AdminInvestorsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("investor_profiles")
    .select("id, firm_name, gp_name, slug, is_claimed, location, check_size_min, check_size_max")
    .order("firm_name", { ascending: true });
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Investors</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Investor profiles</h1>
        <p className="text-sm text-gray-500 mt-1">Toggle claimed status. Add new investor profiles via the bulk import script.</p>
      </div>
      <AdminInvestorsTable investors={data || []} />
    </div>
  );
}
