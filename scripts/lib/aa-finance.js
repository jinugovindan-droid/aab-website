// aa-finance.js — the finance core shared by the loan, mortgage and
// business-finance tools (tools programme, M0b).
//
// Conventions pinned by the tests (tests/tools/aa-finance.test.mjs):
// - Payment: standard annuity; a zero rate gives P / n.
// - Rate solver: Newton from a flat-rate seed, bisection fallback on
//   (1e-12, 1], tolerance 1e-12. A payment that cannot repay the principal
//   returns { ok: false, reason } instead of NaN.
// - Schedule: interest rounded to the fils on each row, the last row absorbs
//   the residual, and totals are the sums of the rows (not E x n - P).
// - NPV: the first flow is at t = 0 and is NOT discounted (unlike Excel NPV).
// - IRR / XIRR: every sign change found by scanning is solved, so the caller
//   can say "no rate" or "two rates" instead of showing one misleading number.
//
// Plain functions, no DOM. Loads as CommonJS (node tests) or as window.AAFinance.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AAFinance = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function r2(x) { // half away from zero, to the fils, noise-cleaned
    var v = Number((Math.abs(x) * 100).toPrecision(15));
    var r = Math.floor(v + 0.5) / 100;
    return x < 0 ? -r : r;
  }

  // Periodic payment for principal P at periodic rate r over n periods.
  function pmtPeriodic(P, r, n) {
    if (!(n > 0)) return NaN;
    if (r === 0) return P / n;
    return P * r / (1 - Math.pow(1 + r, -n));
  }
  // Annual nominal rate, payments per year (default 12).
  function pmt(P, annualRate, n, ppy) { return pmtPeriodic(P, annualRate / (ppy || 12), n); }

  // Present value of n payments of A at periodic rate r.
  function pvAnnuity(A, r, n) { return r === 0 ? A * n : A * (1 - Math.pow(1 + r, -n)) / r; }

  // Periodic rate that makes n payments of A repay principal P.
  // seed: optional starting guess (periodic).
  function rateSolve(P, A, n, seed) {
    if (!(P > 0) || !(A > 0) || !(n > 0)) return { ok: false, reason: 'Principal, instalment and term must all be above zero.' };
    var total = A * n;
    if (Math.abs(total - P) < 1e-9) return { ok: true, rate: 0 };
    if (total < P) return { ok: false, reason: 'These instalments add up to less than the amount borrowed, so there is no interest rate to show.' };
    var f = function (r) { return pvAnnuity(A, r, n) - P; };
    // Newton from the flat-rate approximation 2*flat*n/(n+1), per period.
    var flatPer = (total - P) / P / n;
    var r = seed != null ? seed : Math.max(1e-9, 2 * flatPer * n / (n + 1));
    for (var i = 0; i < 100; i++) {
      var h = Math.max(1e-10, r * 1e-6);
      var fr = f(r), d = (f(r + h) - f(r - h)) / (2 * h);
      if (!isFinite(fr) || !isFinite(d) || d === 0) break;
      var next = r - fr / d;
      if (!(next > 0) || next > 1) break;
      if (Math.abs(next - r) < 1e-12) { r = next; return { ok: true, rate: r, method: 'newton' }; }
      r = next;
    }
    // Bisection on (1e-12, 1]: f is decreasing in r.
    var lo = 1e-12, hi = 1;
    if (f(hi) > 0) return { ok: false, reason: 'The implied rate is above 100% per period, which this tool does not report.' };
    for (var j = 0; j < 300; j++) {
      var mid = (lo + hi) / 2;
      if (f(mid) > 0) lo = mid; else hi = mid;
      if (hi - lo < 1e-12) break;
    }
    return { ok: true, rate: (lo + hi) / 2, method: 'bisection' };
  }

  // Number of periods to repay P with instalment A at periodic rate r.
  function nper(P, A, r) {
    if (!(P > 0) || !(A > 0)) return { ok: false, reason: 'Amount and instalment must be above zero.' };
    if (r === 0) return { ok: true, n: P / A };
    if (A <= P * r) return { ok: false, reason: 'The instalment does not cover the interest, so the loan would never be repaid.' };
    return { ok: true, n: -Math.log(1 - P * r / A) / Math.log(1 + r) };
  }

  // A flat rate quoted per year, converted to the reducing-balance rate with the
  // same instalment. Returns nominal (periodic x ppy) and effective annual rates.
  function flatToReducing(P, flatAnnual, n, ppy) {
    var p = ppy || 12;
    var interest = P * flatAnnual * (n / p);
    var A = (P + interest) / n;
    var s = rateSolve(P, A, n, 2 * flatAnnual / p * n / (n + 1));
    if (!s.ok) return s;
    return { ok: true, instalment: A, totalInterest: interest, periodic: s.rate,
      nominal: s.rate * p, effective: Math.pow(1 + s.rate, p) - 1 };
  }

  // Amortisation schedule. The instalment is rounded to the fils; each row's
  // interest is rounded to the fils; the last row clears the balance.
  function schedule(P, annualRate, n, ppy) {
    var p = ppy || 12, r = annualRate / p;
    var A = r2(pmtPeriodic(P, r, n));
    var bal = r2(P), rows = [], ti = 0, tp = 0, tpay = 0;
    for (var k = 1; k <= n; k++) {
      var interest = r2(bal * r);
      var pay = k === n ? r2(bal + interest) : A;
      var principal = r2(pay - interest);
      bal = r2(bal - principal);
      rows.push({ k: k, payment: pay, interest: interest, principal: principal, balance: bal });
      ti = r2(ti + interest); tp = r2(tp + principal); tpay = r2(tpay + pay);
    }
    return { instalment: A, rows: rows, totalInterest: ti, totalPrincipal: tp, totalPaid: tpay };
  }

  // All-in annual cost: the rate at which the instalments repay the NET amount
  // received (principal less up-front fees). Both nominal and effective.
  function allInCost(P, fees, A, n, ppy) {
    var p = ppy || 12;
    var s = rateSolve(P - (fees || 0), A, n);
    if (!s.ok) return s;
    return { ok: true, periodic: s.rate, nominal: s.rate * p, effective: Math.pow(1 + s.rate, p) - 1 };
  }

  // NPV with the first flow at t = 0, undiscounted.
  function npv(rate, flows) {
    var s = 0;
    for (var t = 0; t < flows.length; t++) s += flows[t] / Math.pow(1 + rate, t);
    return s;
  }

  function bisectRoot(f, lo, hi) {
    var flo = f(lo);
    for (var i = 0; i < 300; i++) {
      var mid = (lo + hi) / 2, fm = f(mid);
      if (fm === 0) return mid;
      if ((fm > 0) === (flo > 0)) { lo = mid; flo = fm; } else hi = mid;
      if (hi - lo < 1e-13) break;
    }
    return (lo + hi) / 2;
  }
  // Scan (-0.99, 10] for sign changes and solve each one.
  function scanRoots(f) {
    var grid = [];
    for (var x = -0.99; x < 0; x += 0.01) grid.push(x);
    for (var y = 0; y <= 1; y += 0.0025) grid.push(y);
    for (var z = 1.01; z <= 10; z += 0.01) grid.push(z);
    var roots = [];
    for (var i = 1; i < grid.length; i++) {
      var a = grid[i - 1], b = grid[i], fa = f(a), fb = f(b);
      if (!isFinite(fa) || !isFinite(fb)) continue;
      if (fa === 0) { roots.push(a); continue; }
      if ((fa > 0) !== (fb > 0)) roots.push(bisectRoot(f, a, b));
    }
    // de-duplicate roots closer than 1e-9
    return roots.filter(function (r, i) { return i === 0 || Math.abs(r - roots[i - 1]) > 1e-9; });
  }
  // Every IRR in (-99%, 1000%]. { roots: [...] } — empty when the flows never
  // change sign or no rate solves them.
  function irr(flows) {
    var pos = flows.some(function (v) { return v > 0; }), neg = flows.some(function (v) { return v < 0; });
    if (!pos || !neg) return { roots: [], reason: 'The cash flows need at least one outflow and one inflow.' };
    return { roots: scanRoots(function (r) { return npv(r, flows); }) };
  }
  // XIRR for dated flows [{ date: {y,m,d}, amount }], actual/365 from the first date.
  function xirr(items) {
    var d0 = Date.UTC(items[0].date.y, items[0].date.m - 1, items[0].date.d);
    var ts = items.map(function (it) { return (Date.UTC(it.date.y, it.date.m - 1, it.date.d) - d0) / 86400000 / 365; });
    var f = function (r) { var s = 0; for (var i = 0; i < items.length; i++) s += items[i].amount / Math.pow(1 + r, ts[i]); return s; };
    var pos = items.some(function (v) { return v.amount > 0; }), neg = items.some(function (v) { return v.amount < 0; });
    if (!pos || !neg) return { roots: [], reason: 'The cash flows need at least one outflow and one inflow.' };
    return { roots: scanRoots(f) };
  }

  // Payback period in periods, interpolated within the period it is reached.
  // With a rate, the discounted payback. null when never reached.
  function payback(flows, rate) {
    var cum = 0;
    for (var t = 0; t < flows.length; t++) {
      var v = rate ? flows[t] / Math.pow(1 + rate, t) : flows[t];
      var prev = cum; cum += v;
      if (t > 0 && prev < 0 && cum >= 0) return (t - 1) + (-prev / v);
    }
    return null;
  }

  // Break-even units: fixed costs / (price - variable cost per unit).
  function breakEven(fixed, price, variable) {
    var cm = price - variable;
    if (!(cm > 0)) return { ok: false, reason: 'The price does not cover the variable cost per unit, so there is no break-even point.' };
    return { ok: true, units: fixed / cm, revenue: fixed / cm * price, marginRatio: cm / price };
  }

  return { pmt: pmt, pmtPeriodic: pmtPeriodic, pvAnnuity: pvAnnuity, rateSolve: rateSolve, nper: nper,
    flatToReducing: flatToReducing, schedule: schedule, allInCost: allInCost, npv: npv, irr: irr, xirr: xirr,
    payback: payback, breakEven: breakEven };
});
