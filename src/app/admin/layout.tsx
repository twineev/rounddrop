import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Toaster } from "sonner";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  BookOpen,
  Database,
  ArrowLeft,
} from "lucide-react";

const ADMIN_EMAILS = ["twinee.madan@gmail.com"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/admin");

  // Defense in depth: also check email server-side (middleware allowlist + here)
  let email = "";
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || "";
  } catch {
    // ignore
  }

  if (!ADMIN_EMAILS.includes(email)) {
    redirect("/");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <aside className="border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-5 border-b border-gray-200">
          <span className="text-base font-bold" style={{ color: "#0F1A2E" }}>
            Round<span style={{ color: "#50C878" }}>Drop</span>
          </span>
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
            ADMIN
          </span>
        </div>
        <nav className="space-y-1 p-3">
          <AdminLink href="/admin" icon={LayoutDashboard}>Overview</AdminLink>
          <AdminLink href="/admin/users" icon={Users}>Users</AdminLink>
          <AdminLink href="/admin/investors" icon={Building2}>Investors</AdminLink>
          <AdminLink href="/admin/events" icon={Calendar}>Events</AdminLink>
          <AdminLink href="/admin/resources" icon={BookOpen}>Resources</AdminLink>
          <AdminLink href="/admin/sql" icon={Database}>SQL Console</AdminLink>
        </nav>
        <div className="p-3 mt-auto border-t border-gray-200">
          <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </aside>
      <main className="overflow-y-auto p-5 md:p-7">{children}</main>
    </div>
  );
}

function AdminLink({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
