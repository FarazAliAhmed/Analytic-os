import { prisma } from '@/lib/prisma'
import { createReservedAccount } from '@/lib/monnify'

// Types
export interface CreateWalletParams {
  userId: string
  email: string
  name: string
}

export interface CreditWalletParams {
  walletId: string
  amount: number // in kobo
  description: string
  reference: string
  monnifyRef: string
}

export interface WalletResult {
  success: boolean
  data?: any
  error?: string
}

// Create wallet for user (called on signup)
export async function createWallet(params: CreateWalletParams): Promise<WalletResult> {
  try {
    // Check if wallet already exists
    const existing = await prisma.wallet.findUnique({
      where: { userId: params.userId }
    })

    if (existing) {
      return { success: true, data: existing }
    }

    // Create wallet (account details from Monnify API)
    const monnifyAccount = await createReservedAccount({
      email: params.email,
      firstName: params.name.split(' ')[0],
      lastName: params.name.split(' ').slice(1).join(' ') || params.name.split(' ')[0],
      reference: `WALLET_${params.userId}_${Date.now()}`
    })

    const wallet = await prisma.wallet.create({
      data: {
        userId: params.userId,
        accountNumber: monnifyAccount.accountNumber,
        bankName: monnifyAccount.bankName,
        accountName: monnifyAccount.accountName,
        accountRef: monnifyAccount.accountReference,
        balance: 0
      }
    })

    return { success: true, data: wallet }
  } catch (error) {
    console.error('createWallet error:', error)
    return { success: false, error: 'Failed to create wallet' }
  }
}

// Get wallet by user ID
export async function getWalletByUserId(userId: string) {
  return prisma.wallet.findUnique({
    where: { userId },
    include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } }
  })
}

// Credit wallet (called when payment detected)
export async function creditWallet(params: CreditWalletParams): Promise<WalletResult> {
  try {
    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Check for duplicate reference
      const existing = await tx.transaction.findUnique({
        where: { reference: params.reference }
      })

      if (existing) {
        return { success: false, error: 'Duplicate transaction', data: existing }
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          walletId: params.walletId,
          type: 'credit',
          amount: params.amount,
          description: params.description,
          reference: params.reference,
          monnifyRef: params.monnifyRef,
          status: 'completed'
        }
      })

      // Update wallet balance
      const wallet = await tx.wallet.update({
        where: { id: params.walletId },
        data: { balance: { increment: params.amount } }
      })

      return { success: true, data: { transaction, wallet } }
    })

    return result
  } catch (error) {
    console.error('creditWallet error:', error)
    return { success: false, error: 'Failed to credit wallet' }
  }
}

// Format balance for display (kobo to NGN)
export function formatKoboToNaira(kobo: number): string {
  const naira = kobo / 100
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(naira)
}
