# -*- coding: utf-8 -*-
"""
ALTESA — decisiones del cliente sobre el catálogo del PDF
===========================================================================
El PDF manda en fichas, SKUs, specs y fotos. ALTESA decide qué se publica,
en qué categoría y agrupado cómo. Esas decisiones viven aquí, en vez de
parcheadas en data-catalogo.js, para que sobrevivan a la próxima importación.

    cat_build.py  aplica RENOMBRAR, FUSION_EXTRA, MOVER_* y EXCLUIR
    cat_js.py     toma CATEGORIAS: lo que el sitio muestra y en qué orden

Cada ajuste se valida al construir: una exclusión que ya no encuentra su
producto, o un producto que cae en una categoría inexistente, detiene la
tubería con un mensaje claro en lugar de publicar algo a medias.

Ronda 1 · 29 sep 2026 — comentarios de ALTESA sobre el sitio publicado.
===========================================================================
"""

# ---- Categorías del sitio, en el orden en que se muestran ------------------
# `pdf`  número de sistema en el PDF: su texto de portada es la descripción.
# `desc` descripción propia; manda sobre la del PDF. Hace falta en las
#        categorías que el PDF no tiene y en las que perdieron productos.
# `img`  foto de portada (relativa a img/), de un proyecto que tenga instalado
#        ese sistema según data-proyectos.js.
CATEGORIAS = [
    dict(id="centrales", n="Centrales de Control", corta="Centrales",
         img="proyectos/portal-la-riviera-03.jpg", ph="control", pdf="01"),

    dict(id="interruptores", n="Interruptores Inteligentes", corta="Interruptores",
         img="proyectos/compassion-02.jpg", ph="control", pdf="02"),

    # Sin las tiras, que pasaron a su propia categoría
    dict(id="iluminacion", n="Iluminación Inteligente", corta="Iluminación",
         img="proyectos/cerro-mar-01.jpg", ph="iluminacion", pdf="03",
         desc="GALAXY · SOPRO · SERIE S · SISTEMA MAGNÉTICO Luz de calidad "
              "arquitectónica: spotlights antideslumbrantes, luminarias de techo de "
              "diseño y un sistema magnético modular. Todo con control de intensidad "
              "y temperatura de color desde la app, paneles o voz."),

    dict(id="tiras", n="Tiras LED", corta="Tiras LED",
         img="proyectos/legion-02.jpg", ph="iluminacion",
         desc="SOPRO · SKY DOME · COB Líneas de luz continuas para cielos falsos, "
              "muebles y nichos: tiras COB de alto CRI, kits RGB y bicolor, con "
              "controladores dimensionados según la longitud del proyecto. Intensidad "
              "y temperatura de color desde la app, paneles o voz."),

    dict(id="magnetico", n="Sistema Magnético", corta="Magnético",
         img="proyectos/cerro-mar-03.jpg", ph="iluminacion", pdf="04"),

    # Las tres que salen de «Seguridad y Sensores» del PDF
    dict(id="chapas", n="Chapas Smart", corta="Chapas",
         img="proyectos/cabanas-ataco-03.jpg", ph="accesos",
         desc="CERRADURAS BIOMÉTRICAS · WI-FI Acceso sin llaves con huella, clave, "
              "NFC y códigos de un solo uso para visitas y huéspedes. La V5 Face "
              "suma reconocimiento facial y videoportero en la misma puerta."),

    dict(id="sensores", n="Sensores Inteligentes", corta="Sensores",
         img="proyectos/compassion-03.jpg", ph="sensores",
         desc="SENSORES ZIGBEE Una red que detecta presencia, movimiento, apertura "
              "de puertas y ventanas, humo, gas, fugas de agua, temperatura y "
              "humedad, más un botón de emergencia. Cada evento puede disparar una "
              "automatización en tiempo real."),

    dict(id="camaras", n="Cámaras de Seguridad", corta="Cámaras",
         img="proyectos/la-florida-01.jpg", ph="seguridad",
         desc="VIDEOVIGILANCIA 2K · 4MP Cámara interior motorizada con giro de 350° "
              "y audio de dos vías, y cámara exterior de 4 MP con sello IP66 y "
              "alimentación PoE, con monitoreo en tiempo real."),

    dict(id="cortinas", n="Cortinas Motorizadas", corta="Cortinas",
         img="proyectos/cortinas-tuz-01.jpg", ph="cortinas", pdf="06"),

    # Sin el control infrarrojo, que pasó a Control de A/C
    dict(id="audio", n="Audio Ambiental", corta="Audio",
         img="proyectos/portales-del-bosque-04.jpg", ph="audio", pdf="07",
         desc="MÚSICA AMBIENTAL · HI-FI El toque final de la experiencia: música "
              "ambiental Hi-Fi empotrada en el cielo falso, con parlantes esclavos "
              "para extender la cobertura por zonas."),

    dict(id="clima", n="Control de A/C", corta="Control A/C",
         img="proyectos/cabanas-ataco-02.jpg", ph="clima",
         desc="MAGIC DOT · CONTROL INFRARROJO Vuelve inteligente el aire "
              "acondicionado que ya está instalado, sin cambiar el equipo: aprende "
              "los códigos de su control remoto y lo suma al sistema. Sirve también "
              "para televisores y proyectores."),
]

# ---- De la categoría del PDF a la del sitio --------------------------------
# Por defecto cada producto queda en la categoría de su sistema del PDF.
# La regla por tipo va primero para que un producto nuevo del mismo tipo caiga
# solo en su sitio en la próxima importación.
MOVER_TIPO = {
    ("iluminacion", "Tira y manguera"): "tiras",
    ("seguridad",   "Cerradura"):       "chapas",
    ("seguridad",   "Cámara"):          "camaras",
    ("seguridad",   "Sensor"):          "sensores",
}
# Casos que la regla por tipo no alcanza
MOVER_ID = {
    "boton-de-emergencia":            "sensores",  # tipo «Otros»; sensor Zigbee SE30
    "magic-dot-control-ir-universal": "clima",     # el control IR negro de Audio
}

# ---- Fichas que el sitio muestra como variante de otra ---------------------
# FUSION (en cat_build.py) agrupa por el texto previo al «·». Estas fichas no
# lo traen, así que se les da ese formato antes de agrupar. El orden importa:
# la primera de cada grupo es la principal. ALTESA pidió que el 8W sea una
# variante del 15W.
RENOMBRAR = {
    "Spotlight Magnético 15W": "Spotlight Magnético · 15W",
    "Spotlight Magnético 8W":  "Spotlight Magnético · 8W",
}
FUSION_EXTRA = {
    "Spotlight Magnético": ("Potencia",
                            "Acento dirigido y orientable sobre el riel, en 15W u 8W."),
}

# ---- Fuera del sitio -------------------------------------------------------
EXCLUIR = {
    # Centrales
    "gauss-g1-pantalla-con-perilla",
    "mixpad-s12",
    "mixpad-10-matter",
    "mixpad-12-matter",
    "mixpad-4-ai-matter",
    # Interruptores
    "mixswitch-monofasico-sin-neutro",
    # Cortinas
    "cortina-de-luz-3d-2a-gen",
    "motor-de-cortina-db28",
    "motor-de-cortina-ultra-silencioso",
}
# «Quitar los que no tengan imagen en Iluminación»: los que se veían sin foto
# eran un error de extracción de cat_imgs.py, ya corregido; en el PDF todos
# tienen la suya. Si ALTESA igual los quiere fuera, eran estos:
#   s10-sopro-luminaria-lineal · spotlight-rgb-10w-38 ·
#   luminaria-lineal-grille-4-30w · lineal-grille-magnetico-15w ·
#   proyector-magnetico-15w
