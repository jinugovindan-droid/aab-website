// Per-article Open Graph cards.
//
// Every route used to share one generic logo card, which is fine for a service
// page but wastes the single biggest visual slot a LinkedIn/WhatsApp share gets.
// This renders a real branded card per article — headline, kicker, date — using
// the site's own fonts and colours via headless Chrome (not bitmap fonts), then
// writes assets/og/article-<slug>.jpg. prerender.py picks it up automatically
// when the file exists.
//
// Run: node scripts/make-article-og.mjs            (all cards defined below)
//      node scripts/make-article-og.mjs <slug>     (just one)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'assets', 'og');
const W = 1200, H = 630;

// Cards to generate: slug -> { kicker, headline }. Headline is written for the
// card (short, high contrast at thumbnail size), not copied from the <h1>.
const CARDS = {
  'fta-decision-13-supplier-verification': {
    kicker: 'FTA Decision 13 of 2026 · From 1 October',
    headline: 'Check your suppliers before you claim.',
    sub: 'The three thresholds, and what the rule does not say',
  },
  'small-business-relief-evidence-test': {
    kicker: 'Small Business Relief · The evidence test',
    headline: 'Can you prove every period since 2023?',
    sub: 'What the AED 3m test actually looks at',
  },
  'small-business-relief-extended-2029': {
    kicker: 'Small Business Relief · MD 131/2026',
    headline: 'Three more years. Now runs to 2029.',
    sub: 'For UAE businesses at or under AED 3m revenue',
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

const cardHtml = ({ kicker, headline, sub }) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:#1A1A2E;color:#fff;
       font-family:'Inter',-apple-system,'Segoe UI',Arial,sans-serif;overflow:hidden;position:relative}
  /* subtle brand wash so the card is not a flat rectangle */
  .glow{position:absolute;right:-160px;top:-160px;width:620px;height:620px;border-radius:50%;
        background:radial-gradient(circle,rgba(0,176,240,0.30) 0%,rgba(0,176,240,0) 70%)}
  .edge{position:absolute;left:0;top:0;width:12px;height:100%;background:#00B0F0}
  .wrap{position:absolute;left:76px;right:76px;top:66px}
  .kicker{font-size:23px;font-weight:600;letter-spacing:.17em;text-transform:uppercase;color:#00B0F0}
  h1{font-family:'Oswald',Arial,sans-serif;font-weight:700;font-size:${headline.length > 44 ? 74 : 86}px;
     line-height:1.04;text-transform:uppercase;letter-spacing:.005em;margin-top:26px;max-width:1010px}
  .sub{margin-top:26px;font-size:26px;color:rgba(255,255,255,.72);font-weight:400}
  .bar{position:absolute;left:0;bottom:0;width:100%;height:122px;background:#fff;
       display:flex;align-items:center;justify-content:space-between;padding:0 76px}
  .bar img{height:82px;width:auto;display:block}
  .site{font-size:22px;font-weight:600;color:#1A1A2E;letter-spacing:.01em}
  .rule{position:absolute;left:0;bottom:122px;width:100%;height:7px;background:#00B0F0}
</style></head><body>
  <div class="glow"></div><div class="edge"></div>
  <div class="wrap">
    <div class="kicker">${kicker}</div>
    <h1>${headline}</h1>
    <div class="sub">${sub}</div>
  </div>
  <div class="rule"></div>
  <div class="bar">
    <img src="data:image/png;base64,${logoB64}" alt="">
    <span class="site">aaccounting.me</span>
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
  await page.setContent(cardHtml(spec), { waitUntil: 'networkidle0' });
  // Google Fonts may be blocked/slow — never let that hang or silently ship
  // a fallback-font card without saying so.
  const fontsOk = await page.evaluate(() =>
    document.fonts.ready.then(() => document.fonts.check("700 74px 'Oswald'"))).catch(() => false);
  const out = join(OUT_DIR, `article-${slug}.jpg`);
  await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
  const { size } = await import('node:fs').then((m) => m.promises.stat(out));
  console.log(`${out}  ${W}x${H}  ${(size / 1024).toFixed(1)} KB  brandFont=${fontsOk ? 'Oswald' : 'FALLBACK — check network'}`);
  await page.close();
}
await browser.close();
