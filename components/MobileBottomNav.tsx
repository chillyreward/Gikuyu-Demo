"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages, History, Bookmark, User, LogIn, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const NAV_ITEMS = [
  {
    label: "Translate",
    href: "/translate",
    icon: Languages,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
  {
    label: "Phrasebook",
    href: "/saved-phrases",
    icon: Bookmark,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { profile } = useStore();

  // Determine if the user is "logged in" by checking for a non-default name
  const isLoggedIn = profile.name !== "Demo User";

  const isActive = (href: string) => {
    if (href === "/settings/profile") return pathname.startsWith("/settings");
    return pathname === href;
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_32px_rgba(0,0,0,0.3)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-stretch">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative group",
                active
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
              )}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400" />
              )}
              <item.icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className="transition-transform group-active:scale-90"
              />
              <span className={cn(
                "text-[10px] font-semibold tracking-wide transition-all",
                active ? "font-bold" : ""
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Profile / Login item */}
        <Link
          href={isLoggedIn ? "/settings/profile" : "/login"}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative group",
            pathname === "/login" || pathname.startsWith("/settings")
              ? "text-primary-600 dark:text-primary-400"
              : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
          )}
        >
          {(pathname === "/login" || pathname.startsWith("/settings")) && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400" />
          )}
          {isLoggedIn ? (
            <div className="w-[22px] h-[22px] rounded-full bg-primary-100 dark:bg-primary-900/40 border-2 border-primary-300 dark:border-primary-700 flex items-center justify-center overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[9px] font-bold text-primary-700 dark:text-primary-300">
                  {profile.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
          ) : (
            <LogIn size={22} strokeWidth={1.8} className="transition-transform group-active:scale-90" />
          )}
          <span className={cn(
            "text-[10px] font-semibold tracking-wide",
            pathname === "/login" || pathname.startsWith("/settings") ? "font-bold" : ""
          )}>
            {isLoggedIn ? "Profile" : "Log in"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
