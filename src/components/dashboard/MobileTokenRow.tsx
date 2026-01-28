'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCurrency } from '@/contexts/CurrencyContext'

interface MobileTokenRowProps {
  tokenId: string
  symbol: string
  name: string
  price: number
  change: number
  age: string
  txns: number
  volume: number
  logo: string | null
}

export function MobileTokenRow({
  tokenId,
  symbol,
  name,
  price,
  change,
  age,
  txns,
  volume,
  logo
}: MobileTokenRowProps) {
  const router = useRouter()
  const { formatAmount } = useCurrency()

  const handleClick = () => {
    router.push(`/dashboard/token?symbol=${symbol}`)
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-3 border-b border-[#1A1A1A] hover:bg-[#0F0F0F] active:bg-[#151515] transition-colors cursor-pointer"
    >
      {/* Token Icon & Info */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {logo ? (
          <Image src={logo} alt={symbol} width={32} height={32} className="rounded-full flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {symbol.substring(0, 2)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{symbol}</span>
            <span className="text-xs text-gray-500">/ {name.length > 15 ? name.substring(0, 15) + '...' : name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{age}</span>
            <span>•</span>
            <span>{txns.toLocaleString()} txns</span>
          </div>
        </div>
      </div>

      {/* Price & Change */}
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-white text-sm">{formatAmount(price)}</div>
        <div className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>

      {/* Volume */}
      <div className="text-right flex-shrink-0 min-w-[60px]">
        <div className="text-xs text-gray-500">VOL</div>
        <div className="text-xs font-medium text-white">{formatAmount(volume)}</div>
      </div>
    </div>
  )
}
