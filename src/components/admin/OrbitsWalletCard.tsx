"use client"

import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { HiOutlineWallet } from 'react-icons/hi2'

interface TokenHolding {
  name: string
  symbol: string
  value: number
}

interface OrbitsWalletCardProps {
  address: string
  balance: number
  tokens: TokenHolding[]
}

export default function OrbitsWalletCard({ address, balance, tokens }: OrbitsWalletCardProps) {
  const [copied, setCopied] = useState(false)

  const truncateAddress = (addr: string) => {
    if (addr.length <= 16) return addr
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#262626] h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#4459FF]/20 rounded-lg flex items-center justify-center text-[#4459FF]">
          <HiOutlineWallet className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Orbits Wallet</h3>
          <p className="text-xs text-gray-500">Administrative platform wallet</p>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Wallet Address</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-mono text-white">{truncateAddress(address)}</p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4459FF]/10 hover:bg-[#4459FF]/20 text-[#4459FF] rounded-md text-sm font-medium transition-colors"
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <FiCopy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Total Balance</p>
        <p className="text-3xl font-bold text-white">{formatCurrency(balance)}</p>
      </div>

      {/* Token Holdings */}
      {tokens.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-3">Token Holdings</p>
          <div className="space-y-3">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-t border-[#2A2A2A]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4459FF]/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-[#4459FF]">
                      {token.symbol.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{token.name}</p>
                    <p className="text-xs text-gray-500">{token.symbol}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-white">{formatCurrency(token.value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
