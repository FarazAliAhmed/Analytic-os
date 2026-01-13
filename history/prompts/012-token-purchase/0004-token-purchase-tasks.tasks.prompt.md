---
id: "0004"
title: "token-purchase-tasks"
stage: "tasks"
date: "2026-01-06"
surface: "agent"
model: "MiniMax-M2.1"
feature: "012-token-purchase"
branch: "012-token-purchase"
user: "apple"
command: "/sp.tasks"
labels: ["token-purchase","tasks","implementation"]
links:
  spec: "specs/012-token-purchase/spec.md"
  plan: "specs/012-token-purchase/plan.md"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "specs/012-token-purchase/tasks.md"
  - "specs/012-token-purchase/spec.md"
  - "specs/012-token-purchase/plan.md"
tests:
  - "null"
---

## Prompt

/sp.tasks

## Response snapshot

Generated detailed task list for Token Purchase feature (30 tasks across 5 phases):

**Phase 1: Data Model (5 tasks)**
- Add TokenHolding model
- Add TokenPurchase model
- Add PurchaseStatus enum
- Update User relation
- Run prisma db push

**Phase 2: User Story 1 (13 tasks) - P1 MVP**
- Create /api/token/buy/route.ts
- Validate nairaAmount ≥ 1500
- Implement wallet balance check
- Database transaction for atomic debit/credit
- Create BuyTokenModal component
- Input, calculation, loading, error states

**Phase 3: User Story 2 (5 tasks) - View Holdings**
- Create /api/token/balance/route.ts
- Update token page to show holdings
- Add Buy button

**Phase 4: User Story 3 (3 tasks) - Purchase History**
- Create /api/token/history/route.ts
- Return purchase list

**Phase 5: Polish (4 tasks)**
- Remove USDT references
- TypeScript verification

**Purchase Flow Example**:
- User enters N7,400
- System calculates: 4 tokens (floor(7400/1500))
- Deduct N7,400 from wallet
- Credit 4 tokens to user

## Outcome

- Generated tasks.md with 30 actionable tasks
- MVP scope: Phase 1 + Phase 2 (18 tasks) for core purchase
- Parallel opportunities identified (API and UI can run in parallel)
- Ready to execute with /sp.implement or start with T001

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
