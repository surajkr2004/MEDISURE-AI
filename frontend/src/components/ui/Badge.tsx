import React from 'react'

export type BadgeVariant =
  | 'verified'
  | 'record_found'
  | 'expired'
  | 'recalled'
  | 'suspicious'
  | 'revoked'
  | 'not_found'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'warning'
  | 'danger'
  | 'info'
  | 'default'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string; border: string; icon?: string }> = {
  verified: { bg: 'rgba(16, 185, 129, 0.1)', text: '#065f46', border: 'rgba(16, 185, 129, 0.3)', icon: '✓' },
  record_found: { bg: 'rgba(16, 185, 129, 0.1)', text: '#065f46', border: 'rgba(16, 185, 129, 0.3)', icon: '✓' },
  expired: { bg: 'rgba(239, 68, 68, 0.1)', text: '#991b1b', border: 'rgba(239, 68, 68, 0.3)', icon: '⏰' },
  recalled: { bg: 'rgba(220, 38, 38, 0.15)', text: '#7f1d1d', border: 'rgba(220, 38, 38, 0.4)', icon: '🚨' },
  suspicious: { bg: 'rgba(245, 158, 11, 0.12)', text: '#92400e', border: 'rgba(245, 158, 11, 0.35)', icon: '⚠️' },
  revoked: { bg: 'rgba(153, 27, 27, 0.12)', text: '#7f1d1d', border: 'rgba(153, 27, 27, 0.35)', icon: '🚫' },
  not_found: { bg: 'rgba(221, 227, 232, 0.35)', text: '#3A0F34', border: 'rgba(58, 15, 52, 0.25)', icon: '✕' },
  pending: { bg: 'rgba(217, 119, 6, 0.1)', text: '#b45309', border: 'rgba(217, 119, 6, 0.25)', icon: '⏳' },
  approved: { bg: 'rgba(16, 185, 129, 0.1)', text: '#047857', border: 'rgba(16, 185, 129, 0.3)', icon: '✓' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#b91c1c', border: 'rgba(239, 68, 68, 0.25)', icon: '✕' },
  warning: { bg: 'rgba(245, 158, 11, 0.1)', text: '#b45309', border: 'rgba(245, 158, 11, 0.3)', icon: '⚠' },
  danger: { bg: 'rgba(239, 68, 68, 0.15)', text: '#991b1b', border: 'rgba(239, 68, 68, 0.35)', icon: '🛑' },
  info: { bg: 'rgba(58, 15, 52, 0.08)', text: '#3A0F34', border: 'rgba(58, 15, 52, 0.25)', icon: 'ℹ' },
  default: { bg: 'rgba(58, 15, 52, 0.05)', text: '#523E50', border: 'rgba(58, 15, 52, 0.12)' }
}

export function Badge({ children, variant = 'default', className = '', size = 'md' }: BadgeProps) {
  const config = VARIANT_STYLES[variant] || VARIANT_STYLES.default

  const sizeStyles = {
    sm: { padding: '0.15rem 0.5rem', fontSize: '0.75rem' },
    md: { padding: '0.25rem 0.65rem', fontSize: '0.8125rem' },
    lg: { padding: '0.4rem 0.9rem', fontSize: '0.875rem' }
  }[size]

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        borderRadius: 9999,
        fontWeight: 600,
        lineHeight: 1,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
        ...sizeStyles
      }}
    >
      {config.icon && <span style={{ fontSize: '0.85em' }}>{config.icon}</span>}
      <span>{children}</span>
    </span>
  )
}
