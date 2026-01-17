import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/balance?symbol=INV - Get user's token holdings for specific token
 * If no symbol provided, returns all holdings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, holdings: null })
    }

    const { searchParams } = new URL(request.url)
    const tokenSymbol = searchParams.get('symbol')

    if (tokenSymbol) {
      // Get specific token holding
      const holding = await prisma.tokenHolding.findUnique({
        where: {
          userId_tokenId: {
            userId: session.user.id,
            tokenId: tokenSymbol.toUpperCase()
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
    } else {
      // Get all holdings
      const holdings = await prisma.tokenHolding.findMany({
        where: {
          userId: session.user.id,
          quantity: { gt: 0 }
        }
      })

      return NextResponse.json({
        success: true,
        holdings: holdings.map(h => ({
          tokenId: h.tokenId,
          quantity: h.quantity,
          averagePrice: Number(h.averagePrice)
        }))
      })
    }
  } catch (error) {
    console.error('Get token balance error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get balance' }, { status: 500 })
  }
}
