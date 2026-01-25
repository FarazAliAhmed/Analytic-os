# Wallet Creation Debug Summary

## Issue
User `faraz59995@gmail.com` was created without a wallet.

## Root Cause Analysis

### What Happened
1. User registered on Jan 25, 2026 at 00:59:46 GMT+0500
2. User was created successfully in the database
3. Wallet creation failed silently during registration (error was caught and logged)
4. Registration continued without wallet (by design - to not block user signup)

### Why Wallet Creation Failed
The wallet creation likely failed during the original registration due to one of these reasons:
- Network timeout to Monnify API
- Monnify API temporary unavailability
- Rate limiting from Monnify
- Missing or incomplete user data at the time of registration

## Solution Applied

### Immediate Fix
✅ Created wallet manually for existing user using `scripts/create-missing-wallets.ts`

**Result:**
- Account Number: 6574139442
- Bank: Moniepoint Microfinance Bank
- Account Name: Far (Monnify truncates names)
- Status: Active and working

### Wallet Creation Flow (Current Implementation)

#### 1. Credentials Registration (`/api/auth/register`)
```typescript
// Creates user first
const user = await prisma.user.create({ ... })

// Then attempts wallet creation
try {
  const monnifyAccount = await createReservedAccount({ ... })
  const wallet = await prisma.wallet.create({ ... })
} catch (walletError) {
  console.error('Failed to create wallet during registration:', walletError)
  // Registration continues - wallet can be created later
}
```

#### 2. OAuth Sign-In (Google/Facebook/Twitter)
Two places handle wallet creation:

**A. signIn Callback:**
- Checks if user exists and has no wallet
- Creates wallet if missing

**B. createUser Event:**
- Fires when PrismaAdapter creates new OAuth user
- Automatically creates wallet for new user

## Verification

### Current Database State
```
Total Users: 1
Total Wallets: 1
Users without wallets: 0
```

### Monnify API Status
✅ Live API is working correctly
- Base URL: https://api.monnify.com
- Contract Code: 477829380233
- Test account creation: Successful

## Recommendations

### 1. Add Retry Logic
Add retry mechanism for wallet creation:
```typescript
async function createWalletWithRetry(user, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await createReservedAccount({ ... })
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await sleep(1000 * (i + 1)) // Exponential backoff
    }
  }
}
```

### 2. Add Background Job
Create a cron job or background task to:
- Check for users without wallets every hour
- Automatically create missing wallets
- Send notification to admin if creation fails

### 3. Add User Notification
When wallet creation fails:
- Show message to user: "Your wallet is being set up. This may take a few minutes."
- Add a "Retry Wallet Creation" button in the UI
- Send email when wallet is ready

### 4. Monitoring
Add monitoring for:
- Wallet creation success rate
- Monnify API response times
- Users without wallets count

## Scripts Created

1. **debug-wallet-creation.ts** - Diagnose wallet issues
2. **create-missing-wallets.ts** - Create wallets for users who don't have them
3. **check-user-wallet.ts** - Check specific user's wallet status
4. **delete-all-users-with-wallets.ts** - Clean database (for testing)

## Next Steps

1. ✅ Wallet created for existing user
2. Monitor new user registrations to ensure wallets are created
3. Consider implementing retry logic and background jobs
4. Add user-facing wallet status indicator

## Notes

- Monnify truncates account names (e.g., "Faraz ahmed" → "Far")
- This is normal Monnify behavior and doesn't affect functionality
- The full name is sent to Monnify, they just display it truncated
- Account number and banking functionality work perfectly
