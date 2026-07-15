# UAE E-Invoicing Client Briefing — flyer (standalone PDF)

A self-contained one-page A4 flyer briefing clients on the UAE Ministry of
Finance e-invoicing mandate: OpenPeppol / 5-corner primer, the phased
ASP-selection and go-live deadlines, and Authentic Accounting's engagement
scope. Imported from the Claude Design project `E invoicing Flyer`
(file: *flyer-print.html*). Uses the company theme — palette and type match
`styles/tokens.css`; styles are inlined so the page is fully portable.
Dates mirror the live `/e-invoicing` page (Phase 1: 30 Oct 2026 / 1 Jan 2027;
Phase 2: 31 Mar 2027 / 1 Jul 2027; Phase 3: 31 Mar 2027 / 1 Oct 2027) — if the
MoF timeline changes, update both together.

This is a **standalone print deliverable**, intentionally kept outside the
website routes/bundle. Do not wire it into `scripts/*.jsx` or the prerender.

## Files
- `index.html` — the flyer (screen shows a grey gallery surround; print is exact A4)
- `assets/logos/aa-logo.png` — high-res brand logo (5555×3490, print-grade)
- `UAE-E-Invoicing-Client-Briefing.pdf` — rendered deliverable

## Notes
- The QR code (→ `https://www.aaccounting.me/e-invoicing`) is a **static inline
  SVG** — no CDN script runs at load. If the target URL ever changes, regenerate
  the SVG with `qrcode-generator` (`qrcode(0,'M')`, cellSize 4, margin 0,
  scalable) and replace the contents of `#qr-invite`.
- Footer/header anchors keep real `text-decoration: underline` in print so PDF
  engines emit clickable link annotations (site ×4, QR, WhatsApp, mailto).

## Regenerate the PDF
No scripts run at load, but Google Fonts (Oswald + Inter) load from the CDN, so
render with a virtual-time budget and network access:

```sh
msedge --headless=new --disable-gpu --no-sandbox \
  --no-pdf-header-footer --run-all-compositor-stages-before-draw \
  --virtual-time-budget=10000 \
  --print-to-pdf="UAE-E-Invoicing-Client-Briefing.pdf" \
  "file:///D:/Code/aab-website/print/einvoicing-client-flyer/index.html"
```

`@page { size: A4 portrait; margin: 0 }` in the HTML forces exact A4. Chrome
works identically (`chrome.exe`, same flags).
