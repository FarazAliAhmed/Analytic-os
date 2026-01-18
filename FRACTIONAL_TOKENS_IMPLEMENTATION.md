# Fractional Tokens & Daily Yield Implementation

## Summary

Successfully implemented fractional token purchases and daily yield calculation system as per client requirements.

## Changes Made

### 1. Database Schema Updates (`prisma/schema.prisma`)

Updated `TokenHolding` model to support fractional tokens and yield tracking:

```prisma
model TokenHolding {
  quantity         Decimal  @db.Decimal(18, 6)  // Support fractional tokens (up to 6 decimal places)
  totalInvested    Decimal  @db.Decimal(18, 2)  // Total amount invested in Naira
  accumulatedYield Decimal  @db.Decimal(18, 2)  // Accumulated yield in Naira
  lastYieldUpdate  DateTime @default(now())     // Last time yield was calculated
}
```

Updated `TokenPurchase` model:
```prisma
model TokenPurchase {
  tokensReceived  Decimal  @db.Decimal(18, 6)  // Support fractional tokens
}
```

### 2. Buy API Updates (`src/app/api/token/buy/route.ts`)

**Before:**
```typescript
const tokensReceived = Math.floor(data.nairaAmount / TOKEN_PRICE_NAIRA)
```

**After:**
```typescript
const tokensReceived = data.nairaAmount / TOKEN_PRICE_NAIRA  // Exact division for fractional tokens
```

**Example:**
- User invests: ₦2,000
- Token price: ₦1,444
- Tokens received: 2,000 ÷ 1,444 = **1.385166 tokens** (fractional)

Now tracks:
- `totalInvested`: Cumulative amount invested
- `accumulatedYield`: Yield earned over time
- `lastYieldUpdate`: Timestamp of last yield calculation

### 3. Sell API Updates (`src/app/api/token/sell/route.ts`)

- Supports selling fractional token amounts
- Proportionally reduces `totalInvested` when selling
- Validation updated to handle decimal quantities

### 4. Yield Calculator (`src/lib/yield-calculator.ts`)

Implemented three key functions:

```typescript
// Calculate daily yield
calculateDailyYield(investmentAmount, annualYieldPercent)
// Formula: (Investment × APY) ÷ 365

// Calculate accumulated yield since last update
calculateAccumulatedYield(investmentAmount, annualYieldPercent, lastYieldUpdate)
// Formula: Daily_Yield × days_elapsed

// Calculate total yield (unrealized gain/loss + accumulated yield)
calculateTotalYield(currentValue, totalInvested, accumulatedYield)
// Formula: (Current_Value - Total_Invested) + Accumulated_Yield
```

**Example:**
- Portfolio Value: ₦2,000
- APY: 54%
- Annual yield: ₦2,000 × 0.54 = ₦1,080/year
- Daily yield: ₦1,080 ÷ 365 = **₦2.96/day**

### 5. Portfolio Display (`src/components/portfolio/PortfolioTable.tsx`)

**Holdings Column Now Shows:**
- **Primary:** Total amount invested (e.g., ₦2,000)
- **Secondary:** Fractional units held (e.g., 1.385166 units)

**Before:**
```
Holdings: ₦1,444.00
          1 units
```

**After:**
```
Holdings: ₦2,000
          1.385166 units
```

**Total Yield Calculation:**
- Unrealized gain/loss: Current market value - Total invested
- Plus: Accumulated daily yield
- Shows both amount and percentage

### 6. Portfolio API (`src/app/api/portfolio/holdings/route.ts`)

Updated to return new fields:
- `totalInvested`
- `accumulatedYield`
- `lastYieldUpdate`

### 7. Formatting Utilities (`src/lib/utils/formatNumber.ts`)

Added helper functions:
- `formatCurrency()`: Format with no decimals
- `formatLargeNumber()`: Abbreviate large numbers (₦20m, ₦200k)
- `formatUnits()`: Format fractional units (up to 6 decimals, remove trailing zeros)

## Migration

Created and ran migration script (`scripts/migrate-fractional-tokens.ts`):
- Migrated 9 existing holdings
- Calculated `totalInvested` from purchase history
- Initialized `accumulatedYield` to 0
- Set `lastYieldUpdate` to current timestamp

## Verification

All holdings now properly track:
- ✅ Fractional token quantities (e.g., 1.385166 units)
- ✅ Total amount invested (actual money spent)
- ✅ Accumulated yield (starts at ₦0, will accrue daily)
- ✅ Last yield update timestamp

## Example User Flow

1. **User buys tokens:**
   - Invests ₦2,300
   - Token price: ₦1,500
   - Receives: 1.533333 tokens

2. **Portfolio displays:**
   - Holdings: ₦2,300 (amount invested)
   - Units: 1.533333 units
   - Avg. Cost: ₦1,500 per unit

3. **Daily yield accrues:**
   - APY: 18%
   - Daily: (₦2,300 × 0.18) ÷ 365 = ₦1.14/day
   - After 30 days: ₦34.20 accumulated yield

4. **Total yield shows:**
   - Market gain/loss: (Current price × units) - ₦2,300
   - Plus: Accumulated yield
   - Example: If price rises to ₦1,600:
     - Market value: 1.533333 × ₦1,600 = ₦2,453.33
     - Unrealized gain: ₦153.33
     - Accumulated yield (30 days): ₦34.20
     - **Total Yield: ₦187.53**

## Files Modified

- `prisma/schema.prisma`
- `src/app/api/token/buy/route.ts`
- `src/app/api/token/sell/route.ts`
- `src/lib/yield-calculator.ts`
- `src/components/portfolio/PortfolioTable.tsx`
- `src/app/api/portfolio/holdings/route.ts`
- `src/lib/utils/formatNumber.ts`

## Files Created

- `scripts/migrate-fractional-tokens.ts`
- `scripts/verify-fractional-tokens.ts`
- `FRACTIONAL_TOKENS_IMPLEMENTATION.md`

## Next Steps

To enable automatic daily yield accrual, consider:
1. Creating a cron job or scheduled task
2. API endpoint to calculate and update yields for all holdings
3. Run daily to credit accumulated yield to user positions

## Testing

Test the implementation by:
1. Making a new token purchase with a non-round amount
2. Checking portfolio to see fractional units
3. Verifying Holdings column shows total invested amount
4. Confirming Total Yield includes both market gain and accumulated yield
