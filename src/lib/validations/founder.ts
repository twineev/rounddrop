import { z } from "zod";

export const founderProfileSchema = z.object({
  company_name: z.string().min(1, "Company name is required").max(100),
  one_liner: z.string().min(1, "One-liner is required").max(200),
  sector: z.array(z.string()).min(1, "Select at least one sector"),
  company_website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  calendar_link: z
    .string()
    .min(1, "Calendar link is required")
    .url("Must be a valid URL")
    .refine(
      (url) =>
        url.includes("calendly.com") ||
        url.includes("cal.com") ||
        url.includes("savvycal.com"),
      "Must be a Calendly, Cal.com, or SavvyCal link"
    ),
  linkedin_url: z
    .string()
    .min(1, "LinkedIn URL is required")
    .url("Must be a valid URL")
    .refine((url) => url.includes("linkedin.com"), "Must be a LinkedIn URL"),
  accelerator_affiliations: z.array(z.string()).optional(),
});

export type FounderProfileInput = z.infer<typeof founderProfileSchema>;

export const roundDropSchema = z.object({
  instrument_type: z.enum(["safe", "safe_mfn", "convertible_note", "priced_round"]),
  raise_amount: z.number().min(1000, "Raise amount must be at least $1,000"),
  amount_raised: z.number().min(0).optional(),
  valuation_cap: z.number().min(0).optional().nullable(),
  discount_percent: z.number().min(0).max(100).optional().nullable(),
  min_check_size: z.number().min(100, "Minimum check size must be at least $100"),
  close_date: z.string().min(1, "Close date is required"),
  traction_metrics: z.record(z.string(), z.number()).optional(),
  pitch_deck_url: z.string().optional().nullable(),
  pitch_deck_filename: z.string().optional().nullable(),
  one_pager_url: z.string().url().optional().or(z.literal("")).nullable(),
  demo_link: z.string().url().optional().or(z.literal("")).nullable(),
  existing_investors: z.array(z.string()).optional(),
  visibility: z.enum(["public", "invite_only"]).optional(),
});

export type RoundDropInput = z.infer<typeof roundDropSchema>;
