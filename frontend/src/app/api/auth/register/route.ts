import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ detail: 'Name, email, and password are required.' }, { status: 400 })
    }

    const validRoles = ['consumer', 'pharmacy', 'wholesaler', 'distributor', 'manufacturer', 'reviewer', 'admin']
    const assignedRole = validRoles.includes(role) ? role : 'consumer'

    const newUser = {
      id: Math.floor(Math.random() * 1000) + 20,
      name,
      email,
      role: assignedRole,
      created_at: new Date().toISOString()
    }

    const token = `demo-token-${Buffer.from(JSON.stringify(newUser)).toString('base64')}`

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
      user: newUser
    })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message || 'Registration failed.' }, { status: 500 })
  }
}
