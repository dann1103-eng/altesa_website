# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

"""Genera derivados web de las fotos del dossier y preserva los originales."""
import os, glob, shutil
from PIL import Image, ImageOps

BASE = _os.path.join(PUB, "img", "proyectos")
ORIG = os.path.join(BASE, "_originales")
TH   = os.path.join(BASE, "th")
os.makedirs(ORIG, exist_ok=True)
os.makedirs(TH, exist_ok=True)

# 1. Mover los originales una sola vez
for f in glob.glob(os.path.join(BASE, "*.jpg")):
    dest = os.path.join(ORIG, os.path.basename(f))
    if not os.path.exists(dest):
        shutil.move(f, dest)

FULL_W, TH_W = 1600, 720
tot_o = tot_f = tot_t = 0

for f in sorted(glob.glob(os.path.join(ORIG, "*.jpg"))):
    name = os.path.basename(f)
    tot_o += os.path.getsize(f)
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")

    full = im.copy()
    if full.width > FULL_W:
        full = full.resize((FULL_W, round(full.height * FULL_W / full.width)), Image.LANCZOS)
    p = os.path.join(BASE, name)
    full.save(p, "JPEG", quality=82, optimize=True, progressive=True)
    tot_f += os.path.getsize(p)

    th = im.copy()
    if th.width > TH_W:
        th = th.resize((TH_W, round(th.height * TH_W / th.width)), Image.LANCZOS)
    p = os.path.join(TH, name)
    th.save(p, "JPEG", quality=80, optimize=True, progressive=True)
    tot_t += os.path.getsize(p)

mb = lambda b: b / 1024 / 1024
n = len(glob.glob(os.path.join(ORIG, "*.jpg")))
print("%d fotos" % n)
print("originales : %5.1f MB  -> public/img/proyectos/_originales/" % mb(tot_o))
print("web 1600px : %5.1f MB  -> public/img/proyectos/" % mb(tot_f))
print("thumbs 720 : %5.1f MB  -> public/img/proyectos/th/" % mb(tot_t))
print("ahorro en carga de catalogo: %.0f%%" % (100 * (1 - (tot_t / tot_o))))
