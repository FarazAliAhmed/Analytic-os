"use client"

import Link from 'next/link'
import { FiEye } from 'react-icons/fi'

interface Transaction {
  id: string
  txId: string
  userId: string
  userEmail: string
  amount: number
  type: 'Purchase' | 'Yield' | 'Transfer' | 'Deposit' | 'Withdrawal'
  status: 'Completed' | 'Pending' | 'Failed'
  date: string
}

interface RecentTransactionsTableProps {
  transactions: Transaction[]
  onViewAll?: () => void
}

export default function RecentTransactionsTable({ transactions, onViewAll }: RecentTransactionsTableProps) {
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: Transaction['status']) => {
    const baseClasses = 'px-2.5 py-1 rounded-full text-xs font-medium'
    
    switch (status) {
      case 'Completed':
        return <span className={`${baseClasses} bg-green-500/10 text-green-500`}>{status}</span>
      case 'Pending':
        return <span className={`${baseClasses} bg-yellow-500/10 text-yellow-500`}>{status}</span>
      case 'Failed':
        return <span className={`${baseClasses} bg-red-500/10 text-red-500`}>{status}</span>
      default:
        return <span className={`${baseClasses} bg-gray-500/10 text-gray-500`}>{status}</span>
    }
  }

  const getTypeBadge = (type: Transaction['type']) => {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#4459FF]/10 text-[#4459FF]">
        {type}
      </span>
    )
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#262626]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        <Link
          href="/admin/transactions"
          onClick={onViewAll}
          className="px-4 py-2 bg-[#4459FF]/10 hover:bg-[#4459FF]/20 text-[#4459FF] rounded-lg text-sm font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Transaction ID
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                User
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Amount
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Type
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Date
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-white">{transaction.txId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{transaction.userEmail}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(transaction.type)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{formatDate(transaction.date)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="p-2 hover:bg-[#4459FF]/10 rounded-lg text-gray-400 hover:text-[#4459FF] transition-colors"
                      title="View transaction details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
