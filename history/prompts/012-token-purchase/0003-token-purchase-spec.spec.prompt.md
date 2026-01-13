---
id: "0003"
title: "token-purchase-spec"
stage: "spec"
date: "2026-01-06"
surface: "agent"
model: "MiniMax-M2.1"
feature: "012-token-purchase"
branch: "012-token-purchase"
user: "apple"
command: "Create token purchase spec"
labels: ["token-purchase","specification","naira"]
links:
  spec: "null"
  plan: "specs/012-token-purchase/plan.md"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "specs/012-token-purchase/spec.md"
  - "specs/012-token-purchase/plan.md"
tests:
  - "null"
---

## Prompt

User wants token purchase feature:
1. Change price to N1,500
2. User enters amount (in naira) they want to spend
3. When user clicks buy, deduct from naira wallet
4. Example: N7,400 wallet → buy 1 token for N1,500 → N5,900 remaining
5. Remove USDT, use Naira throughout

Client clarification: "User enters the amount (in naira) of token he wants to buy and clicks on "buy" to successfully place the order. Token purchase value is deducted from wallet balance."

## Response snapshot

Created feature specification and implementation plan for Token Purchase:

**Key Changes from Original**:
- User enters Naira AMOUNT to spend (not token quantity)
- System calculates tokens: floor(nairaAmount / 1500)
- Example: Enter N7,400 → 4 tokens (floor(7400/1500) = 4)
- All USDT references removed, use Naira throughout

**User Stories**:
1. Purchase Tokens with Naira (P1) - Core purchase flow
2. View Token Holdings (P2) - Show user's tokens
3. View Purchase History (P3) - Transaction records

**Implementation Plan**:
- API: POST /api/token/buy
- Models: TokenHolding, TokenPurchase
- Component: BuyTokenModal
- Update token page with buy button

**Flow**:
1. User enters Naira amount
2. System shows: tokens to receive, amount to deduct
3. User clicks Buy
4. System validates balance, debits wallet, credits tokens
5. Show confirmation

## Outcome

- Created spec.md with 3 user stories and 11 functional requirements
- Created plan.md with API contract, data model, and component design
- Ready for /sp.tasks to generate implementation tasks
