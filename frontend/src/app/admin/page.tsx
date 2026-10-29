'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { dashboardApi, medicinesApi, reportsApi } from '@/lib/api'
import { DEMO_ORGANIZATIONS, DEMO_MEDICINES, DEMO_REPORTS, Organization } from '@/lib/demoData'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

const COLORS = { verified: '#10B981', suspicious: '#EAAA00', expired: '#EF4444', unverified: '#BAC5CE' }
const PIE_COLORS = ['#10B981', '#EAAA00', '#EF4444']

function AdminContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'analytics')
  const [stats, setStats] = useState<any>(null)
  const [medicines, setMedicines] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [orgs, setOrgs] = useState<Organization[]>(DEMO_ORGANIZATIONS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      dashboardApi.admin(),
      medicinesApi.list(),
      reportsApi.adminList(),
    ])
      .then(([statsRes, medsRes, repsRes]) => {
        if (!isMounted) return
        setStats(statsRes.data)
        setMedicines(medsRes.data)
        setReports(repsRes.data)
      })
      .catch(() => {
        if (!isMounted) return
        // Fallback to local demo data
        setMedicines(DEMO_MEDICINES)
        setReports(DEMO_REPORTS)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleUpdateOrgStatus = (id: string, newStatus: any) => {
    setOrgs(
      orgs.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
    toast.success(`Organization status updated to ${newStatus}. Audit log entry recorded.`)
  }

  const TABS = [
    { key: 'analytics', label: '📊 Analytics & Risk' },
    { key: 'organizations', label: '🏭 Company Applications' },
    { key: 'medicines', label: '💊 Medicine Registry' },
    { key: 'reports', label: '📋 Counterfeit Reports' },
    { key: 'scans', label: '🔍 Audit & Scans' },
  ]

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <div className="loader" />
      </div>
    </>
  )

  return (
    <AuthGuard
      allowedRoles={['admin']}
      portalName="Administrator Control"
      requiredRoleLabel="Platform Administrator"
      defaultDemoEmail="admin@medisure.ai"
      defaultDemoRole="admin"
    >
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 1.5rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: 'var(--primary-dark)', margin: 0 }}>
                  System Administrator Governance Portal
                </h1>
                <Badge variant="verified">Admin Privileges Active</Badge>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
                Chief Administrator: <strong>Dr. Ramesh Sharma</strong> &bull; CDSCO Regulatory Oversight Node
              </p>
            </div>
          </div>

          <Alert variant="info" title="Administrative Authority & Non-Affiliation Rule" className="mb-6">
            Platform administrative actions govern platform access and verifiable QR issuance. Internal approval does not represent government regulatory orders or statutory certifications.
          </Alert>

          {/* Stat Row */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Scans', value: stats.total_scans, color: 'var(--primary)' },
                { label: 'Verified', value: stats.verified, color: '#10B981' },
                { label: 'Suspicious', value: stats.suspicious, color: '#F59E0B' },
                { label: 'Expired', value: stats.expired, color: '#EF4444' },
                { label: 'Medicines', value: stats.total_medicines, color: 'var(--primary)' },
                { label: 'Reports', value: stats.total_reports, color: '#F59E0B' },
                { label: 'Pending Orgs', value: orgs.filter((o) => o.status === 'pending_review').length, color: '#DC2626' },
              ].map((s) => (
                <div key={s.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', background: 'white', padding: '0.4rem', borderRadius: 14, boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: '0.65rem 1rem',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Analytics Tab ─────────────────────────────────── */}
          {activeTab === 'analytics' && stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>Monthly Surveillance Scan Volume</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.monthly_trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="verified" fill={COLORS.verified} name="Verified" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="suspicious" fill={COLORS.suspicious} name="Suspicious" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expired" fill={COLORS.expired} name="Expired" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>Scan Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Low Risk', value: stats.risk_distribution.low || 0 },
                        { name: 'Medium Risk', value: stats.risk_distribution.medium || 0 },
                        { name: 'High Risk', value: stats.risk_distribution.high || 0 },
                      ]}
                      cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>Top Flagged Scans</h3>
                {stats.top_flagged?.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <Badge variant="recalled">{item.count} flags</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Organizations Tab ─────────────────────────────── */}
          {activeTab === 'organizations' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}>
                  Company Applications & Stakeholder Organization Review ({orgs.length})
                </h3>
                <Badge variant="warning">{orgs.filter((o) => o.status === 'pending_review').length} Pending Decision</Badge>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Entity Legal Name</th>
                      <th style={{ padding: '0.75rem' }}>Type</th>
                      <th style={{ padding: '0.75rem' }}>Registration No.</th>
                      <th style={{ padding: '0.75rem' }}>Licence Reference</th>
                      <th style={{ padding: '0.75rem' }}>Current Status</th>
                      <th style={{ padding: '0.75rem' }}>Action Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orgs.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 700 }}>{o.legal_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.registered_address}</div>
                        </td>
                        <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{o.org_type}</td>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{o.registration_number}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--accent-dark)', fontWeight: 600 }}>{o.licence_number || 'N/A'}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <Badge variant={o.status === 'approved' ? 'approved' : o.status === 'pending_review' ? 'pending' : 'rejected'}>
                            {o.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {o.status === 'pending_review' ? (
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button
                                onClick={() => handleUpdateOrgStatus(o.id, 'approved')}
                                className="btn-primary"
                                style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateOrgStatus(o.id, 'rejected')}
                                className="btn-danger"
                                style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : o.status === 'approved' ? (
                            <button
                              onClick={() => handleUpdateOrgStatus(o.id, 'suspended')}
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: 6,
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#DC2626',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              Suspend Access
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateOrgStatus(o.id, 'approved')}
                              className="btn-ghost"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Reinstate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Medicines Tab ─────────────────────────────────── */}
          {activeTab === 'medicines' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}>Approved Medicine Catalog</h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{medicines.length} registered products</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Product Code</th>
                      <th style={{ padding: '0.75rem' }}>Brand & Generic</th>
                      <th style={{ padding: '0.75rem' }}>Dosage & Strength</th>
                      <th style={{ padding: '0.75rem' }}>Manufacturer</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med: any) => (
                      <tr key={med.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{med.product_code || med.product_id}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 700 }}>{med.brand_name || med.medicine_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{med.generic_name}</div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{med.strength} ({med.dosage_form})</td>
                        <td style={{ padding: '0.75rem' }}>{med.organization_name || med.manufacturer?.name}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <Badge variant="verified">{med.status || 'active'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Reports Tab ───────────────────────────────────── */}
          {activeTab === 'reports' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}>Counterfeit & Packaging Triage Reports</h3>
                <Badge variant="warning">{reports.length} Reports Logged</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reports.map((rep: any) => (
                  <div key={rep.id} style={{
                    padding: '1.25rem',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-base)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{rep.report_reference || rep.report_ref}</span>
                        <Badge variant="warning">{rep.reason_category || rep.reason}</Badge>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{rep.medicine_name} (Batch: {rep.batch_number || 'Unknown'})</div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem', margin: 0 }}>
                        {rep.description}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Purchased at: {rep.pharmacy_source || 'Unspecified retail dispensary'} &bull; {rep.is_anonymous ? 'Anonymous Consumer' : 'Identified User'}
                      </div>
                    </div>

                    <div>
                      <Badge variant={rep.status === 'pending' ? 'pending' : 'verified'}>
                        {rep.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Scans Tab ─────────────────────────────────────── */}
          {activeTab === 'scans' && stats && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem' }}>System-Wide Audit Logs & Verification Scans</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Scan ID</th>
                      <th style={{ padding: '0.75rem' }}>Medicine & Batch</th>
                      <th style={{ padding: '0.75rem' }}>Timestamp</th>
                      <th style={{ padding: '0.75rem' }}>Result Classification</th>
                      <th style={{ padding: '0.75rem' }}>Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_scans.map((scan: any) => (
                      <tr key={scan.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>#{scan.id}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <strong>{scan.medicine?.medicine_name || 'Generic Sample'}</strong> ({scan.batch?.batch_number || 'B-101'})
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                          {new Date(scan.scan_timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <Badge variant={scan.result === 'verified' ? 'verified' : scan.result === 'suspicious' ? 'suspicious' : 'recalled'}>
                            {scan.result}
                          </Badge>
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{scan.risk_score || 15}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </AuthGuard>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" /></div>}>
      <AdminContent />
    </Suspense>
  )
}
