# GetEquitiy Integration Tasks

## Phase 1: Backend

### Task 1: Add Environment Variables
- [ ] Add to `.env.example`:
  ```
  GETEQUITY_API_URL=https://ge-exchange.herokuapp.com/v1/
  GETEQUITY_SANDBOX_URL=https://ge-exchange-staging-1.herokuapp.com/v1/
  GETEQUITY_SECRET_KEY=
  GETEQUITY_SANDBOX_KEY=
  ```

### Task 2: Create GetEquitiy API Client
- [ ] Create `src/lib/getequity/client.ts`
- [ ] Function to fetch tokens
- [ ] Function to fetch single token
- [ ] Sandbox mode support
- [ ] Error handling

### Task 3: Create GET /api/external-tokens/getequity
- [ ] Create `src/app/api/external-tokens/getequity/route.ts`
- [ ] Accept `sandbox` query param
- [ ] Call GetEquitiy API
- [ ] Transform response
- [ ] Return standardized format

### Task 4: Create GET /api/external-tokens/getequity/[tokenId]
- [ ] Create `src/app/api/external-tokens/getequity/[tokenId]/route.ts`
- [ ] Fetch single token
- [ ] Transform and return

---

## Phase 2: Frontend Components

### Task 5: Create ExternalTokenCard Component
- [ ] Create `src/components/external/ExternalTokenCard.tsx`
- [ ] Display token info
- [ ] "Invest on GetEquitiy" button
- [ ] External link to GetEquitiy

### Task 6: Create ExternalTokensPage
- [ ] Create `src/app/external-tokens/page.tsx`
- [ ] Fetch tokens from API
- [ ] Display grid of ExternalTokenCard
- [ ] Toggle for sandbox/production

### Task 7: Add to Dashboard
- [ ] Add "External Investments" tab or section
- [ ] Link to ExternalTokensPage

---

## Phase 3: Testing

### Task 8: API Testing
```bash
# Get all tokens
curl http://localhost:3000/api/external-tokens/getequity

# Get single token
curl http://localhost:3000/api/external-tokens/getequity/TOKEN_ID

# Sandbox mode
curl http://localhost:3000/api/external-tokens/getequity?sandbox=true
```

### Task 9: UI Testing
- [ ] Tokens display correctly
- [ ] Clicking invest opens new tab to GetEquitiy
- [ ] Sandbox toggle works

---

## Quick Reference

**API Endpoints:**
- `GET /api/external-tokens/getequity` - List tokens
- `GET /api/external-tokens/getequity/[tokenId]` - Single token

**Environment Variables:**
```env
GETEQUITY_API_URL=https://ge-exchange.herokuapp.com/v1/
GETEQUITY_SANDBOX_URL=https://ge-exchange-staging-1.herokuapp.com/v1/
GETEQUITY_SECRET_KEY=
GETEQUITY_SANDBOX_KEY=
```

**Auth Header:**
```
Authorization: Bearer YOUR_SECRET_KEY
```
