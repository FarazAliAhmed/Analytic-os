import { prisma } from '../src/lib/prisma'

async function listAllWallets() {
  try {
    const wallets = await prisma.wallet.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    console.log(`\nFound ${wallets.length} wallets:\n`)

    wallets.forEach(wallet => {
      console.log(`📧 ${wallet.user.email}`)
      console.log(`   Name: ${wallet.user.firstName} ${wallet.user.lastName}`)
      console.log(`   Account: ${wallet.accountNumber} (${wallet.bankName})`)
      console.log(`   Ref: ${wallet.accountRef}`)
      console.log(`   Balance: ₦${(wallet.balance / 100).toFixed(2)}`)
      console.log('')
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listAllWallets()
