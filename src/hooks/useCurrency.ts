import { useState, useEffect } from 'react'

interface ExchangeRateData {
  rate: number
  lastUpdated: string
  displayRate: string
}

interface UseCurrencyReturn {
  currency: 'NGN' | 'USD'
  exchangeRate: ExchangeRateData | null
  loading: boolean
  error: string | null
  setCurrency: (currency: 'NGN' | 'USD') => void
  convertAmount: (amount: number) => number
  formatAmount: (amount: number) => string
}

/**
 * Hook for managing currency preferences and conversions
 * @param defaultCurrency - Default currency preference
 */
export function useCurrency(defaultCurrency: 'NGN' | 'USD' = 'NGN'): UseCurrencyReturn {
  const [currency, setCurrency] = useState<'NGN' | 'USD'>(defaultCurrency)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch exchange rate on mount and when currency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currency === 'NGN') {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/currency/exchange-rate')
        const data = await response.json()

        if (data.success) {
          setExchangeRate(data.data)
        } else {
          setError('Failed to fetch exchange rate')
        }
      } catch (err) {
        setError('Network error')
        console.error('Exchange rate fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeRate()

    // Refresh exchange rate every hour
    const interval = setInterval(fetchExchangeRate, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [currency])

  /**
   * Convert amount from NGN to selected currency
   */
  const convertAmount = (amountInNGN: number): number => {
    if (currency === 'NGN') {
      return amountInNGN
    }

    if (!exchangeRate) {
      return 0
    }

    return amountInNGN * exchangeRate.rate
  }

  /**
   * Format amount with currency symbol
   */
  const formatAmount = (amountInNGN: number): string => {
    if (currency === 'NGN') {
      return `₦${Math.round(amountInNGN).toLocaleString('en-NG')}`
    }

    const usdAmount = convertAmount(amountInNGN)
    return `$${usdAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  return {
    currency,
    exchangeRate,
    loading,
    error,
    setCurrency,
    convertAmount,
    formatAmount
  }
}
