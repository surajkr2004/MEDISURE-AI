'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { verifyApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'

const RESULT_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: '✓ Verified', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  suspicious: { label: '⚠ Suspicious', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  expired: { label: '⏰ Expired', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  unverified: { label: '🚨 Unverified', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
}

const FILTERS = ['all', 'verified', 'suspicious', 'expired', 'unverified']

export default function HistoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [records, setRecords] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchHistory = async (f?: string) => {
    setLoading(true)
    try {
      const { data } = await verifyApi.getHistory(f && f !== 'all' ? f : undefined)
      setRecords(Array.isArray(data) ? data : [])
    } catch {
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    let isMounted = true

    verifyApi.getHistory()
      .then((res) => {
        if (!isMounted) return
        setRecords(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!isMounted) return
        setRecords([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [user, isLoading, router])

  const handleFilter = (f: string) => {
    setFilter(f)
    fetchHistory(f)
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Verification History</h1>
              <p style={{ color: 'var(--text-secondary)' }}>All your previous medicine scans</p>
            </div>
            <Link href="/scan" className="btn-accent btn-sm">+ New Scan</Link>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => handleFilter(f)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: 100, border: '1.5px solid',
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)',
                  borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
                  background: filter === f ? 'var(--primary)' : 'white',
                  color: filter === f ? 'white' : 'var(--text-secondary)',
                }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="loader" style={{ margin: '0 auto' }} />
            </div>
          ) : records.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3 style={{ marginBottom: '0.5rem' }}>No scans found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {filter === 'all' ? "You haven't scanned any medicines yet." : `No ${filter} scans found.`}
              </p>
              <Link href="/scan" className="btn-primary" style={{ display: 'inline-flex' }}>🔍 Scan Medicine</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {records.map((record: any) => {
                const badge = RESULT_BADGES[record.result] || RESULT_BADGES.unverified
                return (
                  <div key={record.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                        {record.medicine?.medicine_name ?? 'Unknown Medicine'}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {record.medicine?.manufacturer?.name ?? ''} •{' '}
                        <span style={{ fontFamily: 'monospace' }}>{record.batch?.batch_number ?? 'No batch'}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', minWidth: 80 }}>
                      {new Date(record.scan_timestamp).toLocaleDateString()}
                    </div>
                    <div>
                      <span style={{
                        padding: '0.3rem 0.75rem', borderRadius: 100,
                        fontSize: '0.8rem', fontWeight: 700,
                        color: badge.color, background: badge.bg,
                      }}>{badge.label}</span>
                    </div>
                    <div>
                      <span style={{
                        fontSize: '0.8rem', fontWeight: 600,
                        color: record.risk_level === 'low' ? '#10B981' : record.risk_level === 'medium' ? '#F59E0B' : '#EF4444',
                      }}>
                        {record.risk_level === 'low' ? '🟢' : record.risk_level === 'medium' ? '🟡' : '🔴'} {record.risk_level} risk
                      </span>
                    </div>
                    <Link href={`/verify/${record.id}`} style={{
                      color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem',
                      textDecoration: 'none', whiteSpace: 'nowrap',
                    }}>
                      Details →
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
