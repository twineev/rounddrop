export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          clerk_user_id: string;
          role: "founder" | "investor" | null;
          full_name: string;
          avatar_url: string | null;
          linkedin_url: string | null;
          onboarding_completed: boolean;
          is_verified: boolean;
          verified_at: string | null;
          verification_source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          role?: "founder" | "investor" | null;
          full_name: string;
          avatar_url?: string | null;
          linkedin_url?: string | null;
          onboarding_completed?: boolean;
          is_verified?: boolean;
          verified_at?: string | null;
          verification_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          role?: "founder" | "investor" | null;
          full_name?: string;
          avatar_url?: string | null;
          linkedin_url?: string | null;
          onboarding_completed?: boolean;
          is_verified?: boolean;
          verified_at?: string | null;
          verification_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      platform_connections: {
        Row: {
          id: string;
          profile_a_id: string;
          profile_b_id: string;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_a_id: string;
          profile_b_id: string;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_a_id?: string;
          profile_b_id?: string;
          source?: string | null;
          created_at?: string;
        };
      };
      founder_profiles: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          one_liner: string | null;
          sector: string[];
          company_website: string | null;
          calendar_link: string | null;
          accelerator_affiliations: string[] | null;
          stage: string | null;
          full_name: string | null;
          email: string | null;
          linkedin_url: string | null;
          year_founded: number | null;
          description: string | null;
          mrr: number | null;
          arr: number | null;
          traction_notes: string | null;
          growth_numbers: Json;
          intro_video_url: string | null;
          onepager_url: string | null;
          pitch_deck_url: string | null;
          best_contact_method: string | null;
          slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          one_liner?: string | null;
          sector: string[];
          company_website?: string | null;
          calendar_link?: string | null;
          accelerator_affiliations?: string[] | null;
          stage?: string | null;
          full_name?: string | null;
          email?: string | null;
          linkedin_url?: string | null;
          year_founded?: number | null;
          description?: string | null;
          mrr?: number | null;
          arr?: number | null;
          traction_notes?: string | null;
          growth_numbers?: Json;
          intro_video_url?: string | null;
          onepager_url?: string | null;
          pitch_deck_url?: string | null;
          best_contact_method?: string | null;
          slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          company_name?: string;
          one_liner?: string | null;
          sector?: string[];
          company_website?: string | null;
          calendar_link?: string | null;
          accelerator_affiliations?: string[] | null;
          stage?: string | null;
          full_name?: string | null;
          email?: string | null;
          linkedin_url?: string | null;
          year_founded?: number | null;
          description?: string | null;
          mrr?: number | null;
          arr?: number | null;
          traction_notes?: string | null;
          growth_numbers?: Json;
          intro_video_url?: string | null;
          onepager_url?: string | null;
          pitch_deck_url?: string | null;
          best_contact_method?: string | null;
          slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      investor_profiles: {
        Row: {
          id: string;
          profile_id: string | null;
          firm_name: string | null;
          investor_type: string;
          check_size_min: number;
          check_size_max: number;
          sectors: string[];
          stage_preference: string[];
          thesis: string | null;
          notable_exits: string | null;
          value_add: string | null;
          is_claimed: boolean;
          gp_name: string | null;
          fund_website: string | null;
          twitter_url: string | null;
          contact_email: string | null;
          fund_domain: string | null;
          slug: string | null;
          claimed_at: string | null;
          location: string | null;
          linkedin_url: string | null;
          years_investing: number | null;
          main_markets: string[] | null;
          recent_checks: Json;
          deck_criteria: string | null;
          founder_assessment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          firm_name?: string | null;
          investor_type: string;
          check_size_min: number;
          check_size_max: number;
          sectors: string[];
          stage_preference: string[];
          thesis?: string | null;
          notable_exits?: string | null;
          value_add?: string | null;
          is_claimed?: boolean;
          gp_name?: string | null;
          fund_website?: string | null;
          twitter_url?: string | null;
          contact_email?: string | null;
          fund_domain?: string | null;
          slug?: string | null;
          claimed_at?: string | null;
          location?: string | null;
          linkedin_url?: string | null;
          years_investing?: number | null;
          main_markets?: string[] | null;
          recent_checks?: Json;
          deck_criteria?: string | null;
          founder_assessment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          firm_name?: string | null;
          investor_type?: string;
          check_size_min?: number;
          check_size_max?: number;
          sectors?: string[];
          stage_preference?: string[];
          thesis?: string | null;
          notable_exits?: string | null;
          value_add?: string | null;
          is_claimed?: boolean;
          gp_name?: string | null;
          fund_website?: string | null;
          twitter_url?: string | null;
          contact_email?: string | null;
          fund_domain?: string | null;
          slug?: string | null;
          claimed_at?: string | null;
          location?: string | null;
          linkedin_url?: string | null;
          years_investing?: number | null;
          main_markets?: string[] | null;
          recent_checks?: Json;
          deck_criteria?: string | null;
          founder_assessment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_companies: {
        Row: {
          id: string;
          investor_profile_id: string;
          company_name: string;
          round: string | null;
          check_size: number | null;
          year: number | null;
          status: "active" | "exited" | "write_off" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          investor_profile_id: string;
          company_name: string;
          round?: string | null;
          check_size?: number | null;
          year?: number | null;
          status?: "active" | "exited" | "write_off" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          investor_profile_id?: string;
          company_name?: string;
          round?: string | null;
          check_size?: number | null;
          year?: number | null;
          status?: "active" | "exited" | "write_off" | null;
          created_at?: string;
        };
      };
      round_drops: {
        Row: {
          id: string;
          founder_profile_id: string;
          status: "draft" | "live" | "closing" | "closed";
          instrument_type: string;
          raise_amount: number;
          amount_raised: number;
          valuation_cap: number | null;
          discount_percent: number | null;
          min_check_size: number;
          close_date: string;
          traction_metrics: Json;
          pitch_deck_url: string | null;
          pitch_deck_filename: string | null;
          one_pager_url: string | null;
          demo_link: string | null;
          existing_investors: string[] | null;
          visibility: "public" | "invite_only";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          founder_profile_id: string;
          status?: "draft" | "live" | "closing" | "closed";
          instrument_type: string;
          raise_amount: number;
          amount_raised?: number;
          valuation_cap?: number | null;
          discount_percent?: number | null;
          min_check_size: number;
          close_date: string;
          traction_metrics?: Json;
          pitch_deck_url?: string | null;
          pitch_deck_filename?: string | null;
          one_pager_url?: string | null;
          demo_link?: string | null;
          existing_investors?: string[] | null;
          visibility?: "public" | "invite_only";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          founder_profile_id?: string;
          status?: "draft" | "live" | "closing" | "closed";
          instrument_type?: string;
          raise_amount?: number;
          amount_raised?: number;
          valuation_cap?: number | null;
          discount_percent?: number | null;
          min_check_size?: number;
          close_date?: string;
          traction_metrics?: Json;
          pitch_deck_url?: string | null;
          pitch_deck_filename?: string | null;
          one_pager_url?: string | null;
          demo_link?: string | null;
          existing_investors?: string[] | null;
          visibility?: "public" | "invite_only";
          created_at?: string;
          updated_at?: string;
        };
      };
      deal_interactions: {
        Row: {
          id: string;
          round_drop_id: string;
          investor_profile_id: string;
          action: "viewed" | "passed" | "tracked" | "interested";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          round_drop_id: string;
          investor_profile_id: string;
          action: "viewed" | "passed" | "tracked" | "interested";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          round_drop_id?: string;
          investor_profile_id?: string;
          action?: "viewed" | "passed" | "tracked" | "interested";
          created_at?: string;
          updated_at?: string;
        };
      };
      message_threads: {
        Row: {
          id: string;
          participant_1_id: string;
          participant_2_id: string;
          round_drop_id: string | null;
          last_message_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_1_id: string;
          participant_2_id: string;
          round_drop_id?: string | null;
          last_message_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          participant_1_id?: string;
          participant_2_id?: string;
          round_drop_id?: string | null;
          last_message_at?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_profile_id: string;
          receiver_profile_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_profile_id: string;
          receiver_profile_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          sender_profile_id?: string;
          receiver_profile_id?: string;
          content?: string;
          read_at?: string | null;
          created_at?: string;
        };
      };
      deck_shares: {
        Row: {
          id: string;
          founder_profile_id: string;
          investor_profile_id: string;
          deck_url: string;
          deck_filename: string | null;
          message: string | null;
          view_count: number;
          first_viewed_at: string | null;
          last_viewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          founder_profile_id: string;
          investor_profile_id: string;
          deck_url: string;
          deck_filename?: string | null;
          message?: string | null;
          view_count?: number;
          first_viewed_at?: string | null;
          last_viewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          founder_profile_id?: string;
          investor_profile_id?: string;
          deck_url?: string;
          deck_filename?: string | null;
          message?: string | null;
          view_count?: number;
          first_viewed_at?: string | null;
          last_viewed_at?: string | null;
          created_at?: string;
        };
      };
      pipeline_entries: {
        Row: {
          id: string;
          founder_profile_id: string;
          investor_profile_id: string;
          status: "researching" | "deck_shared" | "viewed" | "meeting_scheduled" | "passed";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          founder_profile_id: string;
          investor_profile_id: string;
          status?: "researching" | "deck_shared" | "viewed" | "meeting_scheduled" | "passed";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          founder_profile_id?: string;
          investor_profile_id?: string;
          status?: "researching" | "deck_shared" | "viewed" | "meeting_scheduled" | "passed";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_connections: {
        Row: {
          id: string;
          profile_id: string;
          linkedin_url: string;
          full_name: string | null;
          headline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          linkedin_url: string;
          full_name?: string | null;
          headline?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          linkedin_url?: string;
          full_name?: string | null;
          headline?: string | null;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_type: "virtual" | "irl" | "hybrid" | null;
          location: string | null;
          url: string | null;
          starts_at: string;
          ends_at: string | null;
          audience: "founder" | "investor" | "both";
          cover_image_url: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_type?: "virtual" | "irl" | "hybrid" | null;
          location?: string | null;
          url?: string | null;
          starts_at: string;
          ends_at?: string | null;
          audience?: "founder" | "investor" | "both";
          cover_image_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          event_type?: "virtual" | "irl" | "hybrid" | null;
          location?: string | null;
          url?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          audience?: "founder" | "investor" | "both";
          cover_image_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: "deck_template" | "fundraising" | "term_sheet" | "legal" | "hiring" | "growth" | "other" | null;
          url: string;
          audience: "founder" | "investor" | "both";
          cover_image_url: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category?: "deck_template" | "fundraising" | "term_sheet" | "legal" | "hiring" | "growth" | "other" | null;
          url: string;
          audience?: "founder" | "investor" | "both";
          cover_image_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: "deck_template" | "fundraising" | "term_sheet" | "legal" | "hiring" | "growth" | "other" | null;
          url?: string;
          audience?: "founder" | "investor" | "both";
          cover_image_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: string;
          title: string;
          body: string | null;
          metadata: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: string;
          title: string;
          body?: string | null;
          metadata?: Json;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          metadata?: Json;
          read_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
