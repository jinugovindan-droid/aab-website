import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const D = require('../../scripts/lib/aa-dates.js');
const p = D.parse, iso = D.iso;

test('parse refuses impossible dates instead of rolling them', () => {
  assert.equal(p('2026-02-31'), null);
  assert.equal(p('2027-02-29'), null);
  assert.deepEqual(p('2028-02-29'), { y: 2028, m: 2, d: 29 });
  assert.equal(p('31/12/2026'), null);
});

test('weekdays are computed in UTC, not local time', () => {
  assert.equal(D.weekday(p('2027-02-28')), 0);   // Sunday
  assert.equal(D.weekday(p('2026-10-12')), 1);   // Monday
  assert.ok(D.isWeekend(p('2026-10-10')));       // Saturday
});

test('addMonths clamps; addMonthsEOM keeps month ends (CT due dates, our reading)', () => {
  assert.equal(iso(D.addMonths(p('2026-01-31'), 1)), '2026-02-28');
  assert.equal(iso(D.addMonths(p('2028-01-31'), 1)), '2028-02-29');
  assert.equal(iso(D.addMonths(p('2026-02-28'), 9)), '2026-11-28');
  assert.equal(iso(D.addMonthsEOM(p('2026-02-28'), 9)), '2026-11-30');
  assert.equal(iso(D.addMonthsEOM(p('2025-12-31'), 9)), '2026-09-30');
  assert.equal(iso(D.addMonthsEOM(p('2026-06-30'), 9)), '2027-03-31');
  assert.equal(iso(D.addMonths(p('2026-11-15'), 3)), '2027-02-15');
  assert.equal(iso(D.addMonths(p('2026-03-15'), -3)), '2025-12-15');
});

test('monthly penalty dates: CT uses month end, VAT uses the 1st of the next month', () => {
  const anchor = p('2027-01-29');
  assert.equal(iso(D.monthlyDate(anchor, 1, 'ct')), '2027-02-28');
  assert.equal(iso(D.monthlyDate(anchor, 1, 'vat')), '2027-03-01');
  assert.equal(iso(D.monthlyDate(anchor, 2, 'vat')), '2027-03-29');
  assert.equal(iso(D.monthlyDate(p('2026-12-31'), 2, 'vat')), '2027-03-01');
  assert.equal(iso(D.monthlyDate(p('2026-10-31'), 1, 'vat')), '2026-12-01');
  assert.equal(iso(D.monthlyDate(p('2026-10-31'), 2, 'vat')), '2026-12-31');
  assert.deepEqual(D.monthlySeries(p('2026-08-31'), 3, 'ct').map(iso), ['2026-09-30', '2026-10-31', '2026-11-30']);
  assert.throws(() => D.monthlyDate(anchor, 1, 'x'));
});

test('a deadline on a non-business day moves to the next business day (TPL Art 49)', () => {
  const r = D.rollToBusinessDay(p('2027-02-28'));       // Sunday
  assert.equal(iso(r.date), '2027-03-01');
  assert.equal(r.moved, true);
  const w = D.rollToBusinessDay(p('2026-12-02'));       // National Day, Wednesday
  assert.equal(iso(w.date), '2026-12-04');               // 3 Dec holiday, 4 Dec Friday
  const ok = D.rollToBusinessDay(p('2027-09-30'));      // Thursday
  assert.equal(ok.moved, false);
  assert.equal(iso(ok.date), '2027-09-30');
});

test('a roll that touches a provisional holiday is flagged', () => {
  const r = D.rollToBusinessDay(p('2026-05-28'));       // expected Eid al-Adha
  assert.equal(iso(r.date), '2026-06-01');               // 29 May Fri holiday, 30-31 weekend
  assert.equal(r.provisional, true);
  const out = D.rollToBusinessDay(p('2029-01-06'));
  assert.equal(out.unchecked, true);                      // outside the holiday table
});

test('periods: the event day is not counted', () => {
  // 20 days from Thursday 1 October 2026 ends Wednesday 21 October
  assert.equal(iso(D.deadlineAfterDays(p('2026-10-01'), 20).date), '2026-10-21');
  // 10 business days from Monday 12 October 2026: 26 October
  assert.equal(iso(D.addBusinessDays(p('2026-10-12'), 10).date), '2026-10-26');
});
