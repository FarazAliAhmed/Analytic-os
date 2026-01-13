# Requirements Document

## Introduction

This feature updates the Portfolio page to display real investment data instead of hardcoded mock values. The Total Portfolio Value will show the actual sum of all user investments in NGN, and the Total Yield will calculate interest earned based on each token's APY with weekly payout frequency.

## Glossary

- **Portfolio_Summary**: The component displaying three summary cards: Total Portfolio Value, Total Yield, and Recent Activity
- **Total_Portfolio_Value**: The sum of all naira amounts spent on token purchases by the user
- **Total_Yield**: The accumulated interest earned on investments, calculated as (Investment × APY%) / 52 per week since purchase
- **Token_Holding**: A record of how many tokens a user owns for a specific token type
- **Token_Purchase**: A record of a single token purchase transaction including amount spent and tokens received
- **APY**: Annual Percentage Yield - the yearly interest rate for a token investment
- **Weekly_Payout**: The yield amount calculated per week, derived from APY / 52

## Requirements

### Requirement 1: Display Total Portfolio Value in NGN

**User Story:** As an investor, I want to see my total portfolio value as the sum of all my investments in NGN, so that I know exactly how much money I have invested.

#### Acceptance Criteria

1. WHEN a user views the portfolio page, THE Portfolio_Summary SHALL display the total of all TokenPurchase.nairaAmountSpent for that user
2. WHEN a user has no investments, THE Portfolio_Summary SHALL display ₦0.00 as the total portfolio value
3. THE Portfolio_Summary SHALL display amounts in Nigerian Naira (₦) format with proper thousand separators
4. WHEN a new purchase is made, THE Portfolio_Summary SHALL reflect the updated total on next page load

### Requirement 2: Calculate and Display Total Yield in NGN

**User Story:** As an investor, I want to see my total yield earned in NGN based on each token's APY, so that I can track my investment returns.

#### Acceptance Criteria

1. WHEN calculating yield, THE System SHALL use the formula: Weekly_Yield = (Investment_Amount × APY%) / 52
2. WHEN a user views the portfolio, THE Portfolio_Summary SHALL display the accumulated yield since each investment's purchase date
3. THE Portfolio_Summary SHALL sum yields across all token holdings for the total yield display
4. WHEN a token has no APY defined, THE System SHALL default to 0% yield for that token
5. THE Portfolio_Summary SHALL display yield amounts in Nigerian Naira (₦) format

### Requirement 3: Display Recent Activity Count

**User Story:** As an investor, I want to see my recent transaction activity, so that I can track my investment actions.

#### Acceptance Criteria

1. WHEN a user views the portfolio, THE Portfolio_Summary SHALL display the count of transactions in the last 30 days
2. THE Portfolio_Summary SHALL show a breakdown of transaction types (buys only for now)
3. WHEN a user has no recent transactions, THE Portfolio_Summary SHALL display "0 Transactions"

### Requirement 4: Portfolio API Endpoint

**User Story:** As a frontend developer, I want a single API endpoint that returns all portfolio summary data, so that the UI can efficiently fetch and display the information.

#### Acceptance Criteria

1. THE System SHALL provide a GET endpoint at /api/portfolio/summary
2. WHEN called by an authenticated user, THE endpoint SHALL return totalInvested, totalYield, and transactionCount
3. WHEN called by an unauthenticated user, THE endpoint SHALL return a 401 Unauthorized response
4. THE endpoint SHALL calculate yield based on weeks elapsed since each purchase date
5. THE endpoint SHALL return amounts in Naira (not kobo)
