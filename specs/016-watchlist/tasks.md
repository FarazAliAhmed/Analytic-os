# Watchlist Implementation Tasks

## Phase 1: Backend (APIs)

### Task 1: Create GET /api/watchlist/ids
- [ ] Create `src/app/api/watchlist/ids/route.ts`
- [ ] Return array of token IDs for current user
- Lightweight endpoint for batch checking

### Task 2: Create GET /api/watchlist/count
- [ ] Create `src/app/api/watchlist/count/route.ts`
- [ ] Return count of watched tokens

### Task 3: Create POST /api/watchlist
- [ ] Create `src/app/api/watchlist/route.ts` (POST)
- [ ] Validate auth
- [ ] Validate tokenId
- [ ] Add to watchlist

### Task 4: Create GET /api/watchlist
- [ ] Create `src/app/api/watchlist/route.ts` (GET)
- [ ] Return all watchlist items with token details

### Task 5: Create DELETE /api/watchlist/[tokenId]
- [ ] Create `src/app/api/watchlist/[tokenId]/route.ts`
- [ ] Remove from watchlist

---

## Phase 2: Frontend Components

### Task 6: Create WatchlistButton component
- [ ] Create `src/components/watchlist/WatchlistButton.tsx`
- [ ] Star icon (outline/filled)
- [ ] Optimistic updates
- [ ] Props: tokenId, initialIsWatching, onToggle

### Task 7: Update PortfolioHoldings
- [ ] Fetch watchlist IDs on mount
- [ ] Add 'all' | 'watchlist' state
- [ ] Implement tab switching
- [ ] Pass filtered tokens to PortfolioTable
- [ ] Update counts dynamically

### Task 8: Add WatchlistButton to token cards
- [ ] Add button to GainerRow
- [ ] Add to other token display components

---

## Phase 3: Testing

### Task 9: API Testing
```bash
# Add token
curl -X POST http://localhost:3000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"tokenId":"..."}'

# Get IDs
curl http://localhost:3000/api/watchlist/ids

# Get count
curl http://localhost:3000/api/watchlist/count

# Get all
curl http://localhost:3000/api/watchlist

# Remove
curl -X DELETE http://localhost:3000/api/watchlist/TOKEN_ID
```

### Task 10: UI Testing
- [ ] Tab switching works
- [ ] Count updates correctly
- [ ] Button toggles watchlist status
