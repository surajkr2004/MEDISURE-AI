'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { Batch, Medicine } from '@/lib/demoData'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

interface QRCodeModalProps {
  batch: Batch
  medicine?: Medicine
  onClose: () => void
}

export function QRCodeModal({ batch, medicine, onClose }: QRCodeModalProps) {
  const [payloadType, setPayloadType] = useState<'url' | 'json' | 'token'>('url')
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  // Construct payloads
  const getPayload = (): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://medisure.ai'
    if (payloadType === 'url') {
      return `${origin}/scan?code=${encodeURIComponent(batch.qr_token)}`
    }
    if (payloadType === 'json') {
      return JSON.stringify({
        product_id: medicine?.product_code || batch.medicine_name,
        batch: batch.batch_number,
        token: batch.qr_token,
        mfg: batch.manufacturing_date,
        exp: batch.expiry_date
      }, null, 2)
    }
    return batch.qr_token
  }

  const payload = getPayload()

  useEffect(() => {
    let isMounted = true

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#1F071D',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('QR generation error:', err)
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [payload])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = `QR_${batch.medicine_name.replace(/\s+/g, '_')}_${batch.batch_number}.png`
    link.href = qrDataUrl
    link.click()
    toast.success('QR Code image downloaded successfully!')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(payload)
    toast.success('Payload copied to clipboard!')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 3, 14, 0.75)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        maxWidth: 540,
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid var(--border)',
        padding: '1.75rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📱</span>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', margin: 0, fontWeight: 800 }}>
                Verifiable QR Code Generator
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              CDSCO Rule 96 Compliant 2D Data Matrix / QR Code
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0.25rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Payload Format Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'var(--bg-base)',
          padding: '0.3rem',
          borderRadius: 10,
          marginBottom: '1.25rem'
        }}>
          {[
            { key: 'url', label: '🌐 Direct Verification URL' },
            { key: 'json', label: '📄 GS1 / CDSCO JSON' },
            { key: 'token', label: '🔑 Security Token' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setLoading(true)
                setPayloadType(tab.key as 'url' | 'json' | 'token')
              }}
              style={{
                flex: 1,
                padding: '0.5rem 0.65rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                background: payloadType === tab.key ? 'var(--primary)' : 'transparent',
                color: payloadType === tab.key ? 'white' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Packaging Preview Card */}
        <div style={{
          background: 'white',
          border: '2px solid var(--border)',
          borderRadius: 16,
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Label Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              MEDISURE AI SECURE PACKAGING
            </span>
            <Badge size="sm" variant={batch.is_recalled ? 'recalled' : batch.status === 'expired' ? 'expired' : 'verified'}>
              {batch.is_recalled ? 'Recalled' : batch.status.toUpperCase()}
            </Badge>
          </div>

          {/* QR Image */}
          <div style={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading || !qrDataUrl ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="loader" style={{ margin: '0 auto 0.5rem' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generating QR...</span>
              </div>
            ) : (
              <img
                src={qrDataUrl}
                alt="Medicine QR Code"
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: 12,
                  display: 'block',
                  margin: '0 auto',
                  border: '1px solid var(--border)',
                }}
              />
            )}
          </div>

          {/* Product & Batch Specs */}
          <div style={{ marginTop: '0.75rem', textAlign: 'left', background: 'var(--bg-base)', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Product:</span>
              <strong style={{ color: 'var(--primary-dark)' }}>{batch.medicine_name}</strong>
            </div>
            {medicine && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Generic Salt:</span>
                <span style={{ fontWeight: 600 }}>{medicine.generic_name} ({medicine.strength})</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Batch Number:</span>
              <strong style={{ fontFamily: 'monospace' }}>{batch.batch_number}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Expiry Date:</span>
              <span style={{ fontWeight: 600, color: batch.status === 'expired' ? 'var(--danger)' : 'var(--text-primary)' }}>
                {batch.expiry_date}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px dashed var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cryptographic Token:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--accent-dark)' }}>
                {batch.qr_token}
              </span>
            </div>
          </div>
        </div>

        {/* Encoded Payload Display */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Encoded Payload Content
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📋 Copy
            </button>
          </div>
          <pre style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '0.65rem',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            maxHeight: 90,
            overflowY: 'auto',
            margin: 0,
            color: 'var(--text-primary)'
          }}>
            {payload}
          </pre>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
          <button
            onClick={handleDownload}
            className="btn-primary"
            style={{ fontSize: '0.8125rem', padding: '0.65rem', justifyContent: 'center' }}
          >
            💾 Download PNG
          </button>
          <button
            onClick={handlePrint}
            className="btn-ghost"
            style={{ fontSize: '0.8125rem', padding: '0.65rem', justifyContent: 'center' }}
          >
            🖨️ Print Label
          </button>
          <Link
            href={`/scan?code=${encodeURIComponent(batch.qr_token)}`}
            target="_blank"
            className="btn-accent"
            style={{ fontSize: '0.8125rem', padding: '0.65rem', justifyContent: 'center', textDecoration: 'none' }}
          >
            🔍 Test Scan ↗
          </Link>
        </div>
      </div>
    </div>
  )
}
