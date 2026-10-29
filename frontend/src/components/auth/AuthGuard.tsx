'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  portalName: string
  requiredRoleLabel: string
  defaultDemoEmail?: string
  defaultDemoRole?: string
}

export function AuthGuard({
  children,
  allowedRoles,
  portalName,
  requiredRoleLabel,
  defaultDemoEmail,
  defaultDemoRole
}: AuthGuardProps) {
  const { user, login, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [quickLoginLoading, setQuickLoginLoading] = useState(false)

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div className="loader" style={{ width: 44, height: 44, borderWidth: 3 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Verifying stakeholder security clearance...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Not logged in: Show Authentication Gate
  if (!user) {
    const handleQuickLogin = async () => {
      if (!defaultDemoEmail) {
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }
      setQuickLoginLoading(true)
      try {
        await login(defaultDemoEmail, 'Demo@123')
        toast.success(`Logged in as accredited ${requiredRoleLabel}!`)
      } catch {
        toast.error('Quick demo login failed. Please use standard sign in.')
      } finally {
        setQuickLoginLoading(false)
      }
    }

    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #3A0F34 0%, #150314 100%)', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 3rem' }}>
          <div style={{
            maxWidth: 540,
            width: '100%',
            background: 'rgba(42, 11, 38, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(234, 170, 0, 0.3)',
            borderRadius: 24,
            padding: '2.5rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(234, 170, 0, 0.12)',
            textAlign: 'center'
          }}>
            {/* Lock Icon */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(234, 170, 0, 0.25), rgba(84, 25, 76, 0.5))',
              border: '1px solid rgba(234, 170, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.25rem',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 25px rgba(234, 170, 0, 0.3)'
            }}>
              🔐
            </div>

            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.85rem',
              borderRadius: 9999,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              Stakeholder Clearance Required
            </div>

            <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Sign In to Access {portalName}
            </h1>

            <p style={{ color: 'rgba(221, 227, 232, 0.75)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Direct access to this interface without authentication is strictly disabled. You must authenticate with an accredited <strong>{requiredRoleLabel}</strong> profile to access records, dispatch logs, and cryptographic actions.
            </p>

            {/* Verification Credentials Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(221, 227, 232, 0.12)',
              borderRadius: 14,
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#BAC5CE', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Required Credentials Check
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> CDSCO / State Drug Control Valid License
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> SHA-256 Ledger Signing Key Authorization
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> Role: <code style={{ color: 'var(--accent)', background: 'rgba(234, 170, 0, 0.15)', padding: '2px 6px', borderRadius: 4 }}>{allowedRoles?.join(' or ') || 'authenticated'}</code>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(pathname)}&role=${defaultDemoRole || ''}`}
                className="btn-accent"
                style={{ justifyContent: 'center', padding: '0.85rem', fontSize: '1rem', fontWeight: 700, textDecoration: 'none' }}
              >
                Sign In with Credentials →
              </Link>

              {defaultDemoEmail && (
                <button
                  onClick={handleQuickLogin}
                  disabled={quickLoginLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                >
                  {quickLoginLoading ? (
                    <span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  ) : (
                    <>⚡ Quick Demo Sign-In as {requiredRoleLabel}</>
                  )}
                </button>
              )}

              <Link
                href="/"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  marginTop: '0.5rem'
                }}
              >
                ← Return to Public Homepage
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Logged in, but unauthorized role (and not admin)
  const isAuthorized =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    allowedRoles.includes(user.role) ||
    user.role === 'admin'

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 3rem' }}>
          <div style={{
            maxWidth: 520,
            width: '100%',
            background: '#2A0B26',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 20,
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
            <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Access Clearance Denied (403)
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your current profile <strong>{user.name}</strong> is authenticated with role{' '}
              <span style={{ color: '#F87171', fontWeight: 700, textTransform: 'uppercase' }}>{user.role}</span>.
              This does not meet the clearance requirement for <strong>{portalName}</strong>.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 10,
              padding: '0.75rem 1rem',
              fontSize: '0.8125rem',
              color: '#BAC5CE',
              marginBottom: '1.75rem',
              textAlign: 'left'
            }}>
              <div><strong>Permitted Roles:</strong> {allowedRoles.join(', ')}</div>
              <div><strong>Your Active Role:</strong> {user.role}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(pathname)}&role=${defaultDemoRole || ''}`}
                className="btn-accent"
                style={{ justifyContent: 'center', textDecoration: 'none' }}
              >
                Switch to an Accredited Account
              </Link>
              <Link
                href="/dashboard"
                style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  padding: '0.5rem'
                }}
              >
                Go to My Dashboard →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Authorized
  return <>{children}</>
}
