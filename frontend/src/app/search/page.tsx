'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/Badge'
import { DEMO_MEDICINES, DEMO_BATCHES } from '@/lib/demoData'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Analgesic & Antipyretic', 'Cardiovascular / Statin', 'Antibiotic', 'Nutritional Supplement', 'Immunomodulator']

  const filteredMedicines = DEMO_MEDICINES.filter((med) => {
    const matchesQuery =
      med.brand_name.toLowerCase().includes(query.toLowerCase()) ||
      med.generic_name.toLowerCase().includes(query.toLowerCase()) ||
      med.product_code.toLowerCase().includes(query.toLowerCase()) ||
      med.composition.toLowerCase().includes(query.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory
    return matchesQuery && matchesCategory
  })

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
          
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
              <span>🔍</span> Public Registry Search
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Search Medicine Database
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Look up registered pharmaceutical products, registered manufacturer licences, active batches, and regulatory approvals.
            </p>
          </div>

          {/* Search Box */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input"
                placeholder="Search by Brand (e.g., Augmentin, Dolo 650), Generic (e.g., Paracetamol, Amoxicillin), or Code (e.g., DOLO650)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ flex: 1, minWidth: 260, fontSize: '1rem', padding: '0.85rem 1.25rem' }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="btn-ghost"
                  style={{ padding: '0.85rem 1.25rem' }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.5rem' }}>
                Filter Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 9999,
                    border: '1px solid',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border)',
                    background: selectedCategory === cat ? 'var(--primary)' : 'white',
                    color: selectedCategory === cat ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{filteredMedicines.length}</strong> registered medicine records
            </div>
            <Link href="/scan" className="btn-accent btn-sm">
              📷 Scan Package QR
            </Link>
          </div>

          {/* Medicines Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredMedicines.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>No medicines matched your search</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto 1.5rem' }}>
                  Try searching for brand names like <em>Augmentin</em>, <em>Dolo 650</em>, <em>Telma 40</em>, or generic names like <em>Paracetamol IP</em> or <em>Amoxicillin</em>.
                </p>
                <button onClick={() => { setQuery(''); setSelectedCategory('all'); }} className="btn-primary">
                  Reset Search Filters
                </button>
              </div>
            ) : (
              filteredMedicines.map((med) => {
                const batches = DEMO_BATCHES.filter((b) => b.medicine_id === med.id)
                return (
                  <div key={med.id} className="card" style={{ padding: '1.5rem', transition: 'transform 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', margin: 0 }}>
                            {med.brand_name}
                          </h2>
                          <Badge variant="verified">Registered</Badge>
                          <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', background: 'var(--bg-base)', padding: '0.2rem 0.5rem', borderRadius: 6, color: 'var(--text-muted)' }}>
                            {med.product_code}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
                          <strong>Generic:</strong> {med.generic_name} &bull; <strong>Strength:</strong> {med.strength} ({med.dosage_form})
                        </p>
                      </div>

                      <Link
                        href={`/scan?demo=verified`}
                        className="btn-ghost btn-sm"
                        style={{ fontSize: '0.8125rem' }}
                      >
                        Inspect Verification Result &rarr;
                      </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: 'var(--bg-base)', padding: '1rem', borderRadius: 12, marginBottom: '1rem', fontSize: '0.8125rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Manufacturer</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{med.organization_name}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Composition</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{med.composition}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Packaging</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{med.packaging_desc}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Regulatory Ref</div>
                        <div style={{ fontWeight: 600, color: 'var(--accent-dark)' }}>{med.regulatory_approval_ref}</div>
                      </div>
                    </div>

                    {/* Associated Batches */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        Recorded Production Batches ({batches.length})
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {batches.map((b) => (
                          <div
                            key={b.id}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: 8,
                              background: 'white',
                              border: '1px solid var(--border)',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.batch_number}</span>
                            <Badge
                              size="sm"
                              variant={b.is_recalled ? 'recalled' : b.status === 'expired' ? 'expired' : 'verified'}
                            >
                              {b.is_recalled ? 'Recalled' : b.status === 'expired' ? 'Expired' : 'Active'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
