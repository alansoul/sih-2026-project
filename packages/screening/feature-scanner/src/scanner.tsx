'use client';

import React from 'react';
import { FileCheck2, Search, RefreshCw } from 'lucide-react';

export const DEMO_PRESETS = [
  {
    label: '🟢 Valid Indian Passport',
    type: 'PASSPORT',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
  },
  {
    label: '🔴 Forged Visa (Tampered DOB & Stamp)',
    type: 'VISA',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
  },
  {
    label: '🟡 Suspicious ID (Photo Swap Anomaly)',
    type: 'NATIONAL_ID',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
  },
];

export interface ScannerProps {
  docType: string;
  setDocType: (t: string) => void;
  docUrl: string;
  setDocUrl: (u: string) => void;
  onScan: () => void;
  loading: boolean;
}

export const DocumentScanner: React.FC<ScannerProps> = ({
  docType,
  setDocType,
  docUrl,
  setDocUrl,
  onScan,
  loading,
}) => {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <FileCheck2 className="text-blue-400 w-4 h-4" /> 1. Ingest Travel Document
        </h2>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          AI Vision Engine Ready
        </span>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-400 uppercase">Jury Demo Samples (Click to Load)</label>
        <div className="grid grid-cols-1 gap-2 mt-1.5">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDocType(preset.type);
                setDocUrl(preset.url);
              }}
              className={`text-left text-xs p-2.5 rounded-lg border transition-all ${
                docUrl === preset.url
                  ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-400 uppercase">Document Classification</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="PASSPORT">Passport (ICAO Doc 9303 Standard)</option>
          <option value="VISA">Entry / Transit Visa</option>
          <option value="NATIONAL_ID">National ID (Aadhaar / Voter Card)</option>
          <option value="DRIVING_LICENSE">Driving License Permit</option>
        </select>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-400 uppercase">Optical Image Preview</label>
        <div className="mt-1.5 border border-dashed border-slate-800 bg-slate-950/70 rounded-lg p-3 flex flex-col items-center justify-center">
          <img src={docUrl} alt="Preview" className="max-h-40 w-full object-contain rounded border border-slate-800" />
          <p className="text-[10px] text-slate-500 mt-2 font-mono">Resolution: 1920x1080 • EXIF Tag: RAW_STREAM</p>
        </div>
      </div>

      <button
        onClick={onScan}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 text-sm"
      >
        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {loading ? 'Running Multi-Stage AI Screening...' : 'Execute Border Screening'}
      </button>
    </section>
  );
};