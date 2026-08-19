# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

"""Parsea el catálogo ALTESA 2026 a estructura de productos con variantes."""
import json, os, re, unicodedata

OUT = WORK
pags = json.load(open(os.path.join(OUT, "catalogo-dump.json"), encoding="utf-8"))

PLUM = "#aa3a80"
COL_SPLIT = 300          # frontera entre columna izquierda y derecha
SECC = {}                # pagina de portada -> (numero, titulo, subtitulo, intro)

def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return re.sub(r"-+", "-", s)

# ---- 1. Portadas de sistema -------------------------------------------------
# Se anclan en el marcador «SISTEMA NN»: el título va a tamaño 20 en negrita.
for p in pags:
    t = p["texto"]
    marca = next((b for b in t if re.fullmatch(r"SISTEMA\s+\d+", b["t"].strip())), None)
    if not marca:
        continue
    titulo = [b for b in t if b["sz"] >= 15 and b["b"]]
    sub    = [b for b in t if b["c"] == PLUM and 6 <= b["sz"] <= 9]
    intro  = [b for b in t if 8.5 <= b["sz"] <= 10.5 and not b["b"]]
    if not titulo:
        continue
    SECC[p["p"]] = {
        "n": marca["t"].split()[-1],
        "titulo": titulo[0]["t"].title(),
        "sub": sub[0]["t"] if sub else "",
        "intro": " ".join(b["t"] for b in intro),
    }

# ---- 2. Productos -----------------------------------------------------------
productos = []
seccion_actual = None

for p in pags:
    if p["p"] in SECC:
        seccion_actual = SECC[p["p"]]
        continue
    if seccion_actual is None:
        continue

    for col in (0, 1):
        lineas = [b for b in p["texto"]
                  if (b["x"] < COL_SPLIT) == (col == 0) and b["y"] > 55]
        lineas.sort(key=lambda z: (z["y"], z["x"]))

        # los badges abren cada tarjeta
        arranques = [i for i, b in enumerate(lineas) if b["sz"] == 5.6 and b["b"]]
        for k, i0 in enumerate(arranques):
            i1 = arranques[k + 1] if k + 1 < len(arranques) else len(lineas)
            card = lineas[i0:i1]
            nombre = next((b for b in card if b["sz"] == 8.2 and b["b"]), None)
            if not nombre:
                continue

            badge = card[0]["t"]
            sku   = next((b["t"] for b in card if b["sz"] == 6.2 and b["c"] == PLUM), None)
            desc  = next((b["t"] for b in card if b["sz"] == 6.6), "")
            specs = [b["t"] for b in card if b["sz"] == 6.1]

            # variantes: todo lo que sigue a la cabecera "MODELO POR VARIANTE"
            variantes = []
            iv = next((j for j, b in enumerate(card)
                       if "MODELO POR VARIANTE" in b["t"].upper()), None)
            if iv is not None:
                resto = sorted(card[iv + 1:], key=lambda z: (z["y"], z["x"]))
                pendiente = None
                for b in resto:
                    es_sku = b["c"] == PLUM
                    if es_sku and pendiente:
                        variantes.append({"n": pendiente, "sku": b["t"]})
                        pendiente = None
                    elif not es_sku:
                        pendiente = b["t"]

            productos.append({
                "pagina": p["p"], "col": col,
                "sistema": seccion_actual["titulo"],
                "badge": badge, "nombre": nombre["t"], "sku": sku,
                "desc": desc, "specs": specs, "variantes": variantes,
                "y": nombre["y"],
            })

with open(os.path.join(OUT, "catalogo-parsed.json"), "w", encoding="utf-8") as f:
    json.dump({"secciones": SECC, "productos": productos}, f, ensure_ascii=False, indent=1)

print("secciones:", len(SECC))
for k, v in sorted(SECC.items()):
    n = sum(1 for x in productos if x["sistema"] == v["titulo"])
    print("  p%-3d %-32s %d productos" % (k, v["titulo"], n))
print("\nTOTAL productos:", len(productos))
print("con SKU propio:", sum(1 for x in productos if x["sku"]))
print("con variantes :", sum(1 for x in productos if x["variantes"]))
print("\n--- muestra ---")
for x in productos[:2] + [y for y in productos if y["variantes"]][:2]:
    print(json.dumps(x, ensure_ascii=False)[:400])
