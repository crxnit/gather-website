# Google Apps Script — Setup & Deployment Instructions

These instructions walk through deploying the Gather inquiry form handler (`Code.gs`) as a Google Apps Script web app.

## Prerequisites

- A Google account with access to Google Workspace (the account that owns `catering@gathercateringandevents.com`)
- The Google Sheet for logging inquiries (already created — find the ID in `apps-script/config.gs`)

## Step 1: Create the Apps Script Project

1. Go to [script.google.com](https://script.google.com/)
2. Sign in with the Google Workspace account (the one that owns the `@gathercateringandevents.com` email addresses)
3. Click **"New project"** in the top left
4. Click "Untitled project" at the top and rename it to **"Gather Website Inquiry Handler"**

## Step 2: Paste the Code

1. In the editor, you'll see a default file called `Code.gs` with an empty `myFunction()`
2. **Select all** the default code and **delete it**
3. Open the file `apps-script/Code.gs` from the website repository
4. **Copy the entire contents** and **paste it** into the Apps Script editor
5. Click the **+** button next to "Files" in the left sidebar and select **"Script"**
6. Name the new file **`config`** (it will become `config.gs`)
7. Open `apps-script/config.gs` from the website repository (or `config.gs.example` if setting up fresh) and **paste its contents** into the new file
8. Click the **save icon** (or press Ctrl+S / Cmd+S)

## Step 3: Verify Configuration

Before deploying, confirm these values at the top of `Code.gs` are correct:

| Variable | Current Value | Description |
|----------|--------------|-------------|
| `NOTIFICATION_EMAIL` | `catering@gathercateringandevents.com` | Receives new lead notification emails |
| `SPREADSHEET_ID` | *(set in `config.gs`)* | Google Sheet where inquiries are logged |
| `CATERING_MANAGER_NAME` | `Liz French` | Name shown in the confirmation email sent to the customer |
| `SENDER_NAME` | `Gather Catering and Events` | "From" name on confirmation emails |
| `SHEET_NAME` | `Inquiry Submissions` | Tab name created in the Google Sheet |

## Step 4: Deploy as a Web App

1. Click **"Deploy"** in the top right corner of the Apps Script editor
2. Select **"New deployment"**
3. Click the **gear icon** next to "Select type" and choose **"Web app"**
4. Fill in the deployment settings:
   - **Description**: `Gather inquiry form handler`
   - **Execute as**: **Me** (your Google Workspace account)
   - **Who has access**: **Anyone**
5. Click **"Deploy"**
6. Google will ask you to **authorize** the script. Click **"Authorize access"**
7. If you see a "Google hasn't verified this app" warning:
   - Click **"Advanced"** (bottom left)
   - Click **"Go to Gather Website Inquiry Handler (unsafe)"**
   - Click **"Allow"**
8. After authorization, you'll see a **"Web app URL"** — it looks like:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXXX/exec
   ```
9. **Copy this URL** — you'll need it in the next step

## Step 5: Connect the Website to the Deployed Script

1. Copy `js/config.js.example` to `js/config.js`
2. Open `js/config.js` and replace `YOUR_APPS_SCRIPT_URL_HERE` with the URL you copied in Step 4:
   ```javascript
   var GATHER_CONFIG = {
     APPS_SCRIPT_URL: 'https://script.google.com/macros/s/XXXXXXXXXXXXX/exec'
   };
   ```
3. Save the file

> **Note:** `js/config.js` is gitignored — it will not be committed to the repository.

## Step 6: Test the Form

1. Open the website's inquiry form page (`inquiry.html`) in a browser
2. Fill in test data:
   - First Name: `Test`
   - Last Name: `User`
   - Email: your personal email address (so you receive the confirmation)
   - Check one or more services
   - Add any budget and details text
3. Click **"Send Inquiry"**
4. Verify all three actions completed:

| # | Action | How to verify |
|---|--------|---------------|
| 1 | Google Sheet entry | Open the Google Sheet (see `apps-script/config.gs` for the ID) and check for a new row in the "Inquiry Submissions" tab |
| 2 | Confirmation email | Check the inbox of the email address you used in the form |
| 3 | Lead notification | Check the `catering@gathercateringandevents.com` inbox for a "New Website Lead - Test User" email |
| 4 | On-site message | Confirm a green success message appeared on the form page |

## Updating the Script After Changes

If you make changes to `Code.gs` in the future:

1. Paste the updated code into the Apps Script editor at [script.google.com](https://script.google.com/)
2. Click **"Deploy"** > **"Manage deployments"**
3. Click the **pencil icon** (edit) on the active deployment
4. Change **"Version"** to **"New version"**
5. Click **"Deploy"**

The web app URL stays the same — no changes needed on the website side.

## Troubleshooting

### Form shows success but no emails arrive
- Check the Apps Script execution log: In the script editor, click **"Executions"** in the left sidebar
- Look for errors in the log entries
- Make sure the Google account has Gmail/Google Workspace access

### "Sheet logging failed" in the execution log
- Verify the `SPREADSHEET_ID` is correct
- Make sure the Google Sheet is accessible by the account that owns the script
- The script account needs edit access to the spreadsheet

### "Authorization required" error after redeployment
- Go to **"Deploy"** > **"Manage deployments"** > edit > set **"Who has access"** to **"Anyone"** > redeploy

### Emails going to spam
- The confirmation email is sent from the Google Workspace account via GmailApp
- Ask recipients to check their spam folder and mark as "Not spam"
- Adding a custom "from" address or DKIM setup in Google Workspace can help deliverability

### Form shows success but Apps Script didn't run
- This is a known limitation of the `no-cors` fetch mode — the website shows success optimistically
- Check the Apps Script execution log to confirm the script received the request
- If no executions appear, verify the `APPS_SCRIPT_URL` in `js/form.js` is correct
