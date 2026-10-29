import { NextRequest, NextResponse } from 'next/server'

const DEMO_USERS: Record<string, any> = {
  'admin@medisure.ai': { id: 1, name: 'Dr. Ramesh Sharma (Admin)', email: 'admin@medisure.ai', role: 'admin' },
  'compliance@microlabs.in': { id: 2, name: 'Dr. Priya Nair (Micro Labs QA)', email: 'compliance@microlabs.in', role: 'manufacturer' },
  'manufacturer@sunhealth.demo': { id: 2, name: 'Dr. Priya Nair (Micro Labs QA)', email: 'manufacturer@sunhealth.demo', role: 'manufacturer' },
  'distributor@apexpath.demo': { id: 3, name: 'Vikas Patel (Apex Logistics)', email: 'distributor@apexpath.demo', role: 'distributor' },
  'wholesaler@meditrade.demo': { id: 4, name: 'Anand Kulkarni (MediTrade Wholesale)', email: 'wholesaler@meditrade.demo', role: 'wholesaler' },
  'pharmacy@apollohealth.demo': { id: 5, name: 'Suman Roy (ApolloCare Chemist)', email: 'pharmacy@apollohealth.demo', role: 'pharmacy' },
  'consumer@patient.demo': { id: 6, name: 'Aarav Mehta (Consumer)', email: 'consumer@patient.demo', role: 'consumer' },
  'reviewer@cdsco-audit.demo': { id: 7, name: 'Kavita Joshi (Regulatory Reviewer)', email: 'reviewer@cdsco-audit.demo', role: 'reviewer' },
  'user@medisure.ai': { id: 8, name: 'Demo Patient', email: 'user@medisure.ai', role: 'consumer' }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = body.email?.toLowerCase().trim()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json({ detail: 'Email and password are required.' }, { status: 400 })
    }

    const matchedUser = DEMO_USERS[email] || {
      id: Math.floor(Math.random() * 1000) + 10,
      name: email.split('@')[0],
      email,
      role: 'consumer'
    }

    const token = `demo-token-${Buffer.from(JSON.stringify(matchedUser)).toString('base64')}`

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        created_at: new Date().toISOString()
      }
    })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Login failed.' }, { status: 500 })
  }
}
