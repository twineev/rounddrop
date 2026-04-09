import { z } from "zod";

export const shareDeckSchema = z.object({
  investor_profile_id: z.string().uuid("Invalid investor profile ID"),
  deck_url: z.string().url("Must be a valid URL"),
  deck_filename: z.string().optional(),
  message: z.string().max(500, "Message must be under 500 characters").optional(),
});

export type ShareDeckInput = z.infer<typeof shareDeckSchema>;

export const pipelineEntrySchema = z.object({
  investor_profile_id: z.string().uuid("Invalid investor profile ID"),
  status: z
    .enum(["researching", "deck_shared", "viewed", "meeting_scheduled", "passed"])
    .optional(),
  notes: z.string().max(2000, "Notes must be under 2000 characters").optional(),
});

export type PipelineEntryInput = z.infer<typeof pipelineEntrySchema>;

export const claimProfileSchema = z.object({
  investor_profile_id: z.string().uuid("Invalid investor profile ID"),
  email: z.string().email("Must be a valid email address"),
});

export type ClaimProfileInput = z.infer<typeof claimProfileSchema>;

export const adminImportSchema = z.object({
  firm_name: z.string().min(1, "Firm name is required"),
  gp_name: z.string().min(1, "GP name is required"),
  investor_type: z.enum(["angel", "scout", "micro_vc", "solo_gp", "fund", "syndicate_lead"]),
  check_size_min: z.number().min(0),
  check_size_max: z.number().min(0),
  sectors: z.array(z.string()).min(1, "At least one sector required"),
  stage_preference: z.array(z.string()).min(1, "At least one stage required"),
  thesis: z.string().optional(),
  fund_website: z.string().url().optional().or(z.literal("")),
  twitter_url: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  notable_exits: z.string().optional(),
  value_add: z.string().optional(),
});

export type AdminImportInput = z.infer<typeof adminImportSchema>;
