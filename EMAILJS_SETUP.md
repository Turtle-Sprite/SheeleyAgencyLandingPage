# EmailJS Setup Instructions

## 🚨 IMPORTANT: Where to Find Your Public Key

**Your Public Key is NOT the same as your User ID!**

To find your **Public Key**:
1. Go to [https://dashboard.emailjs.com/admin/account](https://dashboard.emailjs.com/admin/account)
2. Scroll down to the **"API Keys"** section (NOT "General" section)
3. Look for **"Public Key"** - it's a string of random characters
4. Click the copy button next to it

**Common mistake:** Using your User ID instead of Public Key. They are different!

---

## Overview
Your landing page is now configured to send automatic emails using EmailJS. When someone fills out your form, they'll receive a thank you email instantly, and you'll receive a notification with all their lead details.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, click "Add New Service"
2. Choose your email provider (Gmail recommended):
   - **Gmail**: Select "Gmail" and connect your Google account
   - **Outlook**: Select "Outlook" for Microsoft accounts
   - **Other**: You can also use custom SMTP
3. Give your service a name (e.g., "Deborah Sheeley Agency")
4. **Copy your Service ID** - you'll need this later

## Step 3: Create Email Templates

You need to create **TWO** email templates:

### Template 1: Customer Thank You Email

1. Click "Email Templates" → "Create New Template"
2. Name it: "Customer Thank You"
3. Use this template content:

**Subject:**
```
Thank you for your insurance quote request!
```

**Body:**
```
Hi {{to_name}},

Thank you for requesting an insurance quote from Deborah Sheeley Agency!

We've received your information and will review your needs carefully. You can expect to hear from us within 24 hours during our business hours (10:00 AM - 4:30 PM).

Here's what we received:
- Name: {{customer_name}}
- Email: {{customer_email}}
- Phone: {{customer_phone}}
- Address: {{full_address}}
- Insurance Type(s): {{insurance_types}}
- Special Considerations: {{special_considerations}}
- Call Immediately: {{call_immediately}}
- Preferred Appointment: {{appointment_date}} at {{appointment_time}}
- Message: {{message}}

If you have any immediate questions, feel free to call us at 724-609-7115.

Best regards,
Deborah Sheeley Agency
Talk with a Pennsylvania Agent today!
```

4. **Copy the Template ID** - you'll need this later
5. template_p9xgdq3

### Template 2: Admin Lead Notification

1. Create another template
2. Name it: "New Lead Notification"
3. Use this template content:

**Subject:**
```
🔔 New Insurance Quote Request - {{customer_name}}
```

**Body:**
```
New lead received!

CUSTOMER INFORMATION:
Name: {{customer_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}

ADDRESS:
{{full_address}}

INSURANCE NEEDS:
Type(s): {{insurance_types}}
Special Considerations: {{special_considerations}}

APPOINTMENT PREFERENCE:
Call Immediately: {{call_immediately}}
Date: {{appointment_date}}
Time: {{appointment_time}}

MESSAGE:
{{message}}

---
This lead was submitted via the Deborah Sheeley Agency website.
```

4. **Copy this Template ID** as well
5. template_hwb4lda
6. In "Settings" for this template, set the "To Email" to your business email where you want to receive leads

## Step 4: Get Your Public Key

1. Go to [https://dashboard.emailjs.com/admin/account](https://dashboard.emailjs.com/admin/account)
2. Scroll down to the **"API Keys"** section (NOT "General" section)
3. Look for **"Public Key"** - it's a string of random characters
4. Click the copy button next to it

## Step 5: Update Your Code

1. Open `/components/LeadForm.tsx` in your project
2. Find these lines near the top of the `handleSubmit` function (around line 37-40):

```javascript
const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID_CUSTOMER = 'YOUR_CUSTOMER_TEMPLATE_ID';
const TEMPLATE_ID_ADMIN = 'YOUR_ADMIN_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

3. Replace with your actual values:

```javascript
const SERVICE_ID = 'service_abc123';  // From Step 2
const TEMPLATE_ID_CUSTOMER = 'template_xyz789';  // From Step 3 - Template 1
const TEMPLATE_ID_ADMIN = 'template_def456';  // From Step 3 - Template 2
const PUBLIC_KEY = 'abc123XYZ';  // From Step 4
```

## Step 6: Configure Email Destination

In your EmailJS dashboard, for the **Admin Lead Notification** template:
1. Click on the template
2. Go to "Settings"
3. Set "To Email" to your business email (e.g., deborah@example.com)

## Step 7: Test Your Form

1. Fill out your form with test data
2. Submit it
3. Check:
   - ✅ Customer receives thank you email
   - ✅ You receive lead notification email
   - ✅ All data appears correctly in emails

## Troubleshooting

### Emails not sending?
- Check browser console for errors (F12)
- Verify all IDs are correct
- Make sure your EmailJS service is active
- Check your free tier limit (200 emails/month)

### Customer not receiving emails?
- Check their spam folder
- Verify the template is set to send to `{{to_email}}`
- Make sure the template is enabled

### Not receiving lead notifications?
- Check the "To Email" in template settings
- Verify your business email is correct
- Check your spam folder

### Rate limiting?
- Free tier: 200 emails/month
- Each form submission sends 2 emails (customer + admin)
- So you can handle 100 form submissions per month
- Upgrade to paid plan if needed

## Free Tier Limits

- ✅ 200 emails per month
- ✅ 2 email services
- ✅ 2 email templates (you're using exactly this!)
- ✅ HTTPS support
- ✅ Basic email tracking

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/

---

**Note**: Your API keys are visible in the browser code. This is normal for EmailJS client-side integration. EmailJS has rate limiting and domain restrictions to prevent abuse. For production use, consider restricting your EmailJS service to your specific domain in the EmailJS dashboard settings.