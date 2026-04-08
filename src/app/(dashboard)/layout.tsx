import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const isPreview = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_");

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let role: "founder" | "investor" = "founder";

  if (!isPreview) {
    const { auth } = await import("@clerk/nextjs/server");
    const { sessionClaims } = await auth();
    const clerkRole = (sessionClaims?.metadata as Record<string, unknown>)?.role as
      | "founder"
      | "investor"
      | undefined;

    if (!clerkRole) {
      redirect("/onboarding");
    }
    role = clerkRole;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar role={role} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
