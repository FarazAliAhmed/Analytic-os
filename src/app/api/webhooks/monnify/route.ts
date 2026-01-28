// src/app/api/webhooks/monnify/route.ts
// Primary webhook handler for Monnify notifications

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { creditWallet } from '@/lib/wallet-service'
import { notifyWalletDeposit, notifyWithdrawal } from '@/lib/notifications'
import crypto from 'crypto'

// Use MONNIFY_SECRET_KEY for webhook signature verification (per Monnify docs)
const MONNIFY_SECRET_KEY = process.env.MONNIFY_SECRET_KEY || ''

// Validate webhook signature using HMAC-SHA512
function validateSignature(body: string, signature: string | null): boolean {
  if (!signature || !MONNIFY_SECRET_KEY) {
    console.warn('[Webhook] Missing signature or secret key')
    return false
  }

  const computedSignature = crypto
    .createHmac('sha512', MONNIFY_SECRET_KEY)
    .update(body)
    .digest('hex')

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature.toLowerCase()),
      Buffer.from(computedSignature.toLowerCase())
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text()
    const signature = request.headers.get('monnify-signature')

    console.log('[Webhook] Received notification')
    console.log('[Webhook] Body:', bodyText)

    // Validate signature (skip if no signature provided - for testing)
    if (signature && MONNIFY_SECRET_KEY) {
      if (!validateSignature(bodyText, signature)) {
        console.warn('[Webhook] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } else {
      console.log('[Webhook] Skipping signature validation (no signature header)')
    }

    const body = JSON.parse(bodyText)
    const { eventType, eventData } = body

    console.log(`[Webhook] Event type: ${eventType}`)

    // Handle successful incoming payment (collection)
    if (eventType === 'SUCCESSFUL_TRANSACTION') {
      const {
        transactionReference,
        paymentReference,
        amountPaid,
        paymentDescription,
        destinationAccountInformation
      } = eventData

      // Get the reserved account number that received the payment
      const accountNumber = destinationAccountInformation?.accountNumber

      if (!accountNumber) {
        console.warn('[Webhook] Missing destination account number')
        return NextResponse.json({ error: 'Missing account number' }, { status: 400 })
      }

      // Find wallet by reserved account number
      const wallet = await prisma.wallet.findUnique({
        where: { accountNumber }
      })

      if (!wallet) {
        console.warn(`[Webhook] Wallet not found for account: ${accountNumber}`)
        return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
      }

      // Credit the wallet (amountPaid is already in NGN, convert to kobo)
      const result = await creditWallet({
        walletId: wallet.id,
        amount: Math.round(amountPaid * 100),
        description: paymentDescription || 'Wallet funding',
        reference: transactionReference || paymentReference,
        monnifyRef: transactionReference
      })

      if (!result.success) {
        if (result.error === 'Duplicate transaction') {
          console.log(`[Webhook] Duplicate transaction ignored: ${transactionReference}`)
          return NextResponse.json({ 
            requestSuccessful: true,
            responseMessage: "success",
            responseCode: "0"
          }, { status: 200 })
        }
        console.error('[Webhook] Failed to credit wallet:', result.error)
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      console.log(`[Webhook] Credited ${amountPaid} NGN to wallet ${wallet.id}`)
      
      // Send notification to user
      await notifyWalletDeposit(
        wallet.userId,
        Math.round(amountPaid * 100),
        transactionReference || paymentReference
      )
      
      // Return response in Monnify's expected format
      return NextResponse.json({ 
        requestSuccessful: true,
        responseMessage: "success",
        responseCode: "0"
      }, { status: 200 })
    }

    // Handle successful disbursement (withdrawal completed)
    if (eventType === 'SUCCESSFUL_DISBURSEMENT') {
      const { reference, transactionReference, status } = eventData

      // Update transaction status to completed
      const updatedTx = await prisma.transaction.findFirst({
        where: {
          OR: [
            { reference },
            { monnifyRef: transactionReference }
          ]
        },
        include: { wallet: true }
      })
      
      if (updatedTx) {
        await prisma.transaction.update({
          where: { id: updatedTx.id },
          data: { status: 'completed' }
        })
        
        // Notify user of successful withdrawal
        const bankAccount = await prisma.bankAccount.findFirst({
          where: { userId: updatedTx.wallet.userId }
        })
        
        if (bankAccount) {
          await notifyWithdrawal(
            updatedTx.wallet.userId,
            updatedTx.amount,
            bankAccount.accountNumber,
            'completed'
          )
        }
      }

      console.log(`[Webhook] Disbursement completed: ${reference}`)
      return NextResponse.json({ 
        requestSuccessful: true,
        responseMessage: "success",
        responseCode: "0"
      }, { status: 200 })
    }

    // Handle failed/reversed disbursement (refund the wallet)
    if (eventType === 'FAILED_DISBURSEMENT' || eventType === 'REVERSED_DISBURSEMENT') {
      const { reference, transactionReference, amount } = eventData

      // Find the original transaction
      const originalTx = await prisma.transaction.findFirst({
        where: {
          OR: [
            { reference },
            { monnifyRef: transactionReference }
          ],
          type: 'debit'
        },
        include: { wallet: true }
      })

      if (originalTx && originalTx.status !== 'failed') {
        // Refund the wallet
        await prisma.$transaction([
          prisma.wallet.update({
            where: { id: originalTx.walletId },
            data: { balance: { increment: originalTx.amount } }
          }),
          prisma.transaction.update({
            where: { id: originalTx.id },
            data: { status: 'failed' }
          }),
          prisma.transaction.create({
            data: {
              walletId: originalTx.walletId,
              type: 'credit',
              amount: originalTx.amount,
              description: `Refund: ${eventType === 'FAILED_DISBURSEMENT' ? 'Transfer failed' : 'Transfer reversed'}`,
              reference: `${reference}_refund_${Date.now()}`,
              monnifyRef: transactionReference,
              status: 'completed'
            }
          })
        ])

        // Notify user of failed withdrawal and refund
        const bankAccount = await prisma.bankAccount.findFirst({
          where: { userId: originalTx.wallet.userId }
        })

        if (bankAccount) {
          await notifyWithdrawal(
            originalTx.wallet.userId,
            originalTx.amount,
            bankAccount.accountNumber,
            'failed'
          )
        }

        console.log(`[Webhook] Refunded ${originalTx.amount} kobo for ${eventType}`)
      }

      return NextResponse.json({ 
        requestSuccessful: true,
        responseMessage: "success",
        responseCode: "0"
      }, { status: 200 })
    }

    // Log unhandled event types
    console.log(`[Webhook] Unhandled event type: ${eventType}`)
    return NextResponse.json({ 
      requestSuccessful: true,
      responseMessage: "success",
      responseCode: "0"
    }, { status: 200 })

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}


// Add GET handler for webhook testing
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Monnify webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
