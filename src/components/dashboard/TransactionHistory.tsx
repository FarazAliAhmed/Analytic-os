// src/components/dashboard/TransactionHistory.tsx

'use client'

import { formatNaira } from '@/lib/utils/wallet'

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  formattedAmount: string
  description: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  loading?: boolean
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-[#23262F] rounded-xl" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No transactions yet</p>
        <p className="text-sm text-gray-500 mt-1">Fund your wallet to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-4 bg-[#23262F] rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'credit' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
              }`}
            >
              {tx.type === 'credit' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm text-white">{tx.description}</p>
              <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-medium ${
                tx.type === 'credit' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {tx.type === 'credit' ? '+' : '-'}
              {tx.formattedAmount || formatNaira(tx.amount)}
            </p>
            <p className="text-xs text-gray-500 uppercase">{tx.status}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
