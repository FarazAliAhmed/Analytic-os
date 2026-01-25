import { prisma } from '../src/lib/prisma'
import { createReservedAccount } from '../src/lib/monnify'

async function debugWalletCreation() {
  try {
    console.log('=== Debugging Wallet Creation ===\n')

    // Check environment variables
    console.log('1. Checking Monnify Configuration:')
    console.log('   MONNIFY_BASE_URL:', process.env.MONNIFY_BASE_URL || 'NOT SET')
    console.log('   MONNIFY_API_KEY:', process.env.MONNIFY_API_KEY ? 'SET' : 'NOT SET')
    console.log('   MONNIFY_SECRET_KEY:', process.env.MONNIFY_SECRET_KEY ? 'SET' : 'NOT SET')
    console.log('   MONNIFY_CONTRACT_CODE:', process.env.MONNIFY_CONTRACT_CODE || 'NOT SET')
    console.log()

    // Check database connection
    console.log('2. Checking Database Connection:')
    const userCount = await prisma.user.count()
    const walletCount = await prisma.wallet.count()
    console.log(`   Users in DB: ${userCount}`)
    console.log(`   Wallets in DB: ${walletCount}`)
    console.log()

    // Find users without wallets
    console.log('3. Finding Users Without Wallets:')
    const usersWithoutWallets = await prisma.user.findMany({
      where: {
        wallet: null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      },
      take: 5
    })

    if (usersWithoutWallets.length === 0) {
      console.log('   ✅ All users have wallets!')
    } else {
      console.log(`   ⚠️  Found ${usersWithoutWallets.length} users without wallets:`)
      usersWithoutWallets.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (Created: ${user.createdAt})`)
      })
    }
    console.log()

    // Test Monnify API connection
    console.log('4. Testing Monnify API Connection:')
    try {
      const testAccount = await createReservedAccount({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        reference: `TEST_${Date.now()}`
      })
      console.log('   ✅ Monnify API is working!')
      console.log('   Test Account:', testAccount)
    } catch (monnifyError: any) {
      console.log('   ❌ Monnify API Error:', monnifyError.message)
    }
    console.log()

    // Check recent user registrations
    console.log('5. Recent User Registrations:')
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        wallet: true
      }
    })

    if (recentUsers.length === 0) {
      console.log('   No users found')
    } else {
      recentUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`)
        console.log(`      Created: ${user.createdAt}`)
        console.log(`      Has Wallet: ${user.wallet ? '✅ Yes' : '❌ No'}`)
        if (user.wallet) {
          console.log(`      Account: ${user.wallet.accountNumber} (${user.wallet.bankName})`)
        }
      })
    }

  } catch (error) {
    console.error('❌ Debug Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugWalletCreation()
