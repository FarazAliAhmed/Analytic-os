import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/transactions - Get user's token transactions
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, transactions: [] })
    }

    const purchases = await prisma.tokenPurchase.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    const transactions = purchases.map((p) => ({
      id: p.id,
      date: p.createdAt.toISOString(),
      type: 'buy' as const,
      currency: 'NGN' as const,
      amount: p.tokensReceived,
      pricePerToken: p.nairaAmountSpent / p.tokensReceived,
      totalAmount: p.nairaAmountSpent,
      userId: p.userId,
    }))

    return NextResponse.json({ success: true, transactions })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get transactions' }, { status: 500 })
  }
}
