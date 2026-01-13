# Authentication System Specification (Hybrid)

## Intent

Enable users to securely sign up and sign in to Analyti-web3 using either:
1. **Wallet authentication** (primary - web3 native)
2. **Email/password authentication** (secondary - traditional)

Users can link both methods to their account. Email also used for password reset and notifications.

## Success Criteria

### Functional Requirements

| Criterion | Description | Verification |
|-----------|-------------|--------------|
| **AUTH-001** | User can sign up with email, password, and profile fields | Manual: Complete sign-up form, receive OTP, verify email |
| **AUTH-002** | User can sign up by connecting wallet | Manual: Connect wallet, approve SIWE, account created |
| **AUTH-003** | Email OTP sent and verified during sign-up | Manual: Enter email, receive 6-digit OTP, enter correctly |
| **AUTH-004** | User can sign in with email/password | Manual: Enter credentials, access dashboard |
| **AUTH-005** | User can sign in with wallet | Manual: Connect wallet, approve, access dashboard |
| **AUTH-006** | User can request password reset via email | Manual: Click "Forgot password", enter email, receive reset link |
| **AUTH-007** | User can reset password via email link | Manual: Click reset link, enter new password, login works |
| **AUTH-008** | User can link wallet to email account | Manual: Connect wallet from account settings |
| **AUTH-009** | User can link email to wallet account | Manual: Add email from account settings |
| **AUTH-010** | Session persists across page refreshes | Manual: Refresh, stay logged in |
| **AUTH-011** | User can sign out | Manual: Click sign out, session cleared |

### Non-Functional Requirements

| Criterion | Description | Target |
|-----------|-------------|--------|
| **PERF-001** | Sign-up form submission | < 1s (before OTP) |
| **PERF-002** | OTP delivery | < 30s |
| **PERF-003** | Sign-in (email/password) | < 500ms |
| **PERF-004** | Sign-in (wallet) | < 3s (including wallet approval) |
| **SEC-001** | Password hashed with bcrypt (12 rounds) | Code review |
| **SEC-002** | OTP expires after 10 minutes | Code review |
| **SEC-003** | Session tokens: httpOnly, Secure, SameSite=Strict | Browser dev tools |
| **SEC-004** | Rate limiting: 5 login attempts/minute | Load testing |
| **SEC-005** | Password reset links expire after 1 hour | Code review |
| **SEC-006** | No private keys or seed phrases exposed | Code review |

---

## Constraints

### Technical Constraints

- Must use Next.js 15 App Router
- Must use TypeScript with strict mode
- Must use NextAuth.js with Credentials + SIWE providers
- Must use Prisma ORM with PostgreSQL
- Must use Ethereum mainnet only (chain ID: 1)
- Must use RainbowKit for wallet UI
- Must use Resend or SendGrid for email delivery
- Must use bcrypt for password hashing
- Must use Speakeasy or similar for TOTP/OTP

### Business Constraints

- Email verification required for sign-up
- Password must meet security requirements (8+ chars, 1 uppercase, 1 number)
- Username must be unique
- Email must be unique
- One wallet per user (one-to-one relationship)

---

## Sign-Up Flow (Email/Password)

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Fill Sign-Up Form                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Fields:                                                        │
│  ├── First name (required, 2-50 chars)                          │
│  ├── Last name (required, 2-50 chars)                           │
│  ├── Username (required, unique, 3-30 chars)                    │
│  ├── Phone number (optional, validated format)                  │
│  ├── Email address (required, unique, valid format)             │
│  ├── Create Password (required, 8+ chars, 1 uppercase, 1 num)  │
│  └── Confirm Password (must match)                              │
│                                                                  │
│  Button: "Send Verification Code"                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Email OTP Verification                                 │
│  ─────────────────────────────────────────────────────────────  │
│  User enters 6-digit OTP sent to email                          │
│  Timer: 10:00 countdown                                         │
│  Link: "Resend OTP" (limit 3 resends per hour)                 │
│                                                                  │
│  Button: "Verify & Create Account"                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Account Created                                        │
│  ─────────────────────────────────────────────────────────────  │
│  - User redirected to /dashboard                                │
│  - Session created                                              │
│  - Welcome email sent                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Sign-Up Flow (Wallet)

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Click "Sign Up with Wallet"                            │
│  ─────────────────────────────────────────────────────────────  │
│  User clicks "Connect Wallet"                                   │
│  Selects wallet (MetaMask, Coinbase, WalletConnect)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: SIWE Signature                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Wallet prompts to sign message:                                │
│  "Sign in to AnalytiOS                                          │
│   Wallet: 0x1234...abcd                                         │
│   Nonce: abc123                                                 │
│   Timestamp: 2025-01-02T10:00:00Z"                              │
│                                                                  │
│  Button: "Sign"                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Account Created (Optional: Add Email)                  │
│  ─────────────────────────────────────────────────────────────  │
│  If new wallet: Account created, auto-login                     │
│  Prompt: "Add email for password recovery and alerts?"          │
│  - Skip (wallet-only)                                           │
│  - Add email (continue to email form + OTP)                     │
│                                                                  │
│  If existing email user: Wallet linked to account               │
└─────────────────────────────────────────────────────────────────┘
```

## Sign-In Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Sign-In Options                                                │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────┐    ┌─────────────────────────────────┐     │
│  │  Email Login    │    │      Wallet Login               │     │
│  │  ───────────    │    │      ──────────────             │     │
│  │  Email          │    │  [Connect Wallet Button]        │     │
│  │  Password       │    │                                 │     │
│  │  [Sign In]      │    │  Already connected?             │     │
│  └─────────────────┘    │  [Sign Message] → Done!         │     │
│                         └─────────────────────────────────┘     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Forgot Password? → Enter email → Reset link sent       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Password Reset Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Request Reset                                          │
│  ─────────────────────────────────────────────────────────────  │
│  User clicks "Forgot Password?"                                 │
│  Enters email address                                          │
│  Clicks "Send Reset Link"                                      │
│                                                                  │
│  Email received with link:                                      │
│  https://analyti-os.com/auth/reset-password?token=xyz123       │
│  Link expires in 1 hour                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Reset Password                                         │
│  ─────────────────────────────────────────────────────────────  │
│  User clicks link (valid token)                                 │
│  Enters new password                                            │
│  Enters confirm password                                        │
│  Clicks "Reset Password"                                        │
│                                                                  │
│  - Old sessions logged out                                      │
│  - New password saved (bcrypt hashed)                           │
│  - Confirmation email sent                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Stories

### US-001: Email/Password Sign-up
```
As a new user
I want to create an account with my email and password
So that I can access the dashboard without a wallet
```
**Acceptance:**
- Complete sign-up form with all required fields
- Receive 6-digit OTP at email
- Enter OTP correctly
- Account created, redirected to dashboard
- Welcome email received

### US-002: Wallet Sign-up
```
As a crypto-native user
I want to sign up with my wallet
So that I don't need to manage a password
```
**Acceptance:**
- Click "Connect Wallet"
- Approve wallet connection
- Approve SIWE message
- Account auto-created
- Redirected to dashboard

### US-003: Email/Password Sign-in
```
As a registered user with email
I want to sign in with my email and password
So that I can access my account
```
**Acceptance:**
- Enter email and password
- Click "Sign In"
- Redirected to dashboard
- Session persists on refresh

### US-004: Wallet Sign-in
```
As a registered wallet user
I want to sign in with my wallet
So that I can access my account without a password
```
**Acceptance:**
- Click "Connect Wallet"
- Approve connection (if not connected)
- Approve SIWE message
- Redirected to dashboard

### US-005: Password Reset
```
As a user who forgot my password
I want to reset my password via email
So that I can regain access to my account
```
**Acceptance:**
- Click "Forgot Password"
- Enter email address
- Receive reset link (expires 1 hour)
- Click link, enter new password
- Login works with new password

### US-006: Link Wallet to Email Account
```
As an email user
I want to link my wallet to my account
So that I can also sign in with my wallet
```
**Acceptance:**
- Go to Account Settings
- Click "Link Wallet"
- Connect wallet, approve SIWE
- Wallet linked to account
- Can now sign in with either method

### US-007: Link Email to Wallet Account
```
As a wallet-only user
I want to add an email to my account
So that I can recover my account and receive alerts
```
**Acceptance:**
- Go to Account Settings
- Click "Add Email"
- Enter email, receive OTP, verify
- Email added to account
- Can now reset password via email

---

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| next-auth | ^5.0.0 | Authentication framework |
| @next-auth/prisma-adapter | ^1.0.0 | Database adapter |
| @prisma/client | ^5.20.0 | Database ORM |
| bcryptjs | ^2.4.3 | Password hashing |
| speakeasy | ^2.0.0 | OTP generation |
| resend | ^3.0.0 | Email delivery (or SendGrid) |
| zod | ^3.0.0 | Input validation |

---

## Acceptance Checklist

- [ ] Sign-up form validates all fields correctly
- [ ] OTP sent to email within 30 seconds
- [ ] OTP verification works (correct and incorrect)
- [ ] Password reset link sent to email
- [ ] Password reset link expires after 1 hour
- [ ] New password saved with bcrypt
- [ ] Sign-in works with email/password
- [ ] Sign-in works with wallet
- [ ] Linking wallet to email account works
- [ ] Linking email to wallet account works
- [ ] Session persists on refresh
- [ ] Sign out clears session
- [ ] Unauthenticated user redirected to sign-in
- [ ] Rate limiting prevents abuse
- [ ] Error messages are user-friendly
- [ ] Loading states shown during async operations
- [ ] TypeScript types for all auth functions
- [ ] Unit tests for auth logic (70% coverage)
- [ ] Integration tests for auth flows
