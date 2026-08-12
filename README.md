# ALTESA Smart Monitoring — Sitio-catálogo · v1 de referencia

Versión visual completa para revisión del cliente. Sitio estático, sin build:
HTML + CSS + JavaScript plano.

---

## Cómo verlo

**Opción A — doble clic.** Abrir `public/index.html` en el navegador. Funciona todo.

**Opción B — servidor local** (recomendado, evita cualquier restricción del navegador):

```bash
python -m http.server 5173 --directory public
```

Luego abrir <http://localhost:5173>.

---

## Qué incluye

| Página | Archivo | Qué resuelve |
|---|---|---|
| Portada | `public/index.html` | Posicionamiento, entrada al catálogo, proyectos destacados |
| **Catálogo** | `public/catalogo.html` | 62 productos filtrables por categoría y ambiente, ficha técnica, «Mi selección» |
| Proyectos | `public/proyectos.html` | Los 12 proyectos del dossier con galería y lightbox |
| Servicios | `public/servicios.html` | Proceso de 5 etapas + 6 servicios |
| Profesionales | `public/profesionales.html` | Programa de aliados B2B (decoradoras, arquitectos, inmobiliarias) |
| Contacto | `public/contacto.html` | Datos reales + formulario |

**Función destacada:** en el catálogo, cada producto se puede agregar a **Mi selección**
(ícono `+`). El botón del encabezado abre la lista y genera un mensaje de WhatsApp o
correo con todos los productos elegidos. Pensado para que una decoradora arme la
propuesta de un proyecto completo y la mande en un clic. La selección se guarda en el
navegador.

---

## 📁 Dónde poner las imágenes nuevas

Esta es la parte importante. Las carpetas ya están creadas y vacías, esperando archivos.

### 1. Fotos de producto → `public/img/productos/`

Hoy **30 de los 62 productos** muestran un placeholder de marca con el rótulo
«Foto pendiente». Para reemplazarlo, basta con dejar el archivo con el **nombre
exacto del `id` del producto**. No hay que tocar código: la foto aparece sola.

```
public/img/productos/ilu-spot-mag.jpg      → «Módulo spot magnético orientable»
public/img/productos/seg-nvr.jpg           → «NVR 8/16 canales con PoE»
public/img/productos/cli-termostato.jpg    → «Termostato inteligente de pared»
```

La lista completa de `id` está en `public/assets/js/data-catalogo.js`
(campo `id:` de cada producto).

- **Formato:** JPG
- **Proporción:** vertical **4:5** (así se recortan las tarjetas)
- **Tamaño sugerido:** 1200 × 1500 px
- **Fondo:** neutro y consistente entre productos — es lo que más eleva un catálogo

### 2. Fotos sueltas de la galería que te pasaron → `public/img/galeria/`

Déjalas ahí con cualquier nombre. Yo las reviso, las clasifico por proyecto o
por producto y las conecto donde corresponda.

### 3. Logo oficial → `public/img/brand/`

Hoy el isotipo de la cabecera es una **reconstrucción aproximada en SVG**.
Dejar ahí `altesa-logo.svg` (preferible) o PNG con fondo transparente y lo cambio.

### 4. Fotos de proyectos → `public/img/proyectos/`

Ya están las 47 del dossier. Si hay más de un proyecto existente, dejarlas con el
patrón `nombre-del-proyecto-05.jpg`, `-06.jpg`… y las agrego a la galería.

---

## Estructura

```
altesa website/
├─ README.md
├─ .claude/launch.json            servidor local
└─ public/
   ├─ index.html  catalogo.html  proyectos.html
   ├─ servicios.html  profesionales.html  contacto.html
   ├─ assets/
   │  ├─ css/site.css             sistema de diseño completo
   │  └─ js/
   │     ├─ data-catalogo.js      ← 62 productos y 9 categorías (EDITABLE)
   │     ├─ data-proyectos.js     ← 12 proyectos (EDITABLE)
   │     └─ site.js               comportamiento
   └─ img/
      ├─ proyectos/               47 fotos web (1600 px)
      │  ├─ th/                   miniaturas 720 px
      │  └─ _originales/          extraídas del PDF, sin tocar
      ├─ productos/               ← 📥 AQUÍ LAS FOTOS DE PRODUCTO
      ├─ galeria/                 ← 📥 AQUÍ LAS FOTOS SUELTAS
      ├─ brand/                   ← 📥 AQUÍ EL LOGO OFICIAL
      ├─ placeholder/             placeholders por categoría
      └─ _revisar/                1 imagen del PDF que ya era placeholder
```

Para cambiar textos, precios o productos **no hace falta tocar HTML**: todo el
contenido del catálogo y de los proyectos vive en los dos archivos `data-*.js`.

---

## Qué es real y qué es de muestra

**Real** (viene del dossier 2026 y del sitio Wix actual):

- Las 47 fotografías de obra (crédito: Rodrigo Galo)
- Los 12 proyectos: nombre, tipología, ubicación, descripción y sistemas instalados
- Datos de contacto, dirección, teléfono y correo
- Los servicios: instalación, monitoreo, reacción armada, mantenimiento, asesoría,
  estudios a la medida; app SmartPanics; 26 años de operación

**De muestra, pendiente de sustituir** (marcado con avisos visibles en el sitio):

- Nombres, SKU y especificaciones de los 62 productos del catálogo
- Los tres niveles de paquete (Esencial / Plus / Premium) de la página Profesionales
- Los formularios no envían a ningún buzón todavía

Los avisos están puestos a propósito para que quede claro en la revisión qué falta
confirmar. Se quitan al publicar.

---

## Pendientes para la v2

1. **Listado real de productos** con SKU, especificaciones y fotografía
2. **Logo oficial** en vectorial
3. **Decidir sobre precios**: mostrarlos, mostrarlos solo a aliados con login, o no mostrarlos
4. Conectar formularios a correo o CRM
5. Horario de atención, teléfono de la central 24/7, Instagram y LinkedIn
6. Mapa de Google embebido en Contacto
7. Dominio propio (hoy el sitio vive en `mulin09.wixsite.com`) y analítica
8. Versión en inglés, si aplica para clientes corporativos

---

## Sistema de movimiento (calcado de Habitline)

Se replicó la **estructura y el movimiento** de la plantilla Framer «Habitline»
manteniendo la identidad visual de ALTESA (oscuro + magenta + línea de luz).

**Lo que se trajo:**

| Patrón | Dónde vive |
|---|---|
| Nav de pastillas flotantes (marca · enlaces · acción), se oculta al bajar y vuelve al subir | `.pill`, `.hdr` |
| Anatomía de sección: pastilla eyebrow → titular → contenido | `.tagline` |
| Entrada fade + rise escalonada al entrar en viewport | `[data-mo]`, `[data-mo-group]` |
| Contador de dígitos rodantes | `.counter`, `[data-odo]` |
| Acordeón de preguntas | `.acc`, `[data-solo]` |
| Tarjetas de reseña | `.revs` |
| CTA fotográfico a sangre | `.cta--photo` |
| Parallax ligero de imágenes | `.par`, `data-par` |

**Valores de movimiento** (medidos sobre el sitio real, en `:root`):

```css
--mo-ease: cubic-bezier(.44,0,.56,1);   /* extraído del propio Habitline */
--mo-dur:  .78s;
--mo-rise: 28px;
--mo-stag: 85ms;                        /* retardo entre hermanos */
```

**Cómo animar algo nuevo:** poner `data-mo-group=""` en el contenedor y sus hijos
directos se escalonan solos. Para un elemento suelto, `data-mo`. Variantes:
`data-mo="blur"`, `"scale"`, `"left"`, `"right"`, `"mask"`.

### Control de movimiento

Por defecto el sitio respeta «reducir movimiento» del sistema operativo. Hay un
interruptor en el pie que permite anular esa preferencia en cualquier sentido, y
la elección queda guardada en el navegador.

- `?motion=on` en la URL fuerza las animaciones y lo deja guardado
- `?motion=off` las reduce
- Sin parámetro y sin elección previa: manda el sistema operativo

Se implementa con las clases `.motion-on` / `.motion-off` en `<html>`. La media
query `prefers-reduced-motion` sigue declarada para cubrir el caso sin
JavaScript, gateada por `:root:not(.motion-on)`.

---

## Notas técnicas

- Sin dependencias ni build. Se publica subiendo la carpeta `public/` a cualquier
  hosting estático (Netlify, Vercel, Cloudflare Pages, o el hosting actual).
- Tipografías: Familjen Grotesk, Instrument Sans y Azeret Mono (Google Fonts).
- Responsive de 360 px en adelante; respeta `prefers-reduced-motion`.
- Las imágenes se sirven en dos tamaños (1600 px y 720 px) para que el catálogo
  cargue liviano; los originales de impresión quedan intactos en `_originales/`.
