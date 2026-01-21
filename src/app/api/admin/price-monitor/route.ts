import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { PriceMonitor, initializePriceMonitor, stopPriceMonitor, getPriceMonitor } from '@/lib/price-monitor'

/**
 * POST /api/admin/price-monitor
 * Start or stop the price monitoring service
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!isAdmin(session.user)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, intervalMinutes } = body

    if (!action || !['start', 'stop'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "start" or "stop"' },
        { status: 400 }
      )
    }

    if (action === 'start') {
      const interval = intervalMinutes && intervalMinutes > 0 ? intervalMinutes : 5
      const monitor = initializePriceMonitor(interval)
      const status = monitor.getStatus()

      return NextResponse.json({
        success: true,
        message: `Price monitor started with ${interval} minute intervals`,
        data: {
          isRunning: status.isRunning,
          intervalMinutes: interval
        }
      })
    } else {
      stopPriceMonitor()
      
      return NextResponse.json({
        success: true,
        message: 'Price monitor stopped',
        data: {
          isRunning: false
        }
      })
    }
  } catch (error) {
    console.error('Price monitor control error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to control price monitor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/price-monitor
 * Get price monitor status
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

    if (!isAdmin(session.user)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const monitor = getPriceMonitor()
    const status = monitor.getStatus()

    return NextResponse.json({
      success: true,
      data: {
        isRunning: status.isRunning,
        hasIntervalId: status.intervalId !== null
      }
    })
  } catch (error) {
    console.error('Get price monitor status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get price monitor status' },
      { status: 500 }
    )
  }
}