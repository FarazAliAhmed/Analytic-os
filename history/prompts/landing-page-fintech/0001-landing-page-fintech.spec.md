---
id: "0001"
title: "Fintech Landing Page - NGN Wallet"
stage: "spec"
date: "2026-01-04"
surface: "agent"
model: "MiniMax-M2.1"
feature: "landing-page-fintech"
branch: "005-landing-page-fintech"
user: "Claude Code User"
command: "SpecifyPlus Prompt for fintech landing page update"
labels: ["landing-page","fintech","ngn","spec"]
links:
  spec: "specs/005-landing-page-fintech/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/005-landing-page-fintech/spec.md"
  - "src/components/landing/HeroSection.tsx"
  - "src/components/landing/AnimatedSVG.tsx"
tests: []
---

## Prompt

Update my landing page using SpecifyPlus since we now using Monnify not DeFi. Make it smart, modern, and up-to-date for our product. Don't do vibe coding. Use SpecifyPlus strictly.

Product: NGN wallet (fiat-only, no crypto/DeFi)
Integration: Monnify for NGN virtual accounts

## Response snapshot

Created comprehensive spec.md and implemented updated landing page:

**Spec.md Created:**
- User stories for fintech landing experience
- Functional requirements (hero, nav, features, CTA)
- Design system with colors, typography, animations
- Content requirements (NGN-focused messaging)
- Clear non-goals (no crypto/DeFi references)

**Implementation:**

1. **HeroSection.tsx** - Complete rewrite:
   - New headline: "Your NGN Wallet, Reimagined"
   - Subhead: Focus on virtual bank account, instant payments
   - "Powered by Monnify" badge
   - Trust indicators: "No crypto", "100% NGN", "Monnify Secured"
   - Features: Virtual NGN Account, Instant Bank Transfers, Secure & Protected
   - New sections: How It Works (3 steps), Benefits (Why choose Analyti)
   - Visual wallet card mockup in benefits section
   - Footer: "Powered by Monnify. Licensed payment service provider."

2. **AnimatedSVG.tsx** - Added HeroBackgroundMinimal:
   - Cleaner, less distracting background
   - Subtle gradient orbs (blue/purple)
   - Minimal grid pattern
   - Subtle pulsing particles
   - Professional fintech aesthetic

**Design Changes:**
- Removed: DeFi terminology, crypto references, network mentions
- Added: NGN wallet messaging, Monnify branding, trust signals
- Kept: Modern dark theme, glassmorphism, smooth animations

## Outcome

- ✅ Impact: Landing page now reflects NGN wallet fintech product
- 📁 Files: Updated spec.md, HeroSection.tsx, AnimatedSVG.tsx
- 🔁 Next prompts: None required
- 🧠 Reflection: Successfully transitioned landing page from DeFi to fintech. Kept modern design while changing messaging. All TypeScript checks pass.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): TypeScript compilation passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add pricing/fees section to landing page
