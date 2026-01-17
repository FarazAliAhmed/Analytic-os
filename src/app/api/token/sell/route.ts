import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const sellTokenSchema = z.object({
  tokenSymbol: z.string().min(1, 'Token symbol is required'),
  tokensToSell: z.number().min(1, 'Amount must be positive'),
})

interface SellTokenResponse {
  success: boolean
  sale?: {
    id: string
    tokensSold: number
    nairaReceived: number
    pricePerToken: number
    newTokenBalance: number
    newWalletBalance: number
    reference: string
  }
  error?: string
}

/**
 * POST /api/token/sell - Sell tokens for Naira
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = sellTokenSchema.parse(body)

    // Get token details from database
    const token = await prisma.token.findUnique({
      where: { symbol: data.tokenSymbol.toUpperCase() }
    })

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 })
    }

    if (!token.isActive) {
      return NextResponse.json({ success: false, error: 'Token is not available for trading' }, { status: 400 })
    }

    const TOKEN_PRICE_NAIRA = token.price / 100 // Convert from kobo to Naira
    const TOKEN_PRICE_KOBO = token.price

    // Get user's token holding
    const holding = await prisma.tokenHolding.findUnique({
      where: {
        userId_tokenId: {
          userId: session.user.id,
          tokenId: data.tokenSymbol.toUpperCase()
        }
      }
    })

    if (!holding || holding.quantity < data.tokensToSell) {
      return NextResponse.json({
        success: false,
        error: `Insufficient tokens. You have ${holding?.quantity || 0} ${data.tokenSymbol}`
      }, { status: 400 })
    }

    // Get user's wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    if (!wallet) {
      return NextResponse.json({ success: false, error: 'No wallet found' }, { status: 400 })
    }

    // Calculate Naira to receive
    const nairaReceived = data.tokensToSell * TOKEN_PRICE_NAIRA
    const nairaInKobo = Math.floor(nairaReceived * 100)

    // Generate unique reference
    const reference = `SELL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Credit wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: nairaInKobo } }
      })

      // 2. Update token holding
      const updatedHolding = await tx.tokenHolding.update({
        where: {
          userId_tokenId: {
            userId: session.user.id,
            tokenId: token.symbol
          }
        },
        data: {
          quantity: { decrement: data.tokensToSell },
          updatedAt: new Date()
        }
      })

      // 3. Record sale as a transaction
      const saleTransaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'credit',
          amount: nairaInKobo,
          description: `Sold ${data.tokensToSell} ${token.symbol} tokens`,
          reference,
          status: 'completed'
        }
      })

      // 4. Update token statistics
      await tx.token.update({
        where: { id: token.id },
        data: {
          volume: { increment: nairaInKobo },
          transactionCount: { increment: 1 }
        }
      })

      return {
        wallet: updatedWallet,
        holding: updatedHolding,
        transaction: saleTransaction
      }
    })

    return NextResponse.json({
      success: true,
      sale: {
        id: result.transaction.id,
        tokensSold: data.tokensToSell,
        nairaReceived,
        pricePerToken: TOKEN_PRICE_NAIRA,
        newTokenBalance: result.holding.quantity,
        newWalletBalance: result.wallet.balance,
        reference
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 })
    }
    console.error('Token sale error:', error)
    return NextResponse.json({ success: false, error: 'Sale failed' }, { status: 500 })
  }
}
