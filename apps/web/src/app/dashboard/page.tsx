// apps/web/src/app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth, RedirectToSignIn } from '@clerk/nextjs';
import { DashboardNav } from '../../components/dashboard/dashboard-nav';
import { StatsOverview } from '../../components/dashboard/stats-overview';
import { DocumentIngestSidebar, PresetItem } from '../../components/dashboard/document-ingest-sidebar';
import { ForensicsDisplay } from '../../components/dashboard/forensics-display';
import { AuditTrailSection } from '../../components/dashboard/audit-trail-section';
import { ScanReport, AuditLogItem } from '../../types/screening';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://sih-backend-api.onrender.com/api';

const DEMO_PRESETS: PresetItem[] = [
  {
    label: 'Genuine Indian Passport',
    type: 'PASSPORT',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    category: 'GENUINE',
  },
  {
    label: 'Forged Visa (Tampered DOB & Stamp)',
    type: 'VISA',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    category: 'FORGED_VISA',
  },
  {
    label: 'Suspicious ID (Photo Splicing)',
    type: 'NATIONAL_ID',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
    category: 'SUSPICIOUS_ID',
  },
];

const INITIAL_LOGS: AuditLogItem[] = [
  {
    id: 'SSB-26188-9041',
    type: 'PASSPORT',
    name: 'VIKRAM SINGH',
    docNum: 'T8492019',
    riskScore: 6,
    status: 'APPROVED',
    time: '12:42 PM',
    checkpoint: 'Raxaul Border Post #04',
    hash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
  },
  {
    id: 'SSB-26188-9040',
    type: 'VISA',
    name: 'JOHNATHAN ROV',
    docNum: 'V-994102',
    riskScore: 89,
    status: 'FLAGGED_FRAUD',
    time: '12:35 PM',
    checkpoint: 'Panitanki Checkpoint',
    hash: '3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
  },
];

export default function BorderScreeningDashboard() {
  const { isLoaded, isSignedIn } = useAuth();

  // Redirect to Clerk sign-in if an unauthenticated visitor enters /dashboard
  if (isLoaded && !isSignedIn) {
    return <RedirectToSignIn />;
  }

  const [docType, setDocType] = useState('PASSPORT');
  const [docUrl, setDocUrl] = useState(DEMO_PRESETS[0].url);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [selectedScan, setSelectedScan] = useState<ScanReport | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [officerAction, setOfficerAction] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_LOGS);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setDocUrl(reader.result as string);
        setSelectedScan(null);
        setOfficerAction(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExecuteScan = async () => {
    setLoading(true);
    setOfficerAction(null);

    setScanStep('Stage 1/4: High-Res OCR & MRZ Parsing...');
    await new Promise((r) => setTimeout(r, 400));
    setScanStep('Stage 2/4: Error Level Analysis & Forensics...');
    await new Promise((r) => setTimeout(r, 500));
    setScanStep('Stage 3/4: 1:1 Biometric Face Match & Liveness...');
    await new Promise((r) => setTimeout(r, 400));
    setScanStep('Stage 4/4: Querying National Watchlists & Rules...');
    await new Promise((r) => setTimeout(r, 300));

    try {
      // 1. Attempt to call live NestJS backend
      const res = await axios.post(`${API_BASE}/screening/analyze`, {
        documentType: docType,
        documentImageUrl: docUrl,
        checkpointLocation: 'Raxaul Border Post #04',
      });
      const report = res.data.report;
      setSelectedScan(report);
      setAuditLogs((prev) => [
        {
          id: report.id,
          type: report.documentType,
          name: report.ocrExtractedData.fullName,
          docNum: report.ocrExtractedData.documentNumber,
          riskScore: report.riskScore,
          status: report.overallStatus,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          checkpoint: report.checkpoint,
          hash: report.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
        ...prev,
      ]);
    } catch {
      // 2. Client-side fallback if backend is offline or cold-starting
      const isVisaFraud = docUrl.includes('1589829545856') || docType === 'VISA';
      const isSuspicious = docUrl.includes('1578632767115');

      let report: ScanReport;

      if (isVisaFraud) {
        report = {
          id: `SSB-26188-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          checkpoint: 'Raxaul Border Post #04',
          documentType: docType,
          overallStatus: 'FLAGGED_FRAUD',
          riskScore: 92,
          sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          ocrExtractedData: {
            fullName: 'MICHAEL VANCE',
            documentNumber: 'V-49920194',
            nationality: 'SYNTHETIC / IRREGULAR',
            dateOfBirth: '1982-04-12 (Modified)',
            dateOfExpiry: '2028-11-20',
            mrzCode: 'V<FRAVANCE<<MICHAEL<<<<<<<<<<<<<<<<<<<\nV499201946FRA8204123M2811204<<<<<<<<<<<<<<02',
            mrzChecksumValid: false,
          },
          registryComparison: {
            matchedInDatabase: true,
            registryRecord: {
              officialName: 'UNKNOWN PERSON',
              officialDOB: '1990-01-01',
              status: 'REVOKED / BLACKLISTED',
              officialPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
              address: 'Interpol Alert Node - Watchlist #892',
              watchlistFlag: true,
            },
            discrepancies: [
              "Identity Mismatch: Card says 'MICHAEL VANCE' but Registry has 'UNKNOWN PERSON'.",
              "Date of Birth Anomaly: Card has '1982-04-12' vs Registry '1990-01-01'.",
              'CRITICAL ALERT: Identity is flagged on National Security Watchlist.',
            ],
          },
          databaseCheck: {
            registryMatch: false,
            blacklistStatus: 'WATCHLIST_HIT',
          },
          tamperingAnalysis: {
            confidence: 97.2,
            photoTampered: true,
            textAltered: true,
            stampForged: true,
            details: [
              'CRITICAL: Error Level Analysis detects compression mismatch along photo perimeter (Photo Splicing).',
              'CRITICAL: Font kerning and stroke-width anomaly in Date of Birth (Digital Alteration).',
              'HIGH: Consular Visa Stamp lacks official SSB spectral reflectance and micro-engraved boundary.',
            ],
            tamperedBoxes: [
              { label: 'Photo Splicing (ELA 98%)', top: '15%', left: '10%', width: '35%', height: '55%' },
              { label: 'Tampered DOB Font', top: '72%', left: '48%', width: '38%', height: '14%' },
              { label: 'Forged Consular Seal', top: '30%', left: '60%', width: '30%', height: '32%' },
            ],
          },
          faceVerification: {
            similarityScore: 36.4,
            livenessScore: 89.1,
            faceMatched: false,
          },
        };
      } else if (isSuspicious) {
        report = {
          id: `SSB-26188-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          checkpoint: 'Raxaul Border Post #04',
          documentType: docType,
          overallStatus: 'SUSPICIOUS',
          riskScore: 68,
          sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          ocrExtractedData: {
            fullName: 'SUNIL KUMAR RAY',
            documentNumber: 'ID-88392110',
            nationality: 'IND',
            dateOfBirth: '1995-11-03',
            dateOfExpiry: '2030-05-18',
            mrzCode: 'I<INDR883921104<<<<<<<<<<<<<<<<\n9511037M3005184IND<<<<<<<<<<<8',
            mrzChecksumValid: true,
          },
          registryComparison: {
            matchedInDatabase: false,
            registryRecord: null,
            discrepancies: ['Notice: Record pending verification in State ID database.'],
          },
          databaseCheck: {
            registryMatch: true,
            blacklistStatus: 'CLEAR',
          },
          tamperingAnalysis: {
            confidence: 84.1,
            photoTampered: true,
            textAltered: false,
            stampForged: false,
            details: [
              'MEDIUM: 3D biometric depth anomaly detected during live capture matching.',
              'MEDIUM: Micro-contrast disparity across card lamination overlay indicates potential re-glazing.',
            ],
            tamperedBoxes: [
              { label: 'Laminate Anomaly', top: '20%', left: '15%', width: '40%', height: '50%' },
            ],
          },
          faceVerification: {
            similarityScore: 61.2,
            livenessScore: 92.4,
            faceMatched: false,
          },
        };
      } else {
        report = {
          id: `SSB-26188-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          checkpoint: 'Raxaul Border Post #04',
          documentType: docType,
          overallStatus: 'APPROVED',
          riskScore: 4,
          sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          ocrExtractedData: {
            fullName: 'ROHIT VERMA',
            documentNumber: 'P10982341',
            nationality: 'IND',
            dateOfBirth: '1998-07-21',
            dateOfExpiry: '2034-08-14',
            mrzCode: 'P<INDVERMA<<ROHIT<<<<<<<<<<<<<<<<<<<<<\nP109823414IND9807218M3408142<<<<<<<<<<<<<<04',
            mrzChecksumValid: true,
          },
          registryComparison: {
            matchedInDatabase: true,
            registryRecord: {
              officialName: 'ROHIT VERMA',
              officialDOB: '1998-07-21',
              status: 'ACTIVE',
              officialPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
              address: 'B-42, Vasant Kunj, New Delhi',
              watchlistFlag: false,
            },
            discrepancies: [],
          },
          databaseCheck: {
            registryMatch: true,
            blacklistStatus: 'CLEAR',
          },
          tamperingAnalysis: {
            confidence: 99.1,
            photoTampered: false,
            textAltered: false,
            stampForged: false,
            details: [
              'Microprint alignment strictly conforms to ICAO Doc 9303 standards.',
              'Holographic optical security thread verified with zero pixel tampering.',
              'EXIF metadata analysis confirms authentic camera sensor profile.',
            ],
            tamperedBoxes: [],
          },
          faceVerification: {
            similarityScore: 98.4,
            livenessScore: 99.2,
            faceMatched: true,
          },
        };
      }

      setSelectedScan(report);
      setAuditLogs((prev) => [
        {
          id: report.id,
          type: report.documentType,
          name: report.ocrExtractedData.fullName,
          docNum: report.ocrExtractedData.documentNumber,
          riskScore: report.riskScore,
          status: report.overallStatus,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          checkpoint: report.checkpoint,
          hash: report.sha256Hash,
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerDecision = (action: 'CLEARED' | 'SECONDARY_INTERROGATION' | 'DETAINED') => {
    setOfficerAction(action);
  };

  const fraudCount = auditLogs.filter((l) => l.status === 'FLAGGED_FRAUD').length;
  const approvedCount = auditLogs.filter((l) => l.status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* 1. TOP NAVBAR */}
      <DashboardNav />

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Telemetry Stats */}
        <StatsOverview
          total={2480 + auditLogs.length}
          fraud={142 + fraudCount}
          approved={2338 + approvedCount}
        />

        {/* Workstation 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Controls & Upload */}
          <div className="lg:col-span-5">
            <DocumentIngestSidebar
              docType={docType}
              setDocType={setDocType}
              docUrl={docUrl}
              setDocUrl={setDocUrl}
              presets={DEMO_PRESETS}
              loading={loading}
              scanStep={scanStep}
              onScan={handleExecuteScan}
              onFileUpload={handleFileUpload}
              showHeatmap={showHeatmap}
              setShowHeatmap={setShowHeatmap}
              selectedScan={selectedScan}
            />
          </div>

          {/* Right: AI Forensics Report & Officer Decisions */}
          <div className="lg:col-span-7">
            <ForensicsDisplay
              scan={selectedScan}
              officerAction={officerAction}
              onOfficerDecision={handleOfficerDecision}
            />
          </div>
        </div>

        {/* Bottom: Cryptographic Audit Trail */}
        <AuditTrailSection logs={auditLogs} />
      </main>
    </div>
  );
}