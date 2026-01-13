---
id: "004"
title: "NGN Wallet with Monnify Integration"
feature: "ngn-wallet"
stage: "plan"
date: "2026-01-04"
branch: "004-ngn-wallet"
---

## 1. Scope and Dependencies

### In Scope
- NGN wallet creation for each user (virtual bank account via Monnify)
- Display wallet balance in dashboard header
- Fund wallet modal with copyable bank details
- Hybrid payment detection (webhook + polling fallback)
- Transaction history display
- Wallet funding API endpoints
- Database schema for wallet and transactions

### Out of Scope
- Crypto wallet functionality (removed)
- Multiple currency support (NGN only)
- Advanced KYC verification
- International transfers
- Peer-to-peer transfers between users
- Investment products (future feature)

### External Dependencies
| Dependency | Purpose | Ownership |
|------------|---------|-----------|
| Monnify API | NGN bank transfers, virtual accounts | External (Nigeria) |
| Prisma ORM | Database operations | Internal |
| NextAuth.js | User authentication | Internal |

---

## 2. Key Decisions and Rationale

### Decision 1: Hybrid Payment Detection (Webhook + Polling)

**Options Considered:**
- Webhook only (real-time, fails on localhost)
- Polling only (simple, delayed)
- **Hybrid (Recommended)** - both approaches

**Trade-offs:**
| Aspect | Polling | Webhook | Hybrid |
|--------|---------|---------|--------|
| Latency | 30-60s | 1-3s | 1-3s |
| Complexity | Low | Medium | Medium+ |
| Dev experience | Works locally | Needs tunneling | Best of both |
| Reliability | 95% | 99% | 99.9% |

**Rationale:** Production requires instant credit + reliability. Polling serves as fallback for missed webhooks and enables localhost development.

### Decision 2: Balance Storage in Kobo

**Options Considered:**
- Store as NGN (float)
- **Store as kobo (integer)** ✓

**Rationale:** Avoid floating-point precision issues. ₦12,500.00 stored as `1250000` kobo. All calculations in kobo, format only for display.

### Decision 3: Monnify Reserved Account Type

**Options:**
- Dedicated account (one account per user)
- **Reserved account (virtual sub-account)** ✓
- Shared account (all users to one account)

**Rationale:** Reserved account provides unique account number per user, better tracking, and easier reconciliation.

---

## 3. Interfaces and API Contracts

### A. Create Reserved Account

```typescript
// POST /api/wallet/create
Input: { userId: string }
Output: {
  success: true,
  data: {
    accountNumber: "8098765432",
    bankName: "Guaranty Trust Bank",
    accountName: "ANALYTI INVESTMENT",
    accountReference: "WALLET_USER_ID"
  }
}
Error: 400, 401, 500
```

### B. Get Wallet Balance

```typescript
// GET /api/wallet/balance
Headers: { Authorization: "Bearer <token>" }
Output: {
  success: true,
  data: {
    balance: 1250000,        // in kobo
    formattedBalance: "₦12,500.00",
    walletId: "uuid"
  }
}
```

### C. Get Transaction History

```typescript
// GET /api/wallet/transactions
Query: { page?: number, limit?: number }
Output: {
  success: true,
  data: {
    transactions: [
      {
        id: "uuid",
        type: "credit",
        amount: 500000,
        formattedAmount: "₦5,000.00",
        description: "Wallet funding",
        reference: "MNFY_REF_123",
        status: "completed",
        createdAt: "2026-01-04T10:00:00Z"
      }
    ],
    pagination: { page: 1, limit: 20, total: 45 }
  }
}
```

### D. Monnify Webhook

```typescript
// POST /api/webhooks/monnify
Input: {
  eventType: "SUCCESSFUL_TRANSACTION",
  transactionReference: "MNFY_REF_123",
  amount: 500000,
  paidBy: "8098765432"
}
Output: { success: true }
Error: Signature validation failed (401)
```

### E. Polling Endpoint

```typescript
// GET /api/wallet/sync
Headers: { Authorization: "Bearer <token>" }
Output: {
  success: true,
  data: {
    newTransactions: 2,
    totalCredited: 1000000
  }
}
```

---

## 4. Non-Functional Requirements (NFRs)

### Performance
| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load (dashboard) | < 2s | Lighthouse |
| Balance fetch | < 200ms | API response time |
| Webhook processing | < 500ms | End-to-end |
| Polling interval | 60s | Cron job |

### Reliability
| Metric | Target | Strategy |
|--------|--------|----------|
| Uptime | 99.9% | Auto-retry failed credits |
| Credit accuracy | 100% | Idempotency keys |
| Data consistency | 100% | Database transactions |

### Security
- Webhook signature validation
- Rate limiting on API endpoints
- JWT authentication on all wallet routes
- No sensitive data in logs

### Cost Estimation
| Cost | Amount | Notes |
|------|--------|-------|
| Monnify transaction fee | 0.5% per deposit | Passed to user or absorbed |
| Database | Existing | Using current setup |
| API calls | Within free tier | Polling: ~1440 calls/day |

---

## 5. Data Management

### Database Schema (Prisma)

```prisma
model Wallet {
  id             String   @id @default(uuid())
  userId         String   @unique
  accountNumber  String   @unique
  bankName       String
  accountName    String
  accountRef     String   @unique
  balance        Int      @default(0)  // in kobo
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user           User     @relation(fields: [userId], references: [id])
  transactions   Transaction[]
}

model Transaction {
  id              String   @id @default(uuid())
  walletId        String
  type            CreditDebit
  amount          Int      // in kobo
  description     String
  reference       String   @unique  // Monnify reference
  monnifyRef      String?
  status          TxStatus @default(pending)
  createdAt       DateTime @default(now())

  wallet          Wallet   @relation(fields: [walletId], references: [id])
}

enum CreditDebit {
  credit
  debit
}

enum TxStatus {
  pending
  completed
  failed
}
```

### Migration Strategy
- Create new tables (Wallet, Transaction)
- Create wallet for existing users on first login
- No data migration needed (new feature)

### Rollback Plan
- Prisma migrate down removes tables
- Feature flag gates functionality

---

## 6. Operational Readiness

### Observability

**Logs:**
- Wallet creation events
- Credit/debit operations
- Webhook received/processed
- Polling sync results
- Errors and exceptions

**Metrics:**
- `wallet.balance` current value
- `wallet.transactions.count` per user
- `wallet.funding.total` daily volume
- `webhook.processing.time_ms`
- `polling.new_transactions` per run

### Alerting
| Alert | Threshold | Owner |
|-------|-----------|-------|
| Webhook failing | > 5% error rate | Backend |
| Balance mismatch | Any discrepancy | Backend |
| Polling finding tx | > 10 per run | Investigation |

### Runbooks
- **Double credit detected**: Check idempotency keys, reverse duplicate
- **Webhook not firing**: Verify endpoint URL, check Monnify dashboard
- **User reports missing funds**: Search transaction logs, check webhook history

### Deployment
- Feature flag: `ENABLE_NGN_WALLET`
- Rollout: Enable for 10% → 50% → 100%
- Rollback: Disable feature flag

---

## 7. Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Monnify API downtime | High | Low | Polling fallback, status page monitoring |
| Double crediting | High | Low | Idempotency keys, database constraints |
| Webhook signature spoofing | High | Low | Validate signatures, rate limiting |
| Negative balance | Medium | Low | Balance checks before debit |
| User can't fund | Medium | Low | Clear error messages, support contact |

---

## 8. Evaluation Criteria

### Definition of Done (DoD)
- [ ] Wallet created for each user on sign-up
- [ ] Dashboard shows wallet balance in NGN
- [ ] Fund modal displays bank details with copy button
- [ ] Transfer to account credits wallet within 60s
- [ ] Transaction history visible
- [ ] All API endpoints have error handling
- [ ] TypeScript types defined and used
- [ ] Prisma schema applied
- [ ] Unit tests for core functions (80%+ coverage)
- [ ] No sensitive data in logs
- [ ] Feature flag configurable

### Acceptance Testing
```typescript
// Example test cases
test("user gets wallet on first login")
test("balance displays correctly in NGN format")
test("copy button copies account number")
test("incoming transfer credits wallet")
test("transaction appears in history")
test("duplicate transactions are rejected")
```

---

## 9. Architectural Decision Records (ADRs)

### ADR-001: Hybrid Payment Detection
**Decision:** Use webhook + polling fallback for production
**Reason:** Reliability + instant credit + localhost dev support

### ADR-002: Kobo Storage
**Decision:** Store all amounts in kobo (integers)
**Reason:** Avoid floating-point precision issues with currency

### ADR-003: Reserved Account Model
**Decision:** Each user gets unique Monnify reserved account
**Reason:** Better tracking, user attribution, and reconciliation

---

## 10. Implementation Phases

### Phase 1: Core Wallet (Week 1)
- [ ] Database schema
- [ ] Wallet creation on signup
- [ ] Balance display in header
- [ ] Basic API endpoints

### Phase 2: Funding Flow (Week 2)
- [ ] Fund wallet modal UI
- [ ] Copy/share functionality
- [ ] Polling sync job
- [ ] Transaction history

### Phase 3: Production Hardening (Week 3)
- [ ] Webhook endpoint
- [ ] Signature validation
- [ ] Idempotency handling
- [ ] Monitoring and alerting
