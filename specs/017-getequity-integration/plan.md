# GetEquitiy Integration Plan

## 1. Scope and Dependencies

### In Scope
- Fetch tokens from GetEquitiy API
- Transform and display on our platform
- Redirect to GetEquitiy for purchase
- Sandbox mode for testing

### Out of Scope
- Purchase on our platform
- Payment integration
- Webhooks

### Dependencies
- GetEquitiy API access (secret key)
- Environment variables for API keys

---

## 2. Key Decisions

### Decision: Proxy API Route
**Chosen:** Create proxy endpoint on our server

**Reasoning:**
- Hides API keys from client
- Caching possible
- Transform data before returning
- Rate limiting control

### Decision: Display with Redirect
**Chosen:** Show tokens, redirect to GetEquitiy for purchase

**Reasoning:**
- Simpler implementation
- GetEquitiy handles payments
- Less liability

### Decision: Server-side Fetching
**Chosen:** Fetch on server, return transformed data to client

**Reasoning:**
- API keys stay server-side
- Better error handling
- Caching opportunity

---

## 3. API Contract

### GET /api/external-tokens/getequity

**Query Params:**
- `sandbox` (optional): boolean - Use sandbox API

**Response:**
```json
{
  "success": true,
  "tokens": [
    {
      "id": "uuid",
      "externalId": "getequity-token-id",
      "name": "Company Name",
      "symbol": "SYM",
      "price": 10000,
      "annualYield": 15.5,
      "industry": "Technology",
      "riskLevel": "Low",
      "payoutFrequency": "Monthly",
      "logoUrl": "https://...",
      "description": "...",
      "purchaseUrl": "https://getequity.io/invest/token-id",
      "source": "getequity"
    }
  ],
  "source": "getequity-sandbox" | "getequity"
}
```

### GET /api/external-tokens/getequity/[tokenId]

**Response:**
```json
{
  "success": true,
  "token": { /* token details */ }
}
```

---

## 4. Environment Variables

```env
GETEQUITY_API_URL=https://ge-exchange.herokuapp.com/v1/
GETEQUITY_SANDBOX_URL=https://ge-exchange-staging-1.herokuapp.com/v1/
GETEQUITY_SECRET_KEY=your-secret-key
GETEQUITY_SANDBOX_KEY=your-sandbox-secret-key
```

---

## 5. Data Transformation

```typescript
interface GetEquitiyToken {
  id: string
  name: string
  symbol: string
  price: number
  annualYield: number
  industry: string
  riskLevel: string
  payoutFrequency: string
  description?: string
  asset: {
    id: string
    name: string
    logo: string
  }
}

function transformToken(token: GetEquitiyToken): ExternalToken {
  return {
    id: uuid(),
    externalId: token.id,
    name: token.name,
    symbol: token.symbol,
    price: token.price,
    annualYield: token.annualYield,
    industry: token.industry,
    riskLevel: token.riskLevel,
    payoutFrequency: token.payoutFrequency,
    logoUrl: token.asset?.logo,
    description: token.description,
    purchaseUrl: `https://getequity.io/invest/${token.id}`,
    source: 'getequity',
  }
}
```

---

## 6. Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| API down | Medium | Return cached/error response |
| Rate limiting | Low | Add caching, respect limits |
| Invalid data | Low | Validate and transform safely |

---

## 7. Definition of Done
- [ ] API endpoints working
- [ ] Tokens display correctly
- [ ] Redirect works
- [ ] Sandbox mode works
- [ ] Error handling in place
