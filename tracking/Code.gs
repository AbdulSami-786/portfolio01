/**
 * Portfolio visitor log → Google Sheet.
 * Paste this whole file into Extensions → Apps Script of your Google Sheet,
 * then deploy it as a Web app (steps in SETUP.md).
 *
 * One row per visit. The website sends a "start" message, then pings / page changes / an "end"
 * message. They all carry the same session id (sid), so this script updates that visit's row
 * instead of adding new ones.
 */

var SHEET_NAME = 'Visitors';

var HEADERS = [
  'Session ID',      // A
  'Date',            // B  (script time zone)
  'Day',             // C
  'Time',            // D  when the visit started
  'IP address',      // E
  'Time on site (sec)', // F
  'Time on site',    // G  e.g. 2m 05s
  'Pages viewed',    // H
  'Device',          // I
  'Browser',         // J
  'Visitor timezone',// K
  'Language',        // L
  'Screen',          // M
  'Came from',       // N
  'Last seen',       // O
];

var COL = {
  SID: 1, DATE: 2, DAY: 3, TIME: 4, IP: 5, SECS: 6, DURATION: 7, PAGES: 8,
  DEVICE: 9, BROWSER: 10, TZ: 11, LANG: 12, SCREEN: 13, REFERRER: 14, LAST: 15,
};

function doGet() {
  return text_('Visitor log is running. Open your portfolio to record a visit.');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!d || typeof d.sid !== 'string' || d.sid.length < 8 || d.sid.length > 64) return text_('ignored');

    var sheet = getSheet_();
    var row = findRow_(sheet, d.sid);
    var now = new Date();
    var tz = Session.getScriptTimeZone();

    // first message of a visit (any type — order isn't guaranteed) creates the row
    if (!row) {
      sheet.appendRow([
        d.sid,
        Utilities.formatDate(now, tz, 'yyyy-MM-dd'),
        Utilities.formatDate(now, tz, 'EEEE'),
        Utilities.formatDate(now, tz, 'HH:mm:ss'),
        '', 0, '', '', '', '', '', '', '', '', '',
      ]);
      row = sheet.getLastRow();
    }

    if (d.ip) sheet.getRange(row, COL.IP).setValue(clean_(d.ip, 64));
    if (d.device) sheet.getRange(row, COL.DEVICE).setValue(clean_(d.device, 20));
    if (d.browser) sheet.getRange(row, COL.BROWSER).setValue(clean_(d.browser, 30));
    if (d.timezone) sheet.getRange(row, COL.TZ).setValue(clean_(d.timezone, 50));
    if (d.language) sheet.getRange(row, COL.LANG).setValue(clean_(d.language, 20));
    if (d.screen) sheet.getRange(row, COL.SCREEN).setValue(clean_(d.screen, 20));
    if (d.referrer) sheet.getRange(row, COL.REFERRER).setValue(clean_(d.referrer, 200));

    if (d.page) {
      var pages = String(sheet.getRange(row, COL.PAGES).getValue() || '');
      var list = pages ? pages.split(' › ') : [];
      var page = clean_(d.page, 80);
      if (list[list.length - 1] !== page) list.push(page);
      sheet.getRange(row, COL.PAGES).setValue(list.join(' › ').slice(-480));
    }

    var secs = Number(d.duration);
    if (isFinite(secs) && secs >= 0) {
      var prev = Number(sheet.getRange(row, COL.SECS).getValue()) || 0;
      secs = Math.max(prev, Math.min(Math.round(secs), 86400));
      sheet.getRange(row, COL.SECS).setValue(secs);
      sheet.getRange(row, COL.DURATION).setValue(format_(secs));
    }

    sheet.getRange(row, COL.LAST).setValue(Utilities.formatDate(now, tz, 'yyyy-MM-dd HH:mm:ss'));
    return text_('ok');
  } catch (err) {
    return text_('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.getRange('E:E').setNumberFormat('@'); // keep IPs as plain text
    sheet.getRange('H:H').setNumberFormat('@');
  }
  return sheet;
}

function findRow_(sheet, sid) {
  if (sheet.getLastRow() < 2) return 0;
  var hit = sheet.getRange(2, COL.SID, sheet.getLastRow() - 1, 1)
    .createTextFinder(sid).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function format_(secs) {
  var h = Math.floor(secs / 3600);
  var m = Math.floor((secs % 3600) / 60);
  var s = secs % 60;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  if (h) return h + 'h ' + pad(m) + 'm ' + pad(s) + 's';
  return m + 'm ' + pad(s) + 's';
}

function clean_(v, max) {
  // strip anything a spreadsheet could treat as a formula, and cap the length
  return String(v).replace(/^[=+\-@]+/, '').slice(0, max);
}

function text_(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
