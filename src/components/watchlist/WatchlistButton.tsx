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
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        transition-colors disabled:opacity-50
        ${isInWatchlist
          ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
        }
      `}
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star
        size={iconSizes[size]}
        className={`transition-colors ${
          isInWatchlist ? 'fill-yellow-500' : 'fill-transparent'
        }`}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isInWatchlist ? 'Watching' : 'Watch'}
        </span>
      )}
    </button>
  )
}
