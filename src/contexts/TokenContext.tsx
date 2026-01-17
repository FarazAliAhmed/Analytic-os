'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface TokenContextType {
  tokenSymbol: string | null
  tokenPrice: number | null
  tokenChange: number | null
  tokenPercentChange: number | null
  isInWatchlist: boolean
  setTokenData: (data: {
    symbol: string
    price: number
    change?: number
    percentChange?: number
    isInWatchlist?: boolean
  }) => void
  clearTokenData: () => void
  toggleWatchlist: () => Promise<void>
}

const TokenContext = createContext<TokenContextType | undefined>(undefined)

export function TokenProvider({ children }: { children: ReactNode }) {
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null)
  const [tokenPrice, setTokenPrice] = useState<number | null>(null)
  const [tokenChange, setTokenChange] = useState<number | null>(null)
  const [tokenPercentChange, setTokenPercentChange] = useState<number | null>(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  const setTokenData = useCallback((data: {
    symbol: string
    price: number
    change?: number
    percentChange?: number
    isInWatchlist?: boolean
  }) => {
    setTokenSymbol(data.symbol)
    setTokenPrice(data.price)
    setTokenChange(data.change || null)
    setTokenPercentChange(data.percentChange || null)
    setIsInWatchlist(data.isInWatchlist || false)
  }, [])

  const clearTokenData = useCallback(() => {
    setTokenSymbol(null)
    setTokenPrice(null)
    setTokenChange(null)
    setTokenPercentChange(null)
    setIsInWatchlist(false)
  }, [])

  const toggleWatchlist = useCallback(async () => {
    if (!tokenSymbol) return;
    
    try {
      const newState = !isInWatchlist;
      
      if (isInWatchlist) {
        await fetch(`/api/watchlist/${tokenSymbol}`, { method: 'DELETE' });
      } else {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: tokenSymbol })
        });
      }
      
      setIsInWatchlist(newState);
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
    }
  }, [tokenSymbol, isInWatchlist])

  return (
    <TokenContext.Provider
      value={{
        tokenSymbol,
        tokenPrice,
        tokenChange,
        tokenPercentChange,
        isInWatchlist,
        setTokenData,
        clearTokenData,
        toggleWatchlist,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

export function useToken() {
  const context = useContext(TokenContext)
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider')
  }
  return context
}
