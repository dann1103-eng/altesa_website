# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

"""Extrae la foto de cada producto del catálogo, emparejada por posición."""
import fitz, json, os, re, unicodedata, hashlib

PDF = _sys.argv[1] if len(_sys.argv) > 1 else _os.path.join(WORK, "catalogo.pdf")
OUT = WORK
DST = _os.path.join(PUB, "img", "productos")
os.makedirs(DST, exist_ok=True)
os.makedirs(os.path.join(DST, "th"), exist_ok=True)

datos = json.load(open(os.path.join(OUT, "catalogo-parsed.json"), encoding="utf-8"))
prods = datos["productos"]

def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return re.sub(r"-+", "-", s)[:52]

doc = fitz.open(PDF)
por_pagina = {}
for pr in prods:
    por_pagina.setdefault(pr["pagina"], []).append(pr)

asignadas, sin_foto, vistas = 0, [], {}
for pno, lista in sorted(por_pagina.items()):
    page = doc[pno - 1]
    infos = [i for i in page.get_image_info(xrefs=True) if i.get("xref")]
    # Descarta el degradado decorativo del encabezado (arranca en y=0) y lo que
    # ocupa todo el ancho. El alto mínimo es bajo a propósito: las luminarias
    # lineales vienen en fotos anchas y bajas (68×27 pt). Con el umbral anterior
    # de 40 pt se descartaban y la ficha heredaba la foto de la tarjeta de
    # arriba — o el propio degradado, que en el sitio se veía como tarjeta vacía.
    cands = [i for i in infos
             if (i["bbox"][2] - i["bbox"][0]) < 260
             and (i["bbox"][3] - i["bbox"][1]) > 20
             and i["bbox"][1] > 40]

    for pr in lista:
        col = pr["col"]
        opciones = [i for i in cands
                    if ((i["bbox"][0] + i["bbox"][2]) / 2 < 300) == (col == 0)
                    and i["bbox"][3] < pr["y"] + 6]
        if not opciones:
            sin_foto.append(pr["nombre"]); pr["img"] = None; continue
        # la más cercana por encima del nombre
        mejor = max(opciones, key=lambda i: i["bbox"][3])

        pix = fitz.Pixmap(doc, mejor["xref"])
        if pix.n - pix.alpha >= 4:
            pix = fitz.Pixmap(fitz.csRGB, pix)
        if pix.alpha:
            fondo = fitz.Pixmap(fitz.csRGB, pix.irect)
            fondo.set_rect(pix.irect, (255, 255, 255))
            fondo.copy(pix, pix.irect)
            pix = fondo
        data = pix.tobytes("jpg", jpg_quality=88)
        h = hashlib.md5(data).hexdigest()

        nombre = slug(pr["nombre"]) + ".jpg"
        if h in vistas:                       # misma foto para dos fichas
            pr["img"] = vistas[h]
        else:
            ruta = os.path.join(DST, nombre)
            # Solo se reescribe si cambió: la fecha del archivo delata qué fotos
            # son nuevas y cat_build.py rehace únicamente esas miniaturas.
            if not os.path.exists(ruta) or open(ruta, "rb").read() != data:
                with open(ruta, "wb") as f:
                    f.write(data)
            vistas[h] = nombre
            pr["img"] = nombre
        pr["img_w"], pr["img_h"] = pix.width, pix.height
        asignadas += 1
        pix = None

with open(os.path.join(OUT, "catalogo-parsed.json"), "w", encoding="utf-8") as f:
    json.dump(datos, f, ensure_ascii=False, indent=1)

print("productos con foto:", asignadas, "/", len(prods))
print("archivos únicos escritos:", len(vistas))
if sin_foto:
    print("sin foto:", sin_foto)
