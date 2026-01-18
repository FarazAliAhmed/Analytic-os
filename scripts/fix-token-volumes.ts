import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

/**
 * This script recalculates token volumes from transaction history
 * 
 * Volume Formula: Total Volume = Buy Volume + Sell Volume
 * 
 * Example:
 * - Buy Volume: ₦80,000
 * - Sell Volume: ₦47,500
 * - Total Volume: ₦127,500
 * 
 * Run this script to fix tokens that show ₦0 volume
 * Usage: npx tsx scripts/fix-token-volumes.ts
 */

async function fixTokenVolumes() {
  try {
    console.log('Recalculating token volumes from transaction history...\n')

    const tokens = await prisma.token.findMany({
      select: {
        id: true,
        symbol: true,
        name: true,
        volume: true
      }
    })

    for (const token of tokens) {
      console.log(`Processing ${token.symbol} (${token.name})...`)
      
      // Calculate buy volume from TokenPurchase
      const purchases = await prisma.tokenPurchase.findMany({
        where: {
          tokenId: token.symbol,
          status: 'completed'
        },
        select: {
          totalAmountKobo: true
        }
      })

      const buyVolume = purchases.reduce((sum, p) => sum + p.totalAmountKobo, 0)
      console.log(`  Buy volume: ₦${(buyVolume / 100).toLocaleString()} (${purchases.length} purchases)`)

      // Calculate sell volume from Transaction table
      // Sell transactions are debits with "Sold X TOKEN tokens" in description
      const sellTransactions = await prisma.transaction.findMany({
        where: {
          type: 'debit',
          status: 'completed',
          description: {
            contains: `Sold`
          },
          AND: {
            description: {
              contains: token.symbol
            }
          }
        },
        select: {
          amount: true
        }
      })

      const sellVolume = sellTransactions.reduce((sum, t) => sum + t.amount, 0)
      console.log(`  Sell volume: ₦${(sellVolume / 100).toLocaleString()} (${sellTransactions.length} sales)`)

      // Total volume = buy + sell
      const totalVolume = buyVolume + sellVolume
      console.log(`  Total volume: ₦${(totalVolume / 100).toLocaleString()}`)
      console.log(`  Current stored volume: ₦${(token.volume / 100).toLocaleString()}`)

      // Update token with correct volume
      if (totalVolume !== token.volume) {
        await prisma.token.update({
          where: { id: token.id },
          data: { volume: totalVolume }
        })
        console.log(`  ✓ Updated volume from ₦${(token.volume / 100).toLocaleString()} to ₦${(totalVolume / 100).toLocaleString()}`)
      } else {
        console.log(`  ✓ Volume is already correct`)
      }
      console.log()
    }

    console.log('Volume recalculation complete!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixTokenVolumes()
