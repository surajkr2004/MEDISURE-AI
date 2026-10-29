import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    total_scans: 48,
    verified: 38,
    suspicious: 6,
    expired: 3,
    unverified: 1,
    recent_scans: [
      {
        id: 1,
        medicine: { medicine_name: 'Augmentin 625 Duo' },
        batch: { batch_number: 'AUG625-CL2409' },
        result: 'verified',
        risk_level: 'low',
        risk_score: 8,
        scan_timestamp: new Date().toISOString()
      },
      {
        id: 2,
        medicine: { medicine_name: 'Telma 40' },
        batch: { batch_number: 'TELMA-REC26' },
        result: 'suspicious',
        risk_level: 'high',
        risk_score: 85,
        scan_timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 3,
        medicine: { medicine_name: 'Pan-D Capsules' },
        batch: { batch_number: 'PAND-24E091' },
        result: 'expired',
        risk_level: 'medium',
        risk_score: 62,
        scan_timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ]
  })
}
