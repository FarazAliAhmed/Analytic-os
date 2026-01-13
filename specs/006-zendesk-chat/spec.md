---
id: "006"
title: "Zendesk Live Chat Support"
feature: "zendesk-chat"
stage: "spec"
date: "2026-01-04"
branch: "006-zendesk-chat"
priority: "high"
model: "MiniMax-M2.1"
---

## Overview

Implement Zendesk live chat support integration for customer assistance. The widget will be:
- Visible to authenticated users with their identity passed to Zendesk
- Available as a generic widget for unauthenticated visitors
- Properly cleaned up on logout
- Configurable via environment variables

## User Stories

### US1: Access Support Chat
As a user, I want to access live chat support from anywhere in the app, so that I can get help with my questions.

**Acceptance Criteria:**
1. Chat widget is visible on all dashboard pages
2. Clicking the widget opens the chat interface
3. Chat opens with user context (for authenticated users)

### US2: Authenticated User Support
As an authenticated user, I want my chat sessions to be linked to my account, so that support agents can see my information.

**Acceptance Criteria:**
1. User name and email are passed to Zendesk
2. Chat history is associated with user account
3. Support agents can see user details

### US3: Unauthenticated Visitor Support
As a visitor, I want to access support without signing up, so that I can ask questions before creating an account.

**Acceptance Criteria:**
1. Widget is visible on landing page
2. Generic chat works without authentication
3. Option to sign up/in from chat

### US4: Logout Cleanup
As a user, when I log out, my chat session should be cleared, so that the next user doesn't see my information.

**Acceptance Criteria:**
1. Logout clears Zendesk user session
2. Widget resets to unauthenticated state
3. No user data persists after logout

## Functional Requirements

### FR1: Widget Component
- Load Zendesk web widget script asynchronously
- Initialize widget only after script loads
- Support show/hide/methods

### FR2: User Authentication
- Pass authenticated user data to Zendesk
- Use JWT authentication for secure user linking
- Handle login/logout lifecycle

### FR3: Environment Configuration
- Configure via environment variables:
  - `ZENDESK_KEY`: Web widget key
  - `ZENDESK_JWT_SECRET`: For JWT generation

### FR4: API Endpoints
- `/api/zendesk/token`: Generate JWT for user authentication

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Zendesk Integration                       │
├─────────────────────────────────────────────────────────────┤
│  Components                    │  API Routes                 │
│  ├── ZendeskProvider.tsx       │  ├── /api/zendesk/token    │
│  ├── ZendeskButton.tsx         │  └── /api/zendesk/webhook  │
│  └── useZendesk.ts             │                            │
├─────────────────────────────────────────────────────────────┤
│  Services                      │  External                   │
│  ├── zendeskService.ts         │  └── Zendesk Web Widget    │
│  └── jwtUtils.ts               │     (messaging SDK)        │
└─────────────────────────────────────────────────────────────┘
```

## Zendesk Web Widget API

### Core Methods
```javascript
// Show messenger
zE('messenger', 'show')

// Open messenger
zE('messenger', 'open')

// Hide messenger
zE('messenger', 'hide')

// Login user with JWT
zE('messenger', 'loginUser', (callback) => callback(jwt))

// Logout user
zE('messenger', 'logoutUser')

// Set conversation tags
zE('messenger:set', 'conversationTags', ['analyti', 'support'])
```

## Data Flow

### Authentication Flow
```
User Login
    ↓
Check if widget loaded
    ↓
Generate JWT via /api/zendesk/token
    ↓
zE('messenger', 'loginUser', callback)
    ↓
User authenticated in Zendesk
```

### Logout Flow
```
User Logout
    ↓
zE('messenger', 'logoutUser')
    ↓
Clear local session
    ↓
Widget reset to anonymous
```

## Environment Variables

```env
# Zendesk Web Widget
NEXT_PUBLIC_ZENDESK_KEY="your_zendesk_web_widget_key"

# JWT Secret for user authentication
ZENDESK_JWT_SECRET="your_jwt_secret_min_32_chars"
```

## Security Considerations

### JWT Generation
- JWT must include: `external_id`, `name`, `email`
- Set expiration timestamp
- Sign with HMAC-SHA256

### Widget Security
- Only load widget on client side
- Never expose JWT secret in client code
- Validate user session before generating token

## Non-Goals

- Custom Zendesk widgets (use standard web widget)
- Automated chatbot (human support only)
- Ticket creation API (handled by Zendesk)

## Dependencies

| Dependency | Purpose |
|------------|---------|
| jsonwebtoken | JWT generation on server |
| jose | TypeScript-friendly JWT |

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/providers/ZendeskProvider.tsx` | Widget provider component |
| `src/components/dashboard/ZendeskButton.tsx` | Chat trigger button |
| `src/hooks/useZendesk.ts` | Zendesk hook for interactions |
| `src/lib/zendesk.ts` | JWT generation utilities |
| `src/app/api/zendesk/token/route.ts` | JWT token endpoint |
| `src/app/layout.tsx` | Add provider |

## Success Criteria

1. ✅ Widget loads without blocking page render
2. ✅ Authenticated users show name/email in chat
3. ✅ Logout clears user session
4. ✅ TypeScript compilation passes
5. ✅ No console errors on load
