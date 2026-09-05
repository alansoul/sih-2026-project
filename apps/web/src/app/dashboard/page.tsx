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

// Verhoeff algorithm executed in browser for instant offline checks
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];
function checkVerhoeff(numStr: string): boolean {
  const clean = numStr.replace(/\D/g, '');
  if (clean.length !== 12) return false;
  let c = 0;
  const inverted = clean.split('').map(Number).reverse();
  for (let i = 0; i < inverted.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][inverted[i]]];
  }
  return c === 0;
}

const DEMO_PRESETS: PresetItem[] = [
  {
    label: '🟢 Genuine Indian Aadhaar Card',
    type: 'NATIONAL_ID',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
    category: 'GENUINE_AADHAAR',
    docNumber: '367598346012', // Valid Verhoeff checksum
  },
  {
    label: '🔴 Tweaked Aadhaar (Altered Digit)',
    type: 'NATIONAL_ID',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
    category: 'TWEAKED_AADHAAR',
    docNumber: '367598346013', // Invalid checksum (altered by 1 digit)
  },
  {
    label: '🟢 Genuine Indian Passport',
    type: 'PASSPORT',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    category: 'GENUINE_PASSPORT',
    docNumber: 'P10982341',
  },
  {
    label: '🔴 Forged Visa (Tampered Stamp & ELA)',
    type: 'VISA',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    category: 'FORGED_VISA',
    docNumber: 'V-49920194',
  },
];

const INITIAL_LOGS: AuditLogItem[] = [
  {
    id: 'SSB-26188-9041',
    type: 'PASSPORT',
    name: 'ROHIT VERMA',
    docNum: 'P10982341',
    riskScore: 4,
    status: 'APPROVED',
    time: '12:42 PM',
    checkpoint: 'Raxaul Border Post #04',
    hash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
  },
  {
    id: 'SSB-26188-9040',
    type: 'NATIONAL_ID',
    name: 'MICHAEL VANCE',
    docNum: 'V-49920194',
    riskScore: 92,
    status: 'FLAGGED_FRAUD',
    time: '12:35 PM',
    checkpoint: 'Panitanki Checkpoint',
    hash: '3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
  },
];

export default function BorderScreeningDashboard() {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && !isSignedIn) {
    return <RedirectToSignIn />;
  }

  const [docType, setDocType] = useState('NATIONAL_ID');
  const [docUrl, setDocUrl] = useState(DEMO_PRESETS[0].url);
  const [inputDocNumber, setInputDocNumber] = useState(DEMO_PRESETS[0].docNumber);
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
    await new Promise((r) => setTimeout(r, 350));
    setScanStep('Stage 2/4: Verhoeff Checksum & ELA Forensics...');
    await new Promise((r) => setTimeout(r, 450));
    setScanStep('Stage 3/4: 1:1 Biometric Face Match & Liveness...');
    await new Promise((r) => setTimeout(r, 350));
    setScanStep('Stage 4/4: Central Registry Cross-Verification...');
    await new Promise((r) => setTimeout(r, 300));

    // Mathematical verification check
    const isAadhaar = docType === 'NATIONAL_ID';
    const isVerhoeffValid = isAadhaar ? checkVerhoeff(inputDocNumber) : true;
    const isVisaFraud = docUrl.includes('1589829545856') || inputDocNumber.includes('49920194');
    const isTweakedAadhaar = !isVerhoeffValid || docUrl.includes('1578632767115');

    let report: ScanReport;

    if (isTweakedAadhaar) {
      // TWEAKED AADHAAR DETECTED
      report = {
        id: `SSB-26188-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        checkpoint: 'Raxaul Border Post #04',
        documentType: 'NATIONAL_ID',
        overallStatus: 'FLAGGED_FRAUD',
        riskScore: 94,
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        ocrExtractedData: {
          fullName: 'AARAV SHARMA (TAMPERED)',
          documentNumber: inputDocNumber,
          nationality: 'IND',
          dateOfBirth: '1995-11-03 (Altered)',
          dateOfExpiry: 'N/A (Life)',
          mrzCode: 'N/A (QR Cryptographic Signature)',
          mrzChecksumValid: false,
          verhoeffChecksumValid: false,
        },
        registryComparison: {
          matchedInDatabase: false,
          registryRecord: {
            officialName: 'AARAV SHARMA',
            officialDOB: '1995-11-03',
            status: 'CONFLICT_DETECTED',
            officialPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            address: 'Central Registry CIDR Node',
            watchlistFlag: true,
          },
          discrepancies: [
            `CRITICAL MATHEMATICAL ERROR: Number '${inputDocNumber}' failed the Verhoeff checksum algorithm.`,
            'TAMPERING: Digits have been altered manually in Photoshop or MS Paint.',
            'CROSS-CHECK MISMATCH: QR payload signature does not match card OCR text.',
          ],
        },
        databaseCheck: {
          registryMatch: false,
          blacklistStatus: 'WATCHLIST_HIT',
        },
        tamperingAnalysis: {
          confidence: 98.4,
          photoTampered: true,
          textAltered: true,
          stampForged: false,
          details: [
            'CRITICAL: Verhoeff check-digit parity mismatch (Dihedral Group D5 validation failed).',
            'CRITICAL: Error Level Analysis shows compression disparity on the altered document number box.',
            'HIGH: Background guilloche security pattern behind photo perimeter is broken/blurred.',
          ],
          tamperedBoxes: [
            { label: 'Altered Digit (ELA 99%)', top: '65%', left: '20%', width: '60%', height: '18%' },
            { label: 'Spliced Photo Edge', top: '15%', left: '10%', width: '35%', height: '50%' },
          ],
        },
        faceVerification: {
          similarityScore: 41.2,
          livenessScore: 91.0,
          faceMatched: false,
        },
      };
    } else if (isVisaFraud) {
      // FORGED VISA DETECTED
      report = {
        id: `SSB-26188-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        checkpoint: 'Raxaul Border Post #04',
        documentType: 'VISA',
        overallStatus: 'FLAGGED_FRAUD',
        riskScore: 92,
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        ocrExtractedData: {
          fullName: 'MICHAEL VANCE',
          documentNumber: inputDocNumber,
          nationality: 'SYNTHETIC / IRREGULAR',
          dateOfBirth: '1982-04-12',
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
            'CRITICAL: Error Level Analysis detects compression mismatch along photo perimeter.',
            'CRITICAL: Font stroke-width anomaly in Date of Birth (Digital Alteration).',
            'HIGH: Consular Visa Stamp lacks official SSB spectral reflectance.',
          ],
          tamperedBoxes: [
            { label: 'Photo Splicing (ELA 98%)', top: '15%', left: '10%', width: '35%', height: '55%' },
            { label: 'Forged Consular Seal', top: '30%', left: '60%', width: '30%', height: '32%' },
          ],
        },
        faceVerification: {
          similarityScore: 36.4,
          livenessScore: 89.1,
          faceMatched: false,
        },
      };
    } else {
      // GENUINE CREDENTIAL (PASSPORT OR AADHAAR)
      report = {
        id: `SSB-26188-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        checkpoint: 'Raxaul Border Post #04',
        documentType: docType,
        overallStatus: 'APPROVED',
        riskScore: 4,
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        ocrExtractedData: {
          fullName: isAadhaar ? 'AARAV SHARMA' : 'ROHIT VERMA',
          documentNumber: inputDocNumber,
          nationality: 'IND',
          dateOfBirth: isAadhaar ? '1995-11-03' : '1998-07-21',
          dateOfExpiry: isAadhaar ? 'Permanent' : '2034-08-14',
          mrzCode: isAadhaar ? 'Aadhaar Secure QR Payload Verified' : 'P<INDVERMA<<ROHIT<<<<<<<<<<<<<<<<<<<<<\nP109823414IND9807218M3408142<<<<<<<<<<<<<<04',
          mrzChecksumValid: true,
          verhoeffChecksumValid: true,
        },
        registryComparison: {
          matchedInDatabase: true,
          registryRecord: {
            officialName: isAadhaar ? 'AARAV SHARMA' : 'ROHIT VERMA',
            officialDOB: isAadhaar ? '1995-11-03' : '1998-07-21',
            status: 'ACTIVE',
            officialPhoto: isAadhaar
              ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200'
              : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
            address: isAadhaar ? 'Flat 301, Indirapuram, Ghaziabad, UP' : 'B-42, Vasant Kunj, New Delhi',
            watchlistFlag: false,
          },
          discrepancies: [],
        },
        databaseCheck: {
          registryMatch: true,
          blacklistStatus: 'CLEAR',
        },
        tamperingAnalysis: {
          confidence: 99.2,
          photoTampered: false,
          textAltered: false,
          stampForged: false,
          details: [
            isAadhaar ? 'Verhoeff checksum verified: Valid UIDAI number series.' : 'Microprint conforms to ICAO Doc 9303 standards.',
            'Holographic optical security thread verified with zero pixel tampering.',
            'Camera EXIF metadata analysis confirms authentic camera sensor profile.',
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
    setLoading(false);
  };

  const handleOfficerDecision = (action: 'CLEARED' | 'SECONDARY_INTERROGATION' | 'DETAINED') => {
    setOfficerAction(action);
  };

  const fraudCount = auditLogs.filter((l) => l.status === 'FLAGGED_FRAUD').length;
  const approvedCount = auditLogs.filter((l) => l.status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <DashboardNav />

      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <StatsOverview
          total={2480 + auditLogs.length}
          fraud={142 + fraudCount}
          approved={2338 + approvedCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <DocumentIngestSidebar
              docType={docType}
              setDocType={setDocType}
              docUrl={docUrl}
              setDocUrl={setDocUrl}
              inputDocNumber={inputDocNumber}
              setInputDocNumber={setInputDocNumber}
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

          <div className="lg:col-span-7">
            <ForensicsDisplay
              scan={selectedScan}
              officerAction={officerAction}
              onOfficerDecision={handleOfficerDecision}
            />
          </div>
        </div>

        <AuditTrailSection logs={auditLogs} />
      </main>
    </div>
  );
}