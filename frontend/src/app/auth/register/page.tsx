'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

const ROLE_OPTIONS = [
  { value: 'consumer', label: '👤 Consumer / Patient (Scan Verification)', target: '/dashboard' },
  { value: 'pharmacy', label: '💊 Retail Chemist / Pharmacy Dispensary', target: '/pharmacy' },
  { value: 'wholesaler', label: '📦 Wholesaler / Stockist Partner', target: '/wholesaler' },
  { value: 'distributor', label: '🚚 Logistics & Cold-Chain Distributor', target: '/distributor' },
  { value: 'manufacturer', label: '🏭 Pharmaceutical Manufacturer (Form 25/28)', target: '/company' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'consumer',
    organization: '',
    password: '',
    confirm: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.role)
      toast.success(`Account registered as ${form.role.toUpperCase()}! Welcome to MediSure AI.`)
      const selected = ROLE_OPTIONS.find((r) => r.value === form.role)
      router.push(selected ? selected.target : '/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Registration failed.')
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
      <div style={{ width: '100%', maxWidth: 480 }}>
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
            Register accredited stakeholder account
          </p>
        </div>

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
              <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                Full Name / Responsible Officer
              </label>
              <input
                id="reg-name"
                type="text"
                required
                className="input"
                placeholder="e.g. Dr. Ramesh Sharma"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                Official Work Email
              </label>
              <input
                id="reg-email"
                type="email"
                required
                className="input"
                placeholder="officer@organization.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                Stakeholder Accreditation Role
              </label>
              <select
                id="reg-role"
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="input"
                style={{ background: '#2A0B26', borderColor: 'rgba(221, 227, 232, 0.2)', color: 'white', cursor: 'pointer' }}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                Password (min 8 characters)
              </label>
              <input
                id="reg-password"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'white' }}
              />
            </div>

            <button
              id="reg-submit"
              type="submit"
              className="btn-accent"
              disabled={loading}
              style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem', fontWeight: 700 }}
            >
              {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Register & Access Portal →'}
            </button>
          </form>

          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.875rem', marginTop: '1.5rem', marginBottom: 0 }}>
            Already have an accredited account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
