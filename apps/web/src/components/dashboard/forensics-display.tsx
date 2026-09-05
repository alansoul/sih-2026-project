// apps/web/src/components/dashboard/forensics-display.tsx
'use client';

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  UserCheck,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Lock,
  Database,
  ArrowRight,
} from 'lucide-react';
import { ScanReport } from '../../types/screening';

interface ForensicsDisplayProps {
  scan: ScanReport | null;
  officerAction: string | null;
  onOfficerDecision: (action: 'CLEARED' | 'SECONDARY_INTERROGATION' | 'DETAINED') => void;
}

export const ForensicsDisplay: React.FC<ForensicsDisplayProps> = ({
  scan,
  officerAction,
  onOfficerDecision,
}) => {
  if (!scan) {
    return (
      <div className="h-full min-h-95 bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
          <ShieldCheck className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Ready for Document Screening</h3>
        <p className="text-xs max-w-sm mt-1 text-slate-500 leading-relaxed">
          Select a sample preset or upload a custom Aadhaar/passport to execute multi-stage verification.
        </p>
      </div>
    );
  }

  const isFraud = scan.overallStatus === 'FLAGGED_FRAUD';
  const isSuspicious = scan.overallStatus === 'SUSPICIOUS';

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Screening Banner */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-xs ${
          isFraud
            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
            : isSuspicious
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Official Determination
          </span>
          <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 mt-0.5 tracking-tight">
            {isFraud && <ShieldAlert className="w-6 h-6 text-rose-600" />}
            {isSuspicious && <AlertTriangle className="w-6 h-6 text-amber-600" />}
            {!isFraud && !isSuspicious && <ShieldCheck className="w-6 h-6 text-emerald-600" />}
            {scan.overallStatus.replace('_', ' ')}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Case ID: <span className="font-bold text-slate-700">{scan.id}</span> • Station: {scan.checkpoint}
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs text-right min-w-[120px]">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">AI Risk Score</span>
          <div
            className={`text-3xl font-black tracking-tight ${
              scan.riskScore > 50 ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {scan.riskScore}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE REGISTRY COMPARISON (Uploaded vs Central Database) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" /> Central Registry Cross-Check (UIDAI / MEA)
          </h4>
          <span
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
              scan.registryComparison?.matchedInDatabase && scan.registryComparison.discrepancies.length === 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {scan.registryComparison?.matchedInDatabase && scan.registryComparison.discrepancies.length === 0
              ? 'Registry Match: CONFIRMED'
              : 'Discrepancy / Record Conflict Detected'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
          {/* Column A: Uploaded Document Data */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 font-mono">
              Uploaded Document Values
            </span>
            <div className="space-y-1">
              <p><span className="text-slate-400">Bearer:</span> <strong className="text-slate-800">{scan.ocrExtractedData.fullName}</strong></p>
              <p><span className="text-slate-400">Document No:</span> <span className="font-mono text-slate-700">{scan.ocrExtractedData.documentNumber}</span></p>
              <p><span className="text-slate-400">Date of Birth:</span> <span className="text-slate-700">{scan.ocrExtractedData.dateOfBirth}</span></p>
            </div>
          </div>

          {/* Column B: Official Government Registry Data */}
          <div className={`border rounded-xl p-3 ${
            scan.registryComparison?.matchedInDatabase ? 'bg-indigo-50/40 border-indigo-200/80' : 'bg-rose-50/40 border-rose-200/80'
          }`}>
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 font-mono">
              Central Registry Record (UIDAI / MEA)
            </span>
            {scan.registryComparison?.registryRecord ? (
              <div className="space-y-1">
                <p><span className="text-slate-500">Official Name:</span> <strong className="text-slate-900">{scan.registryComparison.registryRecord.officialName}</strong></p>
                <p><span className="text-slate-500">Official DOB:</span> <span className="text-slate-900">{scan.registryComparison.registryRecord.officialDOB}</span></p>
                <p><span className="text-slate-500">Registry Status:</span> <span className="font-bold text-emerald-700">{scan.registryComparison.registryRecord.status}</span></p>
              </div>
            ) : (
              <p className="text-rose-600 font-semibold text-xs">No active record registered under this credential ID.</p>
            )}
          </div>
        </div>

        {/* Discrepancy Warnings */}
        {scan.registryComparison && scan.registryComparison.discrepancies.length > 0 && (
          <div className="mt-3 space-y-1">
            {scan.registryComparison.discrepancies.map((d, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Modules 1 & 4 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: OCR Extraction */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-blue-600" /> Module 1: OCR & Checksums
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-400">Bearer Name:</span>
              <span className="font-semibold text-slate-800">{scan.ocrExtractedData.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-400">Document No:</span>
              <span className="font-mono text-slate-700 font-semibold">{scan.ocrExtractedData.documentNumber}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">Mathematical Checksum:</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold border ${
                  scan.ocrExtractedData.mrzChecksumValid
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {scan.ocrExtractedData.mrzChecksumValid ? 'VERIFIED (PASS)' : 'CHECKSUM FAILED'}
              </span>
            </div>
          </div>
        </div>

        {/* Module 4: Face Biometrics */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-emerald-600" /> Module 4: Face Biometrics
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Live Face Similarity:</span>
              <span className="text-sm font-bold text-slate-800">{scan.faceVerification.similarityScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-700 ${
                  scan.faceVerification.similarityScore > 75 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${scan.faceVerification.similarityScore}%` }}
              />
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">3D Liveness Detection:</span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {scan.faceVerification.livenessScore}% Confidence (Pass)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Module 3: Tampering Forensics */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
        <div className="flex justify-between items-center mb-2.5">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" /> Module 3: Tampering Forensics
          </h4>
          <span className="text-[10px] font-mono text-slate-500">
            Confidence: <strong className="text-slate-800">{scan.tamperingAnalysis.confidence}%</strong>
          </span>
        </div>
        <div className="space-y-1.5">
          {scan.tamperingAnalysis.details.map((detail, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700"
            >
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span className="leading-relaxed">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Officer Action Console */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" /> Officer Action Console
        </h4>

        {officerAction ? (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Recorded Decision:</p>
              <p className="text-sm font-bold text-slate-900 uppercase mt-0.5 tracking-wide">
                {officerAction.replace('_', ' ')}
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium">
              Logged to Audit Trail
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => onOfficerDecision('CLEARED')}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Clear Traveler for Entry
            </button>
            <button
              onClick={() => onOfficerDecision('SECONDARY_INTERROGATION')}
              className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" /> Route to Secondary Desk
            </button>
            <button
              onClick={() => onOfficerDecision('DETAINED')}
              className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <XCircle className="w-4 h-4" /> Immediate Border Detention
            </button>
          </div>
        )}
      </div>
    </div>
  );
};