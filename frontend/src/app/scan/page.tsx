'use client'

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { verifyMedicineQR } from '@/lib/verificationEngine'
import toast from 'react-hot-toast'

const DEMO_SCENARIOS = [
  { key: 'verified', label: '✅ Dolo 650 (Micro Labs)', code: 'DOLO650', desc: 'Valid batch & manufacturer, tamper seals intact' },
  { key: 'augmentin', label: '✅ Augmentin 625 Duo (GSK)', code: 'AUG625DUO', desc: 'Sealed cold-chain & authenticated CoA' },
  { key: 'expired', label: '⏰ Pan-D Expired (Alkem)', code: 'PAND001', desc: 'Batch PAND-24E091 past validity shelf-life' },
  { key: 'recalled', label: '🚨 Telma 40 Recalled (Glenmark)', code: 'TELMA40', desc: 'Active CDSCO Class II dissolution stability recall' },
  { key: 'mismatch', label: '⚠️ Batch Mismatch Anomaly', code: '{"product_id":"DOLO650","batch":"INVALID-999"}', desc: 'QR code data conflicts with database' },
  { key: 'anomaly', label: '🔍 Azithral 500 AI Anomaly', code: 'AZITH500', desc: 'Flagged visual packaging defect' },
  { key: 'replay', label: '🔄 Shelcal 500 Replay Alert', code: 'SHELCAL500', desc: 'Token scanned over 180 times (cloned code alert)' },
  { key: 'invalid', label: '❌ Unregistered Code', code: 'UNKNOWN-TOKEN-999', desc: 'Identifier not found in registry' },
]

function ScanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'camera' | 'upload' | 'manual' | 'demo'>('camera')
  const [manualInput, setManualInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [scannerReady, setScannerReady] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const scannerRef = useRef<any>(null)

  const processVerification = useCallback((rawInput: string) => {
    setLoading(true)
    toast.loading('Analyzing QR provenance & supply chain records...', { id: 'verify' })

    try {
      const result = verifyMedicineQR(rawInput)
      // Store in sessionStorage so verify page has full hydrated record
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`verify_${result.verification_id}`, JSON.stringify(result))
      }
      toast.success('Analysis complete!', { id: 'verify' })
      router.push(`/verify/${result.verification_id}`)
    } catch {
      toast.error('Verification failed to process.', { id: 'verify' })
      setLoading(false)
    }
  }, [router])

  // Auto-run if URL has ?code= or ?demo=
  useEffect(() => {
    const code = searchParams.get('code') || searchParams.get('demo')
    if (code) {
      const timer = setTimeout(() => processVerification(code), 400)
      return () => clearTimeout(timer)
    }
  }, [searchParams, processVerification])

  // Camera initialization
  useEffect(() => {
    if (mode !== 'camera') {
      if (scannerRef.current) {
        try { scannerRef.current.stop() } catch {}
        scannerRef.current = null
      }
      return
    }

    let html5QrCode: any = null

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        html5QrCode = new Html5Qrcode('qr-reader')
        scannerRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText: string) => {
            await html5QrCode.stop()
            processVerification(decodedText)
          },
          () => {}
        )
        setScannerReady(true)
      } catch {
        setCameraError('Camera access unavailable or declined. Please use Image Upload or Manual Entry.')
        setMode('manual')
      }
    }

    initScanner()
    return () => {
      if (html5QrCode) {
        try { html5QrCode.stop() } catch {}
      }
    }
  }, [mode, processVerification])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualInput.trim()) {
      toast.error('Please enter QR text or product code.')
      return
    }
    processVerification(manualInput.trim())
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleAnalyzePhoto = () => {
    if (!selectedFile) {
      toast.error('Please select an image file first.')
      return
    }
    // Simulate OCR extraction from photo
    toast.loading('Extracting text and scanning package label...', { id: 'ocr' })
    setTimeout(() => {
      toast.success('Packaging identified: Augmentin 625 Duo (Batch AUG625-CL2409)', { id: 'ocr' })
      processVerification('AUG625DUO')
    }, 1200)
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
              <span>📷</span> 11-Step Verification Protocol
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
              Scan Medicine Package
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Point your camera at the packaging QR code, upload a photo, or enter the code manually.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.35rem',
            marginBottom: '1.5rem',
            background: 'white',
            padding: '0.35rem',
            borderRadius: 14,
            boxShadow: 'var(--shadow-sm)'
          }}>
            {[
              { key: 'camera', label: '📷 Camera' },
              { key: 'upload', label: '🖼️ Image Upload' },
              { key: 'manual', label: '⌨️ Manual Entry' },
              { key: 'demo', label: '🎓 Demo Scenarios' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key as any)}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  transition: 'all 0.2s',
                  background: mode === tab.key ? 'var(--primary)' : 'transparent',
                  color: mode === tab.key ? 'white' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Camera Mode */}
          {mode === 'camera' && (
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              {cameraError ? (
                <div style={{ padding: '2rem 1rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
                  <h4 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Camera Unavailable</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{cameraError}</p>
                  <button onClick={() => setMode('manual')} className="btn-primary">
                    Switch to Manual Entry
                  </button>
                </div>
              ) : (
                <>
                  <div id="qr-reader" style={{ width: '100%', maxWidth: 380, margin: '0 auto', overflow: 'hidden', borderRadius: 16 }} />
                  {!scannerReady && (
                    <div style={{ padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                      <div className="loader" style={{ margin: '0 auto 1rem' }} />
                      <p style={{ fontSize: '0.875rem' }}>Initializing mobile camera sensor...</p>
                    </div>
                  )}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '1.25rem' }}>
                    Align the QR code within the viewport box. MediSure AI will verify it automatically.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Image Upload Fallback Mode */}
          {mode === 'upload' && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                border: '2px dashed var(--border)',
                borderRadius: 16,
                padding: '2.5rem 1.5rem',
                background: 'var(--bg-base)',
                marginBottom: '1.5rem'
              }}>
                {previewUrl ? (
                  <div>
                    <img
                      src={previewUrl}
                      alt="Uploaded Packaging"
                      style={{ maxHeight: 220, borderRadius: 12, margin: '0 auto 1rem', objectFit: 'contain' }}
                    />
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {selectedFile?.name}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📸</div>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                      Upload Medicine Packaging Photo
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
                      Take a clear photo of your medicine strip or bottle label showing the QR code and printed batch number.
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  id="package-file-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="package-file-upload"
                  className="btn-ghost"
                  style={{ display: 'inline-flex', cursor: 'pointer', padding: '0.65rem 1.5rem' }}
                >
                  {previewUrl ? 'Choose Different Image' : 'Select Photo from Device'}
                </label>
              </div>

              {previewUrl && (
                <button
                  onClick={handleAnalyzePhoto}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                >
                  🔍 Run AI OCR & QR Analysis
                </button>
              )}
            </div>
          )}

          {/* Manual Entry Mode */}
          {mode === 'manual' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Manual Identifier Entry</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Enter the product code, batch number, or JSON text encoded within the QR code.
              </p>
              
              <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  className="input"
                  rows={4}
                  placeholder={`Enter code or JSON payload\nExample: MC500001\nOr: {"product_id":"MC500001","batch":"MC500-A102"}`}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                  {loading ? 'Verifying...' : '🔍 Verify Medicine'}
                </button>
              </form>

              {/* Demo quick product codes */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Quick Sample Codes:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['DOLO650', 'AUG625DUO', 'PAND001', 'TELMA40', 'AZITH500', 'SHELCAL500', 'MONOCEF1G', 'GLYCOM500'].map((code) => (
                    <button
                      key={code}
                      onClick={() => setManualInput(code)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-base)',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Demo Scenario Mode */}
          {mode === 'demo' && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                background: 'rgba(58, 15, 52, 0.06)',
                border: '1px solid rgba(58, 15, 52, 0.2)',
                borderRadius: 12,
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🎓</span>
                <div style={{ fontSize: '0.8125rem', color: 'var(--primary-dark)', lineHeight: 1.5 }}>
                  <strong>PBL Academic Evaluation Scenarios:</strong> Click any scenario below to immediately trigger full verification analysis and view distinct system behaviors across all 8 status classifications.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DEMO_SCENARIOS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => processVerification(s.code)}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      background: 'var(--bg-base)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.background = 'var(--bg-base)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--primary-dark)' }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {s.desc}
                      </div>
                    </div>
                    <span style={{ color: 'var(--accent)', fontSize: '1.25rem', fontWeight: 700 }}>&rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(31, 7, 29, 0.85)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: 'white',
                borderRadius: 20,
                padding: '2.5rem',
                textAlign: 'center',
                maxWidth: 320,
                width: '90%'
              }}>
                <div className="loader" style={{ margin: '0 auto 1.25rem' }} />
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Running Protocol...</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: 0 }}>
                  Executing 11 verification checks against CDSCO notices & SHA-256 ledger
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" /></div>}>
      <ScanContent />
    </Suspense>
  )
}
