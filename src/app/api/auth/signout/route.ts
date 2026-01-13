import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ success: true })
    }

    // Sign out from NextAuth
    // The actual session cleanup is handled by the auth handler
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sign-out error:', error)
    return NextResponse.json({ error: 'Sign-out failed' }, { status: 500 })
  }
}
