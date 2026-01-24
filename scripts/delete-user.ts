import { prisma } from '../src/lib/prisma'

async function deleteUser() {
  const emails = process.argv.slice(2)
  
  if (emails.length === 0) {
    console.log('Usage: npx tsx scripts/delete-user.ts <email1> [email2] ...')
    process.exit(1)
  }
  
  for (const email of emails) {
    try {
      console.log(`\nLooking for user: ${email}`)
      
      // Find the user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          wallet: true,
          accounts: true,
          tokenPurchases: true,
          tokenHoldings: true,
          bankAccounts: true,
          notifications: true,
          settings: true,
          priceAlerts: true
        }
      })

      if (!user) {
        console.log(`❌ User not found: ${email}`)
        continue
      }

      console.log(`Found user: ${user.email} (ID: ${user.id})`)
      console.log(`  - Wallet: ${user.wallet ? 'Yes' : 'No'}`)
      console.log(`  - OAuth Accounts: ${user.accounts.length}`)
      console.log(`  - Token Purchases: ${user.tokenPurchases.length}`)
      console.log(`  - Token Holdings: ${user.tokenHoldings.length}`)
      console.log(`  - Bank Accounts: ${user.bankAccounts.length}`)

      // Delete related records first (due to foreign key constraints)
      
      // Delete wallet
      if (user.wallet) {
        await prisma.wallet.delete({
          where: { userId: user.id }
        })
        console.log('✅ Deleted wallet')
      }

      // Delete OAuth accounts
      if (user.accounts.length > 0) {
        await prisma.account.deleteMany({
          where: { userId: user.id }
        })
        console.log(`✅ Deleted ${user.accounts.length} OAuth account(s)`)
      }

      // Delete token purchases
      if (user.tokenPurchases.length > 0) {
        await prisma.tokenPurchase.deleteMany({
          where: { userId: user.id }
        })
        console.log(`✅ Deleted ${user.tokenPurchases.length} token purchase(s)`)
      }

      // Delete token holdings
      if (user.tokenHoldings.length > 0) {
        await prisma.tokenHolding.deleteMany({
          where: { userId: user.id }
        })
        console.log(`✅ Deleted ${user.tokenHoldings.length} token holding(s)`)
      }

      // Delete bank accounts
      if (user.bankAccounts.length > 0) {
        await prisma.bankAccount.deleteMany({
          where: { userId: user.id }
        })
        console.log(`✅ Deleted ${user.bankAccounts.length} bank account(s)`)
      }

      // Delete notifications
      if (user.notifications.length > 0) {
        await prisma.notification.deleteMany({
          where: { userId: user.id }
        })
        console.log(`✅ Deleted ${user.notifications.length} notification(s)`)
      }

      // Delete price alerts
      if (user.priceAlerts.length > 0) {
        await prisma.priceAlert.deleteMany({
          where: { userId: user.id }
        })
        console.log(`✅ Deleted ${user.priceAlerts.length} price alert(s)`)
      }

      // Delete user settings if exists
      try {
        await prisma.userSettings.deleteMany({
          where: { userId: user.id }
        })
        console.log('✅ Deleted user settings')
      } catch (e) {
        // Settings might not exist
      }

      // Finally, delete the user
      await prisma.user.delete({
        where: { id: user.id }
      })

      console.log(`✅ Successfully deleted user: ${email}`)
    } catch (error) {
      console.error(`❌ Error deleting user ${email}:`, error)
    }
  }
  
  if (emails.length > 0) {
    console.log('\n✅ Done!')
  }
  await prisma.$disconnect()
}

deleteUser()
