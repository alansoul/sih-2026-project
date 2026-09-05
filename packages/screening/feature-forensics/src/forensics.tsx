'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, FileText, UserCheck, Layers } from 'lucide-react';

export interface ForensicsScanData {
  id: string;
  checkpoint: string;
  overallStatus: 'APPROVED' | 'SUSPICIOUS' | 'FLAGGED_FRAUD';
  riskScore: number;
  ocrExtractedData: {
    fullName: string;
    documentNumber: string;
    nationality: string;
    dateOfBirth: string;
    mrzChecksumValid: boolean;
  };
  faceVerification: {
    similarityScore: number;
  };
  tamperingAnalysis: {
    details: string[];
  };
}

export const ForensicsPanel: React.FC<{ scan: ForensicsScanData | null }> = ({ scan }) => {
  if (!scan) {
    return (
      <div className="h-full min-h-95 bg-slate-900/50 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <ShieldCheck className="w-14 h-14 text-slate-700 mb-3" />
        <h3 className="text-sm font-bold text-slate-300">Ready for Document Screening</h3>
        <p className="text-xs max-w-sm mt-1 text-slate-500">
          Select a sample preset on the left and click &apos;Execute Border Screening&apos; to trigger AI OCR, Tampering Detection, and Biometric verification.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`p-5 rounded-xl border flex items-center justify-between ${
          scan.overallStatus === 'FLAGGED_FRAUD'
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
            : scan.overallStatus === 'SUSPICIOUS'
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Official Screening Determination
          </span>
          <h3 className="text-xl font-black flex items-center gap-2 mt-1">
            {scan.overallStatus === 'FLAGGED_FRAUD' && <ShieldAlert className="w-6 h-6 text-rose-400" />}
            {scan.overallStatus === 'APPROVED' && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
            {scan.overallStatus.replace('_', ' ')}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Case ID: <span className="font-mono text-slate-200">{scan.id}</span> • {scan.checkpoint}
          </p>
        </div>
        <div className="text-right bg-slate-950/80 border border-slate-800/80 px-4 py-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Risk Score</span>
          <div className={`text-2xl font-black ${scan.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {scan.riskScore}/100
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-3">
            <FileText className="w-4 h-4 text-blue-400" /> Module 1: OCR Identity Extraction
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-800/60 pb-1">
              <span className="text-slate-400">Bearer Name:</span>
              <span className="font-bold text-white">{scan.ocrExtractedData.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1">
              <span className="text-slate-400">Document No:</span>
              <span className="font-mono text-slate-200 font-semibold">{scan.ocrExtractedData.documentNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1">
              <span className="text-slate-400">Nationality / DOB:</span>
              <span className="text-slate-200">{scan.ocrExtractedData.nationality} • {scan.ocrExtractedData.dateOfBirth}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">ICAO MRZ Checksum:</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  scan.ocrExtractedData.mrzChecksumValid
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {scan.ocrExtractedData.mrzChecksumValid ? 'CHECKSUM VERIFIED' : 'FAILED CHECKSUM'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-3">
            <UserCheck className="w-4 h-4 text-emerald-400" /> Module 4: Biometric Face Match
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Live Face Similarity:</span>
              <span className="text-sm font-extrabold text-white">{scan.faceVerification.similarityScore}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full ${scan.faceVerification.similarityScore > 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${scan.faceVerification.similarityScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">Liveness Detection:</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                PASS (Active 3D Depth)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2.5">
          <Layers className="w-4 h-4 text-amber-400" /> Module 3: Tampering & Forgery Forensics
        </h4>
        <div className="space-y-1.5">
          {scan.tamperingAnalysis.details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300">
              <span className="text-amber-400 font-bold">•</span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};