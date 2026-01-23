# Google OAuth Quick Start Guide

## Quick Summary

Your app is already configured for Google OAuth! You just need to get credentials from Google and add them to your environment variables.

## What You Need to Do

### 1. Get Google OAuth Credentials (15 minutes)

1. Go to https://console.cloud.google.com/
2. Create a new project called "Analytic OS"
3. Enable Google+ API
4. Configure OAuth consent screen:
   - App name: `Analytic OS`
   - User support email: Your email
   - Authorized domains: `vercel.app`
   - Developer contact: Your email
5. Create OAuth 2.0 credentials:
   - Type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://analytic-os.vercel.app`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://analytic-os.vercel.app/api/auth/callback/google`
6. Copy your Client ID and Client Secret

### 2. Add to Local Environment

Add to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 3. Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `GOOGLE_CLIENT_ID` = your client ID
   - `GOOGLE_CLIENT_SECRET` = your client secret
5. Redeploy

### 4. Test

- Local: `npm run dev` → http://localhost:3000 → Click "Sign Up" → "Continue with Google"
- Production: https://analytic-os.vercel.app → Click "Sign Up" → "Continue with Google"

## What's Already Done

✅ NextAuth.js configured with Google provider
✅ UI buttons for "Continue with Google" in Sign Up and Sign In modals
✅ Automatic user creation in database
✅ Automatic wallet creation for OAuth users
✅ Role selection (Investor/Admin)
✅ Session management

## Need Detailed Instructions?

See `docs/google-oauth-setup.md` for step-by-step instructions with screenshots and troubleshooting.

## Current Status

- **Facebook OAuth**: Also configured (needs credentials)
- **Twitter/X OAuth**: Also configured (needs credentials)
- **Email/Password**: ✅ Working
- **Google OAuth**: ⏳ Needs credentials

## Important Notes

1. **Testing Mode**: Initially, only test users can sign in. Add test users in Google Console or publish your app.
2. **Redirect URIs**: Must match exactly (no trailing slashes)
3. **Environment Variables**: Must be set in both local `.env` and Vercel
4. **Redeploy**: After adding Vercel environment variables, you must redeploy

## Support

If you need help, check:
- Full guide: `docs/google-oauth-setup.md`
- Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
- NextAuth.js docs: https://next-auth.js.org/providers/google
