import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/watchlist/count - Get watchlist count
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    // Dev bypass: skip auth in development
    if (!session?.user?.id && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session?.user?.id

    // Return 0 if no userId (anonymous in dev)
    if (!userId) {
      return NextResponse.json({ success: true, count: 0 })
    }

    const count = await prisma.wishlist.count({
      where: { userId },
    })

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error('Get watchlist count error:', error)
    return NextResponse.json({ error: 'Failed to get watchlist count' }, { status: 500 })
  }
}
