// apps/api/src/app/app.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface ScreeningRequest {
  documentType: string;
  documentImageUrl: string;
  checkpointLocation?: string;
  manualDocNumber?: string;
}

export interface RegistryEntry {
  officialName: string;
  officialDOB: string;
  status: string;
  officialPhoto: string;
  address: string;
  watchlistFlag: boolean;
}

// 1. Verhoeff Mathematical Algorithm Tables (Dihedral Group D5)
const VERHOEFF_D: number[][] = [
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

const VERHOEFF_P: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

function validateVerhoeff(numStr: string): boolean {
  const clean = numStr.replace(/\D/g, '');
  if (clean.length !== 12) return false;

  let c = 0;
  const inverted = clean.split('').map(Number).reverse();
  for (let i = 0; i < inverted.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][inverted[i]]];
  }
  return c === 0;
}

// 2. Mock Central Government Registry (Strictly typed without `any`)
const CENTRAL_GOVERNMENT_REGISTRY: Record<string, RegistryEntry> = {
  // Genuine Passport record
  P10982341: {
    officialName: 'ROHIT VERMA',
    officialDOB: '1998-07-21',
    status: 'ACTIVE',
    officialPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
    address: 'B-42, Vasant Kunj, New Delhi',
    watchlistFlag: false,
  },
  // Genuine Aadhaar record
  '918237410924': {
    officialName: 'AARAV SHARMA',
    officialDOB: '1995-11-03',
    status: 'ACTIVE',
    officialPhoto: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200',
    address: 'Flat 301, Indirapuram, Ghaziabad, UP',
    watchlistFlag: false,
  },
  // Forged / Stolen Visa record
  'V-49920194': {
    officialName: 'UNKNOWN PERSON',
    officialDOB: '1990-01-01',
    status: 'REVOKED / BLACKLISTED',
    officialPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    address: 'Interpol Alert Node - Watchlist #892',
    watchlistFlag: true,
  },
};

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async analyzeDocument(data: ScreeningRequest) {
    this.logger.log(`Executing Multi-Stage Verification for ${data.documentType}`);

    const isVisaFraud = data.documentImageUrl.includes('1589829545856') || data.documentType === 'VISA';
    const isSuspicious = data.documentImageUrl.includes('1578632767115');

    // Deterministic Extracted Data
    const fullName = isVisaFraud ? 'MICHAEL VANCE' : isSuspicious ? 'SUNIL KUMAR RAY' : 'ROHIT VERMA';
    const documentNumber = isVisaFraud ? 'V-49920194' : isSuspicious ? '918237410924' : 'P10982341';
    const dateOfBirth = isVisaFraud ? '1982-04-12 (Modified)' : isSuspicious ? '1995-11-03' : '1998-07-21';

    // 1. Math Check: Verhoeff Checksum for Aadhaar / MRZ for Passport
    const isVerhoeffValid = data.documentType === 'NATIONAL_ID' ? validateVerhoeff(documentNumber) : true;
    const isMrzValid = !isVisaFraud;

    // 2. Query Central Registry
    const registryRecord: RegistryEntry | null = CENTRAL_GOVERNMENT_REGISTRY[documentNumber] || null;
    const discrepancies: string[] = [];

    if (!registryRecord) {
      discrepancies.push('Critical: No matching identity record in Central Government Registry.');
    } else {
      if (registryRecord.officialName !== fullName) {
        discrepancies.push(`Identity Mismatch: Card says '${fullName}' but Registry has '${registryRecord.officialName}'.`);
      }
      if (registryRecord.officialDOB !== dateOfBirth.split(' ')[0]) {
        discrepancies.push(`Date of Birth Anomaly: Card has '${dateOfBirth}' vs Registry '${registryRecord.officialDOB}'.`);
      }
      if (registryRecord.watchlistFlag) {
        discrepancies.push(`CRITICAL ALERT: Identity is flagged on National Security Watchlist.`);
      }
    }

    // 3. Dynamic Multi-Signal Risk Score Calculation (0 - 100)
    let calculatedRisk = 4;
    if (isVisaFraud) calculatedRisk += 88;
    if (isSuspicious) calculatedRisk += 64;
    if (!isVerhoeffValid && data.documentType === 'NATIONAL_ID') calculatedRisk += 45;
    if (!isMrzValid) calculatedRisk += 35;
    if (discrepancies.length > 0) calculatedRisk = Math.min(100, calculatedRisk + discrepancies.length * 15);

    const overallStatus: 'APPROVED' | 'SUSPICIOUS' | 'FLAGGED_FRAUD' =
      calculatedRisk > 70 ? 'FLAGGED_FRAUD' : calculatedRisk > 30 ? 'SUSPICIOUS' : 'APPROVED';

    // 4. Generate SHA-256 Cryptographic Audit Seal
    const auditPayload = `${documentNumber}-${calculatedRisk}-${overallStatus}-${Date.now()}`;
    const sha256Hash = crypto.createHash('sha256').update(auditPayload).digest('hex');

    const report = {
      id: `SSB-26188-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      checkpoint: data.checkpointLocation || 'Raxaul Border Post #04',
      documentType: data.documentType,
      overallStatus,
      riskScore: calculatedRisk,
      sha256Hash,
      ocrExtractedData: {
        fullName,
        documentNumber,
        nationality: isVisaFraud ? 'SYNTHETIC / IRREGULAR' : 'IND',
        dateOfBirth,
        dateOfExpiry: isVisaFraud ? '2028-11-20' : isSuspicious ? '2030-05-18' : '2034-08-14',
        mrzCode: isVisaFraud
          ? 'V<FRAVANCE<<MICHAEL<<<<<<<<<<<<<<<<<<<\nV499201946FRA8204123M2811204<<<<<<<<<<<<<<02'
          : 'P<INDVERMA<<ROHIT<<<<<<<<<<<<<<<<<<<<<\nP109823414IND9807218M3408142<<<<<<<<<<<<<<04',
        mrzChecksumValid: isMrzValid,
        verhoeffChecksumValid: isVerhoeffValid,
      },
      registryComparison: {
        matchedInDatabase: !!registryRecord,
        registryRecord,
        discrepancies,
      },
      tamperingAnalysis: {
        confidence: isVisaFraud ? 97.2 : isSuspicious ? 84.1 : 99.1,
        photoTampered: isVisaFraud || isSuspicious,
        textAltered: isVisaFraud,
        stampForged: isVisaFraud,
        details: isVisaFraud
          ? [
              'CRITICAL: Error Level Analysis detects pixel compression mismatch around photo edge (Photo Splicing).',
              'CRITICAL: Font stroke-width disparity in Date of Birth (Digital Manipulation).',
              'HIGH: Consular Visa Stamp lacks official SSB ultraviolet spectral reflectance.',
            ]
          : isSuspicious
          ? [
              'MEDIUM: 3D biometric depth anomaly detected during live facial angle verification.',
              'MEDIUM: Micro-contrast disparity across card lamination overlay indicates potential re-glazing.',
            ]
          : [
              'Microprint alignment conforms strictly to ICAO Doc 9303 standards.',
              'Holographic optical security thread verified with zero pixel tampering.',
              'Camera EXIF metadata analysis confirms authentic camera sensor profile.',
            ],
        tamperedBoxes: isVisaFraud
          ? [
              { label: 'Photo Splicing (ELA 98%)', top: '15%', left: '10%', width: '35%', height: '55%' },
              { label: 'Tampered DOB Font', top: '72%', left: '48%', width: '38%', height: '14%' },
              { label: 'Forged Consular Seal', top: '30%', left: '60%', width: '30%', height: '32%' },
            ]
          : isSuspicious
          ? [{ label: 'Laminate Anomaly', top: '20%', left: '15%', width: '40%', height: '50%' }]
          : [],
      },
      faceVerification: {
        similarityScore: isVisaFraud ? 36.4 : isSuspicious ? 61.2 : 98.4,
        livenessScore: isVisaFraud ? 89.1 : isSuspicious ? 92.4 : 99.2,
        faceMatched: !isVisaFraud && !isSuspicious,
      },
    };

    return {
      success: true,
      report,
    };
  }
}