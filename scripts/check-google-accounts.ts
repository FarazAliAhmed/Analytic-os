import { prisma } from '../src/lib/prisma'

async function checkGoogleAccounts() {
  try {
    console.log('Checking all users with Google OAuth accounts...\n')
    
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          where: {
            provider: 'google'
          }
        },
        wallet: true
      }
    })

    for (const user of users) {
      if (user.accounts.length > 0) {
        console.log(`Email: ${user.email}`)
        console.log(`User ID: ${user.id}`)
        console.log(`Username: ${user.username}`)
        console.log(`Google Provider ID: ${user.accounts[0].providerAccountId}`)
        console.log(`Wallet Balance: ₦${user.wallet ? (user.wallet.balance / 100).toFixed(2) : '0.00'}`)
        console.log(`Created: ${user.createdAt}`)
        console.log('---')
      }
    }

    console.log('\n✅ Check complete')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkGoogleAccounts()
