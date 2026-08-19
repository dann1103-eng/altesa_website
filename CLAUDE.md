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
  assets/css/site.css          sistema de diseño completo
  assets/js/data-catalogo.js   ← 101 productos (EDITABLE, generado)
  assets/js/data-proyectos.js  ← 12 proyectos (EDITABLE, a mano)
  assets/js/site.js            todo el comportamiento
  img/{proyectos,productos,galeria,hero,brand,placeholder}/
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

## Estado y pendientes

**Real y verificado:** 101 productos con 204 códigos del catálogo oficial 2026 ·
12 proyectos del dossier · 65 fotografías propias · datos de contacto.

**Todavía de muestra, marcado con avisos visibles en el sitio:**

- Los tres **testimonios de la portada son inventados**. Es lo único que podría
  leerse como real si alguien se salta el aviso. Reemplazar por citas con
  autorización, o quitar la sección.
- Los tres niveles de paquete de la página Profesionales son una propuesta de
  estructura, no política comercial confirmada.
- Los formularios no envían a ningún buzón.

**Faltantes de material:**

- Logo oficial en vectorial → `public/img/brand/`. El isotipo actual es una
  reconstrucción aproximada en SVG que hice yo.
- Fotos **horizontales 16:9**. Las 18 que hay son verticales 4:5: sirven para
  panel lateral y ficha de producto, no para fondo a sangre.
- Fachada u oficina para Contacto; planos sobre mesa para la portada.
- «Puerta del Alma» llegó como foto suelta y se usa en el encabezado de
  Servicios. Si es un proyecto instalado, falta tipología, ubicación, año y
  sistemas para agregarlo como proyecto 13.
