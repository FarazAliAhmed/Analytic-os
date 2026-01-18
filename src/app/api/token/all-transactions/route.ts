import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/all-transactions?symbol=XXX - Get all transactions (buy + sell) for a specific token
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json({ success: false, error: 'Token symbol is required' }, { status: 400 })
    }

    // Get buy transactions
    const purchases = await prisma.tokenPurchase.findMany({
      where: {
        tokenId: symbol,
        status: 'completed'
      },
      include: {
        user: {
          select: { userId: true }
        }
      }
    })

    // Get sell transactions from Transaction table
    const sellTransactions = await prisma.transaction.findMany({
      where: {
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
      },
      include: {
        wallet: {
          select: {
            user: {
              select: { userId: true }
            }
          }
        }
      }
    })

    // Format buy transactions
    const buyTxs = purchases.map((p) => {
      const userId = p.user?.userId || p.userId
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

    // Format sell transactions
    const sellTxs = sellTransactions.map((t) => {
      // Extract token amount from description: "Sold X TOKEN tokens"
      const match = t.description.match(/Sold ([\d.]+) /)
      const tokensAmount = match ? parseFloat(match[1]) : 0
      const nairaAmount = t.amount / 100 // Convert from kobo to Naira
      
      const userId = t.wallet.user?.userId || 'Unknown'
      const makerDisplay = userId.length > 16 
        ? `${userId.slice(0, 8)}...${userId.slice(-4)}`
        : userId
      
      return {
        id: t.id,
        date: t.createdAt.toISOString(),
        type: 'sell' as const,
        ngn: nairaAmount,
        amount: tokensAmount,
        price: tokensAmount > 0 ? nairaAmount / tokensAmount : 0,
        maker: makerDisplay,
      }
    })

    // Combine and sort by date (newest first)
    const allTransactions = [...buyTxs, ...sellTxs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 50) // Limit to last 50 transactions

    return NextResponse.json({ success: true, transactions: allTransactions })
  } catch (error) {
    console.error('Get all transactions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get transactions' }, { status: 500 })
  }
}
