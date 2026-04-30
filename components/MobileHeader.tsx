"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { APP_NAME } from "@/lib/constants";

interface MobileHeaderProps {
  /** Optional: show a secondary action on the right instead of just theme toggle */
  rightSlot?: React.ReactNode;
}

export function MobileHeader({ rightSlot }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-40 w-full h-14 flex items-center justify-between px-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-sm shrink-0">
          <Languages size={17} />
        </div>
        <span className="text-lg font-bold font-serif text-slate-900 dark:text-slate-50 tracking-tight truncate">
          {APP_NAME}
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {rightSlot}
        <ThemeToggle />
      </div>
    </header>
  );
}
