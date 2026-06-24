import { NextResponse } from 'next/server'

// GET /api/admin/outbound-ip
// Returns the current outbound IP address of this server
// Use this to find the IP to whitelist with Monnify
export async function GET() {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return NextResponse.json({
      outboundIp: data.ip,
      note: 'This is the current outbound IP. On Vercel this changes on every deployment - not suitable for permanent whitelisting.',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch IP' }, { status: 500 })
  }
}
