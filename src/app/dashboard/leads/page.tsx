'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus, Search, Eye, Pencil, Trash2, X, ChevronDown, Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { StatusBadge } from '@/components/ui/status-badge';
import { QualificationBadge } from '@/components/ui/qualification-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner, PageLoading } from '@/components/ui/loading';
import type { Lead, LeadStatus } from '@/lib/types';

const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'booked', 'lost'];

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : trimmed.slice(0, 2);
  return initials.toUpperCase();
}

export default function LeadsPageWrapper() {
  return (
    <Suspense fallback={<PageLoading />}>
      <LeadsPage />
    </Suspense>
  );
}

function LeadModal({
  lead,
  mode,
  onClose,
  onSave,
  saving,
}: {
  lead: Partial<Lead>;
  mode: 'create' | 'edit' | 'view';
  onClose: () => void;
  onSave: (data: Partial<Lead>) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<Lead>>(lead);
  const isView = mode === 'view';

  return (
    <div className="animate-overlay-in fixed inset-0 bg-ink-950/50 z-50 flex items-center justify-center p-4">
      <div className="animate-panel-in bg-white rounded-xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {mode === 'create' ? 'New Lead' : mode === 'edit' ? 'Edit Lead' : 'Lead Details'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Name</label>
              <input
                className="input-field"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={isView}
                placeholder="Customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Phone</label>
              <input
                className="input-field"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={isView}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
            <input
              type="email"
              className="input-field"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isView}
              placeholder="customer@email.com"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Service Requested</label>
              <input
                className="input-field"
                value={form.service_requested || ''}
                onChange={(e) => setForm({ ...form, service_requested: e.target.value })}
                disabled={isView}
                placeholder="Full Detail"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Vehicle</label>
              <input
                className="input-field"
                value={form.vehicle || ''}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                disabled={isView}
                placeholder="2023 Toyota Camry"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Preferred Date</label>
              <input
                type="date"
                className="input-field"
                value={form.preferred_date || ''}
                onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
                disabled={isView}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Status</label>
              <select
                className="input-field"
                value={form.status || 'new'}
                onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
                disabled={isView}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Notes</label>
            <textarea
              className="input-field"
              rows={3}
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              disabled={isView}
              placeholder="Any additional notes..."
            />
          </div>
          {isView && (
            <div className="pt-2 border-t border-border space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text-primary">Lead Score:</span>
                <span className="text-sm text-text-secondary">{form.lead_score ?? '—'}</span>
                {form.qualification && <QualificationBadge qualification={form.qualification} />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary">Intent:</span>
                <span className="text-sm text-text-secondary capitalize">{form.intent || '—'}</span>
              </div>
            </div>
          )}
          {isView && form.created_at && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-text-tertiary">
                Created {new Date(form.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button onClick={() => onSave(form)} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Spinner size="sm" />}
              {mode === 'create' ? 'Create Lead' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | 'view'; lead: Partial<Lead> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchLeads = useCallback(async () => {
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

    const idParam = searchParams.get('id');
    if (idParam && data) {
      const found = data.find((l) => l.id === idParam);
      if (found) setModal({ mode: 'view', lead: found });
    }
  }, [router, searchParams]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function handleSave(data: Partial<Lead>) {
    if (!businessId) return;
    setSaving(true);
    const supabase = createClient();

    if (modal?.mode === 'create') {
      await supabase.from('leads').insert({ ...data, business_id: businessId });
    } else if (modal?.mode === 'edit' && data.id) {
      await supabase.from('leads').update(data).eq('id', data.id);
    }

    setSaving(false);
    setModal(null);
    fetchLeads();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from('leads').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchLeads();
  }

  if (loading) return <PageLoading />;

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.service_requested.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Leads</h1>
          <p className="text-text-secondary mt-1">{leads.length} total leads</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create', lead: { status: 'new' } })}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Lead
        </button>
      </div>

      <div className="card mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              className="input-field pl-9"
              placeholder="Search leads..."
              aria-label="Search leads"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="input-field appearance-none pr-8"
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | '')}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={leads.length === 0 ? 'No leads yet' : 'No matching leads'}
          description={
            leads.length === 0
              ? 'Create your first lead or share the chat widget to start capturing leads automatically.'
              : 'Try adjusting your search or filter.'
          }
          action={
            leads.length === 0
              ? { label: 'Create Lead', onClick: () => setModal({ mode: 'create', lead: { status: 'new' } }) }
              : undefined
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-2.5">Name</th>
                  <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-2.5 hidden md:table-cell">Service</th>
                  <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-2.5 hidden lg:table-cell">Vehicle</th>
                  <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-2.5">Status</th>
                  <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-2.5 hidden md:table-cell">Score</th>
                  <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-2.5 hidden lg:table-cell">Intent</th>
                  <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-2.5 hidden sm:table-cell">Date</th>
                  <th className="text-right text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0 text-xs font-semibold text-primary-700">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-text-primary truncate">{lead.name || '—'}</p>
                          <p className="text-xs text-text-secondary truncate">{lead.email || lead.phone || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 hidden md:table-cell text-sm text-text-secondary">{lead.service_requested || '—'}</td>
                    <td className="px-6 py-3.5 hidden lg:table-cell text-sm text-text-secondary">{lead.vehicle || '—'}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={lead.status as LeadStatus} /></td>
                    <td className="px-6 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">{lead.lead_score ?? '—'}</span>
                        {lead.qualification && <QualificationBadge qualification={lead.qualification} />}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 hidden lg:table-cell text-sm text-text-secondary capitalize">{lead.intent || '—'}</td>
                    <td className="px-6 py-3.5 hidden sm:table-cell text-sm text-text-secondary">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModal({ mode: 'view', lead })}
                          className="focus-ring p-1.5 rounded-md text-text-tertiary hover:text-primary-600 hover:bg-surface-tertiary transition-colors"
                          title="View"
                          aria-label={`View ${lead.name || 'lead'}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModal({ mode: 'edit', lead })}
                          className="focus-ring p-1.5 rounded-md text-text-tertiary hover:text-primary-600 hover:bg-surface-tertiary transition-colors"
                          title="Edit"
                          aria-label={`Edit ${lead.name || 'lead'}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(lead.id)}
                          className="focus-ring p-1.5 rounded-md text-text-tertiary hover:text-red-500 hover:bg-surface-tertiary transition-colors"
                          title="Delete"
                          aria-label={`Delete ${lead.name || 'lead'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <LeadModal
          lead={modal.lead}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {deleteConfirm && (
        <div className="animate-overlay-in fixed inset-0 bg-ink-950/50 z-50 flex items-center justify-center p-4">
          <div className="animate-panel-in bg-white rounded-xl border border-border shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Lead?</h3>
            <p className="text-sm text-text-secondary mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
