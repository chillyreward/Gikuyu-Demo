"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Languages, LogOut } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { UserProfile, SavedPhrase } from "@/lib/store";

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  profile: UserProfile;
  pathname: string;
}

export function MobileDrawer({ isOpen, onClose, navItems, profile, pathname }: MobileDrawerProps) {
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="fixed inset-y-0 right-0 w-[280px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-sm">
              <Languages size={18} />
            </div>
            <span className="text-xl font-bold font-serif text-slate-900 dark:text-slate-50 tracking-tight">{APP_NAME}</span>
          </Link>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors bg-slate-100 dark:bg-slate-800 rounded-lg"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Section / Auth Actions */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
          {pathname === '/' ? (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={onClose}>
                <Button variant="outline" className="w-full justify-center">Log in</Button>
              </Link>
              <Link href="/signup" onClick={onClose}>
                <Button className="w-full justify-center">Sign up</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-serif text-slate-400">{profile.name?.charAt(0) || "U"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">{profile.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-white dark:bg-slate-950">
          {pathname !== '/' && navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/settings/profile' && pathname.startsWith('/settings'));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-50"
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

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/30 dark:bg-slate-900/10">
          <Link href="/about" onClick={onClose} className="block px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">About</Link>
          <Link href="/support" onClick={onClose} className="block px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">Support</Link>
          {pathname !== '/' && (
            <button className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors">
              <LogOut size={18} />
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
