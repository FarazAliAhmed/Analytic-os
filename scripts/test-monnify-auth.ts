// Test Monnify authentication
import 'dotenv/config'

const MONNIFY_BASE_URL = process.env.MONNIFY_BASE_URL || 'https://api.monnify.com'
const MONNIFY_API_KEY = process.env.MONNIFY_API_KEY
const MONNIFY_SECRET_KEY = process.env.MONNIFY_SECRET_KEY

async function testMonnifyAuth() {
  console.log('=== Testing Monnify Authentication ===\n')
  
  console.log('Configuration:')
  console.log('  Base URL:', MONNIFY_BASE_URL)
  console.log('  API Key:', MONNIFY_API_KEY ? `${MONNIFY_API_KEY.substring(0, 10)}...` : 'NOT SET')
  console.log('  Secret Key:', MONNIFY_SECRET_KEY ? `${MONNIFY_SECRET_KEY.substring(0, 10)}...` : 'NOT SET')
  console.log()

  if (!MONNIFY_API_KEY || !MONNIFY_SECRET_KEY) {
    console.error('❌ Monnify credentials not set in environment variables')
    return
  }

  try {
    const authUrl = `${MONNIFY_BASE_URL}/api/v1/auth/login`
    const credentials = Buffer.from(`${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`).toString('base64')

    console.log('Attempting authentication...')
    console.log('URL:', authUrl)
    console.log()

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: '{}'
    })

    const responseText = await response.text()
    console.log('Response Status:', response.status)
    console.log('Response:', responseText)
    console.log()

    if (response.ok) {
      const data = JSON.parse(responseText)
      console.log('✅ Authentication successful!')
      console.log('Token expires in:', data.responseBody.expiresIn, 'seconds')
    } else {
      console.error('❌ Authentication failed!')
      console.error('Status:', response.status)
      console.error('Response:', responseText)
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

testMonnifyAuth()
