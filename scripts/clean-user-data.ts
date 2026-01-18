import { prisma } from '../src/lib/prisma'
import * as dotenv from 'dotenv'

dotenv.config()

async function cleanUserData() {
  try {
    const userEmail = 'chisomalaoma@gmail.com'
    
    console.log(`\nCleaning all transaction and portfolio data for: ${userEmail}\n`)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        wallet: true
      }
    })

    if (!user) {
      console.log('❌ User not found!')
      return
    }

    console.log(`Found user: ${user.email} (${user.userId})`)
    console.log(`User ID: ${user.id}\n`)

    // Delete in order to respect foreign key constraints
    
    // 1. Delete token purchases
    const deletedPurchases = await prisma.tokenPurchase.deleteMany({
      where: { userId: user.id }
    })
    console.log(`✓ Deleted ${deletedPurchases.count} token purchases`)

    // 2. Delete token holdings
    const deletedHoldings = await prisma.tokenHolding.deleteMany({
      where: { userId: user.id }
    })
    console.log(`✓ Deleted ${deletedHoldings.count} token holdings`)

    // 3. Delete wallet transactions
    if (user.wallet) {
      const deletedTransactions = await prisma.transaction.deleteMany({
        where: { walletId: user.wallet.id }
      })
      console.log(`✓ Deleted ${deletedTransactions.count} wallet transactions`)

      // 4. Reset wallet balance to 0
      await prisma.wallet.update({
        where: { id: user.wallet.id },
        data: { balance: 0 }
      })
      console.log(`✓ Reset wallet balance to ₦0`)
    } else {
      console.log(`⚠ No wallet found for user`)
    }

    // 5. Delete notifications
    const deletedNotifications = await prisma.notification.deleteMany({
      where: { userId: user.id }
    })
    console.log(`✓ Deleted ${deletedNotifications.count} notifications`)

    // 6. Delete recent searches
    const deletedSearches = await prisma.recentSearch.deleteMany({
      where: { userId: user.id }
    })
    console.log(`✓ Deleted ${deletedSearches.count} recent searches`)

    // 7. Delete wishlist items
    const deletedWishlist = await prisma.wishlist.deleteMany({
      where: { userId: user.id }
    })
    console.log(`✓ Deleted ${deletedWishlist.count} wishlist items`)

    console.log(`\n✅ User data cleaned successfully!`)
    console.log(`\nUser ${userEmail} now has:`)
    console.log(`- Clean portfolio (no holdings)`)
    console.log(`- Clean transaction history`)
    console.log(`- Wallet balance: ₦0`)
    console.log(`- No notifications`)
    console.log(`\nReady for fresh testing! 🎉\n`)

  } catch (error) {
    console.error('❌ Cleaning failed:', error)
    throw error
  }
}

cleanUserData()
