import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/settings/auto-lock
 * Update auto-lock setting
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
    const { autoLockEnabled } = body

    // Validate boolean
    if (typeof autoLockEnabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid value. Must be boolean' },
        { status: 400 }
      )
    }

    // Update or create settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        autoLockEnabled
      },
      create: {
        userId: session.user.id,
        autoLockEnabled,
        currencyPreference: 'NGN',
        notificationPreferences: {
          email: {
            transactions: true,
            walletFunding: true,
            withdrawals: true,
            tokenPurchases: true,
            tokenSales: true,
            priceAlerts: true,
            securityAlerts: true
          },
          webApp: {
            transactions: true,
            walletFunding: true,
            withdrawals: true,
            tokenPurchases: true,
            tokenSales: true,
            priceAlerts: true,
            securityAlerts: true
          }
        },
        priceAlertSettings: {
          enabled: true,
          thresholdPercentage: 5.0,
          watchedTokens: []
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Auto-lock setting updated',
      data: settings
    })
  } catch (error) {
    console.error('Update auto-lock setting error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update auto-lock setting' },
      { status: 500 }
    )
  }
}
