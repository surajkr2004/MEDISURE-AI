import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: string | React.ReactNode
  color?: string
  subtext?: string
  trend?: string
}

export function StatCard({ label, value, icon, color = 'var(--primary)', subtext, trend }: StatCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              background: 'rgba(0, 0, 0, 0.04)'
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1.1, fontFamily: 'Space Grotesk, sans-serif' }}>
        {value}
      </div>

      {(subtext || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {trend && <span style={{ fontWeight: 700, color: 'var(--accent-dark)' }}>{trend}</span>}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  )
}
