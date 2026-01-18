import { prisma } from '../src/lib/prisma'
import { calculateAccumulatedYield, calculateDailyYield } from '../src/lib/yield-calculator'
import * as dotenv from 'dotenv'

dotenv.config()

async function testYieldCalculation() {
  try {
    console.log('\n=== Testing Yield Calculation ===\n')

    // Get a sample holding
    const holdings = await prisma.tokenHolding.findMany({
      where: {
        quantity: { gt: 0 }
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      take: 3
    })

    // Get token info
    const tokenSymbols = holdings.map(h => h.tokenId)
    const tokens = await prisma.token.findMany({
      where: {
        symbol: { in: tokenSymbols }
      }
    })

    const tokenMap = new Map(tokens.map(t => [t.symbol, t]))

    for (const holding of holdings) {
      const token = tokenMap.get(holding.tokenId)
      if (!token) continue

      console.log(`\n--- ${holding.user.email} - ${holding.tokenId} ---`)
      console.log(`Total Invested: ₦${Number(holding.totalInvested).toLocaleString()}`)
      console.log(`APY: ${token.annualYield}%`)
      console.log(`Last Yield Update: ${holding.lastYieldUpdate.toISOString()}`)
      
      const now = new Date()
      const msPerDay = 24 * 60 * 60 * 1000
      const daysSince = (now.getTime() - holding.lastYieldUpdate.getTime()) / msPerDay
      console.log(`Days since last update: ${daysSince.toFixed(4)} days`)
      
      const dailyYield = calculateDailyYield(
        Number(holding.totalInvested),
        Number(token.annualYield)
      )
      console.log(`Daily Yield: ₦${dailyYield.toFixed(2)}/day`)
      
      const accumulatedYield = calculateAccumulatedYield(
        Number(holding.totalInvested),
        Number(token.annualYield),
        holding.lastYieldUpdate
      )
      console.log(`Accumulated Yield (floor days): ₦${accumulatedYield.toFixed(2)}`)
      
      // Calculate with partial days
      const accumulatedYieldPartial = dailyYield * daysSince
      console.log(`Accumulated Yield (partial days): ₦${accumulatedYieldPartial.toFixed(2)}`)
    }

    console.log('\n=== Test Complete ===\n')

  } catch (error) {
    console.error('Test failed:', error)
    throw error
  }
}

testYieldCalculation()
