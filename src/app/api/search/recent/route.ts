import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/search/recent - Get user's recent searches (auth required)
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ recentSearches: [] })
    }

    const recentSearches = await prisma.recentSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      recentSearches: recentSearches.map((s) => ({
        id: s.id,
        query: s.query,
        createdAt: s.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching recent searches:', error)
    return NextResponse.json({ recentSearches: [] })
  }
}

/**
 * DELETE /api/search/recent - Clear all recent searches (auth required)
 */
export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.recentSearch.deleteMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing recent searches:', error)
    return NextResponse.json({ error: 'Failed to clear recent searches' }, { status: 500 })
  }
}
