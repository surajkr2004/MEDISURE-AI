import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'MediSure AI — Scan. Verify. Stay Safe.',
  description:
    'AI-powered medicine verification assistance using QR scanning, database validation, OCR, and packaging analysis. A prototype educational system.',
  keywords: 'medicine verification, fake medicine, QR scan, drug safety, MediSure AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1F071D',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
