import { prisma } from '../src/lib/prisma'

async function checkUserWallet() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'faraz59995@gmail.com' },
      include: {
        wallet: true
      }
    })

    if (!user) {
      console.log('User not found')
      return
    }

    console.log('=== User Details ===')
    console.log('Email:', user.email)
    console.log('Username:', user.username)
    console.log('First Name:', user.firstName)
    console.log('Last Name:', user.lastName)
    console.log('User ID:', user.userId)
    console.log('Role:', user.role)
    console.log('Created:', user.createdAt)
    console.log()

    if (user.wallet) {
      console.log('=== Wallet Details ===')
      console.log('Account Number:', user.wallet.accountNumber)
      console.log('Bank Name:', user.wallet.bankName)
      console.log('Account Name:', user.wallet.accountName)
      console.log('Balance:', user.wallet.balance)
      console.log('Account Ref:', user.wallet.accountRef)
      console.log('✅ Wallet exists!')
    } else {
      console.log('❌ No wallet found for this user')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserWallet()
