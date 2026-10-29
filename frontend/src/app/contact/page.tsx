'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Your message has been sent successfully!')
    }, 600)
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(234, 170, 0, 0.12)',
              border: '1px solid rgba(234, 170, 0, 0.35)',
              borderRadius: 100,
              padding: '0.35rem 1rem',
              marginBottom: '1rem',
              color: 'var(--accent-dark)',
              fontSize: '0.8125rem',
              fontWeight: 600
            }}>
              <span>📬</span> Project Contact & Feedback
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Get in Touch with MediSure AI
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Have questions regarding the prototype architecture, data integrations, or wish to submit feedback? Send us a message.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Left Contact Details */}
            <div>
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Academic Project Office</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  MediSure AI is a capstone Problem-Based Learning (PBL) research prototype engineered to enhance pharmaceutical supply-chain traceability in India.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>📍</span>
                    <div>
                      <strong>Location</strong>
                      <div style={{ color: 'var(--text-muted)' }}>Mumbai / Pune Technology Corridor, Maharashtra, India</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>📧</span>
                    <div>
                      <strong>Project Email</strong>
                      <div style={{ color: 'var(--text-muted)' }}>team@medisure.ai (PBL Prototype)</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>⚖️</span>
                    <div>
                      <strong>Regulatory Redressal</strong>
                      <div style={{ color: 'var(--text-muted)' }}>For actual drug grievances, file via CDSCO CPGRAMS portal</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Box */}
              <div className="card" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
                <div style={{ color: '#991b1b', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🚨</span> Medical Emergencies
                </div>
                <p style={{ color: '#7f1d1d', fontSize: '0.8125rem', lineHeight: 1.6, margin: 0 }}>
                  Do not use this contact form to report immediate life-threatening adverse reactions. Dial <strong>112</strong> immediately.
                </p>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="card" style={{ padding: '2rem' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Message Dispatched</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                    Thank you, <strong>{form.name}</strong>. Your message has been logged in our demonstration feedback queue.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary">
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ color: 'var(--primary)', margin: 0 }}>Send a Message</h3>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="e.g. Dr. Rajesh Kumar"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="input"
                      placeholder="e.g. rajesh@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Topic Category
                    </label>
                    <select
                      className="input"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="PBL Academic Feedback">PBL Academic Feedback</option>
                      <option value="Supply Chain Integration">Supply Chain / Manufacturer Onboarding</option>
                      <option value="Bug / Error Report">Bug / Anomaly Report</option>
                      <option value="Regulatory Data Inquiry">Regulatory Data Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="input"
                      placeholder="Describe your inquiry or feedback in detail..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                    {loading ? 'Transmitting...' : '✉️ Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
