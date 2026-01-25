# Session Issue - Wrong User Logged In

## Problem
- Tried to sign up with `farazali75302@gmail.com`
- But logged in as `faraz59995@gmail.com` instead
- Dashboard shows wrong email

## Root Cause
You have **3 Google OAuth accounts** all linked to `faraz59995@gmail.com`:
1. Provider Account ID: 112875570885851834966
2. Provider Account ID: 100893275977764611039
3. Provider Account ID: 115601891905217351571

When you try to sign in with Google using the email `farazali75302@gmail.com`, Google is using one of these existing OAuth connections that's already linked to `faraz59995@gmail.com`.

## Why This Happens
- Google OAuth links by Google Account ID, not email
- Your Google account (the one you're using to sign in) is already registered with `faraz59995@gmail.com`
- Even if you try to use a different email, it uses the existing OAuth link

## Solutions

### Option 1: Clear Browser Data (Recommended)
1. **Sign out** from the application
2. **Clear browser cookies** for the site:
   - Chrome: Settings → Privacy → Clear browsing data → Cookies
   - Or use Incognito/Private mode
3. **Close all browser tabs** of the application
4. **Open a new tab** and go to the site
5. **Sign up** with email/password (not Google) using `farazali75302@gmail.com`

### Option 2: Use Different Google Account
1. Sign out from the application
2. Sign out from Google in your browser
3. Sign in to Google with a **different Google account**
4. Then sign up on the application with Google OAuth

### Option 3: Use Email/Password Registration
1. Sign out from the application
2. Click "Sign Up"
3. Use the **email/password form** (not Google button)
4. Enter:
   - Email: `farazali75302@gmail.com`
   - Password: (your choice)
   - Other details
5. This will create a new account separate from Google OAuth

### Option 4: Delete Old User and OAuth Links (Clean Slate)
Run this script to delete the old user and start fresh:

\`\`\`bash
npx tsx scripts/delete-user.ts faraz59995@gmail.com
\`\`\`

Then clear browser cookies and sign up again.

## Current Database State

**Users:**
1. `test_1769285208121@example.com` (test user)
2. `faraz59995@gmail.com` (your old account with 3 Google OAuth links)

**Missing:**
- `farazali75302@gmail.com` (not created because OAuth linked to existing account)

## Immediate Fix Steps

1. **Clear the old user:**
\`\`\`bash
npx tsx scripts/delete-user.ts faraz59995@gmail.com
\`\`\`

2. **Clear browser cookies:**
   - Go to browser settings
   - Clear cookies for `analyti-os.vercel.app`
   - Or use Incognito mode

3. **Sign up again:**
   - Use email/password registration (not Google)
   - Or use a different Google account

## Prevention

To avoid this in the future:
- Use email/password registration for testing
- Or use different Google accounts for different test emails
- Clear cookies between tests

## Technical Details

The issue is in the OAuth flow:
- Google OAuth uses `providerAccountId` (Google's user ID) to link accounts
- Your Google account has ID that's already linked to `faraz59995@gmail.com`
- When you sign in with Google, it finds the existing link and logs you in as that user
- The email you enter doesn't matter - it uses the OAuth link

This is actually **correct behavior** for OAuth - it prevents duplicate accounts.
