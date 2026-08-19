# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

"""Vuelca el catálogo real: texto por bloque y posición, más inventario de imágenes."""
import fitz, json, os

PDF = _sys.argv[1] if len(_sys.argv) > 1 else _os.path.join(WORK, "catalogo.pdf")
OUT = WORK

doc = fitz.open(PDF)
paginas = []
for pno in range(len(doc)):
    page = doc[pno]
    bloques = []
    for b in page.get_text("dict")["blocks"]:
        if b["type"] != 0:
            continue
        for line in b["lines"]:
            txt = "".join(s["text"] for s in line["spans"]).strip()
            if not txt:
                continue
            s0 = line["spans"][0]
            bloques.append({
                "t": txt,
                "x": round(line["bbox"][0]),
                "y": round(line["bbox"][1]),
                "sz": round(s0["size"], 1),
                "b": bool(s0["flags"] & 2 ** 4),      # negrita
                "c": "#%06x" % s0["color"],
            })
    bloques.sort(key=lambda z: (z["y"], z["x"]))
    imgs = [{"xref": i["xref"], "bbox": [round(v) for v in i["bbox"]]}
            for i in page.get_image_info(xrefs=True) if i.get("xref")]
    imgs.sort(key=lambda z: (z["bbox"][1], z["bbox"][0]))
    paginas.append({"p": pno + 1, "texto": bloques, "imgs": imgs})

with open(os.path.join(OUT, "catalogo-dump.json"), "w", encoding="utf-8") as f:
    json.dump(paginas, f, ensure_ascii=False, indent=1)

print("paginas:", len(paginas))
print("imagenes totales:", sum(len(p["imgs"]) for p in paginas))
# vista rápida de una página de producto
for b in paginas[6]["texto"][:26]:
    print("  y%-5d x%-4d %-5s %s %s" % (b["y"], b["x"], b["sz"], "N" if b["b"] else " ", b["t"][:64]))
