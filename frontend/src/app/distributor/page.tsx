'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Alert } from '@/components/ui/Alert'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { DEMO_ORGANIZATIONS, DEMO_SUPPLY_EVENTS } from '@/lib/demoData'
import toast from 'react-hot-toast'

export default function DistributorPage() {
  const distributor = DEMO_ORGANIZATIONS[1] // Apex Logistics & Distribution

  const [inboundShipments, setInboundShipments] = useState([
    {
      id: 'shp-01',
      ref: 'SHP-2026-IND-001',
      mfg: 'Micro Labs Limited',
      batch: 'DOLO650-B25081',
      drug: 'Dolo 650',
      quantity: 50000,
      status: 'received',
      temp: 'Compliant (23.4°C)'
    },
    {
      id: 'shp-02',
      ref: 'SHP-2026-IND-004',
      mfg: 'GlaxoSmithKline Pharmaceuticals Ltd.',
      batch: 'AUG625-CL2409',
      drug: 'Augmentin 625 Duo',
      quantity: 40000,
      status: 'in_transit',
      temp: 'Transit (<25°C)'
    }
  ])

  const handleConfirmReceipt = (id: string) => {
    setInboundShipments(
      inboundShipments.map((s) => (s.id === id ? { ...s, status: 'received' } : s))
    )
    toast.success('Shipment receipt confirmed. Ledger custody block recorded!')
  }

  return (
    <AuthGuard
      allowedRoles={['distributor', 'admin']}
      portalName="Distributor Logistics Hub"
      requiredRoleLabel="Logistics & Distribution Partner"
      defaultDemoEmail="distributor@apexpath.demo"
      defaultDemoRole="distributor"
    >
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🚚</span>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: 'var(--primary-dark)', margin: 0 }}>
                  {distributor.legal_name}
                </h1>
                <Badge variant="approved">Approved Distributor</Badge>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
                Wholesale Drug Licence: <strong>{distributor.licence_number}</strong> &bull; Location: {distributor.registered_address}
              </p>
            </div>

            <Link href="/scan" className="btn-accent btn-sm">
              🔍 Scan Carton QR
            </Link>
          </div>

          <Alert variant="info" title="Supply-Chain Node Role" className="mb-6">
            Distributors cannot alter manufacturer product details or fabricate upstream events. All receipts and dispatches append cryptographic blocks to the shared SHA-256 audit ledger.
          </Alert>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label="Inbound Shipments" value={inboundShipments.length} icon="📥" color="var(--primary)" />
            <StatCard label="Reconciled Batches" value="18" icon="✓" color="#10B981" />
            <StatCard label="Active Dispatches" value="5" icon="🚚" color="var(--primary)" />
            <StatCard label="Cold-Chain Status" value="100%" subtext="Compliant" icon="❄️" color="#10B981" />
          </div>

          {/* Inbound Shipments Table */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1.2rem' }}>
              Inbound Factory Shipments
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Shipment Ref</th>
                    <th style={{ padding: '0.75rem' }}>Manufacturer</th>
                    <th style={{ padding: '0.75rem' }}>Medicine & Batch</th>
                    <th style={{ padding: '0.75rem' }}>Units</th>
                    <th style={{ padding: '0.75rem' }}>Temp Log</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inboundShipments.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>{s.ref}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{s.mfg}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div><strong>{s.drug}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Batch: {s.batch}</div>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{s.quantity.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--accent-dark)' }}>{s.temp}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <Badge variant={s.status === 'received' ? 'verified' : 'pending'}>
                          {s.status === 'received' ? 'Received & Checked' : 'In Transit'}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {s.status !== 'received' ? (
                          <button
                            onClick={() => handleConfirmReceipt(s.id)}
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            Confirm Receipt
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>✓ Logged</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Ledger View */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
              Apex Logistics Node: Append-Only Custody Ledger
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              {DEMO_SUPPLY_EVENTS.slice(1, 3).map((e) => (
                <div key={e.id} style={{ padding: '1rem', background: 'var(--bg-base)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong>Block #{e.event_sequence}: {e.event_type.toUpperCase()}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date(e.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div>Batch: <strong>{e.batch_number}</strong> &bull; Location: {e.location_text}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--accent-dark)', marginTop: '0.35rem' }}>
                    Prev: {e.previous_hash.slice(0, 24)}... &rarr; Curr: {e.current_hash.slice(0, 24)}...
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </AuthGuard>
  )
}
