import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

interface AdminStatsResponse {
  success: boolean
  data?: {
    totalUsers: number
    totalUsersChange: number      // % vs last month
    totalTransactions: number
    totalTransactionsChange: number
    airdropsDistributed: number   // In Naira (placeholder)
    airdropsChange: number
    totalYieldsPaid: number       // In Naira (placeholder)
    yieldsChange: number
  }
  error?: string
}

/**
 * GET /api/admin/stats - Get platform statistics for admin dashboard
 * 
 * Returns:
 * - Total users with month-over-month change
 * - Total transactions (Transaction + TokenPurchase) with change
 * - Airdrops distributed (placeholder)
 * - Total yields paid (placeholder)
 */
export async function GET(): Promise<NextResponse<AdminStatsResponse>> {
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

    // Calculate date ranges
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Query 1: Total users and month-over-month change
    const [totalUsers, usersThisMonth, usersLastMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: startOfThisMonth } }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      })
    ])

    const totalUsersChange = usersLastMonth > 0
      ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100)
      : usersThisMonth > 0 ? 100 : 0

    // Query 2: Total transactions (Transaction + TokenPurchase)
    const [
      walletTransactionsTotal,
      walletTransactionsThisMonth,
      walletTransactionsLastMonth,
      tokenPurchasesTotal,
      tokenPurchasesThisMonth,
      tokenPurchasesLastMonth
    ] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({
        where: { createdAt: { gte: startOfThisMonth } }
      }),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      prisma.tokenPurchase.count(),
      prisma.tokenPurchase.count({
        where: { createdAt: { gte: startOfThisMonth } }
      }),
      prisma.tokenPurchase.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      })
    ])

    const totalTransactions = walletTransactionsTotal + tokenPurchasesTotal
    const transactionsThisMonth = walletTransactionsThisMonth + tokenPurchasesThisMonth
    const transactionsLastMonth = walletTransactionsLastMonth + tokenPurchasesLastMonth

    const totalTransactionsChange = transactionsLastMonth > 0
      ? Math.round(((transactionsThisMonth - transactionsLastMonth) / transactionsLastMonth) * 100)
      : transactionsThisMonth > 0 ? 100 : 0

    // Placeholder values for airdrops and yields (future tables)
    // These will be replaced when Airdrop and YieldPayment tables are created
    // Using sample values to demonstrate UI functionality
    const airdropsDistributed = 2450000 // ₦2,450,000 sample value
    const airdropsChange = 12 // +12% sample positive change
    const totalYieldsPaid = 1875000 // ₦1,875,000 sample value
    const yieldsChange = -3 // -3% sample negative change to show red styling

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalUsersChange,
        totalTransactions,
        totalTransactionsChange,
        airdropsDistributed,
        airdropsChange,
        totalYieldsPaid,
        yieldsChange
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
