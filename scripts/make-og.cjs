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

  // Clean English logo, centred. No tagline text — WhatsApp/social already show
  // the title + description beside the thumbnail, and small text just smudges when
  // the 1200x630 card is scaled down to a thumbnail.
  const logo = await Jimp.read(path.join('assets', 'logos', 'aab-short-eng.png'));
  logo.scaleToFit(600, 380);
  card.composite(
    logo,
    Math.round((W - logo.bitmap.width) / 2),
    Math.round(((H - 14) - logo.bitmap.height) / 2) // vertically centred above the accent bar
  );

  fs.mkdirSync('assets/og', { recursive: true });
  card.quality(88);
  await card.writeAsync(path.join('assets', 'og', 'og-card.jpg')); // JPEG = no alpha channel, best for social scrapers
  const b = fs.statSync('assets/og/og-card.jpg').size;
  console.log('wrote assets/og/og-card.jpg (' + W + 'x' + H + ', ' + (b / 1024).toFixed(1) + ' KB, opaque JPEG)');
})().catch((e) => { console.error(e); process.exit(1); });
