'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Alert } from '@/components/ui/Alert'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { DEMO_REGULATORY_NOTICES, RegulatoryNotice } from '@/lib/demoData'
import toast from 'react-hot-toast'

export default function ReviewerPortalPage() {
  const [notices, setNotices] = useState<RegulatoryNotice[]>(DEMO_REGULATORY_NOTICES)
  const [newNoticeForm, setNewNoticeForm] = useState({
    notice_reference: '',
    title: '',
    notice_type: 'nsq_alert' as const,
    affected_brand: '',
    affected_batch: '',
    source_authority: 'Central Drugs Standard Control Organisation (CDSCO)',
    summary: '',
    official_document_url: 'https://cdsco.gov.in'
  })

  const handlePublishNotice = (id: string) => {
    setNotices(
      notices.map((n) => (n.id === id ? { ...n, is_published: true } : n))
    )
    toast.success('Notice reviewed and published to live public feed!')
  }

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoticeForm.title || !newNoticeForm.notice_reference) {
      toast.error('Title and Reference are required.')
      return
    }

    const created: RegulatoryNotice = {
      id: `not-${Date.now()}`,
      notice_reference: newNoticeForm.notice_reference,
      title: newNoticeForm.title,
      notice_type: newNoticeForm.notice_type,
      publication_date: new Date().toISOString().split('T')[0],
      affected_brand: newNoticeForm.affected_brand || 'Pending Analysis',
      affected_generic: 'Pending Review',
      affected_batch: newNoticeForm.affected_batch || 'Multiple',
      affected_manufacturer: 'Under Audit Investigation',
      summary: newNoticeForm.summary,
      official_document_url: newNoticeForm.official_document_url,
      is_published: false,
      source_authority: newNoticeForm.source_authority,
      country_code: 'IN'
    }

    setNotices([created, ...notices])
    toast.success('Official notice imported to staging queue for authorized review.')
    setNewNoticeForm({
      notice_reference: '',
      title: '',
      notice_type: 'nsq_alert',
      affected_brand: '',
      affected_batch: '',
      source_authority: 'Central Drugs Standard Control Organisation (CDSCO)',
      summary: '',
      official_document_url: 'https://cdsco.gov.in'
    })
  }

  return (
    <AuthGuard
      allowedRoles={['reviewer', 'admin']}
      portalName="Regulatory Reviewer Workspace"
      requiredRoleLabel="CDSCO / State Drug Inspector"
      defaultDemoEmail="reviewer@cdsco-audit.demo"
      defaultDemoRole="reviewer"
    >
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🏛️</span>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: 'var(--primary-dark)', margin: 0 }}>
                  Regulatory Notice Review & Ingestion Queue
                </h1>
                <Badge variant="info">Reviewer Workspace</Badge>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
                Reviewer: <strong>Kavita Joshi</strong> (CDSCO Quality Audit Surveillance Cell)
              </p>
            </div>
          </div>

          <Alert variant="warning" title="Publication Governance Protocol" className="mb-6">
            Imported drug notices require explicit human authorized review before publication. Documents in staging do NOT automatically alter medicine statuses until published by a verified reviewer.
          </Alert>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label="Total Indexed Notices" value={notices.length} icon="📋" color="var(--primary)" />
            <StatCard label="Published Notices" value={notices.filter((n) => n.is_published).length} icon="✓" color="#10B981" />
            <StatCard label="Awaiting Review" value={notices.filter((n) => !n.is_published).length} icon="⏳" color="#F59E0B" />
            <StatCard label="CDSCO Source Feeds" value="5 Active" icon="🌐" color="var(--accent-dark)" />
          </div>

          {/* Import New Notice Form */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
              Import Official Notice / NSQ Alert into Staging
            </h3>

            <form onSubmit={handleCreateNotice} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Official Notice Ref *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CDSCO-NSQ-2026-099"
                  className="input"
                  value={newNoticeForm.notice_reference}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, notice_reference: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Notice Category *
                </label>
                <select
                  className="input"
                  value={newNoticeForm.notice_type}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, notice_type: e.target.value as any })}
                >
                  <option value="nsq_alert">Non-Standard Quality (NSQ)</option>
                  <option value="official_recall">Official Drug Recall</option>
                  <option value="spurious_alert">Spurious / Counterfeit Alert</option>
                  <option value="prohibited_drug">Prohibited Formulation</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Affected Drug / Brand
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin 250mg"
                  className="input"
                  value={newNoticeForm.affected_brand}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, affected_brand: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Affected Batch Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BATCH-901"
                  className="input"
                  value={newNoticeForm.affected_batch}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, affected_batch: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quality Alert: Dissolution test failure in Amoxicillin Capsules"
                  className="input"
                  value={newNoticeForm.title}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Summary Findings *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter analyst laboratory findings and mandated containment actions..."
                  className="input"
                  value={newNoticeForm.summary}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, summary: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ height: 44, padding: '0 1.5rem' }}>
                + Submit to Staging Queue
              </button>
            </form>
          </div>

          {/* Staging & Published Notices Table */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1.2rem' }}>
              Surveillance Ingestion Queue
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Ref ID</th>
                    <th style={{ padding: '0.75rem' }}>Title & Drug</th>
                    <th style={{ padding: '0.75rem' }}>Type</th>
                    <th style={{ padding: '0.75rem' }}>Source Authority</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((n) => (
                    <tr key={n.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>{n.notice_reference}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div><strong>{n.title}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Affected: {n.affected_brand} (Batch: {n.affected_batch})</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <Badge variant={n.notice_type === 'official_recall' ? 'recalled' : 'warning'}>
                          {n.notice_type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.8125rem' }}>{n.source_authority}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <Badge variant={n.is_published ? 'verified' : 'pending'}>
                          {n.is_published ? 'Published' : 'In Staging'}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {!n.is_published ? (
                          <button
                            onClick={() => handlePublishNotice(n.id)}
                            className="btn-accent"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            Approve & Publish
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>Live Feed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </AuthGuard>
  )
}
