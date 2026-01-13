// src/app/api/wallet/sync/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { searchTransactions } from '@/lib/monnify'
import { creditWallet, formatKoboToNaira } from '@/lib/wallet-service'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    if (!wallet) {
      return NextResponse.json({
        success: true,
        data: { newTransactions: 0, totalCredited: 0 }
      })
    }

    // Get last 24 hours of transactions from Monnify
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const monnifyTransactions = await searchTransactions({
      accountNumber: wallet.accountNumber,
      fromDate: yesterday.toISOString(),
      toDate: now.toISOString()
    })

    let newTransactions = 0
    let totalCredited = 0

    for (const tx of monnifyTransactions) {
      // Check if we already processed this transaction
      const existing = await prisma.transaction.findUnique({
        where: { reference: tx.reference }
      })

      if (existing) {
        continue // Skip already processed
      }

      // Credit the wallet
      const result = await creditWallet({
        walletId: wallet.id,
        amount: tx.amount,
        description: 'Wallet funding',
        reference: tx.reference,
        monnifyRef: tx.reference
      })

      if (result.success) {
        newTransactions++
        totalCredited += tx.amount
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        newTransactions,
        totalCredited,
        formattedTotal: formatKoboToNaira(totalCredited)
      }
    })
  } catch (error) {
    console.error('Wallet sync error:', error)
    return NextResponse.json({ success: false, error: 'Failed to sync wallet' }, { status: 500 })
  }
}
