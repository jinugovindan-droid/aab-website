// Standalone social image of the Small Business Relief road.
//
// LinkedIn rewards native images over link previews, so the diagram needs to
// work ALONE in a feed: its own headline, the key numbers, and the brand mark.
// The SVG is lifted from the built article page rather than duplicated here, so
// this image can never drift from what the site shows.
//
// Portrait 1200x1500 — the tallest ratio LinkedIn renders without cropping, so
// it occupies the most feed height on a phone, where most of this audience is.
//
// Run: node scripts/make-road-image.mjs
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const PORT = 8171;
const W = 1200, H = 1500;
const ARTICLE = '/insights/small-business-relief-extended-2029';
const OUT = join(ROOT, 'assets', 'og', 'social-sbr-road.png');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    let f = join(ROOT, p);
    if (!extname(f)) f = join(ROOT, p, 'index.html');
    const b = await readFile(f);
    res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' });
    res.end(b);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];
const executablePath = BROWSERS.find((p) => existsSync(p));
if (!executablePath) { console.error('No Chrome/Edge found'); process.exit(1); }

const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });

// 1. lift the road SVG straight out of the built article
const src = await browser.newPage();
await src.goto(`http://127.0.0.1:${PORT}${ARTICLE}`, { waitUntil: 'networkidle0' });
await src.waitForFunction(() => window.__AA_MOUNTED === true, { polling: 100, timeout: 20000 });
await new Promise((r) => setTimeout(r, 700));
const svg = await src.evaluate(() => {
  const fig = [...document.querySelectorAll('#root figure')].find((f) => /PAVED THREE YEARS/i.test(f.innerText));
  return fig ? fig.querySelector('svg').outerHTML : null;
});
await src.close();
if (!svg) { console.error('road SVG not found in the built article — run npm run make first'); process.exit(1); }

// Crop the viewBox for the social canvas only. The on-page figure carries top
// padding that suits an article column; in a feed that reads as dead space, so
// tighten to the drawn content and let the road fill the frame.
const svgTight = svg.replace('viewBox="0 0 720 600"', 'viewBox="0 60 720 512"');

const logoB64 = (await readFile(join(ROOT, 'assets', 'logos', 'aab-short-eng-classic.png'))).toString('base64');

// 2. compose the social canvas around it
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;600;700&family=IBM+Plex+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
  :root{--cyan:#00B0F0;--ink:#1A1A2E;--steel:#6E7887;--rule:#E3E7EC}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:#fff;font-family:'Inter',Arial,sans-serif;overflow:hidden;position:relative;display:flex;flex-direction:column}
  header{padding:64px 72px 26px;border-top:14px solid var(--cyan)}
  .kicker{font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--cyan)}
  h1{font-family:'Oswald',Arial,sans-serif;font-weight:700;font-size:80px;line-height:1.02;text-transform:uppercase;color:var(--ink);margin-top:20px}
  h1 em{font-style:normal;color:var(--cyan)}
  .stage{flex:1;display:flex;align-items:center;padding:0 56px}
  .stage svg{width:100%;height:auto;display:block}
  .facts{display:flex;gap:0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);margin:0 72px}
  .fact{flex:1;padding:22px 8px 22px 0}
  .fact + .fact{padding-left:28px;border-left:1px solid var(--rule)}
  .fact b{display:block;font-family:'IBM Plex Mono',monospace;font-size:27px;font-weight:700;color:var(--ink)}
  .fact span{display:block;font-size:16px;color:var(--steel);margin-top:6px;line-height:1.35}
  footer{display:flex;align-items:center;justify-content:space-between;padding:26px 72px 40px}
  footer img{height:74px;width:auto;display:block}
  .site{text-align:right}
  .site b{display:block;font-size:24px;font-weight:700;color:var(--ink)}
  .site span{display:block;font-size:15px;color:var(--steel);margin-top:3px}
</style></head><body>
  <header>
    <div class="kicker">UAE Corporate Tax &middot; MD 131 of 2026</div>
    <h1>Small Business Relief:<br><em>three more years</em></h1>
  </header>
  <div class="stage">${svgTight}</div>
  <div class="facts">
    <div class="fact"><b>31 Dec 2029</b><span>Last tax periods the relief covers</span></div>
    <div class="fact"><b>AED 3m</b><span>Revenue limit — in every period since Jun 2023</span></div>
    <div class="fact"><b>Elect it</b><span>Claimed on the return; you still register and file</span></div>
  </div>
  <footer>
    <img src="data:image/png;base64,${logoB64}" alt="">
    <div class="site"><b>aaccounting.me</b><span>Authentic Accounting and Bookkeeping L.L.C</span></div>
  </footer>
</body></html>`;

const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });   // 2x = crisp on retina feeds
await page.setContent(html, { waitUntil: 'networkidle0' });
const fontsOk = await page.evaluate(() => document.fonts.ready.then(() => document.fonts.check("700 80px 'Oswald'"))).catch(() => false);
await page.screenshot({ path: OUT, type: 'png' });
const { size } = await import('node:fs').then((m) => m.promises.stat(OUT));
console.log(`${OUT}  ${W}x${H} @2x  ${(size / 1024).toFixed(0)} KB  brandFont=${fontsOk ? 'Oswald' : 'FALLBACK — check network'}`);
await browser.close();
server.close();
