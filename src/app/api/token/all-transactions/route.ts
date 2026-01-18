import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/all-transactions?symbol=XXX - Get all transactions for a specific token
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json({ success: false, error: 'Token symbol is required' }, { status: 400 })
    }

    const purchases = await prisma.tokenPurchase.findMany({
      where: {
        tokenId: symbol,
        status: 'completed'
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 transactions
      include: {
        user: {
          select: { userId: true }
        }
      }
    })

    const transactions = purchases.map((p) => {
      const userId = p.user?.userId || p.userId
      // Format: Show first 8 chars + ... + last 4 chars (e.g., EWonZrNY...keb2)
      const makerDisplay = userId.length > 16 
        ? `${userId.slice(0, 8)}...${userId.slice(-4)}`
        : userId
      
      return {
        id: p.id,
        date: p.createdAt.toISOString(),
        type: 'buy' as const,
        ngn: p.nairaAmountSpent,
        amount: Number(p.tokensReceived),
        price: p.nairaAmountSpent / Number(p.tokensReceived),
        maker: makerDisplay,
      }
    })

    return NextResponse.json({ success: true, transactions })
  } catch (error) {
    console.error('Get all transactions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get transactions' }, { status: 500 })
  }
}
