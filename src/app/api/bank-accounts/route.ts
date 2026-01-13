import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { verifyBankAccount } from '@/lib/monnify-disbursement'

// Nigerian bank codes
export const NIGERIAN_BANKS = [
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '304', name: 'Stanbic Bank' },
  { code: '305', name: 'Standard Chartered Bank' },
  { code: '307', name: 'Keystone Bank' },
  { code: '308', name: 'Union Bank of Nigeria' },
  { code: '309', name: 'United Bank for Africa' },
  { code: '311', name: 'Unity Bank' },
  { code: '313', name: 'Paragon Bank' },
  { code: '314', name: 'Evolution Bank' },
  { code: '315', name: 'Titan Bank' },
  { code: '317', name: 'Bank of Industry' },
  { code: '323', name: 'Jaiz Bank' },
  { code: '324', name: 'Taj Bank' },
  { code: '325', name: 'Patrick Gold Bank' },
  { code: '326', name: 'Omega Bank' },
  { code: '327', name: 'Premium Trust Bank' },
  { code: '328', name: 'Suntrust Bank' },
  { code: '329', name: 'Trustbond Bank' },
  { code: '330', name: 'Gombe State Cooperative Bank' },
  { code: '401', name: 'Aso Savings and Loans' },
  { code: '403', name: 'Jubilee Life Savings and Loans' },
  { code: '404', name: 'Fortis Microfinance Bank' },
  { code: '405', name: 'FSDH Microfinance Bank' },
  { code: '407', name: 'Nigerian Police Microfinance Bank' },
  { code: '408', name: 'RAO Microfinance Bank' },
  { code: '409', name: 'Addosser Microfinance Bank' },
  { code: '410', name: 'Mutual Benefits Microfinance Bank' },
  { code: '411', name: 'Fina Trust Microfinance Bank' },
  { code: '412', name: 'Greenbank Microfinance Bank' },
  { code: '413', name: 'Vanguard Mortgage Bank' },
  { code: '414', name: 'Nigerian Agricultural Rural Development Bank' },
  { code: '415', name: 'Federal Mortgage Bank' },
  { code: '416', name: 'Lagos State Mortgage Bank' },
  { code: '417', name: 'Niger State Urban Development Bank' },
  { code: '418', name: 'Kogi State Urban Development Bank' },
  { code: '419', name: 'Enugu State Urban Development Bank' },
  { code: '420', name: 'Ebonyi State Urban Development Bank' },
  { code: '421', name: 'Cross River State Urban Development Bank' },
  { code: '422', name: 'Delta State Urban Development Bank' },
  { code: '423', name: 'Edo State Urban Development Bank' },
  { code: '424', name: 'Akwa Ibom State Urban Development Bank' },
  { code: '425', name: 'Ondo State Urban Development Bank' },
  { code: '426', name: 'Ekiti State Urban Development Bank' },
  { code: '427', name: 'Oyo State Urban Development Bank' },
  { code: '428', name: 'Osun State Urban Development Bank' },
  { code: '429', name: 'Kwara State Urban Development Bank' },
  { code: '430', name: 'Kogi State Urban Development Bank' },
  { code: '431', name: 'Nasarawa State Urban Development Bank' },
  { code: '432', name: 'Benue State Urban Development Bank' },
  { code: '433', name: 'Niger State Urban Development Bank' },
  { code: '434', name: 'Zamfara State Urban Development Bank' },
  { code: '435', name: 'Katsina State Urban Development Bank' },
  { code: '436', name: 'Jigawa State Urban Development Bank' },
  { code: '437', name: 'Yobe State Urban Development Bank' },
  { code: '438', name: 'Borno State Urban Development Bank' },
  { code: '439', name: 'Adamawa State Urban Development Bank' },
  { code: '440', name: 'Taraba State Urban Development Bank' },
  { code: '441', name: 'Gombe State Urban Development Bank' },
  { code: '442', name: 'Bauchi State Urban Development Bank' },
  { code: '443', name: 'Plateau State Urban Development Bank' },
]

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
