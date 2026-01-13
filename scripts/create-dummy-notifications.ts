// scripts/create-dummy-notifications.ts

import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'alifaraz2256@gmail.com'

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.error('User not found:', email)
    return
  }

  console.log('Found user:', user.email, 'ID:', user.id)

  // Create dummy notifications
  const notifications = [
    {
      type: 'transaction' as const,
      title: 'Wallet Funded Successfully',
      message: 'Your wallet has been credited with ₦50,000.00 via bank transfer.',
      isRead: false
    },
    {
      type: 'transaction' as const,
      title: 'Withdrawal Initiated',
      message: 'Your withdrawal of ₦10,000.00 to ****1234 has been processed.',
      isRead: false
    },
    {
      type: 'alert' as const,
      title: 'Security Alert',
      message: 'A new device logged into your account. If this wasn\'t you, please change your password.',
      isRead: false
    },
    {
      type: 'transaction' as const,
      title: 'Investment Purchase',
      message: 'You successfully purchased 500 units of PYSK at $0.0054 per unit.',
      isRead: true
    },
    {
      type: 'alert' as const,
      title: 'Price Alert',
      message: 'PYSK has increased by 10% in the last hour. Check your portfolio!',
      isRead: true
    },
    {
      type: 'alert' as const,
      title: 'Account Update',
      message: 'Your profile information has been updated successfully.',
      isRead: true
    }
  ]

  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        ...notif
      }
    })
    console.log('Created notification:', notif.title)
  }

  console.log('\nDone! Created', notifications.length, 'notifications for', email)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
