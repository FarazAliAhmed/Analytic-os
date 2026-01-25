# Complete Vercel Setup Guide for go54.com

## 🚨 CRITICAL: Fix Wallet Creation Issue

Your wallet creation is failing on Vercel because **Monnify environment variables are missing**. Follow these steps:

### Step 1: Add Monnify Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (orbits-app or similar)
3. Click **Settings** → **Environment Variables**
4. Add these 4 variables (one by one):

```
MONNIFY_API_KEY = MK_PROD_LK468XJWJE
MONNIFY_SECRET_KEY = 3BSS5F6F3LS7K31ZBVR8ADLKVMNXF86E
MONNIFY_CONTRACT_CODE = 477829380233
MONNIFY_BASE_URL = https://api.monnify.com
```

5. For each variable:
   - Click **Add New**
   - Enter the **Name** (e.g., `MONNIFY_API_KEY`)
   - Enter the **Value** (e.g., `MK_PROD_LK468XJWJE`)
   - Select **All Environments** (Production, Preview, Development)
   - Click **Save**

### Step 2: Redeploy Your Application

After adding the environment variables:

1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2-3 minutes)

### Step 3: Test Wallet Creation

1. Delete your test user from database (if exists)
2. Sign up with Google OAuth
3. Wallet should be created automatically within 2-3 seconds
4. You should see your wallet balance in the header

---

## 🌐 Domain Setup: Connect go54.com to Vercel

### Overview
- **Domain Registrar**: GoDaddy (where you bought go54.com)
- **Hosting Platform**: Vercel (where your app is deployed)
- **Cost**: FREE (no additional charges)
- **Time**: 5-10 minutes setup + 24-48 hours DNS propagation

### What is a Domain?
A domain (like `go54.com`) is your website's address on the internet. Instead of users visiting `your-app.vercel.app`, they'll visit `go54.com` - much more professional!

### Can You Switch Hosting Later?
**YES!** Your domain is separate from hosting. You can:
- Move from Vercel → Railway (FREE)
- Move from Railway → AWS (FREE)
- Move to any hosting provider (FREE)

You only pay for the domain registration (~$10-15/year to GoDaddy). Connecting it to different hosts is always free.

---

## Step-by-Step: Connect go54.com to Vercel

### Part 1: Add Domain in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Add Custom Domain**
   - Click **Settings** → **Domains**
   - Enter: `go54.com`
   - Click **Add**
   - Also add: `www.go54.com` (recommended)
   - Click **Add**

3. **Copy DNS Records**
   - Vercel will show you DNS records to add
   - Keep this page open (you'll need these values)

   Example records you'll see:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Part 2: Configure DNS in GoDaddy

1. **Login to GoDaddy**
   - Visit: https://www.godaddy.com
   - Click **Sign In**
   - Go to **My Products**

2. **Access DNS Settings**
   - Find `go54.com` in your domain list
   - Click **DNS** or **Manage DNS**

3. **Add A Record (for root domain)**
   - Click **Add** or **Add Record**
   - Select **Type**: `A`
   - **Name**: `@` (this means root domain)
   - **Value**: `76.76.21.21` (copy from Vercel)
   - **TTL**: `600` (or default)
   - Click **Save**

4. **Add CNAME Record (for www subdomain)**
   - Click **Add** or **Add Record**
   - Select **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com` (copy from Vercel)
   - **TTL**: `600` (or default)
   - Click **Save**

5. **Remove Conflicting Records (if any)**
   - If you see existing A or CNAME records for `@` or `www`, delete them
   - Only keep the new records you just added

### Part 3: Verify Domain in Vercel

1. **Return to Vercel Dashboard**
   - Go back to **Settings** → **Domains**
   - Wait 1-2 minutes for DNS to propagate

2. **Check Status**
   - You should see:
     - `go54.com` → ✅ Valid Configuration
     - `www.go54.com` → ✅ Valid Configuration
   
   - If you see ⚠️ Invalid Configuration:
     - Wait 5-10 minutes (DNS takes time)
     - Click **Refresh** button
     - Check GoDaddy DNS settings again

3. **SSL Certificate**
   - Vercel automatically provisions SSL (HTTPS)
   - This takes 1-2 minutes after domain verification
   - Your site will be secure with `https://go54.com`

---

## Part 4: Update OAuth Redirect URIs

After domain is connected, update your OAuth providers:

### Google OAuth

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   https://go54.com/api/auth/callback/google
   https://www.go54.com/api/auth/callback/google
   ```
6. Keep existing localhost URLs for development
7. Click **Save**

### Facebook OAuth (when enabled)

1. Go to: https://developers.facebook.com
2. Select your app
3. Go to **Facebook Login** → **Settings**
4. Under **Valid OAuth Redirect URIs**, add:
   ```
   https://go54.com/api/auth/callback/facebook
   https://www.go54.com/api/auth/callback/facebook
   ```
5. Click **Save Changes**

### Twitter OAuth (when enabled)

1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Select your app
3. Go to **Settings** → **Authentication settings**
4. Under **Callback URLs**, add:
   ```
   https://go54.com/api/auth/callback/twitter
   https://www.go54.com/api/auth/callback/twitter
   ```
5. Click **Save**

---

## Part 5: Update Environment Variables in Vercel

1. Go to **Settings** → **Environment Variables**
2. Update `NEXTAUTH_URL`:
   ```
   NEXTAUTH_URL = https://go54.com
   ```
3. Click **Save**
4. **Redeploy** your application

---

## Testing Your Setup

### 1. Test Domain Access
- Visit: `https://go54.com`
- Visit: `https://www.go54.com`
- Both should load your app with HTTPS (🔒 padlock icon)

### 2. Test OAuth Login
- Click **Sign In**
- Try Google OAuth
- Should redirect properly and log you in

### 3. Test Wallet Creation
- Sign up with a new Google account
- Wallet should be created automatically
- Check header for wallet balance

---

## Troubleshooting

### Domain Not Working After 24 Hours

**Check DNS Propagation:**
- Visit: https://dnschecker.org
- Enter: `go54.com`
- Should show Vercel's IP address globally

**Common Issues:**
1. **Wrong DNS Records**: Double-check A and CNAME values in GoDaddy
2. **Conflicting Records**: Remove old A/CNAME records in GoDaddy
3. **TTL Too High**: Set TTL to 600 seconds (10 minutes)

### OAuth Not Working on Custom Domain

**Symptoms:**
- OAuth works on `your-app.vercel.app`
- OAuth fails on `go54.com`

**Solution:**
1. Verify redirect URIs in Google/Facebook/Twitter console
2. Make sure `NEXTAUTH_URL` is set to `https://go54.com` in Vercel
3. Redeploy application after changes

### Wallet Creation Still Failing

**Check:**
1. Monnify environment variables are set in Vercel
2. Application was redeployed after adding variables
3. Check Vercel logs: **Deployments** → Click deployment → **Functions** tab
4. Look for Monnify authentication errors

**Test Locally:**
```bash
npm run dev
# Sign up with new account
# Check terminal for wallet creation logs
```

---

## Summary Checklist

### Immediate (Fix Wallet Creation):
- [ ] Add 4 Monnify environment variables to Vercel
- [ ] Redeploy application
- [ ] Test wallet creation with new user

### Domain Setup (Optional but Recommended):
- [ ] Add `go54.com` and `www.go54.com` in Vercel
- [ ] Configure A and CNAME records in GoDaddy
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Update OAuth redirect URIs
- [ ] Update `NEXTAUTH_URL` in Vercel
- [ ] Redeploy application
- [ ] Test domain access and OAuth

---

## Need Help?

If you encounter issues:

1. **Check Vercel Logs**:
   - Go to **Deployments** → Click latest deployment
   - Click **Functions** tab
   - Look for error messages

2. **Check Browser Console**:
   - Press F12 in browser
   - Go to **Console** tab
   - Look for error messages

3. **Test Monnify Credentials**:
   ```bash
   npm run tsx scripts/test-monnify-auth.ts
   ```

4. **Contact Support**:
   - Vercel Support: https://vercel.com/support
   - GoDaddy Support: https://www.godaddy.com/help
   - Monnify Support: https://monnify.com/contact

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Domain (go54.com) | $10-15/year | Already paid to GoDaddy |
| Vercel Hosting | FREE | Hobby plan (sufficient for most apps) |
| Domain Connection | FREE | No charge to connect domain |
| SSL Certificate | FREE | Automatic with Vercel |
| Moving to Railway | FREE | Can switch anytime |
| **Total Additional Cost** | **$0** | Only domain renewal yearly |

---

## What Happens After Setup?

1. **Users visit**: `https://go54.com`
2. **They see**: Your professional app with HTTPS
3. **They sign up**: Google OAuth works perfectly
4. **Wallet created**: Automatically within 2-3 seconds
5. **They can**: Fund wallet, buy tokens, trade

Your app will be fully functional and professional! 🚀
