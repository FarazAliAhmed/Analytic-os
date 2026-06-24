// src/lib/qoreid.ts
// QoreID NIN verification service
// Docs: https://docs.qoreid.com/docs/nin-with-nin
// Base URL: https://api.qoreid.com
// Auth: POST /token with clientId + clientSecret -> accessToken (Bearer)

const QOREID_BASE_URL = 'https://api.qoreid.com'
const QOREID_CLIENT_ID = process.env.QOREID_CLIENT_ID || ''
const QOREID_CLIENT_SECRET = process.env.QOREID_CLIENT_SECRET || ''

let cachedToken: string | null = null
let tokenExpiresAt = 0

/**
 * Get QoreID access token (cached)
 */
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken
  }

  const res = await fetch(`${QOREID_BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: QOREID_CLIENT_ID,
      secret: QOREID_CLIENT_SECRET,
    }),
  })

  const data = await res.json()

  if (!res.ok || !data.accessToken) {
    throw new Error(
      `QoreID auth failed (${res.status}): ${data.message || JSON.stringify(data)}`
    )
  }

  cachedToken = data.accessToken
  // expiresIn comes back as "7200 secs" string — parse just the number
  const expiresInRaw = data.expiresIn ?? '3300 secs'
  const expiresIn = parseInt(String(expiresInRaw)) || 3300
  tokenExpiresAt = Date.now() + expiresIn * 1000

  return cachedToken!
}

export interface NINVerificationResult {
  verified: boolean
  firstname?: string
  lastname?: string
  middlename?: string
  phone?: string
  gender?: string
  birthdate?: string
  address?: string
  nin?: string
  rawStatus?: string
}

/**
 * Verify a NIN number via QoreID
 * Endpoint: POST /v1/ng/identities/nin/{idNumber}
 * Required body: firstname, lastname
 */
export async function verifyNIN(
  nin: string,
  firstname: string,
  lastname: string
): Promise<NINVerificationResult> {
  if (!QOREID_CLIENT_ID || !QOREID_CLIENT_SECRET) {
    throw new Error('QoreID credentials not configured. Set QOREID_CLIENT_ID and QOREID_CLIENT_SECRET in .env')
  }

  const token = await getAccessToken()

  const res = await fetch(`${QOREID_BASE_URL}/v1/ng/identities/nin/${nin}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstname, lastname }),
  })

  const data = await res.json()

  console.log('[QOREID] NIN verification response:', {
    status: res.status,
    state: data?.status?.state,
    verificationStatus: data?.status?.status,
    ninCheck: data?.summary?.nin_check?.status,
  })

  if (!res.ok) {
    throw new Error(
      `QoreID NIN verification failed (${res.status}): ${data.message || JSON.stringify(data)}`
    )
  }

  const verified = data?.status?.status === 'verified'
  const ninData = data?.nin || {}

  return {
    verified,
    rawStatus: data?.status?.status,
    firstname: ninData.firstname,
    lastname: ninData.lastname,
    middlename: ninData.middlename,
    phone: ninData.phone,
    gender: ninData.gender,
    birthdate: ninData.birthdate,
    address: ninData.address,
    nin: ninData.nin,
  }
}
