# Feature Specification: Token Purchase

**Feature Branch**: `012-token-purchase`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "User enters amount (in naira) of token he wants to buy and clicks buy. Token purchase value is deducted from wallet balance. Example: N7,400 wallet → buy 1 token for N1,500 → N5,900 remaining. Remove USDT, use Naira."

## User Scenarios & Testing

### User Story 1 - Purchase Tokens with Naira (Priority: P1)

As a user, I want to enter the Naira amount I want to spend and buy tokens at N1,500 each from my Naira wallet so that I can invest in startups.

**Why this priority**: Core investment functionality - without purchase, users cannot invest.

**Example Flow**:
- Wallet balance: N7,400
- User enters: N7,400 (amount to spend)
- System calculates: 4 tokens (floor(7400/1500) = 4)
- Amount deducted: N7,400
- Tokens credited: 4
- New wallet: N0 (or remaining if fractional)

**Independent Test**: Can be tested by opening token page, entering naira amount, clicking buy, and verifying wallet balance deduction.

**Acceptance Scenarios**:

1. **Given** a user has N7,400 in wallet, **When** they enter N1,500 and click Buy, **Then** they receive 1 token and wallet becomes N5,900.

2. **Given** a user enters N7,400 to spend, **When** price is N1,500 per token, **Then** system calculates tokens as floor(7400/1500) = 4 tokens.

3. **Given** a user clicks "Buy", **When** they have sufficient balance, **Then** the entered amount is deducted from wallet and tokens credited.

4. **Given** a user clicks "Buy", **When** they have insufficient balance, **Then** an error message "Insufficient balance" is shown.

5. **Given** a successful purchase, **When** completed, **Then** the user sees confirmation with: tokens received, amount deducted, new wallet balance.

---

### User Story 2 - View Token Holdings (Priority: P2)

As a user, I want to view my token holdings so that I can track my investments.

**Why this priority**: Users need to see what they own after purchasing.

**Independent Test**: Can be tested by checking token balance displayed on token page.

**Acceptance Scenarios**:

1. **Given** a user has purchased 5 tokens, **When** they view the token page, **Then** their token balance shows "5 INV".

2. **Given** a user has multiple token types, **When** viewing each token, **Then** only that specific token balance should be shown.

---

### User Story 3 - View Purchase History (Priority: P3)

As a user, I want to see my purchase history so that I can track my investment activity.

**Why this priority**: Transaction history is important for accounting and records.

**Independent Test**: Can be tested by checking purchase transactions in history.

**Acceptance Scenarios**:

1. **Given** a user has made purchases, **When** they check transaction history, **Then** all token purchases should be listed with: date, tokens received, amount spent.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST display token price as N1,500 per token.

- **FR-002**: System MUST accept Naira amount input from user (amount to spend).

- **FR-003**: System MUST calculate tokens received as: floor(nairaAmount / 1500).

- **FR-004**: System MUST display to user before purchase: tokens to receive, amount to deduct.

- **FR-005**: System MUST debit user's Naira wallet (Monnify balance) by the entered amount.

- **FR-006**: System MUST credit user's token balance when purchase is successful.

- **FR-007**: System MUST validate sufficient wallet balance before processing purchase.

- **FR-008**: System MUST display error message "Insufficient balance" when wallet has less than entered amount.

- **FR-009**: System MUST show purchase confirmation with transaction details after success.

- **FR-010**: System MUST display user's current token holdings on the token page.

- **FR-011**: System MUST remove all USDT references and use Naira throughout.

### Key Entities

- **TokenHolding**: userId, tokenId, quantity, averagePrice, createdAt, updatedAt

- **TokenPurchase**: id, userId, tokenId, nairaAmountSpent, tokensReceived, pricePerToken, totalAmountKobo, status, reference, createdAt

### Success Criteria

- **SC-001**: 95% of purchase attempts complete within 5 seconds.

- **SC-002**: Wallet balance updates immediately after purchase.

- **SC-003**: No double-spending possible (concurrent purchase protection).

- **SC-004**: Users can view token holdings within 1 second of page load.

## Assumptions

- Using existing Monnify Naira wallet for balance.

- Single token type initially (expandable later).

- Price is fixed at N1,500 per token (configurable).

- Users can spend any Naira amount (not limited to multiples of N1,500).

- Tokens are whole numbers only (floor calculation).

- Amount entered is in Naira (not kobo).

## Dependencies

- Existing Naira wallet (Monnify) implementation.

- Existing token page UI.

- Existing wallet balance API.

---

*To proceed to planning, run `/sp.plan`*
