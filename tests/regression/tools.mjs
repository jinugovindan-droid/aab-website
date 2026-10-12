// Regression check for the live calculators, run against the BUILT site.
//
// Before the M0b refactor moves the tools onto the shared libraries, this
// records exactly what each calculator shows for a fixed set of cases, and from
// then on fails the build if any of it changes. A change that is meant (new
// copy, a corrected rule) is re-recorded on purpose with --update, and the diff
// of tools-baseline.json shows what moved.
//
//   node tests/regression/tools.mjs            compare with the baseline
//   node tests/regression/tools.mjs --update   re-record the baseline
//
// Runs after `npm run make` (needs dist/ and the route HTML). Uses the system
// Chrome/Edge through puppeteer-core, like snapshot.mjs.
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const PORT = 8118;
const BASELINE = join(ROOT, 'tests', 'regression', 'tools-baseline.json');
const UPDATE = process.argv.includes('--update');
const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.json': 'application/json', '.xml': 'application/xml' };

// ---- cases: [id, route, steps, capture] -----------------------------------
// steps: ['field-suffix', value] sets an input/select; ['check', 'label text']
// ticks a checkbox by its label; ['click', 'id-suffix'] clicks a control.
// capture: the id-suffix whose container text is recorded.
const G = '/tools/gratuity-calculator', V = '/tools/vat-calculator', SV = '/services/vat', CT = '/services/corporate-tax';
const CASES = [
  ['g01-default', G, [], '-panel-gratuity'],
  ['g02-under-a-year', G, [['-start', '01/01/2026'], ['-end', '30/09/2026']], '-panel-gratuity'],
  ['g03-exactly-one-year', G, [['-start', '01/01/2025'], ['-end', '31/12/2025']], '-panel-gratuity'],
  ['g04-364-days', G, [['-start', '02/01/2025'], ['-end', '31/12/2025']], '-panel-gratuity'],
  ['g05-over-five-years', G, [['-basic', '12,500'], ['-start', '01/04/2015'], ['-end', '30/09/2026']], '-panel-gratuity'],
  ['g06-ceiling', G, [['-basic', '5,000'], ['-start', '01/01/1990'], ['-end', '30/09/2026']], '-panel-gratuity'],
  ['g07-unpaid-under-a-year', G, [['-start', '01/01/2025'], ['-end', '31/12/2025'], ['-unpaid', '10']], '-panel-gratuity'],
  ['g08-part-time-24-48', G, [['-type', 'part'], ['-basic', '6,000'], ['-start', '15/06/2019'], ['-end', '30/09/2026'], ['-hours', '24'], ['-fullweek', '48']], '-panel-gratuity'],
  ['g09-part-time-30-40', G, [['-type', 'part'], ['-basic', '6,000'], ['-start', '15/06/2019'], ['-end', '30/09/2026'], ['-hours', '30'], ['-fullweek', '40']], '-panel-gratuity'],
  ['g10-scheme-with-wage', G, [['-basic', '9,000'], ['-start', '01/01/2018'], ['-end', '30/09/2026'], ['-join', '01/01/2024'], ['-joinbasic', '7,000']], '-panel-gratuity'],
  ['g11-scheme-no-wage', G, [['-basic', '9,000'], ['-start', '01/01/2018'], ['-end', '30/09/2026'], ['-join', '01/01/2024']], '-panel-gratuity'],
  ['g12-scheme-in-first-year', G, [['-start', '01/03/2023'], ['-end', '30/09/2026'], ['-join', '01/11/2023']], '-panel-gratuity'],
  ['g13-national', G, [['-type', 'national']], '-panel-gratuity'],
  ['g14-decimal-wage-leap', G, [['-basic', '7,812.50'], ['-start', '29/02/2020'], ['-end', '28/02/2026']], '-panel-gratuity'],
  ['g15-typed-formats', G, [['-start', '10-Feb-2019'], ['-end', '2026-09-30']], '-panel-gratuity'],
  ['s01-settlement', G, [['click', '-tab-settlement'], ['-sSalary', '8,000'], ['-sLeave', '4,000'], ['-sLoan', '2,500'],
    ['-addLbl1', 'Air ticket'], ['-addAmt1', '1,800'], ['-dedLbl1', 'Advance'], ['-dedAmt1', '500']], '-panel-settlement'],
  ['s02-settlement-national', G, [['-type', 'national'], ['click', '-tab-settlement'], ['-sSalary', '10,000'], ['-sLeave', '3,000']], '-panel-settlement'],
  ['v01-default', V, [], '-amt'],
  ['v02-extract-1000', V, [['-amt', '1,000']], '-amt'],
  ['v03-add-1000', V, [['-mode', 'add'], ['-amt', '1,000']], '-amt'],
  ['v04-add-0.10', V, [['-mode', 'add'], ['-amt', '0.10']], '-amt'],
  ['v05-extract-105.01', V, [['-amt', '105.01']], '-amt'],
  ['v06-add-12345.67', V, [['-mode', 'add'], ['-amt', '12,345.67']], '-amt'],
  ['c01-mandatory', SV, [['-t12', '400,000']], '-t12'],
  ['c02-at-375000', SV, [['-t12', '375,000']], '-t12'],
  ['c03-375001', SV, [['-t12', '375,001']], '-t12'],
  ['c04-voluntary-forward', SV, [['-t12', '150,000'], ['-fwd', '200,000']], '-t12'],
  ['c05-at-187500', SV, [['-t12', '187,500']], '-t12'],
  ['c06-below', SV, [['-t12', '100,000']], '-t12'],
  ['t01-standard', CT, [['-profit', '1,000,000'], ['-revenue', '5,000,000']], '-profit'],
  ['t02-sbr', CT, [['-profit', '300,000'], ['-revenue', '2,000,000']], '-profit'],
  ['t03-sbr-lost-earlier', CT, [['-profit', '300,000'], ['-revenue', '2,000,000'], ['check', 'Revenue went above AED 3M']], '-profit'],
  ['t04-sbr-march-ye', CT, [['-profit', '2,500,000'], ['-revenue', '2,900,000'], ['-yearend', '3']], '-profit'],
  ['t05-free-zone', CT, [['-profit', '1,000,000'], ['-revenue', '10,000,000'], ['check', 'Free zone company']], '-profit'],
  ['t06-at-375000', CT, [['-profit', '375,000'], ['-revenue', '10,000,000']], '-profit'],
  ['t07-loss', CT, [['-profit', '-50,000'], ['-revenue', '4,000,000']], '-profit'],
  // A tool mounted in a note: same body, inside the article.
  ['e01-vat-embed-in-primer', '/insights/uae-vat-5-percent-primer', [['-amt', '1,000']], 'aa-embed-vat-calculator'],
  ['e02-vat-embed-add', '/insights/uae-vat-5-percent-primer', [['-mode', 'add'], ['-amt', '1,000']], 'aa-embed-vat-calculator'],
];

function serve() {
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = join(ROOT, p);
      if (!extname(p)) file = join(ROOT, p, 'index.html');
      if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
    } catch (e) { res.writeHead(500); res.end(String(e)); }
  });
  return new Promise((ok) => server.listen(PORT, '127.0.0.1', () => ok(server)));
}

async function runCase(browser, [id, route, steps, capture]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  // Analytics and consent never load in this harness.
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('aa-consent', 'declined'); } catch (e) {} });
  await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
  // Wait for React to take over #root (createRoot marks the container).
  await page.waitForFunction(() => { const r = document.getElementById('root'); return r && Object.keys(r).some((k) => k.startsWith('__reactContainer')); }, { timeout: 30000 });
  await page.waitForSelector(`[id$="${capture}"]`, { timeout: 30000 });
  for (const [a, b] of steps) {
    await page.evaluate((a, b) => {
      if (a === 'check') {
        const lab = [...document.querySelectorAll('label')].find((l) => l.textContent.includes(b));
        if (!lab) throw new Error('no checkbox labelled ' + b);
        const box = lab.querySelector('input[type=checkbox]'); if (!box.checked) box.click(); return;
      }
      if (a === 'click') { const el = document.querySelector(`[id$="${b}"]`); if (!el) throw new Error('no control ' + b); el.click(); return; }
      const el = document.querySelector(`[id$="${a}"]`);
      if (!el) throw new Error('no field ' + a);
      if (el.tagName === 'SELECT') {
        Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(el, b);
        el.dispatchEvent(new Event('change', { bubbles: true })); return;
      }
      el.focus();
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, b);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.blur();
    }, a, b);
    await new Promise((r) => setTimeout(r, 60));
  }
  await new Promise((r) => setTimeout(r, 250));
  const text = await page.evaluate((capture) => {
    const el = document.querySelector(`[id$="${capture}"]`);
    // A tab panel is the whole tool; for a single field, the tool's section.
    const box = (el.getAttribute('role') === 'tabpanel' || el.hasAttribute('data-aa-embed')) ? el : (el.closest('section') || el.parentElement.parentElement.parentElement);
    return box.innerText.replace(/\s+/g, ' ').trim();
  }, capture);
  await page.close();
  return text;
}

const executablePath = BROWSERS.find((p) => existsSync(p));
if (!executablePath) { console.error('No Chrome/Edge found'); process.exit(1); }
const server = await serve();
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions',
  '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'] });
const got = {};
let failed = false;
try {
  for (const c of CASES) {
    try { got[c[0]] = await runCase(browser, c); }
    catch (e) { failed = true; console.error(`  ERROR ${c[0]}: ${e.message}`); }
  }
} finally { await browser.close(); server.close(); }
if (failed) { console.error('\ntools regression: could not run every case'); process.exit(1); }

if (UPDATE || !existsSync(BASELINE)) {
  await writeFile(BASELINE, JSON.stringify(got, null, 1) + '\n', 'utf8');
  console.log(`tools regression: baseline written (${Object.keys(got).length} cases)`);
  process.exit(0);
}
const base = JSON.parse(await readFile(BASELINE, 'utf8'));
const diffs = [];
for (const [id, text] of Object.entries(got)) {
  const was = base[id];
  if (was === undefined) { diffs.push(`${id}: new case, not in the baseline`); continue; }
  if (was !== text) {
    let i = 0; while (i < was.length && was[i] === text[i]) i++;
    diffs.push(`${id}: differs at character ${i}\n    was: …${was.slice(Math.max(0, i - 60), i + 80)}…\n    now: …${text.slice(Math.max(0, i - 60), i + 80)}…`);
  }
}
for (const id of Object.keys(base)) if (!(id in got)) diffs.push(`${id}: in the baseline but no longer run`);
if (diffs.length) {
  console.error(`tools regression: ${diffs.length} case(s) changed\n  ` + diffs.join('\n  '));
  console.error('\nIf the change is intended, re-record with: node tests/regression/tools.mjs --update');
  process.exit(1);
}
console.log(`tools regression: all ${Object.keys(got).length} cases match the baseline`);
