# ALTESA Smart Monitoring — sitio-catálogo

Sitio estático de 6 páginas que funciona como **catálogo visual B2B** para
decoradoras, arquitectos e inmobiliarias. El cliente es ALTESA (Grupo López &
Pinaud, San Salvador): 26 años en monitoreo de alarmas, hoy también integradores
de domótica sobre el ecosistema ORVIBO.

- Repo: <https://github.com/dann1103-eng/altesa_website> · rama `main`
- Despliegue: Vercel conectado al repo; cada push a `main` redespliega
- Sitio anterior (solo referencia de contenido): <https://mulin09.wixsite.com/mysite>

## Ejecutar

```bash
python -m http.server 5173 --directory public
```

Sin build, sin dependencias, sin `node_modules`. Se publica subiendo `public/`.
`vercel.json` ya declara `outputDirectory: "public"`.

## Estructura

```
public/
  index · catalogo · proyectos · servicios · profesionales · contacto  (.html)
  reel.html                    vitrina vertical: el catálogo en video, por secciones
  assets/css/site.css          sistema de diseño completo
  assets/css/reel.css          solo la carga reel.html
  assets/js/data-catalogo.js   ← 91 productos en 11 categorías (se genera: ver tools/)
  assets/js/data-proyectos.js  ← 12 proyectos (EDITABLE, a mano)
  assets/js/data-reel.js       ← guion de cada sección de la vitrina (EDITABLE, a mano)
  assets/js/site.js            todo el comportamiento
  assets/js/reel.js            solo el feed vertical
  img/{proyectos,productos,galeria,hero,reel,brand,placeholder}/
  video/reel/                  13 clips 9:16, uno por sección — ver tools/README.md
tools/                         scripts de mantenimiento — ver tools/README.md
```

El encabezado y el pie los **inyecta `site.js`**, no están en el HTML. Para
cambiar la navegación o el contacto, editar `NAV` y `CO` al inicio de `site.js`.

## Reglas que hay que respetar

### Textos: nunca la antítesis «no es X, es Y»

Prohibido el recurso `no es X, es Y` y sus variantes (`X, no Y`, `no vendemos A,
hacemos B`). Daniel lo señaló como la marca más delatora de texto generado por
IA. Yo lo había usado 11 veces en una sola pasada. Afirmar en positivo y con un
detalle concreto y verificable.

Antes de entregar copy, revisar buscando `, no ` y `no es`.

### Versionar los assets tras cada cambio de CSS o JS

```bash
python tools/bump.py 20260819-2
```

Sin esto el navegador sirve la copia cacheada y parece que nada cambió.

### El catálogo se genera, no se edita a mano

`data-catalogo.js` sale de `tools/` a partir del PDF oficial. Si hay catálogo
nuevo, correr la tubería completa (ver `tools/README.md`) en vez de parchear el
archivo. `data-proyectos.js` sí se edita a mano.

Lo que ALTESA decide sobre ese PDF —qué productos se retiran, en qué categoría
va cada uno, qué fichas se muestran como variante de otra, y la lista misma de
categorías— vive en `tools/cat_ajustes.py`. Cada ronda de comentarios del
cliente sobre el catálogo se resuelve ahí y se vuelve a correr la tubería. La
tubería se detiene si un ajuste ya no encuentra su producto.

Las cifras visibles («Explorar los 91 productos», «91 artículos con 193
códigos») se rellenan desde los datos con `data-cifra`; el número escrito en el
HTML es solo el respaldo sin JavaScript. Las que están en palabras («Once
sistemas») y las `meta description` hay que cambiarlas a mano.

## La vitrina vertical (`/reel.html`)

El catálogo en formato tipo TikTok: **una pantalla por sección** (Centrales,
Tiras LED, Cortinas, Cámaras…), en el mismo orden que `catalogo.html`, más una
portada y un cierre. El botón «Catálogo» de cada pantalla abre ahí mismo los
productos de esa sección; tocar uno abre su ficha encima.

Las secciones **no se enumeran en `data-reel.js`**: salen de `ALTESA_CAT.categorias`.
Una categoría nueva en `tools/cat_ajustes.py` aparece sola en la vitrina, con su
foto de portada en lugar de clip. `data-reel.js` solo pone el guion de cada una
(titular, frase, datos, clip y proyecto del ambiente). El crédito de ambiente se
lee de `data-proyectos.js` para que nombre y lugar sean los reales.

- Entradas desde el sitio: «Ver en video» junto a «Explorar los productos» en la
  portada, y «Ver el catálogo en video» en la cabecera del catálogo, que apunta a
  la sección elegida (`reel.html#tiras`) — lo actualiza `CATALOGO.sync()`.
- URLs: `/reel.html`, y `/reel` y `/vitrina` por los *rewrites* de `vercel.json`.
  `#<categoría>` abre esa sección; los enlaces viejos a un producto
  (`#cerradura-v5-face`) caen en la sección de ese producto.
- Lleva `noindex`: los clips todavía son de muestra.
- Siguen los dos atajos de demostración: dejar pulsado el isotipo ~0.8 s, o
  teclear `reel` (`puertaVitrina()`, en `site.js`).

**Cómo se integra con lo que ya existía.** `reel.html` marca el `<body>` con
`data-nochrome` y por eso `mountChrome()` se salta el encabezado y el pie; el
feed trae los suyos a pantalla completa. Carga `site.js` igual que las demás
páginas, así que «Mi selección» es literalmente el mismo objeto `SEL`: mismo
`localStorage`, mismo cajón lateral y mismo mensaje de WhatsApp. `reel.js`
envuelve `SEL.save` para enterarse de los cambios que ocurren dentro del cajón.

Guardar se hace producto a producto, con el `+` del catálogo de cada sección.
Esos botones llevan `data-add` a propósito: `SEL.syncButtons()` les pinta el `+`
o el ✓ igual que en la rejilla del catálogo.

**Una sola salida.** Dentro de la vitrina nada navega a otra página salvo el
botón «Ir al sitio» de la cabecera (arriba a la derecha). El catálogo de la
sección es un cajón propio (`ALTESA.Drawer`), la ficha usa el del catálogo
(`ALTESA.CATALOGO.detail`, que lo crea si la página no tiene rejilla) y la
selección vacía ofrece «Seguir viendo» en lugar de «Ir al catálogo»
(`SEL.enVitrina`). Los enlaces a WhatsApp y correo sí se mantienen: abren otra
app y la vitrina queda donde estaba.

Los cajones se **apilan** (catálogo de la sección → ficha encima). Cada uno
anuncia `cajon:abierto` y `cajon:cerrado`; la vitrina lleva la pila y mete una
entrada en el historial por cajón, así el «atrás» del teléfono cierra solo el de
arriba. Cerrar con la X devuelve su entrada con un `history.back()` propio que el
manejador de `popstate` ignora. El clip queda en pausa mientras haya un cajón.

**Video.** No hay material de producto todavía. Los 13 clips (uno por sección,
más portada y cierre) los arma `tools/reel_media.py` reencuadrando fotografía de
un proyecto que tiene ese sistema instalado, y la pantalla acredita ese proyecto
(«Ambiente · Cerro Mar · Surf City»). Hay un aviso permanente al pie. El clip de
cada sección se llama como la categoría (`cortinas.mp4`), así que el video real
del cliente entra con solo reemplazar el archivo. Solo se descarga el clip de la
pantalla activa y sus dos vecinas.

## Sistema de diseño

Estructura, ritmo de secciones y movimiento están calcados de la plantilla Framer
«Habitline», que Daniel eligió como referencia, con la identidad ALTESA encima
(magenta `--plum: #A62A79`, base clara y cálida).

- Tipografía: Familjen Grotesk (display) + Instrument Sans (interfaz) + Azeret
  Mono, **reservada a SKU y tablas de specs**. La mono en mayúsculas con tracking
  amplio se leía mal en chips y etiquetas; la interfaz usa una sola familia.
- Geometría redondeada (radio 16–32 px) y sombras suaves en lugar de filetes.
- Motivo propio: la línea de luz (`.lightline`, `.rail`) — es su propio producto.

### Movimiento

Tokens en `:root`: `--mo-ease: cubic-bezier(.44,0,.56,1)` (extraído del sitio de
referencia), `--mo-dur: .95s`, `--mo-rise: 44px`, `--mo-stag: 115ms`.

- `data-mo-group=""` en un contenedor escalona a sus hijos directos.
- `data-mo` anima un elemento suelto. Variantes: `blur`, `scale`, `left`,
  `right`, `mask`.
- **No poner `data-mo` en componentes interactivos**: el coverflow arrancaba
  invisible y dependía del observer para aparecer. Hay una red de seguridad en
  `motion()` que revela a los 1.2 s lo que quedó oculto dentro del viewport.

Se respeta `prefers-reduced-motion`, pero hay un interruptor en el pie que lo
anula (`?motion=on` / `?motion=off`, guardado en localStorage). Daniel tenía
«reducir movimiento» activado en Windows y por eso no veía ninguna animación.

## Trampas de verificación conocidas

Estas me costaron tiempo; conviene tenerlas presentes antes de diagnosticar un
bug que no existe:

1. **El panel del navegador de la app no compone frames.** `visibilityState` es
   `hidden`, así que las transiciones CSS quedan congeladas a mitad y el
   `IntersectionObserver` nunca dispara. Medir con las transiciones desactivadas,
   o verificar con Chrome headless.
2. **`--virtual-time-budget` de Chrome headless adelanta el tiempo**: sirve para
   capturar el estado final, nunca para comprobar si una animación corre.
3. **`min-height: 100svh` se estira** en capturas de página completa con ventana
   alta. Para fotografiar esas secciones, capturar con altura de viewport real.
4. **El heredoc de Git Bash colapsa las barras invertidas.** Para scripts Python
   con rutas de Windows, escribir el archivo con la herramienta Write.
5. **Chrome headless en Windows no baja de 500 px de ancho.** Con
   `--window-size=390,844` el `innerWidth` real es 500 y la captura sale
   reescalada: se ve texto desbordado que en el teléfono no existe. Para revisar
   anchos de móvil de verdad, cargar la página dentro de un `<iframe>` del ancho
   deseado en una ventana grande — el iframe sí evalúa las media queries a su
   propio ancho.
6. **`[hidden]` no oculta nada si la regla trae `display:flex` o `grid`.** Pasó
   con `.reel__cart` y `.reel__hint`. Hace falta el par explícito
   `.clase[hidden]{display:none}`.
7. **Las imágenes con `loading="lazy"` salen en blanco en capturas headless**
   aunque en el navegador carguen bien. Antes de diagnosticar una foto rota,
   comprobar `naturalWidth` cargándola con `new Image()`.

## Estado y pendientes

**Real y verificado:** 91 productos con 193 códigos del catálogo oficial 2026, con la
ronda 1 de ajustes de ALTESA (29 sep 2026) ·
12 proyectos del dossier · 65 fotografías propias · datos de contacto.

**Todavía de muestra, marcado con avisos visibles en el sitio:**

- Los tres **testimonios de la portada son inventados**. Es lo único que podría
  leerse como real si alguien se salta el aviso. Reemplazar por citas con
  autorización, o quitar la sección.
- Los tres niveles de paquete de la página Profesionales son una propuesta de
  estructura, no política comercial confirmada.
- Los formularios no envían a ningún buzón.
- Los **13 clips de la vitrina** son fotografía de proyectos reencuadrada a 9:16
  con movimiento lento. Sirven para enseñar el formato; el video de producto
  está pendiente de producción.

**Faltantes de material:**

- Logo oficial en vectorial → `public/img/brand/`. El isotipo actual es una
  reconstrucción aproximada en SVG que hice yo.
- Fotos **horizontales 16:9**. Las 18 que hay son verticales 4:5: sirven para
  panel lateral y ficha de producto, no para fondo a sangre.
- Fachada u oficina para Contacto; planos sobre mesa para la portada.
- «Puerta del Alma» llegó como foto suelta y se usa en el encabezado de
  Servicios. Si es un proyecto instalado, falta tipología, ubicación, año y
  sistemas para agregarlo como proyecto 13.
