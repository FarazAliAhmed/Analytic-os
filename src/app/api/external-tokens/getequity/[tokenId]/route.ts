import { NextRequest, NextResponse } from 'next/server'
import { fetchTokenById } from '@/lib/getequity/client'

/**
 * GET /api/external-tokens/getequity/[tokenId]
 * Fetch single token from GetEquitiy API
 *
 * Query params:
 * - sandbox: boolean (optional) - Use sandbox API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params
    const { searchParams } = new URL(request.url)
    const sandbox = searchParams.get('sandbox') === 'true'

    const token = await fetchTokenById(tokenId, sandbox)

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      token,
    })
  } catch (error) {
    console.error('GetEquitiy token error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch token' },
      { status: 500 }
    )
  }
}
