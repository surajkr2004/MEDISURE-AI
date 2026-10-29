'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Alert } from '@/components/ui/Alert'

export default function SafetyPage() {
  const visualChecks = [
    {
      title: 'Packaging & Foil Seal',
      desc: 'Check whether blister foil is cleanly sealed without bubbling or loose margins. Counterfeit drugs often use thin or fragile foil that tears unevenly.',
      icon: '📦'
    },
    {
      title: 'Printing Clarity & Typos',
      desc: 'Inspect typography closely. Genuine pharmaceutical packaging uses sharp, high-resolution printing. Blurry text, misspellings in salt names, or fuzzy manufacturer logos are major red flags.',
      icon: '🔍'
    },
    {
      title: 'Batch & Expiry Stamp',
      desc: 'Look at the manufacturing date, expiry date, and Maximum Retail Price (MRP). On legitimate drugs, these are usually debossed or laser-printed cleanly, not hand-stamped or smudged.',
      icon: '📅'
    },
    {
      title: 'Holograms & Security Seals',
      desc: 'Many high-value medicines in India feature optical variable ink or 3D holograms that shift color when tilted under light. Counterfeits frequently use flat, static silver stickers.',
      icon: '✨'
    },
    {
      title: 'Tablet / Capsule Physical Integrity',
      desc: 'Examine color uniformity, chipping, unusual odor, or discoloration. If tablets in the same strip have differing thicknesses or textures, quarantine the product immediately.',
      icon: '💊'
    },
    {
      title: 'Price Anomaly (Suspicious Discounts)',
      desc: 'Be skeptical of prescription medicines sold at 60–80% below standard MRP from informal online channels or unlicensed street kiosks.',
      icon: '🏷️'
    }
  ]

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1050, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
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
              <span>🛡️</span> Patient Education & Counterfeit Prevention
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Medicine Safety & Inspection Guide
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              A QR code scan is just one piece of verification. Learn how to physically inspect medicine packaging and protect your family from substandard drugs.
            </p>
          </div>

          {/* Emergency Alert */}
          <Alert variant="danger" title="Immediate Action in Health Emergencies" className="mb-8">
            If you suspect you or someone else has consumed a contaminated, expired, or counterfeit drug and is experiencing abnormal symptoms, seek immediate emergency care:
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontWeight: 700 }}>
              <span>🚑 National Emergency Ambulance: 112 / 108</span>
              <span>☎️ National Poison Information Centre (AIIMS New Delhi): 1800-116-117</span>
            </div>
          </Alert>

          {/* 6 Step Visual Check Grid */}
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
            6 Physical Packaging Checks You Must Always Perform
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {visualChecks.map((check, i) => (
              <div key={check.title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(58, 15, 52, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem'
                  }}>
                    {check.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                      CHECK #{i + 1}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', margin: 0 }}>
                      {check.title}
                    </h3>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                  {check.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action Protocol: What to do if suspicious */}
          <div className="card" style={{ padding: '2rem', background: '#1F071D', color: 'white', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>
              What to Do If You Suspect a Counterfeit Medicine
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛑 1. Do Not Consume</div>
                <p style={{ color: '#BAC5CE', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Stop taking the medicine immediately. Keep the original packaging, blister foils, and any dispensed outer cartons intact for evidence.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸 2. Photograph the Pack</div>
                <p style={{ color: '#BAC5CE', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Take clear, high-resolution photos of the front label, printed batch number, expiry date, QR code, and pharmacy receipt.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚩 3. File MediSure Report</div>
                <p style={{ color: '#BAC5CE', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Submit a report through our public reporting module. Your entry is routed for investigation and flags the batch token in our anomaly engine.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏥 4. Consult Doctor</div>
                <p style={{ color: '#BAC5CE', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Visit your prescribing physician to arrange safe alternative therapy and report the retail pharmacy where the drug was purchased.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/report" className="btn-accent">
                🚩 Submit a Counterfeit Report
              </Link>
              <Link href="/scan" className="btn-ghost" style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                🔍 Run QR Verification
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
