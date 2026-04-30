import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/investors(.*)",
  "/founders(.*)",
  "/shared(.*)",
  "/demo(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const ADMIN_EMAIL_ALLOWLIST = ["twinee.madan@gmail.com"];

/**
 * Look up the user's profile in Supabase to determine onboarding state +
 * role. We always check the DB instead of trusting session claims because
 * Clerk's JWT can lag for ~30s after metadata updates.
 */
async function getProfileFromDb(userId: string, baseUrl: string): Promise<{
  onboardingComplete: boolean;
  role: string | null;
  hasFounderProfile: boolean;
  hasInvestorProfile: boolean;
} | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id,onboarding_completed,role,founder_profiles(id),investor_profiles(id)&clerk_user_id=eq.${userId}&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{
      id: string;
      onboarding_completed: boolean;
      role: string | null;
      founder_profiles: Array<{ id: string }>;
      investor_profiles: Array<{ id: string }>;
    }>;
    const r = rows[0];
    if (!r) return null;
    const hasFounder = (r.founder_profiles || []).length > 0;
    const hasInvestor = (r.investor_profiles || []).length > 0;
    return {
      // Treat as onboarded if EITHER the column says so OR they have a
      // founder/investor profile row (which means they completed the form).
      onboardingComplete: r.onboarding_completed || hasFounder || hasInvestor,
      // If role column conflicts with which profile they have, prefer the
      // existing profile to avoid redirecting to a dashboard that has no data.
      role: hasFounder ? "founder" : hasInvestor ? "investor" : r.role,
      hasFounderProfile: hasFounder,
      hasInvestorProfile: hasInvestor,
    };
  } catch (_unused) {
    return null;
  }
}

export default clerkMiddleware(async (auth, req) => {
  // Preview mode: when Clerk isn't configured, skip auth entirely.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_")) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  // Public routes always pass.
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Anonymous → bounce to sign-in (or sign-up for onboarding routes).
  if (!userId) {
    const isOnboarding = isOnboardingRoute(req);
    const authUrl = new URL(isOnboarding ? "/sign-up" : "/sign-in", req.url);
    authUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(authUrl);
  }

  // Admin gate (defense in depth — layout double-checks email server-side too).
  if (isAdminRoute(req)) {
    const email =
      ((sessionClaims as Record<string, unknown> | null)?.email as string) || "";
    if (!ADMIN_EMAIL_ALLOWLIST.includes(email.toLowerCase())) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Always look up profile in DB (single round-trip, RLS-bypassing).
  const profile = await getProfileFromDb(userId, req.url);

  // If we have no profile row at all, send them to onboarding so the
  // form can create one. Avoid redirect loop: only redirect if not already
  // on /onboarding.
  if (!profile) {
    if (!isOnboardingRoute(req)) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.next();
  }

  // Onboarded → bounce away from /onboarding.
  if (profile.onboardingComplete && isOnboardingRoute(req)) {
    const dashboardUrl = profile.role === "investor" ? "/deals" : "/rounds";
    // Prevent loop if dashboardUrl somehow equals current path.
    const currentPath = new URL(req.url).pathname;
    if (currentPath === dashboardUrl) return NextResponse.next();
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // Not onboarded → bounce to /onboarding (unless already there).
  if (!profile.onboardingComplete && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
