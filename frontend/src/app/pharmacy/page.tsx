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

export default function PharmacyPage() {
  const pharmacy = DEMO_ORGANIZATIONS[3] // ApolloCare Community Pharmacy

  const [inventory, setInventory] = useState([
    {
      id: 'inv-1',
      brand: 'Dolo 650',
      salt: 'Paracetamol IP 650mg',
      batch: 'DOLO650-B25081',
      expiry: '2027-07-31',
      stock: 2400,
      status: 'active'
    },
    {
      id: 'inv-2',
      brand: 'Telma 40',
      salt: 'Telmisartan Tablets IP 40mg',
      batch: 'TELMA-REC26',
      expiry: '2026-05-31',
      stock: 14,
      status: 'recalled'
    },
    {
      id: 'inv-3',
      brand: 'Augmentin 625 Duo',
      salt: 'Amoxicillin + Clavulanate IP',
      batch: 'AUG625-CL2409',
      expiry: '2027-03-31',
      stock: 380,
      status: 'active'
    }
  ])

  const handleQuarantineStock = (batchNo: string) => {
    setInventory(
      inventory.map((i) => (i.batch === batchNo ? { ...i, status: 'quarantined', stock: 0 } : i))
    )
    toast.success(`Batch ${batchNo} quarantined from retail dispensing shelf!`)
  }

  return (
    <AuthGuard
      allowedRoles={['pharmacy', 'admin']}
      portalName="Pharmacy Dispensary"
      requiredRoleLabel="Licensed Pharmacist / Chemist"
      defaultDemoEmail="pharmacy@apollohealth.demo"
      defaultDemoRole="pharmacy"
    >
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.5rem' }}>💊</span>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: 'var(--primary-dark)', margin: 0 }}>
                  {pharmacy.legal_name}
                </h1>
                <Badge variant="approved">Licensed Retail Chemist</Badge>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
                Retail Chemist Licence: <strong>{pharmacy.licence_number}</strong> &bull; {pharmacy.registered_address}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/scan" className="btn-accent btn-sm">
                🔍 Verify Strip for Patient
              </Link>
            </div>
          </div>

          {/* Urgent Recall Banner */}
          <Alert variant="danger" title="URGENT RECALL NOTICE: CardioGuard 10 (Batch CG10-REC99)" className="mb-6">
            CDSCO Alert Ref: 2026/04/MH has ordered immediate recall of CardioGuard 10 Batch <strong>CG10-REC99</strong>. If this batch is in your stock, do not dispense it to customers. Quarantine all remaining blister strips immediately.
          </Alert>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label="Dispensary Inventory" value="630" subtext="Packs" icon="💊" color="var(--primary)" />
            <StatCard label="Active Valid Batches" value="2" icon="✓" color="#10B981" />
            <StatCard label="Quarantined Recalls" value="1" icon="🚨" color="#EF4444" />
            <StatCard label="Patient Scans Logged" value="18" icon="📱" color="var(--accent-dark)" />
          </div>

          {/* Dispensary Stock Table */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.2rem' }}>
                Retail Dispensary Shelf Stock
              </h3>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Pharmacist in Charge: Suman Roy (Reg. No. 49812-MH)
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Medicine & Salt</th>
                    <th style={{ padding: '0.75rem' }}>Batch Number</th>
                    <th style={{ padding: '0.75rem' }}>Expiry Date</th>
                    <th style={{ padding: '0.75rem' }}>Stock in Shelf</th>
                    <th style={{ padding: '0.75rem' }}>Safety Status</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div><strong>{item.brand}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.salt}</div>
                      </td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>{item.batch}</td>
                      <td style={{ padding: '0.75rem' }}>{item.expiry}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{item.stock} strips</td>
                      <td style={{ padding: '0.75rem' }}>
                        <Badge variant={item.status === 'recalled' ? 'recalled' : item.status === 'quarantined' ? 'revoked' : 'verified'}>
                          {item.status === 'recalled' ? 'CDSCO Recall Order' : item.status === 'quarantined' ? 'Quarantined' : 'Active Safe'}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {item.status === 'recalled' ? (
                          <button
                            onClick={() => handleQuarantineStock(item.batch)}
                            className="btn-danger"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            Quarantine Batch
                          </button>
                        ) : item.status === 'quarantined' ? (
                          <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>Removed from Shelf</span>
                        ) : (
                          <Link
                            href={`/scan?code=${item.batch}`}
                            className="btn-ghost"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          >
                            Verify QR &rarr;
                          </Link>
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
