import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ProfilePage() {
  const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

  let profile: Record<string, unknown> | null = null;
  let role = "founder";
  let roleProfile: Record<string, unknown> | null = null;
  let portfolioCompanies: Record<string, unknown>[] | null = null;

  if (!isPreview) {
    const { userId, sessionClaims } = await auth();
    if (!userId) redirect("/sign-in");
    role = ((sessionClaims?.metadata as Record<string, unknown>)?.role as string) || "founder";

    const supabase = createAdminClient();
    const { data } = await supabase.from("profiles").select("*").eq("clerk_user_id", userId).single();
    if (!data) redirect("/onboarding");
    profile = data;

    if (role === "founder") {
      const { data: fp } = await supabase.from("founder_profiles").select("*").eq("profile_id", data.id).single();
      roleProfile = fp;
    } else {
      const { data: ip } = await supabase.from("investor_profiles").select("*").eq("profile_id", data.id).single();
      roleProfile = ip;
      if (ip) {
        const { data: companies } = await supabase.from("portfolio_companies").select("*").eq("investor_profile_id", ip.id);
        portfolioCompanies = companies;
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-green-600 mb-1">Profile</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Your profile</h1>
      </div>

      {/* User card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700 text-lg font-bold">
            {profile ? (profile.full_name as string).split(" ").map((n: string) => n[0]).join("") : "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile ? (profile.full_name as string) : "Preview User"}</h2>
            <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 capitalize">{role}</span>
          </div>
        </div>
        {profile?.linkedin_url ? (
          <a href={profile.linkedin_url as string} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-green-600 hover:text-green-700">
            LinkedIn Profile
          </a>
        ) : null}
      </div>

      {/* Role-specific details */}
      {role === "founder" && roleProfile ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Company Details</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <span className="text-xs text-gray-500">Company</span>
              <p className="font-semibold text-gray-900 text-sm">{roleProfile.company_name as string}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">One-liner</span>
              <p className="text-sm text-gray-700">{roleProfile.one_liner as string}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Sectors</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {((roleProfile.sector as string[]) || []).map((s: string) => (
                  <span key={s} className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Calendar Link</span>
              <p className="text-sm text-green-600">{roleProfile.calendar_link as string}</p>
            </div>
          </div>
        </div>
      ) : null}

      {role === "investor" && roleProfile ? (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Investment Profile</h3>
            <div className="grid grid-cols-1 gap-3">
              {roleProfile.firm_name ? (
                <div>
                  <span className="text-xs text-gray-500">Firm</span>
                  <p className="font-semibold text-gray-900 text-sm">{roleProfile.firm_name as string}</p>
                </div>
              ) : null}
              <div>
                <span className="text-xs text-gray-500">Check Size</span>
                <p className="font-semibold text-gray-900 text-sm">
                  ${(roleProfile.check_size_min as number)?.toLocaleString()} - ${(roleProfile.check_size_max as number)?.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Sectors</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {((roleProfile.sectors as string[]) || []).map((s: string) => (
                    <span key={s} className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">{s}</span>
                  ))}
                </div>
              </div>
              {roleProfile.thesis ? (
                <div>
                  <span className="text-xs text-gray-500">Thesis</span>
                  <p className="text-sm text-gray-700">{roleProfile.thesis as string}</p>
                </div>
              ) : null}
            </div>
          </div>

          {portfolioCompanies && portfolioCompanies.length > 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-900 mb-4">Portfolio ({portfolioCompanies.length})</h3>
              <div className="space-y-2">
                {portfolioCompanies.map((company) => (
                  <div key={company.id as string} className="flex items-center justify-between rounded-lg bg-gray-50 border border-gray-100 p-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{company.company_name as string}</p>
                      <p className="text-xs text-gray-500">
                        {[company.round, company.year].filter(Boolean).join(" - ")}
                      </p>
                    </div>
                    {company.status ? (
                      <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 capitalize">
                        {(company.status as string).replace("_", " ")}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {isPreview && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">Connect Clerk and Supabase to see your real profile data</p>
        </div>
      )}
    </div>
  );
}
