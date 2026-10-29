import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#1F071D',
      color: '#BAC5CE',
      borderTop: '1px solid rgba(221, 227, 232, 0.12)',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      fontSize: '0.875rem'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Top Disclaimer Banner */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 14,
          padding: '1.25rem 1.5rem',
          marginBottom: '3rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <div style={{ color: '#FCA5A5', fontWeight: 700, marginBottom: '0.25rem' }}>
              Academic Prototype & Patient Safety Notice
            </div>
            <p style={{ color: '#E2E8F0', fontSize: '0.8125rem', lineHeight: 1.6, margin: 0 }}>
              MediSure AI is a student Problem-Based Learning (PBL) research prototype. It is <strong>not</strong> an official government service, does not represent the Central Drugs Standard Control Organisation (CDSCO) or State Drug Regulators, and cannot guarantee chemical purity. In emergencies or suspected poisoning, immediately contact emergency services (India: <strong>112</strong> / National Poison Centre AIIMS: <strong>1800-116-117</strong>).
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--accent), var(--primary-light))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>🛡️</div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.15rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                MediSure <span style={{ color: 'var(--accent)' }}>AI</span>
              </span>
            </div>
            <p style={{ color: '#BAC5CE', fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              AI-assisted medicine record verification and hash-linked pharmaceutical supply chain traceability platform.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(234, 170, 0, 0.12)',
              border: '1px solid rgba(234, 170, 0, 0.35)',
              padding: '0.3rem 0.75rem',
              borderRadius: 100,
              fontSize: '0.75rem',
              color: 'var(--accent)',
              fontWeight: 600
            }}>
              <span>🇮🇳</span> Designed for India First
            </div>
          </div>

          {/* Verification Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>
              Verification & Safety
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/scan" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Scan QR Code</Link></li>
              <li><Link href="/search" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Search Medicine Registry</Link></li>
              <li><Link href="/how-it-works" style={{ color: '#BAC5CE', textDecoration: 'none' }}>How Verification Works</Link></li>
              <li><Link href="/regulatory" style={{ color: '#BAC5CE', textDecoration: 'none' }}>CDSCO & Regulatory Notices</Link></li>
              <li><Link href="/safety" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Medicine Safety Guide</Link></li>
              <li><Link href="/report" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Report Suspected Counterfeit</Link></li>
            </ul>
          </div>

          {/* Role Portals */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>
              Role Portals
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/dashboard" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Consumer Dashboard</Link></li>
              <li><Link href="/company" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Manufacturer Portal</Link></li>
              <li><Link href="/distributor" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Distributor Gateway</Link></li>
              <li><Link href="/wholesaler" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Wholesaler Hub</Link></li>
              <li><Link href="/pharmacy" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Pharmacy Dispensary</Link></li>
              <li><Link href="/admin" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Administrator Control</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>
              Governance & Policies
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/about" style={{ color: '#BAC5CE', textDecoration: 'none' }}>About MediSure AI</Link></li>
              <li><Link href="/disclaimer" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Verification Disclaimer</Link></li>
              <li><Link href="/privacy" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Terms of Service</Link></li>
              <li><Link href="/faq" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Frequently Asked Questions</Link></li>
              <li><Link href="/contact" style={{ color: '#BAC5CE', textDecoration: 'none' }}>Contact & Grievances</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} MediSure AI — Academic PBL Project. Not for commercial use.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#BAC5CE' }}>
            <span>Data Source: CDSCO / State FDAs (Fictionalized Demo Data)</span>
            <span>Security: SHA-256 Ledger</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
