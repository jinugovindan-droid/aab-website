// aa-rules.js — the dated rules register (tools programme, M0b).
//
// One place for every threshold, rate and date the tools rely on. Each record
// says what the value is, how it is compared, which periods it applies to, the
// instrument and article, when we last checked it and when to check again, and
// whether it was read in the primary text (verified: true) or not yet
// (verified: false — a tool must not present it as settled law).
//
// The "rules current as at" line is derived from the register (the oldest
// verified check), not typed by hand.
//
// English texts of UAE legislation are unofficial translations; the Arabic
// governs. Plain data and functions, no DOM. Loads as CommonJS (node tests) or
// as window.AARules.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AARules = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // comparator: how a figure is tested against `value`
  //   '>'  exceeds        '>=' reaches or exceeds        '<=' does not exceed
  var RULES = [
    { id: 'vat.mandatory_threshold', label: 'VAT mandatory registration threshold',
      value: 375000, unit: 'AED', comparator: '>',
      basis: 'Taxable supplies and imports in the previous 12 months, or expected in the next 30 days',
      from: null, to: null,
      instrument: 'Federal Decree-Law No. 8 of 2017 on VAT', article: 'Art 13',
      url: null, asAt: '2026-10-04', nextCheck: '2027-01-04', owner: 'AAB', verified: true },
    { id: 'vat.voluntary_threshold', label: 'VAT voluntary registration threshold',
      value: 187500, unit: 'AED', comparator: '>',
      basis: 'Taxable supplies and imports, or taxable expenses, in the previous 12 months or expected in the next 30 days',
      from: null, to: null,
      instrument: 'Federal Decree-Law No. 8 of 2017 on VAT', article: 'Art 17(1), (2)',
      url: null, asAt: '2026-10-04', nextCheck: '2027-01-04', owner: 'AAB', verified: true },
    { id: 'vat.return_due_day', label: 'VAT return and payment due',
      value: 28, unit: 'day of the month following the tax period', comparator: null,
      basis: 'Tax period end', from: null, to: null,
      instrument: 'VAT Executive Regulation', article: 'Art 64(1)',
      url: null, asAt: '2026-10-04', nextCheck: '2027-01-04', owner: 'AAB', verified: true },
    { id: 'ct.sbr_revenue_threshold', label: 'Small Business Relief revenue threshold',
      value: 3000000, unit: 'AED', comparator: '<=',
      basis: 'Revenue in the tax period and in every previous tax period',
      from: '2023-06-01', fromBasis: 'tax periods commencing on or after',
      to: '2029-12-31', toBasis: 'tax periods ending on or before',
      instrument: 'Ministerial Decision No. 73 of 2023, as amended by Ministerial Decision No. 131 of 2026', article: 'Art 2',
      url: null, asAt: '2026-10-04', nextCheck: '2027-01-04', owner: 'AAB', verified: true },
    { id: 'ct.audited_fs_revenue', label: 'Audited financial statements: revenue threshold',
      value: 50000000, unit: 'AED', comparator: '>',
      basis: 'Revenue in the relevant tax period; a taxable person that is not a tax group. Every Qualifying Free Zone Person must also prepare audited statements.',
      from: '2025-01-01', fromBasis: 'tax periods commencing on or after', to: null,
      instrument: 'Ministerial Decision No. 84 of 2025', article: 'Art 2(1)(a), Art 4',
      url: null, asAt: '2026-10-12', nextCheck: '2027-01-12', owner: 'AAB', verified: true,
      note: 'Replaced Ministerial Decision No. 82 of 2023, which still applies to tax periods that began before 1 January 2025.' },

      { id: 'ct.ifrs_for_smes_revenue', label: 'IFRS for SMEs allowed up to',
      value: 50000000, unit: 'AED', comparator: '<=', basis: 'Revenue',
      from: null, to: null, instrument: 'Ministerial Decision No. 114 of 2023', article: 'Art 4(2)',
      url: null, asAt: '2026-10-12', nextCheck: '2027-01-12', owner: 'AAB', verified: true },
    { id: 'ct.cash_basis_revenue', label: 'Cash basis allowed up to',
      value: 3000000, unit: 'AED', comparator: '<=', basis: 'Revenue; or in exceptional circumstances on application to the FTA',
      from: null, to: null, instrument: 'Ministerial Decision No. 114 of 2023', article: 'Art 2(1)',
      url: null, asAt: '2026-10-12', nextCheck: '2027-01-12', owner: 'AAB', verified: true },
    { id: 'ct.zero_rate_band', label: 'Corporate Tax 0% band',
      value: 375000, unit: 'AED of taxable income', comparator: '<=', basis: 'Taxable income in the tax period, one band per taxable person however many businesses it runs',
      from: null, to: null, instrument: 'Cabinet Decision No. 116 of 2022', article: 'Art 2(1)',
      url: 'https://mof.gov.ae/wp-content/uploads/2023/04/Cabinet-Decision-No-116-of-2022-on-the-annual-Taxable-Income-subject-to-Corporate-Tax.pdf',
      asAt: '2026-10-12', nextCheck: '2027-01-12', owner: 'AAB', verified: true,
      note: 'Made under Federal Decree-Law No. 47 of 2022, Art 3(1)(a). Splitting a business to get more than one band is an arrangement under Art 50 (Art 2(2)).' },
    { id: 'ct.standard_rate', label: 'Corporate Tax rate above the band',
      value: 0.09, unit: 'rate', comparator: null, basis: 'Taxable income above AED 375,000',
      from: null, to: null, instrument: 'Cabinet Decision No. 116 of 2022', article: 'Art 3',
      url: 'https://mof.gov.ae/wp-content/uploads/2023/04/Cabinet-Decision-No-116-of-2022-on-the-annual-Taxable-Income-subject-to-Corporate-Tax.pdf',
      asAt: '2026-10-12', nextCheck: '2027-01-12', owner: 'AAB', verified: true },
    { id: 'ct.return_due_months', label: 'Corporate Tax return due',
      value: 9, unit: 'months after the end of the tax period', comparator: null, basis: 'Tax period end',
      from: null, to: null, instrument: 'Federal Decree-Law No. 47 of 2022', article: 'Art 53(1)',
      url: null, asAt: '2026-10-12', nextCheck: '2027-01-12', owner: 'AAB', verified: true,
      note: 'Or by such other date as the Authority directs.' },
    { id: 'einv.phase1_revenue', label: 'E-invoicing Phase 1 revenue',
      value: 50000000, unit: 'AED', comparator: '>=', basis: 'Annual revenue',
      from: null, to: null, instrument: 'Ministerial Decision No. 244 of 2025', article: 'Art 5(1)(a)',
      url: null, asAt: '2026-10-12', nextCheck: '2027-01-12', owner: 'AAB', verified: true,
      note: 'Threshold read in the original text. The appointment deadline was later amended (to 30 October 2026); the e-invoicing pages record no change to the threshold.' },
  ];

  function dateKey(s) { return s ? String(s) : null; }
  function all() { return RULES.slice(); }
  // The record for id. With onDate ('YYYY-MM-DD'), only when it applies then.
  function get(id, onDate) {
    var r = null;
    for (var i = 0; i < RULES.length; i++) if (RULES[i].id === id) { r = RULES[i]; break; }
    if (!r || !onDate) return r;
    var d = dateKey(onDate);
    if (r.from && d < r.from) return null;
    if (r.to && d > r.to) return null;
    return r;
  }
  function value(id) { var r = get(id); if (!r) throw new Error('aa-rules: unknown rule ' + id); return r.value; }
  // Does figure x meet the record's test? (exceeds / reaches / does not exceed)
  function test(id, x) {
    var r = get(id); if (!r) throw new Error('aa-rules: unknown rule ' + id);
    switch (r.comparator) {
      case '>': return x > r.value;
      case '>=': return x >= r.value;
      case '<=': return x <= r.value;
      default: throw new Error('aa-rules: ' + id + ' has no comparator');
    }
  }
  function unverified() { return RULES.filter(function (r) { return !r.verified; }); }
  // Verified records whose last check is more than `days` before today.
  function stale(today, days) {
    var lim = days == null ? 45 : days;
    var t = Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10));
    return RULES.filter(function (r) {
      if (!r.verified || !r.asAt) return false;
      var a = Date.UTC(+r.asAt.slice(0, 4), +r.asAt.slice(5, 7) - 1, +r.asAt.slice(8, 10));
      return (t - a) / 86400000 > lim;
    });
  }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // "Rules current as at <Month YYYY>": the OLDEST verified check, so the line
  // never claims more currency than the stalest figure has.
  function asOf() {
    var d = RULES.filter(function (r) { return r.verified && r.asAt; }).map(function (r) { return r.asAt; }).sort()[0];
    return d ? MONTHS[+d.slice(5, 7) - 1] + ' ' + d.slice(0, 4) : null;
  }

  return { all: all, get: get, value: value, test: test, unverified: unverified, stale: stale, asOf: asOf };
});
