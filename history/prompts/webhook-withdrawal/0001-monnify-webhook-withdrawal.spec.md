---
id: "0001"
title: "Monnify Webhook & Withdrawal Implementation"
stage: "spec"
date: "2026-01-04"
surface: "agent"
model: "MiniMax-M2.1"
feature: "webhook-withdrawal"
branch: "008-monnify-webhook-withdrawal"
user: "Claude Code User"
command: "SpecifyPlus Prompt for webhook and withdrawal"
labels: ["monnify","webhook","withdrawal","bank-account","spec"]
links:
  spec: "specs/008-monnify-webhook-withdrawal/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "prisma/schema.prisma"
  - "src/lib/user-id.ts"
  - "src/lib/monnify.ts"
  - "src/lib/monnify-disbursement.ts"
  - "src/app/api/monnify/webhook/route.ts"
  - "src/app/api/bank-accounts/route.ts"
  - "src/app/api/wallet/withdraw/route.ts"
  - "src/app/api/auth/register/route.ts"
  - "src/components/dashboard/WithdrawModal.tsx"
tests: []
---

## Prompt

Implement Monnify webhook handler and withdrawal functionality using SpecifyPlus:
1. Create webhook endpoint to receive payment notifications from Monnify
2. Implement withdrawal API to transfer money to bank accounts
3. Create bank account management (add, list, verify account name)
4. Create unique alphanumeric user ID generation (ANALYTI-XXXXXX format)
5. Create withdrawal UI modal with bank selection and account number input

Use Context7 for latest Monnify API documentation.

## Response snapshot

**Spec.md Created:** `specs/008-monnify-webhook-withdrawal/spec.md`
- User stories for webhook and withdrawal
- Signature verification using SHA-512 HMAC
- Database schema with userId and BankAccount models
- API endpoints documentation

**Implementation:**

1. **prisma/schema.prisma** - Database updates:
   - Added `userId` field to User model (ANALYTI-XXXXXX format)
   - Added BankAccount model with user relation

2. **src/lib/user-id.ts** - User ID generation utility:
   - Generates unique ID in format `ANALYTI-XXXXXXXX`
   - 8 random alphanumeric characters

3. **src/lib/monnify.ts** - Config export:
   - Exported `MONNIFY_CONFIG` and `MonnifyConfig` interface

4. **src/lib/monnify-disbursement.ts** - Disbursement functions:
   - `getAccessToken()` - Get/refresh Monnify OAuth token
   - `verifyBankAccount()` - Validate bank account and get account name
   - `initiateDisbursement()` - Send money to bank account
   - `getDisbursementStatus()` - Check transfer status

5. **src/app/api/monnify/webhook/route.ts** - Webhook handler:
   - Verifies `monnify-signature` header with HMAC-SHA512
   - Processes TRANSACTION_SUCCESS (auto-credit wallet)
   - Handles DISBURSEMENT_FAILED (auto-refund wallet)
   - Returns 200 OK immediately

6. **src/app/api/bank-accounts/route.ts** - Bank account management:
   - GET - List user's bank accounts
   - POST - Add new bank with account verification
   - Included 50+ Nigerian bank codes

7. **src/app/api/wallet/withdraw/route.ts** - Withdrawal API:
   - Validates balance before withdrawal
   - Initiates disbursement via Monnify
   - Creates pending transaction record

8. **src/components/dashboard/WithdrawModal.tsx** - UI modal:
   - Select from saved bank accounts or add new
   - Enter amount with quick select buttons (25%, 50%, 75%, MAX)
   - Auto-verify account number and display account name
   - Nigerian banks dropdown

9. **src/app/api/auth/register/route.ts** - Updated registration:
   - Generates userId automatically on signup
   - Returns userId in response

**Monnify Webhook Verification:**
- Uses HMAC-SHA512 with MONNIFY_WEBHOOK_SECRET
- Computes hash from: `hmac(clientSecret + requestBody)`
- Compares with `monnify-signature` header

**TypeScript:**
- All compilation errors resolved
- Prisma client regenerated with new schema

## Outcome

- Impact: Users can now receive payments via webhook and withdraw to bank
- 📁 Files: 10 files created/modified
- 🔁 Next prompts: None required
- 🧠 Reflection: Monnify's TRANSFER API requires regulatory approval - clients need to contact sales@monnify.com for access to disbursement features.

## Evaluation notes (flywheel)

- Failure modes observed: None significant
- Graders run and results (PASS/FAIL): TypeScript compilation passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add bank account deletion endpoint
