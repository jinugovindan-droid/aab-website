// Generates the Open Graph / social-share card: an OPAQUE 1200x630 image
// (transparent logos + wrong dimensions were breaking WhatsApp/iMessage/FB previews).
// Run: node scripts/make-og.cjs   ->   assets/og/og-card.png
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

(async () => {
  const W = 1200, H = 630;
  const card = new Jimp(W, H, 0xffffffff);            // opaque white background

  // Brand accent bar along the bottom (cyan #29ABE2)
  card.composite(new Jimp(W, 14, 0x29abe2ff), 0, H - 14);

  // Clean English logo, kept modest so the card breathes (not cramped)
  const logo = await Jimp.read(path.join('assets', 'logos', 'aab-short-eng.png'));
  logo.scaleToFit(500, 280);
  card.composite(logo, Math.round((W - logo.bitmap.width) / 2), Math.round(150 + (280 - logo.bitmap.height) / 2));

  // Tagline
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  card.print(
    font, 0, 500,
    { text: 'UAE Compliance & Advisory  -  Reconciliation discipline since 2017', alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER },
    W
  );

  fs.mkdirSync('assets/og', { recursive: true });
  card.quality(88);
  await card.writeAsync(path.join('assets', 'og', 'og-card.jpg')); // JPEG = no alpha channel, best for social scrapers
  const b = fs.statSync('assets/og/og-card.jpg').size;
  console.log('wrote assets/og/og-card.jpg (' + W + 'x' + H + ', ' + (b / 1024).toFixed(1) + ' KB, opaque JPEG)');
})().catch((e) => { console.error(e); process.exit(1); });
