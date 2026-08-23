'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Kanban, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoading } from '@/components/ui/loading';
import type { Lead, LeadStatus } from '@/lib/types';

const columns: { status: LeadStatus; label: string; color: string; bgColor: string }[] = [
  { status: 'new', label: 'New', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  { status: 'contacted', label: 'Contacted', color: 'bg-amber-500', bgColor: 'bg-amber-50' },
  { status: 'qualified', label: 'Qualified', color: 'bg-violet-500', bgColor: 'bg-violet-50' },
  { status: 'booked', label: 'Booked', color: 'bg-green-500', bgColor: 'bg-green-50' },
  { status: 'lost', label: 'Lost', color: 'bg-red-500', bgColor: 'bg-red-50' },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!business) {
        router.push('/dashboard/onboarding');
        return;
      }

      setBusinessId(business.id);

      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      setLeads(data || []);
      setLoading(false);
    }
    fetchLeads();
  }, [router]);

  async function moveToStatus(leadId: string, newStatus: LeadStatus) {
    const supabase = createClient();
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  }

  if (loading) return <PageLoading />;

  if (leads.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Pipeline</h1>
          <p className="text-text-secondary mt-1">Visual overview of your leads by status.</p>
        </div>
        <EmptyState
          icon={Kanban}
          title="No leads in pipeline"
          description="Create leads or share the chat widget to start filling your pipeline."
          action={{ label: 'Go to Leads', onClick: () => router.push('/dashboard/leads') }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Pipeline</h1>
        <p className="text-text-secondary mt-1">Visual overview of your leads by status.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const columnLeads = leads.filter((l) => l.status === col.status);
          return (
            <div key={col.status} className="min-w-[260px] flex-1">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-text-primary">{col.label}</span>
                <span className="text-xs font-medium text-text-tertiary bg-surface-tertiary px-2 py-0.5 rounded-full">
                  {columnLeads.length}
                </span>
              </div>
              <div className={`rounded-xl p-2 min-h-[200px] space-y-2 ${col.bgColor}`}>
                {columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/dashboard/leads?id=${lead.id}`)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-surface-tertiary flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-text-tertiary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{lead.name || 'Unknown'}</p>
                        <p className="text-xs text-text-secondary truncate">{lead.service_requested || 'No service'}</p>
                      </div>
                    </div>
                    {lead.vehicle && (
                      <p className="text-xs text-text-tertiary truncate mb-2">{lead.vehicle}</p>
                    )}
                    <div className="flex gap-1 flex-wrap">
                      {columns
                        .filter((c) => c.status !== col.status)
                        .map((c) => (
                          <button
                            key={c.status}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveToStatus(lead.id, c.status);
                            }}
                            className="text-[10px] font-medium text-text-tertiary hover:text-text-primary bg-surface-secondary hover:bg-surface-tertiary px-1.5 py-0.5 rounded transition-colors"
                          >
                            {c.label}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
