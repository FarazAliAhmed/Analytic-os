// src/app/api/zendesk/token/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateZendeskJWT } from '@/lib/zendesk'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate JWT for the authenticated user
    const token = generateZendeskJWT(
      session.user.id,
      session.user.name || `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim(),
      session.user.email || undefined
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Zendesk token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authentication token' },
      { status: 500 }
    )
  }
}
