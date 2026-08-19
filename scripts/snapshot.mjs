// Full-body prerender snapshot.
//
// prerender.py writes each route's index.html with search-tuned meta, JSON-LD and
// a thin crawlable skeleton in #root. This script replaces that skeleton with the
// COMPLETE rendered page: it serves the repo over a local HTTP server, loads every
// route in headless Chrome/Edge (the system browser — no download), waits for the
// React app to mount, and writes #root's rendered HTML back into the route file.
// React's createRoot().render() replaces #root's children on mount, so browsers
// still get the live SPA; crawlers and no-JS clients get the full real page.
//
// Run order matters:  npm run bundle  →  py scripts/prerender.py  →  node scripts/snapshot.mjs
// (prerender.py owns meta/JSON-LD and rewrites #root to the skeleton each run, so
// this script must always run after it.)
import { createServer } from 'node:http';
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const PORT = 8117;
const CONCURRENCY = 4;

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const executablePath = BROWSERS.find((p) => existsSync(p));
if (!executablePath) { console.error('No Chrome/Edge found'); process.exit(1); }

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml',
};

// ---- discover routes: every */index.html that prerender.py wrote (they all carry
// its <base href="/"> marker), plus the home template itself.
async function findRoutes() {
  const SKIP = new Set(['node_modules', 'dist', 'assets', 'scripts', 'api']);
  const routes = [];
  async function walk(dir, url) {
    for (const name of await readdir(dir)) {
      // Dot-directories as a class: .git, and crucially .claude/worktrees — a
      // worktree of this branch contains all the route marker files and would
      // otherwise be discovered as phantom routes and silently overwritten.
      if (name.startsWith('.') || SKIP.has(name)) continue;
      const p = join(dir, name);
      if ((await stat(p)).isDirectory()) {
        const idx = join(p, 'index.html');
        if (existsSync(idx)) {
          const html = await readFile(idx, 'utf8');
          if (html.includes('<base href="/">')) routes.push({ url: `${url}/${name}`, file: idx });
        }
        await walk(p, `${url}/${name}`);
      }
    }
  }
  await walk(ROOT, '');
  routes.push({ url: '/', file: join(ROOT, 'index.html') }); // home template last
  return routes;
}

// ---- tiny static server with /route → route/index.html mapping
function serve() {
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      let file = join(ROOT, p);
      if (!extname(file)) file = join(ROOT, p, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  return new Promise((ok) => server.listen(PORT, '127.0.0.1', () => ok(server)));
}

// ---- capture post-processing: the reveal classes exist only so JS can animate
// sections in; in static HTML they'd leave below-fold content at opacity 0.
function stripRevealClasses(html) {
  return html.replace(/class="([^"]*)"/g, (m, cls) => {
    const kept = cls.split(/\s+/).filter((c) => c !== 'reveal' && c !== 'is-visible');
    return kept.length ? `class="${kept.join(' ')}"` : '';
  });
}

// Same anchor contract as prerender.py's inject_root: the "Tweak defaults"
// comment that always follows #root — unambiguous even though `body` contains
// </div> tags, and idempotent across re-runs. Splices by index so `$` sequences
// in the captured HTML can never be mangled by String.replace substitution.
function injectRootSafe(pageHtml, body) {
  const re = /<div id="root">[\s\S]*?<\/div>(\s*<!-- Tweak defaults)/;
  const m = pageHtml.match(re);
  if (!m) throw new Error('inject anchor not found');
  const start = m.index;
  const end = m.index + m[0].length - m[1].length;
  return pageHtml.slice(0, start) + `<div id="root">${body}</div>` + pageHtml.slice(end);
}

async function snapshotRoute(browser, route) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1366, height: 900 });
    // Never let build-time captures hit analytics, and never show the consent banner.
    await page.setRequestInterception(true);
    page.on('request', (r) => {
      const u = r.url();
      if (/googletagmanager|google-analytics|doubleclick|vercel-insights|vitals\.vercel/.test(u)) r.abort();
      else r.continue();
    });
    await page.evaluateOnNewDocument(() => {
      // Snapshot mode: components drop relative day-counts (stale from day one
      // in static HTML) and force Date-gated campaign chrome off.
      window.__AA_SNAPSHOT = true;
      try { localStorage.setItem('aa-analytics-consent', 'denied'); } catch (e) {}
    });
    await page.goto(`http://127.0.0.1:${PORT}${route.url}`, { waitUntil: 'networkidle0', timeout: 45000 });
    // Mount signal the static body can never satisfy: app-root.jsx sets
    // __AA_MOUNTED after React's first committed paint. (DOM heuristics like
    // "footer exists" pass vacuously when re-running over snapshotted files.)
    // Timer polling, not the default rAF polling — rAF starves in throttled tabs.
    await page.waitForFunction(() => window.__AA_MOUNTED === true, { timeout: 20000, polling: 100 });
    await new Promise((r) => setTimeout(r, 400)); // settle post-mount effects
    const result = await page.evaluate(() => {
      // Deterministic icon swap: run lucide synchronously NOW, then serialize.
      if (window.lucide) window.lucide.createIcons();
      return {
        html: document.getElementById('root').innerHTML,
        rawIcons: document.querySelectorAll('#root i[data-lucide]').length,
        consentShown: !!document.querySelector('#root [role="dialog"][aria-label="Cookie consent"]'),
        screen: (document.querySelector('#root [data-screen-label]') || { dataset: {} }).dataset.screenLabel || '',
      };
    });
    if (!result.html || result.html.length < 5000) throw new Error(`suspiciously small capture (${result.html ? result.html.length : 0} chars)`);
    if (result.rawIcons > 0) throw new Error(`${result.rawIcons} unswapped lucide icon(s)`);
    if (result.consentShown) throw new Error('consent banner rendered during capture');
    if (/\(\d[\d,]* days?\)|\d[\d,]* days? left/.test(result.html)) throw new Error('relative day-count leaked into capture');
    // Wrong-page guard: the SPA falls back to the home page for unknown paths,
    // so a stale/phantom route directory would silently capture home content.
    // app-root renders data-screen-label inside #root — a stable identity check.
    // (The old guard matched hero copy, which churned and silently rotted.)
    if (route.url !== '/' && result.screen === '01 Home') {
      throw new Error('route rendered the HOME page (screen label 01 Home)');
    }
    if (route.url === '/' && result.screen && result.screen !== '01 Home') {
      throw new Error('home captured the wrong screen (' + result.screen + ')');
    }
    return { url: route.url, file: route.file, body: stripRevealClasses(result.html) };
  } finally {
    await page.close();
  }
}

const routes = await findRoutes();

// Route-set sanity: prerender.py writes sitemap.xml from the same route list;
// a count mismatch means findRoutes picked up phantom directories (or missed
// real ones) — abort before touching any file.
let expected = null;
try { expected = JSON.parse(await readFile(join(ROOT, '.routes-manifest.json'), 'utf8')).length; } catch {}
if (expected === null) {
  // Tree built before prerender.py emitted the manifest.
  expected = ((await readFile(join(ROOT, 'sitemap.xml'), 'utf8')).match(/<loc>/g) || []).length;
  console.warn('no .routes-manifest.json - falling back to sitemap count (unpublished insights would trip this)');
}
if (routes.length !== expected) {
  console.error(`route mismatch: found ${routes.length} routes but prerender declared ${expected}`);
  process.exit(1);
}

console.log(`${routes.length} routes (matches sitemap) · browser: ${executablePath}`);
const server = await serve();
// The throttling flags matter: with CONCURRENCY tabs, headless Chrome throttles
// rAF/timers in backgrounded tabs, which starves the app's double-rAF mount
// signal (and lucide's rAF-debounced icon swap) on whichever tabs aren't active.
const browser = await puppeteer.launch({ executablePath, headless: true, args: [
  '--no-first-run', '--disable-extensions',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-features=CalculateNativeWinOcclusion',
] });

// Capture everything first, write nothing until every route succeeded —
// a failed or interrupted run must never leave a half-updated tree.
const failures = [];
const captures = [];
let done = 0;
const queue = routes.slice();
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  for (let r; (r = queue.shift()); ) {
    try {
      const res = await snapshotRoute(browser, r);
      captures.push(res);
      console.log(`  ok  ${res.url}  (${(res.body.length / 1024).toFixed(0)} KB)  [${++done}/${routes.length}]`);
    } catch (e) {
      failures.push({ url: r.url, error: String(e.message || e) });
      console.error(`  FAIL ${r.url}: ${e.message}`);
    }
  }
}));

await browser.close();
server.close();
if (failures.length) {
  // Be precise about the state this leaves behind. snapshot.mjs itself wrote
  // nothing — but `npm run make` runs prerender.py first, and that has ALREADY
  // replaced every page body with the short SEO skeleton. So the tree is very
  // much changed, and committing now would publish 68 near-empty pages.
  console.error(`\n${failures.length} route(s) failed. snapshot wrote nothing, but the tree is NOT clean:`);
  console.error('prerender.py already replaced every page body with the SEO skeleton before this step.');
  console.error('\n  DO NOT COMMIT OR PUSH. Recover with either:');
  console.error('    npm run make          # re-run the whole chain');
  console.error('    git checkout -- .     # discard, back to the last commit');
  process.exit(1);
}
// React useId values (":r0:" etc.) churn on every capture — normalise them so
// two builds of unchanged content compare equal.
const norm = (s) => s.replace(/:r[0-9a-z]+:/gi, ':id:');
const gitShow = (relPath) => {
  try { return execFileSync('git', ['show', 'HEAD:' + relPath.replace(/\\/g, '/')], { cwd: ROOT, maxBuffer: 16 * 1024 * 1024 }).toString('utf8'); }
  catch { return null; } // new file — counts as changed
};

const changedUrls = new Set();
for (const c of captures) {
  const pageHtml = await readFile(c.file, 'utf8');
  const finalHtml = injectRootSafe(pageHtml, c.body);
  await writeFile(c.file, finalHtml, 'utf8');
  const prev = gitShow(relative(ROOT, c.file));
  if (prev === null || norm(prev.replace(/\r\n/g, '\n')) !== norm(finalHtml.replace(/\r\n/g, '\n'))) changedUrls.add(c.url);
}

// Honest sitemap lastmod: prerender stamps every static page "today"; restore
// the committed lastmod for routes whose content did NOT actually change, so
// crawlers can trust the dates. (Insight lastmods already carry real dates.)
const prevSitemap = gitShow('sitemap.xml');
if (prevSitemap) {
  const prevDates = {};
  for (const m of prevSitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) prevDates[m[1]] = m[2];
  let sitemap = await readFile(join(ROOT, 'sitemap.xml'), 'utf8');
  let restored = 0;
  sitemap = sitemap.replace(/<loc>([^<]+)<\/loc>(\s*)<lastmod>([^<]+)<\/lastmod>/g, (full, loc, ws, cur) => {
    const url = new URL(loc).pathname.replace(/\/$/, '') || '/';
    if (!changedUrls.has(url) && prevDates[loc] && prevDates[loc] !== cur) { restored++; return `<loc>${loc}</loc>${ws}<lastmod>${prevDates[loc]}</lastmod>`; }
    return full;
  });
  await writeFile(join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
  console.log(`\nsitemap lastmod: ${changedUrls.size} route(s) changed, ${restored} unchanged lastmod(s) restored`);
}
// Final guard: every page must reference the bundle that was just built. A
// stale hand-typed ?v= shipped once (Aug 2026) and returning visitors kept the
// cached old bundle, so a brand-new article rendered as the previous one.
// Cheap to check, expensive to miss.
{
  const built = await readFile(join(ROOT, 'index.html'), 'utf8');
  const want = (built.match(/dist\/app\.min\.js\?v=([a-z0-9]+)/) || [])[1];
  if (!want) {
    console.error('\nCANNOT VERIFY: no versioned bundle reference in index.html.');
    process.exit(1);
  }
  const stale = [];
  for (const c of captures) {
    const html = await readFile(c.file, 'utf8');
    const got = (html.match(/dist\/app\.min\.js\?v=([a-z0-9]+)/) || [])[1];
    if (got !== want) stale.push(`${c.url} -> ${got || '(none)'}`);
  }
  if (stale.length) {
    console.error(`\n${stale.length} page(s) reference a bundle other than ?v=${want}:`);
    stale.slice(0, 8).forEach((x) => console.error('  ' + x));
    console.error('\n  DO NOT PUSH — returning visitors would keep a cached old bundle.');
    process.exit(1);
  }
  console.log(`bundle check: all ${captures.length} pages reference ?v=${want}`);
}
console.log(`All ${routes.length} routes snapshotted and written.`);
