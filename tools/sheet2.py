# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

import os, glob
from PIL import Image, ImageDraw, ImageOps

SRC = _os.path.join(PUB, "img", "galeria")
OUT = WORK

files = sorted([f for f in glob.glob(os.path.join(SRC, "*"))
                if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))])

COLS, CW, CH, LBL, PAD = 3, 560, 400, 30, 8
rows = (len(files) + COLS - 1) // COLS
W = COLS * (CW + PAD) + PAD
H = rows * (CH + LBL + PAD) + PAD
sheet = Image.new("RGB", (W, H), (22, 22, 26))
d = ImageDraw.Draw(sheet)

info = []
for i, fp in enumerate(files):
    r, c = divmod(i, COLS)
    x = PAD + c * (CW + PAD)
    y = PAD + r * (CH + LBL + PAD)
    im = ImageOps.exif_transpose(Image.open(fp)).convert("RGB")
    info.append((os.path.basename(fp), im.size))
    th = im.copy()
    th.thumbnail((CW, CH), Image.LANCZOS)
    sheet.paste(th, (x + (CW - th.width) // 2, y + (CH - th.height) // 2))
    d.text((x + 3, y + CH + 8), "%d. %s  %dx%d" % (i + 1, os.path.basename(fp), im.width, im.height),
           fill=(255, 205, 235))

p = os.path.join(OUT, "galeria-sheet.png")
sheet.save(p, optimize=True)
print(p, sheet.size)
for n, s in info:
    print("%-34s %dx%d  %s" % (n, s[0], s[1], "vertical" if s[1] > s[0] else "horizontal"))
