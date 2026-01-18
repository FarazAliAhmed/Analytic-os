import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/token/holders?symbol=NG - Get token holders
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json({ error: 'Token symbol is required' }, { status: 400 })
    }

    // Get token
    const token = await prisma.token.findFirst({
      where: { symbol, isActive: true }
    })

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    // Get all holdings for this token
    const holdings = await prisma.tokenHolding.groupBy({
      by: ['userId'],
      where: {
        tokenId: symbol,
        quantity: { gt: 0 }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      }
    })

    // Get total supply (sum of all holdings)
    const totalSupply = holdings.reduce((sum, h) => sum + (h._sum?.quantity || 0), 0)

    // Get user details and calculate percentages
    const holdersWithDetails = await Promise.all(
      holdings.map(async (holding, index) => {
        const user = await prisma.user.findUnique({
          where: { id: holding.userId },
          select: { userId: true }
        })

        const userId = user?.userId || 'UNKNOWN'
        // Format: Show first 8 chars + ... + last 4 chars (e.g., EWonZrNY...keb2)
        const userIdDisplay = userId.length > 16 
          ? `${userId.slice(0, 8)}...${userId.slice(-4)}`
          : userId

        const quantity = holding._sum?.quantity || 0
        const percent = totalSupply > 0 ? (quantity / totalSupply) * 100 : 0
        const value = (quantity * token.price) / 100 // Convert from kobo to Naira

        return {
          rank: index + 1,
          userId: userIdDisplay,
          percent: parseFloat(percent.toFixed(2)),
          amount: quantity,
          value: value,
          valueFormatted: `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
      })
    )

    return NextResponse.json({
      success: true,
      holders: holdersWithDetails,
      totalHolders: holdersWithDetails.length,
      totalSupply
    })
  } catch (error) {
    console.error('Get holders error:', error)
    return NextResponse.json({ error: 'Failed to get holders' }, { status: 500 })
  }
}
