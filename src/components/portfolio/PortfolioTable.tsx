import Image from 'next/image'
import WatchlistButton from '@/components/watchlist/WatchlistButton'

interface HoldingsToken {
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

interface PortfolioTableProps {
  holdings: HoldingsToken[]
  watchlistIds: string[]
  onWatchlistToggle?: (tokenId: string, isInWatchlist: boolean) => void
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount).replace('NGN', '₦')
}

export default function PortfolioTable({ holdings, watchlistIds, onWatchlistToggle }: PortfolioTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-800">
            <th className="py-3 px-4 font-medium">Asset</th>
            <th className="py-3 px-4 font-medium">Price</th>
            <th className="py-3 px-4 font-medium">Holdings</th>
            <th className="py-3 px-4 font-medium">Avg. Cost</th>
            <th className="py-3 px-4 font-medium">Total Yield</th>
            <th className="py-3 px-4 font-medium">Allocation</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const currentValue = holding.quantity * (holding.token.price / 100)
            const costBasis = holding.quantity * (holding.averagePrice / 100)
            const totalYield = currentValue - costBasis
            const yieldPercent = costBasis > 0 ? (totalYield / costBasis) * 100 : 0
            const isInWatchlist = watchlistIds.includes(holding.tokenId)

            return (
              <tr key={holding.id} className="border-t border-gray-800 hover:bg-gray-900 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {holding.token.logoUrl ? (
                        <Image
                          src={holding.token.logoUrl}
                          alt={holding.token.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {holding.token.symbol.substring(0, 2)}
                        </div>
                      )}
                      {isInWatchlist && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-[#0A0A0A]" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{holding.token.symbol}</div>
                      <div className="text-xs text-gray-400">{holding.token.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-white">{formatNaira(holding.token.price / 100)}</div>
                  <div className="text-xs text-green-400">+{holding.token.annualYield}% APY</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-white">{formatNaira(currentValue)}</div>
                  <div className="text-xs text-gray-400">{holding.quantity} units</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-white">{formatNaira(holding.averagePrice / 100)}</div>
                  <div className="text-xs text-gray-400">per unit</div>
                </td>
                <td className="py-3 px-4">
                  <div className={`font-semibold ${totalYield >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalYield >= 0 ? '+' : ''}{formatNaira(totalYield)}
                  </div>
                  <div className={`text-xs ${yieldPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {yieldPercent >= 0 ? '+' : ''}{yieldPercent.toFixed(2)}%
                  </div>
                </td>
                <td className="py-3 px-4 w-32">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-gray-800 rounded">
                      <div
                        className="h-2 bg-white rounded"
                        style={{ width: `${Math.min(100, currentValue / 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {((currentValue / (holdings.reduce((sum, h) => sum + (h.quantity * (h.token.price / 100)), 0))) * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <WatchlistButton
                    tokenId={holding.tokenId}
                    initialIsInWatchlist={isInWatchlist}
                    size="sm"
                    onToggle={(newState) => onWatchlistToggle?.(holding.tokenId, newState)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
