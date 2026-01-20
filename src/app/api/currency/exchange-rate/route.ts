import { NextResponse } from 'next/server'
import { getCurrentExchangeRate } from '@/lib/currency-converter'

/**
 * GET /api/currency/exchange-rate
 * Get current NGN to USD exchange rate
 */
export async function GET() {
  try {
    const { rate, lastUpdated } = await getCurrentExchangeRate()

    return NextResponse.json({
      success: true,
      data: {
        base: 'NGN',
        target: 'USD',
        rate,
        lastUpdated: lastUpdated.toISOString(),
        displayRate: `1 NGN = $${rate.toFixed(4)} USD`
      }
    })
  } catch (error) {
    console.error('Exchange rate API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch exchange rate'
      },
      { status: 500 }
    )
  }
}
