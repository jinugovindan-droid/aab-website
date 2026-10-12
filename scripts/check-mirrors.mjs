// Mirror check: scripts/routes.js (the browser) and scripts/prerender.py (the
// static HTML) each hold a copy of the page metadata. The client REBUILDS the
// JSON-LD on hydration from routes.js, so a field that differs between the two
// means the page says one thing to crawlers and another to browsers. This fails
// the build when any mirrored field drifts.
//
//   node scripts/check-mirrors.mjs
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

// ---- routes.js, evaluated with a minimal browser stub
const src = await readFile('scripts/routes.js', 'utf8');
const win = { location: { pathname: '/', search: '', hash: '', origin: 'https://www.aaccounting.me', href: 'https://www.aaccounting.me/' },
  history: { replaceState() {}, pushState() {} }, addEventListener() {} };
const ctx = { window: win, document: { querySelector: () => null, querySelectorAll: () => [], head: { appendChild() {} }, createElement: () => ({ setAttribute() {} }) }, console };
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: 'routes.js' });
const JS = ctx.window.AARoutes;
if (!JS) throw new Error('routes.js did not define window.AARoutes');

// ---- prerender.py, imported without running main()
const py = `
import json, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'scripts')
import prerender as p
print(json.dumps({k: getattr(p, k) for k in ['PAGE_TO_PATH', 'PAGE_SEO', 'INSIGHTS', 'FAQ_BY_PAGE', 'ANSWER_FIRST', 'RELATED_READING', 'TOOL_SLUGS', 'TOOL_HOSTS']}, ensure_ascii=False))
`;
const PY = JSON.parse(execFileSync('py', ['-c', py], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

const issues = [];
const norm = (v) => JSON.stringify(v);
const eq = (a, b) => norm(a) === norm(b);
function cmpKeys(name, a, b) {
  const ka = Object.keys(a || {}).sort(), kb = Object.keys(b || {}).sort();
  for (const k of ka) if (!kb.includes(k)) issues.push(`${name}: '${k}' only in routes.js`);
  for (const k of kb) if (!ka.includes(k)) issues.push(`${name}: '${k}' only in prerender.py`);
  return ka.filter((k) => kb.includes(k));
}
const short = (v) => { const s = typeof v === 'string' ? v : JSON.stringify(v); return s && s.length > 90 ? s.slice(0, 90) + '…' : s; };

// whole-value mirrors
for (const name of ['TOOL_SLUGS', 'TOOL_HOSTS', 'PAGE_TO_PATH']) {
  for (const k of cmpKeys(name, JS[name], PY[name])) if (!eq(JS[name][k], PY[name][k])) issues.push(`${name}.${k}: ${short(JS[name][k])} ≠ ${short(PY[name][k])}`);
}
// PAGE_SEO: title + description
// 'home' lives in prerender.py as HOME_SEO (the root template), not in PAGE_SEO.
const jsSeo = Object.fromEntries(Object.entries(JS.PAGE_SEO).filter(([k]) => k !== 'home'));
for (const k of cmpKeys('PAGE_SEO', jsSeo, PY.PAGE_SEO)) {
  for (const f of ['title', 'description']) {
    if (JS.PAGE_SEO[k][f] !== PY.PAGE_SEO[k][f]) issues.push(`PAGE_SEO.${k}.${f}: "${short(JS.PAGE_SEO[k][f])}" ≠ "${short(PY.PAGE_SEO[k][f])}"`);
  }
}
// INSIGHTS by slug
const bySlug = (arr) => Object.fromEntries(arr.map((a) => [a.slug, a]));
const ji = bySlug(JS.INSIGHTS), pi = bySlug(PY.INSIGHTS);
// The fields prerender.py reads (titles, dates, author, excerpt, publish flag);
// the rest (read time, chips, reference) are client-only and need no mirror.
const IFIELDS = ['seoTitle', 'seoDesc', 'date', 'updated', 'title', 'author', 'excerpt', 'published'];
for (const s of cmpKeys('INSIGHTS', ji, pi)) {
  for (const f of IFIELDS) {
    const a = ji[s][f], b = pi[s][f];
    if ((a == null && b == null) || eq(a, b)) continue;
    issues.push(`INSIGHTS.${s}.${f}: ${short(a)} ≠ ${short(b)}`);
  }
}
// FAQ_BY_PAGE: same pages, same questions and answers in the same order
const faqText = (item) => Array.isArray(item) ? item : [item.q ?? item.question, item.a ?? item.answer];
const jf = Object.fromEntries(Object.entries(JS.FAQ_BY_PAGE || {}).map(([k, v]) => [k, v.map(faqText)]));
for (const k of cmpKeys('FAQ_BY_PAGE', jf, PY.FAQ_BY_PAGE)) {
  const a = jf[k], b = PY.FAQ_BY_PAGE[k].map(faqText);
  if (a.length !== b.length) { issues.push(`FAQ_BY_PAGE.${k}: ${a.length} items ≠ ${b.length}`); continue; }
  a.forEach((qa, i) => { if (!eq(qa, b[i])) issues.push(`FAQ_BY_PAGE.${k}[${i}]: "${short(qa[0])}" differs`); });
}
// ANSWER_FIRST and RELATED_READING: whole values
for (const name of ['ANSWER_FIRST', 'RELATED_READING']) {
  for (const k of cmpKeys(name, JS[name], PY[name])) if (!eq(JS[name][k], PY[name][k])) issues.push(`${name}.${k}: differs`);
}

if (issues.length) {
  console.error(`mirror check: ${issues.length} difference(s) between routes.js and prerender.py\n  ` + issues.join('\n  '));
  process.exit(1);
}
console.log('mirror check: routes.js and prerender.py agree (PAGE_TO_PATH, PAGE_SEO, INSIGHTS, FAQ_BY_PAGE, ANSWER_FIRST, RELATED_READING, TOOL_SLUGS, TOOL_HOSTS)');
