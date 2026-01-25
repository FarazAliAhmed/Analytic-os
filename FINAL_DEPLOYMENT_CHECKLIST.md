# Final Deployment Checklist for WTXONLINE.COM

## 🎯 OVERVIEW

Your app is ready for production! Here's what needs to be completed:

---

## ✅ COMPLETED ITEMS

- [x] Domain purchased: WTXONLINE.COM from GO54
- [x] DNS A record added: @ → 216.198.79.1
- [x] DNS CNAME record added: www → vercel
- [x] Domain added in Vercel
- [x] Monnify environment variables added to Vercel
- [x] Google OAuth client updated with wtxonline.com URLs
- [x] Resend domain added: wtxonline.com
- [x] Resend DKIM DNS record added
- [x] Email sender updated to: support@wtxonline.com
- [x] OTP code ready for production (no changes needed)
- [x] Wallet auto-creation implemented
- [x] Code deployed to Vercel

---

## 🔴 REMAINING TASKS

### TASK 1: Complete Resend DNS Setup

Go to: https://app.go54.com/dashboard

**Add Record 1: SPF**
- Type: `TXT`
- Name: `send`
- Value: `v=spf1 include:amazonses.com ~all`
- TTL: `3600`

**Add Record 2: DMARC**
- Type: `TXT`
- Name: `_dmarc`
- Value: `v=DMARC1; p=none; rua=mailto:support@wtxonline.com`
- TTL: `3600`

---

### TASK 2: Verify Resend Domain

1. Go to: https://resend.com/domains
2. Find: **wtxonline.com**
3. Click: **"I've added the records"**
4. Wait: 5-30 minutes for verification
5. Status should show: **"Verified"**

---

### TASK 3: Get Resend API Key

1. Go to: https://resend.com/api-keys
2. Click: **"Create API Key"**
3. Name: `WTXONLINE Production`
4. Copy the key (starts with `re_`)
5. **IMPORTANT**: Save it - you can only see it once!

---

### TASK 4: Update Google OAuth Consent Screen

Go to: https://console.cloud.google.com/ → OAuth consent screen → Edit App

**Update these fields:**
- App name: `WTXONLINE`
- User support email: Your email
- Application home page: `https://wtxonline.com`
- Application privacy policy: `https://wtxonline.com/privacy-policy`
- Application terms of service: `https://wtxonline.com/terms-of-use`
- Authorized domains: `wtxonline.com`
- Developer contact email: Your email

Click: **"Save and Continue"** → **"Save and Continue"** → **"Back to Dashboard"**

---

### TASK 5: Add Environment Variables to Vercel

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

**Check if these exist, if not add them:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `RESEND_API_KEY` | `re_YOUR_NEW_KEY` | ✅ All 3 |
| `NEXTAUTH_URL` | `https://wtxonline.com` | Production only |
| `NEXTAUTH_SECRET` | `kLpP3EW0N4EUolyZndmfbmSYasBaMhUEQRMP3QtLWF0=` | ✅ All 3 |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_LlyQd0UITs4q@ep-rapid-paper-a4sa9e19-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | ✅ All 3 |
| `GOOGLE_CLIENT_ID` | (already exists) | ✅ All 3 |
| `GOOGLE_CLIENT_SECRET` | (already exists) | ✅ All 3 |
| `MONNIFY_API_KEY` | (already exists) | ✅ All 3 |
| `MONNIFY_SECRET_KEY` | (already exists) | ✅ All 3 |
| `MONNIFY_CONTRACT_CODE` | (already exists) | ✅ All 3 |
| `MONNIFY_BASE_URL` | (already exists) | ✅ All 3 |

**Note**: For NEXTAUTH_URL, select "Production" only, not all environments.

---

### TASK 6: Redeploy on Vercel

After adding all environment variables:
1. Go to: Vercel Dashboard → Your Project
2. Click: **"Deployments"** tab
3. Click: **"..."** menu on latest deployment
4. Click: **"Redeploy"**
5. Wait for deployment to complete

---

### TASK 7: Test Everything on Production

**Test 1: Domain Access**
- Go to: https://wtxonline.com
- Should load the landing page ✅

**Test 2: Google OAuth Sign Up**
- Click: "Sign Up"
- Click: "Continue with Google"
- Sign in with Google
- Should redirect back and create account ✅
- Check if wallet is created automatically ✅

**Test 3: Email/Password Sign Up with OTP**
- Click: "Sign Up"
- Enter email and click "Send Code"
- Check email inbox for OTP from support@wtxonline.com ✅
- Enter OTP code
- Complete signup
- Should create account and wallet ✅

**Test 4: Wallet Functionality**
- Check if NGN wallet shows balance
- Check if wallet info displays in header ✅

**Test 5: Monnify Integration**
- Try funding wallet
- Check if Monnify account details show ✅

---

## 📋 QUICK REFERENCE

### DNS Records in GO54

| Type | Name | Value |
|------|------|-------|
| A | @ | 216.198.79.1 |
| CNAME | www | 2989d96ecfffe432.vercel-dns-017.com |
| TXT | resend._domainkey | (long DKIM key) ✅ |
| TXT | send | v=spf1 include:amazonses.com ~all |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:support@wtxonline.com |

### Important URLs

- **Domain Registrar**: https://app.go54.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com/
- **Resend Dashboard**: https://resend.com/
- **Production Site**: https://wtxonline.com

---

## 🆘 TROUBLESHOOTING

### Issue: Domain not loading
- **Solution**: Wait 10-30 minutes for DNS propagation
- **Check**: Verify DNS records in GO54
- **Check**: Verify domain status in Vercel

### Issue: Google OAuth not working
- **Solution**: Check redirect URIs in Google Console
- **Check**: Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel
- **Check**: Make sure OAuth consent screen is updated

### Issue: OTP emails not sending
- **Solution**: Verify Resend domain is verified
- **Check**: RESEND_API_KEY is added to Vercel
- **Check**: SPF and DMARC DNS records are added
- **Check**: Wait 5-30 minutes after adding DNS records

### Issue: Wallet not created automatically
- **Solution**: Check Monnify credentials in Vercel
- **Check**: Check browser console for errors
- **Check**: Verify MONNIFY_API_KEY and MONNIFY_SECRET_KEY

### Issue: 401 Monnify Authentication Error
- **Solution**: Verify all 4 Monnify environment variables are in Vercel
- **Check**: Make sure values don't have extra spaces
- **Check**: Redeploy after adding variables

---

## ✅ FINAL CHECKLIST

- [ ] Add SPF DNS record in GO54
- [ ] Add DMARC DNS record in GO54
- [ ] Verify Resend domain (wait for verification)
- [ ] Get new Resend API key
- [ ] Update Google OAuth consent screen
- [ ] Add RESEND_API_KEY to Vercel
- [ ] Add NEXTAUTH_URL to Vercel (Production only)
- [ ] Verify all other environment variables in Vercel
- [ ] Redeploy on Vercel
- [ ] Test domain access (https://wtxonline.com)
- [ ] Test Google OAuth signup
- [ ] Test email/password signup with OTP
- [ ] Test wallet creation
- [ ] Test Monnify integration

---

## 🎉 WHEN COMPLETE

Once all tasks are done:
1. Your site will be live at https://wtxonline.com
2. Users can sign up with Google OAuth
3. Users can sign up with email/password + OTP
4. Wallets are created automatically
5. OTP emails are sent from support@wtxonline.com
6. All features are working in production

---

## 📞 NEXT STEPS

After deployment is complete, you may want to:
1. Set up Google Analytics
2. Set up error monitoring (Sentry)
3. Configure backup strategy
4. Set up monitoring/alerts
5. Create admin user account
6. Test all features thoroughly
7. Prepare for user onboarding

---

**Need help with any step? Let me know which task number!**
