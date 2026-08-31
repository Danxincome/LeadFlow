'use client';

import type { LeadQualification } from '@/lib/types';

const qualificationConfig: Record<LeadQualification, { label: string; className: string }> = {
  hot: { label: 'Hot', className: 'bg-red-50 text-red-700 ring-1 ring-red-600/20' },
  warm: { label: 'Warm', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' },
  cold: { label: 'Cold', className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' },
};

export function QualificationBadge({ qualification }: { qualification: LeadQualification }) {
  const config = qualificationConfig[qualification] || qualificationConfig.cold;
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
