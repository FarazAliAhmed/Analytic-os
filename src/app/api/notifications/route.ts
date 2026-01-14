// src/app/api/notifications/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { NotificationType } from '@/generated/prisma/client'

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as NotificationType | null
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where = {
      userId: session.user.id,
      ...(type ? { type } : {})
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.notification.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + notifications.length < total
      }
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get notifications' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, message, metadata } = body

    if (!type || !title || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: type as NotificationType,
        title,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })

    return NextResponse.json({ success: true, data: notification })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 })
  }
}
