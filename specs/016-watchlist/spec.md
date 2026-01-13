# Watchlist Feature

## User Story
As a user, I want to save tokens I'm interested in so I can easily track and purchase them later from my portfolio page.

## Requirements

### Functional Requirements
1. **Add to Watchlist**: Users can add any token to their watchlist from token listing or detail page
2. **Remove from Watchlist**: Users can remove tokens from their watchlist
3. **View Watchlist in Portfolio**: Users can filter their portfolio holdings to show only watched tokens
4. **Watchlist Indicator**: Show visual indicator on tokens that are in watchlist
5. **Authentication Required**: Only authenticated users can manage their watchlist
6. **Counts**: Show count of tokens in watchlist (e.g., "Watchlist 8")

### Non-Functional Requirements
- Fast UI updates (optimistic updates)
- Responsive design
- Consistent with existing design system

## Data Model

### Watchlist (existing Wishlist model)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Reference to User |
| tokenId | UUID | Reference to Token |
| createdAt | DateTime | When added |

## API Endpoints

### POST /api/watchlist
Add a token to watchlist
- Body: `{ tokenId: string }`
- Returns: `{ success: true, item: WatchlistItem }`

### DELETE /api/watchlist/[tokenId]
Remove a token from watchlist
- Returns: `{ success: true }`

### GET /api/watchlist
Get all watchlist items for current user
- Returns: `{ success: true, items: WatchlistItem[] }`

### GET /api/watchlist/ids
Get only token IDs (lightweight for batch checking)
- Returns: `{ success: true, tokenIds: string[] }`

### GET /api/watchlist/count
Get watchlist count
- Returns: `{ success: true, count: number }`

## UI Integration

### PortfolioHoldings Component
```tsx
const [view, setView] = useState<'all' | 'watchlist'>('all')

// Tabs
<button onClick={() => setView('all')}>
  All Tokens <span>{allTokensCount}</span>
</button>
<button onClick={() => setView('watchlist')}>
  Watchlist <span>{watchlistCount}</span>
</button>

// Table filters based on view
<PortfolioTable filter={view} />
```

### WatchlistButton
- Star or eye icon button
- Toggle functionality
- Optimistic updates

### WatchlistPage (optional)
- Dedicated page at `/watchlist`
- Lists all watched tokens

## Acceptance Criteria
- [ ] User can add token to watchlist
- [ ] User can remove token from watchlist
- [ ] Portfolio page shows "All Tokens" vs "Watchlist" tabs
- [ ] Watchlist tab shows only watched tokens
- [ ] Watchlist count updates in real-time
- [ ] Changes persist after page refresh
- [ ] Unauthenticated users see login prompt

## Out of Scope
- Watchlist sharing between users
- Email notifications
- Price alerts
- Sort/filter within watchlist
