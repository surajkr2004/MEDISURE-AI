'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(234, 170, 0, 0.12)',
              border: '1px solid rgba(234, 170, 0, 0.35)',
              borderRadius: 100,
              padding: '0.35rem 1rem',
              marginBottom: '1rem',
              color: 'var(--accent-dark)',
              fontSize: '0.8125rem',
              fontWeight: 600
            }}>
              <span>🔒</span> Data Protection & Privacy
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              How MediSure AI collects, stores, protects, and respects your health and verification data.
            </p>
          </div>

          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            
            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                1. Principle of Data Minimization
              </h2>
              <p>
                MediSure AI adheres strictly to data minimization principles. Public visitors can verify medicine QR codes without creating an account or providing personally identifiable information (PII). When an anonymous scan is executed, only the QR payload and a timestamp are logged for aggregate anomaly detection.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                2. Geolocation Policy
              </h2>
              <p>
                MediSure AI does <strong>NOT</strong> collect or store high-precision GPS coordinates by default. For regional anomaly detection (such as identifying duplicate QR tokens scanned simultaneously in distant states), coarse regional IP routing data may be processed ephemerally. Precision location requires explicit, opt-in browser consent.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                3. User Scan History & Row Level Security
              </h2>
              <p>
                Authenticated consumer scan histories and submitted counterfeit reports are shielded by Supabase Row Level Security (RLS) policies. Neither pharmaceutical companies nor unauthorized third parties can view an individual patient&apos;s medication scan history.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                4. Anonymous Reporting & Packaging Images
              </h2>
              <p>
                When submitting reports on counterfeit packaging, users may choose anonymous filing. Uploaded packaging images are stored in protected storage buckets and inspected solely for packaging defect indicators.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                5. Data Retention & Right to Erasure
              </h2>
              <p>
                As an academic prototype, users may request immediate deletion of their registered accounts and scan history by emailing <code>privacy@medisure.ai</code> or clicking Delete Data in account preferences.
              </p>
            </section>

          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/terms" className="btn-ghost">
              Read Terms of Service &rarr;
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
