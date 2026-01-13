import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'

/**
 * GET /api/admin/verify - Check if current user has admin role
 * 
 * Returns:
 * - 200: { isAdmin: true } if user is an admin
 * - 200: { isAdmin: false } if user is not an admin
 * - 401: { error: 'Unauthorized' } if no valid session
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', isAdmin: false },
        { status: 401 }
      )
    }

    const adminStatus = await isAdmin(session.user.id)

    return NextResponse.json({
      isAdmin: adminStatus,
      userId: session.user.id,
    })
  } catch (error) {
    console.error('Admin verify error:', error)
    return NextResponse.json(
      { error: 'Failed to verify admin status', isAdmin: false },
      { status: 500 }
    )
  }
}
