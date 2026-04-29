import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recent_checks } = await req.json();
  if (!Array.isArray(recent_checks)) {
    return NextResponse.json({ error: "recent_checks must be an array" }, { status: 400 });
  }

  // Cap at 20 entries, strip oversized fields
  const sanitized = recent_checks.slice(0, 20).map((c: Record<string, unknown>) => ({
    company_name: String(c.company_name || "").slice(0, 200),
    amount: c.amount ? String(c.amount).slice(0, 50) : undefined,
    stage: c.stage ? String(c.stage).slice(0, 50) : undefined,
    date: c.date ? String(c.date).slice(0, 50) : undefined,
    note: c.note ? String(c.note).slice(0, 500) : undefined,
  }));

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("clerk_user_id", userId)
    .single();
  if (!profile || profile.role !== "investor") {
    return NextResponse.json({ error: "Not an investor" }, { status: 403 });
  }

  const { error } = await supabase
    .from("investor_profiles")
    .update({ recent_checks: sanitized, updated_at: new Date().toISOString() })
    .eq("profile_id", profile.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
