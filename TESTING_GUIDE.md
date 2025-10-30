# 🧪 Testing Guide - Email & EasyParcel Integration

Quick guide to test your email marketing and EasyParcel shipping integrations.

---

## 📧 **Email Integration Testing**

### **Test 1: Quick Email Test (Recommended)**

**URL:** Visit this in your browser:
```
http://localhost:5000/api/simple-smtp-test
```

**What happens:**
- Sends a test email using your SMTP credentials
- Shows success/failure message immediately
- No additional setup needed

**Expected Result:**
```json
{
  "success": true,
  "message": "Email sent successfully!",
  "messageId": "some-message-id"
}
```

---

### **Test 2: Brevo API Test**

**How to test:**
```bash
# Use curl or Postman
curl -X POST http://localhost:5000/api/test-brevo-api \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

**What happens:**
- Tests the Brevo API (not SMTP)
- Sends branded email to your specified email
- Verifies BREVO_API_KEY is working

**Expected Result:**
```json
{
  "success": true,
  "message": "Test email sent successfully via Brevo API!",
  "email": "your-email@example.com",
  "messageId": "abc123",
  "method": "Brevo API",
  "sender": "noreply@qyveofficial.com"
}
```

---

### **Test 3: All Email Templates Test**

**How to test:**
```bash
curl -X POST http://localhost:5000/api/test-all-emails \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

**What happens:**
- Sends ALL 5 email types to your email:
  1. Order Confirmation
  2. Payment Confirmation
  3. Shipping Notification
  4. Order Cancellation
  5. Refund Confirmation
- Uses real QYVE branding and templates
- You'll receive 5 professional emails!

**Expected Result:**
```json
{
  "success": true,
  "message": "All email types tested: 5/5 successful",
  "results": [
    { "type": "Order Confirmation", "success": true, "messageId": "..." },
    { "type": "Payment Confirmation", "success": true, "messageId": "..." },
    { "type": "Shipping Notification", "success": true, "messageId": "..." },
    { "type": "Order Cancellation", "success": true, "messageId": "..." },
    { "type": "Refund Confirmation", "success": true, "messageId": "..." }
  ],
  "summary": {
    "total": 5,
    "successful": 5,
    "failed": 0
  }
}
```

---

### **Test 4: Newsletter Signup Test**

**How to test:**
```bash
curl -X POST http://localhost:5000/api/test-newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "consent": true,
    "source": "marketing_banner",
    "bannerId": "test-banner-1"
  }'
```

**What happens:**
- Tests newsletter subscription flow
- Validates email format
- Simulates signup with consent tracking

**Expected Result:**
```json
{
  "success": true,
  "message": "Test subscription successful",
  "data": {
    "email": "test@example.com",
    "consent": true,
    "source": "marketing_banner",
    "subscribed": true
  }
}
```

---

## 📦 **EasyParcel Integration Testing**

### **Test 1: Connection Test**

**URL:** Visit this in your browser:
```
http://localhost:5000/api/test-easyparcel-connection
```

**What happens:**
- Checks if EASYPARCEL_API_KEY and EASYPARCEL_API_SECRET are configured
- Tests connection to EasyParcel API
- Shows which credentials are missing

**Expected Results:**

**If credentials are missing:**
```json
{
  "success": false,
  "error": "EasyParcel API credentials not configured",
  "details": {
    "apiKey": "✅ Set",
    "apiSecret": "❌ Missing"
  }
}
```

**If credentials are configured:**
```json
{
  "success": true,
  "message": "EasyParcel connection test successful!",
  "apiKey": "✅ Configured",
  "apiSecret": "✅ Configured",
  "connection": "✅ Working"
}
```

---

### **Test 2: Mock EasyParcel Test**

**URL:** Visit this in your browser:
```
http://localhost:5000/api/test-mock-easyparcel
```

**What happens:**
- Uses mock EasyParcel service (no real API calls)
- Tests shipping rate calculation
- Tests shipment creation
- No credentials needed!

**Expected Result:**
```json
{
  "success": true,
  "message": "Mock EasyParcel test completed",
  "ratesTest": {
    "success": true,
    "rates": [...]
  },
  "shipmentTest": {
    "success": true,
    "trackingNumber": "MOCK-123456789"
  }
}
```

---

## 🎯 **Quick Testing Checklist**

### **Email Testing:**
```
□ Test 1: Simple SMTP Test
  Visit: http://localhost:5000/api/simple-smtp-test
  
□ Test 2: Brevo API Test
  POST to: /api/test-brevo-api with {"email": "your-email@example.com"}
  
□ Test 3: All Email Templates
  POST to: /api/test-all-emails with {"email": "your-email@example.com"}
  Check your inbox for 5 emails!
  
□ Test 4: Newsletter Signup
  POST to: /api/test-newsletter with email and consent data
```

### **EasyParcel Testing:**
```
□ Test 1: Check Credentials
  Visit: http://localhost:5000/api/test-easyparcel-connection
  
□ Test 2: Mock Service Test
  Visit: http://localhost:5000/api/test-mock-easyparcel
```

---

## 📊 **What Each Test Tells You**

### **Email Tests:**

| Test | What It Verifies | Production Ready? |
|------|-----------------|-------------------|
| Simple SMTP Test | SMTP credentials work | ✅ Yes if successful |
| Brevo API Test | Brevo API key works | ✅ Yes if successful |
| All Email Templates | All email types send correctly | ✅ Yes if all 5 succeed |
| Newsletter Test | Signup flow works | ✅ Yes if successful |

### **EasyParcel Tests:**

| Test | What It Verifies | Production Ready? |
|------|-----------------|-------------------|
| Connection Test | API credentials configured | ⚠️ Only if both credentials set |
| Mock Test | Code logic works | ⚠️ No - doesn't test real API |

---

## 🚀 **Production Testing Strategy**

### **Email (Production Ready Now):**

1. **Development Test:**
   ```bash
   # Test all 5 email types
   curl -X POST http://localhost:5000/api/test-all-emails \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com"}'
   ```

2. **Check Your Inbox:**
   - You should receive 5 branded emails
   - All should use noreply@qyveofficial.com as sender
   - All should have QYVE branding

3. **Production Deployment:**
   - ✅ Deploy now - email will work immediately
   - Same SMTP credentials transfer automatically
   - No changes needed!

### **EasyParcel (Needs Secret):**

1. **Development Test:**
   ```bash
   # Check credentials status
   Visit: http://localhost:5000/api/test-easyparcel-connection
   ```

2. **Expected Current Result:**
   ```json
   {
     "success": false,
     "details": {
       "apiKey": "✅ Set",
       "apiSecret": "❌ Missing"
     }
   }
   ```

3. **Add Missing Secret:**
   - Add EASYPARCEL_API_SECRET to Replit Secrets
   - Re-run test
   - Should show both ✅

4. **Production Deployment:**
   - ⚠️ Only deploy after adding secret
   - Code automatically switches to production API
   - First shipment will be REAL!

---

## 💡 **Tips**

### **For Email Testing:**
- ✅ Use your real email address to see actual emails
- ✅ Check spam folder if emails don't arrive
- ✅ Test all 5 email types to verify branding
- ✅ Verify sender shows as "QYVE Team <noreply@qyveofficial.com>"

### **For EasyParcel Testing:**
- ⚠️ Mock test doesn't validate credentials
- ⚠️ Connection test needs BOTH API key and secret
- ⚠️ Production will create REAL shipments
- ⚠️ Production will charge REAL money

---

## 🔍 **Troubleshooting**

### **Email Tests Failing:**

**Error: "SMTP connection failed"**
- Check SMTP_HOST, SMTP_USER, SMTP_PASS in Replit Secrets
- Verify Brevo account is active

**Error: "Invalid API key"**
- Check BREVO_API_KEY in Replit Secrets
- Verify key is from your Brevo dashboard

**Emails not arriving:**
- Check spam folder
- Verify sender domain (noreply@qyveofficial.com) is verified in Brevo
- Check Brevo dashboard for delivery logs

### **EasyParcel Tests Failing:**

**Error: "API credentials not configured"**
- Add EASYPARCEL_API_SECRET to Replit Secrets
- Verify both API key and secret are from EasyParcel dashboard

**Error: "Connection failed"**
- Verify credentials are for correct environment (demo vs production)
- Check EasyParcel account is active

---

## 📞 **Support**

**Email Issues:**
- Check Brevo Dashboard: https://app.brevo.com/
- View email logs and delivery status
- Check sending limits

**EasyParcel Issues:**
- Check EasyParcel Dashboard
- Verify API credentials
- Ensure account is active

---

**Ready to test? Start with the simple tests and work your way up!** 🚀
