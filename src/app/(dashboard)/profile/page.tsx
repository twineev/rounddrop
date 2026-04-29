import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { FounderProfileEditor } from "@/components/profile/founder-profile-editor";
import { InvestorProfileEditor } from "@/components/profile/investor-profile-editor";
import { VerifiedBadge } from "@/components/ui/verified-badge";

export default async function ProfilePage() {
  const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

  if (isPreview) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-gray-500">Profile editing is disabled in preview mode.</p>
      </div>
    );
  }

  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");
  const role = ((sessionClaims?.metadata as Record<string, unknown>)?.role as string) || "founder";

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();
  if (!profile) redirect("/onboarding");

  let founderProfile = null;
  let investorProfile = null;

  if (role === "founder") {
    const { data } = await supabase
      .from("founder_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .single();
    founderProfile = data;
  } else {
    const { data } = await supabase
      .from("investor_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .single();
    investorProfile = data;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#E8C026" }}>Profile</p>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: "#0F1A2E" }}>
            Your profile
            {profile.is_verified ? <VerifiedBadge size="sm" /> : null}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            A richer profile means better matches. Fill out what feels relevant — you can always come back and edit.
          </p>
        </div>
      </div>

      {role === "founder" && founderProfile && (
        <FounderProfileEditor profile={founderProfile} />
      )}
      {role === "investor" && investorProfile && (
        <InvestorProfileEditor profile={investorProfile} />
      )}
    </div>
  );
}
