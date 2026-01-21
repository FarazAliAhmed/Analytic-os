import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/settings
 * Get user settings
 */
export async function GET() {
  try {
    console.log('Settings API called');
    
    const session = await auth()
    console.log('Session:', session?.user?.id ? 'Found' : 'Not found');

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if UserSettings table exists
    let settings;
    try {
      settings = await prisma.userSettings.findUnique({
        where: { userId: session.user.id }
      });
    } catch (tableError) {
      console.error('UserSettings table might not exist:', tableError);
      // Return default settings if table doesn't exist
      return NextResponse.json({
        success: true,
        data: {
          currencyPreference: 'NGN',
          autoLockEnabled: true,
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
      });
    }

    // Create default settings if none exist
    if (!settings) {
      try {
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
        });
      } catch (createError) {
        console.error('Failed to create default settings:', createError);
        // Return default settings if creation fails
        return NextResponse.json({
          success: true,
          data: {
            currencyPreference: 'NGN',
            autoLockEnabled: true,
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
        });
      }
    }

    console.log('Settings retrieved successfully');
    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
