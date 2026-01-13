import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * DELETE /api/watchlist/[tokenId] - Remove token from watchlist
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const session = await auth()
    // Dev bypass: skip auth in development
    if (!session?.user?.id && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session?.user?.id
    const { tokenId } = await params

    // Return error if no userId (not authenticated)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to remove from watchlist' },
        { status: 401 }
      )
    }

    // Check if exists
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_tokenId: {
          userId,
          tokenId,
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not in watchlist' }, { status: 404 })
    }

    await prisma.wishlist.delete({
      where: {
        id: existing.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 })
  }
}
