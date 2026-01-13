import { useState, useEffect, useCallback, useRef } from 'react'

export interface SearchResult {
  id: string
  name: string
  symbol: string
  industry: string
  price: number
  change: number
  marketCap: number
  annualYield: number
}

interface SearchFilters {
  industry?: string
  minPrice?: number
  maxPrice?: number
  minMarketCap?: number
  maxMarketCap?: number
  minYield?: number
  maxYield?: number
}

interface UseSearchOptions {
  debounceMs?: number
  limit?: number
  onError?: (error: Error) => void
}

interface UseSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  loading: boolean
  error: string | null
  recentSearches: string[]
  hasMore: boolean
  search: (query: string, filters?: SearchFilters) => Promise<void>
  clearSearch: () => void
  loadRecentSearches: () => Promise<void>
  clearRecentSearches: () => Promise<void>
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 300, limit = 10, onError } = options

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(false)

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const abortController = useRef<AbortController | null>(null)

  // Perform search
  const search = useCallback(
    async (searchQuery: string, filters?: SearchFilters) => {
      // Cancel previous request
      if (abortController.current) {
        abortController.current.abort()
      }

      abortController.current = new AbortController()

      if (!searchQuery.trim()) {
        setResults([])
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set('q', searchQuery.trim())
        params.set('limit', limit.toString())

        if (filters?.industry) params.set('industry', filters.industry)
        if (filters?.minPrice) params.set('minPrice', filters.minPrice.toString())
        if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
        if (filters?.minMarketCap) params.set('minMarketCap', filters.minMarketCap.toString())
        if (filters?.maxMarketCap) params.set('maxMarketCap', filters.maxMarketCap.toString())
        if (filters?.minYield) params.set('minYield', filters.minYield.toString())
        if (filters?.maxYield) params.set('maxYield', filters.maxYield.toString())

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: abortController.current.signal,
        })

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        setResults(data.results || [])
        setHasMore(data.total > limit)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return // Ignore aborted requests
        }
        const errorMessage = err instanceof Error ? err.message : 'Search failed'
        setError(errorMessage)
        onError?.(err instanceof Error ? err : new Error(errorMessage))
      } finally {
        setLoading(false)
      }
    },
    [limit, onError]
  )

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (query.trim()) {
      debounceTimer.current = setTimeout(() => {
        search(query)
      }, debounceMs)
    } else {
      setResults([])
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query, debounceMs, search])

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    setLoading(false)
  }, [])

  // Load recent searches
  const loadRecentSearches = useCallback(async () => {
    try {
      const response = await fetch('/api/search/recent')
      if (response.ok) {
        const data = await response.json()
        setRecentSearches(data.recentSearches?.map((s: { query: string }) => s.query) || [])
      }
    } catch (err) {
      console.error('Failed to load recent searches:', err)
    }
  }, [])

  // Clear recent searches
  const clearRecentSearches = useCallback(async () => {
    try {
      await fetch('/api/search/recent', { method: 'DELETE' })
      setRecentSearches([])
    } catch (err) {
      console.error('Failed to clear recent searches:', err)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    recentSearches,
    hasMore,
    search,
    clearSearch,
    loadRecentSearches,
    clearRecentSearches,
  }
}
