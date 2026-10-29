import React from 'react'

interface AlertProps {
  title?: string
  children: React.ReactNode
  variant?: 'info' | 'warning' | 'danger' | 'success'
  className?: string
  icon?: React.ReactNode
}

export function Alert({ title, children, variant = 'info', className = '', icon }: AlertProps) {
  const styles = {
    info: {
      bg: 'rgba(58, 15, 52, 0.06)',
      border: 'rgba(58, 15, 52, 0.25)',
      text: '#3A0F34',
      defaultIcon: 'ℹ️'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.35)',
      text: '#92400e',
      defaultIcon: '⚠️'
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.35)',
      text: '#991b1b',
      defaultIcon: '🚨'
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#065f46',
      defaultIcon: '✅'
    }
  }[variant]

  return (
    <div
      className={className}
      role="alert"
      style={{
        display: 'flex',
        gap: '0.85rem',
        padding: '1rem 1.25rem',
        borderRadius: 12,
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
        fontSize: '0.875rem',
        lineHeight: 1.6
      }}
    >
      <div style={{ fontSize: '1.25rem', flexShrink: 0 }}>{icon || styles.defaultIcon}</div>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  )
}
