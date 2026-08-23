import Link from 'next/link';
import { Zap } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">LeadFlow AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/privacy" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} LeadFlow AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
