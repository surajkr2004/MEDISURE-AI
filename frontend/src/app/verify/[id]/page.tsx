'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { QRCodeModal } from '@/components/ui/QRCodeModal'
import { VerificationEngineResponse, verifyMedicineQR } from '@/lib/verificationEngine'

const STATUS_THEMES: Record<string, { label: string; badgeVariant: any; border: string; bg: string; icon: string }> = {
  record_found: { label: 'Record Found & Checks Passed', badgeVariant: 'record_found', border: '#10B981', bg: 'rgba(16, 185, 129, 0.04)', icon: '✓' },
  expired: { label: 'Recorded Batch Expired', badgeVariant: 'expired', border: '#EF4444', bg: 'rgba(239, 68, 68, 0.04)', icon: '⏰' },
  recalled: { label: 'Active Regulatory Recall Notice', badgeVariant: 'recalled', border: '#DC2626', bg: 'rgba(220, 38, 38, 0.06)', icon: '🚨' },
  suspicious: { label: 'Suspicious Scan Anomaly Triggered', badgeVariant: 'suspicious', border: '#EAAA00', bg: 'rgba(234, 170, 0, 0.05)', icon: '⚠️' },
  revoked: { label: 'QR Identifier Revoked', badgeVariant: 'revoked', border: '#991B1B', bg: 'rgba(153, 27, 27, 0.06)', icon: '🚫' },
  not_found: { label: 'Medicine Record Not Found', badgeVariant: 'not_found', border: '#BAC5CE', bg: 'rgba(221, 227, 232, 0.15)', icon: '✕' },
  unable_to_verify: { label: 'Service Temporarily Unavailable', badgeVariant: 'warning', border: '#EAAA00', bg: 'rgba(234, 170, 0, 0.05)', icon: '⚠️' },
  verification_incomplete: { label: 'Verification Incomplete', badgeVariant: 'warning', border: '#EAAA00', bg: 'rgba(234, 170, 0, 0.05)', icon: '⚠️' },
}

export default function VerifyResultPage() {
  const { id } = useParams()
  const [data, setData] = useState<VerificationEngineResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    if (!id) return
    const idStr = String(id)
    let isMounted = true

    Promise.resolve().then(() => {
      if (!isMounted) return
      let resolvedData: VerificationEngineResponse | null = null

      // First try hydrating from sessionStorage
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem(`verify_${idStr}`)
        if (stored) {
          try {
            resolvedData = JSON.parse(stored)
          } catch {}
        }
      }

      // Otherwise re-run verification using ID or fallback sample
      if (!resolvedData) {
        resolvedData = verifyMedicineQR(idStr.startsWith('VER-') ? 'MC500001' : idStr)
      }

      setData(resolvedData)
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading || !data) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Retrieving cryptographic verification logs...</p>
          </div>
        </div>
      </>
    )
  }

  const theme = STATUS_THEMES[data.result_code] || STATUS_THEMES.record_found

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Top Banner Status */}
          <div
            className="card"
            style={{
              padding: '2rem',
              marginBottom: '2rem',
              borderLeft: `6px solid ${theme.border}`,
              background: theme.bg
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant={theme.badgeVariant} size="lg">
                    {theme.label}
                  </Badge>
                  <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    Ref: {data.verification_id}
                  </span>
                </div>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', color: 'var(--primary-dark)', margin: 0 }}>
                  {data.medicine ? data.medicine.brand_name : 'Unregistered Product'}
                </h1>
                {data.medicine && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                    {data.medicine.generic_name} &bull; {data.medicine.strength} ({data.medicine.dosage_form})
                  </p>
                )}
              </div>

              {/* Risk Score Widget */}
              <div style={{
                textAlign: 'right',
                background: 'white',
                padding: '0.85rem 1.25rem',
                borderRadius: 14,
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Calculated Risk Index
                </div>
                <div style={{
                  fontSize: '1.85rem',
                  fontWeight: 900,
                  fontFamily: 'Space Grotesk, sans-serif',
                  color: data.risk_score <= 20 ? '#10B981' : data.risk_score <= 50 ? '#F59E0B' : '#EF4444'
                }}>
                  {data.risk_score}%
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Level: <strong style={{ textTransform: 'uppercase' }}>{data.risk_level}</strong>
                </div>
              </div>
            </div>

            {/* Warnings Alert Box */}
            {data.warnings.length > 0 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 12,
                padding: '1rem 1.25rem',
                marginBottom: '1rem'
              }}>
                <div style={{ color: '#991b1b', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⚠️</span> Identified Risk Indicators ({data.warnings.length})
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#7f1d1d', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  {data.warnings.map((w, idx) => (
                    <li key={idx}><strong>{w}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Action */}
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              border: '1px solid var(--border)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)'
            }}>
              <strong>Recommended Patient Action:</strong> {data.recommended_action}
            </div>
          </div>

          {/* Product & Batch Specifications Grid */}
          {data.medicine && (
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>💊</span> Recorded Pharmaceutical Specifications
                </h3>
                {data.batch && (
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="btn-accent btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                  >
                    <span>📱</span> View Verifiable QR Code
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Brand & Product Code</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.medicine.brand_name} ({data.medicine.product_code})</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Salt Composition</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.medicine.composition}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Batch Number</div>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                    {data.batch?.batch_number || 'N/A'}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Expiry Date</div>
                  <div style={{ fontWeight: 700, color: data.result_code === 'expired' ? '#EF4444' : '#10B981' }}>
                    {data.batch?.expiry_date || 'N/A'} {data.result_code === 'expired' && '(EXPIRED)'}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Manufacturing Entity</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.medicine.organization_name}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Licence Reference</div>
                  <div style={{ fontWeight: 600, color: 'var(--accent-dark)' }}>
                    {data.manufacturer?.licence_number || data.medicine.regulatory_approval_ref}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 11-Step Verification Protocol Breakdown */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔍</span> Multi-Layer Check Breakdown ({data.checks.length} Checks Executed)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Audited: {new Date(data.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.checks.map((chk) => (
                <div
                  key={chk.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 12,
                    background: chk.status === 'pass' ? 'rgba(16, 185, 129, 0.04)' : chk.status === 'fail' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                    border: `1px solid ${chk.status === 'pass' ? 'rgba(16, 185, 129, 0.25)' : chk.status === 'fail' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    color: 'white',
                    background: chk.status === 'pass' ? '#10B981' : chk.status === 'fail' ? '#EF4444' : '#F59E0B',
                    flexShrink: 0
                  }}>
                    {chk.status === 'pass' ? '✓' : chk.status === 'fail' ? '✕' : '!'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{chk.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Source: {chk.source}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.6, margin: 0 }}>
                      {chk.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Supply Chain Ledger Timeline */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⛓️</span> SHA-256 Supply Chain Custody Trail
              </h3>
              <Badge variant={data.is_ledger_intact ? 'verified' : 'recalled'}>
                {data.is_ledger_intact ? 'Cryptographic Chain Intact' : 'Ledger Integrity Mismatch'}
              </Badge>
            </div>

            {data.supply_chain_events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No custody handoff events recorded for this batch identifier.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.supply_chain_events.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 12,
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border)',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        Handoff #{ev.event_sequence}: {ev.event_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {new Date(ev.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      <strong>{ev.organization_name}</strong> {ev.target_org_name ? `→ ${ev.target_org_name}` : ''} ({ev.location_text})
                    </div>

                    <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Hash: {ev.current_hash}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/scan" className="btn-primary">
                📷 Scan Another Medicine
              </Link>
              <Link href="/report" className="btn-ghost">
                🚩 Report Packaging Issue
              </Link>
            </div>

            <Link href="/disclaimer" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>
              Read Limitations & Verification Disclaimer
            </Link>
          </div>

        </div>
      </div>
      <Footer />

      {showQRModal && data?.batch && (
        <QRCodeModal
          batch={data.batch}
          medicine={data.medicine}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </>
  )
}
