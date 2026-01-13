// src/app/api/notifications/mark-read/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAll } = body

    if (markAll) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false
        },
        data: { isRead: true }
      })

      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    if (!notificationId) {
      return NextResponse.json({ success: false, error: 'Notification ID required' }, { status: 400 })
    }

    // Mark single notification as read
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id // Ensure user owns the notification
      },
      data: { isRead: true }
    })

    if (!notification) {
      return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: notification })
  } catch (error) {
    console.error('Mark notification read error:', error)
    return NextResponse.json({ success: false, error: 'Failed to mark notification as read' }, { status: 500 })
  }
}
