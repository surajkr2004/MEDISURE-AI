import { NextRequest, NextResponse } from 'next/server'
import { verifyMedicineQR } from '@/lib/verificationEngine'

const SCENARIO_TOKENS: Record<string, string> = {
  verified: 'MS-QR-DOLO650-GENUINE-001',
  augmentin: 'MS-QR-AUG625-GENUINE-002',
  expired: 'MS-QR-PAND-EXPIRED-003',
  recalled: 'MS-QR-TELMA-RECALLED-004',
  mismatch: '{"product_id":"DOLO650","batch":"INVALID-BATCH-999"}',
  anomaly: 'MS-QR-AZITH-ANOMALY-005',
  replay: 'MS-QR-SHELCAL-REPLAYED-006',
  invalid: 'NON-EXISTENT-QR-TOKEN-XYZ'
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ scenario: string }> }
) {
  try {
    const { scenario } = await params
    const token = SCENARIO_TOKENS[scenario] || scenario
    const verification = verifyMedicineQR(token)
    return NextResponse.json(verification)
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Demo scenario execution failed.' }, { status: 500 })
  }
}
