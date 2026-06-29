# e-Invoicing Masterclass Invitation — Option A (standalone PDF)

A self-contained 2-page A4 leaflet inviting partner forums/communities to a
complimentary UAE e-Invoicing masterclass delivered by Authentic Accounting.
Imported from the Claude Design project `E Invoicing PPT June'26`
(file: *e-Invoicing Hook - Option A.html*). Uses the company theme — palette and
type match `styles/tokens.css`; styles are inlined so the page is fully portable.

This is a **standalone print deliverable**, intentionally kept outside the
website routes/bundle. Do not wire it into `scripts/*.jsx` or the prerender.

## Files
- `index.html` — the design (page 1 = dark hook, page 2 = white CTA + QR)
- `assets/logos/aa-logo.png` — transparent brand logo (placed directly on bg)
- `e-Invoicing-Masterclass-Invitation.pdf` — rendered deliverable

## Regenerate the PDF
The QR code is generated at load time by `qrcodejs` (CDN), so render with a real
browser engine and a virtual-time budget so the script finishes before capture:

```sh
chrome --headless=new --disable-gpu --no-sandbox \
  --no-pdf-header-footer --run-all-compositor-stages-before-draw \
  --virtual-time-budget=10000 \
  --print-to-pdf="e-Invoicing-Masterclass-Invitation.pdf" \
  "file:///D:/Code/aab-website/print/einvoicing-masterclass-invite/index.html"
```

`@page { size: 210mm 297mm; margin: 0 }` in the HTML forces exact A4, one
physical page per `.page` block. Microsoft Edge works identically
(`msedge.exe`, same flags). Requires network access on first render for the
Google Fonts + QR CDN.
