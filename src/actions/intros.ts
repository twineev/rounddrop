"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Founder requests the current viewer (an investor) to introduce them to
 * another investor on the platform. Sends a notification to the recipient
 * investor so they know an intro is being requested.
 */
export async function requestIntro(input: {
  fromFounderProfileId: string;
  toInvestorProfileId: string;
  viaInvestorProfileId: string;
  message?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const supabase = createAdminClient();

  // Resolve the "via" investor's underlying profile_id (Clerk-linked) so we
  // can send them a notification.
  const { data: viaInvestor } = await supabase
    .from("investor_profiles")
    .select("profile_id, firm_name, gp_name")
    .eq("id", input.viaInvestorProfileId)
    .single();

  const { data: toInvestor } = await supabase
    .from("investor_profiles")
    .select("firm_name, gp_name")
    .eq("id", input.toInvestorProfileId)
    .single();

  const { data: founder } = await supabase
    .from("founder_profiles")
    .select("company_name, full_name")
    .eq("id", input.fromFounderProfileId)
    .single();

  // Only send a notification if the via-investor has a claimed profile.
  if (viaInvestor?.profile_id) {
    await supabase.from("notifications").insert({
      profile_id: viaInvestor.profile_id,
      type: "intro_request",
      title: `${founder?.full_name || founder?.company_name || "A founder"} wants an intro to ${toInvestor?.firm_name || toInvestor?.gp_name || "another investor"}`,
      body: input.message || null,
      metadata: {
        from_founder_profile_id: input.fromFounderProfileId,
        to_investor_profile_id: input.toInvestorProfileId,
      },
    });
  }

  return { success: true };
}
