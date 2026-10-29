import { NextRequest, NextResponse } from 'next/server'
import { verifyMedicineQR } from '@/lib/verificationEngine'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Return sample or verified result for record ID
    const verification = verifyMedicineQR(id.startsWith('VER-') ? 'MS-QR-MC500-GENUINE-001' : id)
    return NextResponse.json(verification)
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Record not found.' }, { status: 404 })
  }
}
