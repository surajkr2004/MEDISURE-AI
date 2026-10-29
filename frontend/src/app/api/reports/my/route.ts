import { NextResponse } from 'next/server'
import { DEMO_REPORTS } from '@/lib/demoData'

export async function GET() {
  return NextResponse.json(DEMO_REPORTS)
}

export async function POST(req: Request) {
  const body = await req.json()
  const reportRef = `MS-REP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
  const newReport = {
    id: `rep-${Date.now()}`,
    report_reference: reportRef,
    medicine_name: body.medicine_name || 'Unspecified Medicine',
    batch_number: body.batch_number,
    manufacturer_name: body.manufacturer_name,
    pharmacy_source: body.pharmacy_source,
    reason_category: body.reason_category || body.reason || 'Suspected counterfeit product',
    description: body.description || body.reason || 'User report submitted',
    status: 'pending' as const,
    created_at: new Date().toISOString(),
    is_anonymous: false
  }
  DEMO_REPORTS.unshift(newReport)
  return NextResponse.json(newReport, { status: 201 })
}
