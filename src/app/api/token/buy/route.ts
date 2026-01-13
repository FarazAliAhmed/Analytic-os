import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const TOKEN_PRICE_NAIRA = 1500
const TOKEN_PRICE_KOBO = TOKEN_PRICE_NAIRA * 100

const buyTokenSchema = z.object({
  nairaAmount: z.number().min(TOKEN_PRICE_NAIRA, `Minimum purchase is ₦${TOKEN_PRICE_NAIRA}`),
})

interface BuyTokenResponse {
  success: boolean
  purchase?: {
    id: string
    nairaAmountSpent: number
    tokensReceived: number
    pricePerToken: number
    newTokenBalance: number
    newWalletBalance: number
    reference: string
  }
  error?: string
}

/**
 * POST /api/token/buy - Purchase tokens with Naira amount
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = buyTokenSchema.parse(body)

    // Get user's wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    if (!wallet) {
      return NextResponse.json({ success: false, error: 'No wallet found' }, { status: 400 })
    }

    // Convert naira amount to kobo for wallet operations
    const amountInKobo = data.nairaAmount * 100

    // Check sufficient balance
    if (wallet.balance < amountInKobo) {
      return NextResponse.json({
        success: false,
        error: `Insufficient balance. You have ₦${(wallet.balance / 100).toFixed(2)}`
      }, { status: 400 })
    }

    // Calculate tokens received (floor division)
    const tokensReceived = Math.floor(data.nairaAmount / TOKEN_PRICE_NAIRA)

    // Generate unique reference
    const reference = `TKN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Debit wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amountInKobo } }
      })

      // 2. Update or create token holding
      const holding = await tx.tokenHolding.upsert({
        where: {
          userId_tokenId: {
            userId: session.user.id,
            tokenId: 'INV'
          }
        },
        create: {
          userId: session.user.id,
          tokenId: 'INV',
          quantity: tokensReceived,
          averagePrice: TOKEN_PRICE_NAIRA
        },
        update: {
          quantity: { increment: tokensReceived },
          updatedAt: new Date()
        }
      })

      // 3. Record purchase
      const purchase = await tx.tokenPurchase.create({
        data: {
          userId: session.user.id,
          tokenId: 'INV',
          nairaAmountSpent: data.nairaAmount,
          tokensReceived,
          pricePerToken: TOKEN_PRICE_KOBO,
          totalAmountKobo: amountInKobo,
          reference,
          status: 'completed'
        }
      })

      return {
        wallet: updatedWallet,
        holding,
        purchase
      }
    })

    return NextResponse.json({
      success: true,
      purchase: {
        id: result.purchase.id,
        nairaAmountSpent: data.nairaAmount,
        tokensReceived,
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
    console.error('Token purchase error:', error)
    return NextResponse.json({ success: false, error: 'Purchase failed' }, { status: 500 })
  }
}
