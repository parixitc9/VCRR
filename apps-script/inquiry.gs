/**
 * VCRR project-inquiry receiver: a Google Apps Script bound to the inquiry sheet (inquiry_VCRR), owned by vcrrit@gmail.com.
 * Only the site's /api/inquiry function calls it, server to server. Everything lives in one place: the sheet's first tab.
 * For each brief it, in order:
 *   1. adds a row to the first tab,
 *   2. emails the sheet owner (INBOX),
 *   3. emails the visitor a confirmation with their Brief ID.
 * Each row also records whether both emails went out. If step 1 or 2 fails, the site shows "Not sent".
 *
 * One-time setup, signed in as vcrrit@gmail.com:
 *  1. Open the sheet. In it: Extensions → Apps Script → paste this file → save.
 *  2. Project Settings → Script properties → add INQUIRY_SECRET with the same value as INQUIRY_SECRET in Vercel.
 *  3. In the editor, pick the function "setup" → Run → approve the permissions (Sheets and Gmail).
 *  4. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy.
 *  5. Copy the Web app URL (ends in /exec) into Vercel as INQUIRY_SCRIPT_URL, then redeploy the site.
 * After any change to this file: Deploy → Manage deployments → edit → Version: New version → Deploy.
 */

const INBOX = 'vcrrit@gmail.com';
const HEADER = ['Brief ID', 'Received', 'Name', 'Email', 'Company', 'Project type', 'Budget', 'The problem', 'Owner email', 'Confirmation'];
const COL_OWNER_EMAIL = 9;
const COL_CONFIRMATION = 10;
const MAX_PER_IP_PER_HOUR = 3;
const MAX_PER_DAY = 30; // all briefs together. Each brief sends two emails, so 60 a day, inside Gmail's limit of about 100

const SITE = 'https://vcrr.vercel.app'; // change when the site moves to its own domain

// The site's colours and type, in email-safe form
const C_INK = '#14110f';
const C_AMBER = '#ffb000';
const C_AMBER_TEXT = '#c78a00'; // amber that still reads on cream
const C_PAPER = '#f3ede3';
const C_MUTED = '#6b645b';
const C_MUTED_DARK = '#a39c90';
const C_LINE_DARK = '#3a352f';
const F_DISPLAY = "'Arial Black',Arial,Helvetica,sans-serif";
const F_MONO = "'Courier New',Courier,monospace";
const F_BODY = 'Arial,Helvetica,sans-serif';

/** Run once from the editor: writes the header row and makes Google ask for the Sheets and Gmail permissions. */
function setup() {
  const sheet = ensureSheet();
  console.log(
    'Ready. Briefs go to the tab "' + sheet.getName() + '" of ' + SpreadsheetApp.getActiveSpreadsheet().getUrl() +
      ' · emails left today: ' + MailApp.getRemainingDailyQuota(),
  );
}

function doGet() {
  return reply({ ok: true, service: 'vcrr-inquiry' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('INQUIRY_SECRET');
    if (!secret || body.secret !== secret) return reply({ ok: false, error: 'forbidden' });
    if (!withinLimits(body.ip)) return reply({ ok: false, error: 'limit' });

    const sheet = ensureSheet();
    const briefId = 'VCRR-' + String(sheet.getLastRow()).padStart(4, '0');
    sheet.appendRow(
      [
        briefId,
        Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm'),
        body.name,
        body.email,
        body.company,
        body.projectType,
        body.budget,
        body.description,
        '',
        '',
      ].map(safeCell),
    );
    const row = sheet.getLastRow();

    try {
      notifyOwner(body, briefId);
      sheet.getRange(row, COL_OWNER_EMAIL).setValue('Sent');
    } catch (err) {
      sheet.getRange(row, COL_OWNER_EMAIL).setValue('Failed: ' + err.message);
      throw err;
    }

    let confirmation = 'Sent';
    try {
      sendConfirmation(body, briefId);
    } catch (err) {
      confirmation = 'Failed: ' + err.message;
    }
    sheet.getRange(row, COL_CONFIRMATION).setValue(confirmation);

    return reply({ ok: true, briefId: briefId });
  } catch (err) {
    return reply({ ok: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}

/** The sheet's first tab holds every brief, so there is only ever one place to look. */
function ensureSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold').setBackground(C_INK).setFontColor(C_AMBER);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notifyOwner(body, briefId) {
  MailApp.sendEmail({
    to: INBOX,
    replyTo: body.email,
    subject: ('New project brief ' + briefId + ': ' + (body.company || body.name)).replace(/[\r\n]+/g, ' ').slice(0, 200),
    body:
      briefLines(body).join('\n') +
      '\n\nReply to this email to answer ' + body.name + '.' +
      '\nAll briefs: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  });
}

function sendConfirmation(body, briefId) {
  const firstName = String(body.name || '').trim().split(/\s+/)[0] || 'there';
  const site = SITE.replace(/^https?:\/\//, '');
  const steps = [
    'We read your brief and reply to arrange a conversation, or tell you honestly if we are not the right fit.',
    'In that conversation we ask how the work happens today. No preparation needed.',
    'If it makes sense to continue, we propose a discovery phase with a written scope and cost.',
  ];

  const plain = [
    'Thanks, ' + firstName + '. Your brief is with us.',
    '',
    'We will read it and reply within two working days to arrange a conversation, or tell you honestly if we are not the right fit.',
    '',
    'Your reference: ' + briefId,
    '',
    'WHAT YOU SENT',
    ...briefLines(body),
    '',
    'Something wrong or missing? Reply to this email and we will add it to your brief.',
    '',
    'WHAT HAPPENS NEXT',
    ...steps.map((step, i) => '0' + (i + 1) + '  ' + step),
    '',
    'VCRR · Software · Apps · Automation. A digital software studio founded by four partners.',
    INBOX + ' · ' + site,
    'You are receiving this because you sent a project brief at ' + site + '. Your details are used only to reply about this project.',
    'Privacy policy: ' + SITE + '/privacy',
  ].join('\n');

  // the mark: a chevron prompt, an amber block cursor, the wordmark
  const logo = (size) =>
    '<span style="font-family:' + F_DISPLAY + ';font-size:' + size + 'px;font-weight:900;line-height:1;color:#ffffff;">&gt;</span>' +
    '<span style="display:inline-block;width:' + Math.round(size * 0.36) + 'px;height:' + Math.round(size * 0.36) + 'px;background:' + C_AMBER + ';margin:0 ' + Math.round(size * 0.4) + 'px 0 2px;"></span>' +
    '<span style="font-family:' + F_DISPLAY + ';font-size:' + size + 'px;font-weight:900;line-height:1;letter-spacing:-1px;color:#ffffff;">VCRR</span>';
  const label = (text, color) =>
    '<div style="font-family:' + F_MONO + ';font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:' + color + ';">' +
    '<span style="color:' + C_AMBER + ';">&gt;</span>&nbsp;' + text + '</div>';
  const cell = 'padding:16px 18px;vertical-align:top;';

  const rows = briefPairs(body)
    .map(([name, value], i) => {
      const rule = i ? 'border-top:2px solid ' + C_INK + ';' : '';
      return (
        '<tr>' +
        '<td style="' + rule + cell + 'width:36%;font-family:' + F_MONO + ';font-size:12px;letter-spacing:2px;line-height:1.6;color:' + C_MUTED + ';">' + name.toUpperCase() + '</td>' +
        '<td style="' + rule + cell + 'font-family:' + F_BODY + ';font-size:16px;line-height:1.5;color:' + C_INK + ';">' +
        escapeHtml(value || 'Not specified').replace(/\n/g, '<br>') +
        '</td></tr>'
      );
    })
    .join('');

  const stepRows = steps
    .map(
      (step, i) =>
        '<tr>' +
        '<td style="padding:20px 16px 20px 0;width:52px;vertical-align:top;border-bottom:1px solid ' + C_LINE_DARK + ';font-family:' + F_DISPLAY + ';font-size:28px;font-weight:900;line-height:1;color:' + C_AMBER + ';">0' + (i + 1) + '</td>' +
        '<td style="padding:20px 0;vertical-align:top;border-bottom:1px solid ' + C_LINE_DARK + ';font-family:' + F_BODY + ';font-size:16px;line-height:1.55;color:#ffffff;">' + step + '</td>' +
        '</tr>',
    )
    .join('');

  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Your brief is with us</title></head>' +
    '<body style="margin:0;padding:0;background:' + C_INK + ';">' +
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your brief ' + briefId + ' is with us. We will reply within two working days.</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C_INK + ';"><tr><td align="center">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">' +
    // header bar
    '<tr><td style="background:' + C_INK + ';padding:28px 32px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="vertical-align:middle;">' + logo(26) + '</td>' +
    '<td align="right" style="vertical-align:middle;white-space:nowrap;font-family:' + F_MONO + ';font-size:12px;letter-spacing:2px;color:' + C_MUTED_DARK + ';">REF [' + briefId + ']</td>' +
    '</tr></table>' +
    '</td></tr>' +
    // the brief, on cream
    '<tr><td style="background:' + C_PAPER + ';padding:44px 32px 40px;">' +
    '<div style="font-family:' + F_MONO + ';font-size:15px;color:' + C_INK + ';"><span style="color:' + C_AMBER_TEXT + ';font-weight:bold;">&gt;</span> brief received ' +
    '<span style="background:' + C_INK + ';color:' + C_AMBER + ';font-weight:bold;padding:2px 7px;">ok</span></div>' +
    '<h1 style="margin:28px 0 0;font-family:' + F_DISPLAY + ';font-size:34px;line-height:1.05;font-weight:900;text-transform:uppercase;color:' + C_INK + ';">' +
    'Thanks, ' + escapeHtml(firstName) + '.<br>Your brief is with us.</h1>' +
    '<div style="width:220px;height:6px;margin-top:14px;background:' + C_AMBER + ';font-size:0;line-height:0;">&nbsp;</div>' +
    '<p style="margin:26px 0 0;font-family:' + F_BODY + ';font-size:17px;line-height:1.6;color:' + C_INK + ';">' +
    'We will read it and reply within two working days to arrange a conversation, or tell you honestly if we are not the right fit.</p>' +
    '<div style="margin:36px 0 12px;">' + label('What you sent', C_INK) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid ' + C_INK + ';border-collapse:collapse;">' + rows + '</table>' +
    '<p style="margin:14px 0 0;font-family:' + F_BODY + ';font-size:14px;line-height:1.5;color:' + C_MUTED + ';">Something wrong or missing? Reply to this email and we will add it to your brief.</p>' +
    '</td></tr>' +
    // what happens next, and the footer
    '<tr><td style="background:' + C_INK + ';padding:40px 32px 36px;">' +
    label('What happens next', '#ffffff') +
    '<div style="height:6px;margin-top:16px;background:' + C_AMBER + ';font-size:0;line-height:0;">&nbsp;</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + stepRows + '</table>' +
    '<div style="height:1px;margin:40px 0 24px;background:' + C_LINE_DARK + ';font-size:0;line-height:0;">&nbsp;</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="vertical-align:middle;">' + logo(22) + '</td>' +
    '<td align="right" style="vertical-align:middle;font-family:' + F_MONO + ';font-size:14px;"><a href="' + SITE + '" style="color:' + C_AMBER + ';text-decoration:none;">' + site + '</a></td>' +
    '</tr></table>' +
    '<p style="margin:18px 0 0;font-family:' + F_BODY + ';font-size:13px;line-height:1.7;color:' + C_MUTED_DARK + ';">' +
    'VCRR &middot; Software &middot; Apps &middot; Automation. A digital software studio founded by four partners.<br>' +
    '<a href="mailto:' + INBOX + '" style="color:#ffffff;text-decoration:none;">' + INBOX + '</a><br>' +
    'You are receiving this because you sent a project brief at ' + site + '. Your details are used only to reply about this project. ' +
    '<a href="' + SITE + '/privacy" style="color:#ffffff;text-decoration:underline;">Privacy policy</a></p>' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>';

  MailApp.sendEmail({
    to: body.email,
    replyTo: INBOX,
    subject: 'We received your project brief (' + briefId + ')',
    body: plain,
    htmlBody: html,
  });
}

function briefPairs(body) {
  return [
    ['Name', body.name],
    ['Business email', body.email],
    ['Company', body.company],
    ['Project type', body.projectType],
    ['Budget range', body.budget],
    ['The problem', body.description],
  ];
}

function briefLines(body) {
  return briefPairs(body).map(([label, value]) => label + ': ' + (value || 'Not specified'));
}

/** Counts this brief against the visitor's hour and the day's total. Call it inside the script lock. */
function withinLimits(ip) {
  const props = PropertiesService.getScriptProperties();
  const cache = CacheService.getScriptCache();
  const today = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
  const day = JSON.parse(props.getProperty('DAY') || '{}');
  const sentToday = day.date === today ? day.count : 0;
  const key = 'ip:' + (ip || 'unknown');
  const fromIp = Number(cache.get(key) || 0);
  if (sentToday >= MAX_PER_DAY || fromIp >= MAX_PER_IP_PER_HOUR) return false;

  props.setProperty('DAY', JSON.stringify({ date: today, count: sentToday + 1 }));
  cache.put(key, String(fromIp + 1), 3600);
  return true;
}

/** Stops a cell being read as a formula, so a visitor cannot type =HYPERLINK(...) into the sheet. */
function safeCell(value) {
  const text = String(value || '');
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
