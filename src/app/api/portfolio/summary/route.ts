import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateYield } from '@/lib/yield-calculator'

interface PortfolioSummaryResponse {
  success: boolean
  data?: {
    totalInvested: number      // Sum of nairaAmountSpent in Naira
    totalYield: number         // Accumulated yield in Naira
    yieldPercentage: number    // Yield as percentage of investment
    transactionCount: number   // Transactions in last 30 days
    buyCount: number           // Buy transactions count
    lastUpdated: string        // ISO timestamp
  }
  error?: string
}

/**
 * GET /api/portfolio/summary - Get user's portfolio summary
 */
export async function GET(): Promise<NextResponse<PortfolioSummaryResponse>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Query 1: Get total invested (sum of nairaAmountSpent from completed purchases)
    const investmentResult = await prisma.tokenPurchase.aggregate({
      where: {
        userId,
        status: 'completed'
      },
      _sum: {
        nairaAmountSpent: true
      }
    })
    const totalInvested = investmentResult._sum.nairaAmountSpent || 0

    // Query 2: Get all purchases with token info for yield calculation
    const purchases = await prisma.tokenPurchase.findMany({
      where: {
        userId,
        status: 'completed'
      },
      select: {
        nairaAmountSpent: true,
        tokenId: true,
        createdAt: true
      }
    })

    // Get token APY data
    const tokenIds = [...new Set(purchases.map(p => p.tokenId))]
    const tokens = await prisma.token.findMany({
      where: {
        symbol: { in: tokenIds }
      },
      select: {
        symbol: true,
        annualYield: true
      }
    })

    // Create a map of tokenId -> annualYield
    const tokenYieldMap = new Map<string, number>()
    tokens.forEach(t => {
      tokenYieldMap.set(t.symbol, Number(t.annualYield))
    })

    // Calculate total yield across all purchases
    let totalYield = 0
    for (const purchase of purchases) {
      const annualYield = tokenYieldMap.get(purchase.tokenId) ?? 0
      const yieldAmount = calculateYield(
        purchase.nairaAmountSpent,
        annualYield,
        purchase.createdAt
      )
      totalYield += yieldAmount
    }

    // Query 3: Count transactions in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentPurchases = await prisma.tokenPurchase.count({
      where: {
        userId,
        status: 'completed',
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Calculate yield percentage
    const yieldPercentage = totalInvested > 0 
      ? (totalYield / totalInvested) * 100 
      : 0

    return NextResponse.json({
      success: true,
      data: {
        totalInvested,
        totalYield: Math.round(totalYield * 100) / 100, // Round to 2 decimal places
        yieldPercentage: Math.round(yieldPercentage * 100) / 100,
        transactionCount: recentPurchases,
        buyCount: recentPurchases, // Currently only buy transactions
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Portfolio summary error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
