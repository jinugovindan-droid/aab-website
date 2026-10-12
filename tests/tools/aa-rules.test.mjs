import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const R = require('../../scripts/lib/aa-rules.js');

test('every record is complete', () => {
  for (const r of R.all()) {
    for (const k of ['id', 'label', 'value', 'unit', 'instrument', 'owner']) assert.ok(r[k] != null, `${r.id} missing ${k}`);
    assert.equal(typeof r.verified, 'boolean', `${r.id} verified flag`);
    if (r.verified) {
      assert.match(r.asAt, /^\d{4}-\d{2}-\d{2}$/, `${r.id} asAt`);
      assert.match(r.nextCheck, /^\d{4}-\d{2}-\d{2}$/, `${r.id} nextCheck`);
      assert.ok(r.article, `${r.id} article`);
    }
  }
  const ids = R.all().map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
});

test('boundaries at X-1, X and X+1', () => {
  // "exceeds" thresholds
  assert.equal(R.test('vat.mandatory_threshold', 374999), false);
  assert.equal(R.test('vat.mandatory_threshold', 375000), false);
  assert.equal(R.test('vat.mandatory_threshold', 375001), true);
  assert.equal(R.test('vat.voluntary_threshold', 187500), false);
  assert.equal(R.test('vat.voluntary_threshold', 187501), true);
  assert.equal(R.test('ct.audited_fs_revenue', 50000000), false);
  assert.equal(R.test('ct.audited_fs_revenue', 50000001), true);
  // "does not exceed"
  assert.equal(R.test('ct.sbr_revenue_threshold', 2999999), true);
  assert.equal(R.test('ct.sbr_revenue_threshold', 3000000), true);
  assert.equal(R.test('ct.sbr_revenue_threshold', 3000001), false);
  // "reaches"
  assert.equal(R.test('einv.phase1_revenue', 49999999), false);
  assert.equal(R.test('einv.phase1_revenue', 50000000), true);
});

test('effective dating', () => {
  assert.ok(R.get('ct.sbr_revenue_threshold', '2029-12-31'));
  assert.equal(R.get('ct.sbr_revenue_threshold', '2030-01-01'), null);
  assert.equal(R.get('ct.audited_fs_revenue', '2024-12-31'), null);
  assert.ok(R.get('ct.audited_fs_revenue', '2025-01-01'));
  assert.throws(() => R.value('no.such.rule'));
});

test('as-at line comes from the oldest verified check; unverified rules are listed', () => {
  assert.equal(R.asOf(), 'October 2026');
  // Every record has now been read in the primary text.
  assert.deepEqual(R.unverified().map((r) => r.id), []);
  assert.equal(R.test('ct.zero_rate_band', 375000), true);
  assert.equal(R.test('ct.zero_rate_band', 375001), false);
  assert.equal(R.value('ct.standard_rate'), 0.09);
  assert.equal(R.stale('2026-11-01').length, 0);
  assert.ok(R.stale('2027-01-01').length > 0);
});
