'use client'

import React from 'react'

interface TokenData {
  tokenId: string | null
  name: string
  symbol: string
  price: number
  annualYield: number
  industry: string
  payoutFrequency: string
  investmentType: string
  riskLevel: string
  listingDate: string
  closeDate: string | null
  logoUrl: string | null
  minimumInvestment: number
  volume: number
  transactionCount: number
}

interface TokenInfoCardProps {
  token?: TokenData
}

const TokenInfoCard: React.FC<TokenInfoCardProps> = ({ token }) => {
  // Default values if no token provided
  const tokenId = token?.tokenId || '---'
  const investmentType = token?.investmentType || '---'
  const listingDate = token?.listingDate
    ? new Date(token.listingDate).toLocaleDateString('en-NG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '---'
  const closeDate = token?.closeDate
    ? new Date(token.closeDate).toLocaleDateString('en-NG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '---'
  const riskLevel = token?.riskLevel || '---'
  const payoutFrequency = token?.payoutFrequency || '---'
  const volume = token?.volume ? token.volume.toLocaleString() : '0'
  const transactionCount = token?.transactionCount || '0'

  return (
    <div className="bg-[#151517] rounded-lg p-4 text-gray-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">Token Info</span>
      </div>

      <div className="space-y-4">
        {/* Token ID */}
        <div className="flex justify-between items-center">
          <span className="text-white">Token ID</span>
          <span className="text-white font-medium">{tokenId}</span>
        </div>

        {/* Investment Type */}
        <div className="flex justify-between items-center">
          <span className="text-white">Investment Type</span>
          <span className="text-white font-medium">{investmentType}</span>
        </div>

        {/* Volume */}
        <div className="flex justify-between items-center">
          <span className="text-white">Volume</span>
          <span className="text-white font-medium">₦{volume}</span>
        </div>

        {/* Transaction Count */}
        <div className="flex justify-between items-center">
          <span className="text-white">Transactions</span>
          <span className="text-white font-medium">{transactionCount}</span>
        </div>

        {/* Date of Listing */}
        <div className="flex justify-between items-center">
          <span className="text-white">Date of Listing</span>
          <span className="text-white font-medium">{listingDate}</span>
        </div>

        {/* Close Date */}
        <div className="flex justify-between items-center">
          <span className="text-white">Close Date</span>
          <span className="text-white font-medium">{closeDate}</span>
        </div>

        {/* Risk Level */}
        <div className="flex justify-between items-center">
          <span className="text-white">Risk Level</span>
          <span className={`font-medium ${
            riskLevel === 'Low' ? 'text-green-400' :
            riskLevel === 'High' ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {riskLevel}
          </span>
        </div>

        {/* Payout Frequency */}
        <div className="flex justify-between items-center">
          <span className="text-white">Payout Frequency</span>
          <span className="text-white font-medium">{payoutFrequency}</span>
        </div>
      </div>
    </div>
  )
}

export default TokenInfoCard
