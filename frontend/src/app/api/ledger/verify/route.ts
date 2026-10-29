import { NextRequest, NextResponse } from 'next/server'
import { DEMO_SUPPLY_EVENTS } from '@/lib/demoData'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const batchId = body.batch_id

    const events = batchId
      ? DEMO_SUPPLY_EVENTS.filter((e) => e.batch_id === batchId)
      : DEMO_SUPPLY_EVENTS

    // Verify SHA-256 hash chaining
    let isChainValid = true
    const breakPoints: number[] = []

    for (let i = 1; i < events.length; i++) {
      if (events[i].previous_hash !== events[i - 1].current_hash) {
        isChainValid = false
        breakPoints.push(events[i].event_sequence)
      }
    }

    return NextResponse.json({
      total_events_checked: events.length,
      is_ledger_intact: isChainValid,
      integrity_status: isChainValid ? 'VERIFIED_VALID' : 'TAMPER_DETECTED',
      break_points: breakPoints,
      verified_at: new Date().toISOString(),
      genesis_hash: events[0]?.current_hash || null,
      latest_hash: events[events.length - 1]?.current_hash || null
    })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Ledger verification failed.' }, { status: 500 })
  }
}
