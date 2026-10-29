'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Alert } from '@/components/ui/Alert'

export default function AboutPage() {
  const pillars = [
    {
      title: 'QR Provenance Verification',
      desc: 'Authenticates unique manufacturer-issued QR tokens against verified regulatory registries, preventing reuse of illegitimate product codes.',
      icon: '📱'
    },
    {
      title: 'Cryptographic Supply Chain Ledger',
      desc: 'Tracks sequential custody handoffs between Manufacturer, Distributor, Wholesaler, and Pharmacy using tamper-evident SHA-256 hash chaining.',
      icon: '⛓️'
    },
    {
      title: 'Regulatory Recall Surveillance',
      desc: 'Indexes real-time Non-Standard Quality (NSQ) and Class II/III recall notices from CDSCO, Maharashtra FDA, and international authorities.',
      icon: '🏛️'
    },
    {
      title: 'Explainable AI Anomaly Detection',
      desc: 'Flags packaging inconsistencies, rapid geographic scan repetition, and discrepancies between printed text and QR-encoded parameters.',
      icon: '🤖'
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
              background: 'rgba(58, 15, 52, 0.08)',
              border: '1px solid rgba(58, 15, 52, 0.2)',
              borderRadius: 100,
              padding: '0.35rem 1rem',
              marginBottom: '1rem',
              color: 'var(--primary)',
              fontSize: '0.8125rem',
              fontWeight: 600
            }}>
              <span>🛡️</span> Project Mission & Architecture
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              About MediSure AI
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              An academic Problem-Based Learning (PBL) research prototype engineered to address the pharmaceutical counterfeit crisis through end-to-end transparency.
            </p>
          </div>

          {/* Academic Prototype Disclaimer */}
          <Alert variant="info" title="Academic PBL Prototype Statement" className="mb-8">
            MediSure AI is an educational technology demonstration developed for an academic software engineering capstone. All pharmaceutical manufacturers, batches, and records provided in the live demonstration are fictionalized. MediSure AI does not provide medical diagnoses, prescribe treatments, or substitute state regulatory certifications.
          </Alert>

          {/* Vision & Problem Statement */}
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.5rem' }}>
              The Problem: Counterfeit & Substandard Medicines
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              According to the World Health Organization (WHO), an estimated 1 in 10 medical products in developing nations are substandard or falsified. In India, counterfeiters exploit fragmented supply chain handoffs between logistics operators, regional stockists, and local dispensaries. When consumers purchase medicines, a standard QR code alone offers little protection if that same code can be duplicated across hundreds of illegitimate packs.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
              <strong>MediSure AI</strong> closes this vulnerability by separating database record validation from physical authenticity checks. By cross-referencing batch numbers, manufacturing expiry, regulatory recalls, scan frequency anomaly rules, and sequential custody events on an immutable ledger, MediSure AI provides multi-layered provenance inspection.
            </p>
          </div>

          {/* Technology Pillars */}
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
            Core Architectural Pillars
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {pillars.map((p) => (
              <div key={p.title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Technology Stack Grid */}
          <div className="card" style={{ padding: '2rem', background: '#1F071D', color: 'white' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--accent)', marginBottom: '1.25rem' }}>
              Technology Stack & Free-Tier Cloud Deployment
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', fontSize: '0.875rem' }}>
              <div>
                <strong style={{ color: 'white' }}>Frontend</strong>
                <p style={{ color: '#BAC5CE', marginTop: '0.25rem' }}>
                  Next.js 16 (App Router), React 19, TypeScript, Vanilla & Tailwind CSS, Recharts analytics, HTML5-QRCode scanner.
                </p>
              </div>
              <div>
                <strong style={{ color: 'white' }}>Backend & Edge</strong>
                <p style={{ color: '#BAC5CE', marginTop: '0.25rem' }}>
                  Next.js Serverless Route Handlers deployed on Vercel with zero cold-starts + optional FastAPI Python microservice.
                </p>
              </div>
              <div>
                <strong style={{ color: 'white' }}>Database & Security</strong>
                <p style={{ color: '#BAC5CE', marginTop: '0.25rem' }}>
                  Supabase PostgreSQL with Row Level Security (RLS), UUID keys, and SHA-256 cryptographic audit event triggers.
                </p>
              </div>
              <div>
                <strong style={{ color: 'white' }}>Target Market</strong>
                <p style={{ color: '#BAC5CE', marginTop: '0.25rem' }}>
                  India first (CDSCO, Maharashtra FDA, State Drug Authorities), extensible to FDA, EMA, and WHO frameworks.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/how-it-works" className="btn-accent">
                Explore 10-Layer Pipeline &rarr;
              </Link>
              <Link href="/disclaimer" className="btn-ghost" style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                Read Verification Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
