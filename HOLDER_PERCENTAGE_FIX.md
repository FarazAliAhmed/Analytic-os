# Holder Percentage Calculation Fix

## Issue
The holder percentage was incorrectly calculated based on token quantity share instead of investment amount (volume) share.

## Previous Implementation
```typescript
// Calculated based on token quantity
const percent = totalSupply > 0 ? (quantity / totalSupply) * 100 : 0
```

**Problem:** If User A bought 100 tokens at ₦1,000 each (₦100,000 total) and User B bought 50 tokens at ₦2,000 each (₦100,000 total), User A would show 66.67% and User B would show 33.33%, even though they invested the same amount.

## New Implementation
```typescript
// Calculate based on investment amount share
const totalInvested = Number(holding._sum?.totalInvested || 0)
const percent = totalVolumeInvested > 0 ? (totalInvested / totalVolumeInvested) * 100 : 0
```

**Solution:** Now both users would correctly show 50% each since they both invested ₦100,000 out of ₦200,000 total volume.

## Changes Made

### File: `src/app/api/token/holders/route.ts`

1. **Added `totalInvested` to groupBy aggregation:**
   ```typescript
   _sum: {
     quantity: true,
     totalInvested: true  // Added this field
   }
   ```

2. **Changed ordering to investment amount:**
   ```typescript
   orderBy: {
     _sum: {
       totalInvested: 'desc'  // Changed from quantity to totalInvested
     }
   }
   ```

3. **Calculate total volume invested:**
   ```typescript
   const totalVolumeInvested = holdings.reduce(
     (sum, h) => sum + Number(h._sum?.totalInvested || 0), 
     0
   )
   ```

4. **Updated percentage calculation:**
   ```typescript
   const totalInvested = Number(holding._sum?.totalInvested || 0)
   const percent = totalVolumeInvested > 0 
     ? (totalInvested / totalVolumeInvested) * 100 
     : 0
   ```

5. **Updated response to return `totalVolumeInvested`:**
   ```typescript
   return NextResponse.json({
     success: true,
     holders: holdersWithDetails,
     totalHolders: holdersWithDetails.length,
     totalVolumeInvested  // Changed from totalSupply
   })
   ```

## Example Calculation

### Scenario:
- Total volume invested in token: ₦100,000
- User invested: ₦10,000

### Calculation:
```
Percentage = (10,000 / 100,000) × 100 = 10%
```

The user's share is correctly shown as 10% of the total investment volume.

## Benefits
- **Fair representation:** Percentage now reflects actual investment share
- **Accurate rankings:** Holders ranked by investment amount, not token quantity
- **Consistent with volume metrics:** Aligns with how volume is calculated elsewhere in the app

## Status
✅ **COMPLETED** - All changes applied and tested
