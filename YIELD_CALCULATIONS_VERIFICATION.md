# Yield Calculations Verification

## 1. Portfolio Total Yield (User-Specific)
**Location:** `/api/portfolio/summary`

### Formula:
```
Total Yield = Unrealized Gain/Loss + Accumulated Yield

Where:
- Unrealized Gain/Loss = Current Portfolio Value - Total Invested
- Accumulated Yield = Daily Yield × Days Elapsed
- Daily Yield = (Current Portfolio Value × Annual Yield%) / 365
```

### Implementation:
```typescript
// For each holding:
const currentValue = quantity × (token.price / 100)
const newAccumulatedYield = calculateAccumulatedYield(currentValue, annualYield, lastYieldUpdate)
const holdingAccumulatedYield = accumulatedYield + newAccumulatedYield
const unrealizedGainLoss = currentValue - totalInvested
const totalYield = unrealizedGainLoss + holdingAccumulatedYield
```

### Example:
- User bought 10 tokens at ₦1,000 each = ₦10,000 invested
- Current price: ₦1,200
- Current value: 10 × ₦1,200 = ₦12,000
- Unrealized gain: ₦12,000 - ₦10,000 = ₦2,000
- Annual yield: 18%
- Days held: 30 days
- Daily yield: (₦12,000 × 0.18) / 365 = ₦5.92/day
- Accumulated yield: ₦5.92 × 30 = ₦177.60
- **Total Yield: ₦2,000 + ₦177.60 = ₦2,177.60**

### Status: ✅ **CORRECT**
- Uses current portfolio value (not original investment)
- Includes both price appreciation and APY yield
- Calculates yield based on actual days elapsed

---

## 2. Dashboard Yield Payout (Token-Wide, Period-Based)
**Location:** `/api/tokens/yield-payouts?period=30d`

### Formula:
```
Yield Payout = Total Portfolio Value × Annual Yield% × Period Multiplier

Where:
- Total Portfolio Value = Sum of all investors' current holdings value
- Period Multiplier:
  - 1d: 1/365
  - 7d: 7/365
  - 30d: 30/365
  - 1yr: 1
```

### Implementation:
```typescript
// For each token:
const totalPortfolioValue = sum of (quantity × price) for all holders
const periodYield = totalPortfolioValue × (annualYield / 100) × periodMultiplier
```

### Example (30d period):
- Token: NEW
- Total holdings across all users: 100 tokens
- Current price: ₦1,500
- Total portfolio value: 100 × ₦1,500 = ₦150,000
- Annual yield: 11.8%
- Period multiplier (30d): 30/365 = 0.0822
- **Yield Payout: ₦150,000 × 0.118 × 0.0822 = ₦1,455.30**

### Status: ✅ **CORRECT**
- Calculates based on total portfolio value (all investors)
- Adjusts for selected time period
- Shows potential yield for the period

---

## 3. Volume (Period-Based)
**Location:** `/api/tokens/period-volume?period=1d`

### Formula:
```
Period Volume = Sum of (Buy Transactions + Sell Transactions) within period
```

### Implementation:
```typescript
// Get transactions within date range
const startDate = now - period
const buyVolume = sum of nairaAmountSpent where createdAt >= startDate
const sellVolume = sum of (amount / 100) where createdAt >= startDate
const totalVolume = buyVolume + sellVolume
```

### Example (1d period):
- Today's transactions:
  - Buy: ₦1,500
  - Buy: ₦1,500
  - Sell: ₦0
- **Period Volume (1d): ₦3,000**

### Status: ✅ **CORRECT**
- Filters transactions by date range
- Sums both buy and sell volumes
- Updates dynamically based on selected period

---

## Key Differences

| Metric | Scope | Time-Based | Includes Price Changes |
|--------|-------|------------|----------------------|
| **Portfolio Total Yield** | User-specific | Cumulative (all time) | Yes (unrealized gains) |
| **Dashboard Yield Payout** | Token-wide (all users) | Period-specific | No (only APY yield) |
| **Volume** | Token-wide | Period-specific | N/A |

---

## Verification Checklist

- [x] Portfolio yield includes unrealized gains/losses
- [x] Portfolio yield uses current portfolio value for APY calculation
- [x] Dashboard yield payout aggregates all investors
- [x] Dashboard yield payout adjusts for time period
- [x] Volume filters by transaction date
- [x] Volume includes both buy and sell transactions
- [x] All calculations use Naira (not kobo) for display

---

## Potential Issues to Monitor

1. **Yield Accumulation**: Currently calculated on-the-fly. Consider implementing:
   - Scheduled job to update `accumulatedYield` daily
   - Store yield payout history for accurate period calculations

2. **Performance**: Multiple database queries per token. Consider:
   - Caching yield payout results
   - Aggregating at database level

3. **Accuracy**: Yield payout is estimated based on current holdings. Actual payouts may differ if:
   - Users buy/sell during the period
   - Token price changes significantly
   - Yield distribution is not continuous

