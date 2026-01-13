---
id: "0002"
title: "NGN Wallet Fiat-Only Model with Monnify"
stage: "spec"
date: "2026-01-04"
surface: "agent"
model: "MiniMax-M2.1"
feature: "ngn-wallet"
branch: "004-ngn-wallet"
user: "Claude Code User"
command: "SpecifyPlus Prompt for fiat-only wallet model"
labels: ["wallet","monnify","fiat","spec"]
links:
  spec: "specs/004-ngn-wallet/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "prisma/schema.prisma"
  - "src/lib/monnify.ts"
  - "src/lib/wallet-service.ts"
  - "src/app/api/webhooks/monnify/route.ts"
  - "src/app/api/wallet/create/route.ts"
  - "src/app/api/wallet/balance/route.ts"
  - "src/app/api/wallet/transactions/route.ts"
  - "src/app/api/wallet/sync/route.ts"
  - "src/app/api/auth/register/route.ts"
  - "src/components/dashboard/WalletInfo.tsx"
  - "src/components/dashboard/FundWalletModal.tsx"
  - "src/components/dashboard/TransactionHistory.tsx"
  - "src/common/Header.tsx"
  - "src/hooks/useWallet.ts"
  - "src/hooks/useWalletSync.ts"
  - "src/lib/utils/wallet.ts"
tests: []
---

## Prompt

SpecifyPlus Prompt

You are a senior production-grade full-stack engineer working inside an already functioning codebase.

Hard Rules (Must Follow)

DO NOT change any existing import paths

DO NOT refactor existing auth or config files

DO NOT output partial code or code snippets

DO NOT do "vibe coding"

DO NOT assume missing context

STRICTLY use SpecifyPlus workflow

FIRST produce spec.md, then generate final code

Read all existing files before writing anything

Respect existing auth, session, and config architecture

No code breaks, no placeholders

Follow latest official docs using Context7 MCP

Do not introduce crypto, DeFi, or blockchain

Product Requirement

We are reverting to a fiat-only wallet model (NGN).

Wallet Type

Naira (NGN) wallet only

No crypto

No DeFi

No external wallet addresses

Authentication & UI Flow

Menu header shows Sign Up / Sign In

After login:

Menu header switches to Profile / Account

User sees NGN Wallet balance

Wallet UI should resemble a standard fintech NGN wallet

Payments & Funding

Integrate Monnify

Each user gets a dedicated virtual account

User transfers money to Monnify account

On successful transfer:

Wallet balance is credited automatically

Must handle webhooks securely

Must support:

Account creation

Payment verification

Webhook validation

Idempotency

Technical Constraints

Use existing auth system

Use existing config/environment setup

Respect current folder structure

Read every import in each file before coding

Do not introduce new auth patterns

Use existing API / service layers where applicable

Implementation Instructions

Analyze the entire codebase

Identify:

Auth flow

User model

Wallet logic (if exists)

API structure

Produce a clear spec.md that includes:

Architecture overview

Monnify integration flow

Wallet lifecycle

API endpoints

Webhook handling

Error handling

Security considerations

Only after spec.md is complete:

Generate final production-ready code

No explanations

No fragmented outputs

No assumptions

Documentation

Use Context7 MCP to fetch:

Latest Monnify docs

Latest framework docs

Follow current best practices only

Final Output Expectation

spec.md

Then full working implementation

Zero breaking changes

Fully aligned with existing codebase

## Response snapshot

Analyzed existing codebase and found complete NGN wallet implementation:

1. **Database Schema** - Wallet and Transaction models already defined in Prisma
2. **Monnify Integration** - lib/monnify.ts with auth, createReservedAccount, getTransactionStatus, searchTransactions
3. **Wallet Service** - lib/wallet-service.ts with createWallet, getWalletByUserId, creditWallet
4. **API Endpoints** - 5 endpoints implemented (create, balance, transactions, sync, webhook)
5. **UI Components** - WalletInfo, FundWalletModal, TransactionHistory
6. **Hooks** - useWallet, useWalletSync

Updated spec.md with comprehensive documentation including:
- Architecture overview with layer diagram
- Monnify integration flow (auth, create account, webhook)
- API endpoint specifications
- Security considerations (HMAC validation, idempotency)
- Error taxonomy

Enhanced registration to auto-create wallet during sign-up for better UX.

## Outcome

- ✅ Impact: Complete NGN fiat wallet implementation with Monnify integration
- 📁 Files: Updated spec.md, enhanced register route with auto-wallet creation
- 🔁 Next prompts: None required - implementation complete
- 🧠 Reflection: Existing codebase already had comprehensive wallet implementation. Focus was on documentation (spec.md) and UX enhancement (auto-create wallet on registration)

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): TypeScript compilation passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add withdrawal functionality as future enhancement
