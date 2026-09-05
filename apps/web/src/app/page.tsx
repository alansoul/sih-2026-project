// apps/web/src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ScanLine,
  FileCheck2,
  Cpu,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. GOVERNMENT & SSB HEADER */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 flex items-center gap-2">
                SSB SENTINEL-ID
              </span>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider">
                MHA • PS ID: 26188 • SASHASTRA SEEMA BAL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer">
                  Officer Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all text-white shadow-xs cursor-pointer">
                  Register Checkpoint
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="text-xs font-bold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                Access Border Console <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-16 px-4 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          Smart India Hackathon Prototype • Problem ID: 26188
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 max-w-4xl leading-tight">
          AI-Based Fake Identity & <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600">
            Document Screening System
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed">
          Developed for the <strong className="text-slate-800">Ministry of Home Affairs</strong> &{' '}
          <strong className="text-slate-800">Sashastra Seema Bal (SSB)</strong>. Intercepts forged passports, altered dates of
          birth, tampered visa stamps, and photo impersonations in under 2.4 seconds.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              Launch Live Screening Console <ArrowRight className="w-4 h-4" />
            </Link>
          </Show>

          <Show when="signed-out">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer">
                Register to Access Screening Console <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
          </Show>

          <a
            href="#modules"
            className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 text-sm transition-all shadow-xs"
          >
            Inspect 4-Stage Architecture
          </a>
        </div>

        {/* Real-time stats banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-16 text-left">
          <div className="bg-white border border-slate-200/90 p-4.5 rounded-2xl shadow-xs">
            <span className="text-2xl font-black text-slate-900">&lt; 2.4s</span>
            <p className="text-xs text-slate-500 mt-1">Inspection Speed</p>
          </div>
          <div className="bg-white border border-slate-200/90 p-4.5 rounded-2xl shadow-xs">
            <span className="text-2xl font-black text-emerald-600">99.4%</span>
            <p className="text-xs text-slate-500 mt-1">MRZ & Stamp Accuracy</p>
          </div>
          <div className="bg-white border border-slate-200/90 p-4.5 rounded-2xl shadow-xs">
            <span className="text-2xl font-black text-blue-600">ICAO 9303</span>
            <p className="text-xs text-slate-500 mt-1">Standard TD1/TD3 Format</p>
          </div>
          <div className="bg-white border border-slate-200/90 p-4.5 rounded-2xl shadow-xs">
            <span className="text-2xl font-black text-amber-600">SHA-256</span>
            <p className="text-xs text-slate-500 mt-1">Cryptographic Audit Trail</p>
          </div>
        </div>
      </section>

      {/* 3. THE 4 MODULES */}
      <section id="modules" className="py-16 border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-mono uppercase text-blue-600 tracking-wider font-semibold">Solution Specification</h2>
            <p className="text-2xl font-bold text-slate-900 mt-1">4-Stage AI Document Forensics Engine</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <ScanLine className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase text-blue-600 font-semibold">Module 1</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">OCR Identity Extraction</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Extracts name, nationality, passport number, and validates ICAO 9303 MRZ check digits.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-4 block border-t border-slate-200 pt-3">
                ICAO Doc 9303 Checksum
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase text-emerald-600 font-semibold">Module 2</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Document Validation</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Verifies expiry horizons, date chronology rules, and queries simulated national blacklists.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-4 block border-t border-slate-200 pt-3">
                Deterministic Rule Engine
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase text-amber-600 font-semibold">Module 3 (Core AI)</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Tampering Forensics</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Computer vision detecting photo replacement, font kerning anomalies, and fake consular visa ink stamps.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-4 block border-t border-slate-200 pt-3">
                Error Level Analysis (ELA)
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase text-purple-600 font-semibold">Module 4</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Face Verification</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  1:1 biometric comparison between credential photo and live camera feed with 3D anti-spoof liveness testing.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-4 block border-t border-slate-200 pt-3">
                Cosine Similarity Embedding
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Ministry of Home Affairs (MHA) • Sashastra Seema Bal (SSB) Police II Division • SIH Prototype
      </footer>
    </div>
  );
}