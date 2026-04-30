"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Languages, Settings, LogOut, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "Translate", href: "/translate", icon: Languages },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Saved Phrases", href: "/saved-phrases", icon: Bookmark },
  { name: "History", href: "/history", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hidden md:flex flex-col h-screen sticky top-0 transition-colors">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-sm">
            <Languages size={18} />
          </div>
          <span className="text-xl font-bold font-serif text-slate-900 dark:text-slate-50 tracking-tight">{APP_NAME}</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50"
              )}
            >
              <item.icon 
                size={18} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                )} 
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="px-4 pb-6 space-y-1">
        <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 mx-3 transition-colors"></div>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
            pathname.startsWith("/settings")
              ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50"
          )}
        >
          <Settings size={18} className={cn("transition-colors", pathname.startsWith("/settings") ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
          Settings
        </Link>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Theme</span>
          <ThemeToggle />
        </div>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all group"
        >
          <LogOut size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-red-500 transition-colors" />
          Log out
        </button>
      </div>
    </aside>
  );
}
