/**
 * Currency Conversion Service
 * Handles live NGN to USD conversion using ExchangeRate-API
 */

interface ExchangeRateResponse {
  base: string
  date: string
  rates: {
    USD: number
    NGN: number
    [key: string]: number
  }
}

interface ConversionCache {
  rate: number
  timestamp: number
}

// Cache exchange rate for 1 hour to reduce API calls
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
let exchangeRateCache: ConversionCache | null = null

/**
 * Fetch current NGN to USD exchange rate
 */
async function fetchExchangeRate(): Promise<number> {
  try {
    // Check cache first
    if (exchangeRateCache && Date.now() - exchangeRateCache.timestamp < CACHE_DURATION) {
      return exchangeRateCache.rate
    }

    // Fetch from API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN', {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate')
    }

    const data: ExchangeRateResponse = await response.json()
    const rate = data.rates.USD

    // Update cache
    exchangeRateCache = {
      rate,
      timestamp: Date.now()
    }

    return rate
  } catch (error) {
    console.error('Exchange rate fetch error:', error)
    // Fallback to approximate rate if API fails
    return 0.0012 // Approximate NGN to USD rate (1 NGN ≈ 0.0012 USD)
  }
}

/**
 * Convert NGN to USD
 * @param amountInNGN - Amount in Nigerian Naira
 * @returns Amount in US Dollars
 */
export async function convertNGNtoUSD(amountInNGN: number): Promise<number> {
  const rate = await fetchExchangeRate()
  return amountInNGN * rate
}

/**
 * Convert USD to NGN
 * @param amountInUSD - Amount in US Dollars
 * @returns Amount in Nigerian Naira
 */
export async function convertUSDtoNGN(amountInUSD: number): Promise<number> {
  const rate = await fetchExchangeRate()
  return amountInUSD / rate
}

/**
 * Format currency based on user preference
 * @param amount - Amount in NGN (base currency)
 * @param currency - Target currency ('NGN' or 'USD')
 * @param includeSymbol - Whether to include currency symbol
 */
export async function formatCurrency(
  amount: number,
  currency: 'NGN' | 'USD',
  includeSymbol: boolean = true
): Promise<string> {
  if (currency === 'NGN') {
    const formatted = Math.round(amount).toLocaleString('en-NG')
    return includeSymbol ? `₦${formatted}` : formatted
  } else {
    const usdAmount = await convertNGNtoUSD(amount)
    const formatted = usdAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return includeSymbol ? `$${formatted}` : formatted
  }
}

/**
 * Get current exchange rate (cached)
 */
export async function getCurrentExchangeRate(): Promise<{
  rate: number
  lastUpdated: Date
}> {
  const rate = await fetchExchangeRate()
  return {
    rate,
    lastUpdated: exchangeRateCache ? new Date(exchangeRateCache.timestamp) : new Date()
  }
}

/**
 * Clear exchange rate cache (useful for testing or manual refresh)
 */
export function clearExchangeRateCache(): void {
  exchangeRateCache = null
}
