import { prisma } from '../src/lib/prisma'
import { createReservedAccount } from '../src/lib/monnify'

async function ensureOAuthWallets() {
  try {
    console.log('Checking for OAuth users without wallets...\n')

    // Find all users without wallets
    const usersWithoutWallets = await prisma.user.findMany({
      where: {
        wallet: null
      },
      include: {
        accounts: true
      }
    })

    console.log(`Found ${usersWithoutWallets.length} users without wallets\n`)

    for (const user of usersWithoutWallets) {
      const hasOAuthAccount = user.accounts.length > 0
      
      console.log(`\n📧 ${user.email}`)
      console.log(`   Name: ${user.firstName} ${user.lastName}`)
      console.log(`   OAuth: ${hasOAuthAccount ? 'Yes' : 'No'}`)
      
      if (hasOAuthAccount) {
        try {
          console.log('   Creating wallet...')
          
          const monnifyAccount = await createReservedAccount({
            email: user.email,
            firstName: user.firstName || user.name?.split(' ')[0] || 'User',
            lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || 'User',
            reference: `WALLET_${user.id}_${Date.now()}`
          })

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

          console.log(`   ✅ Wallet created: ${monnifyAccount.accountNumber}`)
        } catch (error) {
          console.error(`   ❌ Failed to create wallet:`, error)
        }
      } else {
        console.log('   ⏭️  Skipping (not OAuth user)')
      }
    }

    console.log('\n✅ Done!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

ensureOAuthWallets()
