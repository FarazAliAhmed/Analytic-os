import { prisma } from '../src/lib/prisma'
import * as dotenv from 'dotenv'

dotenv.config()

async function verifyFractionalTokens() {
  try {
    console.log('Verifying fractional token implementation...\n')

    const holdings = await prisma.tokenHolding.findMany({
      where: {
        quantity: { gt: 0 }
      },
      include: {
        user: {
          select: {
            email: true,
            userId: true
          }
        }
      },
      orderBy: {
        totalInvested: 'desc'
      }
    })

    console.log(`Found ${holdings.length} holdings\n`)
    console.log('=' .repeat(100))

    for (const holding of holdings) {
      console.log(`\nUser: ${holding.user.email} (${holding.user.userId})`)
      console.log(`Token: ${holding.tokenId}`)
      console.log(`Quantity: ${Number(holding.quantity).toFixed(6)} units`)
      console.log(`Total Invested: ₦${Number(holding.totalInvested).toLocaleString()}`)
      console.log(`Average Price: ₦${(Number(holding.averagePrice) / 100).toLocaleString()}`)
      console.log(`Accumulated Yield: ₦${Number(holding.accumulatedYield).toLocaleString()}`)
      console.log(`Last Yield Update: ${holding.lastYieldUpdate.toISOString()}`)
      console.log('-'.repeat(100))
    }

    console.log(`\n✅ Verification complete!`)

  } catch (error) {
    console.error('Verification failed:', error)
    throw error
  }
}

verifyFractionalTokens()
