import { prisma } from '../src/lib/prisma'
import { createReservedAccount } from '../src/lib/monnify'

async function createMissingWallets() {
  try {
    console.log('=== Creating Missing Wallets ===\n')

    // Find all users without wallets
    const usersWithoutWallets = await prisma.user.findMany({
      where: {
        wallet: null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true
      }
    })

    if (usersWithoutWallets.length === 0) {
      console.log('✅ All users already have wallets!')
      return
    }

    console.log(`Found ${usersWithoutWallets.length} users without wallets\n`)

    for (const user of usersWithoutWallets) {
      try {
        console.log(`Creating wallet for: ${user.email}`)
        
        // Use firstName and lastName, fallback to username or email
        const firstName = user.firstName || user.username || user.email.split('@')[0]
        const lastName = user.lastName || user.username || user.email.split('@')[0]

        const monnifyAccount = await createReservedAccount({
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          reference: `WALLET_${user.id}_${Date.now()}`
        })

        const wallet = await prisma.wallet.create({
          data: {
            userId: user.id,
            accountNumber: monnifyAccount.accountNumber,
            bankName: monnifyAccount.bankName,
            accountName: monnifyAccount.accountName,
            accountRef: monnifyAccount.accountReference,
            balance: 0
          }
        })

        console.log(`✅ Wallet created successfully!`)
        console.log(`   Account: ${wallet.accountNumber}`)
        console.log(`   Bank: ${wallet.bankName}`)
        console.log(`   Name: ${wallet.accountName}\n`)
      } catch (error: any) {
        console.error(`❌ Failed to create wallet for ${user.email}:`, error.message)
        console.log()
      }
    }

    console.log('=== Summary ===')
    const finalWalletCount = await prisma.wallet.count()
    const finalUserCount = await prisma.user.count()
    console.log(`Total Users: ${finalUserCount}`)
    console.log(`Total Wallets: ${finalWalletCount}`)
    console.log(`Users without wallets: ${finalUserCount - finalWalletCount}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createMissingWallets()
