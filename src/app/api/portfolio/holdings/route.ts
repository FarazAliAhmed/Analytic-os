import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface TokenHoldingResponse {
  success: boolean
  holdings?: Array<{
    id: string
    tokenId: string
    quantity: number
    averagePrice: number
    totalInvested: number
    accumulatedYield: number
    lastYieldUpdate: Date
    tokenSharePercent: number // User's share of this token
    token: {
      id: string
      name: string
      symbol: string
      price: number
      annualYield: number
      industry: string
      riskLevel: string
      logoUrl: string | null
    }
  }>
  error?: string
}

// Default token info for INV if not in Token table
const DEFAULT_INV_TOKEN = {
  id: 'inv-default',
  name: 'INV Token',
  symbol: 'INV',
  price: 150000, // ₦1,500 in kobo
  annualYield: 35,
  industry: 'DeFi',
  riskLevel: 'Low',
  logoUrl: null,
}

/**
 * GET /api/portfolio/holdings - Get user's token holdings
 */
export async function GET(): Promise<NextResponse<TokenHoldingResponse>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get all holdings for user
    const holdings = await prisma.tokenHolding.findMany({
      where: {
        userId,
        quantity: { gt: 0 }, // Only show holdings with tokens
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get token symbols from holdings
    const symbols = holdings.map(h => h.tokenId)

    // Fetch token details
    const tokens = await prisma.token.findMany({
      where: {
        symbol: { in: symbols },
        isActive: true,
      },
    })

    // Create a map of symbol -> token
    const tokenMap = new Map(tokens.map(t => [t.symbol, t]))

    // Build response with token details and calculate share percentages
    const holdingsWithTokens = await Promise.all(holdings.map(async (holding) => {
      const token = tokenMap.get(holding.tokenId)
      
      // Calculate user's share of this token
      // Get total invested amount for this token across all users
      const tokenTotalInvested = await prisma.tokenHolding.aggregate({
        where: {
          tokenId: holding.tokenId,
          quantity: { gt: 0 }
        },
        _sum: {
          totalInvested: true
        }
      })
      
      const totalVolumeInvested = Number(tokenTotalInvested._sum.totalInvested || 0)
      const userInvested = Number(holding.totalInvested)
      const tokenSharePercent = totalVolumeInvested > 0 
        ? (userInvested / totalVolumeInvested) * 100 
        : 0
      
      // Use default INV token if not found in Token table
      if (!token && holding.tokenId === 'INV') {
        return {
          id: holding.id,
          tokenId: holding.tokenId,
          quantity: Number(holding.quantity),
          averagePrice: Number(holding.averagePrice),
          totalInvested: userInvested,
          accumulatedYield: Number(holding.accumulatedYield),
          lastYieldUpdate: holding.lastYieldUpdate,
          tokenSharePercent: parseFloat(tokenSharePercent.toFixed(2)),
          token: DEFAULT_INV_TOKEN,
        }
      }
      
      if (!token) return null

      return {
        id: holding.id,
        tokenId: holding.tokenId,
        quantity: Number(holding.quantity),
        averagePrice: Number(holding.averagePrice),
        totalInvested: userInvested,
        accumulatedYield: Number(holding.accumulatedYield),
        lastYieldUpdate: holding.lastYieldUpdate,
        tokenSharePercent: parseFloat(tokenSharePercent.toFixed(2)),
        token: {
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          price: token.price,
          annualYield: Number(token.annualYield),
          industry: token.industry,
          riskLevel: token.riskLevel,
          logoUrl: token.logoUrl,
        },
      }
    }))

    const filteredHoldings = holdingsWithTokens.filter((h): h is NonNullable<typeof h> => h !== null)

    return NextResponse.json({
      success: true,
      holdings: filteredHoldings,
    })
  } catch (error) {
    console.error('Portfolio holdings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch holdings' },
      { status: 500 }
    )
  }
}
