import Link from "next/link";
import { ArrowRight, Globe2, Sparkles, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { APP_NAME } from "@/lib/constants";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors selection:bg-primary-500 selection:text-white">
      <Navbar />
      <MobileHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-12 pb-20 md:pt-36 md:pb-48 overflow-hidden px-4">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light dark:mix-blend-overlay" />
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-primary-200 dark:bg-primary-900 rounded-full blur-3xl opacity-20 transition-colors" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-300 dark:bg-blue-900 rounded-full blur-3xl opacity-20 transition-colors" />

          <div className="container mx-auto text-center relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-sm mb-8 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors">
              <Sparkles size={16} className="text-primary-500" />
              <span>AI-powered Kikuyu translation with real voice</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold font-serif text-slate-900 dark:text-white tracking-tight leading-tight mb-6 transition-colors">
              The first AI translator <br className="hidden md:block" />
              <span className="text-gradient">built for Kikuyu.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors">
              Translate English and Kiswahili into Kikuyu instantly — with natural speech powered by Meta MMS and GhanaNLP.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/translate" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 group shadow-xl shadow-primary-500/20">
                  Start Translating
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Preview mock */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50 relative border-y border-slate-100 dark:border-slate-800 transition-colors">
          <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-20">
            <div className="max-w-5xl mx-auto rounded-3xl p-2 bg-gradient-to-b from-white/40 to-white/10 dark:from-slate-800/40 dark:to-slate-900/10 backdrop-blur-3xl border border-white/40 dark:border-slate-700/40 shadow-2xl overflow-hidden transition-colors">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner transition-colors">
                <div className="h-12 bg-slate-50 dark:bg-slate-950 flex items-center px-4 border-b border-slate-100 dark:border-slate-800 transition-colors">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/20" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-400/20" />
                    <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/20" />
                  </div>
                </div>
                <div className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                  <div className="hidden md:block w-px bg-slate-100 dark:bg-slate-800 absolute left-1/2 top-12 bottom-12 transition-colors" />
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-400 transition-colors uppercase tracking-wider">English</div>
                    <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 font-serif leading-relaxed transition-colors">"How many varieties of coffee are grown in Kenya?"</p>
                  </div>
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900/40 text-[10px] font-bold text-primary-600 dark:text-primary-400 transition-colors uppercase tracking-wider">Kikuyu</div>
                    <p className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-serif leading-relaxed transition-colors">"Ni midhemba irikuu ya kahuu ikuragio kenya"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-16 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Built to make Kikuyu more accessible</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white mb-4 transition-colors">How {APP_NAME} works</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto transition-colors">Three simple steps to hear Kikuyu spoken naturally.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
              {[
                { icon: Zap, title: "1. Input Text", desc: "Type, paste or speak your text in English or Kiswahili." },
                { icon: Globe2, title: "2. Translate", desc: "Our AI translates to natural spoken Kikuyu using your phrase library first, then AI fallback." },
                { icon: Sparkles, title: "3. Hear It Spoken", desc: "Listen to the Kikuyu translation using Meta MMS — a real Kikuyu-trained voice." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center group p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400 group-hover:-translate-y-2 transition-all duration-300 shadow-sm">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 transition-colors">{title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="md:hidden h-20" />
      <MobileBottomNav />
    </div>
  );
}
