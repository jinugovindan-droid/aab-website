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

  // ---- Favicons: isolate the MARK (top ~73% of the logo, drop the wordmark) and square it ----
  const src = await Jimp.read(path.join('assets', 'logos', 'aab-short-eng.png'));
  const mark = src.clone().crop(0, 0, src.bitmap.width, Math.round(src.bitmap.height * 0.73));
  mark.autocrop({ tolerance: 0.01, cropOnlyFrames: false }); // trim transparent border to a tight mark
  const side = Math.max(mark.bitmap.width, mark.bitmap.height);
  const pad = Math.round(side * 0.14);
  const S = side + pad * 2;
  const place = (canvas) => canvas.composite(mark, Math.round((S - mark.bitmap.width) / 2), Math.round((S - mark.bitmap.height) / 2));

  const favicon = new Jimp(S, S, 0x00000000); place(favicon); favicon.resize(256, 256);   // transparent, for browser tab
  await favicon.writeAsync(path.join('assets', 'logos', 'favicon.png'));
  const apple = new Jimp(S, S, 0xffffffff); place(apple); apple.resize(180, 180);           // opaque white, for iOS home screen
  apple.quality(92);
  await apple.writeAsync(path.join('assets', 'logos', 'apple-touch-icon.png'));
  console.log('wrote assets/logos/favicon.png (256x256) + apple-touch-icon.png (180x180) from the mark');
})().catch((e) => { console.error(e); process.exit(1); });
