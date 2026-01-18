import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function checkVolume() {
  try {
    console.log('Checking token volumes...\n')

    // Get all tokens with their volume
    const tokens = await prisma.token.findMany({
      select: {
        symbol: true,
        name: true,
        volume: true,
        transactionCount: true,
      },
      orderBy: { symbol: 'asc' }
    })

    console.log('Current Token Volumes:')
    console.log('='.repeat(60))
    tokens.forEach(token => {
      console.log(`${token.symbol} (${token.name}):`)
      console.log(`  Volume: ₦${(token.volume / 100).toLocaleString()} (${token.volume} kobo)`)
      console.log(`  Transactions: ${token.transactionCount}`)
      console.log()
    })

    // Calculate actual volume from purchases
    console.log('\nCalculating actual volume from TokenPurchase records...')
    console.log('='.repeat(60))
    
    for (const token of tokens) {
      const purchases = await prisma.tokenPurchase.findMany({
        where: {
          tokenId: token.symbol,
          status: 'completed'
        },
        select: {
          totalAmountKobo: true,
          createdAt: true
        }
      })

      const totalPurchaseVolume = purchases.reduce((sum, p) => sum + p.totalAmountKobo, 0)
      
      console.log(`${token.symbol}:`)
      console.log(`  Purchase records: ${purchases.length}`)
      console.log(`  Total purchase volume: ₦${(totalPurchaseVolume / 100).toLocaleString()} (${totalPurchaseVolume} kobo)`)
      console.log(`  Stored volume: ₦${(token.volume / 100).toLocaleString()} (${token.volume} kobo)`)
      console.log(`  Difference: ₦${((totalPurchaseVolume - token.volume) / 100).toLocaleString()}`)
      console.log()
    }

    // Check transactions table for sell volume
    console.log('\nChecking Transaction records for sell volume...')
    console.log('='.repeat(60))
    
    const transactions = await prisma.transaction.findMany({
      where: {
        type: 'debit',
        status: 'completed',
        description: {
          contains: 'Sold'
        }
      },
      select: {
        amount: true,
        description: true,
        createdAt: true
      }
    })

    const totalSellVolume = transactions.reduce((sum, t) => sum + t.amount, 0)
    console.log(`Total sell transactions: ${transactions.length}`)
    console.log(`Total sell volume: ₦${(totalSellVolume / 100).toLocaleString()} (${totalSellVolume} kobo)`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVolume()
