'use client';

import type { LeadStatus } from '@/lib/types';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-status-new/10 text-status-new ring-1 ring-status-new/25' },
  contacted: { label: 'Contacted', className: 'bg-status-contacted/10 text-status-contacted ring-1 ring-status-contacted/25' },
  qualified: { label: 'Qualified', className: 'bg-status-qualified/10 text-status-qualified ring-1 ring-status-qualified/25' },
  booked: { label: 'Booked', className: 'bg-status-booked/10 text-status-booked ring-1 ring-status-booked/25' },
  lost: { label: 'Lost', className: 'bg-status-lost/10 text-status-lost ring-1 ring-status-lost/25' },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
