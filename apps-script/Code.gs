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
 * NOTE: If deployed as a standalone script (not bound to a spreadsheet),
 * sheet logging will be silently skipped. To enable logging, either bind
 * the script to a Google Sheet or replace getActiveSpreadsheet() with
 * SpreadsheetApp.openById('YOUR_SHEET_ID').
 */

var RECIPIENT_EMAIL = 'catering@gathercafeandevents.com';
var SHEET_NAME = 'Inquiry Submissions';

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

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Server-side validation of required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sendEmail(data);
    logToSheet(data);

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

function sendEmail(data) {
  var services = formatServices(data.services, 'None selected');
  var safeName = escapeHtml(data.firstName) + ' ' + escapeHtml(data.lastName);
  var safeEmail = escapeHtml(data.email);

  var subject = 'New Inquiry from ' + data.firstName + ' ' + data.lastName;

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
    '<h2>New Inquiry from ' + safeName + '</h2>',
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

  GmailApp.sendEmail(RECIPIENT_EMAIL, subject, body, {
    htmlBody: htmlBody,
    replyTo: data.email,
    name: 'Gather Website'
  });
}

function logToSheet(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;

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
