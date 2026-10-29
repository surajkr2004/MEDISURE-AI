'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { dashboardApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'

const RESULT_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: '✓ Verified', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  suspicious: { label: '⚠ Suspicious', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  expired: { label: '⏰ Expired', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  unverified: { label: '🚨 Unverified', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const api = user.role === 'admin' ? dashboardApi.admin : dashboardApi.user
    api().then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [user])

  const statCards = [
    { label: 'Total Scans', value: stats?.total_scans ?? 0, icon: '🔍', color: 'var(--primary)' },
    { label: 'Verified', value: stats?.verified ?? 0, icon: '✓', color: '#10B981' },
    { label: 'Suspicious', value: stats?.suspicious ?? 0, icon: '⚠️', color: '#F59E0B' },
    { label: 'Expired', value: stats?.expired ?? 0, icon: '⏰', color: '#EF4444' },
    { label: 'Unverified', value: stats?.unverified ?? 0, icon: '🚨', color: '#EF4444' },
  ]

  return (
    <AuthGuard
      portalName="Consumer Verification Dashboard"
      requiredRoleLabel="Consumer / Patient"
      defaultDemoEmail="user@medisure.ai"
      defaultDemoRole="consumer"
    >
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        {loading ? (
          <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader" />
          </div>
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                Welcome, {user?.name} 👋
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Your verification overview'}
              </p>
            </div>
            <Link href="/scan" className="btn-accent">
              🔍 New Scan
            </Link>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {statCards.map((s) => (
              <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Admin extras */}
          {user?.role === 'admin' && stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Medicines', value: stats.total_medicines, icon: '💊' },
                { label: 'Manufacturers', value: stats.total_manufacturers, icon: '🏭' },
                { label: 'Reports', value: stats.total_reports, icon: '📋' },
                { label: 'Pending Reports', value: stats.pending_reports, icon: '⏳' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.75rem' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent scans */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>Recent Scans</h2>
              <Link href="/history" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                View All →
              </Link>
            </div>

            {(!stats?.recent_scans || stats.recent_scans.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p>No scans yet. Start by scanning a medicine!</p>
                <Link href="/scan" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  🔍 Scan Medicine
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Medicine', 'Batch', 'Date', 'Result', 'Risk'].map(h => (
                        <th key={h} style={{
                          padding: '0.625rem 0.875rem', textAlign: 'left',
                          fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                          borderBottom: '2px solid var(--border)',
                        }}>{h}</th>
                      ))}
                      <th style={{ padding: '0.625rem', borderBottom: '2px solid var(--border)' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_scans.map((scan: any) => {
                      const badge = RESULT_BADGES[scan.result] || RESULT_BADGES.unverified
                      return (
                        <tr key={scan.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-base)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                          <td style={{ padding: '0.875rem', fontWeight: 600, fontSize: '0.9rem' }}>
                            {scan.medicine?.medicine_name ?? 'Unknown'}
                          </td>
                          <td style={{ padding: '0.875rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                            {scan.batch?.batch_number ?? '—'}
                          </td>
                          <td style={{ padding: '0.875rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {new Date(scan.scan_timestamp).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '0.875rem' }}>
                            <span style={{
                              padding: '0.25rem 0.625rem', borderRadius: 100,
                              fontSize: '0.8rem', fontWeight: 700,
                              color: badge.color, background: badge.bg,
                            }}>{badge.label}</span>
                          </td>
                          <td style={{ padding: '0.875rem' }}>
                            <span style={{
                              fontSize: '0.8rem', fontWeight: 600,
                              color: scan.risk_level === 'low' ? '#10B981' : scan.risk_level === 'medium' ? '#F59E0B' : '#EF4444',
                            }}>
                              {scan.risk_level === 'low' ? '🟢' : scan.risk_level === 'medium' ? '🟡' : '🔴'} {scan.risk_level}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem' }}>
                            <Link href={`/verify/${scan.id}`} style={{
                              color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem',
                              textDecoration: 'none',
                            }}>Details →</Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Admin quick links */}
          {user?.role === 'admin' && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/admin" className="btn-primary">📊 Admin Dashboard</Link>
                <Link href="/admin?tab=medicines" className="btn-ghost">💊 Manage Medicines</Link>
                <Link href="/admin?tab=reports" className="btn-ghost">📋 Review Reports</Link>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
      <Footer />
    </AuthGuard>
  )
}
