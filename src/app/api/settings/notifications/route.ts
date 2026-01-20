import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/settings/notifications
 * Update notification preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationPreferences } = body

    // Validate notification preferences structure
    if (!notificationPreferences || !notificationPreferences.email || !notificationPreferences.webApp) {
      return NextResponse.json(
        { success: false, error: 'Invalid notification preferences structure' },
        { status: 400 }
      )
    }

    // Update or create settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        notificationPreferences
      },
      create: {
        userId: session.user.id,
        notificationPreferences,
        currencyPreference: 'NGN',
        priceAlertSettings: {
          enabled: true,
          thresholdPercentage: 5.0,
          watchedTokens: []
        },
        autoLockEnabled: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated',
      data: settings
    })
  } catch (error) {
    console.error('Update notification preferences error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
}
