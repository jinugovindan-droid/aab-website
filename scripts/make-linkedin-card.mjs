// Branded visual for a LinkedIn post.
//
// House rule (owner, 20 Aug 2026): every LinkedIn post carries a simple
// branded visual. Simple is the operative word — the SBR launch used a dense
// portrait infographic, and the brief now is something that communicates in
// about two seconds in a phone feed. One idea, big type, brand furniture.
//
// 1200x1200 square: it occupies more feed height than a 1.91:1 landscape card
// and keeps the type large enough to read without tapping.
//
// Usage:  node scripts/make-linkedin-card.mjs             (all cards)
//         node scripts/make-linkedin-card.mjs <slug>      (just one)
//
// Output: assets/linkedin/<slug>.png  — these are post attachments, not site
// assets, so nothing links to them from the site itself.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'assets', 'linkedin');
const W = 1200, H = 1200;

// Each card: an eyebrow, one headline, an optional deadline chip, and up to
// three rows. Rows are the workhorse — a number and a one-line meaning is the
// fastest thing a reader can absorb. Keep `note` under ~46 characters or it
// wraps and the card stops being glanceable.
const CARDS = {
  'fta-decision-4-accounting-records': {
    eyebrow: 'UAE TAX RECORDS · FTA DECISION 4 OF 2026',
    headline: 'Three gates your records<br>already have to pass',
    chip: 'IN FORCE SINCE 30 JULY 2026',
    rows: [
      { k: 'Identical', note: 'Every page, in order. No partial scans.' },
      { k: 'Legible', note: 'Readable on screen, and it must not fade.' },
      { k: 'Accessible', note: 'The file, the system, and the password.' },
    ],
    kicker: 'Outsourcing the filing does not move the responsibility.',
  },
  'fta-decision-13-supplier-verification': {
    eyebrow: 'UAE VAT · FTA DECISION 13 OF 2026',
    headline: 'Check your suppliers<br>before you claim input VAT',
    chip: 'FROM 1 OCTOBER 2026',
    rows: [
      { k: 'AED 10,000', note: 'Per supply. Under this, skip the checks.' },
      { k: 'AED 100,000', note: 'Per supplier, 12 months. Kills that exception.' },
      { k: 'AED 375,000', note: 'Per supplier, 12 months. Adds a bank letter.' },
    ],
    kicker: 'The checks do not protect your deduction. They protect your defence.',
  },
};

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const executablePath = BROWSERS.find((p) => existsSync(p));
if (!executablePath) { console.error('No Chrome/Edge found'); process.exit(1); }

const logoB64 = (await readFile(join(ROOT, 'assets', 'logos', 'aab-short-eng-classic.png'))).toString('base64');

const html = ({ eyebrow, headline, chip, rows = [], kicker }) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;600;700&family=IBM+Plex+Mono:wght@600&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:#fff;font-family:Inter,sans-serif;
       display:flex;flex-direction:column;position:relative;overflow:hidden}
  .topbar{height:14px;background:#00B0F0;flex:none}
  .body{flex:1;padding:76px 72px 0;display:flex;flex-direction:column}
  .eyebrow{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:23px;
           letter-spacing:.14em;color:#00B0F0;text-transform:uppercase}
  h1{font-family:Oswald,sans-serif;font-weight:700;font-size:78px;line-height:1.04;
     color:#1A1A2E;margin-top:24px;letter-spacing:.005em}
  .chip{align-self:flex-start;margin-top:34px;background:#1A1A2E;color:#fff;
        font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:24px;
        letter-spacing:.1em;padding:15px 26px;border-radius:4px}
  .rows{margin-top:auto;padding-bottom:14px}
  .row{display:flex;align-items:baseline;gap:26px;padding:34px 0;border-top:1px solid #E4E6E9}
  .row:first-child{border-top:none}
  .k{font-family:Oswald,sans-serif;font-weight:700;font-size:50px;color:#00B0F0;
     min-width:330px;letter-spacing:.01em}
  .note{font-size:28px;color:#4A5260;line-height:1.35}
  .kicker{border-top:3px solid #1A1A2E;margin-top:10px;padding-top:26px;
          font-size:29px;font-weight:600;color:#1A1A2E;line-height:1.35}
  .foot{flex:none;height:150px;padding:0 72px;display:flex;align-items:center;
        justify-content:space-between;border-top:1px solid #E4E6E9;margin-top:34px}
  .foot img{height:62px}
  .site{text-align:right}
  .site .d{font-family:Oswald,sans-serif;font-weight:700;font-size:31px;color:#1A1A2E}
  .site .n{font-size:19px;color:#6E7887;margin-top:3px}
</style></head>
<body>
  <div class="topbar"></div>
  <div class="body">
    <div class="eyebrow">${eyebrow}</div>
    <h1>${headline}</h1>
    ${chip ? `<div class="chip">${chip}</div>` : ''}
    <div class="rows">
      ${rows.map((r) => `<div class="row"><div class="k">${r.k}</div><div class="note">${r.note}</div></div>`).join('')}
      ${kicker ? `<div class="kicker">${kicker}</div>` : ''}
    </div>
  </div>
  <div class="foot">
    <img src="data:image/png;base64,${logoB64}" alt="">
    <div class="site"><div class="d">aaccounting.me</div>
      <div class="n">Authentic Accounting and Bookkeeping L.L.C</div></div>
  </div>
</body></html>`;

const only = process.argv[2];
const slugs = only ? [only] : Object.keys(CARDS);
await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
for (const slug of slugs) {
  const spec = CARDS[slug];
  if (!spec) { console.error(`no card spec for "${slug}"`); process.exitCode = 1; continue; }
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.setContent(html(spec), { waitUntil: 'networkidle0' });
  // Google Fonts can be slow or blocked; never ship a fallback-font card
  // without saying so, because it stops looking like our brand.
  const fontsOk = await page.evaluate(() =>
    document.fonts.ready.then(() => document.fonts.check("700 78px 'Oswald'"))).catch(() => false);
  const out = join(OUT_DIR, `${slug}.png`);
  await page.screenshot({ path: out, type: 'png' });
  const { size } = await stat(out);
  console.log(`${out}  ${W}x${H}  ${(size / 1024).toFixed(1)} KB  brandFont=${fontsOk ? 'Oswald' : 'FALLBACK — check network'}`);
  await page.close();
}
await browser.close();
