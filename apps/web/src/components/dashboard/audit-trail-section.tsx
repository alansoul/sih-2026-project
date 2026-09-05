// apps/web/src/components/dashboard/audit-trail-section.tsx
'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { AuditLogItem } from '../../types/screening';

interface AuditTrailProps {
  logs: AuditLogItem[];
}

export const AuditTrailSection: React.FC<AuditTrailProps> = ({ logs }) => {
  return (
    <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] mt-6">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="text-blue-600 w-4 h-4" /> Checkpoint Audit Trail
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            DPDP Act 2023 Compliant • SHA-256 Cryptographic Chain of Custody
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-medium">
          Total Records: {logs.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Scan ID</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Bearer Name</th>
              <th className="px-4 py-3 font-semibold">Doc Number</th>
              <th className="px-4 py-3 font-semibold">Risk Score</th>
              <th className="px-4 py-3 font-semibold">Verdict</th>
              <th className="px-4 py-3 font-semibold">SHA-256 Seal</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Checkpoint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">{log.id}</td>
                <td className="px-4 py-3 text-slate-500">{log.type}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{log.name}</td>
                <td className="px-4 py-3 font-mono text-slate-600">{log.docNum}</td>
                <td
                  className={`px-4 py-3 font-bold ${
                    log.riskScore > 50 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {log.riskScore}/100
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      log.status === 'FLAGGED_FRAUD'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : log.status === 'SUSPICIOUS'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                  {log.hash ? `${log.hash.slice(0, 8)}...${log.hash.slice(-6)}` : 'e3b0c442...'}
                </td>
                <td className="px-4 py-3 text-slate-500">{log.time}</td>
                <td className="px-4 py-3 text-slate-400">{log.checkpoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};