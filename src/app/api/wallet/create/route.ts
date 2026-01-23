// src/app/api/wallet/create/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createReservedAccount } from '@/lib/monnify'

/**
 * GET /api/wallet/create - Get existing wallet or return null
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Check if wallet exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId }
    })

    if (existingWallet) {
      return NextResponse.json({
        success: true,
        data: {
          accountNumber: existingWallet.accountNumber,
          bankName: existingWallet.bankName,
          accountName: existingWallet.accountName,
          balance: existingWallet.balance
        }
      })
    }

    // No wallet found
    return NextResponse.json({
      success: true,
      data: null
    })
  } catch (error) {
    console.error('Wallet fetch error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallet'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

/**
 * POST /api/wallet/create - Create a new wallet
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user data from database (has full name and phone)
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Use database fields for Monnify
    const email = user.email
    const firstName = user.firstName || user.username || 'User'
    const lastName = user.lastName || user.firstName || 'User'

    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId }
    })

    if (existingWallet) {
      return NextResponse.json({
        success: true,
        data: {
          accountNumber: existingWallet.accountNumber,
          bankName: existingWallet.bankName,
          accountName: existingWallet.accountName
        }
      })
    }

    // Create Monnify reserved account
    const monnifyAccount = await createReservedAccount({
      email,
      firstName,
      lastName,
      reference: `WALLET_${userId}_${Date.now()}`
    })

    // Create wallet in database
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

    return NextResponse.json({
      success: true,
      data: {
        accountNumber: wallet.accountNumber,
        bankName: wallet.bankName,
        accountName: wallet.accountName
      }
    })
  } catch (error) {
    console.error('Wallet creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create wallet'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
