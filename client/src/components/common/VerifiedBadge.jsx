import React from 'react';
import { ShieldCheck } from 'lucide-react';

const VerifiedBadge = ({ date, department, className = '' }) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Verified 2026';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold ${className}`}
      title={`Verified official government information from ${department || 'National Portal'}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span>अधिकृत सत्यापित ({formattedDate})</span>
    </div>
  );
};

export default VerifiedBadge;
