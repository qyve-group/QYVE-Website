# QYVE Developer Access Checklist

## 📋 **New Developer Onboarding Access List**

### **🖥️ Development Environment Access**
- [ ] **Replit**: Invite to project workspace
- [ ] **GitHub**: Add as collaborator to `qyve-group/QYVE-Website` repository
- [ ] **Local Development**: Share `.env.local` template file

### **🗄️ Core Services & APIs**

#### Supabase (Database & Auth)
- [ ] Add as team member to Supabase organization
- [ ] Grant admin access to QYVE project
- [ ] Share project URL and keys
- [ ] Provide access to database schema and RLS policies

#### Google Cloud Console (OAuth)
- [ ] Add to Google Cloud project as Editor/Owner
- [ ] Grant access to OAuth 2.0 client configuration
- [ ] Share Google Analytics project (if used)
- [ ] Provide client ID and configuration details

#### Stripe (Payments)
- [ ] Add as team member to Stripe account
- [ ] Grant access to both test and live environments
- [ ] Share webhook configuration access
- [ ] Provide API keys and webhook secrets

### **📧 Communication & Notifications**

#### Email Service (Brevo)
- [ ] Add as user to Brevo account
- [ ] Grant access to SMTP configuration
- [ ] Share email templates and campaign management
- [ ] Provide SMTP credentials

#### Telegram Notifications
- [ ] Add to admin notification group/channel
- [ ] Share bot token and configuration
- [ ] Provide group chat ID and access

### **🚀 Deployment & Hosting**

#### Production Hosting (Vercel/Netlify)
- [ ] Add as team member to hosting platform
- [ ] Grant admin access to QYVE project
- [ ] Share environment variable configuration
- [ ] Provide deployment and domain management access

#### Domain Management
- [ ] Share DNS provider access
- [ ] Grant domain configuration permissions
- [ ] Provide SSL certificate management access (if separate)

### **📊 Analytics & Monitoring**

#### Google Analytics (if configured)
- [ ] Add to GA property as Admin
- [ ] Grant access to reports and goal configuration
- [ ] Share tracking ID and implementation details

#### Error Monitoring (if configured)
- [ ] Add to error tracking service (Sentry, etc.)
- [ ] Grant access to error logs and monitoring
- [ ] Share configuration and alert settings

### **🔐 Environment Variables & Secrets**

#### Database Credentials
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

#### Payment Processing
- [ ] `STRIPE_SECRET_KEY` (production)
- [ ] `STRIPE_TEST_SECRET_KEY` (development)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (production)
- [ ] `NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY` (development)
- [ ] `STRIPE_WEBHOOK_SECRET` (production)
- [ ] `STRIPE_TEST_WEBHOOK_SECRET` (development)

#### Email Service
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`

#### Notifications
- [ ] `BOT_TOKEN` (Telegram)
- [ ] `GROUP_CHAT_ID` (Telegram)

#### Authentication
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

#### System Configuration
- [ ] `COMPANY_NAME`
- [ ] `NEXT_PUBLIC_BASE_URL`
- [ ] `NEXT_PUBLIC_GA_ID` (if used)

### **📋 Administrative Access**

#### Direct Database Access
- [ ] Provide database connection string (if needed)
- [ ] Grant backup and restore capabilities
- [ ] Share database admin panel access

#### Security Setup
- [ ] Ensure 2FA is enabled on all critical accounts
- [ ] Plan API key rotation schedule
- [ ] Document access review process

### **📚 Documentation & Assets**

#### Design & Brand Assets
- [ ] Share design system and brand guidelines
- [ ] Provide logo files, fonts, and color schemes
- [ ] Grant access to design tools (Figma, Adobe, etc.)

#### Additional Documentation
- [ ] Share any additional technical documentation
- [ ] Provide access to shared drives or wikis
- [ ] Share meeting notes and project history

### **✅ Verification Steps**

#### Test Access
- [ ] Developer can log into all required services
- [ ] Environment variables work in development
- [ ] Can make test payments through Stripe
- [ ] Can access production logs and monitoring
- [ ] Can deploy to staging/production environments

#### Knowledge Transfer
- [ ] Schedule technical walkthrough session
- [ ] Review QYVE Knowledge Transfer Documentation
- [ ] Demonstrate key workflows and processes
- [ ] Answer any questions about the architecture

### **🔄 Post-Handover Tasks**

#### Security Review
- [ ] Review all access permissions granted
- [ ] Update team contact information
- [ ] Document new developer's access in team records
- [ ] Schedule regular access reviews

#### Ongoing Support
- [ ] Establish communication channels for questions
- [ ] Set up regular check-ins during transition period
- [ ] Document any additional access needs that arise

---

## 📝 **Notes Section**

**Service Account Details:**
- Primary email for accounts: _______________
- Backup contact method: _______________
- Emergency contact: _______________

**Access Granted Date:** _______________
**Granted By:** _______________
**Developer Contact:** _______________

**Additional Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

**Checklist Completed:** ___/___  
**Verification Date:** _______________  
**Next Review Date:** _______________