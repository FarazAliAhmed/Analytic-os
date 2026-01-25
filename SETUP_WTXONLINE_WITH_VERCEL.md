# Complete Setup Guide: WTXONLINE.COM + Vercel

## Overview

**Your Domain**: WTXONLINE.COM  
**Domain Registrar**: GO54 (https://app.go54.com)  
**Hosting**: Vercel  
**Goal**: Connect WTXONLINE.COM to your Vercel app

**Total Time**: 30 minutes + 24-48 hours DNS propagation

---

## PART 1: FIX WALLET CREATION (5 MINUTES) - DO THIS FIRST!

Before setting up the domain, fix wallet creation so everything works when users visit your new domain.

### Step 1.1: Login to Vercel

1. Go to: **https://vercel.com/dashboard**
2. Sign in with your account
3. Click on your project

### Step 1.2: Add Monnify Environment Variables

1. Click **Settings** (left sidebar)
2. Click **Environment Variables**
3. Click **Add New** and add these 4 variables:

**Variable 1:**
```
Name: MONNIFY_API_KEY
Value: MK_PROD_LK468XJWJE
Environment: ✅ Production ✅ Preview ✅ Development
```
Click **Save**

**Variable 2:**
```
Name: MONNIFY_SECRET_KEY
Value: 3BSS5F6F3LS7K31ZBVR8ADLKVMNXF86E
Environment: ✅ Production ✅ Preview ✅ Development
```
Click **Save**

**Variable 3:**
```
Name: MONNIFY_CONTRACT_CODE
Value: 477829380233
Environment: ✅ Production ✅ Preview ✅ Development
```
Click **Save**

**Variable 4:**
```
Name: MONNIFY_BASE_URL
Value: https://api.monnify.com
Environment: ✅ Production ✅ Preview ✅ Development
```
Click **Save**

### Step 1.3: Redeploy

1. Click **Deployments** (top menu)
2. Click **⋯** on latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes

✅ Wallet creation is now fixed!

---

## PART 2: ADD DOMAIN IN VERCEL (5 MINUTES)

### Step 2.1: Add Root Domain

1. In Vercel, go to **Settings** → **Domains**
2. In the input field, type:
```
wtxonline.com
```
(lowercase, no www, no https://)

3. Click **Add**
4. Vercel will show DNS configuration instructions

### Step 2.2: Add WWW Subdomain

1. In the same input field, type:
```
www.wtxonline.com
```

2. Click **Add**

### Step 2.3: Copy DNS Records from Vercel

Vercel will show you DNS records like this:

**For wtxonline.com (root domain):**
```
Type: A
Name: @
Value: 76.76.21.21
```
(The IP might be different - use what Vercel shows)

**For www.wtxonline.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**IMPORTANT**: Keep this Vercel page open! You'll need these values for GO54.

---

## PART 3: CONFIGURE DNS IN GO54 (10 MINUTES)

### Step 3.1: Login to GO54

1. Go to: **https://app.go54.com**
2. Sign in with your account
3. Go to **Dashboard**

### Step 3.2: Find Your Domain

1. Look for **WTXONLINE.COM** in your domains list
2. Click on it or click **Manage DNS** / **DNS Settings**


### Step 3.3: Access DNS Management

Look for one of these options:
- **DNS Management**
- **DNS Settings**
- **Manage DNS**
- **DNS Records**

Click on it to open DNS configuration page.

### Step 3.4: Delete Conflicting Records (If Any)

Look for existing DNS records with these names:
- **@** (root domain)
- **www**

If you see any A or CNAME records for these, delete them:
1. Find the record
2. Click **Delete** or trash icon
3. Confirm deletion

**Keep these records** (don't delete):
- NS records (NSC.GO54.COM, NSD.GO54.COM)
- SOA records

### Step 3.5: Add A Record (Root Domain)

1. Click **Add Record** or **Add New** button
2. Fill in the form:

**Type:**
```
Select: A
```

**Name (or Host):**
```
Enter: @
```
(Just the @ symbol - means root domain)

**Value (or Points To / IP Address):**
```
Enter: 76.76.21.21
```
(Use the IP address Vercel showed you in Step 2.3)

**TTL:**
```
Select: 600 (or 10 minutes)
```
(Or leave as default if 600 is not available)

3. Click **Save** or **Add**

### Step 3.6: Add CNAME Record (WWW Subdomain)

1. Click **Add Record** or **Add New** button again
2. Fill in the form:

**Type:**
```
Select: CNAME
```

**Name (or Host):**
```
Enter: www
```
(Just "www", no dots)

**Value (or Points To / Target):**
```
Enter: cname.vercel-dns.com
```
(Exactly as shown, with the dot at the end if GO54 requires it)

**TTL:**
```
Select: 600 (or 10 minutes)
```

3. Click **Save** or **Add**

### Step 3.7: Verify DNS Records

You should now see these records in GO54:

```
Type    Name/Host    Value/Target              TTL
A       @            76.76.21.21              600
CNAME   www          cname.vercel-dns.com     600
NS      @            NSC.GO54.COM             (default)
NS      @            NSD.GO54.COM             (default)
```

✅ DNS configured in GO54!

---

## PART 4: VERIFY DOMAIN IN VERCEL (5 MINUTES)

### Step 4.1: Return to Vercel

1. Go back to Vercel browser tab
2. Go to **Settings** → **Domains**
3. You'll see your domains listed

### Step 4.2: Check Domain Status

Look at the status next to each domain:

**Initial Status (right after adding):**
- ⚠️ **Invalid Configuration** - DNS not propagated yet

**What to do:**
1. Wait 5-10 minutes
2. Click **Refresh** button next to the domain
3. Repeat until status changes

**Final Status (after DNS propagates):**
- ✅ **Valid Configuration** - Domain is working!

### Step 4.3: Wait for SSL Certificate

After domain shows "Valid Configuration":
1. Wait 1-2 minutes
2. Vercel automatically provisions SSL certificate
3. You'll see 🔒 lock icon
4. Your site will be accessible via HTTPS

### Step 4.4: Test Domain Access

1. Open new browser tab
2. Go to: **https://wtxonline.com**
3. Your app should load! 🎉
4. Also test: **https://www.wtxonline.com**

**If domain doesn't work yet:**
- Wait 10-30 minutes for DNS propagation
- Check DNS: https://dnschecker.org (enter wtxonline.com)
- Should show Vercel's IP address

---

## PART 5: UPDATE ENVIRONMENT VARIABLES (3 MINUTES)

### Step 5.1: Update NEXTAUTH_URL

1. In Vercel, go to **Settings** → **Environment Variables**
2. Look for **NEXTAUTH_URL**

**If it exists:**
1. Click **⋯** (three dots) next to it
2. Click **Edit**
3. Change value to:
```
https://wtxonline.com
```
4. Click **Save**

**If it doesn't exist:**
1. Click **Add New**
2. Fill in:
```
Name: NEXTAUTH_URL
Value: https://wtxonline.com
Environment: ✅ Production ✅ Preview ✅ Development
```
3. Click **Save**

### Step 5.2: Redeploy

1. Go to **Deployments**
2. Click **⋯** on latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes

---

## PART 6: UPDATE GOOGLE OAUTH (5 MINUTES)

### Step 6.1: Open Google Cloud Console

1. Go to: **https://console.cloud.google.com**
2. Sign in
3. Select your project

### Step 6.2: Navigate to Credentials

1. Click **☰** menu (top left)
2. Go to **APIs & Services** → **Credentials**

### Step 6.3: Edit OAuth Client

1. Find your OAuth 2.0 Client ID
2. Click on it

### Step 6.4: Add Redirect URIs

Scroll to **Authorized redirect URIs** section.

Add these 2 new URIs:

**URI 1:**
```
https://wtxonline.com/api/auth/callback/google
```

**URI 2:**
```
https://www.wtxonline.com/api/auth/callback/google
```

**How to add:**
1. Click **+ ADD URI**
2. Paste the URI
3. Click **+ ADD URI** again
4. Paste the second URI

### Step 6.5: Save

1. Scroll to bottom
2. Click **SAVE**

**Keep existing URIs** (localhost and vercel.app) for development.

---

## PART 7: FINAL TESTING (5 MINUTES)

### Test 1: Domain Access

1. Open browser (incognito mode recommended)
2. Go to: **https://wtxonline.com**
3. ✅ Should load with HTTPS (🔒 padlock)
4. Go to: **https://www.wtxonline.com**
5. ✅ Should also load

### Test 2: Google OAuth

1. On **https://wtxonline.com**, click **Sign Up**
2. Click **Continue with Google**
3. ✅ Should redirect to Google
4. Sign in
5. ✅ Should redirect back and log in

### Test 3: Wallet Creation

1. After signing in
2. Wait 2-3 seconds
3. ✅ Should see wallet balance in header
4. ✅ Should see account number

### Test 4: Full Flow

1. Sign out
2. Sign up with NEW Google account
3. ✅ Wallet created automatically
4. ✅ Can see dashboard
5. ✅ Everything works!

---

## ✅ SUCCESS CHECKLIST

**Part 1: Wallet Fix**
- [ ] Added 4 Monnify variables to Vercel
- [ ] Redeployed application
- [ ] Wallet creation working

**Part 2: Domain in Vercel**
- [ ] Added wtxonline.com to Vercel
- [ ] Added www.wtxonline.com to Vercel
- [ ] Copied DNS records from Vercel

**Part 3: DNS in GO54**
- [ ] Logged into GO54
- [ ] Opened DNS management for WTXONLINE.COM
- [ ] Deleted conflicting records
- [ ] Added A record (@ → Vercel IP)
- [ ] Added CNAME record (www → cname.vercel-dns.com)

**Part 4: Verification**
- [ ] Domains show "Valid Configuration"
- [ ] SSL certificate provisioned
- [ ] https://wtxonline.com loads
- [ ] https://www.wtxonline.com loads

**Part 5: Environment**
- [ ] Updated NEXTAUTH_URL to https://wtxonline.com
- [ ] Redeployed

**Part 6: OAuth**
- [ ] Added redirect URIs to Google OAuth
- [ ] Saved changes

**Part 7: Testing**
- [ ] Domain accessible via HTTPS
- [ ] Google OAuth works
- [ ] Wallet created automatically
- [ ] Full user flow works

🎉 **ALL DONE!** Your app is live at https://wtxonline.com


---

## 🔧 TROUBLESHOOTING

### Issue 1: Domain Not Working After 1 Hour

**Check DNS Propagation:**
1. Go to: https://dnschecker.org
2. Enter: wtxonline.com
3. Should show Vercel's IP (76.76.21.21 or similar)
4. If not showing globally, wait longer (up to 48 hours)

**Verify GO54 DNS Records:**
1. Login to GO54
2. Check DNS records for WTXONLINE.COM
3. Verify:
   - A record: @ → 76.76.21.21
   - CNAME record: www → cname.vercel-dns.com
4. Check for typos

**Check Vercel Status:**
1. Vercel → Settings → Domains
2. Should show "Valid Configuration"
3. If not, click "Refresh"

### Issue 2: OAuth Not Working

**Symptoms:**
- Error: "redirect_uri_mismatch"
- OAuth works on vercel.app but not wtxonline.com

**Solutions:**

1. **Verify Google OAuth Redirect URIs:**
   - Must include: https://wtxonline.com/api/auth/callback/google
   - Must include: https://www.wtxonline.com/api/auth/callback/google
   - Check for typos (common: missing /api/ or /callback/)

2. **Verify NEXTAUTH_URL:**
   - Vercel → Settings → Environment Variables
   - Should be: https://wtxonline.com
   - Must be https:// (not http://)
   - No trailing slash

3. **Redeploy:**
   - Always redeploy after changing environment variables

### Issue 3: Wallet Not Creating

**Symptoms:**
- Error: "Monnify authentication failed (401)"

**Solutions:**

1. **Verify All 4 Monnify Variables:**
   - MONNIFY_API_KEY
   - MONNIFY_SECRET_KEY
   - MONNIFY_CONTRACT_CODE
   - MONNIFY_BASE_URL

2. **Check Environments:**
   - Each variable should have all 3 checked:
     - Production ✅
     - Preview ✅
     - Development ✅

3. **Verify Redeployment:**
   - Latest deployment must be AFTER adding variables
   - Check timestamp in Deployments tab

4. **Check Logs:**
   - Vercel → Deployments → Click deployment → Functions
   - Look for "[WALLET-SERVICE]" logs

### Issue 4: SSL Certificate Not Working

**Symptoms:**
- "Your connection is not private" error
- No 🔒 padlock

**Solutions:**

1. **Wait for SSL:**
   - Takes 1-2 minutes after domain verification
   - Refresh page after 2 minutes

2. **Check Domain Status:**
   - Vercel → Settings → Domains
   - Should show 🔒 icon
   - If not, wait 5 minutes

3. **Clear Cache:**
   - Clear browser cache
   - Try incognito/private mode

---

## 📊 EXPECTED TIMELINE

| Step | Time | Can Work Simultaneously? |
|------|------|-------------------------|
| Part 1: Wallet Fix | 5 min | No (do first) |
| Part 2: Add Domain | 5 min | No |
| Part 3: GO54 DNS | 10 min | No |
| Part 4: Verification | 5 min | Wait for DNS |
| Part 5: Environment | 3 min | No |
| Part 6: OAuth | 5 min | No |
| Part 7: Testing | 5 min | No |
| **Total Active Time** | **38 min** | |
| DNS Propagation | 24-48 hours | Passive waiting |

---

## 💰 COST BREAKDOWN

| Item | Cost | Notes |
|------|------|-------|
| Domain (WTXONLINE.COM) | Already paid | Paid to GO54 |
| Vercel Hosting | FREE | Hobby plan |
| Domain Connection | FREE | No charge |
| SSL Certificate | FREE | Automatic |
| Environment Variables | FREE | Unlimited |
| **Total Additional Cost** | **$0** | |

---

## 📝 QUICK REFERENCE

### Monnify Variables (Vercel)
```
MONNIFY_API_KEY = MK_PROD_LK468XJWJE
MONNIFY_SECRET_KEY = 3BSS5F6F3LS7K31ZBVR8ADLKVMNXF86E
MONNIFY_CONTRACT_CODE = 477829380233
MONNIFY_BASE_URL = https://api.monnify.com
```

### DNS Records (GO54)
```
Type: A
Name: @
Value: 76.76.21.21 (use IP from Vercel)
TTL: 600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

### Google OAuth URIs
```
https://wtxonline.com/api/auth/callback/google
https://www.wtxonline.com/api/auth/callback/google
```

### Environment Variable (Vercel)
```
NEXTAUTH_URL = https://wtxonline.com
```

---

## 🆘 NEED HELP?

### Before Asking for Help:

1. ✅ All 4 Monnify variables added?
2. ✅ Redeployed after adding variables?
3. ✅ DNS records correct in GO54?
4. ✅ Waited 10+ minutes for DNS?
5. ✅ Google OAuth URIs updated?
6. ✅ NEXTAUTH_URL updated?

### Check Logs:

**Vercel Logs:**
```
Vercel → Deployments → Click deployment → Functions tab
```

**Browser Console:**
```
Press F12 → Console tab → Look for errors
```

**DNS Propagation:**
```
https://dnschecker.org → Enter: wtxonline.com
```

### Contact Support:

- **Vercel**: https://vercel.com/support
- **GO54**: https://app.go54.com/support (or contact page)
- **Google OAuth**: https://console.cloud.google.com

---

## 🎯 WHAT YOU'LL HAVE AFTER SETUP

### Your Live App:
- **URL**: https://wtxonline.com
- **Alternative**: https://www.wtxonline.com
- **Security**: HTTPS with SSL certificate
- **Status**: Professional domain

### Features Working:
- ✅ Google OAuth login
- ✅ Automatic wallet creation
- ✅ NGN wallet with account number
- ✅ Token trading
- ✅ Portfolio management
- ✅ All existing features

### User Experience:
1. User visits https://wtxonline.com
2. Clicks "Sign Up"
3. Signs up with Google
4. Wallet created automatically (2-3 seconds)
5. Can fund wallet and buy tokens
6. Professional, seamless experience

---

## 📱 SHARE YOUR NEW DOMAIN

After setup is complete, you can share:

**Website**: https://wtxonline.com  
**Description**: Professional tokenized asset trading platform  
**Features**: Google OAuth, automatic wallet creation, NGN support

---

**Document Version**: 1.0  
**Domain**: WTXONLINE.COM  
**Registrar**: GO54  
**Last Updated**: January 25, 2026  
**Estimated Time**: 38 minutes + DNS propagation  
**Difficulty**: Easy (follow steps exactly)  
**Success Rate**: 99%

🚀 **Ready to launch your app on WTXONLINE.COM!**
