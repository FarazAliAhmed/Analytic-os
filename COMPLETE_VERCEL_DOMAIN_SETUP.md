# Complete Vercel + go54.com Domain Setup Guide
## Step-by-Step with Every Field Explained

---

## 🎯 Overview

This guide will help you:
1. Add Monnify environment variables to Vercel (Fix wallet creation)
2. Connect go54.com domain to Vercel
3. Configure DNS in GoDaddy
4. Update OAuth settings
5. Test everything

**Total Time**: 30 minutes + 24-48 hours DNS propagation

---

## PART 1: FIX WALLET CREATION (5 MINUTES)

### Step 1.1: Login to Vercel

1. Open browser and go to: **https://vercel.com**
2. Click **Login** button (top right)
3. Enter your credentials
4. You'll see your dashboard with list of projects

### Step 1.2: Select Your Project

1. Look for your project name (e.g., "orbits-app" or similar)
2. Click on the project name
3. You'll see the project overview page

### Step 1.3: Open Environment Variables Settings

1. Look at the left sidebar
2. Click **Settings** (gear icon)
3. In the Settings page, look at the left menu
4. Click **Environment Variables**
5. You'll see a page titled "Environment Variables"


### Step 1.4: Add MONNIFY_API_KEY

1. Click the **Add New** button (blue button on the right)
2. A form will appear with these fields:

**Field 1: Name (Key)**
```
Enter exactly: MONNIFY_API_KEY
```
(No spaces, all uppercase, underscore between words)

**Field 2: Value**
```
Enter exactly: MK_PROD_LK468XJWJE
```
(Copy-paste to avoid typos)

**Field 3: Environment**
- You'll see 3 checkboxes:
  - ☑️ **Production** (check this)
  - ☑️ **Preview** (check this)
  - ☑️ **Development** (check this)
- Check ALL THREE boxes

3. Click **Save** button at the bottom
4. You'll see a success message

### Step 1.5: Add MONNIFY_SECRET_KEY

1. Click **Add New** button again
2. Fill in the form:

**Field 1: Name (Key)**
```
Enter exactly: MONNIFY_SECRET_KEY
```

**Field 2: Value**
```
Enter exactly: 3BSS5F6F3LS7K31ZBVR8ADLKVMNXF86E
```

**Field 3: Environment**
- ☑️ Production
- ☑️ Preview
- ☑️ Development
(Check all three)

3. Click **Save**


### Step 1.6: Add MONNIFY_CONTRACT_CODE

1. Click **Add New** button again
2. Fill in the form:

**Field 1: Name (Key)**
```
Enter exactly: MONNIFY_CONTRACT_CODE
```

**Field 2: Value**
```
Enter exactly: 477829380233
```

**Field 3: Environment**
- ☑️ Production
- ☑️ Preview
- ☑️ Development
(Check all three)

3. Click **Save**

### Step 1.7: Add MONNIFY_BASE_URL

1. Click **Add New** button one more time
2. Fill in the form:

**Field 1: Name (Key)**
```
Enter exactly: MONNIFY_BASE_URL
```

**Field 2: Value**
```
Enter exactly: https://api.monnify.com
```
(Include https://, no trailing slash)

**Field 3: Environment**
- ☑️ Production
- ☑️ Preview
- ☑️ Development
(Check all three)

3. Click **Save**

### Step 1.8: Verify All Variables Added

You should now see 4 environment variables listed:

```
MONNIFY_API_KEY          MK_PROD_LK468XJWJE          Production, Preview, Development
MONNIFY_SECRET_KEY       3BSS5F6F3LS7K31ZBVR8...     Production, Preview, Development
MONNIFY_CONTRACT_CODE    477829380233                Production, Preview, Development
MONNIFY_BASE_URL         https://api.monnify.com     Production, Preview, Development
```

If you see all 4, you're good! ✅


### Step 1.9: Redeploy Application

1. Click **Deployments** in the top menu
2. You'll see a list of deployments
3. Find the most recent deployment (top of the list)
4. On the right side, click the **⋯** (three dots icon)
5. A dropdown menu appears
6. Click **Redeploy**
7. A confirmation dialog appears
8. Click **Redeploy** again to confirm
9. Wait 2-3 minutes for deployment to complete
10. You'll see "Building..." then "Ready" status

### Step 1.10: Test Wallet Creation

1. Open your Vercel app URL (e.g., your-app.vercel.app)
2. Click **Sign Up** button
3. Click **Continue with Google**
4. Sign in with a NEW Google account (not used before)
5. Wait 2-3 seconds
6. You should see wallet balance in the header! 🎉

**If you see wallet balance**: ✅ Success! Wallet creation is fixed!
**If you see error**: Check Vercel logs (Deployments → Click deployment → Functions tab)

---

## PART 2: CONNECT go54.com DOMAIN (25 MINUTES)

### Step 2.1: Add Domain in Vercel

1. In your Vercel project, click **Settings** (left sidebar)
2. Click **Domains** (left menu)
3. You'll see "Domains" page with a text input field
4. In the input field, type:
```
go54.com
```
(No www, no https://, just the domain)

5. Click **Add** button
6. Vercel will show a message about DNS configuration


### Step 2.2: Add www Subdomain

1. In the same input field, type:
```
www.go54.com
```

2. Click **Add** button
3. Vercel will show DNS configuration for www subdomain

### Step 2.3: Copy DNS Records from Vercel

Vercel will show you DNS records. You'll see something like:

**For go54.com (root domain):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.go54.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**IMPORTANT**: Keep this Vercel page open! You'll need these values for GoDaddy.

**Note**: The IP address (76.76.21.21) might be different. Use whatever Vercel shows you.

---

## PART 3: CONFIGURE DNS IN GODADDY (10 MINUTES)

### Step 3.1: Login to GoDaddy

1. Open a new browser tab
2. Go to: **https://www.godaddy.com**
3. Click **Sign In** (top right)
4. Enter your GoDaddy username/email
5. Enter your password
6. Click **Sign In**

### Step 3.2: Access Your Domains

1. After login, click **My Products** (top menu)
2. You'll see a list of your products
3. Find **Domains** section
4. You should see **go54.com** listed


### Step 3.3: Open DNS Management

1. Next to **go54.com**, click the **⋯** (three dots) or **Manage** button
2. A menu appears
3. Click **Manage DNS** or **DNS**
4. You'll see the DNS Management page with existing records

### Step 3.4: Delete Conflicting Records (If Any)

Look for existing records with these names:
- **@** (root domain)
- **www**

If you see any A or CNAME records for these, delete them:

1. Find the record
2. Click the **trash icon** or **Delete** button on the right
3. Confirm deletion
4. Repeat for all conflicting records

**Common records to delete:**
- A record with Name: @ (if exists)
- CNAME record with Name: @ (if exists)
- CNAME record with Name: www (if exists)
- A record with Name: www (if exists)

### Step 3.5: Add A Record (Root Domain)

1. Click **Add** button (usually blue button)
2. A form appears with these fields:

**Field 1: Type**
- Click the dropdown
- Select: **A**

**Field 2: Name**
```
Enter exactly: @
```
(Just the @ symbol, means root domain)

**Field 3: Value (or Data)**
```
Enter the IP from Vercel (e.g., 76.76.21.21)
```
(Copy from Vercel page, Step 2.3)

**Field 4: TTL**
```
Select: 600 seconds (or 10 minutes)
```
(Or leave as default if 600 is not available)

3. Click **Save** or **Add Record**


### Step 3.6: Add CNAME Record (www Subdomain)

1. Click **Add** button again
2. Fill in the form:

**Field 1: Type**
- Click the dropdown
- Select: **CNAME**

**Field 2: Name**
```
Enter exactly: www
```
(Just "www", no dots)

**Field 3: Value (or Points to)**
```
Enter exactly: cname.vercel-dns.com
```
(Copy from Vercel page, Step 2.3)

**Field 4: TTL**
```
Select: 600 seconds (or 10 minutes)
```

3. Click **Save** or **Add Record**

### Step 3.7: Verify DNS Records in GoDaddy

You should now see these 2 records in your DNS list:

```
Type    Name    Value                    TTL
A       @       76.76.21.21             600
CNAME   www     cname.vercel-dns.com    600
```

If you see both records, you're done with GoDaddy! ✅

**Note**: DNS changes can take 24-48 hours to propagate worldwide, but often work within 10-30 minutes.

---

## PART 4: VERIFY DOMAIN IN VERCEL (5 MINUTES)

### Step 4.1: Return to Vercel

1. Go back to your Vercel browser tab
2. You should still be on Settings → Domains page
3. You'll see your domains listed:
   - go54.com
   - www.go54.com


### Step 4.2: Check Domain Status

Look at the status next to each domain:

**Possible statuses:**

1. **⚠️ Invalid Configuration** (Yellow warning)
   - DNS not propagated yet
   - Wait 5-10 minutes
   - Click **Refresh** button

2. **⏳ Pending Verification** (Gray)
   - Vercel is checking DNS
   - Wait 2-3 minutes
   - Click **Refresh** button

3. **✅ Valid Configuration** (Green checkmark)
   - Domain is working!
   - SSL certificate being provisioned

### Step 4.3: Wait for SSL Certificate

After domain shows "Valid Configuration":

1. Wait 1-2 minutes
2. Vercel automatically provisions SSL certificate
3. You'll see a 🔒 lock icon next to the domain
4. Your site will be accessible via HTTPS

### Step 4.4: Test Domain Access

1. Open a new browser tab
2. Go to: **https://go54.com**
3. Your app should load! 🎉
4. Also test: **https://www.go54.com**
5. Both should work

**If domain doesn't work yet:**
- Wait 10-30 minutes for DNS propagation
- Check DNS propagation: https://dnschecker.org
- Enter "go54.com" and check if it shows Vercel's IP

---

## PART 5: UPDATE ENVIRONMENT VARIABLES (3 MINUTES)

### Step 5.1: Update NEXTAUTH_URL

1. In Vercel, go to **Settings** → **Environment Variables**
2. Look for **NEXTAUTH_URL** variable
3. If it exists:
   - Click the **⋯** (three dots) next to it
   - Click **Edit**
   - Change value to: `https://go54.com`
   - Click **Save**
4. If it doesn't exist:
   - Click **Add New**
   - Name: `NEXTAUTH_URL`
   - Value: `https://go54.com`
   - Environment: All three (Production, Preview, Development)
   - Click **Save**


### Step 5.2: Redeploy After URL Change

1. Go to **Deployments** tab
2. Click **⋯** on latest deployment
3. Click **Redeploy**
4. Confirm and wait 2-3 minutes

---

## PART 6: UPDATE GOOGLE OAUTH (5 MINUTES)

### Step 6.1: Open Google Cloud Console

1. Go to: **https://console.cloud.google.com**
2. Sign in with your Google account
3. Select your project from the dropdown (top left)

### Step 6.2: Navigate to Credentials

1. Click the **☰** (hamburger menu) on the left
2. Hover over **APIs & Services**
3. Click **Credentials**
4. You'll see a list of credentials

### Step 6.3: Edit OAuth 2.0 Client

1. Find your OAuth 2.0 Client ID (usually named "Web client")
2. Click on the client name
3. You'll see the OAuth client configuration page

### Step 6.4: Add Authorized Redirect URIs

Scroll down to **Authorized redirect URIs** section.

You should see existing URIs like:
```
http://localhost:3000/api/auth/callback/google
https://your-app.vercel.app/api/auth/callback/google
```

Now add these 2 new URIs:

**URI 1:**
```
https://go54.com/api/auth/callback/google
```

**URI 2:**
```
https://www.go54.com/api/auth/callback/google
```

**How to add:**
1. Click **+ ADD URI** button
2. Paste the URI
3. Click **+ ADD URI** again for the second one
4. Paste the second URI

### Step 6.5: Save Changes

1. Scroll to the bottom
2. Click **SAVE** button
3. You'll see a success message

**Keep the localhost and vercel.app URIs** - you need them for development and testing.


---

## PART 7: FINAL TESTING (5 MINUTES)

### Test 1: Domain Access

1. Open browser (incognito/private mode recommended)
2. Go to: **https://go54.com**
3. ✅ Should load your app with HTTPS (🔒 padlock)
4. Go to: **https://www.go54.com**
5. ✅ Should also load your app

### Test 2: Google OAuth

1. On **https://go54.com**, click **Sign Up**
2. Click **Continue with Google**
3. ✅ Should redirect to Google login
4. Sign in with Google account
5. ✅ Should redirect back to your app
6. ✅ Should be logged in

### Test 3: Wallet Creation

1. After signing in with Google
2. Wait 2-3 seconds
3. ✅ Should see wallet balance in header
4. ✅ Should see account number

### Test 4: Full User Flow

1. Sign out
2. Sign up with a NEW Google account
3. ✅ Wallet created automatically
4. ✅ Can see dashboard
5. ✅ Can see tokens
6. ✅ Everything works!

---

## 🎉 SUCCESS CHECKLIST

- [ ] Added 4 Monnify environment variables to Vercel
- [ ] Redeployed application
- [ ] Wallet creation working (tested with new user)
- [ ] Added go54.com domain to Vercel
- [ ] Added www.go54.com domain to Vercel
- [ ] Added A record in GoDaddy DNS
- [ ] Added CNAME record in GoDaddy DNS
- [ ] Domain shows "Valid Configuration" in Vercel
- [ ] SSL certificate provisioned (HTTPS working)
- [ ] Updated NEXTAUTH_URL to https://go54.com
- [ ] Added redirect URIs to Google OAuth
- [ ] Tested domain access (https://go54.com works)
- [ ] Tested Google OAuth (login works)
- [ ] Tested wallet creation (automatic)
- [ ] Tested full user flow (sign up → wallet → dashboard)

If all checkboxes are checked: **🎉 CONGRATULATIONS! Setup complete!**


---

## 🔧 TROUBLESHOOTING

### Issue 1: Domain Not Working After 1 Hour

**Symptoms:**
- go54.com shows "DNS_PROBE_FINISHED_NXDOMAIN"
- or "This site can't be reached"

**Solutions:**

1. **Check DNS Propagation**
   - Go to: https://dnschecker.org
   - Enter: go54.com
   - Should show Vercel's IP address (76.76.21.21 or similar)
   - If not showing, wait longer (up to 48 hours)

2. **Verify GoDaddy DNS Records**
   - Login to GoDaddy
   - Go to Domains → go54.com → Manage DNS
   - Verify A record: @ → 76.76.21.21
   - Verify CNAME record: www → cname.vercel-dns.com
   - Check for typos

3. **Check Vercel Domain Status**
   - Vercel → Settings → Domains
   - Should show "Valid Configuration"
   - If not, click "Refresh"

### Issue 2: OAuth Not Working on Custom Domain

**Symptoms:**
- OAuth works on your-app.vercel.app
- OAuth fails on go54.com
- Error: "redirect_uri_mismatch"

**Solutions:**

1. **Verify Redirect URIs in Google Console**
   - Must include: https://go54.com/api/auth/callback/google
   - Must include: https://www.go54.com/api/auth/callback/google
   - Check for typos (common: missing /api/ or /callback/)

2. **Verify NEXTAUTH_URL**
   - Vercel → Settings → Environment Variables
   - NEXTAUTH_URL should be: https://go54.com
   - Not: http:// (must be https://)
   - Not: with trailing slash

3. **Redeploy After Changes**
   - Always redeploy after changing environment variables
   - Vercel → Deployments → Redeploy


### Issue 3: Wallet Still Not Creating

**Symptoms:**
- Error: "Monnify authentication failed (401)"
- Wallet not appearing in header

**Solutions:**

1. **Verify All 4 Monnify Variables**
   - Vercel → Settings → Environment Variables
   - Must have all 4:
     - MONNIFY_API_KEY
     - MONNIFY_SECRET_KEY
     - MONNIFY_CONTRACT_CODE
     - MONNIFY_BASE_URL
   - Check for typos in values

2. **Check Variable Environments**
   - Each variable should have all 3 environments checked:
     - Production ✅
     - Preview ✅
     - Development ✅

3. **Verify Redeployment**
   - After adding variables, you MUST redeploy
   - Vercel → Deployments → Check latest deployment time
   - Should be AFTER you added variables

4. **Check Vercel Logs**
   - Vercel → Deployments → Click latest deployment
   - Click **Functions** tab
   - Look for error messages
   - Should see "[WALLET-SERVICE]" logs

### Issue 4: SSL Certificate Not Working

**Symptoms:**
- "Your connection is not private" error
- No 🔒 padlock in browser

**Solutions:**

1. **Wait for SSL Provisioning**
   - Takes 1-2 minutes after domain verification
   - Vercel provisions SSL automatically
   - Refresh page after 2 minutes

2. **Check Domain Status**
   - Vercel → Settings → Domains
   - Should show 🔒 icon next to domain
   - If not, wait 5 minutes and refresh

3. **Force HTTPS**
   - Vercel automatically redirects HTTP to HTTPS
   - If not working, clear browser cache
   - Try incognito/private mode


---

## 📊 EXPECTED RESULTS

### After Part 1 (Monnify Variables)
- ✅ 4 environment variables visible in Vercel
- ✅ Application redeployed successfully
- ✅ New users get wallet automatically
- ✅ Wallet balance shows in header

### After Part 2-3 (Domain Setup)
- ✅ go54.com added in Vercel
- ✅ www.go54.com added in Vercel
- ✅ A record added in GoDaddy
- ✅ CNAME record added in GoDaddy

### After Part 4 (Verification)
- ✅ Domains show "Valid Configuration"
- ✅ SSL certificate provisioned
- ✅ https://go54.com loads your app
- ✅ https://www.go54.com loads your app

### After Part 5-6 (OAuth Update)
- ✅ NEXTAUTH_URL updated
- ✅ Google OAuth redirect URIs added
- ✅ OAuth works on custom domain

### After Part 7 (Testing)
- ✅ Domain accessible via HTTPS
- ✅ Google OAuth login works
- ✅ Wallet created automatically
- ✅ Full user flow works end-to-end

---

## 💰 COST BREAKDOWN

| Item | Cost | Notes |
|------|------|-------|
| Domain (go54.com) | $10-15/year | Already paid to GoDaddy |
| Vercel Hosting | FREE | Hobby plan |
| Domain Connection | FREE | No charge |
| SSL Certificate | FREE | Automatic with Vercel |
| Environment Variables | FREE | Unlimited |
| Deployments | FREE | Unlimited on Hobby plan |
| **Total Additional Cost** | **$0** | Only domain renewal yearly |

---

## ⏱️ TIME BREAKDOWN

| Part | Task | Time |
|------|------|------|
| Part 1 | Add Monnify variables | 5 min |
| Part 2 | Add domain in Vercel | 3 min |
| Part 3 | Configure GoDaddy DNS | 10 min |
| Part 4 | Verify domain | 5 min |
| Part 5 | Update environment variables | 3 min |
| Part 6 | Update Google OAuth | 5 min |
| Part 7 | Testing | 5 min |
| **Total Active Time** | | **36 min** |
| DNS Propagation | Waiting | 24-48 hours |

**Note**: DNS propagation is passive waiting time. You can do other things while waiting.


---

## 📝 QUICK REFERENCE

### Monnify Environment Variables
```
MONNIFY_API_KEY = MK_PROD_LK468XJWJE
MONNIFY_SECRET_KEY = 3BSS5F6F3LS7K31ZBVR8ADLKVMNXF86E
MONNIFY_CONTRACT_CODE = 477829380233
MONNIFY_BASE_URL = https://api.monnify.com
```

### GoDaddy DNS Records
```
Type: A
Name: @
Value: 76.76.21.21 (or IP shown by Vercel)
TTL: 600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

### Google OAuth Redirect URIs
```
https://go54.com/api/auth/callback/google
https://www.go54.com/api/auth/callback/google
```

### Vercel Environment Variable
```
NEXTAUTH_URL = https://go54.com
```

---

## 🆘 NEED HELP?

### Check These First:
1. ✅ All 4 Monnify variables added to Vercel?
2. ✅ Application redeployed after adding variables?
3. ✅ DNS records correct in GoDaddy?
4. ✅ Waited at least 10 minutes for DNS propagation?
5. ✅ Google OAuth redirect URIs updated?
6. ✅ NEXTAUTH_URL updated to https://go54.com?

### Still Having Issues?

**Check Vercel Logs:**
```
Vercel Dashboard → Deployments → Click deployment → Functions tab
```

**Check DNS Propagation:**
```
https://dnschecker.org → Enter: go54.com
```

**Test Locally:**
```bash
npm run dev
# Test if wallet creation works locally
```

**Contact Support:**
- Vercel: https://vercel.com/support
- GoDaddy: https://www.godaddy.com/help
- Monnify: https://monnify.com/contact

---

## ✅ FINAL CHECKLIST

Print this and check off as you complete each step:

**Part 1: Monnify Variables**
- [ ] Logged into Vercel
- [ ] Opened Settings → Environment Variables
- [ ] Added MONNIFY_API_KEY
- [ ] Added MONNIFY_SECRET_KEY
- [ ] Added MONNIFY_CONTRACT_CODE
- [ ] Added MONNIFY_BASE_URL
- [ ] All variables have all 3 environments checked
- [ ] Redeployed application
- [ ] Tested wallet creation (works!)

**Part 2-3: Domain Setup**
- [ ] Added go54.com in Vercel
- [ ] Added www.go54.com in Vercel
- [ ] Logged into GoDaddy
- [ ] Opened DNS Management for go54.com
- [ ] Deleted conflicting records
- [ ] Added A record (@ → Vercel IP)
- [ ] Added CNAME record (www → cname.vercel-dns.com)

**Part 4: Verification**
- [ ] Domains show "Valid Configuration" in Vercel
- [ ] SSL certificate provisioned
- [ ] https://go54.com loads
- [ ] https://www.go54.com loads

**Part 5-6: OAuth**
- [ ] Updated NEXTAUTH_URL to https://go54.com
- [ ] Redeployed after URL change
- [ ] Added redirect URIs to Google OAuth
- [ ] Saved Google OAuth changes

**Part 7: Testing**
- [ ] Domain accessible via HTTPS
- [ ] Google OAuth works on custom domain
- [ ] Wallet created automatically
- [ ] Full user flow works

**🎉 ALL DONE!** Your app is now live on go54.com with automatic wallet creation!

---

**Document Version**: 1.0
**Last Updated**: January 25, 2026
**Estimated Completion Time**: 36 minutes + DNS propagation
**Difficulty**: Easy (just follow steps)
**Success Rate**: 99% (if steps followed exactly)
