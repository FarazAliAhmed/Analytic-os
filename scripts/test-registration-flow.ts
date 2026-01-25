import { prisma } from '../src/lib/prisma'
import { hashPassword } from '../src/lib/auth/password'
import { createReservedAccount } from '../src/lib/monnify'
import { generateUserId } from '../src/lib/user-id'

async function testRegistrationFlow() {
  const testEmail = `test_${Date.now()}@example.com`
  
  try {
    console.log('=== Testing Registration Flow ===\n')
    console.log('Creating test user:', testEmail)

    // Step 1: Hash password
    console.log('\n1. Hashing password...')
    const passwordHash = await hashPassword('TestPassword123!')
    console.log('✅ Password hashed')

    // Step 2: Generate user ID
    console.log('\n2. Generating user ID...')
    const userId = generateUserId()
    console.log('✅ User ID generated:', userId)

    // Step 3: Create user
    console.log('\n3. Creating user in database...')
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        username: `testuser_${Date.now()}`,
        userId: userId,
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        passwordHash,
        emailVerified: new Date(),
        role: 'USER',
      },
    })
    console.log('✅ User created:', user.id)

    // Step 4: Create wallet
    console.log('\n4. Creating Monnify reserved account...')
    try {
      const monnifyAccount = await createReservedAccount({
        email: testEmail,
        firstName: 'Test',
        lastName: 'User',
        reference: `WALLET_${user.id}_${Date.now()}`
      })
      console.log('✅ Monnify account created:')
      console.log('   Account Number:', monnifyAccount.accountNumber)
      console.log('   Bank:', monnifyAccount.bankName)
      console.log('   Name:', monnifyAccount.accountName)

      console.log('\n5. Saving wallet to database...')
      const wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          accountNumber: monnifyAccount.accountNumber,
          bankName: monnifyAccount.bankName,
          accountName: monnifyAccount.accountName,
          accountRef: monnifyAccount.accountReference,
          balance: 0
        }
      })
      console.log('✅ Wallet saved to database')

      console.log('\n=== SUCCESS ===')
      console.log('User and wallet created successfully!')
      console.log('\nUser Details:')
      console.log('  Email:', user.email)
      console.log('  ID:', user.id)
      console.log('\nWallet Details:')
      console.log('  Account:', wallet.accountNumber)
      console.log('  Bank:', wallet.bankName)

    } catch (walletError: any) {
      console.error('\n❌ WALLET CREATION FAILED:', walletError.message)
      console.error('Full error:', walletError)
      
      // Clean up user
      await prisma.user.delete({ where: { id: user.id } })
      console.log('\nUser deleted (cleanup)')
    }

  } catch (error: any) {
    console.error('\n❌ REGISTRATION FAILED:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegistrationFlow()
