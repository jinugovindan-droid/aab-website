"""Regenerate the browser/touch icons from the canonical brand mark.

The icons used to be a football-themed mark (see commits 6f4e654 and cddce76,
"Redesign logo as a football-themed mark"). That design was abandoned on the
site itself — every visible logo is aab-short-eng-classic.png — but the icons
were never regenerated, so phones and browser tabs kept showing the football.
iOS share sheets in particular surface the apple-touch-icon, which is where it
was still turning up in August 2026.

Source of truth: assets/logos/aab-short-eng-classic.png. That file is the mark
stacked above the "AUTHENTIC ACCOUNTING" wordmark; we take only the mark,
because a wordmark is illegible at 16px.

Backgrounds are opaque white on purpose: iOS composites apple-touch-icon
transparency to black, which would put a dark ring around the mark.

Run: py scripts/make-favicons.py
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'logos' / 'aab-short-eng-classic.png'
OUT = ROOT / 'assets' / 'logos'

# Sizes Chrome/Safari actually request, plus the multi-res .ico for the
# bare /favicon.ico that clients hit without being told to.
TARGETS = [('favicon.png', 256), ('apple-touch-icon.png', 180)]
ICO_SIZES = [(16, 16), (32, 32), (48, 48), (64, 64)]

BG = (255, 255, 255, 255)
INSET = 0.82          # mark occupies this share of the canvas


def mark_only(img):
    """Crop to the logo mark, discarding the wordmark beneath it.

    The two elements are separated by a band of fully transparent rows, so we
    find that gap rather than hard-coding pixel offsets — the file can be
    re-exported at another size without breaking this.
    """
    alpha = img.getchannel('A')
    rows = [alpha.crop((0, y, img.width, y + 1)).getbbox() is not None
            for y in range(img.height)]
    bands, start = [], None
    for y, has in enumerate(rows):
        if has and start is None:
            start = y
        elif not has and start is not None:
            bands.append((start, y))
            start = None
    if start is not None:
        bands.append((start, img.height))
    if not bands:
        raise SystemExit(f'{SRC.name} looks empty — no visible pixels')
    top, bottom = bands[0]
    box = alpha.crop((0, top, img.width, bottom)).getbbox()
    return img.crop((box[0], top, box[2], bottom))


def square(mark, size):
    canvas = Image.new('RGBA', (size, size), BG)
    target = int(size * INSET)
    scaled = mark.copy()
    scaled.thumbnail((target, target), Image.LANCZOS)
    canvas.paste(scaled,
                 ((size - scaled.width) // 2, (size - scaled.height) // 2),
                 scaled)
    return canvas


src = Image.open(SRC).convert('RGBA')
mark = mark_only(src)
print(f'{SRC.name}: mark cropped to {mark.width}x{mark.height}')

for name, size in TARGETS:
    icon = square(mark, size)
    path = OUT / name
    icon.convert('RGB').save(path, 'PNG', optimize=True)
    print(f'  {name:<24} {size}x{size}  {path.stat().st_size / 1024:.1f} KB')

ico = ROOT / 'favicon.ico'
square(mark, 64).convert('RGB').save(ico, 'ICO', sizes=ICO_SIZES)
print(f'  {"favicon.ico (root)":<24} {"/".join(str(s[0]) for s in ICO_SIZES)}  '
      f'{ico.stat().st_size / 1024:.1f} KB')
