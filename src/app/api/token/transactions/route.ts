import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/transactions?symbol=XXX - Get user's transactions (buy + sell) for a specific token
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

    // Get user's wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    // Get buy transactions
    const purchases = await prisma.tokenPurchase.findMany({
      where: { 
        userId: session.user.id,
        tokenId: symbol,
        status: 'completed'
      }
    })

    // Get sell transactions
    const sellTransactions = wallet ? await prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        type: 'credit',
        status: 'completed',
        description: {
          contains: `Sold`
        },
        AND: {
          description: {
            contains: symbol
          }
        }
      }
    }) : []

    // Format buy transactions
    const buyTxs = purchases.map((p) => ({
      id: p.id,
      date: p.createdAt.toISOString(),
      type: 'buy' as const,
      currency: 'NGN' as const,
      amount: Number(p.tokensReceived),
      pricePerToken: p.nairaAmountSpent / Number(p.tokensReceived),
      totalAmount: p.nairaAmountSpent,
      userId: p.userId,
    }))

    // Format sell transactions
    const sellTxs = sellTransactions.map((t) => {
      // Extract token amount from description: "Sold X TOKEN tokens"
      const match = t.description.match(/Sold ([\d.]+) /)
      const tokensAmount = match ? parseFloat(match[1]) : 0
      const nairaAmount = t.amount / 100 // Convert from kobo to Naira
      
      return {
        id: t.id,
        date: t.createdAt.toISOString(),
        type: 'sell' as const,
        currency: 'NGN' as const,
        amount: tokensAmount,
        pricePerToken: tokensAmount > 0 ? nairaAmount / tokensAmount : 0,
        totalAmount: nairaAmount,
        userId: session.user.id,
      }
    })

    // Combine and sort by date (newest first)
    const allTransactions = [...buyTxs, ...sellTxs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return NextResponse.json({ success: true, transactions: allTransactions })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get transactions' }, { status: 500 })
  }
}
