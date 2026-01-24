import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createReservedAccount } from '@/lib/monnify'

export async function POST() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user already has a wallet
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    if (existingWallet) {
      return NextResponse.json({
        success: true,
        message: 'Wallet already exists',
        wallet: existingWallet
      })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Create Monnify account
    console.log('Creating Monnify account for:', user.email)
    const monnifyAccount = await createReservedAccount({
      email: user.email,
      firstName: user.firstName || user.name?.split(' ')[0] || 'User',
      lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || 'User',
      reference: `WALLET_${user.id}_${Date.now()}`
    })

    // Create wallet in database
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

    console.log('Wallet created successfully for:', user.email)

    return NextResponse.json({
      success: true,
      message: 'Wallet created successfully',
      wallet
    })
  } catch (error) {
    console.error('Error ensuring wallet:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create wallet' 
      },
      { status: 500 }
    )
  }
}
