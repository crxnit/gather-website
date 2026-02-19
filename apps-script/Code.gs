/**
 * Google Apps Script — Gather Catering Inquiry Form Handler
 *
 * Deployment:
 * 1. Go to script.google.com and create a new project
 * 2. Paste this code into Code.gs
 * 3. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployed URL and set it as APPS_SCRIPT_URL in js/form.js
 *
 * Configuration:
 * - Set SPREADSHEET_ID to the ID of your Google Sheet (from the URL)
 * - Set NOTIFICATION_EMAIL to the internal email that receives lead alerts
 * - Set CATERING_MANAGER_NAME to the name shown in the confirmation email
 */

// ── Configuration ──────────────────────────────────────────────────────────────

/** Internal email that receives new lead notifications. */
var NOTIFICATION_EMAIL = 'catering@gathercateringandevents.com';

/** Public-facing sender name on confirmation emails. */
var SENDER_NAME = 'Gather Catering and Events';

// SPREADSHEET_ID is defined in config.gs (not committed to version control).
// See config.gs.example for the template.

var SHEET_NAME = 'Inquiry Submissions';

// PLACEHOLDER: Replace with the catering manager's actual name
var CATERING_MANAGER_NAME = 'Liz French';

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * HTML-escape a string to prevent injection in email bodies.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format a services array into a display string.
 */
function formatServices(services, fallback) {
  return services && services.length > 0 ? services.join(', ') : (fallback || '');
}

/**
 * Return a field value or a fallback, with optional HTML escaping.
 */
function fieldOrDefault(value, fallback, shouldEscape) {
  var result = value || fallback;
  return shouldEscape ? escapeHtml(result) : result;
}

// ── Main handler ───────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Server-side validation of required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    logToSheet(data);
    sendConfirmationEmail(data);
    sendNotificationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Internal error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── 1. Google Sheet logging ────────────────────────────────────────────────────

function logToSheet(data) {
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
      Logger.log('Sheet logging skipped: SPREADSHEET_ID not configured.');
      return;
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp', 'First Name', 'Last Name', 'Email',
        'Phone', 'Services', 'Budget', 'Details'
      ]);
    }

    sheet.appendRow([
      data.timestamp,
      data.firstName,
      data.lastName,
      data.email,
      data.phone || '',
      formatServices(data.services, ''),
      data.budget || '',
      data.details || ''
    ]);
  } catch (e) {
    // Sheet logging is optional — don't break email delivery
    Logger.log('Sheet logging failed: ' + e.toString());
  }
}

// ── 2. Confirmation email to the person who submitted the form ─────────────────

function sendConfirmationEmail(data) {
  var safeName = escapeHtml(data.firstName);
  var services = formatServices(data.services, 'Not specified');

  var subject = 'Thank you for your inquiry \u2014 Gather Catering and Events';

  var body = [
    'Hi ' + data.firstName + ',',
    '',
    'Thank you for reaching out to Gather Catering and Events! We\u2019re so glad you got in touch.',
    '',
    'We\u2019ve received your inquiry and one of our team members will be in touch within 24\u201348 business hours to discuss how we can help bring your vision to life.',
    '',
    'Your Details:',
    'Services: ' + services,
    'Budget: ' + (data.budget || 'Not provided'),
    '',
    'In the meantime, feel free to reply to this email if you have any questions.',
    '',
    'Warm regards,',
    'The Gather Catering and Events Team',
    'From Dawn to Dusk'
  ].join('\n');

  // Build the "Your Details" lines for the highlighted box
  var detailLines = '<strong>Your Details:</strong><br>' +
    'Services Interested In: ' + escapeHtml(services);
  if (data.budget) {
    detailLines += '<br>Budget: ' + escapeHtml(data.budget);
  }

  var htmlBody =
    '<div style="font-family:\'Helvetica Neue\',Arial,sans-serif;max-width:600px;margin:0 auto;color:#2c3e50">' +
      '<div style="background-color:#2c3e50;padding:30px;text-align:center">' +
        '<h1 style="color:#f9e3b4;margin:0;font-size:28px">Thank You, ' + safeName + '!</h1>' +
      '</div>' +
      '<div style="padding:30px;background-color:#f4f1ea">' +
        '<p style="font-size:16px;line-height:1.6;color:#2c3e50">' +
          'We\u2019re so glad you reached out! We\u2019ve received your inquiry and are excited to learn more about your upcoming event.' +
        '</p>' +
        '<p style="font-size:16px;line-height:1.6;color:#2c3e50">' +
          'One of our team members will be in touch within <strong>24\u201348 business hours</strong> to discuss how we can help bring your vision to life. In the meantime, feel free to reply to this email if you have any questions.' +
        '</p>' +
        '<div style="background-color:rgba(249,227,180,0.3);border-left:4px solid #f9e3b4;padding:15px;margin:25px 0">' +
          '<p style="margin:0;font-size:16px;color:#2c3e50">' + detailLines + '</p>' +
        '</div>' +
        '<p style="font-size:16px;line-height:1.6;color:#2c3e50;margin-bottom:0">' +
          'Warm regards,<br>' +
          '<strong>The Gather Catering and Events Team</strong>' +
        '</p>' +
      '</div>' +
      '<div style="background-color:#2c3e50;padding:20px;text-align:center">' +
        '<p style="color:#f9e3b4;margin:0;font-size:14px">Gather Catering and Events &mdash; From Dawn to Dusk</p>' +
      '</div>' +
    '</div>';

  GmailApp.sendEmail(data.email, subject, body, {
    htmlBody: htmlBody,
    name: SENDER_NAME,
    from: 'catering@gathercateringandevents.com',
    replyTo: 'catering@gathercateringandevents.com'
  });
}

// ── 3. Notification email to the catering team ─────────────────────────────────

function sendNotificationEmail(data) {
  var services = formatServices(data.services, 'None selected');
  var safeName = escapeHtml(data.firstName) + ' ' + escapeHtml(data.lastName);
  var safeEmail = escapeHtml(data.email);

  var subject = 'New Website Lead - ' + data.firstName + ' ' + data.lastName;

  var body = [
    'New inquiry submitted via the Gather website:',
    '',
    'Name: ' + data.firstName + ' ' + data.lastName,
    'Email: ' + data.email,
    'Phone: ' + (data.phone || 'Not provided'),
    '',
    'Services Interested In: ' + services,
    'Budget: ' + (data.budget || 'Not provided'),
    '',
    'Additional Details:',
    data.details || 'None',
    '',
    '---',
    'Submitted: ' + data.timestamp
  ].join('\n');

  var htmlBody = [
    '<h2 style="font-family:sans-serif;">New Website Lead - ' + safeName + '</h2>',
    '<table style="border-collapse:collapse; font-family:sans-serif;">',
    '<tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Name:</td><td style="padding:8px;">' + safeName + '</td></tr>',
    '<tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Email:</td><td style="padding:8px;"><a href="mailto:' + safeEmail + '">' + safeEmail + '</a></td></tr>',
    '<tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Phone:</td><td style="padding:8px;">' + fieldOrDefault(data.phone, 'Not provided', true) + '</td></tr>',
    '<tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Services:</td><td style="padding:8px;">' + escapeHtml(services) + '</td></tr>',
    '<tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Budget:</td><td style="padding:8px;">' + fieldOrDefault(data.budget, 'Not provided', true) + '</td></tr>',
    '<tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Details:</td><td style="padding:8px;">' + fieldOrDefault(data.details, 'None', true).replace(/\n/g, '<br>') + '</td></tr>',
    '</table>',
    '<hr>',
    '<p style="color:#999; font-size:12px;">Submitted: ' + escapeHtml(data.timestamp || '') + '</p>'
  ].join('');

  GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, body, {
    htmlBody: htmlBody,
    replyTo: data.email,
    name: 'Gather Website'
  });
}
