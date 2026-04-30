import Link from "next/link";
import { Languages } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 md:py-16 transition-colors">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-sm group-hover:scale-110 transition-transform">
                <Languages size={18} />
              </div>
              <span className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Professional translation tools bridging languages and cultures through advanced technology and localized intelligence.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white mb-4 uppercase tracking-[0.2em]">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/translate" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Translate</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white mb-4 uppercase tracking-[0.2em]">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="/support" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white mb-4 uppercase tracking-[0.2em]">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">© {new Date().getFullYear()} {APP_NAME} Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

