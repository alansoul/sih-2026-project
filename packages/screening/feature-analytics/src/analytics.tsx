'use client';

import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

// Self-contained StatCard (removes cross-package TS6307 dependency)
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}> = ({ title, value, subtitle, icon }) => (
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

export interface AnalyticsOverviewProps {
  total: number;
  fraud: number;
  approved: number;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  total,
  fraud,
  approved,
}) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Screenings"
        value={total}
        subtitle="All Checkpoints"
        icon={<Activity className="text-blue-400 w-5 h-5" />}
      />
      <StatCard
        title="Fraud Intercepted"
        value={fraud}
        subtitle="Immediate Detention"
        icon={<ShieldAlert className="text-rose-400 w-5 h-5" />}
      />
      <StatCard
        title="Cleared & Verified"
        value={approved}
        subtitle="Legitimate Travelers"
        icon={<CheckCircle2 className="text-emerald-400 w-5 h-5" />}
      />
      <StatCard
        title="Inspection Speed"
        value="< 2.4s"
        subtitle="AI Optical Pipeline"
        icon={<Clock className="text-amber-400 w-5 h-5" />}
      />
    </section>
  );
};