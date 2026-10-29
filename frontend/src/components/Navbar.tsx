'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const publicNavLinks = [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/scan', label: 'Scan Medicine' },
    { href: '/search', label: 'Search' },
    { href: '/regulatory', label: 'CDSCO Notices' },
    { href: '/safety', label: 'Safety Guide' },
  ]

  const ROLE_PORTALS: Record<string, { href: string; label: string; icon: string; desc: string }> = {
    manufacturer: { href: '/company', label: 'Manufacturer Portal', icon: '🏭', desc: 'Batches, QR & Dispatches' },
    distributor: { href: '/distributor', label: 'Distributor Hub', icon: '🚚', desc: 'Shipments & Inbound' },
    wholesaler: { href: '/wholesaler', label: 'Wholesaler Portal', icon: '📦', desc: 'Pharmacy Deliveries' },
    pharmacy: { href: '/pharmacy', label: 'Pharmacy Dispensary', icon: '💊', desc: 'Receipt & Verification' },
    reviewer: { href: '/reviewer', label: 'Reviewer Workspace', icon: '🔍', desc: 'CDSCO Regulatory Staging' },
    admin: { href: '/admin', label: 'Administrator Control', icon: '🛡️', desc: 'Audits, Recalls & Orgs' },
    consumer: { href: '/dashboard', label: 'My Dashboard', icon: '👤', desc: 'Scan history & alerts' },
  }

  const userPortal = user ? ROLE_PORTALS[user.role] || ROLE_PORTALS.consumer : null

  const allPortals = [
    { href: '/dashboard', label: 'Consumer Dashboard', icon: '👤', desc: 'Scan history & alerts' },
    { href: '/company', label: 'Manufacturer Portal', icon: '🏭', desc: 'Batches, QR & Dispatches' },
    { href: '/distributor', label: 'Distributor Hub', icon: '🚚', desc: 'Shipments & Inbound' },
    { href: '/wholesaler', label: 'Wholesaler Portal', icon: '📦', desc: 'Pharmacy Deliveries' },
    { href: '/pharmacy', label: 'Pharmacy Dispensary', icon: '💊', desc: 'Receipt & Verification' },
    { href: '/reviewer', label: 'Reviewer Workspace', icon: '🔍', desc: 'CDSCO Staging & Notices' },
    { href: '/admin', label: 'Administrator Control', icon: '🛡️', desc: 'Audits, Recalls & Orgs' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(31, 7, 29, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(221, 227, 232, 0.12)',
        height: 70
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%'
        }}>
          {/* Logo & Brand */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), #54194C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 2px 12px rgba(234, 170, 0, 0.35)'
            }}>🛡️</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em', lineHeight: 1 }}>
                MediSure <span style={{ color: 'var(--accent)' }}>AI</span>
              </span>
              <span style={{ color: 'rgba(221, 227, 232, 0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginTop: '2px' }}>
                Scan. Verify. Stay Safe.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="desktop-nav">
            {publicNavLinks.map((l) => {
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    color: isActive ? 'var(--accent)' : 'rgba(221, 227, 232, 0.8)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    background: isActive ? 'rgba(234, 170, 0, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(234, 170, 0, 0.35)' : '1px solid transparent'
                  }}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>

          {/* Right Action Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* User's Dedicated Authorized Portal */}
                {userPortal && (
                  <Link
                    href={userPortal.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(234, 170, 0, 0.15)',
                      border: '1px solid rgba(234, 170, 0, 0.4)',
                      color: 'var(--accent)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      padding: '0.4rem 0.85rem',
                      borderRadius: 8,
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>{userPortal.icon}</span>
                    <span>{userPortal.label}</span>
                  </Link>
                )}

                {/* Admin-only Switcher for System Inspection */}
                {user.role === 'admin' && (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: '#F59E0B',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        padding: '0.35rem 0.65rem',
                        borderRadius: 6,
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        background: 'rgba(245, 158, 11, 0.1)',
                        cursor: 'pointer'
                      }}
                      title="Admin Tool: Switch persona view"
                    >
                      <span>🛡️ Admin Tools ▼</span>
                    </button>

                    {adminDropdownOpen && (
                      <div
                        onMouseLeave={() => setAdminDropdownOpen(false)}
                        style={{
                          position: 'absolute',
                          top: '120%',
                          right: 0,
                          width: 280,
                          background: '#2A0B26',
                          border: '1px solid rgba(221, 227, 232, 0.18)',
                          borderRadius: 14,
                          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                          padding: '0.5rem',
                          zIndex: 150
                        }}
                      >
                        <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                          Administrator Persona Switcher
                        </div>
                        {allPortals.map((p) => (
                          <Link
                            key={p.href}
                            href={p.href}
                            onClick={() => setAdminDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.5rem 0.75rem',
                              borderRadius: 8,
                              textDecoration: 'none',
                              color: 'white',
                              transition: 'background 0.2s',
                              background: pathname.startsWith(p.href) ? 'rgba(234, 170, 0, 0.18)' : 'transparent'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = pathname.startsWith(p.href) ? 'rgba(234, 170, 0, 0.18)' : 'transparent')}
                          >
                            <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
                            <div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{p.label}</div>
                              <div style={{ fontSize: '0.7rem', color: '#BAC5CE' }}>{p.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 20,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(221, 227, 232, 0.15)'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.8125rem', fontWeight: 600 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'rgba(234, 170, 0, 0.15)',
                    color: 'var(--accent)'
                  }}>
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn-ghost"
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.75rem'
                  }}
                  title="Sign out of MediSure AI"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* Public / Unauthenticated visitor */
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  href="/auth/login"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    transition: 'all 0.2s',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                >
                  Sign In
                </Link>
                <Link
                  href="/scan"
                  className="btn-accent"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.45rem 1rem'
                  }}
                >
                  🔍 Scan QR
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger"
              aria-label="Toggle menu"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 70,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#1F071D',
          zIndex: 99,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          overflowY: 'auto'
        }}>
          {user ? (
            <div style={{
              padding: '1rem',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '0.5rem'
            }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{user.name}</div>
              <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginTop: 2 }}>
                Role: {user.role}
              </div>
              {userPortal && (
                <Link
                  href={userPortal.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-accent"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem', padding: '0.5rem', fontSize: '0.875rem' }}
                >
                  <span>{userPortal.icon}</span> Go to {userPortal.label}
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-accent"
                style={{ textAlign: 'center', justifyContent: 'center', padding: '0.65rem' }}
              >
                Sign In to Stakeholder Account
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ghost"
                style={{ textAlign: 'center', justifyContent: 'center', padding: '0.65rem' }}
              >
                Register New Organization
              </Link>
            </div>
          )}

          <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase' }}>
            Navigation
          </div>
          {publicNavLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '0.65rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {l.label}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <>
              <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', marginTop: '1rem' }}>
                Administrator Persona Inspection
              </div>
              {allPortals.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.5rem 0'
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </Link>
              ))}
            </>
          )}

          {user && (
            <button
              onClick={() => {
                handleLogout()
                setMobileMenuOpen(false)
              }}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Logout ({user.email})
            </button>
          )}
        </div>
      )}
    </>
  )
}
