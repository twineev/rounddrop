import { createAdminClient } from "@/lib/supabase/admin";
import { AdminEventsTable } from "@/components/admin/admin-events-table";

export default async function AdminEventsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("events").select("*").order("starts_at", { ascending: true });
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Admin · Events</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#0F1A2E" }}>Manage events</h1>
        <p className="text-sm text-gray-500 mt-1">Create new events that show up at /events for all signed-in users.</p>
      </div>
      <AdminEventsTable events={data || []} />
    </div>
  );
}
