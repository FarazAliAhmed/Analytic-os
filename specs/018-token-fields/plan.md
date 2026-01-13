# Token Fields Implementation Plan

## 1. Scope and Dependencies

### In Scope
- Add tokenId, volume, transactionCount to Prisma schema
- Update admin API for token creation (auto-generate tokenId)
- Update TokenInfoCard to display new fields
- Create migration for existing tokens

### Dependencies
- Existing Token model
- Existing admin API routes
- Existing TokenInfoCard component

---

## 2. Key Decisions

### Decision: tokenId Format
**Chosen:** `{SYMBOL}-{NUMBER}` format (e.g., FCMB-001, PYSK-002)

**Reasoning:**
- Human readable
- Easy to sort
- Symbols are unique

### Decision: Auto-generation
**Chosen:** Generate tokenId on server during creation

**Reasoning:**
- Consistent format
- No manual entry required
- Prevents duplicates

### Decision: Volume/Count Updates
**Chosen:** Update on each transaction via API

**Reasoning:**
- Real-time accuracy
- Can be batch-updated later

---

## 3. Data Model

### Updated Token Schema
```prisma
model Token {
  id               String   @id @default(uuid())
  tokenId          String   @unique  // NEW: Unique token ID
  name             String
  symbol           String   @unique
  price            Int
  annualYield      Decimal
  industry         String
  payoutFrequency  String
  investmentType   String
  riskLevel        String
  listingDate      DateTime
  closeDate        DateTime?
  logoUrl          String?
  minimumInvestment Int
  employeeCount    Int
  description      String?
  volume           Int      @default(0)  // NEW
  transactionCount Int      @default(0)  // NEW
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

---

## 4. API Changes

### POST /api/admin/tokens
- Auto-generate tokenId based on existing tokens
- Return tokenId in response

### PUT /api/admin/tokens/[id]
- Allow updating volume and transactionCount

### GET /api/tokens & /api/tokens/[id]
- Return all new fields

---

## 5. UI Changes

### TokenInfoCard
```tsx
const TokenInfoCard = ({ tokenId, volume, transactionCount, listingDate, ... }) => {
  return (
    <div>
      <div>Token ID: {tokenId}</div>
      <div>Volume: {formatVolume(volume)}</div>
      <div>Transactions: {transactionCount}</div>
      <div>Listed: {formatDate(listingDate)}</div>
    </div>
  )
}
```

---

## 6. Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicate tokenIds | Medium | Check before insert |
| Existing tokens | Low | Migration script |
| Performance | Low | Indexed fields |

---

## 7. Definition of Done
- [ ] Prisma schema updated
- [ ] Migration run successfully
- [ ] Admin API generates tokenId
- [ ] TokenInfoCard displays all fields
- [ ] Existing tokens have tokenId
