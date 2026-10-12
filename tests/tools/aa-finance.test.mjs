import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const F = require('../../scripts/lib/aa-finance.js');
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} expected ${b}, got ${a}`);

// Reference values are Microsoft Excel's documented examples, not this code.
test('PMT matches Excel', () => {
  near(F.pmt(10000, 0.08, 10, 12), 1037.03, 0.005, 'PMT(8%/12,10,10000)');
  near(F.pmt(1000000, 0.05, 360, 12), 5368.2162, 0.0001, 'PMT(5%/12,360,1e6)');
  assert.equal(F.pmt(1200, 0, 12, 12), 100);           // zero rate gives P/n
});

test('RATE matches Excel to 1e-4', () => {
  const s = F.rateSolve(8000, 200, 48);               // RATE(48,-200,8000) = 0.77%
  assert.ok(s.ok);
  near(s.rate, 0.0077014724, 1e-4 * 0.0077, 'monthly rate');
  near(s.rate * 12, 0.09241767, 1e-4, 'annual');
});

test('rate solver refuses impossible inputs with a message', () => {
  const s = F.rateSolve(100000, 1000, 60);            // 60,000 repays less than 100,000
  assert.equal(s.ok, false);
  assert.match(s.reason, /less than the amount borrowed/);
  assert.deepEqual(F.rateSolve(1200, 100, 12), { ok: true, rate: 0 });
});

test('NPER, and an instalment below the interest is refused', () => {
  near(F.nper(8000, 200, 0.0077014724).n, 48, 1e-6);
  assert.equal(F.nper(100000, 500, 0.01).ok, false);
});

test('flat rate to reducing balance', () => {
  // 100,000 at 5% flat for 5 years monthly: instalment 2,083.33; reducing rate
  // checked independently by bisection below.
  const r = F.flatToReducing(100000, 0.05, 60, 12);
  assert.ok(r.ok);
  near(r.instalment, 2083.3333, 1e-4);
  assert.equal(r.totalInterest, 25000);
  let lo = 1e-9, hi = 1;
  const f = (x) => 2083.333333333 * (1 - Math.pow(1 + x, -60)) / x - 100000;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
  near(r.periodic, (lo + hi) / 2, 1e-10, 'periodic');
  near(r.nominal, 0.0913, 0.0005, 'about 9.1% reducing');
  assert.ok(r.effective > r.nominal);
});

test('schedule: rows are rounded, the last row clears, totals are sums', () => {
  const s = F.schedule(1000000, 0.05, 360, 12);
  assert.equal(s.instalment, 5368.22);
  const last = s.rows[s.rows.length - 1];
  assert.equal(last.balance, 0);
  const sumP = s.rows.reduce((a, r) => a + Math.round(r.principal * 100), 0) / 100;
  const sumI = s.rows.reduce((a, r) => a + Math.round(r.interest * 100), 0) / 100;
  assert.equal(sumP, 1000000);
  assert.equal(s.totalPrincipal, 1000000);
  near(s.totalInterest, sumI, 0.001);
  near(s.totalPaid, 1000000 + sumI, 0.001);
  assert.equal(s.rows[0].interest, 4166.67);
  assert.equal(s.rows[0].principal, 1201.55);
});

test('NPV: t0 undiscounted, so Excel NPV equals ours with a leading zero', () => {
  // Excel NPV(10%, -10000, 3000, 4200, 6800) = 1,188.44
  near(F.npv(0.1, [0, -10000, 3000, 4200, 6800]), 1188.44, 0.005);
  near(F.npv(0.1, [-1000, 500, 500, 500]), 243.43, 0.005);
});

test('IRR reports every root, or none', () => {
  // Excel IRR(-70000,12000,15000,18000,21000,26000) = 8.66%
  const a = F.irr([-70000, 12000, 15000, 18000, 21000, 26000]);
  assert.equal(a.roots.length, 1);
  near(a.roots[0], 0.086630948, 1e-7);
  // Excel IRR(-70000,12000,15000,18000,21000) = -2.12%
  near(F.irr([-70000, 12000, 15000, 18000, 21000]).roots[0], -0.021244848, 1e-7);
  const two = F.irr([-100, 230, -132]);                // 10% and 20%
  assert.equal(two.roots.length, 2);
  near(two.roots[0], 0.10, 1e-9); near(two.roots[1], 0.20, 1e-9);
  assert.deepEqual(F.irr([100, 100]).roots, []);
});

test('XIRR matches Excel', () => {
  const d = (y, m, dd) => ({ y, m, d: dd });
  const x = F.xirr([
    { date: d(2008, 1, 1), amount: -10000 }, { date: d(2008, 3, 1), amount: 2750 },
    { date: d(2008, 10, 30), amount: 4250 }, { date: d(2009, 2, 15), amount: 3250 },
    { date: d(2009, 4, 1), amount: 2750 },
  ]);
  assert.equal(x.roots.length, 1);
  near(x.roots[0], 0.373362535, 1e-6);
});

test('payback and break-even', () => {
  assert.equal(F.payback([-1000, 300, 400, 500]), 2.6);
  assert.equal(F.payback([-1000, 100, 100]), null);
  const b = F.breakEven(10000, 50, 30);
  assert.equal(b.units, 500); assert.equal(b.revenue, 25000);
  assert.equal(F.breakEven(10000, 30, 30).ok, false);
});
