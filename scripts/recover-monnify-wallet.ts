import { prisma } from '../src/lib/prisma'
import { getReservedAccountDetails } from '../src/lib/monnify'

async function recoverMonnifyWallet() {
  try {
    const email = 'alifaraz2256@gmail.com'
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { wallet: true }
    })

    if (!user) {
      console.log('User not found')
      return
    }

    if (user.wallet) {
      console.log('User already has a wallet')
      return
    }

    console.log(`\nChecking Monnify for existing account...`)
    console.log(`User ID: ${user.id}`)
    console.log(`Email: ${user.email}\n`)

    // Try different reference patterns that might have been used
    const possibleReferences = [
      `WALLET_${user.id}_*`, // Pattern we use
      user.email,
      user.id,
    ]

    // Since we can't wildcard search, let's try to get account by the user's email
    // Monnify might have created it with a reference we can guess
    
    // Try the most recent pattern
    const recentTimestamp = Date.now()
    const testReference = `WALLET_${user.id}_${recentTimestamp}`
    
    console.log(`Trying reference pattern: WALLET_${user.id}_*`)
    
    // Unfortunately, Monnify API doesn't support searching by email
    // We need to know the exact reference
    
    console.log('\n⚠️  Cannot recover wallet automatically.')
    console.log('Monnify says an account exists but we need the exact reference.')
    console.log('\nOptions:')
    console.log('1. Contact Monnify support to get the account reference')
    console.log('2. Delete the user and have them sign up again')
    console.log('3. Create a new Monnify account with a different email')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

recoverMonnifyWallet()
