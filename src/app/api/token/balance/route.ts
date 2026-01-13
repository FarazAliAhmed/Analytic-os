import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/balance - Get user's token holdings
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, holdings: null })
    }

    const holding = await prisma.tokenHolding.findUnique({
      where: {
        userId_tokenId: {
          userId: session.user.id,
          tokenId: 'INV'
        }
      }
    })

    return NextResponse.json({
      success: true,
      holdings: holding ? {
        tokenId: holding.tokenId,
        quantity: holding.quantity,
        averagePrice: Number(holding.averagePrice)
      } : null
    })
  } catch (error) {
    console.error('Get token balance error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get balance' }, { status: 500 })
  }
}
