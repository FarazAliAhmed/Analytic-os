---
id: "0001"
title: "Social Authentication (Google, Facebook, Twitter)"
stage: "spec"
date: "2026-01-04"
surface: "agent"
model: "MiniMax-M2.1"
feature: "social-auth"
branch: "007-social-auth"
user: "Claude Code User"
command: "SpecifyPlus Prompt for social auth"
labels: ["oauth","authentication","google","facebook","twitter","spec"]
links:
  spec: "specs/007-social-auth/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "src/lib/auth.ts"
  - "src/app/auth/signin/page.tsx"
  - "src/app/auth/signup/page.tsx"
  - ".env.example"
tests: []
---

## Prompt

Implement OAuth authentication for Google, Facebook, and Twitter (X) using NextAuth.js v5. Use SpecifyPlus workflow - create spec.md first then implement.

Requirements:
- Add Google, Facebook, Twitter OAuth providers
- Auto-create user account on first OAuth sign-in
- Auto-create wallet for new OAuth users
- Add social login buttons to Sign In page
- Add social login buttons to Sign Up page
- Match existing luxury gold theme styling
- TypeScript support

## Response snapshot

**Spec.md Created:** `specs/007-social-auth/spec.md`
- User stories for each OAuth provider
- Functional requirements for scopes and fields
- Database schema with Account model (already exists)
- Environment variable documentation

**Implementation:**

1. **src/lib/auth.ts** - Core auth configuration:
   - Added Google, Facebook, Twitter OAuth providers
   - Removed PrismaAdapter (type incompatibility with NextAuth v5)
   - Custom event handler for OAuth user creation
   - Auto-creates user, account, and wallet records on first sign-in

2. **src/app/auth/signin/page.tsx** - Sign In page:
   - Added Google, Facebook, X buttons before wallet option
   - Matching luxury gold secondary button styling
   - SVG icons for each provider

3. **src/app/auth/signup/page.tsx** - Sign Up page:
   - Added social buttons at top with "Sign up faster with" text
   - Divider with "or sign up with email" text
   - Same styling as Sign In page

4. **.env.example** - Environment variables:
   - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
   - FACEBOOK_CLIENT_ID / FACEBOOK_CLIENT_SECRET
   - TWITTER_CLIENT_ID / TWITTER_CLIENT_SECRET

**TypeScript:**
- Removed adapter import to fix type compatibility
- All types inferred correctly
- No compilation errors

## Outcome

- Impact: Users can now sign up/sign in with Google, Facebook, or X
- 📁 Files: 4 files modified
- 🔁 Next prompts: None required
- 🧠 Reflection: NextAuth v5 with JWT sessions doesn't require PrismaAdapter. OAuth users are created manually in the signIn event handler.

## Evaluation notes (flywheel)

- Failure modes observed: PrismaAdapter type incompatibility with NextAuth v5
- Graders run and results (PASS/FAIL): TypeScript compilation passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add Apple OAuth for iOS users
