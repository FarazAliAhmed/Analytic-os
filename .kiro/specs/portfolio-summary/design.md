# Design Document: Portfolio Summary

## Overview

This design implements a real-time portfolio summary feature that replaces hardcoded mock data with actual user investment data. The system calculates total invested amount, accumulated yield based on APY, and recent transaction activity.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Portfolio Page                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              PortfolioContainer                      │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         PortfolioSummary (Client)           │    │    │
│  │  │  - Fetches /api/portfolio/summary           │    │    │
│  │  │  - Displays 3 summary cards                 │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              GET /api/portfolio/summary                      │
│  - Authenticates user via session                           │
│  - Queries TokenPurchase for total invested                 │
│  - Queries TokenHolding + Token for yield calculation       │
│  - Returns { totalInvested, totalYield, transactions }      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ TokenPurchase│  │ TokenHolding │  │    Token     │       │
│  │ - userId     │  │ - userId     │  │ - symbol     │       │
│  │ - nairaSpent │  │ - tokenId    │  │ - annualYield│       │
│  │ - createdAt  │  │ - quantity   │  │ - price      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### API Response Interface

```typescript
interface PortfolioSummaryResponse {
  success: boolean
  data?: {
    totalInvested: number      // Sum of nairaAmountSpent in Naira
    totalYield: number         // Accumulated yield in Naira
    yieldPercentage: number    // Yield as percentage of investment
    transactionCount: number   // Transactions in last 30 days
    buyCount: number           // Buy transactions count
    lastUpdated: string        // ISO timestamp
  }
  error?: string
}
```

### Yield Calculation Logic

```typescript
function calculateYield(
  investmentAmount: number,  // in Naira
  annualYieldPercent: number, // e.g., 20 for 20%
  purchaseDate: Date
): number {
  const now = new Date()
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weeksSincePurchase = Math.floor(
    (now.getTime() - purchaseDate.getTime()) / msPerWeek
  )
  
  const weeklyYield = (investmentAmount * (annualYieldPercent / 100)) / 52
  return weeklyYield * weeksSincePurchase
}
```

## Data Models

### Existing Models Used

**TokenPurchase** (no changes needed):
- `nairaAmountSpent`: Amount invested in Naira
- `tokensReceived`: Number of tokens purchased
- `tokenId`: Token symbol (e.g., "INV")
- `createdAt`: Purchase timestamp for yield calculation

**Token** (no changes needed):
- `symbol`: Token identifier
- `annualYield`: APY percentage (0-100)

**TokenHolding** (no changes needed):
- `userId`: Owner of the holding
- `tokenId`: Token symbol
- `quantity`: Number of tokens held



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Total Investment Sum Correctness

*For any* user with a set of token purchases, the totalInvested value returned by the API SHALL equal the sum of all `nairaAmountSpent` values from their TokenPurchase records.

**Validates: Requirements 1.1**

### Property 2: Weekly Yield Calculation Correctness

*For any* investment with a known amount, APY percentage, and purchase date, the calculated yield SHALL equal `(investmentAmount × (APY / 100)) / 52 × weeksElapsed` where weeksElapsed is the floor of weeks since purchase.

**Validates: Requirements 2.1, 2.2, 4.4**

### Property 3: Transaction Count Within Date Range

*For any* set of user transactions, the transactionCount SHALL equal the count of transactions where `createdAt` is within the last 30 days from the current date.

**Validates: Requirements 3.1**

## Error Handling

| Error Condition | Response | Status Code |
|----------------|----------|-------------|
| Unauthenticated request | `{ success: false, error: "Unauthorized" }` | 401 |
| Database connection failure | `{ success: false, error: "Failed to fetch portfolio" }` | 500 |
| No purchases found | Return `totalInvested: 0, totalYield: 0` | 200 |

## Testing Strategy

### Unit Tests
- Test yield calculation function with known inputs
- Test date range filtering for transaction count
- Test edge cases: zero investments, missing APY

### Property-Based Tests
- Use fast-check library for TypeScript
- Minimum 100 iterations per property test
- Each property test references its design document property

**Property Test Configuration:**
- Library: fast-check
- Iterations: 100 minimum
- Tag format: **Feature: portfolio-summary, Property N: [property_text]**
