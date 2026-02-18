# Using clasp to Manage the Google Apps Script

[clasp](https://github.com/google/clasp) is Google's command-line tool for developing Apps Script projects locally. Instead of copy-pasting code into the browser editor, you can push and pull changes directly from the `apps-script/` directory.

## Prerequisites

- **Homebrew** installed ([brew.sh](https://brew.sh))
- Access to the Google account that owns the Apps Script project (the `@gathercateringandevents.com` Google Workspace account)

## One-Time Setup

### 1. Install clasp

```bash
brew install clasp
```

### 2. Create a Google Cloud Project (if you don't have one)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with the Google Workspace account
3. Click the project dropdown in the top bar and select **"New Project"**
4. Name it **"Gather Website"** and click **"Create"**
5. Note the **Project ID** shown on the dashboard (e.g. `gather-website-123456`) — you'll need it later

> If the Apps Script project is already linked to a GCP project, use that one instead. Check by opening the script at [script.google.com](https://script.google.com/), clicking the **gear icon** (Project Settings), and looking at the **Google Cloud Platform (GCP) Project** section.

### 3. Enable Required APIs

In the Google Cloud Console, with your project selected:

1. Go to **APIs & Services > Library** (or visit https://console.cloud.google.com/apis/library)
2. Search for and enable each of these APIs:
   - **Apps Script API** — click it, then click **"Enable"**
   - **Google Sheets API** — click it, then click **"Enable"**
   - **Gmail API** — click it, then click **"Enable"**

Also enable the Apps Script API toggle in the script editor:

1. Go to https://script.google.com/home/usersettings
2. Toggle **"Google Apps Script API"** to **On**

### 4. Create a Service Account

1. In the Cloud Console, go to **IAM & Admin > Service Accounts** (or visit https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **"+ Create Service Account"** at the top
3. Fill in the details:
   - **Name**: `clasp-deploy`
   - **Description**: `Service account for clasp push/deploy of Apps Script`
4. Click **"Create and Continue"**
5. For the **"Grant this service account access to project"** step, add the role:
   - **Editor** (`roles/editor`)
6. Click **"Continue"**, then **"Done"**

### 5. Create a Service Account Key

1. On the Service Accounts page, click the `clasp-deploy` account you just created
2. Go to the **"Keys"** tab
3. Click **"Add Key" > "Create new key"**
4. Select **JSON** and click **"Create"**
5. A `.json` key file downloads automatically — save it as `apps-script/service-account-key.json`

> **Security:** This key grants access to your GCP project. Never commit it to version control.

### 6. Link the GCP Project to the Apps Script Project

1. Open the Apps Script project at [script.google.com](https://script.google.com/)
2. Click the **gear icon** (Project Settings) in the left sidebar
3. Under **Google Cloud Platform (GCP) Project**, click **"Change project"**
4. Enter your GCP **Project Number** (found on the Cloud Console dashboard — it's numeric, not the Project ID)
5. Click **"Set project"**

### 7. Share the Apps Script Project with the Service Account

The service account needs access to the script:

1. Still in the Apps Script project settings, copy the **Script ID**
2. In the Apps Script editor, click **"Share"** (or the share icon at the top right)
3. Add the service account email (looks like `clasp-deploy@gather-website-123456.iam.gserviceaccount.com`) as an **Editor**

Also share the Google Sheet with the service account:

1. Open the Google Sheet used for inquiry logging
2. Click **"Share"** and add the same service account email as an **Editor**

### 8. Log in to clasp with the Service Account

```bash
cd apps-script
clasp login --creds service-account-key.json
```

This authenticates clasp using the service account instead of opening a browser. A credential file is saved at `~/.clasprc.json`.

To verify it worked:

```bash
clasp login --status
```

### 9. Find the Script ID

1. Open the existing Apps Script project at [script.google.com](https://script.google.com/)
2. Click the **gear icon** (Project Settings) in the left sidebar
3. Copy the **Script ID** (a long alphanumeric string)

### 10. Create the `.clasp.json` file

In the `apps-script/` directory, create a file named `.clasp.json`:

```json
{
  "scriptId": "YOUR_SCRIPT_ID_HERE",
  "rootDir": "."
}
```

Replace `YOUR_SCRIPT_ID_HERE` with the Script ID from Step 9.

### 11. Create the `appsscript.json` manifest

In the `apps-script/` directory, create a file named `appsscript.json`:

```json
{
  "timeZone": "America/New_York",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/spreadsheets"
  ]
}
```

### 12. Update `.gitignore`

Add these entries to the project's `.gitignore`:

```
apps-script/.clasp.json
apps-script/service-account-key.json
```

## Day-to-Day Workflow

### Pushing local changes to Google

After editing `Code.gs` or `config.gs` locally:

```bash
cd apps-script
clasp push
```

clasp uploads all `.gs` and `.json` files in the directory to the Apps Script project. You will see output like:

```
└─ Code.gs
└─ config.gs
└─ appsscript.json
Pushed 3 files.
```

### Pulling remote changes to local

If someone edited the script in the browser editor and you want to sync those changes locally:

```bash
cd apps-script
clasp pull
```

This overwrites local files with the versions from the Apps Script editor.

> **Warning:** `clasp pull` will overwrite your local files without merging. Commit or stash your local changes first if you have uncommitted work.

### Deploying a new version

After pushing changes, create a new deployment version so the live web app URL picks up the update:

```bash
clasp deploy --description "Brief description of what changed"
```

This creates a new versioned deployment. However, it creates a **new deployment** with a new URL. To update the **existing** deployment (keeping the same URL the website uses), you need the deployment ID:

1. List deployments to find the active one:

   ```bash
   clasp deployments
   ```

   Output looks like:

   ```
   - AKfycbx... @1 - Initial deployment
   - AKfycbw... @2 - Updated email template
   ```

2. Deploy to the existing deployment by ID:

   ```bash
   clasp deploy --deploymentId YOUR_DEPLOYMENT_ID --description "Brief description"
   ```

   Replace `YOUR_DEPLOYMENT_ID` with the ID from the list above (the one that matches the URL in `js/config.js`).

> **Important:** Always use `--deploymentId` to update the existing deployment. Otherwise a new URL is generated and you'd need to update `js/config.js` on the website.

### Opening the script in the browser

To quickly open the Apps Script editor:

```bash
clasp open
```

### Viewing execution logs

To tail the Apps Script execution logs (useful for debugging form submissions):

```bash
clasp logs --watch
```

Or to see recent logs without watching:

```bash
clasp logs
```

## Quick Reference

| Task | Command |
|------|---------|
| Push local code to Google | `clasp push` |
| Pull remote code to local | `clasp pull` |
| Deploy (update existing) | `clasp deploy --deploymentId ID --description "msg"` |
| List deployments | `clasp deployments` |
| Open in browser | `clasp open` |
| View logs | `clasp logs` |
| View logs (live) | `clasp logs --watch` |
| Check clasp version | `clasp --version` |
| Check login status | `clasp login --status` |
| Re-auth with service account | `clasp login --creds service-account-key.json` |

## File Overview

After setup, the `apps-script/` directory should contain:

```
apps-script/
├── .clasp.json               ← clasp project config (gitignored)
├── service-account-key.json  ← GCP service account credentials (gitignored)
├── appsscript.json           ← Apps Script manifest (committed)
├── Code.gs                   ← Main form handler logic
├── config.gs                 ← Spreadsheet ID (gitignored)
├── config.gs.example         ← Template for config.gs
└── *.md                      ← Documentation files (ignored by clasp)
```

> **Note:** clasp ignores non-`.gs` / non-`.json` files by default, so the `.md` files in this directory will not be pushed to Apps Script.

## Troubleshooting

### "Script API not enabled" error
Go to https://script.google.com/home/usersettings and make sure the API toggle is **On**.

### "No credentials" or "Not logged in"
Re-authenticate with the service account key:

```bash
cd apps-script
clasp login --creds service-account-key.json
```

The stored credential at `~/.clasprc.json` may have expired or been overwritten.

### "The caller does not have permission" on push
- Run `clasp login --status` to check which account is active.
- Verify the service account email has **Editor** access to the Apps Script project (check the Share settings at [script.google.com](https://script.google.com/)).
- Verify the GCP project linked to the Apps Script project matches the project the service account belongs to.
- If using a different account, run `clasp logout` then re-authenticate:

  ```bash
  clasp login --creds service-account-key.json
  ```

### Push succeeds but web app doesn't update
You pushed the code but didn't deploy a new version. Run `clasp deploy --deploymentId ID` to publish the changes to the live web app.

### clasp push uploads unwanted files
Create a `.claspignore` file in the `apps-script/` directory:

```
**/*.md
config.gs.example
service-account-key.json
```
