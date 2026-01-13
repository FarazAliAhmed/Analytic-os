import { NextRequest, NextResponse } from 'next/server'
import { fetchTokens } from '@/lib/getequity/client'

/**
 * GET /api/external-tokens/getequity
 * Fetch tokens from GetEquitiy API
 *
 * Query params:
 * - sandbox: boolean (optional) - Use sandbox API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sandbox = searchParams.get('sandbox') === 'true'

    const tokens = await fetchTokens(sandbox)

    return NextResponse.json({
      success: true,
      tokens,
      source: sandbox ? 'getequity-sandbox' : 'getequity',
    })
  } catch (error) {
    console.error('GetEquitiy tokens error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}
