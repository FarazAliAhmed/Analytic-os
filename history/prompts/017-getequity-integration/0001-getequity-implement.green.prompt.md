---
id: "0001"
title: "GetEquitiy API Integration"
stage: "green"
date_iso: "2026-01-08"
surface: "agent"
model: "MiniMax-M2.1"
feature: "getequity-integration"
branch: "011-withdrawal-form"
user: "https://www.getequity.io/api/ Let’s implement their API to get enough investment token on our platform spceifiyplus only"
command: "https://www.getequity.io/api/ Let’s implement their API to get enough investment token on our platform spceifiyplus only"
labels:
  - "api-integration"
  - "external-tokens"
  - "spec-driven-development"
links:
  spec: "specs/017-getequity-integration/spec.md"
  plan: "specs/017-getequity-integration/plan.md"
  tasks: "specs/017-getequity-integration/tasks.md"
files_yaml: |
  - specs/017-getequity-integration/spec.md
  - specs/017-getequity-integration/plan.md
  - specs/017-getequity-integration/tasks.md
  - src/lib/getequity/client.ts
  - src/app/api/external-tokens/getequity/route.ts
  - src/app/api/external-tokens/getequity/[tokenId]/route.ts
  - src/components/external/ExternalTokenCard.tsx
  - src/app/external-tokens/page.tsx
  - .env.example (GetEquitiy env vars added)
tests_yaml: |
  - curl http://localhost:3000/api/external-tokens/getequity
  - curl http://localhost:3000/api/external-tokens/getequity?sandbox=true
  - curl http://localhost:3000/api/external-tokens/getequity/TOKEN_ID
---

# Prompt Text

https://www.getequity.io/api/ Let’s implement their API to get enough investment token on our platform spceifiyplus only

# Response Text

Implemented GetEquitiy API integration using SpecifyPlus workflow:

1. **Created design artifacts:**
   - `specs/017-getequity-integration/spec.md` - Feature specification
   - `specs/017-getequity-integration/plan.md` - Architecture decisions
   - `specs/017-getequity-integration/tasks.md` - Implementation task list

2. **Backend implemented:**
   - `src/lib/getequity/client.ts` - API client with fetchTokens() and fetchTokenById()
   - `GET /api/external-tokens/getequity` - List all tokens from GetEquitiy
   - `GET /api/external-tokens/getequity/[tokenId]` - Get single token

3. **Frontend implemented:**
   - `ExternalTokenCard` component - Displays token info with "Invest on GetEquitiy" button
   - `/external-tokens` page - Grid display of external tokens with sandbox toggle

4. **Configuration:**
   - Added GetEquitiy environment variables to `.env.example`

**API Details:**
- Base URLs: Production (`https://ge-exchange.herokuapp.com/v1/`) and Sandbox
- Authentication: Bearer token header
- Tokens displayed with redirect to GetEquitiy for purchase

**To use:**
1. Add API keys to `.env`:
   ```
   GETEQUITY_SECRET_KEY=
   GETEQUITY_SANDBOX_KEY=
   ```

2. Access external tokens at `/external-tokens`

3. API endpoints:
   ```bash
   # Get all tokens
   curl http://localhost:3000/api/external-tokens/getequity

   # Sandbox mode
   curl http://localhost:3000/api/external-tokens/getequity?sandbox=true

   # Get single token
   curl http://localhost:3000/api/external-tokens/getequity/TOKEN_ID
   ```
