"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Palette, Languages, Bookmark, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export const settingsTabs = [
  { name: "Profile", href: "/settings/profile", icon: User },
  { name: "Appearance", href: "/settings/appearance", icon: Palette },
  { name: "Language Preferences", href: "/settings/language", icon: Languages },
  { name: "Phrasebook", href: "/saved-phrases", icon: Bookmark },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hidden md:flex flex-col h-full sticky top-0 transition-colors">
      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors mb-6 text-sm font-medium">
          <ArrowLeft size={16} />
          Back to App
        </Link>
        <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-50 tracking-tight">Settings</h2>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1">
        {settingsTabs.map((item) => {
          const isActive = pathname === item.href || (pathname === '/settings' && item.href === '/settings/profile');
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
      
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
