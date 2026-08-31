'use client';

import type { LeadQualification } from '@/lib/types';

const qualificationConfig: Record<LeadQualification, { label: string; className: string }> = {
  hot: { label: 'Hot', className: 'bg-red-500/10 text-red-700 ring-1 ring-red-500/25' },
  warm: { label: 'Warm', className: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/25' },
  cold: { label: 'Cold', className: 'bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/25' },
};

export function QualificationBadge({ qualification }: { qualification: LeadQualification }) {
  const config = qualificationConfig[qualification] || qualificationConfig.cold;
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
