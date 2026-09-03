'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Kanban, User, MoreHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoading } from '@/components/ui/loading';
import type { Lead, LeadStatus } from '@/lib/types';

const columns: { status: LeadStatus; label: string; color: string; bgColor: string }[] = [
  { status: 'new', label: 'New', color: 'bg-status-new', bgColor: 'bg-status-new/8' },
  { status: 'contacted', label: 'Contacted', color: 'bg-status-contacted', bgColor: 'bg-status-contacted/8' },
  { status: 'qualified', label: 'Qualified', color: 'bg-status-qualified', bgColor: 'bg-status-qualified/8' },
  { status: 'booked', label: 'Booked', color: 'bg-status-booked', bgColor: 'bg-status-booked/8' },
  { status: 'lost', label: 'Lost', color: 'bg-status-lost', bgColor: 'bg-status-lost/8' },
];

function MoveMenu({ current, onMove }: { current: LeadStatus; onMove: (status: LeadStatus) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Move to status"
        className="focus-ring flex items-center justify-center w-8 h-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="animate-dropdown-in absolute right-0 z-10 mt-1 w-40 rounded-lg border border-border bg-white shadow-lg overflow-hidden">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary border-b border-border-light">
            Move to
          </p>
          {columns
            .filter((c) => c.status !== current)
            .map((c) => (
              <button
                key={c.status}
                onClick={() => {
                  onMove(c.status);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors text-left"
              >
                <span className={`w-2 h-2 rounded-full ${c.color}`} />
                {c.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
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
                    className="bg-white rounded-xl p-3.5 shadow-sm border border-border hover:shadow-md hover:border-primary-200 transition-all cursor-pointer"
                    onClick={() => router.push(`/dashboard/leads?id=${lead.id}`)}
                  >
                    <div className="flex items-start gap-2.5 mb-2.5">
                      <div className="w-7 h-7 rounded-full bg-surface-tertiary flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-text-tertiary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">{lead.name || 'Unknown'}</p>
                        <p className="text-xs text-text-secondary truncate">{lead.service_requested || 'No service'}</p>
                      </div>
                    </div>
                    {lead.vehicle && (
                      <p className="text-xs text-text-tertiary truncate mb-2.5">{lead.vehicle}</p>
                    )}
                    <div className="flex items-center justify-end pt-2 border-t border-border-light">
                      <MoveMenu current={lead.status} onMove={(status) => moveToStatus(lead.id, status)} />
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
