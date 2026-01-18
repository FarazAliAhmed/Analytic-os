import { PrismaClient } from '@/generated/prisma/client'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient()

async function fixAveragePrices() {
  try {
    console.log('Starting to fix average prices...')

    // Get all token holdings
    const holdings = await prisma.tokenHolding.findMany()
    
    // Get all tokens
    const tokens = await prisma.token.findMany()
    const tokenMap = new Map(tokens.map((t) => [t.symbol, t]))

    console.log(`Found ${holdings.length} holdings to check`)

    let fixedCount = 0

    for (const holding of holdings) {
      const currentAvgPrice = Number(holding.averagePrice)
      const token = tokenMap.get(holding.tokenId)
      const tokenPrice = token ? token.price : 0

      // If averagePrice is much smaller than token price, it's stored in Naira instead of kobo
      // We need to multiply by 100 to convert to kobo
      if (tokenPrice > 0 && currentAvgPrice < (tokenPrice / 10)) {
        const newAvgPrice = currentAvgPrice * 100

        await prisma.tokenHolding.update({
          where: { id: holding.id },
          data: { averagePrice: newAvgPrice },
        })

        console.log(
          `Fixed ${holding.tokenId}: ${currentAvgPrice} -> ${newAvgPrice} (kobo)`
        )
        fixedCount++
      } else {
        console.log(
          `Skipped ${holding.tokenId}: averagePrice=${currentAvgPrice} (already correct or no token price)`
        )
      }
    }

    console.log(`\nFixed ${fixedCount} holdings`)
    console.log('Done!')
  } catch (error) {
    console.error('Error fixing average prices:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAveragePrices()
