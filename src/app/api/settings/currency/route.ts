import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/settings/currency
 * Update currency preference
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('Currency API called');
    
    const session = await auth()
    console.log('Session:', session?.user?.id ? 'Found' : 'Not found');

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currency } = body
    console.log('Requested currency:', currency);

    // Validate currency
    if (!currency || !['NGN', 'USD'].includes(currency)) {
      return NextResponse.json(
        { success: false, error: 'Invalid currency. Must be NGN or USD' },
        { status: 400 }
      )
    }

    // Check if UserSettings table exists by trying to find first
    try {
      await prisma.userSettings.findFirst({
        where: { userId: session.user.id }
      });
    } catch (tableError) {
      console.error('UserSettings table might not exist:', tableError);
      return NextResponse.json(
        { success: false, error: 'Database not ready. Please try again later.' },
        { status: 503 }
      )
    }

    // Update or create settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        currencyPreference: currency
      },
      create: {
        userId: session.user.id,
        currencyPreference: currency,
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
        },
        autoLockEnabled: true
      }
    })

    console.log('Settings updated successfully');
    return NextResponse.json({
      success: true,
      message: 'Currency preference updated',
      data: settings
    })
  } catch (error) {
    console.error('Update currency preference error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update currency preference',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
