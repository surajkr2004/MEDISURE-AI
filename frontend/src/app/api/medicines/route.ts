import { NextRequest, NextResponse } from 'next/server'
import { DEMO_MEDICINES } from '@/lib/demoData'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.toLowerCase()

  let list = DEMO_MEDICINES
  if (search) {
    list = list.filter(
      (m) =>
        m.brand_name.toLowerCase().includes(search) ||
        m.generic_name.toLowerCase().includes(search) ||
        m.product_code.toLowerCase().includes(search) ||
        m.category.toLowerCase().includes(search)
    )
  }

  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newMed = {
      id: `med-${Date.now()}`,
      organization_id: body.organization_id || 'a0000001-0000-0000-0000-000000000001',
      organization_name: body.organization_name || 'Micro Labs Limited',
      brand_name: body.brand_name || 'New Medicine',
      generic_name: body.generic_name || 'Generic Compound',
      product_code: body.product_code || `PRD-${Date.now().toString().slice(-6)}`,
      composition: body.composition || 'Active Pharmaceutical Ingredient',
      strength: body.strength || '500 mg',
      dosage_form: body.dosage_form || 'Tablet',
      packaging_desc: body.packaging_desc || 'Blister Pack of 10',
      category: body.category || 'General Therapeutics',
      status: 'active' as const,
      regulatory_approval_ref: body.regulatory_approval_ref || 'CDSCO/APP/PENDING'
    }

    DEMO_MEDICINES.push(newMed)
    return NextResponse.json(newMed, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Failed to create medicine.' }, { status: 400 })
  }
}
