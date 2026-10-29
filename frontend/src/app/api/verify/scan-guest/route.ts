import { NextRequest, NextResponse } from 'next/server'
import { verifyMedicineQR } from '@/lib/verificationEngine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const qrData = body.qr_data || body.token || body.product_id

    if (!qrData) {
      return NextResponse.json({ detail: 'QR data or product identifier is required.' }, { status: 400 })
    }

    const verification = verifyMedicineQR(qrData)
    return NextResponse.json(verification)
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Verification failed.' }, { status: 500 })
  }
}
