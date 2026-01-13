"use client"

import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import AdminTable from '@/components/admin/AdminTable'
import AdminButton from '@/components/admin/AdminButton'

export default function AdminTokensPage() {
  // Placeholder data for stats
  const stats = {
    totalTokens: 8,
    activeTokens: 7,
    totalVolume: 1250000
  }

  const columns = [
    { key: 'token', label: 'Token' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'price', label: 'Price' },
    { key: 'totalSupply', label: 'Total Supply' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Token Management</h2>
          <p className="text-gray-400 text-sm mt-1">Manage platform tokens and their settings</p>
        </div>

        <AdminButton>
          <FiPlus className="w-4 h-4" />
          Add New Token
        </AdminButton>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#262626]">
          <p className="text-sm text-gray-400">Total Tokens</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalTokens}</p>
        </div>
        <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#262626]">
          <p className="text-sm text-gray-400">Active Tokens</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.activeTokens}</p>
        </div>
        <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#262626]">
          <p className="text-sm text-gray-400">Total Volume</p>
          <p className="text-3xl font-bold text-white mt-1">₦{stats.totalVolume.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center w-80 bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2.5 focus-within:border-[#4459FF] transition-colors">
        <FiSearch className="text-gray-500 w-4 h-4 flex-shrink-0 mr-3" />
        <input
          type="text"
          placeholder="Search tokens..."
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Tokens Table */}
      <AdminTable columns={columns} emptyMessage="Token management functionality will be fully implemented in a future update.">
        {/* Placeholder rows */}
        <tr className="hover:bg-[#1F1F1F]/50 transition-colors">
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4459FF]/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-[#4459FF]">IN</span>
              </div>
              <span className="text-sm font-medium text-white">Investify Token</span>
            </div>
          </td>
          <td className="px-5 py-4">
            <span className="text-sm text-gray-300">INV</span>
          </td>
          <td className="px-5 py-4">
            <span className="text-sm font-medium text-white">₦150.00</span>
          </td>
          <td className="px-5 py-4">
            <span className="text-sm text-gray-300">1,000,000</span>
          </td>
          <td className="px-5 py-4">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
              Active
            </span>
          </td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">
              <AdminButton variant="ghost" size="sm">
                <FiEdit2 className="w-4 h-4" />
              </AdminButton>
              <AdminButton variant="ghost" size="sm">
                <FiToggleRight className="w-4 h-4" />
              </AdminButton>
              <AdminButton variant="ghost" size="sm">
                <FiTrash2 className="w-4 h-4" />
              </AdminButton>
            </div>
          </td>
        </tr>
        <tr className="hover:bg-[#1F1F1F]/50 transition-colors">
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4459FF]/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-[#4459FF]">PY</span>
              </div>
              <span className="text-sm font-medium text-white">Paystack Token</span>
            </div>
          </td>
          <td className="px-5 py-4">
            <span className="text-sm text-gray-300">PYSK</span>
          </td>
          <td className="px-5 py-4">
            <span className="text-sm font-medium text-white">₦85.00</span>
          </td>
          <td className="px-5 py-4">
            <span className="text-sm text-gray-300">500,000</span>
          </td>
          <td className="px-5 py-4">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
              Active
            </span>
          </td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">
              <AdminButton variant="ghost" size="sm">
                <FiEdit2 className="w-4 h-4" />
              </AdminButton>
              <AdminButton variant="ghost" size="sm">
                <FiToggleRight className="w-4 h-4" />
              </AdminButton>
              <AdminButton variant="ghost" size="sm">
                <FiTrash2 className="w-4 h-4" />
              </AdminButton>
            </div>
          </td>
        </tr>
      </AdminTable>
    </div>
  )
}
