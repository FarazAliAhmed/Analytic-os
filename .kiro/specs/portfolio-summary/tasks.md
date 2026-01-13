# Implementation Plan: Portfolio Summary

## Overview

Minimal implementation to replace hardcoded portfolio values with real user data. Creates one API endpoint and updates one component.

## Tasks

- [x] 1. Create Portfolio Summary API endpoint
  - [x] 1.1 Create `/api/portfolio/summary/route.ts` with GET handler
    - Query TokenPurchase for total invested (sum of nairaAmountSpent)
    - Query TokenPurchase with Token join for yield calculation
    - Count transactions in last 30 days
    - Return PortfolioSummaryResponse interface
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 3.1, 4.1, 4.2, 4.3_

  - [ ]* 1.2 Write property test for yield calculation
    - **Property 2: Weekly Yield Calculation Correctness**
    - **Validates: Requirements 2.1, 2.2**

- [x] 2. Update PortfolioSummary component
  - [x] 2.1 Convert PortfolioSummary to client component with data fetching
    - Add useState for portfolio data and loading state
    - Fetch from /api/portfolio/summary on mount
    - Display totalInvested as "Total Portfolio Value" in ₦ format
    - Display totalYield as "Total Yield" in ₦ format
    - Display transactionCount as "Recent Activity"
    - Handle loading and error states
    - _Requirements: 1.1, 1.2, 1.3, 2.5, 3.1, 3.2, 3.3_

- [x] 3. Checkpoint - Verify integration
  - Ensure API returns correct data for test user
  - Ensure component displays real values
  - Test with user who has purchases and user with no purchases
