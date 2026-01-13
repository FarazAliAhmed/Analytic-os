# Watchlist Implementation Plan

## 1. Scope and Dependencies

### In Scope
- Watchlist API endpoints (reuse existing Prisma model)
- WatchlistButton component
- PortfolioHoldings integration (All Tokens / Watchlist tabs)
- Watchlist count display

### Out of Scope
- Watchlist page (can add later)
- Watchlist sharing
- Email notifications

### Dependencies
- `next-auth` for authentication
- Existing `Token` and `User` models
- Existing `Watchlist` model in Prisma (was Wishlist)
- PortfolioHoldings and PortfolioTable components

---

## 2. Key Decisions

### Decision: Reuse Existing Model
**Chosen:** Use existing Prisma `Wishlist` model as `Watchlist`

**Reasoning:** Model already exists with correct schema. Just rename APIs and components.

### Decision: Client-side Filtering
**Chosen:** Fetch all user holdings, then filter in UI for watchlist view

**Reasoning:** Simpler than creating separate watchlist-specific holdings endpoint.

---

## 3. API Contracts

### GET /api/watchlist/ids (new lightweight endpoint)
Returns array of token IDs for batch checking.

### GET /api/watchlist/count (new endpoint)
Returns count of watched tokens.

### Existing Endpoints (renamed)
- `POST /api/watchlist` - Add token
- `DELETE /api/watchlist/[tokenId]` - Remove token
- `GET /api/watchlist` - Get all with token details

---

## 4. UI Components

### WatchlistButton
```tsx
interface WatchlistButtonProps {
  tokenId: string;
  initialIsWatching?: boolean;
  onToggle?: (isWatching: boolean) => void;
}
```

### PortfolioHoldings Integration
```tsx
const [view, setView] = useState<'all' | 'watchlist'>('all')
const [watchlistIds, setWatchlistIds] = useState<string[]>([])

// Fetch watchlist IDs on mount
useEffect(() => {
  fetch('/api/watchlist/ids')
    .then(r => r.json())
    .then(data => setWatchlistIds(data.tokenIds || []))
}, [])

// Filter tokens based on view
const displayedTokens = view === 'all'
  ? allTokens
  : allTokens.filter(t => watchlistIds.includes(t.id))
```

---

## 5. Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Empty watchlist state | Low | Show empty state in table |
| Large watchlist size | Low | Indexed queries |

---

## 6. Definition of Done
- [ ] All API endpoints working
- [ ] WatchlistButton toggles correctly
- [ ] PortfolioHoldings shows All/Watchlist tabs
- [ ] Watchlist count displays correctly
- [ ] Table filters to show only watched tokens
