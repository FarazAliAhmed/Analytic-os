import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/settings/price-alerts
 * Update price alert settings
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { enabled, thresholdPercentage, watchedTokens } = body

    // Validate threshold percentage
    if (thresholdPercentage !== undefined) {
      if (typeof thresholdPercentage !== 'number' || thresholdPercentage <= 0 || thresholdPercentage > 100) {
        return NextResponse.json(
          { success: false, error: 'Threshold percentage must be a positive number between 0 and 100' },
          { status: 400 }
        )
      }
    }

    // Validate watchedTokens array
    if (watchedTokens !== undefined) {
      if (!Array.isArray(watchedTokens)) {
        return NextResponse.json(
          { success: false, error: 'Watched tokens must be an array' },
          { status: 400 }
        )
      }
      
      // Validate that all tokens exist in the database
      if (watchedTokens.length > 0) {
        const existingTokens = await prisma.token.findMany({
          where: {
            symbol: {
              in: watchedTokens
            },
            isActive: true
          },
          select: { symbol: true }
        })
        
        const existingSymbols = existingTokens.map(token => token.symbol)
        const invalidTokens = watchedTokens.filter(symbol => !existingSymbols.includes(symbol))
        
        if (invalidTokens.length > 0) {
          return NextResponse.json(
            { success: false, error: `Invalid token symbols: ${invalidTokens.join(', ')}` },
            { status: 400 }
          )
        }
      }
    }

    // Prepare the price alert settings object
    const priceAlertSettings = {
      enabled: enabled !== undefined ? enabled : true,
      thresholdPercentage: thresholdPercentage !== undefined ? thresholdPercentage : 5.0,
      watchedTokens: watchedTokens !== undefined ? watchedTokens : []
    }

    // Update or create user settings
    const settings = await (prisma as any).userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        priceAlertSettings
      },
      create: {
        userId: session.user.id,
        priceAlertSettings,
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
        autoLockEnabled: true
      }
    })

    // Update or create individual price alert records
    if (watchedTokens !== undefined) {
      // First, deactivate all existing alerts for this user
      await (prisma as any).priceAlert.updateMany({
        where: { userId: session.user.id },
        data: { isActive: false }
      })

      // Then create or reactivate alerts for watched tokens
      if (watchedTokens.length > 0) {
        for (const tokenSymbol of watchedTokens) {
          await (prisma as any).priceAlert.upsert({
            where: {
              userId_tokenSymbol: {
                userId: session.user.id,
                tokenSymbol
              }
            },
            update: {
              isActive: enabled !== undefined ? enabled : true,
              thresholdPercentage: thresholdPercentage !== undefined ? thresholdPercentage : 5.0
            },
            create: {
              userId: session.user.id,
              tokenSymbol,
              thresholdPercentage: thresholdPercentage !== undefined ? thresholdPercentage : 5.0,
              isActive: enabled !== undefined ? enabled : true
            }
          })
        }
      }
    }

    // Get updated price alerts
    const priceAlerts = await (prisma as any).priceAlert.findMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      select: {
        id: true,
        tokenSymbol: true,
        thresholdPercentage: true,
        isActive: true,
        lastTriggeredAt: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Price alert settings updated successfully',
      data: {
        settings,
        priceAlerts
      }
    })
  } catch (error) {
    console.error('Update price alert settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update price alert settings' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/settings/price-alerts
 * Get current price alert settings and active alerts
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user settings
    const settings = await (prisma as any).userSettings.findUnique({
      where: { userId: session.user.id },
      select: {
        priceAlertSettings: true
      }
    })

    // Get active price alerts
    const priceAlerts = await (prisma as any).priceAlert.findMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      select: {
        id: true,
        tokenSymbol: true,
        thresholdPercentage: true,
        isActive: true,
        lastTriggeredAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get available tokens for selection
    const availableTokens = await prisma.token.findMany({
      where: {
        isActive: true
      },
      select: {
        symbol: true,
        name: true,
        price: true,
        priceChange24h: true
      },
      orderBy: {
        symbol: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        settings: settings?.priceAlertSettings || {
          enabled: true,
          thresholdPercentage: 5.0,
          watchedTokens: []
        },
        priceAlerts,
        availableTokens
      }
    })
  } catch (error) {
    console.error('Get price alert settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price alert settings' },
      { status: 500 }
    )
  }
}