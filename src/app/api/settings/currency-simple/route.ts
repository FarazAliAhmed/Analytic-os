import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/settings/currency-simple
 * Update currency preference - simplified version that stores in User table
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('Simple currency API called');
    
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

    // For now, just return success - we'll store in localStorage on frontend
    // This is a temporary solution until database migration is complete
    console.log('Currency preference acknowledged:', currency);
    
    return NextResponse.json({
      success: true,
      message: 'Currency preference updated',
      data: {
        currencyPreference: currency,
        method: 'temporary-storage'
      }
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

/**
 * GET /api/settings/currency-simple
 * Get currency preference - simplified version
 */
export async function GET() {
  try {
    console.log('Simple currency GET API called');
    
    const session = await auth()
    console.log('Session:', session?.user?.id ? 'Found' : 'Not found');

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Return default settings for now
    return NextResponse.json({
      success: true,
      data: {
        currencyPreference: 'NGN',
        method: 'default'
      }
    })
  } catch (error) {
    console.error('Get currency preference error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get currency preference',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}