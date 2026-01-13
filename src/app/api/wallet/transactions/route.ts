// src/app/api/wallet/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatKoboToNaira } from '@/lib/wallet-service'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    if (!wallet) {
      return NextResponse.json({
        success: true,
        data: { transactions: [], pagination: { page, limit, total: 0 } }
      })
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({ where: { walletId: wallet.id } })
    ])

    const formattedTransactions = transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      formattedAmount: formatKoboToNaira(tx.amount),
      description: tx.description,
      reference: tx.reference,
      status: tx.status,
      createdAt: tx.createdAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: { page, limit, total }
      }
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get transactions' }, { status: 500 })
  }
}
