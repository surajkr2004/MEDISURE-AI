import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  if (token.startsWith('demo-token-')) {
    try {
      const decoded = JSON.parse(Buffer.from(token.replace('demo-token-', ''), 'base64').toString('utf8'))
      return NextResponse.json(decoded)
    } catch {
      return NextResponse.json({ detail: 'Invalid token' }, { status: 401 })
    }
  }

  return NextResponse.json({
    id: 1,
    name: 'Dr. Ramesh Sharma',
    email: 'admin@medisure.ai',
    role: 'admin',
    created_at: new Date().toISOString()
  })
}
