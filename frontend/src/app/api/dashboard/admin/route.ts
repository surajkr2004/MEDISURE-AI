import { NextResponse } from 'next/server'
import { DEMO_MEDICINES, DEMO_REPORTS, DEMO_ORGANIZATIONS } from '@/lib/demoData'

export async function GET() {
  return NextResponse.json({
    total_scans: 1240,
    verified: 980,
    suspicious: 140,
    expired: 80,
    unverified: 40,
    total_medicines: DEMO_MEDICINES.length,
    total_manufacturers: DEMO_ORGANIZATIONS.filter((o) => o.org_type === 'manufacturer').length,
    total_reports: DEMO_REPORTS.length,
    pending_reports: DEMO_REPORTS.filter((r) => r.status === 'pending').length,
    monthly_trends: [
      { month: 'Nov', verified: 120, suspicious: 12, expired: 8 },
      { month: 'Dec', verified: 150, suspicious: 18, expired: 10 },
      { month: 'Jan', verified: 180, suspicious: 15, expired: 7 },
      { month: 'Feb', verified: 210, suspicious: 24, expired: 12 },
      { month: 'Mar', verified: 260, suspicious: 32, expired: 15 },
      { month: 'Apr', verified: 310, suspicious: 39, expired: 18 }
    ],
    risk_distribution: {
      low: 980,
      medium: 180,
      high: 80
    },
    recent_scans: [
      {
        id: 101,
        medicine: { medicine_name: 'Shelcal 500' },
        batch: { batch_number: 'SHELCAL-REP01' },
        result: 'suspicious',
        risk_level: 'high',
        scan_timestamp: new Date().toISOString()
      },
      {
        id: 102,
        medicine: { medicine_name: 'Dolo 650' },
        batch: { batch_number: 'DOLO650-B25081' },
        result: 'verified',
        risk_level: 'low',
        scan_timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 103,
        medicine: { medicine_name: 'Telma 40' },
        batch: { batch_number: 'TELMA-REC26' },
        result: 'recalled',
        risk_level: 'high',
        scan_timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ],
    top_flagged: [
      { name: 'Shelcal 500', count: 184 },
      { name: 'Telma 40', count: 31 },
      { name: 'Pan-D Capsules', count: 19 }
    ]
  })
}
