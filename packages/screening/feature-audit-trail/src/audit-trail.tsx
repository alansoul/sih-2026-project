'use client';

import React from 'react';
import { Clock } from 'lucide-react';

// Self-contained StatusBadge (removes cross-package TS6307 dependency)
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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

export interface AuditLogItem {
  id: string;
  type: string;
  name: string;
  docNum: string;
  riskScore: number;
  status: string;
  time: string;
  checkpoint: string;
}

export const AuditTrailTable: React.FC<{ logs: AuditLogItem[] }> = ({ logs }) => {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="text-blue-400 w-4 h-4" /> SSB Checkpoint Digital Audit Trail
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Records: {logs.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Scan ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Bearer Name</th>
              <th className="px-4 py-3">Doc Number</th>
              <th className="px-4 py-3">Risk Score</th>
              <th className="px-4 py-3">Verdict</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Checkpoint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-2.5 font-mono text-slate-300">{log.id}</td>
                <td className="px-4 py-2.5 text-slate-400">{log.type}</td>
                <td className="px-4 py-2.5 font-semibold text-white">{log.name}</td>
                <td className="px-4 py-2.5 font-mono text-slate-300">{log.docNum}</td>
                <td className={`px-4 py-2.5 font-bold ${log.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {log.riskScore}/100
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={log.status} />
                </td>
                <td className="px-4 py-2.5 text-slate-400">{log.time}</td>
                <td className="px-4 py-2.5 text-slate-500">{log.checkpoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};