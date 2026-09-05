// apps/web/src/components/dashboard/stats-overview.tsx
'use client';

import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';

interface StatsOverviewProps {
  total: number;
  fraud: number;
  approved: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  total,
  fraud,
  approved,
}) => {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Screenings */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Screenings
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {total.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Active checkpoint optical queue
          </p>
        </div>
      </div>

      {/* 2. Fraud Intercepted */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Fraud Intercepted
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600">
              {fraud.toLocaleString()}
            </span>
            <span className="text-[10px] font-medium text-rose-700 bg-rose-50 border border-rose-200/70 px-1.5 py-0.5 rounded-md">
              Detained
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Tampered seals & fake credentials
          </p>
        </div>
      </div>

      {/* 3. Cleared & Verified */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Cleared & Verified
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600">
              {approved.toLocaleString()}
            </span>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.5 rounded-md">
              Authorized
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Legitimate cross-border travelers
          </p>
        </div>
      </div>

      {/* 4. Inspection Speed */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Inspection Latency
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              &lt; 2.4s
            </span>
            <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded-md">
              Optimized
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            OCR + ELA + Face Matching
          </p>
        </div>
      </div>
    </section>
  );
};