import { prisma } from '../src/lib/prisma'
import { createReservedAccount } from '../src/lib/monnify'

async function createWalletsForOAuthUsers() {
  try {
    console.log('Finding OAuth users without wallets...')

    // Find all users without wallets
    const usersWithoutWallets = await prisma.user.findMany({
      where: {
        wallet: null
      },
      include: {
        accounts: true
      }
    })

    console.log(`Found ${usersWithoutWallets.length} users without wallets`)

    for (const user of usersWithoutWallets) {
      console.log(`\nProcessing user: ${user.email}`)
      
      try {
        // Create Monnify account
        console.log('Creating Monnify account...')
        const monnifyAccount = await createReservedAccount({
          email: user.email,
          firstName: user.firstName || 'User',
          lastName: user.lastName || 'User',
          reference: `WALLET_${user.id}_${Date.now()}`
        })

        console.log('Monnify account created:', monnifyAccount.accountNumber)

        // Create wallet in database
        await prisma.wallet.create({
          data: {
            userId: user.id,
            accountNumber: monnifyAccount.accountNumber,
            bankName: monnifyAccount.bankName,
            accountName: monnifyAccount.accountName,
            accountRef: monnifyAccount.accountReference,
            balance: 0
          }
        })

        console.log(`✅ Wallet created successfully for ${user.email}`)
        console.log(`   Account Number: ${monnifyAccount.accountNumber}`)
        console.log(`   Bank: ${monnifyAccount.bankName}`)
      } catch (error) {
        console.error(`❌ Failed to create wallet for ${user.email}:`, error)
        if (error instanceof Error) {
          console.error('   Error:', error.message)
        }
      }
    }

    console.log('\n✅ Wallet creation process completed')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createWalletsForOAuthUsers()
