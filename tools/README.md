# tools/

Scripts de mantenimiento. Todos resuelven sus rutas desde la raíz del repo, así
que se ejecutan desde donde sea. Requieren `PyMuPDF` y `Pillow`:

```bash
pip install pymupdf pillow
```

Los archivos intermedios se escriben en `tools/_work/`, que está en `.gitignore`.

---

## Versionado de assets — el que más se usa

Tras tocar `site.css` o cualquier `.js`, hay que subir la versión o el navegador
sirve la copia vieja. Es la causa número uno de «no veo mis cambios».

```bash
python tools/bump.py 20260819-1
```

Reescribe `?v=` en el `<link>` y los `<script>` de las 6 páginas.

---

## Importar un catálogo nuevo desde PDF

Así se generaron los 101 productos actuales a partir de `ALTESA_Catalogol_2026.pdf`
(31 páginas, 110 fichas). Se ejecuta en orden:

```bash
python tools/cat_dump.py  ruta/al/catalogo.pdf   # texto posicionado + inventario de imágenes
python tools/cat_parse.py                        # agrupa en fichas: nombre, SKU, specs, variantes
python tools/cat_imgs.py  ruta/al/catalogo.pdf   # extrae la foto de cada ficha por posición
python tools/cat_imgs_fix.py ruta/al/catalogo.pdf # segunda pasada para las que quedaron sin foto
python tools/cat_build.py                        # fusiona acabados y genera miniaturas
python tools/cat_js.py                           # escribe public/assets/js/data-catalogo.js
python tools/bump.py $(date +%Y%m%d)-1
```

**Cómo saber si el parseo salió bien:** `cat_parse.py` imprime el número de
productos por sistema. Tienen que coincidir con el índice del PDF. En el catálogo
2026 eso era 10 · 19 · 44 · 17 · 12 · 5 · 3 = 110. Si no cuadra, el parser perdió
o duplicó fichas y hay que revisar antes de seguir.

### La fusión de variantes es manual, y conviene que siga siéndolo

`cat_build.py` tiene un diccionario `FUSION` con los grupos que son el mismo
aparato en distinto acabado o formato. Está escrito a mano a propósito:

La regla automática obvia —«mismo prefijo antes del `·` → misma familia»—
fusionaría `Galaxy · Spotlight Ajustable` con `Galaxy · Spotlight Ultradelgado`,
que son ópticas distintas con precio distinto. Lo mismo con las series S3, S5 y
los parlantes BM2. Al agregar productos nuevos, revisar ese diccionario a mano.

---

## Fotografía

**Ver de golpe lo que llegó a `public/img/galeria/`:**

```bash
python tools/sheet2.py     # hoja de contactos en tools/_work/
```

**Derivar versiones web** (1600 px para uso general, 720 px para rejillas), y
mover los originales a `_originales/`:

```bash
python tools/optimize.py
```

Los originales de impresión están fuera del repo por `.gitignore`: pesan ~100 MB
y ninguna página los enlaza. Viven solo en la máquina de Daniel.
