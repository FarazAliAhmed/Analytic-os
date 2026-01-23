import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

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
  logoUrl: string | null
}

/**
 * GET /api/search - Search tokens/companies
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

    // Build where clause for Prisma query
    const where: any = {
      isActive: true, // Only search active tokens
    }

    // Text search - search in name, symbol, and industry
    if (data.q && data.q.trim()) {
      const query = data.q.toLowerCase().trim()
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { symbol: { contains: query, mode: 'insensitive' } },
        { industry: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Industry filter
    if (data.industry) {
      where.industry = data.industry
    }

    // Price range filter (price is stored in kobo, so multiply by 100)
    if (data.minPrice !== undefined) {
      where.price = { ...where.price, gte: Math.round(data.minPrice * 100) }
    }
    if (data.maxPrice !== undefined) {
      where.price = { ...where.price, lte: Math.round(data.maxPrice * 100) }
    }

    // Volume filter (using volume as market cap proxy)
    if (data.minMarketCap !== undefined) {
      where.volume = { ...where.volume, gte: data.minMarketCap }
    }
    if (data.maxMarketCap !== undefined) {
      where.volume = { ...where.volume, lte: data.maxMarketCap }
    }

    // Yield filter
    if (data.minYield !== undefined) {
      where.annualYield = { ...where.annualYield, gte: data.minYield }
    }
    if (data.maxYield !== undefined) {
      where.annualYield = { ...where.annualYield, lte: data.maxYield }
    }

    // Query database
    const tokens = await prisma.token.findMany({
      where,
      take: data.limit,
      orderBy: [
        { volume: 'desc' }, // Sort by volume (most traded first)
        { name: 'asc' }
      ]
    })

    // Format results
    const formattedResults: SearchResult[] = tokens.map((token) => ({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      industry: token.industry,
      price: token.price / 100, // Convert from kobo to naira
      change: parseFloat(token.priceChange24h.toString()),
      marketCap: token.volume, // Using volume as market cap
      annualYield: parseFloat(token.annualYield.toString()),
      logoUrl: token.logoUrl
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
