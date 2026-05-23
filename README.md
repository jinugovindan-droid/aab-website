# Accounting Website

Static HTML website.

## Structure
- `index.html` — main page
- `assets/` — images and media
- `scripts/` — JavaScript
- `styles/` — CSS

## Local dev

From the project root:

```bash
npm run dev
```

The dev server starts on port **5173** (or the next free port if that one is busy) and prints the URLs in the terminal.

Or without npm:

```bash
python3 scripts/dev-server.py
```

Example URLs (port may differ — check terminal output):

- Home — http://localhost:5173/
- Contact — http://localhost:5173/#contact
- Insights — http://localhost:5173/#insights
- About — http://localhost:5173/#about

If you see `Address already in use`, another server is still running. Stop it with `Ctrl+C` in that terminal, or run `lsof -i :5173` to find the process.

Use hash URLs (`/#page`) for direct links. Opening `/contact` without the hash will 404 — the site is a single `index.html` with client-side routing.

Do not open `index.html` directly as a `file://` URL; use a local server so scripts and assets load correctly.
