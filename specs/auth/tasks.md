# Authentication Implementation Tasks (Hybrid)

## Phase 1: Database & Configuration

### Task 1.1: Install Authentication Dependencies
**Duration:** 15 min | **Depends on:** Nothing

**Description:** Install all required packages for hybrid authentication.

**Acceptance:**
```bash
# Core auth packages
npm install next-auth@beta @next-auth/prisma-adapter @prisma/client bcryptjs speakeasy resend zod

# Dev dependencies
npm install -D prisma @types/bcryptjs @types/speakeasy

# Verify in package.json
grep -E "(next-auth|@next-auth/prisma|@prisma|bcryptjs|speakeasy|resend|zod)" package.json
```

---

### Task 1.2: Create Extended Prisma Schema
**Duration:** 25 min | **Depends on:** 1.1

**Description:** Define database models for hybrid auth (users, sessions, OTP, password reset).

**Acceptance:**
- File `prisma/schema.prisma` created with:
  - `User` model: id, email, passwordHash, walletAddress, firstName, lastName, username, phone, emailVerified, createdAt, updatedAt
  - `Session` model: id, sessionToken, userId, expires
  - `VerificationToken` model: identifier, token, expires (for OTP)
  - `PasswordResetToken` model: email, token, expires
  - Proper unique constraints (email, walletAddress, username)
  - Proper indexes for lookups
- Run `npx prisma generate` successfully

**Output File:** `prisma/schema.prisma`

---

### Task 1.3: Configure Environment Variables
**Duration:** 10 min | **Depends on:** 1.2

**Description:** Add all authentication-related environment variables.

**Acceptance:**
- `.env` contains:
  ```
  DATABASE_URL="postgresql://..."
  NEXTAUTH_SECRET="openssl-rand-base64-32"
  NEXTAUTH_URL="http://localhost:3000"
  RESEND_API_KEY="re_..."
  ```
- `.env.example` updated with all variables
- All secrets properly formatted

---

### Task 1.4: Push Schema to Database
**Duration:** 10 min | **Depends on:** 1.3

**Description:** Create database tables with Prisma.

**Acceptance:**
- Run `npx prisma db push`
- Tables created in PostgreSQL
- `npx prisma studio` shows correct schema
- No errors in output

---

### Task 1.5: Create Prisma Client Singleton
**Duration:** 10 min | **Depends on:** 1.2

**Description:** Create reusable Prisma client instance.

**Acceptance:**
- File `lib/prisma.ts` created with:
  - Global singleton pattern
  - Type-safe PrismaClient
  - Proper error handling
- Import works in API routes

**Output File:** `lib/prisma.ts`

---

## Phase 2: OTP System

### Task 2.1: Create OTP Utilities
**Duration:** 20 min | **Depends on:** 1.1

**Description:** Create OTP generation and verification helpers using Speakeasy.

**Acceptance:**
- File `lib/auth/otp.ts` created with:
  - `generateOTP()` - creates 6-digit code
  - `verifyOTP(code, storedSecret)` - verifies TOTP
  - `generateSecret()` - creates new secret
- Unit tests for OTP functions
- Types exported

**Output File:** `lib/auth/otp.ts`

---

### Task 2.2: Create Email Sending Utilities
**Duration:** 15 min | **Depends on:** 1.1

**Description:** Create email sending functions using Resend.

**Acceptance:**
- File `lib/auth/email.ts` created with:
  - `sendOTPEmail(email, otp)` - sends 6-digit OTP
  - `sendPasswordResetEmail(email, resetLink)` - sends reset link
  - `sendWelcomeEmail(email, name)` - welcome email
- Uses Resend API
- Error handling for failed sends

**Output File:** `lib/auth/email.ts`

---

### Task 2.3: Create Send OTP API
**Duration:** 15 min | **Depends on:** 2.1, 2.2

**Description:** API route to send OTP to email for sign-up verification.

**Acceptance:**
- File `app/api/auth/send-otp/route.ts` created
- POST request with `{ email }`
- Validates email format with Zod
- Checks if email already exists
- Generates OTP, stores in database, sends email
- Rate limited: max 3 OTPs per hour per email
- Returns success (don't reveal if email exists)

**Output File:** `app/api/auth/send-otp/route.ts`

---

### Task 2.4: Create Verify OTP API
**Duration:** 15 min | **Depends on:** 2.1

**Description:** API route to verify OTP during sign-up.

**Acceptance:**
- File `app/api/auth/verify-otp/route.ts` created
- POST request with `{ email, otp }`
- Validates OTP against stored secret
- Marks email as verified if valid
- Returns verification status
- OTP expires after 10 minutes

**Output File:** `app/api/auth/verify-otp/route.ts`

---

## Phase 3: Email/Password Authentication

### Task 3.1: Create Password Utilities
**Duration:** 15 min | **Depends on:** 1.1

**Description:** Create password hashing and validation helpers.

**Acceptance:**
- File `lib/auth/password.ts` created with:
  - `hashPassword(password)` - bcrypt (12 rounds)
  - `verifyPassword(password, hash)` - compare
  - `validatePassword(password)` - strength check (8+ chars, 1 uppercase, 1 number)
- Error handling for weak passwords
- Unit tests

**Output File:** `lib/auth/password.ts`

---

### Task 3.2: Configure NextAuth with Credentials Provider
**Duration:** 30 min | **Depends on:** 1.5, 3.1, 2.4

**Description:** Set up NextAuth.js with Credentials provider for email/password.

**Acceptance:**
- File `lib/auth/config.ts` created with:
  - Credentials provider configuration
  - Email/password validation
  - Session strategy (jwt)
  - Callbacks (authorize, jwt, session)
  - Proper error messages
- File `lib/auth.ts` created as main auth export
- No TypeScript errors

**Output Files:** `lib/auth/config.ts`, `lib/auth.ts`

---

### Task 3.3: Create NextAuth Type Extensions
**Duration:** 10 min | **Depends on:** 3.2

**Description:** Extend TypeScript types for NextAuth with user fields.

**Acceptance:**
- File `types/next-auth.d.ts` created with:
  - Extended Session type (userId, email, name, walletAddress)
  - Extended User type (firstName, lastName, username)
  - Extended Account type
- `tsconfig.json` includes this file

**Output File:** `types/next-auth.d.ts`

---

### Task 3.4: Create NextAuth API Route Handler
**Duration:** 15 min | **Depends on:** 3.2

**Description:** Create the API route that handles NextAuth requests.

**Acceptance:**
- File `app/api/auth/[...nextauth]/route.ts` created
- Exports GET and POST handlers
- Imports auth.ts correctly
- Works with Next.js 15 App Router

**Output File:** `app/api/auth/[...nextauth]/route.ts`

---

## Phase 4: Wallet Authentication

### Task 4.1: Create SIWE Utilities
**Duration:** 20 min | **Depends on:** 1.1

**Description:** Create Sign-In with Ethereum message utilities.

**Acceptance:**
- File `lib/auth/siwe.ts` created with:
  - `generateNonce()` - creates unique nonce
  - `createSiweMessage(address, nonce)` - generates SIWE message
  - `verifySiweMessage(message, signature, address)` - verifies
- SIWE message includes: domain, address, statement, URI, version, chainId, nonce, timestamp
- Unit tests

**Output File:** `lib/auth/siwe.ts`

---

### Task 4.2: Configure SIWE Provider in NextAuth
**Duration:** 20 min | **Depends on:** 3.2, 4.1

**Description:** Add SIWE provider to NextAuth configuration.

**Acceptance:**
- File `lib/auth/config.ts` updated with:
  - SIWE provider configuration
  - Wallet address validation
  - Automatic account creation for new wallets
- File `lib/auth.ts` updated

---

### Task 4.3: Create Wallet Linking API
**Duration:** 20 min | **Depends on:** 1.5, 4.1

**Description:** API route to link wallet to existing email account.

**Acceptance:**
- File `app/api/auth/link-wallet/route.ts` created
- POST request with `{ walletAddress, signature }`
- Verifies SIWE signature
- Links wallet to authenticated user's account
- Ensures wallet not already linked to another account
- Returns success/error

**Output File:** `app/api/auth/link-wallet/route.ts`

---

## Phase 5: Password Reset

### Task 5.1: Create Password Reset Utilities
**Duration:** 15 min | **Depends on:** 1.5

**Description:** Create password reset token generation and validation.

**Acceptance:**
- File `lib/auth/reset.ts` created with:
  - `generateResetToken()` - creates secure random token
  - `createResetRecord(email)` - stores token in database
  - `validateResetToken(token)` - looks up and validates
  - `invalidateResetToken(token)` - marks as used
- Token expires after 1 hour

**Output File:** `lib/auth/reset.ts`

---

### Task 5.2: Create Forgot Password API
**Duration:** 15 min | **Depends on:** 2.2, 5.1

**Description:** API route to initiate password reset flow.

**Acceptance:**
- File `app/api/auth/forgot-password/route.ts` created
- POST request with `{ email }`
- Validates email exists
- Creates reset token, stores in database
- Sends reset email via Resend
- Rate limited: max 3 requests per hour per email
- Returns success (don't reveal if email exists)

**Output File:** `app/api/auth/forgot-password/route.ts`

---

### Task 5.3: Create Reset Password API
**Duration:** 15 min | **Depends on:** 3.1, 5.1

**Description:** API route to complete password reset with token.

**Acceptance:**
- File `app/api/auth/reset-password/route.ts` created
- POST request with `{ token, newPassword, confirmPassword }`
- Validates token (exists, not expired)
- Validates password strength
- Hashes new password, updates user
- Invalidates token (single use)
- Logs out all existing sessions
- Returns success/error

**Output File:** `app/api/auth/reset-password/route.ts`

---

## Phase 6: Frontend Integration

### Task 6.1: Create Sign-Up Page
**Duration:** 45 min | **Depends on:** 2.3, 2.4, 3.2

**Description:** Create sign-up page with email/password form and wallet option. Match styling from FiltersModal (dark theme, blur backdrop, pill tabs, custom checkboxes).

**Acceptance:**
- File `app/auth/signup/page.tsx` created
- **Styling matches FiltersModal:**
  - Dark background (#0A0A0A)
  - Blur backdrop overlay
  - Rounded corners (rounded-xl)
  - Subtle borders (#23262F)
  - White text, gray secondary text
  - Custom checkboxes: square, black with white check when checked
  - Footer with Reset and Apply buttons style
- Form fields:
  - First name, Last name (required)
  - Username (unique)
  - Phone (optional)
  - Email (unique)
  - Password, Confirm Password
- "Send OTP" button triggers send-otp API
- OTP input field with 10:00 countdown
- "Resend OTP" link (rate limited)
- Password strength indicator
- **"Sign Up" button** (primary action, white bg, black text)
- **"Sign Up with Wallet" button** (secondary option for wallet auth)
- Validation errors shown
- Loading states
- Smooth animations (fade, slide)

**Output File:** `app/auth/signup/page.tsx`

---

### Task 6.2: Create Sign-In Page
**Duration:** 30 min | **Depends on:** 3.2, 4.2

**Description:** Create sign-in page with email/password and wallet option. Match FiltersModal styling.

**Acceptance:**
- File `app/auth/signin/page.tsx` created
- **Styling matches FiltersModal:**
  - Dark background (#0A0A0A)
  - Blur backdrop overlay
  - Rounded corners (rounded-xl)
  - Subtle borders (#23262F)
  - White text, gray secondary text
  - Button styling matches modal buttons
- Email/password form
- **"Sign In" button** (primary action, white bg, black text)
- **"Sign In with Wallet" button** (secondary option for wallet auth)
- "Forgot Password?" link (gray text)
- "Don't have an account? Sign Up" link
- Validation errors shown
- Loading states
- Error messages for failed login

**Output File:** `app/auth/signin/page.tsx`

---

### Task 6.3: Create Forgot Password Page
**Duration:** 20 min | **Depends on:** 5.2

**Description:** Create forgot password request page. Match FiltersModal styling.

**Acceptance:**
- File `app/auth/forgot-password/page.tsx` created
- **Styling matches FiltersModal:**
  - Dark background (#0A0A0A)
  - Blur backdrop overlay
  - Rounded corners (rounded-xl)
  - Subtle borders (#23262F)
  - White text, gray secondary text
  - Button styling matches modal buttons
- Email input field (styled like form inputs in modal)
- "Send Reset Link" button
- Links back to sign-in
- Success message after email sent
- Loading states

**Output File:** `app/auth/forgot-password/page.tsx`

---

### Task 6.4: Create Reset Password Page
**Duration:** 20 min | **Depends on:** 5.3

**Description:** Create password reset page (accessed via email link). Match FiltersModal styling.

**Acceptance:**
- File `app/auth/reset-password/page.tsx` created
- **Styling matches FiltersModal:**
  - Dark background (#0A0A0A)
  - Blur backdrop overlay
  - Rounded corners (rounded-xl)
  - Subtle borders (#23262F)
  - White text, gray secondary text
  - Button styling matches modal buttons
- Reads token from URL query params
- New password, Confirm password fields (styled like modal inputs)
- Password strength indicator
- "Reset Password" button
- Validation errors
- Redirect to sign-in on success
- Error if token expired/invalid

**Output File:** `app/auth/reset-password/page.tsx`

---

### Task 6.5: Create Auth Provider Component
**Duration:** 15 min | **Depends on:** 3.2

**Description:** Wrap app with NextAuth SessionProvider.

**Acceptance:**
- File `components/providers/AuthProvider.tsx` created
- Wraps children with SessionProvider
- Used in `app/layout.tsx`
- No prop drilling

**Output File:** `components/providers/AuthProvider.tsx`

---

### Task 6.6: Create SignInButton Component
**Duration:** 20 min | **Depends on:** 4.2, RainbowKit

**Description:** Create wallet sign-in button with SIWE.

**Acceptance:**
- File `components/auth/SignInButton.tsx` created
- Uses wagmi `useSignMessage` hook
- Shows loading state
- Handles signature rejection
- Calls NextAuth signIn('siwe')
- Redirects to /dashboard
- User-friendly errors

**Output File:** `components/auth/SignInButton.tsx`

---

### Task 6.7: Create ConnectStatus Component
**Duration:** 15 min | **Depends on:** 6.6

**Description:** Display wallet connection status and user menu.

**Acceptance:**
- File `components/auth/ConnectStatus.tsx` created
- Shows formatted wallet address
- Shows user name/email
- Sign-out option
- Account settings link
- Matches app's design

**Output File:** `components/auth/ConnectStatus.tsx`

---

### Task 6.8: Update Header with Auth UI
**Duration:** 20 min | **Depends on:** 6.5, 6.6, 6.7

**Description:** Update Header to show auth-aware interface.

**Acceptance:**
- File `src/common/Header.tsx` updated
- When logged out: shows "Sign In" button → opens sign-in page
- When logged in: shows ConnectStatus with user menu
- Sign-in/sign-out flows work
- Responsive design maintained

**Output File:** `src/common/Header.tsx`

---

## Phase 7: Middleware Protection

### Task 7.1: Create Auth Middleware
**Duration:** 25 min | **Depends on:** 3.2

**Description:** Protect dashboard routes from unauthenticated access.

**Acceptance:**
- File `middleware.ts` created in root
- Configured matcher for `/dashboard/:path*`
- Redirects unauthenticated users to sign-in
- Allows access to auth pages (`/auth/signin`, `/auth/signup`, etc.)
- Preserves return URL
- No redirect loops

**Output File:** `middleware.ts`

---

## Phase 8: Testing

### Task 8.1: Write Unit Tests for Auth Utilities
**Duration:** 30 min | **Depends on:** 2.1, 3.1, 5.1

**Description:** Create unit tests for auth utility functions.

**Acceptance:**
- File `tests/unit/auth/*.test.ts` created
- Tests for: OTP, Password, Reset token
- 70% code coverage achieved
- All tests pass

**Output File:** `tests/unit/auth/*.test.ts`

---

### Task 8.2: Write Integration Tests for Auth Flows
**Duration:** 45 min | **Depends on:** 6.1, 6.2, 6.3, 6.4

**Description:** Test full authentication flows.

**Acceptance:**
- File `tests/integration/auth/*.test.ts` created
- Tests for: Sign-up, Sign-in, Password reset, Wallet sign-in
- Mock API calls
- All tests pass

**Output File:** `tests/integration/auth/*.test.ts`

---

### Task 8.3: Security Audit
**Duration:** 30 min | **Depends on:** All tasks complete

**Description:** Verify security of authentication implementation.

**Acceptance:**
- [ ] Passwords hashed with bcrypt (12 rounds)
- [ ] OTP expires after 10 minutes
- [ ] Reset links expire after 1 hour
- [ ] Session cookies are httpOnly, Secure, SameSite
- [ ] Rate limiting on all auth endpoints
- [ ] No private keys in code
- [ ] No sensitive data in logs
- [ ] CSRF protection enabled

---

## Task Dependency Graph

```
Phase 1: Database
├─ 1.1 Install deps ──→ 1.2 Schema ──→ 1.3 Env vars ──→ 1.4 Push DB
│                                              │
│                                              └──→ 1.5 Prisma client
│
Phase 2: OTP System
├─ 1.1 Install deps ──→ 2.1 OTP utils ──→ 2.2 Email utils
│                              │
│                              ├──→ 2.3 Send OTP API
│                              │
│                              └──→ 2.4 Verify OTP API
│
Phase 3: Email/Password
├─ 1.1 Install deps ──→ 3.1 Password utils ──→ 3.2 NextAuth config
│         │                                    │
│         │                                    └──→ 3.3 Type extensions
│         │                                                    │
│         └──→ 3.4 NextAuth API route ◄───────────────────────┘
│
Phase 4: Wallet
├─ 1.1 Install deps ──→ 4.1 SIWE utils ──→ 4.2 SIWE in NextAuth
│                                             │
│                                             └──→ 4.3 Link wallet API
│
Phase 5: Password Reset
├─ 1.5 Prisma client ──→ 5.1 Reset utils ──→ 5.2 Forgot password API
│                                                    │
│                                                    └──→ 5.3 Reset password API
│
Phase 6: Frontend
├─ 2.3,2.4 OTPs ──→ 6.1 Sign-up page ──────────────────────┐
│                                                               │
├─ 3.2 NextAuth ──→ 6.5 Auth provider ──→ 6.6 SignInButton ──┼─→ 6.8 Header
│                                                               │
├─ 3.2 NextAuth ──→ 6.2 Sign-in page                         │
│                                                               │
├─ 5.2 Forgot password ──→ 6.3 Forgot password page          │
│                                                               │
├─ 5.3 Reset password ──→ 6.4 Reset password page            │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Phase 7: Middleware
├─ 3.2 NextAuth ──→ 7.1 Middleware
│
Phase 8: Testing
├─ 2.1,3.1,5.1 ──→ 8.1 Unit tests
│                       │
├─ 6.1,6.2,6.3,6.4 ─────┼──→ 8.2 Integration tests
│                       │
└───────────────────────┴──→ 8.3 Security audit
```

---

## Checkpoint Schedule

| Checkpoint | After Phase | What Gets Reviewed |
|------------|-------------|-------------------|
| **CP1** | Phase 1 | Database schema, env vars, Prisma client |
| **CP2** | Phase 2 | OTP system, email sending |
| **CP3** | Phase 3 | Email/password auth, NextAuth config |
| **CP4** | Phase 4 | Wallet auth, SIWE, linking |
| **CP5** | Phase 5 | Password reset flow |
| **CP6** | Phase 6 | All auth pages and components |
| **CP7** | Phase 7 | Middleware protection |
| **CP8** | Phase 8 | Tests, security audit |

---

## Quick Reference

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | 5 tasks | 60 min |
| Phase 2 | 4 tasks | 65 min |
| Phase 3 | 4 tasks | 75 min |
| Phase 4 | 3 tasks | 60 min |
| Phase 5 | 3 tasks | 45 min |
| Phase 6 | 8 tasks | 185 min |
| Phase 7 | 1 task | 25 min |
| Phase 8 | 3 tasks | 105 min |
| **Total** | **31 tasks** | **~10 hours** |
