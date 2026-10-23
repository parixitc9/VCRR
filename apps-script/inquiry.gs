/**
 * VCRR project-inquiry receiver: a Google Apps Script web app owned by vcrrit@gmail.com.
 * Only the site's /api/inquiry function calls it, server to server. Each brief is emailed to INBOX.
 *
 * One-time setup:
 *  1. script.google.com → New project → paste this file → save.
 *  2. Project Settings → Script properties → add INQUIRY_SECRET with the same value as INQUIRY_SECRET in Vercel.
 *  3. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy. Approve the permissions.
 *  4. Copy the Web app URL (ends in /exec) into Vercel as INQUIRY_SCRIPT_URL.
 * After any change to this file: Deploy → Manage deployments → edit → Version: New version → Deploy.
 */

const INBOX = 'vcrrit@gmail.com';
const MAX_PER_IP_PER_HOUR = 3;
const MAX_PER_DAY = 30; // all briefs together; keeps well inside Gmail's daily sending limit

function doGet() {
  return reply({ ok: true, service: 'vcrr-inquiry' });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const secret = PropertiesService.getScriptProperties().getProperty('INQUIRY_SECRET');
  if (!secret || body.secret !== secret) return reply({ ok: false, error: 'forbidden' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let allowed;
  try {
    allowed = withinLimits(body.ip);
  } finally {
    lock.releaseLock();
  }
  if (!allowed) return reply({ ok: false, error: 'limit' });

  const lines = [
    ['Name', body.name],
    ['Email', body.email],
    ['Company', body.company],
    ['Project type', body.projectType],
    ['Budget', body.budget],
    ['The problem', body.description],
  ].map(([label, value]) => label + ': ' + (value || 'Not specified'));

  MailApp.sendEmail({
    to: INBOX,
    replyTo: body.email,
    subject: ('Project brief: ' + (body.company || body.name || 'website')).replace(/[\r\n]+/g, ' ').slice(0, 200),
    body: lines.join('\n') + '\n\nReply to this email to answer ' + (body.name || 'the sender') + '.',
  });
  return reply({ ok: true });
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

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
