'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const LAYERS = [
  { step: 1, icon: '📱', title: 'QR Code Scan', desc: 'User scans the QR code on the medicine package. The scanner extracts the encoded data — product ID, batch number, verification token.' },
  { step: 2, icon: '✅', title: 'QR Format Validation', desc: 'System validates whether the QR data structure is correct and contains the required fields. Invalid or malformed codes are flagged immediately.' },
  { step: 3, icon: '🗄️', title: 'Database Lookup', desc: 'Product ID is searched in the trusted medicine registry. System retrieves manufacturer, medicine name, dosage, and registered batch records.' },
  { step: 4, icon: '📅', title: 'Expiry Date Check', desc: 'Batch expiry date is checked automatically against today\'s date. Near-expiry and expired medicines are flagged with appropriate warnings.' },
  { step: 5, icon: '📦', title: 'Batch Validation', desc: 'Batch number is verified against registered batch records. Recalled or discontinued batches trigger a high-risk alert.' },
  { step: 6, icon: '🏭', title: 'Manufacturer Verification', desc: 'Manufacturer information is cross-referenced against the verified manufacturer registry to confirm the product\'s listed manufacturer is legitimate.' },
  { step: 7, icon: '🔄', title: 'Duplicate Detection', desc: 'Verification token scan count is monitored. Unusually high scan counts may indicate QR code duplication across multiple packages.' },
  { step: 8, icon: '🤖', title: 'AI Packaging Analysis', desc: 'If an image is provided, AI analyzes packaging for visual anomalies: logo inconsistencies, text misalignment, unusual fonts, tamper indicators.' },
  { step: 9, icon: '⚖️', title: 'Risk Engine', desc: 'All layer signals are combined into a weighted risk score (0–100%). Score determines: Verified (≤20%), Suspicious (≤55%), or Unverified (>55%).' },
  { step: 10, icon: '📊', title: 'Result & Recommendation', desc: 'User receives a clear result with risk level, layer-by-layer breakdown, AI analysis, and a professional recommendation.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 80 }}>

        {/* Hero */}
        <div className="gradient-hero" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
            How MediSure AI Works
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            A 10-layer verification pipeline that goes far beyond simple QR scanning
          </p>
        </div>

        {/* Main pipeline */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 28, top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(to bottom, var(--accent), var(--primary))',
              zIndex: 0,
            }} />

            {LAYERS.map((layer) => (
              <div key={layer.step} className="animate-fade-in" style={{
                display: 'flex', gap: '1.5rem', marginBottom: '2rem', position: 'relative', zIndex: 1,
              }}>
                {/* Step circle */}
                <div style={{
                  width: 58, height: 58, borderRadius: '50%', flexShrink: 0,
                  background: 'white', border: '3px solid var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', boxShadow: 'var(--shadow-md)',
                }}>
                  {layer.icon}
                </div>

                {/* Content */}
                <div className="card" style={{ flex: 1, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-dark)',
                      background: 'rgba(234, 170, 0, 0.12)', padding: '0.2rem 0.6rem',
                      borderRadius: 100, border: '1px solid rgba(234, 170, 0, 0.35)',
                    }}>
                      LAYER {layer.step}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', margin: 0 }}>{layer.title}</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Result types */}
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>
              Three Result Categories
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[
                {
                  icon: '✓', label: 'VERIFIED', color: '#10B981', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  desc: 'All verification layers passed. Product matches trusted database records. Risk score ≤ 20%.'
                },
                {
                  icon: '⚠️', label: 'SUSPICIOUS', color: '#F59E0B', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  desc: 'Some layers flagged. May have batch discrepancies, AI anomalies, or unusual token activity. Risk score 21–55%.'
                },
                {
                  icon: '🚨', label: 'UNVERIFIED', color: '#EF4444', bg: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  desc: 'Critical layers failed. Product not in database, recalled, expired, or significant packaging issues. Risk score > 55%.'
                },
              ].map(r => (
                <div key={r.label} style={{
                  background: r.bg, borderRadius: 16, padding: '1.5rem', textAlign: 'center',
                  border: `2px solid ${r.color}40`,
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{r.icon}</div>
                  <div style={{ color: r.color, fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}>{r.label}</div>
                  <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.6 }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            marginTop: '3rem', padding: '1.5rem',
            background: 'rgba(58, 15, 52, 0.06)', borderRadius: 16,
            border: '1px solid rgba(58, 15, 52, 0.15)', textAlign: 'center',
          }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>⚠️ Important Disclaimer</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
              MediSure AI is a <strong>prototype educational verification-assistance system</strong>. Its results are not a substitute for professional medical advice, pharmaceutical authentication, regulatory verification, or laboratory testing. The AI module is a simulation and not a trained production model. Do not change or stop prescribed medication based solely on this application&apos;s result.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/scan" className="btn-accent" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              🔍 Try It Now
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
