"""Responsive image variants for the hero photographs and right-sized logos.

The six hero photographs are 2400x1350 JPEGs of 112-204 KB each. Served as
CSS backgrounds they were fetched at full size on phones, and the home hero
pulled three of them at once (471 KB) — a 9-second mobile LCP. This writes
WebP variants at five widths so an <img srcset> can hand a 375px phone a
~30 KB file, and 2x-sized copies of the two logos that every page loads.

Run:  py scripts/build-images.py          (idempotent; skips up-to-date files)
"""
import os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'assets', 'images')
LOGOS = os.path.join(ROOT, 'assets', 'logos')

HERO_WIDTHS = [640, 960, 1280, 1920, 2400]
HEROES = ['dubai-night-king', 'chess-row', 'chess-rook', 'chess-bishop', 'chess-knight-mist', 'chess-king-line']

# (source, output stem, target height in CSS px) — written at 2x for HiDPI.
LOGO_SIZES = [
    ('aab-short-eng-classic.png', 'aab-short-eng-classic-nav', 52),          # header, 52px tall on desktop
    ('aab-short-eng.png', 'aab-short-eng-nav', 52),                          # header, football variant
    ('authentic-accounting-full-classic.png', 'authentic-accounting-full-classic-footer', 56),
    ('authentic-accounting-full.png', 'authentic-accounting-full-footer', 56),
]


def newer(src, dst):
    return not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)


def build_heroes():
    for name in HEROES:
        src = os.path.join(IMG, name + '.jpg')
        if not os.path.exists(src):
            print('  missing', src); continue
        im = Image.open(src).convert('RGB')
        for w in HERO_WIDTHS:
            dst = os.path.join(IMG, f'{name}-{w}.webp')
            if not newer(src, dst):
                continue
            h = round(im.height * w / im.width)
            out = im.resize((w, h), Image.LANCZOS)
            # Slightly lower quality at the largest size: it is only served to
            # wide desktop screens where the scrim hides fine detail anyway.
            q = 68 if w >= 1920 else 72
            out.save(dst, 'WEBP', quality=q, method=6)
            print(f'  {name}-{w}.webp  {os.path.getsize(dst)/1024:5.0f} KB')


def build_logos():
    for src_name, stem, css_h in LOGO_SIZES:
        src = os.path.join(LOGOS, src_name)
        if not os.path.exists(src):
            print('  missing', src); continue
        im = Image.open(src).convert('RGBA')
        h = css_h * 2
        w = round(im.width * h / im.height)
        out = im.resize((w, h), Image.LANCZOS)
        png = os.path.join(LOGOS, stem + '.png')
        webp = os.path.join(LOGOS, stem + '.webp')
        if newer(src, png):
            out.save(png, 'PNG', optimize=True)
            print(f'  {stem}.png   {os.path.getsize(png)/1024:5.0f} KB  {w}x{h}')
        if newer(src, webp):
            out.save(webp, 'WEBP', quality=90, method=6)
            print(f'  {stem}.webp  {os.path.getsize(webp)/1024:5.0f} KB')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    print('hero photographs'); build_heroes()
    print('logos'); build_logos()
