import { prisma } from '../src/lib/prisma'

async function checkOAuthAccounts() {
  try {
    console.log('=== OAuth Accounts ===\n')

    const accounts = await prisma.account.findMany({
      include: {
        user: true
      }
    })

    if (accounts.length === 0) {
      console.log('No OAuth accounts found')
      return
    }

    console.log(`Total OAuth accounts: ${accounts.length}\n`)

    accounts.forEach((account, index) => {
      console.log(`${index + 1}. Provider: ${account.provider}`)
      console.log(`   User Email: ${account.user.email}`)
      console.log(`   User ID: ${account.userId}`)
      console.log(`   Provider Account ID: ${account.providerAccountId}`)
      console.log()
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOAuthAccounts()
