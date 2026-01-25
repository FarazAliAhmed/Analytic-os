import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ensureUserHasWallet } from '@/lib/wallet-service'

/**
 * API endpoint to ensure the current user has a wallet
 * This is called automatically when user logs in or accesses dashboard
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[WALLET-ENSURE] Checking wallet for user:', session.user.email)

    // Ensure user has a wallet
    const result = await ensureUserHasWallet(session.user.id)

    if (result) {
      console.log('[WALLET-ENSURE] User has wallet:', session.user.email)
      return NextResponse.json({ 
        success: true,
        hasWallet: true 
      })
    } else {
      console.error('[WALLET-ENSURE] Failed to ensure wallet for:', session.user.email)
      
      // Get more details about the failure
      const { prisma } = await import('@/lib/prisma')
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, firstName: true, lastName: true }
      })
      
      return NextResponse.json({ 
        success: false,
        hasWallet: false,
        error: 'Failed to create wallet. Please check server logs for details.',
        userInfo: user
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('[WALLET-ENSURE] Error:', error)
    console.error('[WALLET-ENSURE] Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check if user has a wallet
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ 
      hasWallet: !!wallet,
      wallet: wallet ? {
        accountNumber: wallet.accountNumber,
        bankName: wallet.bankName,
        accountName: wallet.accountName,
        balance: wallet.balance
      } : null
    })
  } catch (error) {
    console.error('[WALLET-ENSURE] Error checking wallet:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
