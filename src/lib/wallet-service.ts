import { prisma } from './prisma'
import { createReservedAccount } from './monnify'

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create wallet with retry logic
 */
export async function createWalletWithRetry(params: {
  userId: string
  email: string
  firstName: string
  lastName: string
  maxRetries?: number
}): Promise<{
  success: boolean
  wallet?: any
  error?: string
}> {
  const { userId, email, firstName, lastName, maxRetries = 3 } = params
  
  let lastError: any = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[WALLET-SERVICE] Attempt ${attempt}/${maxRetries} to create wallet for ${email}`)
      
      // Check if wallet already exists
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId }
      })
      
      if (existingWallet) {
        console.log(`[WALLET-SERVICE] Wallet already exists for user ${email}`)
        return { success: true, wallet: existingWallet }
      }
      
      // Create Monnify reserved account
      const monnifyAccount = await createReservedAccount({
        email,
        firstName,
        lastName,
        reference: `WALLET_${userId}_${Date.now()}`
      })
      
      console.log(`[WALLET-SERVICE] Monnify account created: ${monnifyAccount.accountNumber}`)
      
      // Save wallet to database
      const wallet = await prisma.wallet.create({
        data: {
          userId,
          accountNumber: monnifyAccount.accountNumber,
          bankName: monnifyAccount.bankName,
          accountName: monnifyAccount.accountName,
          accountRef: monnifyAccount.accountReference,
          balance: 0
        }
      })
      
      console.log(`[WALLET-SERVICE] Wallet created successfully for ${email}`)
      return { success: true, wallet }
      
    } catch (error: any) {
      lastError = error
      console.error(`[WALLET-SERVICE] Attempt ${attempt} failed:`, error.message)
      
      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delayMs = 1000 * attempt // Exponential backoff: 1s, 2s, 3s
        console.log(`[WALLET-SERVICE] Retrying in ${delayMs}ms...`)
        await sleep(delayMs)
      }
    }
  }
  
  // All attempts failed
  console.error(`[WALLET-SERVICE] Failed to create wallet after ${maxRetries} attempts`)
  return {
    success: false,
    error: lastError?.message || 'Failed to create wallet'
  }
}

/**
 * Ensure user has a wallet (create if missing)
 */
export async function ensureUserHasWallet(userId: string): Promise<boolean> {
  try {
    // Check if wallet exists
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    })
    
    if (wallet) {
      return true
    }
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        username: true
      }
    })
    
    if (!user) {
      console.error('[WALLET-SERVICE] User not found:', userId)
      return false
    }
    
    // Create wallet
    const firstName = user.firstName || user.username || user.email.split('@')[0]
    const lastName = user.lastName || user.username || user.email.split('@')[0]
    
    const result = await createWalletWithRetry({
      userId,
      email: user.email,
      firstName,
      lastName
    })
    
    return result.success
  } catch (error) {
    console.error('[WALLET-SERVICE] Error ensuring wallet:', error)
    return false
  }
}
