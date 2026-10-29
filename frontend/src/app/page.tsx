'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { DEMO_REGULATORY_NOTICES } from '@/lib/demoData'
import toast from 'react-hot-toast'

export default function HomePage() {
  const router = useRouter()
  const [quickInput, setQuickInput] = useState('')

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickInput.trim()) {
      toast.error('Please enter a Product Code, Batch Number, or QR token.')
      return
    }
    router.push(`/scan?code=${encodeURIComponent(quickInput.trim())}`)
  }

  const demoScenarios = [
    { label: '✅ Dolo 650 (Micro Labs)', code: 'DOLO650', desc: 'Valid batch & manufacturer' },
    { label: '✅ Augmentin 625 (GSK)', code: 'AUG625DUO', desc: 'Sealed cold-chain & CoA' },
    { label: '⏰ Pan-D Expired', code: 'PAND001', desc: 'Past validity shelf-life' },
    { label: '🚨 Telma 40 Recalled', code: 'TELMA40', desc: 'CDSCO Class II stability recall' },
    { label: '🔄 Shelcal 500 Replay', code: 'SHELCAL500', desc: 'Excessive scan frequency alert' },
  ]

  const stakeholderBenefits = [
    {
      role: 'Consumers & Patients',
      icon: '👤',
      title: 'Verify Before You Consume',
      desc: 'Instantly check registered batch validity, CDSCO recall alerts, and reported counterfeit packaging from your phone camera without needing an account.'
    },
    {
      role: 'Pharmaceutical Manufacturers',
      icon: '🏭',
      title: 'Protect Your Brand & Licences',
      desc: 'Issue unpredictable batch QR identifiers, monitor unauthorized code replication in real-time, and maintain verifiable custody dispatch records.'
    },
    {
      role: 'Distributors & Wholesalers',
      icon: '🚚',
      title: 'Seamless Inbound Reconciliation',
      desc: 'Scan bulk carton QR codes upon receipt, verify manufacturer custody transfer, and detect missing or diverted shipments automatically.'
    },
    {
      role: 'Chemists & Dispensaries',
      icon: '💊',
      title: 'Patient Trust & Quality Shield',
      desc: 'Confirm stock provenance before dispensing. Receive immediate pop-up alerts if a received batch has been quarantined or recalled by regulators.'
    }
  ]

  const custodySteps = [
    { step: '01', title: 'Factory Batch Registration', actor: 'Micro Labs Limited', loc: 'Kumbalgodu Plant', hash: 'e3b0c442...' },
    { step: '02', title: 'Dispatch & Cold-Chain Transit', actor: 'Apex Cold-Chain Pvt. Ltd.', loc: 'Bhiwandi Hub', hash: 'a1f8c792...' },
    { step: '03', title: 'Wholesale Depot Inbound', actor: 'MediTrade Wholesale Hub', loc: 'Princess St. Mumbai', hash: 'b2e9d803...' },
    { step: '04', title: 'Retail Chemist Verification', actor: 'ApolloCare Chemist', loc: 'Thane Dispensary', hash: 'd40bf025...' },
  ]

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
        
        {/* ── HERO SECTION ─────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #1A0518 0%, #3A0F34 50%, #4D1645 100%)',
          color: 'white',
          paddingTop: 120,
          paddingBottom: 90,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Background Glow */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(234, 170, 0, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
              
              {/* Left Column: Vision & Actions */}
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'rgba(234, 170, 0, 0.12)',
                  border: '1px solid rgba(234, 170, 0, 0.35)',
                  borderRadius: 100,
                  padding: '0.4rem 1.15rem',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
                  <span style={{ color: 'var(--accent)', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Student PBL Research Prototype &bull; India First
                  </span>
                </div>

                <h1 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.85rem)',
                  fontWeight: 900,
                  lineHeight: 1.08,
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.03em',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  MediSure <span style={{ color: 'var(--accent)' }}>AI</span>
                </h1>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  marginBottom: '1.5rem'
                }}>
                  Scan. Verify. Stay Safe.
                </p>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                  maxWidth: 540
                }}>
                  AI-powered pharmaceutical verification combining <strong style={{ color: 'var(--accent)' }}>QR provenance checks</strong>, CDSCO recall surveillance, and a tamper-evident SHA-256 supply-chain audit ledger.
                </p>

                {/* Primary & Secondary Call to Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  <Link href="/scan" className="btn-accent" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                    📷 Scan Medicine QR
                  </Link>
                  <Link href="/company" className="btn-ghost" style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', fontSize: '1rem', padding: '0.85rem 1.75rem' }}>
                    🏭 Company Portal
                  </Link>
                </div>

                {/* Instant Quick Verify Input */}
                <form onSubmit={handleQuickVerify} style={{ display: 'flex', gap: '0.5rem', maxWidth: 480, marginBottom: '2rem' }}>
                  <input
                    type="text"
                    placeholder="Enter Product Code (e.g., MC500001)..."
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: 10,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}>
                    Verify
                  </button>
                </form>

                {/* PBL Demo Scenario Quick Buttons */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Or test preset PBL demonstration outcomes:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {demoScenarios.map((demo) => (
                      <Link
                        key={demo.code}
                        href={`/scan?code=${demo.code}`}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 8,
                          padding: '0.35rem 0.65rem',
                          color: 'rgba(255, 255, 255, 0.85)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {demo.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Verification Preview Card */}
              <div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 24,
                  padding: '2rem',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                  position: 'relative'
                }}>
                  {/* Badge Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <Badge variant="verified">✓ Record Verified on Platform</Badge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace' }}>
                      SHA-256 LEDGER OK
                    </span>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Medicine Product
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginTop: '0.2rem' }}>
                      Augmentin 625 Duo (Amox-Clav IP)
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Manufacturer: <strong>GlaxoSmithKline Pharmaceuticals Ltd.</strong> (Licence MH-NSK-25/891)
                    </div>
                  </div>

                  {/* Batch Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '1rem',
                    borderRadius: 12,
                    marginBottom: '1.25rem',
                    fontSize: '0.8125rem'
                  }}>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.45)' }}>Batch Number</div>
                      <div style={{ color: 'white', fontWeight: 700, fontFamily: 'monospace' }}>AUG625-CL2409</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.45)' }}>Expiry Date</div>
                      <div style={{ color: '#10B981', fontWeight: 700 }}>31 Mar 2027 (Active)</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.45)' }}>CDSCO Recall Status</div>
                      <div style={{ color: '#10B981', fontWeight: 700 }}>No Active Recall</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.45)' }}>Scan Anomaly Level</div>
                      <div style={{ color: 'var(--accent)', fontWeight: 700 }}>Low Risk (2 scans)</div>
                    </div>
                  </div>

                  {/* 4 Mini Checks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)' }}>
                      <span style={{ color: '#10B981' }}>✓</span> QR Format & Token Decryption Passed
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)' }}>
                      <span style={{ color: '#10B981' }}>✓</span> Manufacturer State Licence Form 25 Active
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)' }}>
                      <span style={{ color: '#10B981' }}>✓</span> 3 Custody Handoffs Verified on Ledger
                    </div>
                  </div>

                  <Link href="/scan?code=AUG625DUO" className="btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                    Inspect Full Verification Audit &rarr;
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── STAKEHOLDER BENEFITS ─────────────────────────────────────── */}
        <section style={{ padding: '5rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ color: 'var(--accent-dark)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Multi-Stakeholder Architecture
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--primary-dark)', marginTop: '0.5rem' }}>
              Built for the Entire Pharmaceutical Lifecycle
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0.5rem auto 0', fontSize: '1rem' }}>
              Different dashboards, role permissions, and cryptographically signed workflows for every participant.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {stakeholderBenefits.map((b) => (
              <div key={b.role} className="card" style={{ padding: '2rem' }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'rgba(58, 15, 52, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  marginBottom: '1.25rem'
                }}>
                  {b.icon}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-dark)', textTransform: 'uppercase' }}>
                  {b.role}
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: '0.35rem 0 0.75rem' }}>
                  {b.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SUPPLY CHAIN LEDGER ILLUSTRATION ──────────────────────────── */}
        <section style={{ background: '#1F071D', color: 'white', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Append-Only Audit Trail
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginTop: '0.5rem' }}>
                Factory-to-Pharmacy Cryptographic Ledger
              </h2>
              <p style={{ color: '#BAC5CE', maxWidth: 600, margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
                Each batch handoff is sealed with a SHA-256 hash containing previous event hashes, preventing deletion or reordering.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', position: 'relative' }}>
              {custodySteps.map((step) => (
                <div
                  key={step.step}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 16,
                    padding: '1.5rem'
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8125rem',
                    marginBottom: '1rem'
                  }}>
                    {step.step}
                  </div>
                  <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '0.35rem' }}>{step.title}</h4>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 600 }}>{step.actor}</div>
                  <div style={{ fontSize: '0.75rem', color: '#BAC5CE', marginTop: '0.2rem' }}>📍 {step.loc}</div>
                  
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    color: '#BAC5CE'
                  }}>
                    Hash: {step.hash}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/how-it-works" className="btn-accent">
                View 10-Layer Verification Architecture &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ── REGULATORY RECALL TICKER ─────────────────────────────────── */}
        <section style={{ padding: '4.5rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                Real-Time Surveillance
              </div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginTop: '0.25rem' }}>
                Recent CDSCO & State Quality Alerts
              </h2>
            </div>
            <Link href="/regulatory" className="btn-ghost btn-sm">
              View All Regulatory Notices &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {DEMO_REGULATORY_NOTICES.slice(0, 3).map((n) => (
              <div key={n.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Badge variant={n.notice_type === 'official_recall' ? 'recalled' : 'warning'}>
                    {n.notice_type === 'official_recall' ? 'Official Recall' : 'NSQ Quality Alert'}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.publication_date}</span>
                </div>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                  {n.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.6, margin: 0 }}>
                  Affected: <strong>{n.affected_brand}</strong> (Batch: {n.affected_batch})
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RESPONSIBLE USE & SAFETY REMINDER ─────────────────────────── */}
        <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
          <div className="card" style={{
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(58, 15, 52, 0.04), rgba(234, 170, 0, 0.06))',
            border: '1px solid rgba(58, 15, 52, 0.15)'
          }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.35rem' }}>
              Responsible Verification & Patient Protocol
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              MediSure AI helps verify available product records, batch authorization status, and recorded supply chain handoffs. <strong>Never assume a medicine is authentic solely because its QR code works.</strong> Always inspect physical packaging, blister seals, and consult licensed healthcare providers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/safety" className="btn-primary">
                Read Physical Packaging Inspection Guide
              </Link>
              <Link href="/disclaimer" className="btn-ghost">
                Read Legal Disclaimer
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
