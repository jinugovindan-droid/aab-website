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

// Load order MUST match the original index.html script order.
const ORDER = [
  'scripts/routes.js',
  'scripts/tweaks-panel.jsx',
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
