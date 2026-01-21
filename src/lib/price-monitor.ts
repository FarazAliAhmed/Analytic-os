import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

interface PriceChange {
  tokenSymbol: string
  oldPrice: number
  newPrice: number
  changePercentage: number
}

interface TokenPriceData {
  symbol: string
  currentPrice: number
  previousPrice: number
  priceChange24h: number
}

/**
 * Monitor token prices and trigger alerts when thresholds are exceeded
 */
export class PriceMonitor {
  private static instance: PriceMonitor
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  private constructor() {}

  static getInstance(): PriceMonitor {
    if (!PriceMonitor.instance) {
      PriceMonitor.instance = new PriceMonitor()
    }
    return PriceMonitor.instance
  }

  /**
   * Start the price monitoring service
   * @param intervalMinutes - How often to check prices (default: 5 minutes)
   */
  start(intervalMinutes: number = 5): void {
    if (this.isRunning) {
      console.log('Price monitor is already running')
      return
    }

    this.isRunning = true
    console.log(`Starting price monitor with ${intervalMinutes} minute intervals`)

    // Run immediately
    this.checkPrices()

    // Then run at intervals
    this.intervalId = setInterval(() => {
      this.checkPrices()
    }, intervalMinutes * 60 * 1000)
  }

  /**
   * Stop the price monitoring service
   */
  stop(): void {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    console.log('Price monitor stopped')
  }

  /**
   * Check all token prices and trigger alerts
   */
  private async checkPrices(): Promise<void> {
    try {
      console.log('Checking token prices for alerts...')

      // Get all active tokens with their current prices
      const tokens = await prisma.token.findMany({
        where: { isActive: true },
        select: {
          symbol: true,
          price: true,
          priceChange24h: true
        }
      })

      // Get all active price alerts
      const activeAlerts = await (prisma as any).priceAlert.findMany({
        where: { isActive: true },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              settings: {
                select: {
                  notificationPreferences: true
                }
              }
            }
          }
        }
      })

      // Group alerts by token symbol for efficient processing
      const alertsByToken = new Map<string, typeof activeAlerts>()
      activeAlerts.forEach((alert: any) => {
        const existing = alertsByToken.get(alert.tokenSymbol) || []
        existing.push(alert)
        alertsByToken.set(alert.tokenSymbol, existing)
      })

      // Check each token for price changes
      for (const token of tokens) {
        const alerts = alertsByToken.get(token.symbol)
        if (!alerts || alerts.length === 0) continue

        // Calculate if price change exceeds any user's threshold
        const priceChangePercentage = Math.abs(Number(token.priceChange24h))
        
        for (const alert of alerts) {
          const thresholdPercentage = Number(alert.thresholdPercentage)
          
          // Check if price change exceeds threshold
          if (priceChangePercentage >= thresholdPercentage) {
            // Check if we haven't already triggered this alert recently (within last hour)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
            if (alert.lastTriggeredAt && alert.lastTriggeredAt > oneHourAgo) {
              continue // Skip if already triggered recently
            }

            await this.triggerPriceAlert(alert, token, priceChangePercentage)
          }
        }
      }

      console.log('Price check completed')
    } catch (error) {
      console.error('Error checking prices:', error)
    }
  }

  /**
   * Trigger a price alert for a specific user and token
   */
  private async triggerPriceAlert(
    alert: any,
    token: { symbol: string; price: number; priceChange24h: any },
    changePercentage: number
  ): Promise<void> {
    try {
      const user = alert.user
      const notificationPrefs = user.settings?.notificationPreferences

      // Check if user has price alerts enabled
      if (!notificationPrefs?.email?.priceAlerts && !notificationPrefs?.webApp?.priceAlerts) {
        return
      }

      // Calculate price information
      const currentPrice = token.price / 100 // Convert from kobo to naira
      const priceChange = Number(token.priceChange24h)
      const direction = priceChange >= 0 ? 'increased' : 'decreased'
      const changeSymbol = priceChange >= 0 ? '+' : ''

      // Create notification message
      const title = `Price Alert: ${token.symbol}`
      const message = `${token.symbol} has ${direction} by ${changeSymbol}${priceChange.toFixed(2)}% (${changeSymbol}${changePercentage.toFixed(2)}%) to ₦${currentPrice.toLocaleString()}`

      // Send notifications based on user preferences
      if (notificationPrefs?.email?.priceAlerts || notificationPrefs?.webApp?.priceAlerts) {
        await createNotification({
          userId: user.id,
          type: 'alert',
          title,
          message,
          metadata: {
            tokenSymbol: token.symbol,
            priceChange: priceChange,
            changePercentage: changePercentage,
            currentPrice: currentPrice,
            alertThreshold: Number(alert.thresholdPercentage),
            type: 'price_alert'
          }
        })
      }

      // Update the alert's last triggered timestamp
      await (prisma as any).priceAlert.update({
        where: { id: alert.id },
        data: { lastTriggeredAt: new Date() }
      })

      console.log(`Price alert triggered for user ${user.username} on ${token.symbol}`)
    } catch (error) {
      console.error('Error triggering price alert:', error)
    }
  }

  /**
   * Manually check a specific token for price alerts
   */
  async checkTokenPrice(tokenSymbol: string): Promise<void> {
    try {
      const token = await prisma.token.findUnique({
        where: { symbol: tokenSymbol },
        select: {
          symbol: true,
          price: true,
          priceChange24h: true
        }
      })

      if (!token) {
        throw new Error(`Token ${tokenSymbol} not found`)
      }

      const alerts = await (prisma as any).priceAlert.findMany({
        where: {
          tokenSymbol,
          isActive: true
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              settings: {
                select: {
                  notificationPreferences: true
                }
              }
            }
          }
        }
      })

      const priceChangePercentage = Math.abs(Number(token.priceChange24h))

      for (const alert of alerts) {
        const thresholdPercentage = Number(alert.thresholdPercentage)
        
        if (priceChangePercentage >= thresholdPercentage) {
          await this.triggerPriceAlert(alert, token, priceChangePercentage)
        }
      }
    } catch (error) {
      console.error(`Error checking price for ${tokenSymbol}:`, error)
      throw error
    }
  }

  /**
   * Get monitoring status
   */
  getStatus(): { isRunning: boolean; intervalId: NodeJS.Timeout | null } {
    return {
      isRunning: this.isRunning,
      intervalId: this.intervalId
    }
  }
}

/**
 * Initialize and start the price monitor (singleton)
 */
export function initializePriceMonitor(intervalMinutes: number = 5): PriceMonitor {
  const monitor = PriceMonitor.getInstance()
  monitor.start(intervalMinutes)
  return monitor
}

/**
 * Stop the price monitor
 */
export function stopPriceMonitor(): void {
  const monitor = PriceMonitor.getInstance()
  monitor.stop()
}

/**
 * Get the price monitor instance
 */
export function getPriceMonitor(): PriceMonitor {
  return PriceMonitor.getInstance()
}