# Push, Deploy, and Get the Exec URL with clasp

These are the day-to-day commands to update the live Apps Script after making local changes.

## 1. Push Local Code to Google

From the `apps-script/` directory:

```bash
cd apps-script
clasp push
```

Expected output:

```
└─ Code.gs
└─ config.gs
└─ appsscript.json
Pushed 3 files.
```

This uploads your local `.gs` and `.json` files to the Apps Script project but does **not** update the live web app yet.

## 2. Deploy

### First-Time Deployment

If no deployment exists yet:

```bash
clasp deploy --description "Initial clasp deployment"
```

Output:

```
- AKfycbx...XXXXX @1 - Initial clasp deployment
```

The `AKfycbx...XXXXX` string is the **Deployment ID**.

### Update an Existing Deployment

To update the live web app without changing the URL:

```bash
clasp deployments
```

This lists all deployments:

```
- AKfycbx...XXXXX @1 - Initial clasp deployment
```

Copy the Deployment ID, then redeploy to it:

```bash
clasp deploy --deploymentId AKfycbx...XXXXX --description "Brief description of what changed"
```

> **Important:** Always use `--deploymentId` when updating. Without it, clasp creates a new deployment with a new URL, and you'd need to update `js/config.js` on the website.

## 3. Get the Exec URL

The exec URL is built from the Deployment ID:

```
https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

For example, if your Deployment ID is `AKfycbx...XXXXX`, the URL is:

```
https://script.google.com/macros/s/AKfycbx...XXXXX/exec
```

You can also find it by running:

```bash
clasp deployments
```

Or by opening the script in the browser and checking the deployment settings:

```bash
clasp open
```

Then click **Deploy > Manage deployments** to see the full URL.

## Quick Reference

| Step | Command |
|------|---------|
| Push code | `clasp push` |
| First deploy | `clasp deploy --description "msg"` |
| List deployments | `clasp deployments` |
| Update existing deploy | `clasp deploy --deploymentId ID --description "msg"` |
| Open in browser | `clasp open` |

## All-in-One

Push and redeploy in a single line (replace the deployment ID with yours):

```bash
clasp push && clasp deploy --deploymentId AKfycbx...XXXXX --description "Brief description"
```
