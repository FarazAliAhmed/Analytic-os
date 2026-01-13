import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

type Period = 'daily' | 'weekly' | 'monthly'

interface ChartDataPoint {
  date: string
  volume: number
}

interface ChartDataResponse {
  success: boolean
  data?: {
    data: ChartDataPoint[]
    dates: string[]
    volumes: number[]
    period: Period
  }
  error?: string
}

/**
 * GET /api/admin/chart-data - Get transaction volume data for charts
 * 
 * Query params:
 * - period: 'daily' | 'weekly' | 'monthly' (default: 'daily')
 * 
 * Returns aggregated transaction volumes by date for the chart
 */
export async function GET(request: NextRequest): Promise<NextResponse<ChartDataResponse>> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const adminStatus = await isAdmin(session.user.id)
    if (!adminStatus) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') as Period) || 'daily'

    // Validate period
    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return NextResponse.json(
        { success: false, error: 'Invalid period. Must be daily, weekly, or monthly' },
        { status: 400 }
      )
    }

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    let dateFormat: string

    switch (period) {
      case 'daily':
        // Last 30 days
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        dateFormat = 'day'
        break
      case 'weekly':
        // Last 12 weeks
        startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000)
        dateFormat = 'week'
        break
      case 'monthly':
        // Last 12 months
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1)
        dateFormat = 'month'
        break
    }

    // Fetch wallet transactions (amount is in kobo)
    const walletTransactions = await prisma.transaction.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'completed'
      },
      select: {
        amount: true,
        createdAt: true
      }
    })

    // Fetch token purchases (totalAmountKobo is in kobo)
    const tokenPurchases = await prisma.tokenPurchase.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'completed'
      },
      select: {
        totalAmountKobo: true,
        createdAt: true
      }
    })

    // Aggregate data by period
    const volumeMap = new Map<string, number>()

    // Process wallet transactions
    for (const tx of walletTransactions) {
      const key = getDateKey(tx.createdAt, dateFormat)
      const current = volumeMap.get(key) || 0
      volumeMap.set(key, current + tx.amount)
    }

    // Process token purchases
    for (const purchase of tokenPurchases) {
      const key = getDateKey(purchase.createdAt, dateFormat)
      const current = volumeMap.get(key) || 0
      volumeMap.set(key, current + purchase.totalAmountKobo)
    }

    // Generate all date keys for the period to ensure continuous data
    const allDateKeys = generateDateKeys(startDate, now, dateFormat)
    
    // Build chart data with all dates (fill missing with 0)
    const chartData: ChartDataPoint[] = allDateKeys.map(key => ({
      date: formatDateLabel(key, dateFormat),
      volume: Math.round((volumeMap.get(key) || 0) / 100) // Convert kobo to Naira
    }))

    // Extract separate date and volume arrays for flexibility
    const dates = chartData.map(point => point.date)
    const volumes = chartData.map(point => point.volume)

    return NextResponse.json({
      success: true,
      data: {
        data: chartData,
        dates,
        volumes,
        period
      }
    })
  } catch (error) {
    console.error('Admin chart data error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chart data' },
      { status: 500 }
    )
  }
}

/**
 * Get a date key for grouping based on the format
 */
function getDateKey(date: Date, format: string): string {
  const d = new Date(date)
  
  switch (format) {
    case 'day':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    case 'week':
      // Get the Monday of the week
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(d.setDate(diff))
      return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`
    case 'month':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    default:
      return d.toISOString().split('T')[0]
  }
}

/**
 * Generate all date keys between start and end dates
 */
function generateDateKeys(start: Date, end: Date, format: string): string[] {
  const keys: string[] = []
  const current = new Date(start)

  while (current <= end) {
    keys.push(getDateKey(current, format))
    
    switch (format) {
      case 'day':
        current.setDate(current.getDate() + 1)
        break
      case 'week':
        current.setDate(current.getDate() + 7)
        break
      case 'month':
        current.setMonth(current.getMonth() + 1)
        break
    }
  }

  // Remove duplicates (can happen with week boundaries)
  return [...new Set(keys)]
}

/**
 * Format date key for display label
 */
function formatDateLabel(key: string, format: string): string {
  const parts = key.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  switch (format) {
    case 'day':
      // Format: "Jan 15"
      return `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}`
    case 'week':
      // Format: "Jan 15" (week starting)
      return `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}`
    case 'month':
      // Format: "Jan 2025"
      return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`
    default:
      return key
  }
}
