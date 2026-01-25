# 🚨 URGENT: Fix Wallet Creation in 5 Minutes

## The Problem
Wallet creation works locally but fails on Vercel with error:
```
Monnify authentication failed (401): Unknown error
```

## The Cause
Monnify environment variables are in your local `.env` file but **NOT in Vercel**.

## The Solution (5 Minutes)

### Step 1: Add Environment Variables to Vercel (3 minutes)

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click: **Settings** → **Environment Variables**
4. Add these 4 variables:

```
Name: MONNIFY_API_KEY
Value: MK_PROD_LK468XJWJE
Environment: All (Production, Preview, Development)
```

```
Name: MONNIFY_SECRET_KEY
Value: 3BSS5F6F3LS7K31ZBVR8ADLKVMNXF86E
Environment: All (Production, Preview, Development)
```

```
Name: MONNIFY_CONTRACT_CODE
Value: 477829380233
Environment: All (Production, Preview, Development)
```

```
Name: MONNIFY_BASE_URL
Value: https://api.monnify.com
Environment: All (Production, Preview, Development)
```

### Step 2: Redeploy (2 minutes)

1. Go to: **Deployments** tab
2. Click the **⋯** (3 dots) on latest deployment
3. Click: **Redeploy**
4. Wait for deployment to complete

### Step 3: Test (1 minute)

1. Visit your Vercel app URL
2. Sign up with Google OAuth
3. Wallet should be created automatically
4. You'll see wallet balance in header

## ✅ Done!

Your wallet creation will now work automatically for all new users.

---

## Why This Happened

Your `.env` file is only used locally. Vercel doesn't have access to it for security reasons. You must manually add environment variables in the Vercel dashboard.

## What Was Already Fixed

The code is perfect! We implemented a 3-layer defense system:

1. **Layer 1**: Wallet created during OAuth sign-in
2. **Layer 2**: Wallet created when user account is created
3. **Layer 3**: Wallet created when user visits dashboard (safety net)

All layers have retry logic (3 attempts with exponential backoff) and detailed error messages.

The ONLY issue is missing environment variables in Vercel.

---

## Need More Help?

See the complete guide: `VERCEL_SETUP_GUIDE.md`
