# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

"""Escribe public/assets/js/data-catalogo.js desde el catálogo real."""
import json, os, collections
import cat_ajustes as AJ          # categorías del sitio: nombres, orden y textos

OUT = WORK
DST = _os.path.join(PUB, "assets", "js", "data-catalogo.js")

fin = json.load(open(os.path.join(OUT, "catalogo-final.json"), encoding="utf-8"))
par = json.load(open(os.path.join(OUT, "catalogo-parsed.json"), encoding="utf-8"))
prods = fin["productos"]
secc = {v["n"]: v for v in par["secciones"].values()}

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
   Generado desde ALTESA_Catalogol_2026.pdf (31 páginas, 110 fichas), con
   los ajustes de ALTESA de tools/cat_ajustes.py: exclusiones, categorías y
   variantes. NO EDITAR A MANO — se rehace con la tubería de tools/.
   Las fichas del mismo aparato en distinto acabado se consolidan en un solo
   producto con variantes: %d productos, %d con variantes.
   Fotografía de producto extraída del propio catálogo → /img/productos/
   ========================================================================= */

window.ALTESA_CAT = {

  /* ---- Las %d categorías del sitio ------------------------------------- */
  categorias: [""" % (len(prods), sum(1 for p in prods if p["variantes"]), len(AJ.CATEGORIAS)))

for i, c in enumerate(AJ.CATEGORIAS):
    s = secc.get(c.get("pdf"), {})
    desc = c.get("desc") or s.get("intro") or s.get("sub", "")
    L.append('    { id:"%s", num:"%02d", n:%s, corta:%s,\n      sub:%s,\n      desc:%s,\n      img:%s, ph:"%s" },'
             % (c["id"], i + 1, js(c["n"]), js(c["corta"]), js(s.get("sub", "").title()),
                js(desc), js(c["img"]), c["ph"]))
L.append("  ],\n")

L.append("  /* ---- Tipo de producto (filtro secundario) ---------------------------- */")
L.append("  tipos: [" + ", ".join(js(t) for t in tipos) + "],\n")

L.append("  /* ---- %d productos ---------------------------------------------------- */" % len(prods))
L.append("  productos: [")
cat_actual = None
for p in prods:
    if p["cat"] != cat_actual:
        cat_actual = p["cat"]
        nom = next(c["n"] for c in AJ.CATEGORIAS if c["id"] == cat_actual)
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
