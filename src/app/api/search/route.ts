import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Mock data for search results (replace with database query when startup model exists)
const MOCK_STARTUPS = [
  { id: '1', name: 'PayStack Tech Ltd', symbol: 'PYSK', industry: 'Software', price: 0.0054, change: 6.82, marketCap: 500000, annualYield: 12.5 },
  { id: '2', name: 'Whisper Inc.', symbol: 'WISP', industry: 'EdTech', price: 1.81, change: 5.71, marketCap: 1200000, annualYield: 8.3 },
  { id: '3', name: 'Edurex Service Inc.', symbol: 'EDRX', industry: 'Fintech', price: 0.13, change: 4.63, marketCap: 800000, annualYield: 15.2 },
  { id: '4', name: 'Hynet Tech Ltd', symbol: 'HYNET', industry: 'Software', price: 0.64, change: 3.24, marketCap: 450000, annualYield: 10.8 },
  { id: '5', name: 'Cerebral IO', symbol: 'IO', industry: 'AI', price: 0.0041, change: -0.52, marketCap: 200000, annualYield: 22.5 },
  { id: '6', name: 'Tesla Corp', symbol: 'WEETH', industry: 'Automotive', price: 1950.63, change: -0.01, marketCap: 500000000, annualYield: 5.2 },
  { id: '7', name: 'Balancer', symbol: 'BAL', industry: 'DeFi', price: 1.05, change: -3.69, marketCap: 350000, annualYield: 18.7 },
  { id: '8', name: 'Mantoformin', symbol: 'XAUT', industry: 'Crypto', price: 3274.71, change: 1.03, marketCap: 800000000, annualYield: 4.1 },
  { id: '9', name: 'ChainLink', symbol: 'LINK', industry: 'DeFi', price: 24.50, change: 2.15, marketCap: 1500000000, annualYield: 8.5 },
  { id: '10', name: 'Uniswap', symbol: 'UNI', industry: 'DeFi', price: 8.75, change: -1.2, marketCap: 650000000, annualYield: 12.3 },
]

const searchSchema = z.object({
  q: z.string().optional(),
  industry: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minMarketCap: z.number().optional(),
  maxMarketCap: z.number().optional(),
  minYield: z.number().optional(),
  maxYield: z.number().optional(),
  limit: z.number().min(1).max(50).default(10),
})

interface SearchResult {
  id: string
  name: string
  symbol: string
  industry: string
  price: number
  change: number
  marketCap: number
  annualYield: number
}

/**
 * GET /api/search - Search startups/companies
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      q: searchParams.get('q') || undefined,
      industry: searchParams.get('industry') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      minMarketCap: searchParams.get('minMarketCap') ? parseFloat(searchParams.get('minMarketCap')!) : undefined,
      maxMarketCap: searchParams.get('maxMarketCap') ? parseFloat(searchParams.get('maxMarketCap')!) : undefined,
      minYield: searchParams.get('minYield') ? parseFloat(searchParams.get('minYield')!) : undefined,
      maxYield: searchParams.get('maxYield') ? parseFloat(searchParams.get('maxYield')!) : undefined,
      limit: parseInt(searchParams.get('limit') || '10'),
    }

    const data = searchSchema.parse(params)

    // Filter mock data (replace with database query)
    let results = [...MOCK_STARTUPS]

    // Text search
    if (data.q && data.q.trim()) {
      const query = data.q.toLowerCase().trim()
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.symbol.toLowerCase().includes(query) ||
          item.industry.toLowerCase().includes(query)
      )
    }

    // Industry filter
    if (data.industry) {
      results = results.filter((item) => item.industry === data.industry)
    }

    // Price range filter
    if (data.minPrice !== undefined) {
      results = results.filter((item) => item.price >= data.minPrice!)
    }
    if (data.maxPrice !== undefined) {
      results = results.filter((item) => item.price <= data.maxPrice!)
    }

    // Market cap filter
    if (data.minMarketCap !== undefined) {
      results = results.filter((item) => item.marketCap >= data.minMarketCap!)
    }
    if (data.maxMarketCap !== undefined) {
      results = results.filter((item) => item.marketCap <= data.maxMarketCap!)
    }

    // Yield filter
    if (data.minYield !== undefined) {
      results = results.filter((item) => item.annualYield >= data.minYield!)
    }
    if (data.maxYield !== undefined) {
      results = results.filter((item) => item.annualYield <= data.maxYield!)
    }

    // Limit results
    results = results.slice(0, data.limit)

    // Format results
    const formattedResults: SearchResult[] = results.map((item) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      industry: item.industry,
      price: item.price,
      change: item.change,
      marketCap: item.marketCap,
      annualYield: item.annualYield,
    }))

    return NextResponse.json({
      results: formattedResults,
      total: formattedResults.length,
      query: data.q || '',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
