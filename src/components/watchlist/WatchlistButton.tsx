'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface WatchlistButtonProps {
  tokenId: string
  initialIsInWatchlist?: boolean
  onToggle?: (isInWatchlist: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function WatchlistButton({
  tokenId,
  initialIsInWatchlist = false,
  onToggle,
  size = 'md',
  showLabel = false,
}: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist)
  const [loading, setLoading] = useState(false)

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  }

  const handleToggle = async () => {
    if (loading) return

    setLoading(true)
    const newState = !isInWatchlist
    setIsInWatchlist(newState)

    try {
      if (newState) {
        // Add to watchlist
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId }),
        })

        if (!res.ok) {
          setIsInWatchlist(!newState) // Revert on error
        } else {
          onToggle?.(true)
        }
      } else {
        // Remove from watchlist
        const res = await fetch(`/api/watchlist/${tokenId}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          setIsInWatchlist(!newState) // Revert on error
        } else {
          onToggle?.(false)
        }
      }
    } catch (error) {
      console.error('Watchlist toggle error:', error)
      setIsInWatchlist(!newState) // Revert on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        transition-all disabled:opacity-50 hover:scale-110
        ${isInWatchlist ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
      `}
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star
        size={iconSizes[size]}
        className={`transition-all ${
          isInWatchlist ? 'fill-yellow-500 stroke-yellow-500' : 'fill-transparent stroke-current'
        }`}
      />
    </button>
  )
}
