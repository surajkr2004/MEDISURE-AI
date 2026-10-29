'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Alert } from '@/components/ui/Alert'

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 100,
              padding: '0.35rem 1rem',
              marginBottom: '1rem',
              color: '#991b1b',
              fontSize: '0.8125rem',
              fontWeight: 600
            }}>
              <span>⚖️</span> Essential Legal & Medical Limitations
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Verification & Medical Disclaimer
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Please read this disclaimer carefully before relying on any verification result, risk score, or supply-chain ledger event displayed by MediSure AI.
            </p>
          </div>

          <Alert variant="danger" title="CRITICAL SAFETY STATEMENT" className="mb-8">
            NEVER CLAIM OR ASSUME A MEDICINE IS AUTHENTIC SOLELY BECAUSE ITS QR CODE SCANS SUCCESSFULLY OR A BLOCKCHAIN-STYLE RECORD EXISTS. QR codes can be photocopied, duplicated across fake packages, or misapplied. MediSure AI verifies database existence and recorded events; it cannot perform chemical mass spectrometry or laboratory quality testing.
          </Alert>

          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            
            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                1. Academic Capstone (PBL) Prototype Notice
              </h2>
              <p>
                MediSure AI is a student Problem-Based Learning (PBL) software architecture research demonstration. It is <strong>not</strong> an official service of the Government of India, the Central Drugs Standard Control Organisation (CDSCO), the Ministry of Health and Family Welfare, or any State Food and Drug Administration (FDA). All manufacturing companies, batch records, products, and supply chain handoffs demonstrated on this site are synthetic or illustrative unless otherwise referenced from public regulatory gazettes.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                2. Database Presence vs. Physical Chemical Authenticity
              </h2>
              <p>
                A result of <strong>&quot;Record Found&quot;</strong> indicates exclusively that:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                <li>A matching Product Code and Batch Number exist within the MediSure registry.</li>
                <li>The recorded expiry date has not elapsed according to system clocks.</li>
                <li>No active Class II/III recall was indexed at the moment of the query.</li>
                <li>The cryptographic hash chain of recorded supply chain handoffs is mathematically consistent.</li>
              </ul>
              <p>
                A record match does <strong>NOT</strong> certify physical chemical purity, absence of adulteration, compliance with Good Manufacturing Practices (GMP) during physical transit, or therapeutic efficacy for your medical condition.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                3. No Medical Advice or Doctor-Patient Relationship
              </h2>
              <p>
                Content provided through MediSure AI is for informational and educational traceability purposes only. It does not constitute medical advice, diagnosis, dosage consultation, or prescription therapy. Always consult a licensed medical doctor or qualified pharmacist regarding medications, side effects, drug interactions, or therapeutic substitutions.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                4. Cryptographic Ledger Limitations
              </h2>
              <p>
                The append-only hash-linked ledger implemented in this prototype demonstrates cryptographic data integrity under specified trust assumptions. It guarantees that recorded log entries cannot be silently reordered or mutated without breaking the SHA-256 hash sequence. However, like any ledger, it cannot prevent fraudulent physical actors from recording falsified data if authorized keys are compromised.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                5. Emergency Protocol
              </h2>
              <p>
                In case of suspected poisoning, severe allergic reaction, or acute physical distress after taking any medication, immediately contact emergency responders (<strong>112</strong> / <strong>108</strong>) or the National Poison Information Centre (AIIMS New Delhi: <strong>1800-116-117</strong>).
              </p>
            </section>

          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link href="/terms" className="btn-ghost">
              Read Terms of Service
            </Link>
            <Link href="/scan" className="btn-accent">
              Proceed to QR Scanner
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
