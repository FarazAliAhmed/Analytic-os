# Analyti-web3 Constitution

## Core Principles

### I. Wallet-First Identity
Web3-native authentication is the primary identity mechanism. Every user has a wallet address as their immutable identifier. Email and social login are optional enhancements, not replacements. The wallet connection flow must be seamless and handle chain switching gracefully.

### II. Specification-Driven Development
All features follow the SDD-RI workflow: Constitution → Specification → Clarify → Plan → Tasks → Implement. No code is written before a specification exists. Checkpoints are mandatory between phases. Every significant decision is documented as an ADR.

### III. Type Safety Everywhere
TypeScript is non-negotiable for all code. External API responses must be typed. Database schemas must generate TypeScript types. No `any` types unless explicitly justified in an ADR. Zod for runtime validation of external data.

### IV. Security-First Web3
Smart contract interactions require explicit user confirmation. Private keys never leave the user's wallet. Session tokens have maximum 7-day expiry. Rate limiting on all API endpoints. No sensitive data in logs or error messages.

### V. Production-Grade UX
Loading states for every async operation. Error messages are user-friendly, never technical. Responsive design for mobile, tablet, and desktop. Dark theme by default (crypto-native user preference). Smooth animations for key interactions.

### VI. Observability & Debugging
Structured logging for all API calls. Performance metrics for critical user journeys. Error tracking with stack traces. Audit log for authentication events.

---

## Technology Standards

### Stack Requirements
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Language**: TypeScript 5 (strict mode)
- **Web3**: wagmi 2, viem 2, RainbowKit 2
- **State**: TanStack Query 5 for server state
- **Auth**: NextAuth.js with SIWE adapter
- **Database**: PostgreSQL (Neon or Supabase) with Prisma ORM
- **API**: Next.js API Routes (serverless)

### Code Quality Gates
- ESLint with TypeScript and React plugins
- Prettier for consistent formatting
- Husky pre-commit hooks
- Unit test coverage minimum: 70% for auth modules
- Build must pass before merge

### Naming Conventions
- **Components**: PascalCase (e.g., `ConnectWalletButton`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWalletAuth`)
- **Utilities**: camelCase (e.g., `formatAddress`)
- **Files**: kebab-case for non-components (e.g., `auth-config.ts`)
- **Database**: snake_case for columns, PascalCase for models

### Git Workflow
- Conventional commits only
- Feature branches from main
- PR required for all changes
- Squash merge preferred

---

## Security Requirements

### Authentication Security
- SIWE messages include domain, nonce, timestamp
- Session JWTs signed with RS256
- Refresh tokens rotated on use
- Compromised token detection (impossible travel, unusual hours)
- Account takeover protection via wallet signature verification

### Data Protection
- No private keys or seed phrases stored
- Environment variables for all secrets
- Database encryption at rest
- HTTPS only in production
- CORS restricted to known origins

### Web3 Specific
- RPC provider must be reputable (Alchemy, QuickNode)
- Gas estimation before transactions
- Simulation of transactions when possible
- Clear warnings for approve/infinite spend actions

---

## Performance Standards

### Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### API Response Times
- Authentication endpoints: < 200ms
- Data fetch endpoints: < 500ms
- Complex queries: < 2s (with pagination)

### Caching Strategy
- Static assets: immutable CDN cache
- API responses: Redis layer with 30-60s TTL for prices
- Database queries: Prisma query optimization

---

## Development Workflow

### Phase Transition Rules
1. **Constitution** → Create/amend at project start
2. **Specification** → Required before any feature work
3. **Clarify** → Required before Plan phase
4. **Plan** → Required before Tasks phase
5. **Tasks** → Required before Implementation
6. **Implement** → With human checkpoints after each phase

### Checkpoint Protocol
After each phase group:
- Agent presents completed work
- Human reviews against specification
- Human approves (commit) or requests iteration
- Only after approval does work continue

### Documentation Requirements
- ADRs for all architecturally significant decisions
- PHRs for all AI collaboration sessions
- README.md kept updated with setup instructions
- API documentation for all endpoints

---

## Governance

### Constitution Supersedence
This constitution supersedes all other development practices. Any deviation requires:
1. Documentation of the deviation
2. Justification in an ADR
3. Approval from project lead

### Amendment Process
Constitution amendments require:
1. Proposed changes documented
2. Impact analysis completed
3. Migration plan for existing code
4. Team review and approval

### Compliance Verification
All PRs must verify:
- Type safety maintained
- Tests added/updated
- Documentation updated
- Security requirements met
- Performance impact assessed

---

**Version**: 1.0.0 | **Ratified**: 2025-01-02 | **Last Amended**: 2025-01-02
