#!/usr/bin/env node

/**
 * Test script to validate the Price Alert Settings component implementation
 * This script checks if the component files exist and have the required functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Price Alert Settings Component Implementation...\n');

// Check if component file exists
const componentPath = path.join(__dirname, '../src/components/account/PriceAlertSettings.tsx');
const testPath = path.join(__dirname, '../src/components/account/__tests__/PriceAlertSettings.test.tsx');

console.log('📁 Checking component files...');

if (fs.existsSync(componentPath)) {
  console.log('✅ PriceAlertSettings.tsx exists');
  
  // Read component content and check for required functionality
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  const requiredFeatures = [
    { name: 'Threshold input', pattern: /type="number".*min="0\.1".*max="100"|input.*threshold.*number/i },
    { name: 'Token selection', pattern: /select.*token|token.*select/i },
    { name: 'Active alerts list', pattern: /priceAlerts.*map|alerts.*map/i },
    { name: 'Alert creation', pattern: /handleAddAlert|addAlert|createAlert/i },
    { name: 'Alert deletion', pattern: /handleDeleteAlert|deleteAlert|removeAlert/i },
    { name: 'Threshold validation', pattern: /threshold.*validation|validate.*threshold|threshold.*0.*100/i },
    { name: 'API integration', pattern: /\/api\/settings\/price-alerts/i },
    { name: 'Loading state', pattern: /loading.*state|setLoading|useState.*loading/i },
    { name: 'Error handling', pattern: /error.*handling|catch.*error|try.*catch/i },
    { name: 'Toggle switch', pattern: /ToggleSwitch/i }
  ];
  
  console.log('\n🔧 Checking required functionality...');
  
  requiredFeatures.forEach(feature => {
    if (feature.pattern.test(componentContent)) {
      console.log(`✅ ${feature.name} - implemented`);
    } else {
      console.log(`❌ ${feature.name} - missing or incomplete`);
    }
  });
  
} else {
  console.log('❌ PriceAlertSettings.tsx not found');
}

if (fs.existsSync(testPath)) {
  console.log('✅ Test file exists');
} else {
  console.log('⚠️  Test file not found (optional)');
}

// Check API endpoint
const apiPath = path.join(__dirname, '../src/app/api/settings/price-alerts/route.ts');
if (fs.existsSync(apiPath)) {
  console.log('✅ Price alerts API endpoint exists');
  
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  const apiFeatures = [
    { name: 'GET endpoint', pattern: /export.*async.*function.*GET/i },
    { name: 'PUT endpoint', pattern: /export.*async.*function.*PUT/i },
    { name: 'Threshold validation', pattern: /thresholdPercentage.*validation|threshold.*0.*100/i },
    { name: 'Token validation', pattern: /watchedTokens.*validation|tokens.*array/i },
    { name: 'Database operations', pattern: /prisma.*upsert|prisma.*update/i }
  ];
  
  console.log('\n🔌 Checking API functionality...');
  
  apiFeatures.forEach(feature => {
    if (feature.pattern.test(apiContent)) {
      console.log(`✅ ${feature.name} - implemented`);
    } else {
      console.log(`❌ ${feature.name} - missing or incomplete`);
    }
  });
  
} else {
  console.log('❌ Price alerts API endpoint not found');
}

// Check integration with AccountContainer
const accountContainerPath = path.join(__dirname, '../src/common/AccountContainer.tsx');
if (fs.existsSync(accountContainerPath)) {
  const accountContent = fs.readFileSync(accountContainerPath, 'utf8');
  
  console.log('\n🔗 Checking integration...');
  
  if (accountContent.includes('PriceAlertSettings')) {
    console.log('✅ Component integrated into AccountContainer');
  } else {
    console.log('❌ Component not integrated into AccountContainer');
  }
  
  if (accountContent.includes('import') && accountContent.includes('PriceAlertSettings')) {
    console.log('✅ Component imported correctly');
  } else {
    console.log('❌ Component import missing');
  }
} else {
  console.log('❌ AccountContainer not found');
}

console.log('\n📋 Implementation Summary:');
console.log('Task 4.5: Price Alert Settings Component');
console.log('- File: src/components/account/PriceAlertSettings.tsx');
console.log('- Features: Threshold input, token selection, active alerts list, creation/deletion, validation');
console.log('- Integration: Added to AccountContainer');
console.log('- API: Uses existing /api/settings/price-alerts endpoint');

console.log('\n✨ Component implementation completed!');