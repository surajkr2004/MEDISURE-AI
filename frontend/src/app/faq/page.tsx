'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface FAQItem {
  q: string
  a: string
  category: 'general' | 'scanning' | 'supply_chain' | 'safety'
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'scanning' | 'supply_chain' | 'safety'>('all')

  const faqs: FAQItem[] = [
    {
      q: 'Does a successful QR scan mean my medicine is 100% genuine and safe?',
      a: 'No. A working QR code simply confirms that a matching record exists in the database and recorded checks have passed. It cannot analyze the physical chemical composition or guarantee that counterfeiters did not replicate legitimate packaging. You should always inspect package seals, check for regulatory recalls, and buy exclusively from licensed dispensaries.',
      category: 'scanning'
    },
    {
      q: 'What do the different verification statuses mean?',
      a: 'MediSure AI uses 8 specific statuses: "Record found" (database match & current checks pass), "Expired" (past validity date), "Recalled" (active regulatory safety recall), "Suspicious" (anomaly rules triggered, like excessive scan volume), "Revoked" (identifier flagged invalid), "Not found" (no record exists), "Unable to verify" (service unreachable), and "Verification incomplete" (some critical checks failed).',
      category: 'scanning'
    },
    {
      q: 'Is MediSure AI an official government service of India?',
      a: 'No. MediSure AI is a student Problem-Based Learning (PBL) prototype and academic engineering project. It indexes publicly available regulatory notices from the CDSCO and State Drug Controllers for demonstration, but does not represent or substitute official government certification.',
      category: 'general'
    },
    {
      q: 'How does the supply chain audit ledger detect tampering?',
      a: 'Each sequential custody handoff (Manufacturer → Distributor → Wholesaler → Pharmacy) generates a cryptographic event containing a SHA-256 hash that encapsulates the prior event\'s hash and current details. If an actor attempts to delete, reorder, or alter an event, the hash chain breaks immediately, alerting the system to a custody integrity failure.',
      category: 'supply_chain'
    },
    {
      q: 'How do manufacturers register their products on MediSure AI?',
      a: 'Pharmaceutical companies submit legal entity details, Form 25 manufacturing licence numbers, and issuing authority references through the Company Portal. Accounts start in "Pending Review" and must be verified by an authorized system administrator before batches or QR codes can be issued.',
      category: 'supply_chain'
    },
    {
      q: 'What should I do if a medicine I scanned shows "Recalled" or "Suspicious"?',
      a: 'Immediately quarantine the medicine and do not consume it. Return it to the licensed chemist from whom it was purchased and consult your prescribing healthcare provider for safe replacement. You can also file a report on MediSure AI to document the batch incident.',
      category: 'safety'
    },
    {
      q: 'Can ordinary consumers file reports anonymously?',
      a: 'Yes. Our Counterfeit Reporting form allows anonymous submissions. Consumers can upload package photos, list the dispensary where the medicine was bought, and state the issue without providing personal contact information.',
      category: 'safety'
    }
  ]

  const filteredFaqs = activeTab === 'all' ? faqs : faqs.filter((f) => f.category === activeTab)

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
              <span>❓</span> Help Center & FAQs
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Frequently Asked Questions
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Find clear answers regarding medicine verification statuses, supply chain integrity, and patient safety protocols.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Questions' },
              { key: 'scanning', label: 'QR Scanning & Verification' },
              { key: 'supply_chain', label: 'Supply Chain & Ledger' },
              { key: 'safety', label: 'Safety & Reporting' },
              { key: 'general', label: 'General & Governance' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 9999,
                  border: '1px solid',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: activeTab === t.key ? 'var(--primary)' : 'var(--border)',
                  background: activeTab === t.key ? 'var(--primary)' : 'white',
                  color: activeTab === t.key ? 'white' : 'var(--text-secondary)'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={faq.q}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    borderColor: isOpen ? 'var(--accent)' : 'var(--border)'
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: isOpen ? 'rgba(234, 170, 0, 0.05)' : 'white',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-dark)', paddingRight: '1rem' }}>
                      {faq.q}
                    </span>
                    <span style={{ fontSize: '1.25rem', color: 'var(--accent-dark)', fontWeight: 700, flexShrink: 0 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', background: 'rgba(234, 170, 0, 0.05)', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Contact Box */}
          <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(58, 15, 52, 0.04), rgba(234, 170, 0, 0.06))' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Have more questions or need help?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
              Reach out to our project team for technical documentation or submit a feedback inquiry.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-primary">
                Contact MediSure Team
              </Link>
              <Link href="/scan" className="btn-accent">
                Try QR Scanner
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
