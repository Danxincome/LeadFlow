'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  MessageSquare,
  Bot,
  Zap,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserMenu } from '@/components/layout/user-menu';

const navGroups = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Leads & Pipeline',
    items: [
      { name: 'Leads', href: '/dashboard/leads', icon: Users },
      { name: 'Pipeline', href: '/dashboard/pipeline', icon: Kanban },
      { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { name: 'AI Settings', href: '/dashboard/ai-settings', icon: Bot },
      { name: 'Business Profile', href: '/dashboard/onboarding', icon: Building2 },
    ],
  },
];

function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
}

function getCurrentNav(pathname: string) {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (isNavItemActive(pathname, item.href)) {
        return { group: group.label, page: item.name };
      }
    }
  }
  return { group: 'Overview', page: 'Dashboard' };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email || '');
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const currentNav = getCurrentNav(pathname);

  return (
    <div className="flex h-screen bg-surface-secondary">
      {sidebarOpen && (
        <div
          className="animate-overlay-in fixed inset-0 z-40 bg-ink-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white shadow-2xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">LeadFlow AI</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="focus-ring rounded-md p-1 text-text-secondary transition-colors hover:text-text-primary lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = isNavItemActive(pathname, item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-transparent text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <UserMenu email={userEmail} onLogout={handleLogout} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-white px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            className="focus-ring -ml-2 rounded-md p-2 text-text-secondary transition-colors hover:text-text-primary lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden min-w-0 items-baseline gap-2 lg:flex">
            <span className="text-sm text-text-tertiary">{currentNav.group}</span>
            <span className="text-sm text-text-tertiary">/</span>
            <h1 className="truncate text-sm font-semibold text-text-primary">{currentNav.page}</h1>
          </div>

          <h1 className="truncate text-base font-semibold text-text-primary lg:hidden">
            {currentNav.page}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
