import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/watchlist - Get all watchlist items for current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    // Dev bypass: skip auth in development
    if (!session?.user?.id && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session?.user?.id

    // Return empty array if no userId (anonymous in dev)
    if (!userId) {
      return NextResponse.json({ success: true, items: [] })
    }

    const items = await prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    // Get token details for each watchlist item
    const tokenIds = items.map(item => item.tokenId)
    const tokens = await prisma.token.findMany({
      where: { 
        OR: [
          { id: { in: tokenIds } },
          { symbol: { in: tokenIds } }
        ]
      },
      select: {
        id: true,
        name: true,
        symbol: true,
        price: true,
        annualYield: true,
        industry: true,
        riskLevel: true,
        logoUrl: true,
        minimumInvestment: true,
      },
    })

    // Create map for quick lookup
    const tokenMap = new Map(tokens.map(t => [t.id, t]))
    const symbolMap = new Map(tokens.map(t => [t.symbol, t]))

    // Attach token info to items
    const itemsWithTokens = items.map(item => {
      const token = tokenMap.get(item.tokenId) || symbolMap.get(item.tokenId)
      return {
        ...item,
        token: token || null
      }
    })

    return NextResponse.json({ success: true, items: itemsWithTokens })
  } catch (error) {
    console.error('Get watchlist error:', error)
    return NextResponse.json({ error: 'Failed to get watchlist' }, { status: 500 })
  }
}

/**
 * POST /api/watchlist - Add token to watchlist
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    // Dev bypass: skip auth in development
    if (!session?.user?.id && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session?.user?.id
    const body = await request.json()
    const { tokenId } = body

    if (!tokenId) {
      return NextResponse.json({ error: 'tokenId is required' }, { status: 400 })
    }

    // Return error if no userId (not authenticated)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to add to watchlist' },
        { status: 401 }
      )
    }

    // Check if already in watchlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_tokenId: {
          userId,
          tokenId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Token already in watchlist', isInWatchlist: true },
        { status: 409 }
      )
    }

    const item = await prisma.wishlist.create({
      data: {
        userId,
        tokenId,
      },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Add to watchlist error:', error)
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 })
  }
}
