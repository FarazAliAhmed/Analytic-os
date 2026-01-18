import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function checkUserFormat() {
  try {
    console.log('Checking user ID formats in database...\n')

    // Get a sample user
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        userId: true,
        email: true,
        username: true
      }
    })

    if (user) {
      console.log('Sample User:')
      console.log('  Internal ID (id):', user.id)
      console.log('  Custom User ID (userId):', user.userId)
      console.log('  Email:', user.email)
      console.log('  Username:', user.username)
      console.log()
    }

    // Check TokenPurchase table
    const purchase = await prisma.tokenPurchase.findFirst({
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            id: true,
            userId: true
          }
        }
      }
    })

    if (purchase) {
      console.log('Sample TokenPurchase:')
      console.log('  Purchase ID:', purchase.id)
      console.log('  Stored userId field:', purchase.userId)
      console.log('  User.id (internal):', purchase.user.id)
      console.log('  User.userId (custom):', purchase.user.userId)
      console.log()
    }

    // Check Transaction table
    const transaction = await prisma.transaction.findFirst({
      where: {
        description: {
          contains: 'Sold'
        }
      },
      select: {
        id: true,
        description: true,
        wallet: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                userId: true
              }
            }
          }
        }
      }
    })

    if (transaction) {
      console.log('Sample Sell Transaction:')
      console.log('  Transaction ID:', transaction.id)
      console.log('  Description:', transaction.description)
      console.log('  Wallet.userId field:', transaction.wallet.userId)
      console.log('  User.id (internal):', transaction.wallet.user.id)
      console.log('  User.userId (custom):', transaction.wallet.user.userId)
      console.log()
    }

    console.log('✅ Check complete!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserFormat()
