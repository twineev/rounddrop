"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RoundDashboardData {
  round: {
    id: string;
    status: string;
    instrument_type: string;
    raise_amount: number;
    amount_raised: number;
    valuation_cap: number | null;
    discount_percent: number | null;
    close_date: string;
    created_at: string;
  } | null;
  company_name: string;
  stage: string | null;
  kpis: {
    raised: number;
    target: number;
    remaining: number;
    investor_count: number;
    days_left: number;
    watching: number;
    weekly_raised: number;
    weekly_new_investors: number;
    weekly_unique_viewers: number;
  };
  committed_investors: Array<{
    id: string;
    name: string;
    gp: string | null;
    amount: number;
    pct: number;
    committed_at: string;
    is_lead: boolean;
    initials: string;
  }>;
  pipeline_funnel: {
    viewing: number;
    deck_shared: number;
    deck_opened: number;
    meeting: number;
    committed: number;
  };
  eyes: {
    last7_total: number;
    last7_unique: number;
    deck_opens: number;
    repeat_visits: number;
    daily: number[]; // 7 days
    delta_pct: number;
  };
  activity: Array<{
    type: "committed" | "deck_view" | "deck_download" | "call_booked" | "profile_view" | "deck_shared";
    name: string;
    company: string | null;
    amount: number | null;
    detail: string;
    when: string;
  }>;
}

export async function getRoundDashboard(): Promise<RoundDashboardData | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();
  if (!profile) return null;

  const { data: founderProfile } = await supabase
    .from("founder_profiles")
    .select("id, company_name, stage")
    .eq("profile_id", profile.id)
    .single();
  if (!founderProfile) return null;

  // Active round (most recent live or draft)
  const { data: rounds } = await supabase
    .from("round_drops")
    .select("*")
    .eq("founder_profile_id", founderProfile.id)
    .order("created_at", { ascending: false })
    .limit(1);
  const round = rounds?.[0] || null;

  // Pipeline funnel from deal_interactions + deck_shares
  const [{ data: interactions }, { data: shares }] = await Promise.all([
    round
      ? supabase
          .from("deal_interactions")
          .select("action, investor_profile_id, created_at")
          .eq("round_drop_id", round.id)
      : Promise.resolve({ data: [] }),
    supabase
      .from("deck_shares")
      .select("investor_profile_id, view_count, first_viewed_at, created_at")
      .eq("founder_profile_id", founderProfile.id),
  ]);

  const viewers = new Set<string>();
  let dealMeetings = 0;
  let dealInterested = 0;
  for (const i of interactions || []) {
    if (i.action === "viewed" || i.action === "tracked") viewers.add(i.investor_profile_id);
    if (i.action === "interested") dealInterested++;
  }

  const decksShared = (shares || []).length;
  const decksOpened = (shares || []).filter((s) => s.first_viewed_at).length;

  // Days left
  const days_left = round
    ? Math.max(0, Math.ceil((new Date(round.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const target = round?.raise_amount || 0;
  const raised = round?.amount_raised || 0;
  const remaining = Math.max(0, target - raised);

  // Last 7 days breakdowns
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentInteractions = (interactions || []).filter(
    (i) => new Date(i.created_at).getTime() >= sevenDaysAgo
  );
  const last7_total = recentInteractions.length;
  const last7_unique = new Set(recentInteractions.map((i) => i.investor_profile_id)).size;
  const deck_opens = (shares || []).filter(
    (s) => s.first_viewed_at && new Date(s.first_viewed_at).getTime() >= sevenDaysAgo
  ).length;

  const dailyCounts = Array(7).fill(0);
  for (const i of recentInteractions) {
    const dayOffset = Math.floor((Date.now() - new Date(i.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (dayOffset >= 0 && dayOffset < 7) dailyCounts[6 - dayOffset]++;
  }

  // Committed investors — for v1 we treat any "interested" interaction as a
  // commit placeholder. In production this would be a separate `commitments`
  // table with actual amounts.
  const committed_investors: RoundDashboardData["committed_investors"] = [];

  // Activity feed: combine recent interactions + deck shares
  const activity: RoundDashboardData["activity"] = [];
  for (const i of (interactions || []).slice(-10).reverse()) {
    if (i.action === "viewed") {
      activity.push({
        type: "profile_view",
        name: "An investor",
        company: null,
        amount: null,
        detail: "viewed your round",
        when: i.created_at,
      });
    } else if (i.action === "interested") {
      activity.push({
        type: "committed",
        name: "An investor",
        company: null,
        amount: null,
        detail: "marked your round as interested",
        when: i.created_at,
      });
    }
  }

  return {
    round: round
      ? {
          id: round.id,
          status: round.status,
          instrument_type: round.instrument_type,
          raise_amount: round.raise_amount,
          amount_raised: round.amount_raised,
          valuation_cap: round.valuation_cap,
          discount_percent: round.discount_percent,
          close_date: round.close_date,
          created_at: round.created_at,
        }
      : null,
    company_name: founderProfile.company_name,
    stage: founderProfile.stage,
    kpis: {
      raised,
      target,
      remaining,
      investor_count: dealInterested,
      days_left,
      watching: viewers.size,
      weekly_raised: 0,
      weekly_new_investors: 0,
      weekly_unique_viewers: last7_unique,
    },
    committed_investors,
    pipeline_funnel: {
      viewing: viewers.size,
      deck_shared: decksShared,
      deck_opened: decksOpened,
      meeting: 0,
      committed: dealInterested,
    },
    eyes: {
      last7_total,
      last7_unique,
      deck_opens,
      repeat_visits: 0,
      daily: dailyCounts,
      delta_pct: 0,
    },
    activity: activity.slice(0, 8),
  };
}
