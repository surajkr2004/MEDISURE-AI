import { NextRequest, NextResponse } from 'next/server'
import { DEMO_REPORTS, CounterfeitReport } from '@/lib/demoData'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const statusFilter = searchParams.get('status_filter')

  let list = DEMO_REPORTS
  if (statusFilter && statusFilter !== 'all') {
    list = list.filter((r) => r.status === statusFilter)
  }

  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const reportRef = `MS-REP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`

    const newReport: CounterfeitReport = {
      id: `rep-${Date.now()}`,
      report_reference: reportRef,
      medicine_name: body.medicine_name || 'Unspecified Medicine',
      batch_number: body.batch_number,
      manufacturer_name: body.manufacturer_name,
      pharmacy_source: body.pharmacy_source,
      reason_category: body.reason_category || body.reason || 'Suspected counterfeit product',
      description: body.description || body.reason || 'User report submitted',
      status: 'pending',
      created_at: new Date().toISOString(),
      is_anonymous: Boolean(body.is_anonymous)
    }

    DEMO_REPORTS.unshift(newReport)
    return NextResponse.json(newReport, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Failed to submit report.' }, { status: 400 })
  }
}
