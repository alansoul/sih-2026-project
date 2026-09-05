# SSB Sentinel-ID: AI-Based Fake Identity & Document Screening System

> **Smart India Hackathon (SIH)**  
> **Problem Statement ID:** 26188  
> **Organization:** Ministry of Home Affairs (MHA)  
> **Department:** Sashastra Seema Bal (SSB), Police II Division  
> **Theme:** Blockchain & Cybersecurity  

---

## 📌 Problem Overview
Border checkpoints along remote frontiers process thousands of travel documents daily. Manual inspection is slow and vulnerable to physical forgery, digital text modification, photo replacement, tampered visa stamps, and identity impersonation.

**SSB Sentinel-ID** is an AI-assisted decision-support platform that cuts verification time from several minutes to under **2.4 seconds** by executing a 4-stage hybrid screening pipeline before logging tamper-evident audit records.

---

## 🏛️ System Architecture

```text
                 TRAVEL CREDENTIAL + LIVE TRAVELER
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
          DOCUMENT INGEST                 LIVE CAMERA
                 │                             │
                 ▼                             ▼
        Module 1: OCR & MRZ           Module 4: Face Biometrics
      (ICAO Doc 9303 Checksum)        (1:1 Cosine Match + Liveness)
                 │                             │
                 ▼                             │
       Module 2: Rule Engine                   │
    (Chronology & Format Check)                │
                 │                             │
                 ▼                             │
     Module 3: Tampering Forensics             │
    (ELA / Compression / Stamps)               │
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                       AI RISK ENGINE (0–100)
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
        LOW RISK (<30)                FLAGGED FRAUD (>70)
         [CLEAR ENTRY]                 [MANUAL REVIEW]
                                │
                                ▼
                   SSB IMMUTABLE AUDIT TRAIL
             (SHA-256 Hashes for Chain-of-Custody)