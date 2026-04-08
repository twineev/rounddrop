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
} from "lucide-react";

interface SidebarProps {
  role: "founder" | "investor";
}

const founderNav = [
  { href: "/rounds", label: "My Rounds", icon: Rocket },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

const investorNav = [
  { href: "/deals", label: "Deal Feed", icon: LayoutDashboard },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const nav = role === "founder" ? founderNav : investorNav;

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center px-5 border-b border-gray-200">
        <Link href={role === "founder" ? "/rounds" : "/deals"} className="flex items-center gap-1.5">
          <span className="text-base font-bold text-gray-900">
            Round<span className="text-green-600">Drop</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
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
    </aside>
  );
}
