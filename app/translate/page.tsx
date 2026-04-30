"use client";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { TranslationCard } from "@/components/TranslationCard";

export default function TranslatePage() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <MobileHeader />

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-200/40 dark:bg-primary-900/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-colors" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none transition-colors" />

        <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col justify-center relative z-10 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto w-full min-w-0">
            <TranslationCard />
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
