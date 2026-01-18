# Token Volume Calculation

## Overview
Token volume represents the total value of all trades (buys and sells) for a token.

## Formula
```
Total Volume = Buy Volume + Sell Volume
```

## Example
If:
- Buy Volume = ₦80,000
- Sell Volume = ₦47,500

Then:
- **Total Volume = ₦80,000 + ₦47,500 = ₦127,500**

## Implementation

### Database Storage
- Volume is stored in **kobo** (smallest unit) in the `Token.volume` field
- Example: ₦127,500 is stored as 12,750,000 kobo

### Buy Transaction
When a user buys tokens:
1. Calculate amount in kobo: `amountInKobo = nairaAmount × 100`
2. Increment token volume: `volume: { increment: amountInKobo }`

**Code Location:** `src/app/api/token/buy/route.ts`
```typescript
await tx.token.update({
  where: { id: token.id },
  data: {
    volume: { increment: amountInKobo },
    transactionCount: { increment: 1 }
  }
})
```

### Sell Transaction
When a user sells tokens:
1. Calculate amount in kobo: `nairaInKobo = Math.floor(nairaReceived × 100)`
2. Increment token volume: `volume: { increment: nairaInKobo }`

**Code Location:** `src/app/api/token/sell/route.ts`
```typescript
await tx.token.update({
  where: { id: token.id },
  data: {
    volume: { increment: nairaInKobo },
    transactionCount: { increment: 1 }
  }
})
```

### Display
Volume is displayed by converting from kobo to Naira:
```typescript
displayVolume = tokenData.volume / 100
```

**Code Location:** `src/components/dashboard/token/OverviewCard.tsx`
```typescript
{tokenData ? formatLargeNumber(tokenData.volume / 100) : '---'}
```

## Troubleshooting

### Volume Shows ₦0
If a token shows ₦0 volume, it means:
1. No transactions have occurred yet (new token)
2. The token was created before volume tracking was implemented

### Fix for Existing Tokens
Run the migration script to recalculate volumes from transaction history:
```bash
npx tsx scripts/fix-token-volumes.ts
```

This script:
1. Calculates buy volume from `TokenPurchase` records
2. Calculates sell volume from `Transaction` records
3. Updates each token's volume to the correct total

## Verification

### Check Current Volumes
```bash
npx tsx scripts/check-volume.ts
```

This displays:
- Current stored volume for each token
- Actual volume calculated from transactions
- Any discrepancies

## Data Flow

```
User Buys ₦80,000 worth of tokens
  ↓
amountInKobo = 80,000 × 100 = 8,000,000
  ↓
Token.volume += 8,000,000
  ↓
Display: 8,000,000 ÷ 100 = ₦80,000

User Sells tokens for ₦47,500
  ↓
nairaInKobo = 47,500 × 100 = 4,750,000
  ↓
Token.volume += 4,750,000
  ↓
Total: 8,000,000 + 4,750,000 = 12,750,000
  ↓
Display: 12,750,000 ÷ 100 = ₦127,500
```

## Summary
✅ The implementation correctly follows the formula: **Total Volume = Buy Volume + Sell Volume**
✅ Both buy and sell operations increment the same volume field
✅ Volume is stored in kobo and displayed in Naira
✅ The calculation is accurate and matches the requirement
