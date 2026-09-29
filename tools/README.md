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

Así se generaron los 91 productos actuales a partir de `ALTESA_Catalogol_2026.pdf`
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

### Lo que decide ALTESA vive en `cat_ajustes.py`

El PDF manda en fichas, SKUs, specs y fotos; ALTESA decide qué se publica y cómo
se agrupa. Esas decisiones están en `tools/cat_ajustes.py`, nunca parcheadas en
`data-catalogo.js`, para que sobrevivan a la próxima importación:

| Qué | Dónde | Ejemplo de la ronda 1 |
|---|---|---|
| Categorías del sitio, orden y textos | `CATEGORIAS` | Seguridad se partió en Chapas, Sensores y Cámaras |
| Mover productos de categoría | `MOVER_TIPO`, `MOVER_ID` | las tiras pasaron de Iluminación a Tiras LED |
| Mostrar una ficha como variante de otra | `RENOMBRAR` + `FUSION_EXTRA` | Spotlight Magnético 8W, variante del de 15W |
| Retirar productos | `EXCLUIR` | MixPad S12, 10, 12 y 4; motores de cortina DB28 |

Con una ronda nueva de comentarios basta con editar ese archivo y correr
`cat_build.py` y `cat_js.py` (los pasos anteriores solo hacen falta si cambia el
PDF). Si una exclusión ya no encuentra su producto, o un producto queda en una
categoría que no existe, `cat_build.py` se detiene y dice cuál.

### Fotos: el emparejamiento es por posición

`cat_imgs.py` asigna a cada ficha la foto más cercana por encima de su nombre.
Hasta septiembre de 2026 descartaba las imágenes de menos de 40 pt de alto, y
con eso perdía las fotos anchas y bajas de las luminarias lineales: cinco
productos mostraban la foto de la tarjeta de arriba o el degradado del
encabezado, que en el sitio se veía como tarjeta vacía. Ahora el umbral es de
20 pt y el degradado se descarta por posición. Si una ficha nueva sale con foto
ajena, revisar ahí primero.

`cat_imgs.py` solo reescribe una foto si cambió, y `cat_build.py` rehace la
miniatura cuando su foto es más nueva: una reimportación sin cambios no toca
ni un archivo de `img/productos/`.

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

---

## Clips de la vitrina vertical (`/reel.html`)

```bash
python tools/reel_media.py            # arma los que falten
python tools/reel_media.py --force    # rehace los 16
```

Genera `public/video/reel/*.mp4` (720×1280, H.264, sin audio, ~10 s, ~600 KB)
y su póster en `public/img/reel/*.jpg`. Requiere **ffmpeg** en el PATH:

```bash
winget install Gyan.FFmpeg
```

El material de origen son las fotos de `img/proyectos/`, `img/galeria/` e
`img/hero/`; el guion de qué foto va en cada clip está en el diccionario
`CLIPS` al inicio del script. Cada clip es A → B → A con disolvencias, y el
tercer tramo cierra en el encuadre inicial para que el `loop` no dé un salto.

**Por qué el recorte a 3:4.** Las fotos del dossier son 16:9 y 5:4. Metidas
enteras en un lienzo 9:16 quedaban como una franja con medio teléfono en negro.
Recortadas al centro a 3:4, la foto nítida ocupa ~73 % del alto y el resto es la
misma foto desenfocada de fondo — el recurso habitual de Reels. Si una foto
queda mal encuadrada, se cambia por otra en `CLIPS` y el recorte se mantiene:
así se descartaron `compassion-01` (cortaba el rótulo) y `central-monitoreo`
(cortaba una cabeza).

**Cuando lleguen videos reales del cliente:** dejar el `.mp4` en
`public/video/reel/` con el mismo nombre de clip. Nada más cambia.
