// aa-money.js — money and number parsing for the tools.
//
// Rules (tools programme, M0b):
// - Work in integer fils where a figure is displayed to the fils.
// - Multiply every factor into the numerator first, divide ONCE, round ONCE,
//   half away from zero, at the end. 2,343.75 / 30 = 78.125 shows as 78.13.
// - A blank input is "not entered" (null), never 0. A negative stays negative:
//   "-1000" and "(1,000)" both read as -1000.
//
// Plain functions, no DOM. Loads as CommonJS (node tests) or as window.AAMoney.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AAMoney = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Round half away from zero to `dp` places. The value is first cleaned to
  // 9 significant decimals so binary noise (1.005 is stored as 1.00499999...)
  // does not decide the rounding.
  function roundHalfUp(x, dp) {
    if (x == null || !isFinite(x)) return x;
    var places = dp == null ? 2 : dp;
    var f = Math.pow(10, places);
    var v = Math.abs(x) * f;
    v = Number(v.toPrecision(15));
    var r = Math.floor(v + 0.5) / f;
    return x < 0 ? -r : r;
  }

  // AED (any number of decimals) to integer fils.
  function aaFils(aed) {
    if (aed == null || !isFinite(aed)) return aed;
    return Math.round(roundHalfUp(aed, 2) * 100);
  }

  // Integer fils back to AED.
  function filsToAed(fils) { return fils == null ? fils : fils / 100; }

  // One division, one rounding, to the fils: m2(2343.75, 30) -> 78.13.
  function m2(numerator, denominator) {
    var d = denominator == null ? 1 : denominator;
    if (!d) return null;
    return roundHalfUp(numerator / d, 2);
  }

  // "1,234.50" style, always two decimals; null shows as an em dash.
  function fmt2(aed) {
    if (aed == null || !isFinite(aed)) return '—';
    var v = roundHalfUp(aed, 2);
    var s = Math.abs(v).toFixed(2).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (v < 0 ? '-' : '') + s.join('.');
  }

  // Strict number parser for tool inputs.
  //   ''/'   '/null      -> null  (not entered)
  //   '-1000', '(1,000)'  -> -1000
  //   'AED 1,234.50'      -> 1234.5
  //   anything else       -> NaN  (the caller shows an error)
  function aaParseNumStrict(s) {
    if (s == null) return null;
    if (typeof s === 'number') return isFinite(s) ? s : NaN;
    var t = String(s).trim();
    if (!t) return null;
    t = t.replace(/^AED\s*/i, '').replace(/\s*AED$/i, '').replace(/[−‒–]/g, '-').replace(/\s+/g, '');
    var neg = false;
    if (/^\(.*\)$/.test(t)) { neg = true; t = t.slice(1, -1); }
    if (t.charAt(0) === '-') { neg = !neg; t = t.slice(1); }
    else if (t.charAt(0) === '+') { t = t.slice(1); }
    if (!/^(\d{1,3}(,\d{2,3})*|\d+)(\.\d+)?$/.test(t) && !/^\.\d+$/.test(t)) return NaN;
    var n = Number(t.replace(/,/g, ''));
    if (!isFinite(n)) return NaN;
    return neg ? -n : n;
  }

  // Hours: decimals or h:mm. '7:30' -> 7.5, '7.5' -> 7.5, '' -> null,
  // negative or minutes >= 60 -> NaN.
  function aaParseHours(s) {
    if (s == null) return null;
    var t = String(s).trim();
    if (!t) return null;
    var m = /^(\d+):(\d{1,2})$/.exec(t);
    if (m) {
      var mins = Number(m[2]);
      if (mins >= 60) return NaN;
      return Number(m[1]) + mins / 60;
    }
    if (!/^\d*\.?\d+$/.test(t)) return NaN;
    return Number(t);
  }

  return { roundHalfUp: roundHalfUp, aaFils: aaFils, filsToAed: filsToAed, m2: m2, fmt2: fmt2,
    aaParseNumStrict: aaParseNumStrict, aaParseHours: aaParseHours };
});
