"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Rocket, MessageSquare, Bell, User, CircleUser, Bookmark, Briefcase } from "lucide-react";

interface TopbarProps {
  role: "founder" | "investor";
}

const founderNav = [
  { href: "/rounds", label: "Rounds", icon: Rocket },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

const investorNav = [
  { href: "/deals", label: "Deals", icon: LayoutDashboard },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

export function Topbar({ role }: TopbarProps) {
  const pathname = usePathname();
  const nav = role === "founder" ? founderNav : investorNav;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-5">
        {/* Mobile logo */}
        <Link
          href={role === "founder" ? "/rounds" : "/deals"}
          className="flex items-center gap-1.5 md:hidden"
        >
          <span className="text-base font-bold text-gray-900">
            Round<span className="text-green-600">Drop</span>
          </span>
        </Link>

        {/* Desktop: spacer */}
        <div className="hidden md:block" />

        <div className="flex items-center gap-4">
          <Link href="/profile">
            <CircleUser className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="flex border-t border-gray-200 md:hidden">
        {nav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
                isActive ? "text-green-600" : "text-gray-400"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/profile"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
            pathname === "/profile" ? "text-green-600" : "text-gray-400"
          )}
        >
          <User className="h-5 w-5" />
          Profile
        </Link>
      </nav>
    </header>
  );
}
