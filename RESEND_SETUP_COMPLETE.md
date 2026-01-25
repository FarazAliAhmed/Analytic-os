# Resend Email Setup - Final Steps

## ✅ COMPLETED STEPS:
1. Domain added in Resend: **wtxonline.com**
2. DKIM DNS record added in GO54
3. Email sender updated to: **support@wtxonline.com**
4. Code is ready for production

---

## 🔴 REMAINING STEPS:

### Step 1: Add Remaining DNS Records in GO54

You need to add 2 more DNS records in GO54 (https://app.go54.com):

#### Record 1: SPF (TXT Record)
- **Type**: TXT
- **Name**: `send`
- **Value**: `v=spf1 include:amazonses.com ~all`
- **TTL**: 3600 (or default)

#### Record 2: DMARC (TXT Record)
- **Type**: TXT
- **Name**: `_dmarc`
- **Value**: `v=DMARC1; p=none; rua=mailto:support@wtxonline.com`
- **TTL**: 3600 (or default)

#### Record 3: MX Record (OPTIONAL - for receiving emails)
- **Type**: MX
- **Name**: `send`
- **Value**: `feedback-smtp.us-east-1.amazonses.com`
- **Priority**: 10
- **TTL**: 3600 (or default)

---

### Step 2: Get New Resend API Key

1. Go to: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Name it: `WTXONLINE Production`
4. **Copy the key** (starts with `re_`)
5. **IMPORTANT**: Save it somewhere safe - you can only see it once!

---

### Step 3: Update .env File

Once you have the new API key, tell me and I'll update the `.env` file with:
```
RESEND_API_KEY="re_YOUR_NEW_KEY_HERE"
```

---

### Step 4: Verify Domain in Resend

1. Go to: https://resend.com/domains
2. Find **wtxonline.com**
3. Click **"I've added the records"** button
4. Wait 5-30 minutes for verification
5. Status should change to **"Verified"**

---

### Step 5: Add Environment Variables to Vercel

Go to your Vercel project settings → Environment Variables and add:

| Name | Value | Environment |
|------|-------|-------------|
| `RESEND_API_KEY` | `re_YOUR_NEW_KEY` | ✅ All 3 |
| `NEXTAUTH_URL` | `https://wtxonline.com` | Production only |
| `NEXTAUTH_SECRET` | `kLpP3EW0N4EUolyZndmfbmSYasBaMhUEQRMP3QtLWF0=` | ✅ All 3 |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_LlyQd0UITs4q@ep-rapid-paper-a4sa9e19-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | ✅ All 3 |

**Note**: Monnify variables are already added ✅

---

### Step 6: Redeploy on Vercel

After adding all environment variables:
1. Go to Vercel dashboard
2. Click **"Redeploy"** or push a new commit
3. Wait for deployment to complete

---

### Step 7: Test OTP Email

1. Go to https://wtxonline.com
2. Click "Sign Up"
3. Enter email and click "Send Code"
4. Check inbox for email from **support@wtxonline.com**
5. Enter OTP code to complete signup

---

## 📝 IMPORTANT NOTES:

### About OTP Code in Development vs Production:

The code in `src/app/api/auth/send-otp/route.ts` has this logic:
```typescript
if (process.env.NODE_ENV !== 'development') {
  const emailSent = await sendOTPEmail(email, otp)
}
```

**This is CORRECT and intentional:**
- ✅ **Local development**: OTP is returned in API response (no email sent) - for testing
- ✅ **Production (Vercel)**: OTP is sent via email to user - real functionality

**You don't need to change this code!** It will automatically work in production.

---

## 🎯 QUICK CHECKLIST:

- [ ] Add SPF TXT record in GO54
- [ ] Add DMARC TXT record in GO54
- [ ] Get new Resend API key
- [ ] Update .env file with new key
- [ ] Verify domain in Resend (wait for verification)
- [ ] Add RESEND_API_KEY to Vercel
- [ ] Add NEXTAUTH_URL to Vercel
- [ ] Add NEXTAUTH_SECRET to Vercel
- [ ] Add DATABASE_URL to Vercel
- [ ] Redeploy on Vercel
- [ ] Test OTP email on production

---

## 🆘 NEED HELP?

If you get stuck on any step, let me know which step number and I'll help you!
