"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Rocket,
  MessageSquare,
  Bell,
  User,
  Briefcase,
  Bookmark,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

const founderNav = [
  { href: "/demo/founder/rounds", label: "My Rounds", icon: Rocket },
  { href: "/demo/founder/rounds/new", label: "Create Round", icon: Rocket },
  { href: "/demo/founder/dashboard", label: "Round Dashboard", icon: LayoutDashboard },
];

const investorNav = [
  { href: "/demo/investor/deals", label: "Deal Feed", icon: LayoutDashboard },
  { href: "/demo/investor/deal", label: "Deal Detail", icon: Rocket },
  { href: "/demo/investor/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/demo/investor/portfolio", label: "Portfolio", icon: Briefcase },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFounder = pathname.includes("/demo/founder");
  const isInvestor = pathname.includes("/demo/investor");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-5 border-b border-gray-200">
          <Link href="/demo" className="flex items-center gap-1.5">
            <span className="text-base font-bold text-gray-900">
              Round<span className="text-green-600">Drop</span>
            </span>
          </Link>
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
            DEMO
          </span>
        </div>

        {/* Role toggle */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <Link
              href="/demo/founder/rounds"
              className={cn(
                "flex-1 rounded-md py-1.5 text-center text-xs font-semibold transition-all",
                isFounder ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Founder
            </Link>
            <Link
              href="/demo/investor/deals"
              className={cn(
                "flex-1 rounded-md py-1.5 text-center text-xs font-semibold transition-all",
                isInvestor ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Investor
            </Link>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {(isFounder ? founderNav : isInvestor ? investorNav : []).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-500 hover:bg-green-50/50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-green-600" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm md:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/demo" className="flex items-center gap-1.5">
              <span className="text-base font-bold text-gray-900">
                Round<span className="text-green-600">Drop</span>
              </span>
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
                DEMO
              </span>
            </Link>
          </div>
          {/* Mobile role toggle + nav */}
          <div className="flex border-t border-gray-200 overflow-x-auto">
            {(isFounder ? founderNav : isInvestor ? investorNav : []).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-1 px-4 py-2 text-xs transition-colors",
                    isActive ? "text-green-600" : "text-gray-400"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
