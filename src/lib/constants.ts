export const SECTORS = [
  "AI / ML",
  "SaaS",
  "Fintech",
  "Health / Biotech",
  "Consumer",
  "Climate / Energy",
  "EdTech",
  "Creator Economy",
  "Developer Tools",
  "E-commerce",
  "Real Estate / PropTech",
  "Logistics / Supply Chain",
  "Cybersecurity",
  "Gaming",
  "Web3 / Crypto",
  "Other",
] as const;

export const INSTRUMENT_TYPES = [
  { value: "safe", label: "SAFE" },
  { value: "safe_mfn", label: "SAFE + MFN" },
  { value: "convertible_note", label: "Convertible Note" },
  { value: "priced_round", label: "Priced Round" },
] as const;

export const INVESTOR_TYPES = [
  { value: "angel", label: "Angel Investor" },
  { value: "scout", label: "Scout" },
  { value: "micro_vc", label: "Micro-VC" },
  { value: "solo_gp", label: "Solo GP" },
  { value: "fund", label: "Fund" },
  { value: "syndicate_lead", label: "Syndicate Lead" },
] as const;

export const STAGE_PREFERENCES = [
  { value: "pre_seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
] as const;

export const PORTFOLIO_STATUSES = [
  { value: "active", label: "Active" },
  { value: "exited", label: "Exited" },
  { value: "write_off", label: "Write-off" },
] as const;

export const TRACTION_METRIC_OPTIONS = [
  { key: "mrr", label: "MRR", prefix: "$" },
  { key: "arr", label: "ARR", prefix: "$" },
  { key: "revenue", label: "Revenue", prefix: "$" },
  { key: "users", label: "Users", prefix: "" },
  { key: "dau", label: "DAU", prefix: "" },
  { key: "mau", label: "MAU", prefix: "" },
  { key: "growth_rate_pct", label: "Growth Rate (MoM)", suffix: "%" },
  { key: "retention_pct", label: "Retention", suffix: "%" },
  { key: "gmv", label: "GMV", prefix: "$" },
] as const;

export const ROUND_STATUSES = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  live: { label: "Live", color: "bg-green-100 text-green-700" },
  closing: { label: "Closing Soon", color: "bg-yellow-100 text-yellow-700" },
  closed: { label: "Closed", color: "bg-red-100 text-red-700" },
} as const;
