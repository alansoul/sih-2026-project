// apps/web/src/components/dashboard/document-ingest-sidebar.tsx
'use client';

import React from 'react';
import { FileCheck2, Upload, Search, RefreshCw, Eye, Sparkles, ChevronRight, Hash } from 'lucide-react';
import { ScanReport } from '../../types/screening';

export interface PresetItem {
  label: string;
  type: string;
  url: string;
  category: string;
  docNumber: string;
}

interface IngestSidebarProps {
  docType: string;
  setDocType: (t: string) => void;
  docUrl: string;
  setDocUrl: (u: string) => void;
  inputDocNumber: string;
  setInputDocNumber: (n: string) => void;
  presets: PresetItem[];
  loading: boolean;
  scanStep: string;
  onScan: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showHeatmap: boolean;
  setShowHeatmap: (v: boolean) => void;
  selectedScan: ScanReport | null;
}

export const DocumentIngestSidebar: React.FC<IngestSidebarProps> = ({
  docType,
  setDocType,
  docUrl,
  setDocUrl,
  inputDocNumber,
  setInputDocNumber,
  presets,
  loading,
  scanStep,
  onScan,
  onFileUpload,
  showHeatmap,
  setShowHeatmap,
  selectedScan,
}) => {
  return (
    <section className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col gap-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <FileCheck2 className="text-blue-600 w-4 h-4" /> Document Ingestion
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Select a test case or upload your own document</p>
        </div>
        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Ready
        </span>
      </div>

      {/* Preset Test Cases */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Evaluation Presets
          </label>
          <span className="text-[10px] text-slate-400 font-medium">1-Click Test</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {presets.map((preset, idx) => {
            const isSelected = docUrl === preset.url;
            return (
              <button
                key={idx}
                onClick={() => {
                  setDocType(preset.type);
                  setDocUrl(preset.url);
                  setInputDocNumber(preset.docNumber);
                }}
                className={`text-left text-xs p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-300 text-blue-950 font-semibold shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span>{preset.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Upload Dropzone */}
      <div>
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
          Upload Real or Tweak-Tested Card
        </label>
        <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30 p-3.5 rounded-xl cursor-pointer transition-all">
          <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors mb-1" />
          <span className="text-xs text-slate-700 font-medium">Upload Aadhaar, Passport, or Visa image</span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">JPEG, PNG up to 20MB</span>
          <input type="file" accept="image/*" onChange={onFileUpload} className="hidden" />
        </label>
      </div>

      {/* Interactive Number Verifier (Tweak & Test Tool) */}
      <div>
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Target Document Number to Validate</span>
          <span className="text-[10px] font-mono text-blue-600 font-normal">Edit digit to test tweak</span>
        </label>
        <div className="relative">
          <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={inputDocNumber}
            onChange={(e) => setInputDocNumber(e.target.value)}
            placeholder="e.g., 367598346012 or P10982341"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 font-mono focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Document Classification */}
      <div>
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
          Classification Standard
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 font-medium transition-colors cursor-pointer"
        >
          <option value="NATIONAL_ID">National ID (Aadhaar / Voter ID)</option>
          <option value="PASSPORT">Passport (ICAO Doc 9303 Standard)</option>
          <option value="VISA">Entry / Transit Consular Visa</option>
          <option value="DRIVING_LICENSE">Driving Permit / Border Card</option>
        </select>
      </div>

      {/* Visual Sensor Feed Preview */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Optical Sensor Feed
          </label>
          {selectedScan && selectedScan.tamperingAnalysis.tamperedBoxes.length > 0 && (
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                showHeatmap
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" />
              {showHeatmap ? 'Hide ELA Forensic Map' : 'View ELA Forensic Map'}
            </button>
          )}
        </div>

        <div className="relative border border-slate-200 bg-slate-50 rounded-xl p-2.5 flex flex-col items-center justify-center overflow-hidden min-h-44">
          <img
            src={docUrl}
            alt="Document Visual Feed"
            className="max-h-44 w-full object-contain rounded-lg border border-slate-200/80 bg-white"
          />

          {/* Forensic Heatmap Bounding Boxes */}
          {showHeatmap &&
            selectedScan &&
            selectedScan.tamperingAnalysis.tamperedBoxes.map((box, idx) => (
              <div
                key={idx}
                className="absolute border-2 border-rose-500 bg-rose-500/20 animate-pulse rounded pointer-events-none flex items-start justify-start p-1"
                style={{
                  top: box.top,
                  left: box.left,
                  width: box.width,
                  height: box.height,
                }}
              >
                <span className="bg-rose-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                  {box.label}
                </span>
              </div>
            ))}
          <p className="text-[10px] text-slate-400 mt-2 font-mono text-center">
            {showHeatmap ? '⚠️ Error Level Analysis (ELA) Splicing Detection Active' : 'Sensor Stream: 1920x1080 • Calibrated RGB'}
          </p>
        </div>
      </div>

      {/* Execute Scan Button */}
      <button
        onClick={onScan}
        disabled={loading}
        className="w-full mt-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs tracking-wide cursor-pointer"
      >
        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {loading ? scanStep : 'Execute 4-Stage Border Screening'}
      </button>
    </section>
  );
};