"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiCopy, FiCheck, FiExternalLink, FiPrinter } from 'react-icons/fi'

interface Transaction {
  id: string
  txId: string
  userId: string
  userEmail: string
  amount: number
  type: 'Purchase' | 'Yield' | 'Transfer' | 'Deposit' | 'Withdrawal'
  status: 'Completed' | 'Pending' | 'Failed'
  date: string
  source: string
}

export default function TransactionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true)
        // Fetch all transactions and find the one we need
        const res = await fetch('/api/admin/transactions?limit=100')
        const data = await res.json()
        
        if (data.success && data.data) {
          const found = data.data.transactions.find((t: Transaction) => t.id === params.id)
          if (found) {
            setTransaction(found)
          } else {
            setError('Transaction not found')
          }
        } else {
          setError('Failed to fetch transaction')
        }
      } catch (err) {
        console.error('Failed to fetch transaction:', err)
        setError('Failed to load transaction')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTransaction()
    }
  }, [params.id])

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Completed: 'bg-green-500/20 text-green-500',
      Pending: 'bg-yellow-500/20 text-yellow-500',
      Failed: 'bg-red-500/20 text-red-500',
    }
    return (
      <span className={`px-3 py-1 rounded text-sm font-medium ${styles[status] || 'bg-gray-500/20 text-gray-500'}`}>
        {status}
      </span>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-[#0A0A0A] rounded-xl border border-[#262626] p-8">
          <div className="animate-spin w-8 h-8 border-2 border-[#4459FF] border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-400 mt-4 text-center">Loading transaction...</p>
        </div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="p-6">
        <div className="bg-[#0A0A0A] rounded-xl border border-[#262626] p-8 text-center">
          <p className="text-red-500">{error || 'Transaction not found'}</p>
          <Link
            href="/admin/transactions"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#4459FF] text-white rounded-lg"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Transactions
          </Link>
        </div>
      </div>
    )
  }

  // Generate mock data for display
  const txHash = `0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t`
  const fromAddress = `0x7a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0`
  const toAddress = `0x8a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0`
  const blockNumber = '15482935'

  return (
    <div className="p-6">
      <div className="bg-[#0A0A0A] rounded-xl border border-[#262626]">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-[#262626]">
          <Link
            href="/admin/transactions"
            className="p-2 hover:bg-[#1A1A1A] rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-white">Transaction Details</h2>
            <p className="text-sm text-gray-500">Viewing details for transaction {transaction.txId}</p>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="p-6 border-b border-[#262626]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Transaction ID */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{transaction.txId}</span>
                <button
                  onClick={() => copyToClipboard(transaction.txId, 'txId')}
                  className="text-gray-400 hover:text-white"
                >
                  {copiedField === 'txId' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              {getStatusBadge(transaction.status)}
            </div>

            {/* Date */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <span className="text-white">{formatDate(transaction.date)}</span>
            </div>

            {/* Amount */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Amount</p>
              <span className="text-2xl font-bold text-white">{formatCurrency(transaction.amount)}</span>
            </div>

            {/* Type */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <span className="text-white">{transaction.type}</span>
            </div>

            {/* Fee */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Fee</p>
              <span className="text-white">₦240</span>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="p-6 border-b border-[#262626]">
          <h3 className="text-base font-semibold text-white mb-4">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">User Email</p>
              <div className="flex items-center gap-2">
                <span className="text-white">{transaction.userEmail}</span>
                <button
                  onClick={() => copyToClipboard(transaction.userEmail, 'email')}
                  className="text-gray-400 hover:text-white"
                >
                  {copiedField === 'email' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">User ID</p>
              <div className="flex items-center gap-2">
                <span className="text-white">{transaction.userId.slice(0, 8)}</span>
                <Link href={`/admin/users/${transaction.userId}`} className="text-gray-400 hover:text-white">
                  <FiExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="p-6 border-b border-[#262626]">
          <h3 className="text-base font-semibold text-white mb-4">Transaction Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <span className="text-white">Purchase of AOS tokens</span>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-sm">{txHash}</span>
                <button
                  onClick={() => copyToClipboard(txHash, 'hash')}
                  className="text-gray-400 hover:text-white"
                >
                  {copiedField === 'hash' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">From Address</p>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">{fromAddress}</span>
                  <button
                    onClick={() => copyToClipboard(fromAddress, 'from')}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedField === 'from' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">To Address</p>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">{toAddress}</span>
                  <button
                    onClick={() => copyToClipboard(toAddress, 'to')}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedField === 'to' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Block Number</p>
                <span className="text-white">{blockNumber}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Block Timestamp</p>
                <span className="text-white">{formatDate(transaction.date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex items-center gap-3">
          <Link
            href="/admin/transactions"
            className="px-4 py-2 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white text-sm hover:bg-[#262626] transition-colors"
          >
            Back to Transactions
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white text-sm hover:bg-[#262626] transition-colors"
          >
            <FiPrinter className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  )
}
