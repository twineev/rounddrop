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

// Preview mode: skip auth when Clerk isn't configured
function previewMiddleware(req: NextRequest) {
  return NextResponse.next();
}

export default function middleware(req: NextRequest) {
  // Skip Clerk middleware when keys aren't configured (preview mode)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_")) {
    return previewMiddleware(req);
  }

  return clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    if (!userId) {
      // Send first-time visitors to sign-up; existing users can click "Sign in" from there
      const isOnboarding = isOnboardingRoute(req);
      const authUrl = new URL(isOnboarding ? "/sign-up" : "/sign-in", req.url);
      authUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(authUrl);
    }

    // Admin gate: only allowlisted emails can access /admin/*
    if (isAdminRoute(req)) {
      const email =
        ((sessionClaims as Record<string, unknown> | null)?.email as string) ||
        ((sessionClaims as Record<string, unknown> | null)?.primary_email_address as string) ||
        "";
      if (!ADMIN_EMAIL_ALLOWLIST.includes(email.toLowerCase())) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    let onboardingComplete = (sessionClaims?.metadata as Record<string, unknown>)
      ?.onboardingComplete;
    let role = (sessionClaims?.metadata as Record<string, unknown>)?.role;

    // Fallback: session claims can be stale right after onboarding (Clerk
    // metadata updates server-side but the JWT in the user's cookie still
    // has old claims for up to a few seconds). If claims say not-onboarded,
    // double-check the DB before forcing them back to /onboarding.
    if (!onboardingComplete) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && serviceKey) {
          const res = await fetch(
            `${supabaseUrl}/rest/v1/profiles?select=onboarding_completed,role&clerk_user_id=eq.${userId}&limit=1`,
            {
              headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
              },
              cache: "no-store",
            }
          );
          if (res.ok) {
            const rows = (await res.json()) as Array<{
              onboarding_completed: boolean;
              role: string | null;
            }>;
            if (rows[0]?.onboarding_completed) {
              onboardingComplete = true;
              role = rows[0].role || role;
            }
          }
        }
      } catch {
        // ignore — fall back to session-claims-only behavior below
      }
    }

    if (!onboardingComplete && !isOnboardingRoute(req)) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (onboardingComplete && isOnboardingRoute(req)) {
      const dashboardUrl = role === "founder" ? "/rounds" : "/deals";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }

    return NextResponse.next();
  })(req, new Event("fetch") as any);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
