import { z } from "zod";

export const portfolioCompanySchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  round: z.string().optional(),
  check_size: z.number().min(0).optional().nullable(),
  year: z.number().min(1990).max(new Date().getFullYear()).optional().nullable(),
  status: z.enum(["active", "exited", "write_off"]).optional().nullable(),
});

export const investorProfileSchema = z.object({
  firm_name: z.string().optional().or(z.literal("")),
  investor_type: z.enum([
    "angel",
    "scout",
    "micro_vc",
    "solo_gp",
    "fund",
    "syndicate_lead",
  ]),
  check_size_min: z.number().min(0, "Minimum check size is required"),
  check_size_max: z
    .number()
    .min(0, "Maximum check size is required"),
  sectors: z.array(z.string()).min(1, "Select at least one sector"),
  stage_preference: z
    .array(z.enum(["pre_seed", "seed"]))
    .min(1, "Select at least one stage"),
  thesis: z.string().max(1000).optional().or(z.literal("")),
  linkedin_url: z
    .string()
    .min(1, "LinkedIn URL is required")
    .url("Must be a valid URL")
    .refine((url) => url.includes("linkedin.com"), "Must be a LinkedIn URL"),
  notable_exits: z.string().max(500).optional().or(z.literal("")),
  value_add: z.string().max(500).optional().or(z.literal("")),
  portfolio_companies: z.array(portfolioCompanySchema).optional(),
}).refine(
  (data) => data.check_size_max >= data.check_size_min,
  {
    message: "Max check size must be greater than or equal to min",
    path: ["check_size_max"],
  }
);

export type InvestorProfileInput = z.infer<typeof investorProfileSchema>;
export type PortfolioCompanyInput = z.infer<typeof portfolioCompanySchema>;
