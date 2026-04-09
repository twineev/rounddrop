import type { Database } from "@/lib/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type FounderProfile = Database["public"]["Tables"]["founder_profiles"]["Row"];
export type InvestorProfile = Database["public"]["Tables"]["investor_profiles"]["Row"];
export type PortfolioCompany = Database["public"]["Tables"]["portfolio_companies"]["Row"];
export type RoundDrop = Database["public"]["Tables"]["round_drops"]["Row"];
export type DealInteraction = Database["public"]["Tables"]["deal_interactions"]["Row"];
export type MessageThread = Database["public"]["Tables"]["message_threads"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type DeckShare = Database["public"]["Tables"]["deck_shares"]["Row"];
export type PipelineEntry = Database["public"]["Tables"]["pipeline_entries"]["Row"];

export type TractionMetrics = {
  mrr?: number;
  arr?: number;
  revenue?: number;
  users?: number;
  dau?: number;
  mau?: number;
  growth_rate_pct?: number;
  retention_pct?: number;
  gmv?: number;
};

export type RoundDropWithFounder = RoundDrop & {
  founder_profiles: FounderProfile & {
    profiles: Profile;
  };
};

export type InvestorProfileWithDetails = InvestorProfile & {
  profiles: Profile;
  portfolio_companies: PortfolioCompany[];
};

export type ThreadWithParticipant = MessageThread & {
  other_participant: Profile;
  last_message?: Message;
  unread_count: number;
};

export type InvestorProfileWithPortfolio = InvestorProfile & {
  portfolio_companies: PortfolioCompany[];
};

export type DeckShareWithInvestor = DeckShare & {
  investor_profiles: InvestorProfile;
};

export type DeckShareWithFounder = DeckShare & {
  founder_profiles: FounderProfile & {
    profiles: Profile;
  };
};

export type PipelineEntryWithInvestor = PipelineEntry & {
  investor_profiles: InvestorProfile;
};
