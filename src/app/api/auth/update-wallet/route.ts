import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { walletAddress } = await request.json()

    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Update the session with the wallet address
    // This will be persisted in the JWT token
    // The callback in auth.ts will handle updating the token

    return NextResponse.json({
      success: true,
      walletAddress,
    })
  } catch (error) {
    console.error('Failed to update wallet:', error)
    return NextResponse.json(
      { error: 'Failed to update wallet' },
      { status: 500 }
    )
  }
}
