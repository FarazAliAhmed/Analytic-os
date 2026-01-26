const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function deleteUser() {
  const email = 'farazali753077@gmail.com'
  
  try {
    console.log(`Looking for user: ${email}`)
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
        accounts: true,
      },
    })

    if (!user) {
      console.log('User not found')
      return
    }

    console.log(`Found user: ${user.firstName} ${user.lastName}`)
    console.log(`User ID: ${user.id}`)

    // Delete related data
    console.log('Deleting related data...')
    
    // Delete OAuth accounts
    await prisma.account.deleteMany({
      where: { userId: user.id },
    })
    console.log('✓ Deleted OAuth accounts')

    // Delete sessions
    await prisma.session.deleteMany({
      where: { userId: user.id },
    })
    console.log('✓ Deleted sessions')

    // Delete verification tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })
    console.log('✓ Deleted verification tokens')

    // Delete notification settings
    await prisma.notificationSettings.deleteMany({
      where: { userId: user.id },
    })
    console.log('✓ Deleted notification settings')

    // Delete notifications
    await prisma.notification.deleteMany({
      where: { userId: user.id },
    })
    console.log('✓ Deleted notifications')

    // Delete watchlist items
    await prisma.watchlist.deleteMany({
      where: { userId: user.id },
    })
    console.log('✓ Deleted watchlist items')

    // Delete transactions
    await prisma.transaction.deleteMany({
      where: { userId: user.id },
    })
    console.log('✓ Deleted transactions')

    // Delete wallet
    if (user.wallet) {
      await prisma.wallet.delete({
        where: { id: user.wallet.id },
      })
      console.log('✓ Deleted wallet')
    }

    // Delete user
    await prisma.user.delete({
      where: { id: user.id },
    })
    console.log('✓ Deleted user')

    console.log('\n✅ User deleted successfully!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteUser()
