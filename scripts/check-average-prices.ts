import { PrismaClient } from '@/generated/prisma/client'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient()

async function checkAveragePrices() {
  try {
    console.log('Checking average prices...\n')

    // Get all token holdings with token info
    const holdings = await prisma.tokenHolding.findMany({
      orderBy: { tokenId: 'asc' },
    })

    // Get all tokens
    const tokens = await prisma.token.findMany()
    const tokenMap = new Map(tokens.map((t) => [t.symbol, t]))

    for (const holding of holdings) {
      const token = tokenMap.get(holding.tokenId)
      const tokenPrice = token ? token.price : 0

      console.log(`Token: ${holding.tokenId}`)
      console.log(`  User: ${holding.userId}`)
      console.log(`  Quantity: ${holding.quantity}`)
      console.log(`  Average Price (raw): ${holding.averagePrice}`)
      console.log(`  Average Price (÷100): ${Number(holding.averagePrice) / 100}`)
      console.log(`  Token Price (kobo): ${tokenPrice}`)
      console.log(`  Token Price (Naira): ${tokenPrice / 100}`)
      console.log(`  Expected Avg Price (kobo): ${tokenPrice}`)
      console.log(`  Match: ${Number(holding.averagePrice) === tokenPrice ? '✓' : '✗'}`)
      console.log()
    }

    console.log('Done!')
  } catch (error) {
    console.error('Error checking average prices:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAveragePrices()
