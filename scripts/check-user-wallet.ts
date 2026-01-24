import { prisma } from '../src/lib/prisma'

async function checkUserWallet() {
  try {
    const email = 'alifaraz2256@gmail.com'
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
        accounts: true
      }
    })

    if (!user) {
      console.log('User not found')
      return
    }

    console.log('\n📧 User:', user.email)
    console.log('   ID:', user.id)
    console.log('   Name:', user.firstName, user.lastName)
    console.log('   Username:', user.username)
    console.log('   UserId:', user.userId)
    console.log('\n💳 Wallet:', user.wallet ? 'EXISTS' : 'MISSING')
    
    if (user.wallet) {
      console.log('   Account Number:', user.wallet.accountNumber)
      console.log('   Bank:', user.wallet.bankName)
      console.log('   Account Name:', user.wallet.accountName)
      console.log('   Balance:', user.wallet.balance / 100, 'NGN')
    }

    console.log('\n🔐 OAuth Accounts:', user.accounts.length)
    user.accounts.forEach(acc => {
      console.log(`   - ${acc.provider} (${acc.providerAccountId})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserWallet()
