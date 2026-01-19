import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type TimePeriod = '1d' | '7d' | '30d' | '1yr'

/**
 * GET /api/tokens/period-volume?period=1d
 * Calculate trading volume for each token within the specified time period
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || '30d') as TimePeriod

    // Calculate the start date based on period
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '1d':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '1yr':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get all active tokens
    const tokens = await prisma.token.findMany({
      where: { isActive: true },
      select: { symbol: true }
    })

    // Calculate volume for each token
    const volumeData: Record<string, number> = {}

    for (const token of tokens) {
      // Get buy transactions within period
      const buyTransactions = await prisma.tokenPurchase.findMany({
        where: {
          tokenId: token.symbol,
          status: 'completed',
          createdAt: {
            gte: startDate
          }
        },
        select: {
          nairaAmountSpent: true
        }
      })

      // Get sell transactions within period
      const sellTransactions = await prisma.transaction.findMany({
        where: {
          type: 'credit',
          status: 'completed',
          description: {
            contains: `Sold`
          },
          AND: {
            description: {
              contains: token.symbol
            }
          },
          createdAt: {
            gte: startDate
          }
        },
        select: {
          amount: true // This is in kobo
        }
      })

      // Calculate total buy volume
      const buyVolume = buyTransactions.reduce((sum, tx) => sum + tx.nairaAmountSpent, 0)

      // Calculate total sell volume (convert from kobo to Naira)
      const sellVolume = sellTransactions.reduce((sum, tx) => sum + (tx.amount / 100), 0)

      // Total volume = buy + sell
      volumeData[token.symbol] = buyVolume + sellVolume
    }

    return NextResponse.json({
      success: true,
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      volumes: volumeData
    })
  } catch (error) {
    console.error('Period volume calculation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate period volumes' },
      { status: 500 }
    )
  }
}
