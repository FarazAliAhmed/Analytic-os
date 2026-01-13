# Social Authentication Specification

## Overview
Add OAuth support for Google, Facebook, and Twitter (X) to enable users to sign up/sign in with their social accounts.

## User Stories
- As a user, I can sign up with Google so I don't need to create a new password
- As a user, I can sign up with Facebook so I can use my existing Facebook account
- As a user, I can sign up with Twitter/X so I can use my Twitter account
- As a returning social user, I'm automatically logged in with my existing account
- As a new social user, an account is created automatically with my social profile data

## Functional Requirements

### Providers
1. **Google OAuth 2.0**
   - Use `next-auth/providers/google`
   - Scope: `email`, `profile`
   - Fields: email, name, picture

2. **Facebook OAuth**
   - Use `next-auth/providers/facebook`
   - Scope: `email`, `public_profile`
   - Fields: email, name, picture

3. **Twitter OAuth 2.0**
   - Use `next-auth/providers/twitter`
   - Scope: `tweet.read`, `users.read`, `offline.access`
   - Fields: email, name, profile_image_url

### Account Linking
- New social users: Auto-create account in database
- Existing users: Link social account to existing account (via email match)
- Handle case where email differs between social and existing account

### Database Updates
- Add fields to User model for OAuth accounts:
  - `googleId?: String?`
  - `facebookId?: String?`
  - `twitterId?: String?`
  - `image?: String?`

### Environment Variables
```env
# Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Facebook
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Twitter
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""
```

## API Routes
- `/api/auth/[...nextauth]` - Already exists, needs providers added

## UI Updates
- Add social login buttons to Sign In page
- Add social login buttons to Sign Up page (before divider)
- Match existing luxury gold theme styling
- Handle loading states for each provider

## Security Considerations
- Validate OAuth tokens server-side
- Use state parameter to prevent CSRF
- Secure OAuth secrets in environment variables
- Handle email verification from OAuth providers

## Implementation Plan
1. Install required dependencies (next-auth already installed)
2. Add OAuth providers to `src/lib/auth.ts`
3. Update User model in Prisma schema
4. Add social buttons to Sign In page
5. Add social buttons to Sign Up page
6. Add environment variables to `.env.example`
7. Run Prisma migration for new fields
