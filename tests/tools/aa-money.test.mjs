import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const M = require('../../scripts/lib/aa-money.js');

test('one division, one rounding, half away from zero', () => {
  assert.equal(M.m2(2343.75, 30), 78.13);          // 78.125 -> 78.13 (labour daily wage)
  assert.equal(M.roundHalfUp(1.005, 2), 1.01);      // binary noise does not decide
  assert.equal(M.roundHalfUp(-1.005, 2), -1.01);
  assert.equal(M.roundHalfUp(2.675, 2), 2.68);
  assert.equal(M.roundHalfUp(78.124999, 2), 78.12);
  assert.equal(M.m2(1, 0), null);
});

test('fils are integers', () => {
  assert.equal(M.aaFils(0.1 + 0.2), 30);
  assert.equal(M.aaFils(1234.565), 123457);
  assert.equal(M.filsToAed(123457), 1234.57);
});

test('formatting to the fils', () => {
  assert.equal(M.fmt2(1234567.5), '1,234,567.50');
  assert.equal(M.fmt2(-0.005), '-0.01');
  assert.equal(M.fmt2(null), '—');
});

test('strict parser: blank is not zero, the sign survives', () => {
  assert.equal(M.aaParseNumStrict(''), null);
  assert.equal(M.aaParseNumStrict('   '), null);
  assert.equal(M.aaParseNumStrict(null), null);
  assert.equal(M.aaParseNumStrict('-1000'), -1000);
  assert.equal(M.aaParseNumStrict('(1,000)'), -1000);
  assert.equal(M.aaParseNumStrict('−500'), -500);              // unicode minus
  assert.equal(M.aaParseNumStrict('AED 1,234.50'), 1234.5);
  assert.equal(M.aaParseNumStrict('1,23,456'), 123456);        // lakh grouping
  assert.equal(M.aaParseNumStrict('0'), 0);
  assert.equal(M.aaParseNumStrict('.5'), 0.5);
  assert.ok(Number.isNaN(M.aaParseNumStrict('abc')));
  assert.ok(Number.isNaN(M.aaParseNumStrict('12-3')));
  assert.ok(Number.isNaN(M.aaParseNumStrict('1.2.3')));
});

test('hours: decimals and h:mm', () => {
  assert.equal(M.aaParseHours('7:30'), 7.5);
  assert.equal(M.aaParseHours('7.5'), 7.5);
  assert.equal(M.aaParseHours('0:45'), 0.75);
  assert.equal(M.aaParseHours(''), null);
  assert.ok(Number.isNaN(M.aaParseHours('7:60')));
  assert.ok(Number.isNaN(M.aaParseHours('-1')));
});
