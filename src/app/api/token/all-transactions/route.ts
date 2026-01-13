import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/all-transactions - Get all token transactions (public feed)
 */
export async function GET() {
  try {
    const purchases = await prisma.tokenPurchase.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 transactions
      include: {
        user: {
          select: { userId: true }
        }
      }
    })

    const transactions = purchases.map((p) => ({
      id: p.id,
      date: p.createdAt.toISOString(),
      type: 'buy' as const,
      ngn: p.nairaAmountSpent,
      amount: p.tokensReceived,
      price: p.nairaAmountSpent / p.tokensReceived,
      maker: p.user?.userId?.slice(0, 6) + '...' || p.userId.slice(0, 6) + '...',
    }))

    return NextResponse.json({ success: true, transactions })
  } catch (error) {
    console.error('Get all transactions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get transactions' }, { status: 500 })
  }
}
