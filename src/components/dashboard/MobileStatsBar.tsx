'use client'

import { useEffect, useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'

export function MobileStatsBar() {
  const [stats, setStats] = useState({ volume: 0, transactions: 0 })
  const { formatAmount } = useCurrency()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/tokens')
        const data = await res.json()
        if (data.success && data.tokens) {
          const totalVolume = data.tokens.reduce((sum: number, token: any) => sum + (token.volume || 0), 0)
          const totalTxns = data.tokens.length * 1000 // Placeholder
          setStats({ volume: totalVolume, transactions: totalTxns })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="sticky top-[57px] z-30 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="flex items-center justify-around px-4 py-3">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">24H VOLUME</div>
          <div className="text-base font-bold text-white">{formatAmount(stats.volume / 100)}</div>
        </div>
        <div className="w-px h-8 bg-[#1A1A1A]" />
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">24H TXNS</div>
          <div className="text-base font-bold text-white">{stats.transactions.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
