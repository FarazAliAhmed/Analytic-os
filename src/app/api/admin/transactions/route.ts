import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

interface AdminTransaction {
  id: string
  txId: string // Formatted as TX123456
  userId: string
  userEmail: string
  amount: number // In Naira
  type: 'Purchase' | 'Yield' | 'Transfer' | 'Deposit' | 'Withdrawal'
  status: 'Completed' | 'Pending' | 'Failed'
  date: string
  source: 'wallet' | 'token_purchase'
}

interface AdminTransactionsResponse {
  success: boolean
  data?: {
    transactions: AdminTransaction[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  error?: string
}

/**
 * GET /api/admin/transactions - Get paginated admin transactions
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 * - type: Filter by type (Purchase, Yield, Transfer, Deposit, Withdrawal)
 * - status: Filter by status (Completed, Pending, Failed)
 * 
 * Returns combined Transaction and TokenPurchase records
 */
export async function GET(request: NextRequest): Promise<NextResponse<AdminTransactionsResponse>> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const adminStatus = await isAdmin(session.user.id)
    if (!adminStatus) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const typeFilter = searchParams.get('type')
    const statusFilter = searchParams.get('status')

    // Build combined transactions list
    const allTransactions: AdminTransaction[] = []

    // Fetch wallet transactions (Transfer, Deposit, Withdrawal)
    const walletTransactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: {
          include: {
            user: {
              select: { id: true, email: true }
            }
          }
        }
      }
    })

    // Map wallet transactions to admin format
    for (const tx of walletTransactions) {
      const txType = mapWalletTransactionType(tx.type, tx.description)
      const txStatus = mapTxStatus(tx.status)
      
      // Apply filters
      if (typeFilter && txType !== typeFilter) continue
      if (statusFilter && txStatus !== statusFilter) continue

      allTransactions.push({
        id: tx.id,
        txId: formatTxId(tx.id),
        userId: tx.wallet.user.id,
        userEmail: tx.wallet.user.email,
        amount: tx.amount / 100, // Convert kobo to Naira
        type: txType,
        status: txStatus,
        date: tx.createdAt.toISOString(),
        source: 'wallet'
      })
    }

    // Fetch token purchases (Purchase type)
    const tokenPurchases = await prisma.tokenPurchase.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true }
        }
      }
    })

    // Map token purchases to admin format
    for (const purchase of tokenPurchases) {
      const txStatus = mapPurchaseStatus(purchase.status)
      
      // Apply filters
      if (typeFilter && typeFilter !== 'Purchase') continue
      if (statusFilter && txStatus !== statusFilter) continue

      allTransactions.push({
        id: purchase.id,
        txId: formatTxId(purchase.id),
        userId: purchase.user.id,
        userEmail: purchase.user.email,
        amount: purchase.nairaAmountSpent, // Already in Naira
        type: 'Purchase',
        status: txStatus,
        date: purchase.createdAt.toISOString(),
        source: 'token_purchase'
      })
    }

    // Sort all transactions by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate pagination
    const total = allTransactions.length
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit
    const paginatedTransactions = allTransactions.slice(skip, skip + limit)

    return NextResponse.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    })
  } catch (error) {
    console.error('Admin transactions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin transactions' },
      { status: 500 }
    )
  }
}

/**
 * Map wallet transaction type to admin display type
 */
function mapWalletTransactionType(
  type: 'credit' | 'debit',
  description: string
): 'Transfer' | 'Deposit' | 'Withdrawal' | 'Yield' {
  const descLower = description.toLowerCase()
  
  if (descLower.includes('yield') || descLower.includes('dividend')) {
    return 'Yield'
  }
  
  if (type === 'credit') {
    return 'Deposit'
  }
  
  if (type === 'debit') {
    if (descLower.includes('transfer')) {
      return 'Transfer'
    }
    return 'Withdrawal'
  }
  
  return 'Transfer'
}

/**
 * Map database TxStatus to admin display status
 */
function mapTxStatus(status: 'pending' | 'completed' | 'failed'): 'Completed' | 'Pending' | 'Failed' {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'pending':
      return 'Pending'
    case 'failed':
      return 'Failed'
    default:
      return 'Pending'
  }
}

/**
 * Map database PurchaseStatus to admin display status
 */
function mapPurchaseStatus(
  status: 'pending' | 'completed' | 'failed' | 'refunded'
): 'Completed' | 'Pending' | 'Failed' {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'pending':
      return 'Pending'
    case 'failed':
    case 'refunded':
      return 'Failed'
    default:
      return 'Pending'
  }
}

/**
 * Format transaction ID for display (TX + first 6 chars uppercase)
 */
function formatTxId(id: string): string {
  return `TX${id.slice(0, 6).toUpperCase()}`
}
