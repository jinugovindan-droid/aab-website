// aa-dates.js — calendar arithmetic for the tax and labour tools.
//
// Dates are plain {y, m, d} integers (m = 1..12). JavaScript Date is used only
// through Date.UTC to count days, never at local midnight: Dubai is UTC+4, and a
// local-midnight Date lands on the previous day for some visitors.
//
// Two month-end rules exist and must not be mixed (tools programme, M0b):
// - CT penalties: if the monthly date does not exist, use the LAST day of that
//   month (Cabinet Decision No. 75 of 2023, Art 3).
// - VAT penalties: if it does not exist, use the FIRST day of the next month
//   (Cabinet Decision No. 49 of 2021 note in the CD 40 consolidation).
// Deadlines: the day of the event is not counted, and a deadline that ends on a
// day that is not a Business Day moves to the next Business Day (Tax Procedures
// Law, Art 49(1)-(2)); a Business Day is any day that is not a weekend or an
// official holiday of the federal government (Art 1).
//
// Plain functions, no DOM. Loads as CommonJS (node tests) or as window.AADates.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AADates = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var DAY = 86400000;

  // Federal government official holidays. Islamic dates follow moon sighting,
  // so a row stays 'provisional' until the year's official announcement is read;
  // fixed civil dates are 'fixed'. A deadline that rolls over, or lands next to,
  // a provisional row is reported as provisional by rollToBusinessDay().
  var HOLIDAYS = [
    ['2026-01-01', "New Year's Day", 'fixed'],
    ['2026-03-20', 'Eid al-Fitr', 'provisional'],
    ['2026-03-21', 'Eid al-Fitr', 'provisional'],
    ['2026-03-22', 'Eid al-Fitr', 'provisional'],
    ['2026-05-26', 'Arafat Day', 'provisional'],
    ['2026-05-27', 'Eid al-Adha', 'provisional'],
    ['2026-05-28', 'Eid al-Adha', 'provisional'],
    ['2026-05-29', 'Eid al-Adha', 'provisional'],
    ['2026-06-16', 'Hijri New Year', 'provisional'],
    ['2026-08-25', "Prophet's Birthday", 'provisional'],
    ['2026-12-01', 'Commemoration Day', 'provisional'],
    ['2026-12-02', 'National Day', 'fixed'],
    ['2026-12-03', 'National Day', 'fixed'],
    ['2027-01-01', "New Year's Day", 'fixed'],
    ['2027-03-10', 'Eid al-Fitr (estimate)', 'provisional'],
    ['2027-03-11', 'Eid al-Fitr (estimate)', 'provisional'],
    ['2027-03-12', 'Eid al-Fitr (estimate)', 'provisional'],
    ['2027-05-15', 'Arafat Day (estimate)', 'provisional'],
    ['2027-05-16', 'Eid al-Adha (estimate)', 'provisional'],
    ['2027-05-17', 'Eid al-Adha (estimate)', 'provisional'],
    ['2027-05-18', 'Eid al-Adha (estimate)', 'provisional'],
    ['2027-06-06', 'Hijri New Year (estimate)', 'provisional'],
    ['2027-08-14', "Prophet's Birthday (estimate)", 'provisional'],
    ['2027-12-01', 'Commemoration Day', 'provisional'],
    ['2027-12-02', 'National Day', 'fixed'],
    ['2027-12-03', 'National Day', 'fixed'],
  ].map(function (r) { return { date: parse(r[0]), name: r[1], status: r[2] }; });
  // Years the table covers; outside them a roll is reported as unchecked.
  var HOLIDAY_YEARS = [2026, 2027];

  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function daysInMonth(y, m) { return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]; }
  function ymd(y, m, d) { return { y: y, m: m, d: d }; }
  function isValid(a) {
    return !!a && Number.isInteger(a.y) && Number.isInteger(a.m) && Number.isInteger(a.d) &&
      a.m >= 1 && a.m <= 12 && a.d >= 1 && a.d <= daysInMonth(a.y, a.m);
  }
  // 'YYYY-MM-DD' -> {y,m,d}; impossible dates (31 Feb) return null, never roll.
  function parse(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
    if (!m) return null;
    var a = ymd(+m[1], +m[2], +m[3]);
    return isValid(a) ? a : null;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(a) { return a.y + '-' + pad(a.m) + '-' + pad(a.d); }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmtLong(a) { return a.d + ' ' + MONTHS[a.m - 1] + ' ' + a.y; }

  function serial(a) { return Math.round(Date.UTC(a.y, a.m - 1, a.d) / DAY); }
  function fromSerial(n) { var t = new Date(n * DAY); return ymd(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); }
  function cmp(a, b) { return serial(a) - serial(b); }
  function same(a, b) { return cmp(a, b) === 0; }
  function addDays(a, n) { return fromSerial(serial(a) + n); }
  function diffDays(a, b) { return serial(b) - serial(a); }
  // 0 = Sunday ... 6 = Saturday
  function weekday(a) { return new Date(Date.UTC(a.y, a.m - 1, a.d)).getUTCDay(); }
  // Federal government weekend: Saturday and Sunday (since 1 January 2022).
  function isWeekend(a) { var w = weekday(a); return w === 0 || w === 6; }
  function holidayOn(a) {
    for (var i = 0; i < HOLIDAYS.length; i++) if (same(HOLIDAYS[i].date, a)) return HOLIDAYS[i];
    return null;
  }
  function isBusinessDay(a) { return !isWeekend(a) && !holidayOn(a); }

  // Same day n months later; a day that does not exist clamps to month end.
  function addMonths(a, n) {
    var t = (a.y * 12 + (a.m - 1)) + n;
    var y = Math.floor(t / 12), m = (t % 12 + 12) % 12 + 1;
    return ymd(y, m, Math.min(a.d, daysInMonth(y, m)));
  }
  // Month-end aligned: from the last day of a month, land on the last day of the
  // target month (28 Feb + 9 months = 30 Nov). Our reading for CT due dates.
  function addMonthsEOM(a, n) {
    var r = addMonths(a, n);
    if (a.d === daysInMonth(a.y, a.m)) r.d = daysInMonth(r.y, r.m);
    return r;
  }

  // The k-th monthly date after `anchor` (k = 1, 2, ...). When that day does not
  // exist in the month: rule 'ct' -> last day of that month; rule 'vat' -> first
  // day of the next month.
  function monthlyDate(anchor, k, rule) {
    var t = (anchor.y * 12 + (anchor.m - 1)) + k;
    var y = Math.floor(t / 12), m = (t % 12 + 12) % 12 + 1, dim = daysInMonth(y, m);
    if (anchor.d <= dim) return ymd(y, m, anchor.d);
    if (rule === 'ct') return ymd(y, m, dim);
    if (rule === 'vat') return m === 12 ? ymd(y + 1, 1, 1) : ymd(y, m + 1, 1);
    throw new Error("monthlyDate: rule must be 'ct' or 'vat'");
  }
  function monthlySeries(anchor, count, rule) {
    var out = [];
    for (var k = 1; k <= count; k++) out.push(monthlyDate(anchor, k, rule));
    return out;
  }

  // Move a deadline that is not a Business Day to the next Business Day.
  // Returns { date, moved, passed: [holiday rows skipped], provisional, unchecked }.
  function rollToBusinessDay(a) {
    var d = a, passed = [], guard = 0;
    while (!isBusinessDay(d) && guard++ < 30) {
      var h = holidayOn(d); if (h) passed.push(h);
      d = addDays(d, 1);
    }
    var near = [addDays(d, -1), d, addDays(d, 1)].map(holidayOn).filter(Boolean);
    return {
      date: d,
      moved: !same(d, a),
      passed: passed,
      provisional: passed.concat(near).some(function (h) { return h.status === 'provisional'; }),
      unchecked: HOLIDAY_YEARS.indexOf(d.y) === -1 || HOLIDAY_YEARS.indexOf(a.y) === -1,
    };
  }
  // A period of n days from an event: the event day is not counted (Art 49(1)),
  // then the end rolls to a Business Day (Art 49(2)).
  function deadlineAfterDays(event, n) { return rollToBusinessDay(addDays(event, n)); }

  // n Business Days after an event (event day not counted).
  function addBusinessDays(a, n) {
    var d = a, c = 0, passed = [];
    while (c < n) { d = addDays(d, 1); if (isBusinessDay(d)) c++; else { var h = holidayOn(d); if (h) passed.push(h); } }
    return { date: d, passed: passed, provisional: passed.some(function (h) { return h.status === 'provisional'; }) };
  }

  return {
    HOLIDAYS: HOLIDAYS, HOLIDAY_YEARS: HOLIDAY_YEARS,
    ymd: ymd, isLeap: isLeap, daysInMonth: daysInMonth, isValid: isValid, parse: parse, iso: iso, fmtLong: fmtLong,
    serial: serial, fromSerial: fromSerial, cmp: cmp, same: same, addDays: addDays, diffDays: diffDays,
    weekday: weekday, isWeekend: isWeekend, holidayOn: holidayOn, isBusinessDay: isBusinessDay,
    addMonths: addMonths, addMonthsEOM: addMonthsEOM, monthlyDate: monthlyDate, monthlySeries: monthlySeries,
    rollToBusinessDay: rollToBusinessDay, deadlineAfterDays: deadlineAfterDays, addBusinessDays: addBusinessDays,
  };
});
