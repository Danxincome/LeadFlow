import Link from 'next/link';
import { Zap } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-border-light">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-text-primary block leading-tight">LeadFlow AI</span>
              <span className="text-xs text-text-tertiary">AI Receptionist for Auto Detailing</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/privacy" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
        <p className="pt-6 text-sm text-text-tertiary text-center md:text-left">
          &copy; {new Date().getFullYear()} LeadFlow AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
