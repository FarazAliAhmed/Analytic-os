// src/app/api/notifications/count/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false
      }
    })

    return NextResponse.json({
      success: true,
      data: { unreadCount }
    })
  } catch (error) {
    console.error('Get notification count error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get notification count' }, { status: 500 })
  }
}
