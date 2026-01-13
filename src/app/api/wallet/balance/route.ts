// src/app/api/wallet/balance/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatKoboToNaira } from '@/lib/wallet-service'

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
        data: {
          balance: 0,
          formattedBalance: '₦0.00'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: wallet.balance,
        formattedBalance: formatKoboToNaira(wallet.balance)
      }
    })
  } catch (error) {
    console.error('Get balance error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get balance' }, { status: 500 })
  }
}
