# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

import fitz, json, os, re, unicodedata, hashlib

PDF = _sys.argv[1] if len(_sys.argv) > 1 else _os.path.join(WORK, "catalogo.pdf")
OUT = WORK
DST = _os.path.join(PUB, "img", "productos")

datos = json.load(open(os.path.join(OUT, "catalogo-parsed.json"), encoding="utf-8"))
prods = datos["productos"]
faltan = [p for p in prods if not p.get("img")]
print("faltan:", [p["nombre"] for p in faltan])

def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return re.sub(r"-+", "-", s)[:52]

doc = fitz.open(PDF)
usadas = {p.get("img") for p in prods if p.get("img")}

for pr in faltan:
    page = doc[pr["pagina"] - 1]
    infos = [i for i in page.get_image_info(xrefs=True) if i.get("xref")]
    col = pr["col"]
    # cualquier imagen razonable en la misma columna dentro del alto de la tarjeta
    cands = [i for i in infos
             if ((i["bbox"][0] + i["bbox"][2]) / 2 < 300) == (col == 0)
             and (i["bbox"][2] - i["bbox"][0]) < 300
             and (i["bbox"][3] - i["bbox"][1]) > 30
             and pr["y"] - 230 < i["bbox"][3] < pr["y"] + 30]
    print("  %-36s p%-3d col%d candidatas=%d" % (pr["nombre"], pr["pagina"], col, len(cands)))
    if not cands:
        continue
    mejor = max(cands, key=lambda i: i["bbox"][3])
    pix = fitz.Pixmap(doc, mejor["xref"])
    if pix.n - pix.alpha >= 4:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    if pix.alpha:
        fondo = fitz.Pixmap(fitz.csRGB, pix.irect)
        fondo.set_rect(pix.irect, (255, 255, 255))
        fondo.copy(pix, pix.irect)
        pix = fondo
    data = pix.tobytes("jpg", jpg_quality=88)
    nombre = slug(pr["nombre"]) + ".jpg"
    with open(os.path.join(DST, nombre), "wb") as f:
        f.write(data)
    pr["img"] = nombre
    print("     -> %s (%dx%d)" % (nombre, pix.width, pix.height))

json.dump(datos, open(os.path.join(OUT, "catalogo-parsed.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print("con foto ahora:", sum(1 for p in prods if p.get("img")), "/", len(prods))
