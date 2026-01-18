import { prisma } from '../src/lib/prisma'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function migrateFractionalTokens() {
  try {
    console.log('Starting fractional token migration...\n')

    // Get all token holdings
    const holdings = await prisma.tokenHolding.findMany({
      include: {
        user: {
          select: {
            email: true,
            userId: true
          }
        }
      }
    })

    console.log(`Found ${holdings.length} holdings to migrate\n`)

    // Get all token purchases to calculate totalInvested
    const purchases = await prisma.tokenPurchase.findMany({
      where: {
        status: 'completed'
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group purchases by userId and tokenId
    const purchasesByUserToken = new Map<string, typeof purchases>()
    for (const purchase of purchases) {
      const key = `${purchase.userId}-${purchase.tokenId}`
      if (!purchasesByUserToken.has(key)) {
        purchasesByUserToken.set(key, [])
      }
      purchasesByUserToken.get(key)!.push(purchase)
    }

    let migratedCount = 0

    for (const holding of holdings) {
      const key = `${holding.userId}-${holding.tokenId}`
      const userPurchases = purchasesByUserToken.get(key) || []

      // Calculate total invested from all purchases
      const totalInvested = userPurchases.reduce((sum, p) => sum + p.nairaAmountSpent, 0)

      // If no purchases found, estimate from current quantity and average price
      const estimatedInvested = totalInvested > 0 
        ? totalInvested 
        : Number(holding.quantity) * (Number(holding.averagePrice) / 100)

      console.log(`Migrating holding for ${holding.user.email} (${holding.user.userId})`)
      console.log(`  Token: ${holding.tokenId}`)
      console.log(`  Quantity: ${holding.quantity}`)
      console.log(`  Total Invested: ₦${estimatedInvested.toLocaleString()}`)

      // Update holding with new fields
      await prisma.tokenHolding.update({
        where: { id: holding.id },
        data: {
          totalInvested: estimatedInvested,
          accumulatedYield: 0, // Start fresh
          lastYieldUpdate: new Date()
        }
      })

      migratedCount++
      console.log(`  ✓ Migrated\n`)
    }

    console.log(`\n✅ Migration complete!`)
    console.log(`   Total holdings migrated: ${migratedCount}`)

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

migrateFractionalTokens()
