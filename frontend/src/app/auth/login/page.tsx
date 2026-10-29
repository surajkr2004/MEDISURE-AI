'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

const ROLE_REDIRECTS: Record<string, string> = {
  manufacturer: '/company',
  distributor: '/distributor',
  wholesaler: '/wholesaler',
  pharmacy: '/pharmacy',
  reviewer: '/reviewer',
  admin: '/admin',
  consumer: '/dashboard'
}

const DEMO_PERSONAS = [
  {
    role: 'manufacturer',
    name: 'Dr. Priya Nair',
    org: 'Micro Labs Limited (Plant Kumbalgodu)',
    email: 'compliance@microlabs.in',
    icon: '🏭',
    color: '#EAAA00',
    target: '/company'
  },
  {
    role: 'distributor',
    name: 'Vikas Patel',
    org: 'Apex Logistics (Cold-Chain)',
    email: 'distributor@apexpath.demo',
    icon: '🚚',
    color: '#FFC42E',
    target: '/distributor'
  },
  {
    role: 'wholesaler',
    name: 'Anand Kulkarni',
    org: 'MediTrade Stockist Hub',
    email: 'wholesaler@meditrade.demo',
    icon: '📦',
    color: '#BAC5CE',
    target: '/wholesaler'
  },
  {
    role: 'pharmacy',
    name: 'Suman Roy',
    org: 'ApolloCare Chemist & Retail',
    email: 'pharmacy@apollohealth.demo',
    icon: '💊',
    color: '#DDE3E8',
    target: '/pharmacy'
  },
  {
    role: 'reviewer',
    name: 'Kavita Joshi',
    org: 'CDSCO Regulatory Inspector',
    email: 'reviewer@cdsco-audit.demo',
    icon: '🔍',
    color: '#C68F00',
    target: '/reviewer'
  },
  {
    role: 'admin',
    name: 'Dr. Ramesh Sharma',
    org: 'MediSure Governance Admin',
    email: 'admin@medisure.ai',
    icon: '🛡️',
    color: '#EAAA00',
    target: '/admin'
  },
  {
    role: 'consumer',
    name: 'Aarav Mehta',
    org: 'Consumer / Patient',
    email: 'user@medisure.ai',
    icon: '👤',
    color: '#DDE3E8',
    target: '/dashboard'
  }
]

function LoginContent() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const requestedRole = searchParams.get('role')

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSuccessfulRedirect = (userRole?: string) => {
    if (redirectUrl) {
      router.push(redirectUrl)
      return
    }
    const target = (userRole && ROLE_REDIRECTS[userRole]) || '/dashboard'
    router.push(target)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      const stored = localStorage.getItem('medisure_user')
      const parsed = stored ? JSON.parse(stored) : null
      toast.success(`Welcome back, ${parsed?.name || 'User'}!`)
      handleSuccessfulRedirect(parsed?.role)
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Login failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (persona: typeof DEMO_PERSONAS[0]) => {
    setLoading(true)
    setForm({ email: persona.email, password: 'DemoPassword@123' })
    try {
      await login(persona.email, 'DemoPassword@123')
      toast.success(`Signed in as ${persona.name} (${persona.org})`)
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.push(persona.target)
      }
    } catch {
      toast.error('Demo authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #3A0F34 0%, #150314 100%)',
      padding: '3rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
        {/* Header / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent), #54194C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 4px 15px rgba(234, 170, 0, 0.35)'
            }}>🛡️</div>
            <h1 style={{ color: 'white', fontSize: '1.75rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, margin: 0 }}>
              MediSure <span style={{ color: 'var(--accent)' }}>AI</span>
            </h1>
          </Link>
          <p style={{ color: 'rgba(221, 227, 232, 0.75)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>
            Authenticate with accredited stakeholder credentials
          </p>
          {redirectUrl && (
            <div style={{
              marginTop: '0.75rem',
              display: 'inline-block',
              background: 'rgba(234, 170, 0, 0.15)',
              border: '1px solid rgba(234, 170, 0, 0.4)',
              borderRadius: 8,
              padding: '0.35rem 0.85rem',
              fontSize: '0.8125rem',
              color: 'var(--accent)'
            }}>
              🔒 Gated Route: Sign in to access your designated portal
            </div>
          )}
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(42, 11, 38, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(221, 227, 232, 0.15)',
          borderRadius: 20,
          padding: '2rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                Accredited Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                className="input"
                placeholder="e.g. compliance@microlabs.in"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                Password / Signing Token
              </label>
              <input
                id="login-password"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn-accent"
              disabled={loading}
              style={{ justifyContent: 'center', marginTop: '0.25rem', padding: '0.75rem', fontWeight: 700 }}
            >
              {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In to Portal →'}
            </button>
          </form>

          {/* Quick 1-Click Demo Stakeholder Accounts */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase' }}>
                ⚡ Quick Demo Stakeholders (1-Click)
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>PBL Evaluation Sandbox</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {DEMO_PERSONAS.map((p) => {
                const isRequested = requestedRole === p.role
                return (
                  <button
                    key={p.role}
                    onClick={() => handleDemoLogin(p)}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 10,
                      background: isRequested ? 'rgba(234, 170, 0, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: isRequested ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = isRequested ? 'rgba(234, 170, 0, 0.18)' : 'rgba(255, 255, 255, 0.04)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{p.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                          {p.name}{' '}
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'rgba(255,255,255,0.1)',
                            color: p.color,
                            textTransform: 'uppercase',
                            marginLeft: '0.35rem'
                          }}>
                            {p.role}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#BAC5CE' }}>{p.org}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Enter →</span>
                  </button>
                )
              })}
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.875rem', marginTop: '1.5rem', marginBottom: 0 }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Register Organization
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1F071D' }}>
        <div className="loader" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
