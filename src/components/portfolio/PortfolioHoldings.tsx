'use client'

import { useState, useEffect } from 'react'
import PortfolioTable from './PortfolioTable'
import { Loader2 } from 'lucide-react'

interface TokenHolding {
  id: string
  tokenId: string
  quantity: number
  averagePrice: number
  token: {
    id: string
    name: string
    symbol: string
    price: number
    annualYield: number
    industry: string
    riskLevel: string
    logoUrl: string | null
  }
}

export default function PortfolioHoldings() {
  const [view, setView] = useState<'all' | 'watchlist'>('all')
  const [holdings, setHoldings] = useState<TokenHolding[]>([])
  const [watchlistIds, setWatchlistIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch holdings and watchlist
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch holdings
        const holdingsRes = await fetch('/api/portfolio/holdings')
        if (holdingsRes.ok) {
          const data = await holdingsRes.json()
          setHoldings(data.holdings || [])
        }

        // Fetch watchlist IDs
        const watchlistRes = await fetch('/api/watchlist/ids')
        if (watchlistRes.ok) {
          const data = await watchlistRes.json()
          setWatchlistIds(data.tokenIds || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter holdings based on view
  const displayedHoldings = view === 'all'
    ? holdings
    : holdings.filter(h => watchlistIds.includes(h.tokenId))

  const allTokensCount = holdings.length
  const watchlistCount = holdings.filter(h => watchlistIds.includes(h.tokenId)).length

  if (loading) {
    return (
      <section className="bg-[#0A0A0A] rounded-2xl p-6 mt-4 shadow border border-[#262626]">
        <div className="mb-2 border-b border-[#262626] pb-4">
          <div className="text-xl font-semibold text-[#FAFAFA] mb-1">Portfolio Holdings</div>
          <div className="text-[#A1A1A1] mb-4">Complete breakdown of your investments</div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-gray-800 rounded animate-pulse" />
            <div className="h-8 w-24 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#0A0A0A] rounded-2xl p-6 mt-4 shadow border border-[#262626]">
      <div className="mb-2 border-b border-[#262626] pb-4">
        <div className="text-xl font-semibold text-[#FAFAFA] mb-1">Portfolio Holdings</div>
        <div className="text-[#A1A1A1] mb-4">Complete breakdown of your investments</div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('all')}
            className={`px-4 py-1.5 rounded font-medium border transition-colors ${
              view === 'all'
                ? 'bg-[#262626] text-[#FAFAFA] border-[#262626]'
                : 'bg-transparent text-[#A1A1A1] hover:bg-[#262626] border-[#262626]'
            }`}
          >
            All Tokens <span className="ml-1 text-xs bg-gray-700 px-2 py-0.5 rounded">{allTokensCount}</span>
          </button>
          <button
            onClick={() => setView('watchlist')}
            className={`px-4 py-1.5 rounded font-medium border transition-colors ${
              view === 'watchlist'
                ? 'bg-[#262626] text-[#FAFAFA] border-[#262626]'
                : 'bg-transparent text-[#A1A1A1] hover:bg-[#262626] border-[#262626]'
            }`}
          >
            Watchlist <span className="ml-1 text-xs bg-gray-700 px-2 py-0.5 rounded">{watchlistCount}</span>
          </button>
        </div>
      </div>

      {displayedHoldings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-[#A1A1A1] mb-2">
            {view === 'watchlist'
              ? 'No tokens in your watchlist yet'
              : 'No holdings yet'}
          </div>
          {view === 'watchlist' && (
            <p className="text-sm text-gray-500">
              Add tokens to your watchlist from the dashboard to track them here
            </p>
          )}
        </div>
      ) : (
        <PortfolioTable holdings={displayedHoldings} watchlistIds={watchlistIds} />
      )}
    </section>
  )
}
