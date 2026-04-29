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
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

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

    const onboardingComplete = (sessionClaims?.metadata as Record<string, unknown>)
      ?.onboardingComplete;

    if (!onboardingComplete && !isOnboardingRoute(req)) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (onboardingComplete && isOnboardingRoute(req)) {
      const role = (sessionClaims?.metadata as Record<string, unknown>)?.role;
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
