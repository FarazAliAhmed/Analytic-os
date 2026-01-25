import { prisma } from '../src/lib/prisma'

async function checkAllUsers() {
  try {
    console.log('=== All Users in Database ===\n')

    const users = await prisma.user.findMany({
      include: {
        wallet: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (users.length === 0) {
      console.log('No users found')
      return
    }

    console.log(`Total users: ${users.length}\n`)

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Username: ${user.username}`)
      console.log(`   Name: ${user.firstName} ${user.lastName}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log(`   Has Wallet: ${user.wallet ? '✅ Yes' : '❌ No'}`)
      if (user.wallet) {
        console.log(`   Account: ${user.wallet.accountNumber}`)
      }
      console.log()
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAllUsers()
