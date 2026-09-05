// packages/shared/ui/src/components.tsx
import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">{icon}</div>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-black text-white">{value}</span>
        <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
};

export interface StatusBadgeProps {
  status: 'APPROVED' | 'FLAGGED_FRAUD' | 'SUSPICIOUS' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isApproved = status === 'APPROVED';
  const isFraud = status === 'FLAGGED_FRAUD';

  const badgeClass = isApproved
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : isFraud
    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeClass}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
};