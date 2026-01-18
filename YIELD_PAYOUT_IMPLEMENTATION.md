# Yield Payout Implementation Plan

## Problem
Currently, the "Yield Payout" column shows calculated dummy data based on `Price × Annual Yield × Period`. 
We need to show the **actual sum of all yield paid out to investors** for each token within the selected time period.

## Solution Overview

### Option 1: Use Accumulated Yield from TokenHolding (Quick Solution)
Since we already track `accumulatedYield` per user in the `TokenHolding` table, we can:
1. Sum all `accumulatedYield` for each token
2. Filter by time period using `lastYieldUpdate` timestamp
3. Return aggregated data per token

**Pros:**
- No schema changes needed
- Uses existing data
- Quick to implement

**Cons:**
- `accumulatedYield` is cumulative, not time-period specific
- `lastYieldUpdate` only tracks last calculation time, not payout history

### Option 2: Create YieldPayout History Table (Proper Solution)
Create a new table to track each yield payout event:

```prisma
model YieldPayout {
  id          String   @id @default(uuid())
  userId      String
  tokenId     String
  amount      Decimal  @db.Decimal(18, 2)  // Yield amount in Naira
  payoutDate  DateTime @default(now())
  period      String   // "daily", "weekly", "monthly", "annual"
  
  user        User     @relation(fields: [userId], references: [id])
  
  @@index([tokenId, payoutDate])
  @@index([userId, payoutDate])
}
```

**Pros:**
- Accurate historical tracking
- Can query by exact time periods
- Audit trail for all payouts

**Cons:**
- Requires schema migration
- Need to implement payout distribution system
- More complex

## Recommended Approach

### Phase 1: Quick Implementation (Use Existing Data)
Calculate yield based on current holdings and time period:

```typescript
// For each token, calculate total yield for the period
const totalYieldPayout = await prisma.tokenHolding.aggregate({
  where: {
    tokenId: symbol,
    quantity: { gt: 0 }
  },
  _sum: {
    accumulatedYield: true
  }
})
```

Then prorate based on time period:
- 1d: totalYield × (1/365)
- 7d: totalYield × (7/365)
- 30d: totalYield × (30/365)
- 1yr: totalYield × 1

### Phase 2: Proper Implementation (Future)
1. Add YieldPayout model to schema
2. Create automated yield distribution system
3. Record each payout event
4. Query actual payouts by time period

## Implementation Steps (Phase 1)

1. Create API endpoint: `/api/tokens/yield-payouts?period=30d`
2. Calculate total accumulated yield per token
3. Prorate based on selected period
4. Update TopTable to fetch from API
5. Cache results for performance

