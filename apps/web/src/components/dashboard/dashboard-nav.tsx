// apps/web/src/components/dashboard/dashboard-nav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Shield, ArrowLeft, Radio, CheckCircle } from 'lucide-react';

export const DashboardNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3.5">
        <Link
          href="/"
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all shadow-xs"
          title="Back to Portal"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                SENTINEL-ID <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80 font-semibold">SSB v2.4</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">
              Ministry of Home Affairs • PS ID: 26188 • Sashastra Seema Bal
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Noviq style status badge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <Radio className="w-3 h-3 text-slate-400" />
            <span>Raxaul Checkpoint #04</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 text-[10px]">Online</span>
          </div>
        </div>

        <div className="border-l border-slate-200 pl-3">
          <UserButton />
        </div>
      </div>
    </header>
  );
};