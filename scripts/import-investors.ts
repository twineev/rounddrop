import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface InvestorImport {
  firm_name: string;
  gp_name: string;
  investor_type: string;
  check_size_min: number;
  check_size_max: number;
  sectors: string[];
  stage_preference: string[];
  thesis?: string;
  fund_website?: string;
  twitter_url?: string;
  contact_email?: string;
  notable_exits?: string;
  value_add?: string;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx tsx scripts/import-investors.ts <path-to-json>");
    process.exit(1);
  }

  const absolutePath = resolve(filePath);
  const raw = readFileSync(absolutePath, "utf-8");
  const investors: InvestorImport[] = JSON.parse(raw);

  console.log(`Importing ${investors.length} investor profiles...`);

  // Check for existing slugs to avoid conflicts
  const slugs = investors.map((inv) => slugify(inv.firm_name));
  const { data: existing } = await supabase
    .from("investor_profiles")
    .select("slug")
    .in("slug", slugs);

  const existingSlugs = new Set((existing || []).map((e) => e.slug));

  const toInsert = [];
  let skipped = 0;

  for (const inv of investors) {
    const slug = slugify(inv.firm_name);
    if (existingSlugs.has(slug)) {
      console.log(`  Skipping "${inv.firm_name}" (slug "${slug}" already exists)`);
      skipped++;
      continue;
    }

    const fundDomain = inv.fund_website
      ? new URL(inv.fund_website).hostname.replace(/^www\./, "")
      : null;

    toInsert.push({
      firm_name: inv.firm_name,
      gp_name: inv.gp_name,
      investor_type: inv.investor_type,
      check_size_min: inv.check_size_min,
      check_size_max: inv.check_size_max,
      sectors: inv.sectors,
      stage_preference: inv.stage_preference,
      thesis: inv.thesis || null,
      fund_website: inv.fund_website || null,
      twitter_url: inv.twitter_url || null,
      contact_email: inv.contact_email || null,
      notable_exits: inv.notable_exits || null,
      value_add: inv.value_add || null,
      fund_domain: fundDomain,
      slug,
      is_claimed: false,
      profile_id: null,
    });
  }

  if (toInsert.length === 0) {
    console.log("No new profiles to insert.");
    return;
  }

  // Bulk insert in batches of 50
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const { error } = await supabase.from("investor_profiles").insert(batch);

    if (error) {
      console.error(`Error inserting batch at index ${i}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  Inserted ${batch.length} profiles (${inserted}/${toInsert.length})`);
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
