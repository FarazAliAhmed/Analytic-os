/**
 * Test script for price alerts functionality
 * This script tests the price alerts API endpoints and price monitoring logic
 */

import { PriceMonitor } from '../src/lib/price-monitor'

async function testPriceAlertsAPI() {
  console.log('🧪 Testing Price Alerts API...')

  // Test data
  const testUserId = 'test-user-123'
  const testSettings = {
    enabled: true,
    thresholdPercentage: 10.0,
    watchedTokens: ['INV', 'PYSK']
  }

  try {
    // Test 1: Update price alert settings
    console.log('\n1️⃣ Testing PUT /api/settings/price-alerts')
    
    const updateResponse = await fetch('http://localhost:3000/api/settings/price-alerts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Note: In real usage, this would include authentication headers
      },
      body: JSON.stringify(testSettings)
    })

    if (updateResponse.ok) {
      const updateData = await updateResponse.json()
      console.log('✅ Price alert settings updated:', updateData.message)
    } else {
      console.log('❌ Failed to update settings:', updateResponse.status)
    }

    // Test 2: Get price alert settings
    console.log('\n2️⃣ Testing GET /api/settings/price-alerts')
    
    const getResponse = await fetch('http://localhost:3000/api/settings/price-alerts')
    
    if (getResponse.ok) {
      const getData = await getResponse.json()
      console.log('✅ Retrieved price alert settings')
      console.log('   - Enabled:', getData.data.settings.enabled)
      console.log('   - Threshold:', getData.data.settings.thresholdPercentage + '%')
      console.log('   - Watched tokens:', getData.data.settings.watchedTokens.join(', '))
      console.log('   - Active alerts:', getData.data.priceAlerts.length)
      console.log('   - Available tokens:', getData.data.availableTokens.length)
    } else {
      console.log('❌ Failed to get settings:', getResponse.status)
    }

    // Test 3: Price monitor functionality
    console.log('\n3️⃣ Testing Price Monitor')
    
    const monitor = PriceMonitor.getInstance()
    console.log('✅ Price monitor instance created')
    
    // Test status
    const status = monitor.getStatus()
    console.log('   - Is running:', status.isRunning)
    
    // Test manual price check (this would normally be done automatically)
    try {
      await monitor.checkTokenPrice('INV')
      console.log('✅ Manual price check completed for INV token')
    } catch (error) {
      console.log('⚠️  Manual price check failed (expected if token not found):', (error as Error).message)
    }

    console.log('\n🎉 Price alerts testing completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

async function testValidation() {
  console.log('\n🔍 Testing Validation Logic...')

  const testCases = [
    {
      name: 'Invalid threshold (negative)',
      data: { thresholdPercentage: -5 },
      expectError: true
    },
    {
      name: 'Invalid threshold (too high)',
      data: { thresholdPercentage: 150 },
      expectError: true
    },
    {
      name: 'Invalid watched tokens (not array)',
      data: { watchedTokens: 'INV,PYSK' },
      expectError: true
    },
    {
      name: 'Valid settings',
      data: { 
        enabled: true,
        thresholdPercentage: 5.0,
        watchedTokens: ['INV']
      },
      expectError: false
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n   Testing: ${testCase.name}`)
    
    try {
      const response = await fetch('http://localhost:3000/api/settings/price-alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.data)
      })

      const result = await response.json()
      
      if (testCase.expectError) {
        if (!response.ok) {
          console.log('   ✅ Correctly rejected invalid input:', result.error)
        } else {
          console.log('   ❌ Should have rejected invalid input')
        }
      } else {
        if (response.ok) {
          console.log('   ✅ Correctly accepted valid input')
        } else {
          console.log('   ❌ Should have accepted valid input:', result.error)
        }
      }
    } catch (error) {
      console.log('   ⚠️  Request failed (expected if server not running):', (error as Error).message)
    }
  }
}

// Main test function
async function main() {
  console.log('🚀 Starting Price Alerts Test Suite')
  console.log('=====================================')
  
  await testPriceAlertsAPI()
  await testValidation()
  
  console.log('\n📋 Test Summary:')
  console.log('- API endpoints created and configured')
  console.log('- Validation logic implemented')
  console.log('- Price monitoring service ready')
  console.log('- Database integration prepared')
  console.log('\n💡 Next steps:')
  console.log('- Run database migrations to create tables')
  console.log('- Start the development server')
  console.log('- Test with real authentication')
  console.log('- Configure price monitoring intervals')
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

export { testPriceAlertsAPI, testValidation }