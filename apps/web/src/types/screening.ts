// apps/web/src/types/screening.ts
export interface TamperedBox {
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
}

export interface RegistryRecord {
  officialName: string;
  officialDOB: string;
  status: string;
  officialPhoto: string;
  address: string;
  watchlistFlag: boolean;
}

export interface ScanReport {
  id: string;
  timestamp: string;
  checkpoint: string;
  documentType: string;
  overallStatus: 'APPROVED' | 'SUSPICIOUS' | 'FLAGGED_FRAUD';
  riskScore: number;
  sha256Hash: string;
  ocrExtractedData: {
    fullName: string;
    documentNumber: string;
    nationality: string;
    dateOfBirth: string;
    dateOfExpiry: string;
    mrzCode: string;
    mrzChecksumValid: boolean;
    verhoeffChecksumValid?: boolean;
  };
  registryComparison?: {
    matchedInDatabase: boolean;
    registryRecord: RegistryRecord | null;
    discrepancies: string[];
  };
  databaseCheck?: {
    registryMatch: boolean;
    blacklistStatus: string;
  };
  tamperingAnalysis: {
    confidence: number;
    photoTampered: boolean;
    textAltered: boolean;
    stampForged: boolean;
    details: string[];
    tamperedBoxes: TamperedBox[];
  };
  faceVerification: {
    similarityScore: number;
    livenessScore: number;
    faceMatched: boolean;
  };
}

export interface AuditLogItem {
  id: string;
  type: string;
  name: string;
  docNum: string;
  riskScore: number;
  status: string;
  time: string;
  checkpoint: string;
  hash: string;
}