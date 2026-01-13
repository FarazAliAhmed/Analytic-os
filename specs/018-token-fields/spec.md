# Token Fields Enhancement

## User Story
As an admin, I want each token to have a unique token ID, trading volume, transaction count, and proper listing date so users can track token performance.

## Requirements

### Functional Requirements
1. **Unique Token ID**: Each token has a unique identifier (e.g., INV-001, FCMB-001)
2. **Trading Volume**: Track total trading volume for each token
3. **Transaction Count**: Track number of transactions for each token
4. **Date of Listing**: Properly display listing date on token cards
5. **Sync with UI**: TokenInfoCard displays these fields dynamically

### Data Model Updates

#### Token Model Updates
| Field | Type | Description |
|-------|------|-------------|
| tokenId | String | Unique token ID (e.g., INV-001) |
| volume | Int | Trading volume (default: 0) |
| transactionCount | Int | Number of transactions (default: 0) |
| listingDate | DateTime | Already exists - ensure display |

### UI Updates

#### TokenInfoCard Display
| Field | Display |
|-------|---------|
| Token ID | Show tokenId field |
| Volume | Format as currency/quantity |
| Transactions | Show count |
| Date of Listing | Format date properly |

### Backend Updates

#### API Endpoints
- `POST /api/admin/tokens` - Generate tokenId automatically
- `PUT /api/admin/tokens/[id]` - Update volume/transaction count
- `GET /api/tokens` - Return all new fields
- `GET /api/tokens/[id]` - Return all new fields

#### Auto-generation Logic
```typescript
// Generate tokenId on creation
function generateTokenId(symbol: string, count: number) {
  const prefix = symbol.toUpperCase().slice(0, 4)
  const number = String(count + 1).padStart(3, '0')
  return `${prefix}-${number}`
}
```

### Acceptance Criteria
- [ ] Each token has unique tokenId (auto-generated)
- [ ] Volume field tracks trading volume
- [ ] Transaction count increments on each trade
- [ ] TokenInfoCard displays all new fields
- [ ] Admin API generates tokenId automatically
- [ ] Existing tokens get tokenId assigned

### Out of Scope
- Real-time volume updates (batch sync later)
- Historical transaction count
