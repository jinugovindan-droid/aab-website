// Production bundler for the AAB site.
//
// The site is authored as classic <script> files that share the global scope
// and export their public API via Object.assign(window, {...}). In dev they are
// compiled in the browser by Babel-standalone; for production we precompile the
// JSX here with esbuild and concatenate the files — each wrapped in its own IIFE
// to reproduce Babel's per-script scope isolation (several files declare the same
// top-level names, e.g. `const { pathForPage } = window.AARoutes;`). Cross-file
// references resolve through the window globals exactly as they do today.
//
// Run: npm run bundle   (output: dist/app.min.js)
import { transform } from 'esbuild';
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Load order MUST match the original index.html script order.
const ORDER = [
  'scripts/routes.js',
  'scripts/chrome.jsx',
  'scripts/page-home.jsx',
  'scripts/page-services.jsx',
  'scripts/page-einvoicing.jsx',
  'scripts/contact-sheet.js',
  'scripts/page-other.jsx',
  'scripts/page-policies.jsx',
  'scripts/page-tools.jsx',
  'scripts/app-root.jsx',
];

// ---- Article bodies are split out of the shared bundle ------------------
//
// Every article body used to ship to every visitor on every page: 87 KB of the
// bundle in Aug 2026, growing ~3 KB with each new post, forever. Someone
// reading the Ajman page downloaded the full text of an article they would
// never open.
//
// Each body now becomes dist/articles/<slug>.js, loaded only on that article's
// own page (prerender.py adds the tag) or fetched on demand when the router
// moves between articles. The shared bundle therefore stops growing with the
// archive — publishing weekly for a decade costs every other page nothing.
//
// The bodies are plain functions that only reference window.AAArt helpers and
// window.AARoutes, so each chunk is self-contained once those are in scope.
// Two registries leave the bundle the same way: article bodies (page-other.jsx)
// and tool bodies (page-tools.jsx). Each split names the file, the registry
// object declared in it, the window map its chunks register into, the map of
// hashed filenames the router reads to fetch a chunk on demand, and the
// directory the chunks are written to. The prelude is the set of shared helpers
// a body may reference — resolved on FIRST RENDER, not when the chunk executes.
const SPLITS = [
  {
    file: 'scripts/page-other.jsx', registry: 'INSIGHT_BODIES', bodies: 'AAArticleBodies',
    chunks: 'AAArticleChunks', dir: 'dist/articles', label: 'article body', out: [],
    prelude: 'var A=window.AAArt||{},R=window.AARoutes||{};\n' +
      'var ART=A.ART,LEAD=A.LEAD,H3=A.H3,artNote=A.artNote,artLink=A.artLink,artInsightLink=A.artInsightLink,' +
      'DeadlinesRoadmap=A.DeadlinesRoadmap,SBRRoadmap=A.SBRRoadmap,FiveCornerDiagram=A.FiveCornerDiagram,' +
      'EInvoiceCTA=A.EInvoiceCTA,EInvoiceGuideLinks=A.EInvoiceGuideLinks;\n' +
      'var pathForPage=R.pathForPage,pathForInsight=R.pathForInsight,INSIGHTS=R.INSIGHTS;\n',
  },
  {
    file: 'scripts/page-tools.jsx', registry: 'TOOL_BODIES', bodies: 'AAToolBodies',
    chunks: 'AAToolChunks', dir: 'dist/tools', label: 'tool body', out: [],
    prelude: 'var T=window.AATools||{},R=window.AARoutes||{};\n' +
      'var aaSubmitLead=T.aaSubmitLead,aaBuildBrandedPdf=T.aaBuildBrandedPdf,AA_MONEY=T.AA_MONEY,aaParseNum=T.aaParseNum,' +
      'AA_TOOL_INPUT=T.AA_TOOL_INPUT,AA_TOOL_LABEL=T.AA_TOOL_LABEL,goContact=T.goContact,aaDubaiToday=T.aaDubaiToday,' +
      'FAQList=window.FAQList;\n' +
      'var pathForPage=R.pathForPage,pathForInsight=R.pathForInsight;\n',
  },
];

function extractBodies(src, split) {
  const map = src.match(new RegExp(`const ${split.registry} = \\{([\\s\\S]*?)\\};`));
  if (!map) throw new Error(`${split.registry} not found — splitting would silently ship nothing`);
  const pairs = [...map[1].matchAll(/'([a-z0-9-]+)':\s*(\w+)/g)].map((m) => ({ slug: m[1], fn: m[2] }));
  if (!pairs.length) throw new Error(`${split.registry} is empty`);

  let rest = src;
  const bodies = [];
  for (const { slug, fn } of pairs) {
    const start = rest.indexOf(`function ${fn}(`);
    if (start === -1) throw new Error(`body component ${fn} (${slug}) not found`);
    // A body ends where the next top-level declaration begins.
    const nexts = [rest.indexOf('\nfunction ', start + 10), rest.indexOf('\nconst ', start + 10)]
      .filter((i) => i > 0);
    const end = nexts.length ? Math.min(...nexts) + 1 : rest.length;
    bodies.push({ slug, fn, code: rest.slice(start, end) });
    rest = rest.slice(0, start) + rest.slice(end);
  }
  // The registry now points at whatever the loaded chunks have registered.
  rest = rest.replace(new RegExp(`const ${split.registry} = \\{[\\s\\S]*?\\};`),
    `const ${split.registry} = new Proxy({}, { get: (_, k) => (window.${split.bodies} || {})[k], has: (_, k) => k in (window.${split.bodies} || {}) });`);
  return { rest, bodies };
}

const parts = [];
for (const file of ORDER) {
  let src = await readFile(file, 'utf8');
  const split = SPLITS.find((s) => s.file === file);
  if (split) {
    const { rest, bodies } = extractBodies(src, split);
    src = rest;
    for (const b of bodies) {
      const { code } = await transform(b.code, {
        loader: 'jsx', jsx: 'transform',
        jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment', target: 'es2019',
      });
      // Helpers are resolved on FIRST RENDER, not when the chunk executes.
      // Both this chunk and app.min.js are `defer`, so they run in document
      // order — and the chunk is placed first so it has registered by the time
      // React mounts. Resolving lazily means the chunk does not care which of
      // the two ran first, which removes a whole class of ordering bug.
      const chunk = `/* ${split.label}: ${b.slug} */\n(function(){\nvar _c;\nfunction _make(){\n` +
        split.prelude +
        `${code}\nreturn ${b.fn};\n}\n` +
        `(window.${split.bodies}=window.${split.bodies}||{})['${b.slug}']=function(props){ if(!_c) _c=_make(); return _c(props); };\n})();\n`;
      const { code: minChunk } = await transform(chunk, { minify: true, target: 'es2019' });
      split.out.push({ slug: b.slug, code: minChunk });
    }
  }
  const loader = file.endsWith('.jsx') ? 'jsx' : 'js';
  const { code } = await transform(src, {
    loader,
    jsx: 'transform',          // classic runtime → React.createElement
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: 'es2019',
  });
  // IIFE-wrap to isolate each file's top-level declarations.
  parts.push(`/* ${file} */\n(function(){\n${code}\n})();\n`);
}

const combined = parts.join('\n');
const { code: min } = await transform(combined, { minify: true, target: 'es2019' });

await mkdir('dist', { recursive: true });
await writeFile('dist/app.min.js', min, 'utf8');
console.log(`dist/app.min.js written — ${(min.length / 1024).toFixed(1)} KB minified (from ${ORDER.length} sources)`);

// Write the per-body chunks and a slug -> hashed-filename manifest per split
// that prerender.py reads, so each page can load exactly one of them.
let runtimeMaps = '';
for (const split of SPLITS) {
  await mkdir(split.dir, { recursive: true });
  const manifest = {};
  let chunkBytes = 0;
  for (const c of split.out) {
    const h = createHash('sha256').update(c.code).digest('hex').slice(0, 10);
    const name = `${c.slug}.${h}.js`;
    await writeFile(`${split.dir}/${name}`, c.code, 'utf8');
    manifest[c.slug] = name;
    chunkBytes += c.code.length;
  }
  // Sweep chunks from previous builds. Filenames carry a content hash, so every
  // edit leaves the old file behind — at weekly cadence that is hundreds of
  // orphans within a year, all of them committed and deployed.
  const keep = new Set([...Object.values(manifest), 'manifest.json']);
  let swept = 0;
  for (const f of await readdir(split.dir).catch(() => [])) {
    if (!keep.has(f)) { await rm(`${split.dir}/${f}`); swept++; }
  }
  if (swept) console.log(`  swept ${swept} stale chunk(s) from ${split.dir}`);
  await writeFile(`${split.dir}/manifest.json`, JSON.stringify(manifest, null, 1), 'utf8');
  // The router needs the same map at runtime: moving between pages must be
  // able to fetch a body chunk that this page never loaded. ~60 bytes per
  // entry against KBs for the body itself, so the growth term is gone.
  runtimeMaps += `window.${split.chunks}=${JSON.stringify(manifest)};\n`;
  const n = split.out.length;
  console.log(`${split.dir}/ — ${n} ${split.label} chunk(s), ${(chunkBytes / 1024).toFixed(1)} KB total` +
    (n ? `, avg ${(chunkBytes / n / 1024).toFixed(1)} KB` : ''));
}
await writeFile('dist/app.min.js', runtimeMaps + min, 'utf8');

// Cache-bust from CONTENT, never by hand.
//
// index.html is the prerender template, so its ?v= strings propagate to all 68
// built pages. They used to be typed manually, which meant a build could ship a
// new bundle behind an unchanged URL — returning visitors then kept the cached
// old bundle and the site silently rendered stale data (a new article resolving
// to DEFAULT_INSIGHT, a search index missing entries). Hashing the actual bytes
// makes the URL change exactly when the file does, and never otherwise.
// The icons are in here because they were left behind. Every visible logo on
// the site moved to the classic mark, but favicon.png and apple-touch-icon.png
// were still the abandoned football design, frozen behind a hand-typed ?v=3
// that nobody had reason to bump. Content-hashing them means the URL moves
// whenever the bytes do, so replacing the artwork is enough on its own.
const STAMPED = ['dist/app.min.js', 'styles/site.css', 'styles/tokens.css', 'assets/vendor/lucide-subset.js',
  'assets/logos/favicon.png', 'assets/logos/apple-touch-icon.png'];
let tpl = await readFile('index.html', 'utf8');
const before = tpl;
for (const asset of STAMPED) {
  let bytes;
  try {
    bytes = await readFile(asset);
  } catch {
    console.warn(`  ! ${asset} not found — leaving its ?v= alone`);
    continue;
  }
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10);
  const pattern = new RegExp(`(${asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?v=)[^"']*`, 'g');
  if (!pattern.test(tpl)) {
    console.warn(`  ! ${asset} has no ?v= reference in index.html — not cache-busted`);
    continue;
  }
  tpl = tpl.replace(new RegExp(`(${asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?v=)[^"']*`, 'g'), `$1${hash}`);
  console.log(`  cache-bust ${asset} -> ?v=${hash}`);
}
if (tpl !== before) await writeFile('index.html', tpl, 'utf8');
