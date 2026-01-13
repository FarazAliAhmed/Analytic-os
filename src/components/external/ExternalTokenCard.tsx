'use client'

import { ExternalToken } from '@/lib/getequity/client'
import { ArrowUpRight, TrendingUp } from 'lucide-react'

interface ExternalTokenCardProps {
  token: ExternalToken
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount).replace('NGN', '₦')
}

export default function ExternalTokenCard({ token }: ExternalTokenCardProps) {
  const handleInvest = () => {
    window.open(token.purchaseUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#262626] p-5 hover:border-[#404040] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
            {token.logoUrl ? (
              <img src={token.logoUrl} alt={token.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                {token.symbol.slice(0, 2)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{token.name}</h3>
            <p className="text-sm text-gray-400">{token.symbol}</p>
          </div>
        </div>
        <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
          External
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Price</span>
          <span className="font-medium text-white">{formatNaira(token.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Annual Yield</span>
          <span className="font-medium text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {token.annualYield}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Industry</span>
          <span className="font-medium text-white">{token.industry}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Risk Level</span>
          <span className={`font-medium ${
            token.riskLevel === 'Low' ? 'text-green-400' :
            token.riskLevel === 'High' ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {token.riskLevel}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Payout</span>
          <span className="font-medium text-white">{token.payoutFrequency}</span>
        </div>
      </div>

      {/* Invest Button */}
      <button
        onClick={handleInvest}
        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
      >
        Invest on GetEquitiy
        <ArrowUpRight className="w-4 h-4" />
      </button>

      {/* Source Badge */}
      {token.source === 'getequity-sandbox' && (
        <p className="text-xs text-yellow-500 text-center mt-2">
          Sandbox Mode - Test Data
        </p>
      )}
    </div>
  )
}
