'use client';

import type { LeadStatus } from '@/lib/types';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' },
  contacted: { label: 'Contacted', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' },
  qualified: { label: 'Qualified', className: 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/20' },
  booked: { label: 'Booked', className: 'bg-green-50 text-green-700 ring-1 ring-green-600/20' },
  lost: { label: 'Lost', className: 'bg-red-50 text-red-700 ring-1 ring-red-600/20' },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
