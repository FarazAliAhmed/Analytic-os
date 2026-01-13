import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { verifyBankAccount } from '@/lib/monnify-disbursement'
import { NIGERIAN_BANKS } from '@/lib/nigerian-banks'

const addBankSchema = z.object({
  accountNumber: z.string().min(10).max(10).regex(/^\d+$/),
  bankCode: z.string().length(3),
})

/**
 * GET /api/bank-accounts - List user's bank accounts
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' },
    })

    // Add bank names
    const accountsWithBankNames = bankAccounts.map((acc) => ({
      ...acc,
      bankDisplayName: NIGERIAN_BANKS.find((b) => b.code === acc.bankCode)?.name || acc.bankName,
    }))

    return NextResponse.json({ bankAccounts: accountsWithBankNames })
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    return NextResponse.json({ error: 'Failed to fetch bank accounts' }, { status: 500 })
  }
}

/**
 * POST /api/bank-accounts - Add new bank account
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = addBankSchema.parse(body)

    // Check if account already exists for user
    const existing = await prisma.bankAccount.findUnique({
      where: {
        userId_accountNumber: {
          userId: session.user.id,
          accountNumber: data.accountNumber,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Bank account already exists' }, { status: 400 })
    }

    // Verify account name with Monnify
    const { accountName } = await verifyBankAccount(data.accountNumber, data.bankCode)

    const bankName = NIGERIAN_BANKS.find((b) => b.code === data.bankCode)?.name || ''

    // Create bank account
    const bankAccount = await prisma.bankAccount.create({
      data: {
        userId: session.user.id,
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
        bankName,
        accountName,
      },
    })

    return NextResponse.json({ bankAccount, accountName })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error adding bank account:', error)
    return NextResponse.json({ error: 'Failed to add bank account' }, { status: 500 })
  }
}
