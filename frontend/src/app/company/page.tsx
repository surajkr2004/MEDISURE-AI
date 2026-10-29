'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Alert } from '@/components/ui/Alert'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { QRCodeModal } from '@/components/ui/QRCodeModal'
import { DEMO_MEDICINES, DEMO_BATCHES, DEMO_ORGANIZATIONS, DEMO_SUPPLY_EVENTS, Batch } from '@/lib/demoData'
import toast from 'react-hot-toast'

export default function CompanyPortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'medicines' | 'batches' | 'qr' | 'dispatches'>('overview')
  const [batches, setBatches] = useState<Batch[]>(DEMO_BATCHES)
  const [selectedQRBatch, setSelectedQRBatch] = useState<Batch | null>(null)
  const [generatorMedicineId, setGeneratorMedicineId] = useState<string>(DEMO_MEDICINES[0].id)
  const [generatorBatchId, setGeneratorBatchId] = useState<string>(DEMO_BATCHES[0].id)
  const [newBatchForm, setNewBatchForm] = useState({
    medicine_id: DEMO_MEDICINES[0].id,
    batch_number: '',
    manufacturing_date: '',
    expiry_date: '',
    quantity_produced: 10000
  })

  const manufacturer = DEMO_ORGANIZATIONS[0] // Micro Labs Limited

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBatchForm.batch_number || !newBatchForm.expiry_date) {
      toast.error('Please enter Batch Number and Expiry Date.')
      return
    }

    const med = DEMO_MEDICINES.find((m) => m.id === newBatchForm.medicine_id)
    const token = `MS-QR-${newBatchForm.batch_number}-GEN-${Math.floor(100 + Math.random() * 900)}`

    const createdBatch: Batch = {
      id: `batch-${Date.now()}`,
      medicine_id: newBatchForm.medicine_id,
      medicine_name: med ? med.brand_name : 'New Medicine',
      batch_number: newBatchForm.batch_number,
      manufacturing_date: newBatchForm.manufacturing_date || new Date().toISOString().split('T')[0],
      expiry_date: newBatchForm.expiry_date,
      quantity_produced: newBatchForm.quantity_produced,
      status: 'active',
      is_recalled: false,
      qr_token: token,
      scan_count: 0
    }

    setBatches([createdBatch, ...batches])
    setSelectedQRBatch(createdBatch)
    toast.success(`Batch ${createdBatch.batch_number} registered! QR Code generated.`)
    setNewBatchForm({
      medicine_id: DEMO_MEDICINES[0].id,
      batch_number: '',
      manufacturing_date: '',
      expiry_date: '',
      quantity_produced: 10000
    })
  }

  const handleRevokeToken = (batchId: string) => {
    const updated = batches.map((b) => (b.id === batchId ? { ...b, status: 'quarantined' as const } : b))
    setBatches(updated)
    toast.success('Batch QR token revoked and flagged in verification registry.')
  }

  return (
    <AuthGuard
      allowedRoles={['manufacturer', 'admin']}
      portalName="Manufacturer Portal"
      requiredRoleLabel="Pharmaceutical Manufacturer"
      defaultDemoEmail="compliance@microlabs.in"
      defaultDemoRole="manufacturer"
    >
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.5rem' }}>🏭</span>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', color: 'var(--primary-dark)', margin: 0 }}>
                  {manufacturer.legal_name}
                </h1>
                <Badge variant="approved">Approved Manufacturer</Badge>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
                Licence: <strong>{manufacturer.licence_number}</strong> &bull; Authority: {manufacturer.issuing_authority}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('batches')}
                className="btn-accent btn-sm"
              >
                + Register New Batch
              </button>
            </div>
          </div>

          {/* Compliance & Regulatory Safety Bar */}
          <Alert variant="info" title="CDSCO Manufacturing Compliance Status" className="mb-6">
            Organisation account status: <strong>Approved</strong>. Form 25 manufacturing licence validity: Active through January 2027. All issued QR tokens are signed and synced to the append-only SHA-256 audit ledger.
          </Alert>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label="Medicines" value={DEMO_MEDICINES.length} icon="💊" color="var(--primary)" />
            <StatCard label="Batches Registered" value={batches.length} icon="📦" color="var(--primary)" />
            <StatCard label="Active QR Codes" value={batches.filter((b) => b.status === 'active').length} icon="✨" color="#10B981" />
            <StatCard label="Recalled / Flagged" value={batches.filter((b) => b.is_recalled || b.status === 'quarantined').length} icon="⚠️" color="#EF4444" />
            <StatCard label="Total Scans Logged" value="234" icon="🔍" color="var(--accent-dark)" />
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'white',
            padding: '0.4rem',
            borderRadius: 14,
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {[
              { key: 'overview', label: '📊 Company Overview' },
              { key: 'medicines', label: '💊 Medicine Catalog' },
              { key: 'batches', label: '📦 Batch Management' },
              { key: 'qr', label: '📱 QR Code Generator' },
              { key: 'dispatches', label: '🚚 Outgoing Dispatches' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab.key ? 'white' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.15rem' }}>
                  Verified Company Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Corporate Identity Number (CIN):</span>
                    <div style={{ fontWeight: 600 }}>{manufacturer.registration_number}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Registered Facility Address:</span>
                    <div style={{ fontWeight: 600 }}>{manufacturer.registered_address}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Quality Assurance Contact:</span>
                    <div style={{ fontWeight: 600 }}>{manufacturer.contact_email}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>State Regulatory Jurisdiction:</span>
                    <div style={{ fontWeight: 600 }}>Maharashtra Food & Drugs Administration (FDA-MH)</div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.15rem' }}>
                  Recent Scan Surveillance Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: 10, border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                    <div style={{ fontWeight: 700, color: '#92400e' }}>High Scan Velocity: Shelcal 500 Batch SHELCAL-REP01</div>
                    <div style={{ color: '#78350f', marginTop: '0.2rem' }}>Scanned 184 times in the last 48 hours across Gujarat and Maharashtra. Flagged for review.</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <div style={{ fontWeight: 700, color: '#065f46' }}>Dolo 650 Batch DOLO650-B25081 Normal</div>
                    <div style={{ color: '#047857', marginTop: '0.2rem' }}>All consumer scans matching factory retail distribution timeline.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Medicines */}
          {activeTab === 'medicines' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Registered Medicine Catalog ({DEMO_MEDICINES.length})
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Product Code</th>
                      <th style={{ padding: '0.75rem' }}>Brand Name</th>
                      <th style={{ padding: '0.75rem' }}>Generic Composition</th>
                      <th style={{ padding: '0.75rem' }}>Dosage Form</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem' }}>CDSCO Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_MEDICINES.map((m) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>{m.product_code}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{m.brand_name}</td>
                        <td style={{ padding: '0.75rem' }}>{m.generic_name} ({m.strength})</td>
                        <td style={{ padding: '0.75rem' }}>{m.dosage_form}</td>
                        <td style={{ padding: '0.75rem' }}><Badge variant="verified">{m.status}</Badge></td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{m.regulatory_approval_ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Batches & QR */}
          {activeTab === 'batches' && (
            <div>
              {/* Batch Registration Form */}
              <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.15rem' }}>
                  Register New Batch & Generate Unique QR
                </h3>
                <form onSubmit={handleCreateBatch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Medicine Product *
                    </label>
                    <select
                      className="input"
                      value={newBatchForm.medicine_id}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, medicine_id: e.target.value })}
                    >
                      {DEMO_MEDICINES.map((m) => (
                        <option key={m.id} value={m.id}>{m.brand_name} ({m.product_code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Batch Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., MC500-B201"
                      className="input"
                      value={newBatchForm.batch_number}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, batch_number: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="input"
                      value={newBatchForm.expiry_date}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, expiry_date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Quantity Produced
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={newBatchForm.quantity_produced}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, quantity_produced: Number(e.target.value) })}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1rem', height: 44 }}>
                    + Register & Issue QR
                  </button>
                </form>
              </div>

              {/* Batches Table */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  Issued Batches & QR Code Inventory ({batches.length})
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Batch No.</th>
                        <th style={{ padding: '0.75rem' }}>Medicine</th>
                        <th style={{ padding: '0.75rem' }}>Expiry Date</th>
                        <th style={{ padding: '0.75rem' }}>QR Token</th>
                        <th style={{ padding: '0.75rem' }}>Scan Count</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>{b.batch_number}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{b.medicine_name}</td>
                          <td style={{ padding: '0.75rem' }}>{b.expiry_date}</td>
                          <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {b.qr_token}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{b.scan_count}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <Badge variant={b.is_recalled ? 'recalled' : b.status === 'expired' ? 'expired' : b.status === 'quarantined' ? 'revoked' : 'verified'}>
                              {b.is_recalled ? 'Recalled' : b.status}
                            </Badge>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <button
                                onClick={() => setSelectedQRBatch(b)}
                                className="btn-accent"
                                style={{
                                  padding: '0.25rem 0.65rem',
                                  fontSize: '0.75rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  cursor: 'pointer'
                                }}
                                title="View, download, and print scannable QR Code"
                              >
                                <span>📱</span> View QR
                              </button>
                              {b.status === 'active' ? (
                                <button
                                  onClick={() => handleRevokeToken(b.id)}
                                  style={{
                                    padding: '0.25rem 0.65rem',
                                    borderRadius: 6,
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#DC2626',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Revoke
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Locked</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: QR Code Studio */}
          {activeTab === 'qr' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.25rem' }}>
                  Interactive CDSCO 2D Barcode & QR Code Studio
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Select any manufactured pharmaceutical batch to inspect, generate, and export Rule 96 compliant packaging QR codes.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Select Medicine Formulation
                    </label>
                    <select
                      className="input"
                      value={generatorMedicineId}
                      onChange={(e) => {
                        const mId = e.target.value
                        setGeneratorMedicineId(mId)
                        const firstBatch = batches.find((b) => b.medicine_id === mId)
                        if (firstBatch) setGeneratorBatchId(firstBatch.id)
                      }}
                    >
                      {DEMO_MEDICINES.map((m) => (
                        <option key={m.id} value={m.id}>{m.brand_name} ({m.product_code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Select Issued Production Batch
                    </label>
                    <select
                      className="input"
                      value={generatorBatchId}
                      onChange={(e) => setGeneratorBatchId(e.target.value)}
                    >
                      {batches
                        .filter((b) => b.medicine_id === generatorMedicineId)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            Batch {b.batch_number} (Exp: {b.expiry_date}) — {b.status.toUpperCase()}
                          </option>
                        ))}
                    </select>
                  </div>

                  {(() => {
                    const currentBatch = batches.find((b) => b.id === generatorBatchId) || batches[0]
                    return (
                      <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)', fontSize: '0.8125rem' }}>
                        <div style={{ marginBottom: '0.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                          Batch Details Summary
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Units Produced:</span>
                          <strong>{currentBatch.quantity_produced.toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Scan Velocity:</span>
                          <strong>{currentBatch.scan_count} scans logged</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Regulatory State:</span>
                          <Badge size="sm" variant={currentBatch.is_recalled ? 'recalled' : currentBatch.status === 'expired' ? 'expired' : 'verified'}>
                            {currentBatch.is_recalled ? 'Recalled' : currentBatch.status}
                          </Badge>
                        </div>
                        <button
                          onClick={() => setSelectedQRBatch(currentBatch)}
                          className="btn-primary"
                          style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.65rem' }}
                        >
                          📱 Open Full QR Studio & Downloader
                        </button>
                      </div>
                    )
                  })()}
                </div>

                {/* Live Preview Box */}
                {(() => {
                  const currentBatch = batches.find((b) => b.id === generatorBatchId) || batches[0]
                  const currentMed = DEMO_MEDICINES.find((m) => m.id === generatorMedicineId) || DEMO_MEDICINES[0]
                  return (
                    <div style={{
                      background: 'white',
                      border: '2px dashed var(--border)',
                      borderRadius: 16,
                      padding: '1.5rem',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        Live Packaging Code Preview
                      </div>
                      <div style={{ padding: '1rem', background: 'var(--bg-base)', borderRadius: 12, display: 'inline-block', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>
                          {currentMed.brand_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                          Batch: {currentBatch.batch_number} &bull; Exp: {currentBatch.expiry_date}
                        </div>
                        <button
                          onClick={() => setSelectedQRBatch(currentBatch)}
                          className="btn-accent"
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem', cursor: 'pointer' }}
                        >
                          ✨ Render Scannable QR Code
                        </button>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
                        Click to generate high-resolution 2D barcode, export vector PNG, and test scan provenance.
                      </p>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Tab 5: Dispatches */}
          {activeTab === 'dispatches' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Recorded Outgoing Dispatches to Logistics Network
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                All recorded dispatches append a new SHA-256 block to the pharmaceutical custody ledger.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {DEMO_SUPPLY_EVENTS.filter((e) => e.event_type === 'dispatch_recorded').map((ev) => (
                  <div key={ev.id} style={{ padding: '1rem', background: 'var(--bg-base)', borderRadius: 12, border: '1px solid var(--border)', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong>Dispatch to: {ev.target_org_name || 'Apex Logistics Pvt. Ltd.'}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(ev.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      Batch: <strong>{ev.batch_number}</strong> &bull; Location: {ev.location_text}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--accent-dark)', marginTop: '0.5rem' }}>
                      SHA-256: {ev.current_hash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />

      {selectedQRBatch && (
        <QRCodeModal
          batch={selectedQRBatch}
          medicine={DEMO_MEDICINES.find((m) => m.id === selectedQRBatch.medicine_id)}
          onClose={() => setSelectedQRBatch(null)}
        />
      )}
    </AuthGuard>
  )
}
