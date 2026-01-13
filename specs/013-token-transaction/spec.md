# Feature Specification: Token Transaction

**Feature Branch**: `013-token-transaction`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "Show the date and order info (buy or sell type, NGN, Amount, Price and user ID) of transactions bought or sold for each created or listed token."

## User Scenarios & Testing

### User Story 1 - View Token Purchase History (Priority: P1)

As a user, I want to view my token purchase history so that I can track my investments.

**Independent Test**: Can be tested by checking transaction list shows purchases.

**Acceptance Scenarios**:

1. **Given** a user has purchased tokens, **When** they view transactions, **Then** each purchase should show: date, type (buy), NGN, amount, price, user ID.

2. **Given** a user has made multiple purchases, **When** viewing history, **Then** transactions should be listed chronologically (newest first).

3. **Given** a user has no purchases, **When** viewing transactions, **Then** show empty state message.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST display transaction history table for tokens.

- **FR-002**: System MUST show for each transaction:
  - Date
  - Type (buy/sell)
  - Currency (NGN)
  - Amount (tokens purchased)
  - Price per token
  - Total amount (NGN)
  - User ID

- **FR-003**: System MUST display transactions for the logged-in user only.

- **FR-004**: System MUST show newest transactions first (descending date).

### Key Entities

- **TokenPurchase**: id, userId, tokenId, nairaAmountSpent, tokensReceived, pricePerToken, createdAt

### Dependencies

- Existing TokenPurchase model in database.

- Existing transaction tabs UI.

---

*To proceed to planning, run `/sp.plan`*
