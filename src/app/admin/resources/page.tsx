import { createAdminClient } from "@/lib/supabase/admin";
import { AdminResourcesTable } from "@/components/admin/admin-resources-table";

export default async function AdminResourcesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Resources</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Manage resources</h1>
      </div>
      <AdminResourcesTable resources={data || []} />
    </div>
  );
}
