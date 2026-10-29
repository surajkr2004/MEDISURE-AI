import { NextRequest, NextResponse } from 'next/server'
import { DEMO_REGULATORY_NOTICES } from '@/lib/demoData'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const typeFilter = searchParams.get('type')
  const search = searchParams.get('search')?.toLowerCase()

  let notices = DEMO_REGULATORY_NOTICES
  if (typeFilter && typeFilter !== 'all') {
    notices = notices.filter((n) => n.notice_type === typeFilter)
  }
  if (search) {
    notices = notices.filter(
      (n) =>
        n.title.toLowerCase().includes(search) ||
        n.affected_brand.toLowerCase().includes(search) ||
        n.affected_generic.toLowerCase().includes(search) ||
        n.notice_reference.toLowerCase().includes(search) ||
        n.summary.toLowerCase().includes(search)
    )
  }

  return NextResponse.json(notices)
}
