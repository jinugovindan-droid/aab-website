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
import { readFile, writeFile, mkdir } from 'node:fs/promises';
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
  'scripts/app-root.jsx',
];

const parts = [];
for (const file of ORDER) {
  const src = await readFile(file, 'utf8');
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

// Cache-bust from CONTENT, never by hand.
//
// index.html is the prerender template, so its ?v= strings propagate to all 68
// built pages. They used to be typed manually, which meant a build could ship a
// new bundle behind an unchanged URL — returning visitors then kept the cached
// old bundle and the site silently rendered stale data (a new article resolving
// to DEFAULT_INSIGHT, a search index missing entries). Hashing the actual bytes
// makes the URL change exactly when the file does, and never otherwise.
const STAMPED = ['dist/app.min.js', 'styles/site.css', 'styles/tokens.css', 'assets/vendor/lucide-subset.js'];
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
