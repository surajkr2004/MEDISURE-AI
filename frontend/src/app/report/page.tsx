'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { reportsApi } from '@/lib/api'
import toast from 'react-hot-toast'

const REASONS = [
  'Suspected counterfeit product',
  'Batch number mismatch',
  'Unusual packaging or labeling',
  'Damaged or tampered packaging',
  'Expired product being sold as valid',
  'QR code does not match product',
  'Side effects inconsistent with genuine product',
  'Other',
]

export default function ReportPage() {
  const [form, setForm] = useState({
    medicine_name: '', manufacturer_name: '', batch_number: '',
    qr_code_data: '', pharmacy_source: '', reason: '',
    purchase_date: '', is_anonymous: false,
  })
  const [loading, setLoading] = useState(false)
  const [reportRef, setReportRef] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.reason) { toast.error('Please select a reason.'); return }
    setLoading(true)
    try {
      const { data } = await reportsApi.create(form)
      setReportRef(data.report_reference || data.report_ref)
      setSuccess(true)
      toast.success('Report submitted successfully!')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to submit report.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Report Submitted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Thank you for reporting. Your submission helps improve medicine safety.
          </p>
          <div style={{
            background: 'var(--bg-base)', borderRadius: 12, padding: '1rem',
            marginBottom: '1.5rem', border: '2px dashed var(--accent)',
          }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Report Reference ID</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{reportRef}</div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Keep this reference ID for your records.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/scan" className="btn-primary">🔍 Scan Another</Link>
            <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 80 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🚩 Report Suspicious Medicine</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Report a potentially counterfeit, expired, or suspicious medicine. You can submit anonymously.
            </p>
          </div>

          {/* Warning */}
          <div style={{
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem',
            display: 'flex', gap: '0.75rem',
          }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div style={{ fontSize: '0.875rem', color: '#7f1d1d', lineHeight: 1.6 }}>
              <strong>If you believe there is an immediate health risk</strong>, contact a healthcare professional, your local pharmacy regulatory authority, or emergency services immediately. This report form is for tracking and investigation purposes.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Medicine Name
                </label>
                <input id="report-medicine" className="input" placeholder="e.g. Augmentin 625 Duo or Dolo 650"
                  value={form.medicine_name} onChange={e => setForm(p => ({ ...p, medicine_name: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Manufacturer
                </label>
                <input id="report-manufacturer" className="input" placeholder="e.g. GlaxoSmithKline or Micro Labs"
                  value={form.manufacturer_name} onChange={e => setForm(p => ({ ...p, manufacturer_name: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Batch Number
                </label>
                <input id="report-batch" className="input" placeholder="e.g. MC500-A102"
                  value={form.batch_number} onChange={e => setForm(p => ({ ...p, batch_number: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Purchase Date
                </label>
                <input id="report-date" className="input" type="date"
                  value={form.purchase_date} onChange={e => setForm(p => ({ ...p, purchase_date: e.target.value }))} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                QR Code Data (if available)
              </label>
              <input id="report-qr" className="input" placeholder="Paste QR code content here"
                value={form.qr_code_data} onChange={e => setForm(p => ({ ...p, qr_code_data: e.target.value }))} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                Pharmacy / Source (optional)
              </label>
              <input id="report-pharmacy" className="input" placeholder="Where did you purchase this medicine?"
                value={form.pharmacy_source} onChange={e => setForm(p => ({ ...p, pharmacy_source: e.target.value }))} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                Reason for Report <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select id="report-reason" className="input"
                value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}>
                <option value="">Select a reason...</option>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" id="report-anonymous"
                  checked={form.is_anonymous}
                  onChange={e => setForm(p => ({ ...p, is_anonymous: e.target.checked }))}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Submit anonymously</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Your identity will not be associated with this report
                  </div>
                </div>
              </label>
            </div>

            <button id="report-submit" type="submit" className="btn-danger" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '🚩 Submit Report'}
            </button>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
              Reports are submitted to the MediSure AI prototype system for demonstration purposes. This is not a real regulatory reporting system.
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
