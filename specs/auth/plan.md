# Authentication Implementation Plan (Hybrid)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐    ┌──────────────────────────────────┐   │
│  │   Sign Up Page       │    │   Sign In Page                   │   │
│  │   ───────────────    │    │   ────────────────               │   │
│  │   • Email form       │    │   • Email/password form          │   │
│  │   • OTP input        │    │   • Wallet connect button        │   │
│  │   • Wallet option    │    │   • Forgot password link         │   │
│  │   • Password fields  │    │                                  │   │
│  └──────────────────────┘    └──────────────────────────────────┘   │
│              │                            │                          │
│              ▼                            ▼                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              Auth Components (shared)                           │ │
│  │   SignInButton.tsx  │  ConnectStatus.tsx  │  WalletMenu.tsx    │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                              │
├─────────────────────────────────────────────────────────────────────┤
│  /api/auth/[...nextauth]  │  /api/auth/send-otp  │  /api/auth/verify-otp
│  /api/auth/forgot-password│  /api/auth/reset-password │ /api/auth/link-wallet
│       │                    │          │                   │          │
│       ▼                    │          ▼                   │          │
│  NextAuth handlers         │  OTP operations             │  Link wallet
│       │                    │                             │          │
│       ▼                    │                             ▼          │
│  Session management        │                             Security
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Database Layer                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Prisma ORM              │    PostgreSQL (Neon/Supabase)             │
│       │                 │              │                              │
│       ▼                 │              ▼                              │
│  User, Session,          │    Users with email, password, wallet     │
│  OTP, PasswordReset      │    OTP codes, reset tokens                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Database & Configuration
Setting up Prisma schema and environment for hybrid authentication.

### Phase 2: OTP System
Email OTP generation, verification, and resend logic.

### Phase 3: Email/Password Authentication
Sign-up form, password hashing, credentials provider.

### Phase 4: Wallet Authentication
SIWE provider, wallet sign-in, account linking.

### Phase 5: Password Reset
Forgot password flow, reset tokens, new password.

### Phase 6: Frontend Integration
All auth pages and components.

### Phase 7: Middleware Protection
Route protection and redirects.

### Phase 8: Testing
Unit, integration, and security testing.

---

## Component Breakdown

### Phase 1 Components
| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `prisma/schema.prisma` | Extended database models | Prisma CLI |
| `lib/prisma.ts` | Prisma client singleton | schema |
| `.env` variables | NEXTAUTH_SECRET, DATABASE_URL, email API keys | - |

### Phase 2 Components
| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `lib/auth/otp.ts` | OTP generation and verification | speakeasy |
| `lib/auth/email.ts` | Email sending via Resend | resend |
| `app/api/auth/send-otp/route.ts` | Send OTP API | otp.ts, email.ts |
| `app/api/auth/verify-otp/route.ts` | Verify OTP API | otp.ts |

### Phase 3 Components
| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `lib/auth/credentials.ts` | Credentials provider config | bcryptjs |
| `lib/auth/password.ts` | Password hashing utilities | bcryptjs |
| `auth.config.ts` | NextAuth configuration | credentials, siwe |

### Phase 4 Components
| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `lib/auth/siwe.ts` | SIWE message utilities | siwe |
| `lib/auth/wallet.ts` | Wallet linking logic | prisma |

### Phase 5 Components
| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `lib/auth/reset.ts` | Password reset token generation | prisma |
| `app/api/auth/forgot-password/route.ts` | Initiate reset | email.ts |
| `app/api/auth/reset-password/route.ts` | Complete reset | password.ts |

### Phase 6 Components
| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `app/auth/signup/page.tsx` | Sign-up page with forms | otp.ts |
| `app/auth/signin/page.tsx` | Sign-in page | credentials.ts |
| `app/auth/forgot-password/page.tsx` | Request reset | forgot-password.ts |
| `app/auth/reset-password/page.tsx` | Reset password | reset.ts |
| `components/auth/*.tsx` | Auth UI components | wagmi |

### Phase 7 Components
| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `middleware.ts` | Route protection | NextAuth |
| `lib/auth/redirects.ts` | Auth redirect logic | NextAuth |

---

## Dependencies and Sequencing

```
Phase 1 (Database & Config)
    │
    ├── Install dependencies
    ├── Create Prisma schema (Users, OTP, PasswordReset)
    ├── Push schema to database
    ├── Configure environment
    │
    ▼ [CHECKPOINT 1]
Phase 2 (OTP System)
    │
    ├── Create OTP utilities
    ├── Create Email utilities
    ├── Create Send/Verify OTP APIs
    │
    ▼ [CHECKPOINT 2]
Phase 3 (Email/Password)
    │
    ├── Create Password utilities
    ├── Configure Credentials provider
    ├── Create Sign-in API
    │
    ▼ [CHECKPOINT 3]
Phase 4 (Wallet + Linking)
    │
    ├── Create SIWE utilities
    ├── Configure SIWE provider
    ├── Create Wallet linking API
    │
    ▼ [CHECKPOINT 4]
Phase 5 (Password Reset)
    │
    ├── Create Reset token utilities
    ├── Create Forgot Password API
    ├── Create Reset Password API
    │
    ▼ [CHECKPOINT 5]
Phase 6 (Frontend)
    │
    ├── Create Sign-up page (forms + OTP)
    ├── Create Sign-in page
    ├── Create Forgot/Reset pages
    ├── Create Auth components
    ├── Update Header
    │
    ▼ [CHECKPOINT 6]
Phase 7 (Middleware)
    │
    ├── Create middleware.ts
    ├── Configure protected routes
    │
    ▼ [CHECKPOINT 7]
Phase 8 (Testing)
    │
    ├── Unit tests
    ├── Integration tests
    ├── Security audit
    │
    ▼ [CHECKPOINT 8 - COMPLETE]
```

---

## Design Decisions

### ADR-001: Email Service Choice

**Decision:** Resend for transactional emails

**Context:** Need reliable email delivery for OTP, password reset, and notifications.

**Alternatives Considered:**
1. **Resend** - Modern, developer-friendly, good free tier
2. **SendGrid** - Established, more features
3. **Nodemailer + Gmail** - Not reliable for production

**Rationale:**
- Resend has excellent Next.js integration
- Competitive pricing
- Easy setup
- Good free tier (3,000 emails/month)

**Consequences:**
- Need RESEND_API_KEY environment variable
- Email templates managed in Resend dashboard

### ADR-002: OTP Implementation

**Decision:** TOTP (Time-based OTP) with 6 digits, 10-minute expiry

**Context:** Need secure, user-friendly email verification.

**Alternatives Considered:**
1. **TOTP (time-based)** - Standard, no storage needed
2. **HOTP (counter-based)** - Requires storage, more complex
3. **Random string + database** - Simpler but requires cleanup

**Rationale:**
- TOTP is industry standard (Google Auth uses similar)
- No database storage needed for OTP
- 6 digits are user-friendly
- 10 minutes gives user time without being too long

**Consequences:**
- Users need accurate device time
- Cannot resend to same email immediately (rate limited)

### ADR-003: Password Reset Strategy

**Decision:** Token-based reset link with 1-hour expiry

**Context:** Secure password reset flow.

**Alternatives Considered:**
1. **Token in URL** - Standard practice, works across devices
2. **OTP-based reset** - More secure but requires email verification
3. **Security questions** - Legacy, can be compromised

**Rationale:**
- Token in URL is standard practice
- 1 hour is reasonable security window
- Single-use tokens prevent replay
- Confirmation email alerts user

**Consequences:**
- Need to store token hash in database
- Token must be invalidated after use

### ADR-004: Account Linking Strategy

**Decision:** Link wallet to email OR email to wallet via settings

**Context:** Users may start with one method and add the other.

**Rationale:**
- Flexibility for users
- Wallet-first users can add email for recovery
- Email-first users can add wallet for convenience
- Each link requires verification (OTP or signature)

**Consequences:**
- Database needs both walletAddress and email fields
- Unique constraint on both
- Linking requires proper authorization

---

## Testing Strategy

### Unit Tests (70% coverage minimum)
- OTP generation and verification
- Password hashing and comparison
- Token generation for reset
- Input validation (Zod schemas)

### Integration Tests
- Sign-up flow with OTP
- Sign-in flow (email/password)
- Sign-in flow (wallet)
- Password reset flow
- Account linking flow

### Manual Testing
- All sign-up paths
- All sign-in paths
- Password reset
- Session persistence
- Middleware redirects

---

## Success Criteria for Plan

- [ ] All dependencies installed and configured
- [ ] Database schema supports hybrid auth
- [ ] OTP system working (send and verify)
- [ ] Email/password sign-up and sign-in working
- [ ] Wallet sign-up and sign-in working
- [ ] Password reset flow working
- [ ] Account linking working
- [ ] Protected routes redirecting properly
- [ ] 70% test coverage achieved
- [ ] No security vulnerabilities
