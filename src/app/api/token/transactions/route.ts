import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/transactions?symbol=XXX - Get user's transactions for a specific token
 */
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, transactions: [] })
    }

    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json({ success: false, error: 'Token symbol is required' }, { status: 400 })
    }

    const purchases = await prisma.tokenPurchase.findMany({
      where: { 
        userId: session.user.id,
        tokenId: symbol,
        status: 'completed'
      },
      orderBy: { createdAt: 'desc' },
    })

    const transactions = purchases.map((p) => ({
      id: p.id,
      date: p.createdAt.toISOString(),
      type: 'buy' as const,
      currency: 'NGN' as const,
      amount: Number(p.tokensReceived),
      pricePerToken: p.nairaAmountSpent / Number(p.tokensReceived),
      totalAmount: p.nairaAmountSpent,
      userId: p.userId,
    }))

    return NextResponse.json({ success: true, transactions })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get transactions' }, { status: 500 })
  }
}
