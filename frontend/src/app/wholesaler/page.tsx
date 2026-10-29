'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Alert } from '@/components/ui/Alert'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { DEMO_ORGANIZATIONS } from '@/lib/demoData'
import toast from 'react-hot-toast'

export default function WholesalerPage() {
  const wholesaler = DEMO_ORGANIZATIONS[2] // MediTrade Wholesale Hub

  const [pharmacyOrders, setPharmacyOrders] = useState([
    {
      id: 'ord-101',
      pharmacy: 'ApolloCare Community Pharmacy (Thane)',
      drug: 'Dolo 650 (Paracetamol IP)',
      batch: 'DOLO650-B25081',
      quantity: 2500,
      status: 'delivered'
    },
    {
      id: 'ord-102',
      pharmacy: 'Metro Health Chemist (Dadar)',
      drug: 'Pan-D Capsules (Alkem)',
      batch: 'PAND-24E091',
      quantity: 250,
      status: 'flagged_expired'
    },
    {
      id: 'ord-103',
      pharmacy: 'Sunrise Dispensary (Bandra)',
      drug: 'Shelcal 500 (Torrent)',
      batch: 'SHELCAL-REP01',
      quantity: 300,
      status: 'dispatched'
    }
  ])

  const handleDispatchOrder = (id: string) => {
    setPharmacyOrders(
      pharmacyOrders.map((o) => (o.id === id ? { ...o, status: 'dispatched' } : o))
    )
    toast.success('Pharmacy shipment dispatched and recorded on supply-chain ledger!')
  }

  return (
    <AuthGuard
      allowedRoles={['wholesaler', 'admin']}
      portalName="Wholesaler Portal"
      requiredRoleLabel="Licensed Wholesaler / Stockist"
      defaultDemoEmail="wholesaler@meditrade.demo"
      defaultDemoRole="wholesaler"
    >
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📦</span>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: 'var(--primary-dark)', margin: 0 }}>
                  {wholesaler.legal_name}
                </h1>
                <Badge variant="approved">Approved Wholesaler</Badge>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
                Wholesale Drug Licence: <strong>{wholesaler.licence_number}</strong> &bull; {wholesaler.registered_address}
              </p>
            </div>

            <Link href="/scan" className="btn-accent btn-sm">
              🔍 Verify Inbound Case
            </Link>
          </div>

          <Alert variant="warning" title="Quality Alert: Quarantined Inventory Notice" className="mb-6">
            Wholesale inventory check: Batch <strong>VB100-EXP88</strong> has reached its recorded expiry. Automated distribution lock is active; this batch cannot be dispatched to pharmacies.
          </Alert>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label="Retail Pharmacy Clients" value="42" icon="🏥" color="var(--primary)" />
            <StatCard label="Active Inbound Stock" value="12,500" subtext="Units" icon="📦" color="var(--primary)" />
            <StatCard label="Dispatched Today" value="850" subtext="Units" icon="🚚" color="#10B981" />
            <StatCard label="Quarantined Batches" value="1" icon="⚠️" color="#EF4444" />
          </div>

          {/* Pharmacy Orders Table */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1.2rem' }}>
              Pharmacy Delivery & Outgoing Allocation
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Order Ref</th>
                    <th style={{ padding: '0.75rem' }}>Dispensing Pharmacy</th>
                    <th style={{ padding: '0.75rem' }}>Product & Batch</th>
                    <th style={{ padding: '0.75rem' }}>Quantity</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacyOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>{o.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{o.pharmacy}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div><strong>{o.drug}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Batch: {o.batch}</div>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{o.quantity}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <Badge variant={o.status === 'delivered' ? 'verified' : o.status === 'flagged_expired' ? 'expired' : 'pending'}>
                          {o.status === 'delivered' ? 'Delivered' : o.status === 'flagged_expired' ? 'Locked (Expired)' : 'In Dispatch'}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {o.status === 'flagged_expired' ? (
                          <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>Distribution Blocked</span>
                        ) : o.status !== 'delivered' ? (
                          <button
                            onClick={() => handleDispatchOrder(o.id)}
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            Dispatch Order
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>✓ Signed & Delivered</span>
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
