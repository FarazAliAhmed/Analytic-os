# Fix Wallet Creation - Simple Guide

## Current Status
- ✅ Domain (go54.com) is already working
- ✅ App is live at https://app.go54.com
- ✅ Google OAuth is working
- ❌ Wallet creation is failing

## The Problem
Wallet creation fails with error:
```
Monnify authentication failed (401)
```

**Cause**: Monnify environment variables are missing in Vercel.

---

## Solution (5 Minutes)

### Step 1: Login to Vercel (1 minute)

1. Go to: **https://vercel.com/dashboard**
2. Sign in with your account
3. Click on your project (the one running go54.com)

### Step 2: Open Environment Variables (1 minute)

1. Click **Settings** (left sidebar)
2. Click **Environment Variables** (left menu)
3. You'll see the Environment Variables page

### Step 3: Add 4 Monnify Variables (2 minutes)

Click **Add New** and add each variable:

#### Variable 1:
```
Name: MONNIFY_API_KEY
Value: MK_PROD_LK468XJWJE
Environment: ✅ Production ✅ Preview ✅ Development
```
Click **Save**

#### Variable 2:
```
Name: MONNIFY_SECRET_KEY
Value: 3BSS5F6F3LS7K31ZBVR8ADLKVMNXF86E
Environment: ✅ Production ✅ Preview ✅ Development
```
Click **Save**

#### Variable 3:
```
Name: MONNIFY_CONTRACT_CODE
Value: 477829380233
Environment: ✅ Production ✅ Preview ✅ Development
```
Click **Save**

#### Variable 4:
```
Name: MONNIFY_BASE_URL
Value: https://api.monnify.com
Environment: ✅ Production ✅ Preview ✅ Development
```
Click **Save**

### Step 4: Redeploy Application (1 minute)

1. Click **Deployments** (top menu)
2. Find the latest deployment
3. Click **⋯** (three dots)
4. Click **Redeploy**
5. Confirm and wait 2-3 minutes

### Step 5: Test (1 minute)

1. Go to: **https://app.go54.com**
2. Click **Sign Up**
3. Sign up with a NEW Google account
4. Wait 2-3 seconds
5. ✅ Wallet should appear in header!

---

## Verification

After completing all steps, you should see:

**In Vercel Dashboard:**
```
Environment Variables (4)

MONNIFY_API_KEY          MK_PROD_LK468XJWJE          Production, Preview, Development
MONNIFY_SECRET_KEY       3BSS5F6F3LS7K31ZBVR8...     Production, Preview, Development
MONNIFY_CONTRACT_CODE    477829380233                Production, Preview, Development
MONNIFY_BASE_URL         https://api.monnify.com     Production, Preview, Development
```

**In Your App:**
- New users get wallet automatically
- Wallet balance shows in header
- Account number visible
- No errors in console

---

## Troubleshooting

### Still Getting 401 Error?

1. **Check all 4 variables are added**
   - Go to Settings → Environment Variables
   - Count: should be 4 Monnify variables

2. **Check all environments are selected**
   - Each variable should show: "Production, Preview, Development"

3. **Verify you redeployed**
   - Go to Deployments
   - Latest deployment should be AFTER you added variables

4. **Check for typos**
   - Variable names must be EXACT (all caps, underscores)
   - Values must be EXACT (copy-paste recommended)

### Check Vercel Logs

1. Go to **Deployments**
2. Click on latest deployment
3. Click **Functions** tab
4. Look for error messages
5. Should see "[WALLET-SERVICE]" logs

---

## Summary

**What you're fixing**: Wallet creation
**What you're NOT changing**: Domain (already working)
**Time required**: 5 minutes
**Cost**: $0 (free)

After this fix:
- ✅ Every new user gets a wallet automatically
- ✅ Wallet appears in 2-3 seconds
- ✅ Users can fund wallet and buy tokens
- ✅ No more errors

---

## Need Help?

If wallet still doesn't work after following these steps:

1. Check Vercel logs (Deployments → Functions tab)
2. Check browser console (F12 → Console)
3. Verify all 4 variables are correct
4. Make sure you redeployed after adding variables

**The code is perfect - you just need to add the environment variables!** 🚀
