import { MONNIFY_CONFIG, MonnifyConfig } from './monnify'

let accessToken: string | null = null
let tokenExpiresAt: number = 0

/**
 * Get Monnify access token
 */
export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiresAt - 60000) {
    return accessToken
  }

  const authUrl = `${MONNIFY_CONFIG.baseUrl}/api/v1/auth/login`
  const credentials = Buffer.from(`${MONNIFY_CONFIG.apiKey}:${MONNIFY_CONFIG.secretKey}`).toString('base64')

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: '{}',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Monnify token: ${error}`)
  }

  const data = await response.json()
  accessToken = data.responseBody.accessToken
  tokenExpiresAt = Date.now() + (data.responseBody.expiresIn * 1000)

  return accessToken || ''
}

/**
 * Verify bank account details
 */
export async function verifyBankAccount(
  accountNumber: string,
  bankCode: string
): Promise<{ accountName: string; accountNumber: string }> {
  const token = await getAccessToken()

  const response = await fetch(
    `${MONNIFY_CONFIG.baseUrl}/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to verify bank account')
  }

  const data = await response.json()
  return {
    accountName: data.responseBody.accountName,
    accountNumber: data.responseBody.accountNumber,
  }
}

/**
 * Initiate single disbursement (withdrawal)
 * @param amount - Amount in kobo (will be converted to NGN for Monnify API)
 */
export async function initiateDisbursement(
  accountNumber: string,
  accountName: string,
  bankCode: string,
  amount: number, // in kobo
  narration: string,
  reference: string
): Promise<{ transactionReference: string; status: string }> {
  const token = await getAccessToken()

  // Convert kobo to NGN (Monnify expects amount in NGN)
  const amountInNGN = amount / 100

  const response = await fetch(
    `${MONNIFY_CONFIG.baseUrl}/api/v2/disbursements/single`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInNGN,
        reference,
        narration,
        destinationBankCode: bankCode,
        destinationAccountNumber: accountNumber,
        destinationAccountName: accountName,
        currency: 'NGN',
        sourceAccountNumber: MONNIFY_CONFIG.sourceAccountNumber || '', // Your Monnify wallet account
      }),
    }
  )

  const data = await response.json()

  if (!response.ok || !data.requestSuccessful) {
    const errorMsg = data.responseMessage || data.message || 'Disbursement failed'
    throw new Error(errorMsg)
  }

  return {
    transactionReference: data.responseBody.transactionReference,
    status: data.responseBody.status,
  }
}

/**
 * Get disbursement transaction status
 */
export async function getDisbursementStatus(
  transactionReference: string
): Promise<{ status: string; amount: number }> {
  const token = await getAccessToken()

  const response = await fetch(
    `${MONNIFY_CONFIG.baseUrl}/api/v2/disbursements/single/transactions?transactionReference=${transactionReference}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get disbursement status')
  }

  const data = await response.json()
  return {
    status: data.responseBody[0]?.status || 'UNKNOWN',
    amount: data.responseBody[0]?.amount || 0,
  }
}
