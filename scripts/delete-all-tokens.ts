import { prisma } from '../src/lib/prisma'

async function deleteAllTokens() {
  try {
    console.log('Starting to delete all tokens and related data...\n')

    // Get count of tokens
    const tokenCount = await prisma.token.count()
    console.log(`Found ${tokenCount} tokens to delete`)

    // Delete related data first (due to foreign key constraints)
    
    // Delete token holdings
    const holdingsDeleted = await prisma.tokenHolding.deleteMany({})
    console.log(`✅ Deleted ${holdingsDeleted.count} token holdings`)

    // Delete token purchases
    const purchasesDeleted = await prisma.tokenPurchase.deleteMany({})
    console.log(`✅ Deleted ${purchasesDeleted.count} token purchases`)

    // Delete all tokens
    const tokensDeleted = await prisma.token.deleteMany({})
    console.log(`✅ Deleted ${tokensDeleted.count} tokens`)

    console.log('\n✅ All tokens and related data deleted successfully!')
  } catch (error) {
    console.error('❌ Error deleting tokens:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteAllTokens()
