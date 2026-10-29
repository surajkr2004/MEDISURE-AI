'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(58, 15, 52, 0.08)',
              border: '1px solid rgba(58, 15, 52, 0.2)',
              borderRadius: 100,
              padding: '0.35rem 1rem',
              marginBottom: '1rem',
              color: 'var(--primary)',
              fontSize: '0.8125rem',
              fontWeight: 600
            }}>
              <span>📜</span> Terms of Use
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Terms & Conditions
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              User agreement governing access to MediSure AI services, APIs, and verification registries.
            </p>
          </div>

          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            
            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing MediSure AI, scanning a QR code, or registering an organization profile, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Verification Disclaimer.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                2. Academic Capstone Context
              </h2>
              <p>
                MediSure AI is operated strictly as an academic research prototype. The platform is provided &quot;as is&quot; without financial warranty, merchantability guarantees, or commercial uptime service level agreements (SLAs).
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                3. Acceptable Use Policy
              </h2>
              <p>
                Users agree not to:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                <li>Submit intentionally falsified counterfeit reports or malicious allegations against legitimate pharmaceutical companies.</li>
                <li>Attempt to brute-force or systematically enumerate private QR verification tokens.</li>
                <li>Impersonate a licensed pharmaceutical manufacturer, government drug inspector, or dispensing chemist.</li>
                <li>Represent MediSure AI verification badges as official Government of India approval.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                4. Organization & Manufacturer Responsibilities
              </h2>
              <p>
                Pharmaceutical entities registering on the portal declare that all submitted Form 25/28 manufacturing licences and product registrations are authentic and legally active under the Drugs and Cosmetics Act of India. Submitting fraudulent licences results in immediate suspension and notification to licensing authorities.
              </p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                5. Limitation of Liability
              </h2>
              <p>
                Under no circumstances shall the student developers, academic supervisors, or hosting providers be liable for direct, indirect, or consequential damages resulting from pharmaceutical consumption, medical decisions, or reliance on verification outputs.
              </p>
            </section>

          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/disclaimer" className="btn-ghost">
              Read Verification Disclaimer &rarr;
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
