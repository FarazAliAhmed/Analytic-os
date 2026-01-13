// GetEquitiy API Client

const PRODUCTION_URL = process.env.GETEQUITY_API_URL || 'https://ge-exchange.herokuapp.com/v1/'
const SANDBOX_URL = process.env.GETEQUITY_SANDBOX_URL || 'https://ge-exchange-staging-1.herokuapp.com/v1/'
const PRODUCTION_KEY = process.env.GETEQUITY_SECRET_KEY || ''
const SANDBOX_KEY = process.env.GETEQUITY_SANDBOX_KEY || ''

export interface GetEquitiyToken {
  id: string
  name: string
  symbol: string
  price: number
  annualYield: number
  industry: string
  riskLevel: string
  payoutFrequency: string
  description?: string
  asset?: {
    id: string
    name: string
    logo: string
  }
}

export interface ExternalToken {
  id: string
  externalId: string
  name: string
  symbol: string
  price: number
  annualYield: number
  industry: string
  riskLevel: string
  payoutFrequency: string
  logoUrl: string | null
  description: string | null
  purchaseUrl: string
  source: 'getequity' | 'getequity-sandbox'
}

interface GetEquitiyResponse {
  data: GetEquitiyToken[]
  message?: string
  status?: number
}

interface GetEquitiySingleResponse {
  data: GetEquitiyToken
  message?: string
  status?: number
}

function getBaseUrl(sandbox: boolean): string {
  return sandbox ? SANDBOX_URL : PRODUCTION_URL
}

function getApiKey(sandbox: boolean): string {
  return sandbox ? SANDBOX_KEY : PRODUCTION_KEY
}

function transformToken(token: GetEquitiyToken, sandbox: boolean): ExternalToken {
  const baseUrl = getBaseUrl(sandbox)
  return {
    id: crypto.randomUUID(),
    externalId: token.id,
    name: token.name,
    symbol: token.symbol,
    price: token.price,
    annualYield: token.annualYield,
    industry: token.industry,
    riskLevel: token.riskLevel,
    payoutFrequency: token.payoutFrequency,
    logoUrl: token.asset?.logo || null,
    description: token.description || null,
    purchaseUrl: `https://getequity.io/invest/${token.id}`,
    source: sandbox ? 'getequity-sandbox' : 'getequity',
  }
}

export async function fetchTokens(sandbox: boolean = false): Promise<ExternalToken[]> {
  const baseUrl = getBaseUrl(sandbox)
  const apiKey = getApiKey(sandbox)

  if (!apiKey) {
    console.warn('GetEquitiy API key not configured')
    return []
  }

  try {
    const response = await fetch(`${baseUrl}api/tokens?closed=false&exited=false`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`GetEquitiy API error: ${response.status}`)
      return []
    }

    const data: GetEquitiyResponse = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      return []
    }

    return data.data.map(token => transformToken(token, sandbox))
  } catch (error) {
    console.error('GetEquitiy fetch error:', error)
    return []
  }
}

export async function fetchTokenById(tokenId: string, sandbox: boolean = false): Promise<ExternalToken | null> {
  const baseUrl = getBaseUrl(sandbox)
  const apiKey = getApiKey(sandbox)

  if (!apiKey) {
    console.warn('GetEquitiy API key not configured')
    return null
  }

  try {
    const response = await fetch(`${baseUrl}api/token/${tokenId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`GetEquitiy API error: ${response.status}`)
      return null
    }

    const data: GetEquitiySingleResponse = await response.json()

    if (!data.data) {
      return null
    }

    return transformToken(data.data, sandbox)
  } catch (error) {
    console.error('GetEquitiy fetch error:', error)
    return null
  }
}
