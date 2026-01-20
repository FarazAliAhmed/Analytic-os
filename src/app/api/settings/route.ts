import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/settings
 * Get user settings
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create user settings
    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
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
          currencyPreference: 'NGN',
          priceAlertSettings: {
            enabled: true,
            thresholdPercentage: 5.0,
            watchedTokens: []
          },
          autoLockEnabled: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
