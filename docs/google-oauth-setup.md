# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for your application.

## Part 1: Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top (next to "Google Cloud")
4. Click **"New Project"**
5. Enter project details:
   - **Project name**: `Analytic OS` (or your preferred name)
   - **Organization**: Leave as default or select your organization
6. Click **"Create"**
7. Wait for the project to be created (takes a few seconds)
8. Select your new project from the dropdown

### Step 2: Enable Google+ API

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on **"Google+ API"**
4. Click **"Enable"**
5. Also search for and enable **"Google People API"** (for profile information)

### Step 3: Configure OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account, then you can choose Internal)
3. Click **"Create"**

#### Fill in App Information:

**App information:**
- **App name**: `Analytic OS`
- **User support email**: Your email address
- **App logo**: (Optional) Upload your app logo

**App domain:**
- **Application home page**: `https://analytic-os.vercel.app`
- **Application privacy policy link**: `https://analytic-os.vercel.app/privacy-policy`
- **Application terms of service link**: `https://analytic-os.vercel.app/terms-of-use`

**Authorized domains:**
- Add: `vercel.app`
- Add: `analytic-os.vercel.app` (if prompted)

**Developer contact information:**
- **Email addresses**: Your email address

4. Click **"Save and Continue"**

#### Scopes:

1. Click **"Add or Remove Scopes"**
2. Select these scopes:
   - `openid`
   - `email`
   - `profile`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
3. Click **"Update"**
4. Click **"Save and Continue"**

#### Test Users (for development):

1. Click **"Add Users"**
2. Add your email addresses (you and your team members who will test)
3. Click **"Add"**
4. Click **"Save and Continue"**

5. Review the summary and click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** at the top
3. Select **"OAuth client ID"**

#### Configure OAuth Client:

**Application type:**
- Select **"Web application"**

**Name:**
- Enter: `Analytic OS Web Client`

**Authorized JavaScript origins:**
- Click **"Add URI"**
- Add: `http://localhost:3000` (for local development)
- Click **"Add URI"** again
- Add: `https://analytic-os.vercel.app` (for production)

**Authorized redirect URIs:**
- Click **"Add URI"**
- Add: `http://localhost:3000/api/auth/callback/google` (for local development)
- Click **"Add URI"** again
- Add: `https://analytic-os.vercel.app/api/auth/callback/google` (for production)

4. Click **"Create"**

### Step 5: Copy Your Credentials

A popup will appear with your credentials:

- **Client ID**: Something like `123456789-abc123def456.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-abc123def456ghi789`

**IMPORTANT**: Copy both of these values immediately!

---

## Part 2: Add Credentials to Your Application

### Step 6: Update Local Environment Variables

1. Open your `.env` file
2. Add these lines (replace with your actual credentials):

```env
# =============================================================================
# Google OAuth
# =============================================================================
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

### Step 7: Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `analytic-os`
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar
5. Add these variables:

**Variable 1:**
- **Key**: `GOOGLE_CLIENT_ID`
- **Value**: Your Google Client ID
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

**Variable 2:**
- **Key**: `GOOGLE_CLIENT_SECRET`
- **Value**: Your Google Client Secret
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

6. After adding both variables, click **"Redeploy"** to apply the changes

---

## Part 3: Testing

### Step 8: Test Locally

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`
3. Click **"Sign Up"** or **"Sign In"**
4. Click the **"Continue with Google"** button
5. You should see the Google sign-in popup
6. Sign in with a test user account
7. Grant permissions when prompted
8. You should be redirected back to your app and logged in

### Step 9: Test in Production

1. Go to `https://analytic-os.vercel.app`
2. Click **"Sign Up"** or **"Sign In"**
3. Click the **"Continue with Google"** button
4. Sign in with Google
5. You should be logged in successfully

---

## Part 4: Publishing Your App (Optional)

### Step 10: Publish OAuth Consent Screen

While your app is in "Testing" mode, only test users can sign in. To allow anyone to sign in:

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services"** → **"OAuth consent screen"**
3. Click **"Publish App"**
4. Review the warning and click **"Confirm"**

**Note**: Google may require verification if you're requesting sensitive scopes. For basic profile and email, verification is usually not required.

---

## Troubleshooting

### Common Issues:

**1. "Error 400: redirect_uri_mismatch"**
- Make sure your redirect URI in Google Console exactly matches: `https://analytic-os.vercel.app/api/auth/callback/google`
- Check for trailing slashes or typos

**2. "Access blocked: This app's request is invalid"**
- Your OAuth consent screen is not properly configured
- Make sure you've added authorized domains

**3. "Error 401: invalid_client"**
- Your Client ID or Client Secret is incorrect
- Double-check the values in your `.env` file and Vercel

**4. Users can't sign in (not test users)**
- Your app is still in "Testing" mode
- Either add them as test users or publish your app

**5. "Error: NEXTAUTH_URL is not set"**
- Make sure `NEXTAUTH_URL` is set in your environment variables
- For production: `https://analytic-os.vercel.app`
- For local: `http://localhost:3000`

---

## Security Best Practices

1. **Never commit credentials to Git**
   - Your `.env` file is already in `.gitignore`
   - Never share your Client Secret publicly

2. **Use different credentials for development and production**
   - Create separate OAuth clients for local and production environments

3. **Regularly rotate secrets**
   - Update your Client Secret periodically

4. **Monitor usage**
   - Check Google Cloud Console for unusual activity

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## Summary Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API and Google People API
- [ ] Configured OAuth Consent Screen
- [ ] Created OAuth 2.0 Credentials
- [ ] Added credentials to `.env` file
- [ ] Added credentials to Vercel environment variables
- [ ] Tested locally
- [ ] Tested in production
- [ ] (Optional) Published OAuth consent screen

---

**Need Help?**

If you encounter any issues, check the troubleshooting section above or refer to the Google OAuth documentation.
