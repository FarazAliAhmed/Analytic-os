# GetEquitiy API Integration

## User Story
As a user, I want to browse and invest in external investment tokens from GetEquitiy so I can diversify my portfolio with more investment options.

## Requirements

### Functional Requirements
1. **Fetch External Tokens**: Pull active investment tokens from GetEquitiy API
2. **Display External Tokens**: Show GetEquitiy tokens alongside native tokens
3. **Sync Token Details**: Sync token name, symbol, price, yield, risk level, industry
4. **Redirect to Purchase**: Redirect to GetEquitiy for actual purchase (or integrate purchase)
5. **Periodic Sync**: Sync tokens periodically (cron job or manual trigger)

### Non-Functional Requirements
- Fast response time (cache external API responses)
- Error handling for API failures
- Fallback to cached data on API failure
- Rate limiting consideration

## Data Flow

```
Our Platform → GetEquitiy API → Transform → Store in DB → Display to User
                    ↓
              Purchase Flow
                    ↓
              Redirect/Integrate
```

## API Details

### Base URLs
- **Production:** `https://ge-exchange.herokuapp.com/v1/`
- **Sandbox:** `https://ge-exchange-staging-1.herokuapp.com/v1/`

### Authentication
```
Authorization: Bearer YOUR_SECRET_KEY
```

### Endpoints
- `GET api/tokens?closed=false&exited=false` - Fetch all active tokens
- `GET api/token/{tokenId}` - Fetch specific token
- `GET api/token/search` - Search tokens
- `GET api/asset/{id}` - Get asset details

### Sample Response
```json
{
  "data": [
    {
      "id": "token-uuid",
      "name": "Company Name",
      "symbol": "SYM",
      "price": 10000,
      "annualYield": 15.5,
      "industry": "Technology",
      "riskLevel": "Low",
      "payoutFrequency": "Monthly",
      "description": "...",
      "asset": {
        "id": "asset-uuid",
        "name": "Company Name",
        "logo": "https://..."
      }
    }
  ]
}
```

## Integration Strategy

### Option 1: Display Only (Redirect)
- Fetch and display GetEquitiy tokens
- Click "Invest" → Redirect to GetEquitiy purchase page
- Simpler, less maintenance

### Option 2: Full Integration
- Fetch tokens and store locally
- Allow purchase on our platform
- More complex, requires payment integration

**Chosen:** Option 1 (Display Only with Redirect) for MVP

## Data Mapping

| GetEquitiy Field | Our Token Field | Notes |
|-----------------|-----------------|-------|
| id | externalId | Store original ID |
| name | name | |
| symbol | symbol | |
| price | price | Convert currency if needed |
| annualYield | annualYield | |
| industry | industry | |
| riskLevel | riskLevel | |
| payoutFrequency | payoutFrequency | |
| asset.logo | logoUrl | |
| description | description | |

## API Endpoints (Our Platform)

### GET /api/external-tokens/getequity
Fetch tokens from GetEquitiy
- Query params: `?sandbox=true` (optional)
- Returns: Array of transformed tokens

### GET /api/external-tokens/getequity/[tokenId]
Fetch single token from GetEquitiy

### POST /api/external-tokens/getequity/sync
Manually sync tokens from GetEquitiy to local cache

## Out of Scope
- Purchase integration (redirect only for now)
- Webhook for purchase completion
- Real-time price updates

## Acceptance Criteria
- [ ] Can fetch tokens from GetEquitiy API
- [ ] Tokens display correctly on our platform
- [ ] Clicking invest redirects to GetEquitiy
- [ ] Error handling for API failures
- [ ] Sandbox mode for testing
