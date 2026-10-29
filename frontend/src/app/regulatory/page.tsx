'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import { DEMO_REGULATORY_NOTICES } from '@/lib/demoData'

export default function RegulatoryPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [search, setSearch] = useState('')

  const types = [
    { key: 'all', label: 'All Notices' },
    { key: 'nsq_alert', label: '⚠️ Non-Standard Quality (NSQ)' },
    { key: 'official_recall', label: '🚨 Official Recalls' },
    { key: 'spurious_alert', label: '🛑 Spurious / Counterfeit' },
    { key: 'prohibited_drug', label: '🚫 Prohibited Formulations' },
  ]

  const filteredNotices = DEMO_REGULATORY_NOTICES.filter((n) => {
    const matchesType = selectedType === 'all' || n.notice_type === selectedType
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.affected_brand.toLowerCase().includes(search.toLowerCase()) ||
      n.affected_generic.toLowerCase().includes(search.toLowerCase()) ||
      n.notice_reference.toLowerCase().includes(search.toLowerCase()) ||
      n.source_authority.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
              <span>🏛️</span> Official Regulatory Surveillance Feed
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Regulatory Updates & Drug Recalls
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Aggregated safety alerts from Central Drugs Standard Control Organisation (CDSCO), State Drug Licensing Authorities, US FDA, and WHO.
            </p>
          </div>

          {/* Important Notice Banner */}
          <Alert variant="warning" title="Authoritative Source Disclaimer" className="mb-6">
            Notices displayed here are indexed for educational and traceability demonstration. MediSure AI relies on reviewed publications from regulatory portals. Absence of a notice does not certify that a product is free from pending inquiry. Always consult official gazettes and licensing authorities for legal actions.
          </Alert>

          {/* Filter Bar */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input"
                placeholder="Search notices by keyword, drug name, or reference ID (e.g. CDSCO-NSQ-2026-081)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: 260 }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="btn-ghost" style={{ padding: '0.75rem 1rem' }}>
                  Clear
                </button>
              )}
            </div>

            {/* Type selector */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {types.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedType(t.key)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: 9999,
                    border: '1px solid',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderColor: selectedType === t.key ? 'var(--primary)' : 'var(--border)',
                    background: selectedType === t.key ? 'var(--primary)' : 'white',
                    color: selectedType === t.key ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notices Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredNotices.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <h3 style={{ color: 'var(--primary)' }}>No regulatory notices found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Try adjusting your search query or selecting &quot;All Notices&quot;.
                </p>
                <button onClick={() => { setSearch(''); setSelectedType('all'); }} className="btn-primary">
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredNotices.map((notice) => {
                const isRecall = notice.notice_type === 'official_recall'
                const isNSQ = notice.notice_type === 'nsq_alert'

                return (
                  <div
                    key={notice.id}
                    className="card"
                    style={{
                      padding: '1.75rem',
                      borderLeft: `5px solid ${isRecall ? '#EF4444' : isNSQ ? '#F59E0B' : '#DC2626'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary)' }}>
                            {notice.notice_reference}
                          </span>
                          <Badge variant={isRecall ? 'recalled' : isNSQ ? 'warning' : 'danger'}>
                            {isRecall ? 'Class II Recall' : isNSQ ? 'Non-Standard Quality (NSQ)' : 'Spurious Alert'}
                          </Badge>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Published: {notice.publication_date}
                          </span>
                        </div>
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', margin: 0, lineHeight: 1.3 }}>
                          {notice.title}
                        </h2>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Authority:
                        </span>
                        <strong style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                          {notice.source_authority}
                        </strong>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                      {notice.summary}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.75rem',
                      background: 'var(--bg-base)',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 10,
                      fontSize: '0.8125rem',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Affected Brand: </span>
                        <strong>{notice.affected_brand}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Generic / Salt: </span>
                        <strong>{notice.affected_generic}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Batch Affected: </span>
                        <strong style={{ color: '#EF4444' }}>{notice.affected_batch}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Manufacturer: </span>
                        <strong>{notice.affected_manufacturer}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Badge size="sm" variant="info">Verified Source</Badge>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Region: {notice.country_code}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link
                          href={`/scan`}
                          className="btn-accent btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
                        >
                          Check My Medicine Pack
                        </Link>
                        <a
                          href={notice.official_document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
                        >
                          Official PDF Notice ↗
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
