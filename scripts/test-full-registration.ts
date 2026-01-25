import { prisma } from '../src/lib/prisma'
import { hashPassword } from '../src/lib/auth/password'
import { generateUserId } from '../src/lib/user-id'
import { createWalletWithRetry } from '../src/lib/wallet-service'

async function testFullRegistration() {
  const testEmail = `testuser_${Date.now()}@example.com`
  const firstName = 'John'
  const lastName = 'Doe'
  
  try {
    console.log('=== Testing Full Registration Flow ===\n')
    console.log('Test Email:', testEmail)
    console.log()

    // Step 1: Check if email exists
    console.log('Step 1: Checking if email exists...')
    const existingEmail = await prisma.user.findUnique({
      where: { email: testEmail },
    })
    if (existingEmail) {
      console.log('❌ Email already exists')
      return
    }
    console.log('✅ Email is available')
    console.log()

    // Step 2: Hash password
    console.log('Step 2: Hashing password...')
    const passwordHash = await hashPassword('TestPassword123!')
    console.log('✅ Password hashed')
    console.log()

    // Step 3: Generate user ID
    console.log('Step 3: Generating user ID...')
    const userId = generateUserId()
    console.log('✅ User ID generated:', userId)
    console.log()

    // Step 4: Create user
    console.log('Step 4: Creating user in database...')
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        username: `testuser_${Date.now()}`,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        phone: '+1234567890',
        passwordHash,
        emailVerified: new Date(),
        role: 'USER',
      },
    })
    console.log('✅ User created:', user.id)
    console.log('   Email:', user.email)
    console.log('   Name:', user.firstName, user.lastName)
    console.log()

    // Step 5: Create wallet with retry logic
    console.log('Step 5: Creating wallet with retry logic...')
    console.log('   Max retries: 3')
    console.log('   Exponential backoff: 1s, 2s, 3s')
    console.log()
    
    const walletResult = await createWalletWithRetry({
      userId: user.id,
      email: testEmail,
      firstName: firstName,
      lastName: lastName,
      maxRetries: 3
    })

    if (walletResult.success) {
      console.log('✅ Wallet created successfully!')
      console.log('   Account Number:', walletResult.wallet.accountNumber)
      console.log('   Bank:', walletResult.wallet.bankName)
      console.log('   Account Name:', walletResult.wallet.accountName)
      console.log('   Reference:', walletResult.wallet.accountRef)
      console.log()
      
      // Verify wallet in database
      const verifyWallet = await prisma.wallet.findUnique({
        where: { userId: user.id }
      })
      
      if (verifyWallet) {
        console.log('✅ Wallet verified in database')
      } else {
        console.log('❌ Wallet NOT found in database!')
      }
    } else {
      console.log('❌ Wallet creation failed:', walletResult.error)
      console.log()
      console.log('User was created but wallet failed.')
      console.log('This is the issue you\'re experiencing!')
    }

    console.log()
    console.log('=== Registration Test Complete ===')
    
    // Check final state
    const finalUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { wallet: true }
    })
    
    console.log()
    console.log('Final State:')
    console.log('  User exists:', !!finalUser)
    console.log('  Wallet exists:', !!finalUser?.wallet)
    
    if (finalUser && !finalUser.wallet) {
      console.log()
      console.log('⚠️  USER CREATED WITHOUT WALLET - THIS IS THE BUG!')
    }

  } catch (error: any) {
    console.error()
    console.error('❌ REGISTRATION FAILED')
    console.error('Error:', error.message)
    console.error()
    console.error('Stack trace:')
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

testFullRegistration()
