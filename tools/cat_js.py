# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

"""Escribe public/assets/js/data-catalogo.js desde el catálogo real."""
import json, os, collections

OUT = WORK
DST = _os.path.join(PUB, "assets", "js", "data-catalogo.js")

fin = json.load(open(os.path.join(OUT, "catalogo-final.json"), encoding="utf-8"))
par = json.load(open(os.path.join(OUT, "catalogo-parsed.json"), encoding="utf-8"))
prods = fin["productos"]
secc = {v["n"]: v for v in par["secciones"].values()}

CAT = [
 ("centrales","01","Centrales de Control","Centrales","proyectos/portal-la-riviera-03.jpg"),
 ("interruptores","02","Interruptores Inteligentes","Interruptores","proyectos/compassion-02.jpg"),
 ("iluminacion","03","Iluminación Inteligente","Iluminación","proyectos/cerro-mar-01.jpg"),
 ("magnetico","04","Sistema Magnético","Magnético","proyectos/cerro-mar-03.jpg"),
 ("seguridad","05","Seguridad y Sensores","Seguridad","proyectos/la-florida-01.jpg"),
 ("cortinas","06","Cortinas Motorizadas","Cortinas","proyectos/cortinas-tuz-01.jpg"),
 ("audio","07","Audio y Control","Audio","proyectos/portales-del-bosque-04.jpg"),
]
PH = {"centrales":"control","interruptores":"control","iluminacion":"iluminacion",
      "magnetico":"iluminacion","seguridad":"seguridad","cortinas":"cortinas","audio":"audio"}

def js(v, ind=0):
    sp = "  " * ind
    if v is None: return "null"
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, (int, float)): return str(v)
    if isinstance(v, str):
        return '"' + v.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ") + '"'
    if isinstance(v, list):
        if not v: return "[]"
        if all(isinstance(x, str) for x in v):
            return "[" + ", ".join(js(x) for x in v) + "]"
        return "[\n" + ",\n".join(sp + "  " + js(x, ind + 1) for x in v) + "\n" + sp + "]"
    if isinstance(v, dict):
        pares = [(k, x) for k, x in v.items() if x not in (None, "", [], {})]
        return "{ " + ", ".join('%s: %s' % (k, js(x, ind)) for k, x in pares) + " }"
    raise TypeError(type(v))

tipos = sorted({p["serie"] for p in prods})
tipos = [t for t in tipos if t != "Otros"] + (["Otros"] if "Otros" in tipos else [])

L = []
L.append("""/* =========================================================================
   ALTESA — Catálogo comercial 2026
   ---------------------------------------------------------------------------
   Generado desde ALTESA_Catalogol_2026.pdf (31 páginas, 110 fichas).
   Las fichas del mismo aparato en distinto acabado se consolidan en un solo
   producto con variantes: %d productos, %d con variantes.
   Fotografía de producto extraída del propio catálogo → /img/productos/
   ========================================================================= */

window.ALTESA_CAT = {

  /* ---- Los 7 sistemas del catálogo ------------------------------------- */
  categorias: [""" % (len(prods), sum(1 for p in prods if p["variantes"])))

for cid, num, nom, corta, img in CAT:
    s = secc.get(num, {})
    n_prod = sum(1 for p in prods if p["cat"] == cid)
    desc = s.get("intro") or s.get("sub", "")
    L.append('    { id:"%s", num:"%s", n:%s, corta:%s,\n      sub:%s,\n      desc:%s,\n      img:%s, ph:"%s" },'
             % (cid, num, js(nom), js(corta), js(s.get("sub", "").title()), js(desc), js(img), PH[cid]))
L.append("  ],\n")

L.append("  /* ---- Tipo de producto (filtro secundario) ---------------------------- */")
L.append("  tipos: [" + ", ".join(js(t) for t in tipos) + "],\n")

L.append("  /* ---- %d productos ---------------------------------------------------- */" % len(prods))
L.append("  productos: [")
cat_actual = None
for p in prods:
    if p["cat"] != cat_actual:
        cat_actual = p["cat"]
        nom = next(c[2] for c in CAT if c[0] == cat_actual)
        L.append("\n    /* ===== %s ===== */" % nom.upper())
    campos = {
        "id": p["id"], "sku": p["sku"], "cat": p["cat"], "tipo": p["serie"],
        "n": p["n"], "tag": p["tag"],
    }
    linea = "    { " + ", ".join('%s: %s' % (k, js(v)) for k, v in campos.items() if v) + ","
    L.append(linea)
    if p["desc"] and p["desc"] != p["tag"]:
        L.append("      desc: %s," % js(p["desc"]))
    if p["img"]:
        L.append("      img: %s," % js(p["img"]))
    if p["prot"]:
        L.append("      prot: %s," % js(p["prot"]))
    if p["specs"]:
        L.append("      specs: [")
        for s in p["specs"]:
            L.append("        %s," % js(s))
        L.append("      ],")
    if p["variantes"]:
        if p["eje"]:
            L.append("      eje: %s," % js(p["eje"]))
        L.append("      variantes: [")
        for v in p["variantes"]:
            L.append("        %s," % js(v))
        L.append("      ],")
    L.append("    },")
L.append("  ]")
L.append("};")

open(DST, "w", encoding="utf-8").write("\n".join(L) + "\n")
kb = os.path.getsize(DST) / 1024
print("escrito:", DST)
print("%.0f KB · %d productos · %d con variantes · %d tipos"
      % (kb, len(prods), sum(1 for p in prods if p["variantes"]), len(tipos)))
print("SKUs totales (contando variantes):",
      sum(max(1, len(p["variantes"])) for p in prods))
