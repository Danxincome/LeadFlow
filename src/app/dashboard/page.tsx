'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoading } from '@/components/ui/loading';
import type { Lead, LeadStatus } from '@/lib/types';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  accentBorder: string;
  iconColor: string;
  primary?: boolean;
}

function StatsCard({ title, value, icon: Icon, accentBorder, iconColor, primary }: StatsCardProps) {
  return (
    <div className={`card p-6 border-t-2 ${accentBorder}`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <p className="text-sm font-medium text-text-secondary">{title}</p>
      </div>
      <p className={`font-bold text-text-primary mt-2 ${primary ? 'text-4xl' : 'text-2xl'}`}>{value}</p>
    </div>
  );
}

const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  booked: 'Booked',
  lost: 'Lost',
};

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-status-new',
  contacted: 'bg-status-contacted',
  qualified: 'bg-status-qualified',
  booked: 'bg-status-booked',
  lost: 'bg-status-lost',
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasBusinessProfile, setHasBusinessProfile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!business) {
        setHasBusinessProfile(false);
        setLoading(false);
        return;
      }

      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      setLeads(leadsData || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <PageLoading />;

  if (!hasBusinessProfile) {
    return (
      <div className="max-w-lg mx-auto mt-8">
        <EmptyState
          icon={Users}
          title="Welcome to LeadFlow AI!"
          description="Let's set up your business profile so the AI can start helping your customers."
          action={{ label: 'Set Up Business Profile', onClick: () => router.push('/dashboard/onboarding') }}
        />
      </div>
    );
  }

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const bookedLeads = leads.filter((l) => l.status === 'booked').length;
  const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0;

  const leadsByStatus = Object.fromEntries(
    (['new', 'contacted', 'qualified', 'booked', 'lost'] as LeadStatus[]).map((s) => [
      s,
      leads.filter((l) => l.status === s).length,
    ])
  ) as Record<LeadStatus, number>;

  const recentLeads = leads.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Overview of your leads and business performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Leads" value={totalLeads} icon={Users} accentBorder="border-primary-600" iconColor="text-primary-600" primary />
        <StatsCard title="New Leads" value={newLeads} icon={UserPlus} accentBorder="border-status-new" iconColor="text-status-new" />
        <StatsCard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} accentBorder="border-accent-500" iconColor="text-accent-500" />
        <StatsCard title="Booked" value={bookedLeads} icon={DollarSign} accentBorder="border-status-booked" iconColor="text-status-booked" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Recent Leads</h2>
          </div>
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-text-secondary text-sm">
              No leads yet. Share your chat widget to start capturing leads.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-secondary transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary truncate">{lead.name || 'Unknown'}</p>
                    <p className="text-sm text-text-secondary truncate">{lead.service_requested || 'No service specified'}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <StatusBadge status={lead.status as LeadStatus} />
                    <button
                      onClick={() => router.push(`/dashboard/leads?id=${lead.id}`)}
                      aria-label={`View ${lead.name || 'lead'}`}
                      className="focus-ring rounded-md p-1.5 text-text-tertiary hover:text-primary-600 transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Leads by Status</h2>
          </div>
          <div className="p-6 space-y-4">
            {(Object.entries(leadsByStatus) as [LeadStatus, number][]).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
                  <span className="text-sm text-text-secondary">{statusLabels[status]}</span>
                </div>
                <span className="text-sm font-semibold text-text-primary">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
