import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/watchlist/ids - Get only token IDs (lightweight for batch checking)
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
      return NextResponse.json({ success: true, tokenIds: [] })
    }

    const items = await prisma.wishlist.findMany({
      where: { userId },
      select: { tokenId: true },
    })

    const tokenIds = items.map(item => item.tokenId)

    return NextResponse.json({ success: true, tokenIds })
  } catch (error) {
    console.error('Get watchlist IDs error:', error)
    return NextResponse.json({ error: 'Failed to get watchlist IDs' }, { status: 500 })
  }
}
