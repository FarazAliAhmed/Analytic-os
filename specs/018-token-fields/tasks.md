# Token Fields Implementation Tasks

## Phase 1: Backend

### Task 1: Update Prisma Schema
- [ ] Add `tokenId` field with unique constraint
- [ ] Add `volume` field with default 0
- [ ] Add `transactionCount` field with default 0
- [ ] Run `npx prisma generate` and `npx prisma db push`

### Task 2: Create Migration Script
- [ ] Create script to assign tokenId to existing tokens
- [ ] Format: `{SYMBOL}-{NUMBER}` (e.g., PYSK-001, FCMB-001)

### Task 3: Update POST /api/admin/tokens
- [ ] Auto-generate tokenId on creation
- [ ] Query existing tokens to get next number
- [ ] Return tokenId in response

### Task 4: Update PUT /api/admin/tokens/[id]
- [ ] Allow updating volume and transactionCount
- [ ] Add validation for numeric fields

### Task 5: Update GET Endpoints
- [ ] Ensure all new fields are returned
- [ ] Test /api/tokens and /api/tokens/[id]

---

## Phase 2: Frontend

### Task 6: Update TokenInfoCard
- [ ] Accept token prop with new fields
- [ ] Display Token ID
- [ ] Display Volume
- [ ] Display Transaction Count
- [ ] Format dates properly

### Task 7: Test TokenInfoCard
- [ ] Verify all fields display correctly
- [ ] Check date formatting
- [ ] Verify empty states

---

## Phase 3: Testing

### Task 8: API Testing
```bash
# Create token (should auto-generate tokenId)
curl -X POST http://localhost:3000/api/admin/tokens \
  -H "Content-Type: application/json" \
  -d '{...}'

# Check new fields
curl http://localhost:3000/api/tokens

# Update volume/transaction count
curl -X PUT http://localhost:3000/api/admin/tokens/TOKEN_ID \
  -H "Content-Type: application/json" \
  -d '{"volume": 1000000, "transactionCount": 50}'
```

### Task 9: UI Testing
- [ ] TokenInfoCard shows all fields
- [ ] Date format is readable
- [ ] Volume format is readable

---

## Quick Reference

**New Token Fields:**
- `tokenId`: String (unique, e.g., "PYSK-001")
- `volume`: Int (default 0)
- `transactionCount`: Int (default 0)

**API Endpoints:**
- `POST /api/admin/tokens` - Auto-generates tokenId
- `PUT /api/admin/tokens/[id]` - Updates volume/transactionCount
- `GET /api/tokens` - Returns all new fields
