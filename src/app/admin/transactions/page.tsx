"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEye, FiDownload } from 'react-icons/fi'

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

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch transactions
  const fetchTransactions = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      })

      if (typeFilter) params.append('type', typeFilter)
      if (statusFilter) params.append('status', statusFilter)

      const res = await fetch(`/api/admin/transactions?${params}`)
      const data = await res.json()

      if (data.success && data.data) {
        setTransactions(data.data.transactions)
        setPagination(data.data.pagination)
      } else {
        setError(data.error || 'Failed to fetch transactions')
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      setError('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions(1)
  }, [typeFilter, statusFilter])

  // Format currency
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge
  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      Completed: 'bg-green-500/20 text-green-500',
      Pending: 'bg-yellow-500/20 text-yellow-500',
      Failed: 'bg-red-500/20 text-red-500',
    }
    return (
      <span className={`px-2.5 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    )
  }

  // Filter transactions by search query
  const filteredTransactions = transactions.filter(tx => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      tx.txId.toLowerCase().includes(query) ||
      tx.userEmail.toLowerCase().includes(query)
    )
  })

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTransactions(newPage)
    }
  }

  // Export CSV
  const exportCSV = () => {
    const headers = ['Transaction ID', 'User', 'Amount', 'Type', 'Status', 'Date']
    const rows = filteredTransactions.map(tx => [
      tx.txId,
      tx.userEmail,
      tx.amount,
      tx.type,
      tx.status,
      tx.date
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
  }

  return (
    <div className="p-6">
      {/* Main Card */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#262626]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#262626]">
          <div>
            <h2 className="text-lg font-semibold text-white">Transactions</h2>
            <p className="text-sm text-gray-500">View and manage all platform transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#262626] rounded-lg text-sm text-white hover:bg-[#262626] transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                showFilters || typeFilter || statusFilter
                  ? 'bg-[#4459FF] text-white'
                  : 'bg-[#1A1A1A] border border-[#262626] text-white hover:bg-[#262626]'
              }`}
            >
              <FiFilter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-[#262626]">
          <div className="flex items-center w-80 bg-[#1A1A1A] border border-[#262626] rounded-lg px-3 py-2">
            <FiSearch className="text-gray-500 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-[#262626] flex items-center gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Purchase">Purchase</option>
              <option value="Yield">Yield</option>
              <option value="Transfer">Transfer</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            {(typeFilter || statusFilter) && (
              <button
                onClick={() => { setTypeFilter(''); setStatusFilter(''); }}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#4459FF] border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-400 mt-4">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchTransactions(pagination.page)}
              className="mt-4 px-4 py-2 bg-[#4459FF] text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#262626]">
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Transaction ID</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">User</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Amount</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
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
                        <span className="text-sm text-gray-300">{transaction.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">{formatDate(transaction.date)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/transactions/${transaction.id}`}
                          className="p-2 hover:bg-[#262626] rounded-lg text-gray-400 hover:text-white transition-colors inline-flex"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-[#262626]">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded text-sm ${
                      pagination.page === pageNum
                        ? 'bg-[#262626] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
