# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

"""Genera data-catalogo.js a partir del catálogo real, fusionando acabados."""
import json, os, re, unicodedata, collections
from PIL import Image

OUT  = WORK
PUB  = _os.path.join(ROOT, "public")
PROD = os.path.join(PUB, "img", "productos")
TH   = os.path.join(PROD, "th")
os.makedirs(TH, exist_ok=True)

d = json.load(open(os.path.join(OUT, "catalogo-parsed.json"), encoding="utf-8"))
prods, secc = d["productos"], d["secciones"]

def slug(s, n=54):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return re.sub(r"-+", "-", s)[:n]

# ---- Categorías (los 7 sistemas del PDF) ------------------------------------
CAT_ID = {"01":"centrales","02":"interruptores","03":"iluminacion",
          "04":"magnetico","05":"seguridad","06":"cortinas","07":"audio"}
CAT_N  = {"01":"Centrales de Control","02":"Interruptores Inteligentes",
          "03":"Iluminación Inteligente","04":"Sistema Magnético",
          "05":"Seguridad y Sensores","06":"Cortinas Motorizadas","07":"Audio y Control"}
CAT_CORTA = {"01":"Centrales","02":"Interruptores","03":"Iluminación",
             "04":"Magnético","05":"Seguridad","06":"Cortinas","07":"Audio"}
# Foto de proyecto que ilustra cada línea en la portada
CAT_IMG = {"centrales":"proyectos/portal-la-riviera-03.jpg",
           "interruptores":"proyectos/compassion-02.jpg",
           "iluminacion":"proyectos/cerro-mar-01.jpg",
           "magnetico":"proyectos/cerro-mar-03.jpg",
           "seguridad":"proyectos/la-florida-01.jpg",
           "cortinas":"proyectos/cortinas-tuz-01.jpg",
           "audio":"proyectos/portales-del-bosque-04.jpg"}
# Placeholder por categoría (los SVG existentes)
CAT_PH = {"centrales":"control","interruptores":"control","iluminacion":"iluminacion",
          "magnetico":"iluminacion","seguridad":"seguridad","cortinas":"cortinas","audio":"audio"}

secc_por_n = {v["n"]: v for v in secc.values()}

# ---- Grupos a fusionar: mismo aparato, distinto acabado o formato -----------
# Explícito a propósito: una regla automática fusionaría mal las ópticas Galaxy/S3/S5.
FUSION = {
  "MixSwitch":         ("Acabado",       "La línea clásica de interruptor táctil, de 1 a 4 circuitos."),
  "Gauss II":          ("Acabado",       "Segunda generación Gauss con Zigbee 3.0, de 1 a 3 circuitos."),
  "Touch Pro":         ("Acabado",       "Panel táctil de vidrio en formato alargado."),
  "MixSwitch Defy":    ("Color",         "Interruptor de diseño de la línea Defy, 4 circuitos."),
  "Defy Smart Panel":  ("Color",         "Interruptor con gateway Zigbee y pantalla de 2.41\"."),
  "MixSwitch Bach":    ("Formato",       "Control de escenas y circuitos de la serie Bach."),
}
def base(n): return n.split("·")[0].strip()
def sufijo(n):
    b = base(n)
    return n[len(b):].lstrip(" ·").strip()

# ---- Tipo de producto (filtro secundario, derivado del nombre real) ---------
# El orden importa: gana la primera coincidencia.
TIPOS = [
  ("spotlight","Spotlight"), ("downlight","Downlight"), ("proyector","Proyector"),
  ("lineal","Lineal"), ("grille","Lineal"), ("manguera","Tira y manguera"),
  ("tira","Tira y manguera"), ("neon","Tira y manguera"),
  ("plafon","Plafón"), ("plafón","Plafón"), ("colgante","Colgante"),
  ("aplique","Aplique"), ("bañador","Bañador de muro"), ("wall washer","Bañador de muro"),
  ("riel","Riel y accesorios"), ("conector","Riel y accesorios"),
  ("fuente","Fuente y driver"), ("driver","Fuente y driver"),
  ("mixpad","Panel central"), ("gateway","Gateway"), ("hub","Gateway"),
  ("panel","Panel e interruptor"), ("interruptor","Panel e interruptor"),
  ("mixswitch","Panel e interruptor"), ("gauss","Panel e interruptor"),
  ("touch pro","Panel e interruptor"), ("escenas","Panel e interruptor"),
  ("cerradura","Cerradura"), ("chapa","Cerradura"),
  ("camara","Cámara"), ("cámara","Cámara"), ("videoportero","Cámara"),
  ("sensor","Sensor"), ("detector","Sensor"), ("radar","Sensor"),
  ("motor","Cortina"), ("cortina","Cortina"), ("persiana","Cortina"),
  ("parlante","Audio"), ("audio","Audio"), ("bocina","Audio"),
  ("modulo","Módulo magnético"), ("módulo","Módulo magnético"),
  ("magnetic","Módulo magnético"), ("magnét","Módulo magnético"),
]
def serie_de(n):
    low = unicodedata.normalize("NFKD", n).encode("ascii","ignore").decode().lower()
    for k, v in TIPOS:
        kk = unicodedata.normalize("NFKD", k).encode("ascii","ignore").decode().lower()
        if kk in low:
            return v
    return "Otros"

# ---- Construcción ------------------------------------------------------------
grupos = collections.defaultdict(list)
for p in prods:
    b = base(p["nombre"])
    clave = (p["sistema"], b) if b in FUSION else (p["sistema"], p["nombre"], id(p))
    grupos[clave].append(p)

salida, badges = [], collections.Counter()
for clave, lista in grupos.items():
    lista.sort(key=lambda z: (z["pagina"], z["col"], z["y"]))
    p0 = lista[0]
    b = base(p0["nombre"])
    fusion = len(clave) == 2 and b in FUSION

    if fusion:
        eje, desc = FUSION[b]
        nombre, tag = b, desc
    else:
        eje, nombre, tag = None, p0["nombre"], p0["desc"]

    variantes = []
    for p in lista:
        acabado = sufijo(p["nombre"]).replace("Acabado ", "").strip() if fusion else None
        if p["variantes"]:
            for v in p["variantes"]:
                e = {"n": v["n"], "sku": v["sku"]}
                if acabado:
                    e["acabado"] = acabado
                    e["nota"] = p["desc"]        # la descripción propia de ese acabado
                if p.get("img"): e["img"] = p["img"]
                variantes.append(e)
        elif acabado:
            e = {"n": acabado, "sku": p["sku"] or "", "acabado": acabado, "nota": p["desc"]}
            if p.get("img"): e["img"] = p["img"]
            variantes.append(e)

    specs = []
    for p in lista:
        for s in p["specs"]:
            if s not in specs:
                specs.append(s)

    prot = []
    for p in lista:
        badges[p["badge"]] += 1
        if p["badge"] not in prot:
            prot.append(p["badge"])

    cat = CAT_ID[p0["sistema"]]
    salida.append({
        "id": slug(nombre), "sku": p0["sku"] or "", "cat": cat,
        "n": nombre, "serie": serie_de(nombre), "tag": tag,
        # En los fusionados la descripción de cada acabado va en su variante,
        # no concatenada: el encabezado se queda con la del grupo.
        "desc": "" if fusion else " ".join(dict.fromkeys(p["desc"] for p in lista if p["desc"])),
        "img": p0.get("img"), "prot": prot, "specs": specs,
        "variantes": variantes, "eje": eje,
        "pag": p0["pagina"],
    })

salida.sort(key=lambda z: (list(CAT_ID.values()).index(z["cat"]), z["pag"], z["n"]))

# ---- Miniaturas --------------------------------------------------------------
hechas = 0
for s in salida:
    for f in {s["img"]} | {v.get("img") for v in s["variantes"]}:
        if not f: continue
        src = os.path.join(PROD, f)
        if not os.path.exists(src): continue
        dst = os.path.join(TH, f)
        if os.path.exists(dst): continue
        im = Image.open(src).convert("RGB")
        if im.width > 720:
            im = im.resize((720, round(im.height * 720 / im.width)), Image.LANCZOS)
        im.save(dst, "JPEG", quality=82, optimize=True)
        hechas += 1

json.dump({"cats": CAT_ID, "productos": salida},
          open(os.path.join(OUT, "catalogo-final.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)

print("productos finales:", len(salida), " (desde", len(prods), "fichas)")
print("con variantes    :", sum(1 for s in salida if s["variantes"]))
print("con eje de acabado:", sum(1 for s in salida if s["eje"]))
print("miniaturas nuevas:", hechas)
print("\npor categoría:")
for cid in CAT_ID.values():
    print("  %-14s %d" % (cid, sum(1 for s in salida if s["cat"] == cid)))
print("\nbadges:", dict(badges))
print("\nseries:", dict(collections.Counter(s["serie"] for s in salida)))
