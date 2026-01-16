# Google Sheets Integration Setup Guide

This guide will walk you through setting up Google Sheets integration to track form submissions from your landing page.

## Overview

When a visitor submits your lead capture form, the data will be automatically saved to a Google Sheet for easy tracking and management.

## Step-by-Step Setup

### 1. Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it something like "Insurance Leads" or "Lead Tracking"
4. Set up the header row (Row 1) with the following columns:
   - `Timestamp`
   - `First Name`
   - `Last Name`
   - `Email`
   - `Phone`
   - `Insurance Types`
   - `Special Considerations`
   - `Call Immediately`
   - `Appointment Date`
   - `Appointment Time`
   - `Message`
   - `Address`
   - `City`
   - `State`
   - `Zip Code`
   - `Full Address`

### 2. Create a Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the script editor
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Format the timestamp
    var timestamp = new Date(data.timestamp);
    
    // Append a new row with the form data
    sheet.appendRow([
      timestamp,
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.insuranceTypes || '',
      data.specialConsiderations || '',
      data.callImmediately || '',
      data.appointmentDate || '',
      data.appointmentTime || '',
      data.message || '',
      data.address || '',
      data.city || '',
      data.state || '',
      data.zipCode || '',
      data.fullAddress || ''
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'row': sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon)
5. Name your project (e.g., "Lead Form Handler")

### 3. Deploy the Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Lead form submission handler" (or any description)
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** (this allows your website to send data)
5. Click **Deploy**
6. **Important**: You may see a warning that "Google hasn't verified this app"
   - Click **Advanced**
   - Click **Go to [Your Project Name] (unsafe)**
   - Click **Allow** to authorize the script
7. Copy the **Web app URL** that appears (it will look like: `https://script.google.com/macros/s/AKfycby.../exec`)

### 4. Update Your Landing Page Code

1. Open `/components/LeadForm.tsx` in your code editor
2. Find the line that says:
   ```typescript
   const GOOGLE_SHEETS_WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` with the Web app URL you copied (keep the quotes)
4. Example:
   ```typescript
   const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
5. Save the file

### 5. Test the Integration

1. Deploy your website (using Vercel, Netlify, or another hosting provider)
2. Fill out and submit the form on your landing page
3. Check your Google Sheet - you should see a new row with the submission data

## Troubleshooting

### Form submits but data doesn't appear in Google Sheets

1. **Check the Web App URL**: Make sure you copied the entire URL correctly
2. **Check deployment settings**: Ensure "Who has access" is set to "Anyone"
3. **Check browser console**: Open Developer Tools (F12) and look for any error messages
4. **Redeploy the script**: In Apps Script, go to Deploy → Manage deployments → Edit → New version → Deploy

### "Authorization required" error

1. Go back to the Apps Script editor
2. Click Deploy → Manage deployments
3. Click the edit icon (pencil)
4. Create a new deployment version
5. Authorize the app again

### Data appears incorrectly formatted

1. Check that your column headers in Row 1 exactly match the setup guide
2. Make sure there are no extra rows above the header row
3. Verify the Apps Script code matches the code provided above

## Privacy and Security Notes

- The Google Apps Script Web App URL is public and can be accessed by anyone
- However, it can only append data to your specific Google Sheet
- Do not share the Google Sheet itself unless you want others to see the lead data
- Consider setting up notifications in Google Sheets to alert you when new leads arrive
- Regularly back up your lead data

## Setting Up Email Notifications (Optional)

To receive an email notification each time a new lead is submitted:

1. In your Google Sheet, click **Tools** → **Notification rules**
2. Select **A user submits a form** or **Any changes are made**
3. Choose how you want to be notified (email immediately or daily digest)
4. Click **Save**

## Next Steps

- Consider creating a Google Form that also feeds into this sheet for manual data entry
- Set up conditional formatting to highlight urgent leads (e.g., "Call Immediately" = Yes)
- Create a dashboard using Google Sheets charts to visualize lead sources and trends
- Export data regularly for CRM integration

## Need Help?

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the Apps Script execution logs: Apps Script editor → Executions
3. Verify all steps were followed correctly
4. Ensure your Google account has permission to create and edit the spreadsheet
