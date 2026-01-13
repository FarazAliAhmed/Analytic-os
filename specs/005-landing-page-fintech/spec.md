---
id: "005"
title: "Fintech Landing Page - NGN Wallet"
feature: "landing-page-fintech"
stage: "spec"
date: "2026-01-04"
branch: "005-landing-page-fintech"
priority: "high"
model: "MiniMax-M2.1"
---

## Overview

Update the landing page from DeFi analytics to a modern NGN wallet fintech product. The product is a Nigerian Naira (NGN) wallet powered by Monnify, allowing users to have a dedicated virtual bank account, receive payments, and manage their money - all within a modern, sleek interface.

## User Stories

### US1: Modern Fintech Landing Experience
As a visitor, I want to see a modern, trustworthy landing page that clearly communicates the NGN wallet value proposition, so that I understand this is a Nigerian fintech product for managing Naira.

**Acceptance Criteria:**
1. Landing page displays modern dark-themed design with #4459FF accent
2. Hero section focuses on NGN wallet, not crypto/DeFi
3. All messaging is in Naira (NGN), not cryptocurrency
4. Visual elements convey trust and financial security

### US2: Quick Account Creation
As a visitor, I want to easily register from the landing page to get my NGN wallet account, so that I can start receiving payments immediately.

**Acceptance Criteria:**
1. Prominent "Join Us" button in navigation
2. "Get Started Free" CTA in hero section
3. Sign-up modal opens smoothly
4. No "Go to Dashboard" button visible to unauthenticated users

### US3: Sign In Access
As an existing user, I want to easily sign in to access my wallet, so that I can manage my finances.

**Acceptance Criteria:**
1. "Sign In" button visible in navigation
2. Sign-in modal opens smoothly
3. After sign-in, user can access dashboard

### US4: Value Proposition Clarity
As a visitor, I want to understand the key benefits of the NGN wallet, so that I can decide to sign up.

**Acceptance Criteria:**
1. Features section highlights: virtual account, instant funding, secure payments
2. Stats show relevant metrics (not crypto-related)
3. CTA section encourages sign-up

## Functional Requirements

### FR1: Hero Section
- Main headline focused on NGN wallet
- Subheadline explains the product value
- CTA buttons: "Get Started Free" + "Sign In"
- Email capture for waitlist (optional)

### FR2: Navigation
- Logo + "Analyti" brand
- "Sign In" button (text link)
- "Join Us" button (primary style)
- No wallet address connection UI

### FR3: Stats Section
- Display relevant fintech metrics
- Examples: "Instant Funding", "Secure & Licensed", "24/7 Support"
- Glassmorphism card design

### FR4: Features Section
- 3 feature cards highlighting:
  1. Dedicated NGN Virtual Account
  2. Instant Bank Transfers via Monnify
  3. Secure Wallet Management
- Icons: Wallet, Bank, Shield

### FR5: Final CTA
- Glowing card with "Ready to start?" messaging
- "Create Your Account" button

### FR6: Visual Effects
- Background animated SVG (modern, not crypto-themed)
- Glassmorphism cards
- Smooth fade-in animations
- Button hover effects

## Design System

### Colors
- Primary: #4459FF (blue accent)
- Background: #0A0A0A (dark)
- Surface: #181A20, #23262F
- Text: White, gray-400

### Typography
- Font: Satoshi (via next/font)
- Display: Bold headings
- Body: Regular text

### Components
- GlassCard: Reusable glassmorphism card
- FeatureCard: Card with icon + title + description
- StatCard: Card for metrics
- GlowingCard: Card with gradient glow effect

### Animations
- fadeInUp: Content fades in and moves up
- float: Floating animation for SVG elements
- pulse: Subtle pulse for indicators
- shimmer: Gradient shimmer for accents
- stagger: Delay sequence for elements

### Icons (Lucide)
- Wallet, Building, Shield, TrendingUp, ArrowRight

## Content Requirements

### Hero Headline Options
1. "Your NGN Wallet, Reimagined"
2. "Bank in Your Pocket"
3. "Instant NGN Wallet for Everyone"

### Hero Subhead
"Get a dedicated virtual bank account. Receive payments instantly. Manage your Naira with confidence."

### Features
1. **Virtual NGN Account** - "Your dedicated Naira account number. Share it and receive transfers instantly."
2. **Instant Funding** - "Transfer from any Nigerian bank. Wallet credited automatically via Monnify."
3. **Secure & Protected** - "Bank-grade security with Monnify. Your money is always safe."

### Stats
1. "Instant" - "Account Created in Seconds"
2. "Zero" - "Setup Fees"
3. "24/7" - "Account Access"

## Non-Goals

- No cryptocurrency references
- No DeFi terminology
- No wallet connection prompts
- No multi-chain/network mentions
- No token/DeFi analytics features

## Files to Modify

| File | Action |
|------|--------|
| `src/components/landing/HeroSection.tsx` | Rewrite hero, features, CTA |
| `src/components/landing/AnimatedSVG.tsx` | Update background elements |
| `src/components/landing/GlassCard.tsx` | Keep as-is (reusable) |
| `src/app/globals.css` | Keep animations (may add new ones) |

## Success Criteria

1. ✅ Landing page loads under 3 seconds
2. ✅ No DeFi/crypto references visible
3. ✅ Sign Up and Sign In modals work correctly
4. ✅ All animations are smooth (200-500ms)
5. ✅ Glassmorphism effects render correctly
6. ✅ Mobile responsive design
7. ✅ TypeScript compilation passes

## Dependencies

- Existing SignInModal component
- Existing SignUpModal component
- Lucide React icons
- Tailwind CSS 4
- Next.js 15

## Environment Variables Required

None for landing page (static content)

## Security & Performance

- No client-side secrets
- No external API calls on load
- Optimized SVG animations (CSS-based)
- Lazy-loaded components as needed
