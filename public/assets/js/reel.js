/* =========================================================================
   ALTESA — Vitrina vertical (/reel.html)
   ---------------------------------------------------------------------------
   El catálogo en video vertical: una pantalla por sección (Centrales, Tiras
   LED, Cortinas, Cámaras…), en el mismo orden que catalogo.html. El botón
   «Catálogo» de cada pantalla abre aquí dentro los productos de esa sección,
   y de ahí la ficha de cada uno. Lo que se guarda es la misma «Mi selección»
   del resto del sitio y viaja en el mismo mensaje de WhatsApp.

   Las secciones salen de data-catalogo.js: una categoría nueva aparece sola,
   con su foto de portada. data-reel.js solo pone el guion de cada una.

   Nada navega fuera de la vitrina salvo «Ir al sitio». Los cajones (catálogo
   de la sección, ficha, selección) se apilan, y el «atrás» del teléfono cierra
   el de arriba en lugar de salir.

   Carga de video: solo se le pone `src` a la pantalla activa y a sus dos
   vecinas; las demás quedan en póster.
   ========================================================================= */
(function () {
  "use strict";

  var R = window.ALTESA_REEL, C = window.ALTESA_CAT, A = window.ALTESA;
  var feed = document.getElementById("feed");
  if (!R || !C || !A || !feed) return;

  var SEL = A.SEL, CO = A.CO;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); };

  var ARW = '<svg class="arw" width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 5h12M8.5 1.2 12.8 5 8.5 8.8" stroke="currentColor" stroke-width="1.3"/></svg>';
  var IC = {
    cat:   '<svg width="25" height="25" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.2" stroke="currentColor" stroke-width="1.15"/><rect x="9" y="2" width="5" height="5" rx="1.2" stroke="currentColor" stroke-width="1.15"/><rect x="2" y="9" width="5" height="5" rx="1.2" stroke="currentColor" stroke-width="1.15"/><rect x="9" y="9" width="5" height="5" rx="1.2" stroke="currentColor" stroke-width="1.15"/></svg>',
    share: '<svg width="25" height="25" viewBox="0 0 16 16" fill="none"><path d="M8 10.6V1.9M5 4.7L8 1.7l3 3" stroke="currentColor" stroke-width="1.2"/><path d="M3.4 7.6v5.9c0 .5.4.9.9.9h7.4c.5 0 .9-.4.9-.9V7.6" stroke="currentColor" stroke-width="1.2"/></svg>',
    wa:    '<svg width="25" height="25" viewBox="0 0 16 16" fill="none"><path d="M8 1.9a6 6 0 00-5.2 9L2 14.4l3.6-.8A6 6 0 108 1.9z" stroke="currentColor" stroke-width="1.15"/><path d="M6.1 5.4c.2-.1.5 0 .6.2l.5 1c.1.2 0 .4-.1.5l-.4.4c.4.8.9 1.3 1.7 1.7l.4-.4c.1-.1.3-.2.5-.1l1 .5c.2.1.3.4.2.6-.3.6-1 .9-1.6.7-1.7-.5-2.9-1.7-3.4-3.4-.2-.6.1-1.3.6-1.7z" fill="currentColor"/></svg>',
    play:  '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6L19 12z"/></svg>'
  };

  /* ---- Datos ---------------------------------------------------------------- */
  var catPorId = {};
  C.categorias.forEach(function (c) { catPorId[c.id] = c; });

  function prodsDe(cid) {
    return C.productos.filter(function (p) { return p.cat === cid; });
  }
  function proyDe(id) {
    return (window.ALTESA_PROY || []).filter(function (p) { return p.id === id; })[0];
  }
  function miniatura(p) { return "img/productos/th/" + (p.img || p.id + ".jpg"); }
  function fotoProd(p)  { return "img/productos/" + (p.img || p.id + ".jpg"); }
  function cuantos(n)   { return n + (n === 1 ? " producto" : " productos"); }

  // «SMART SHADING Apertura silenciosa…» → serie en mayúsculas + frase
  function partir(desc) {
    var m = /^([A-ZÁÉÍÓÚÑÜ0-9][A-ZÁÉÍÓÚÑÜ0-9 ·\/.\-]*?)\s+(?=[A-ZÁÉÍÓÚÑ][a-záéíóúñü])/.exec(desc || "");
    return m ? { serie: m[1], texto: desc.slice(m[0].length) } : { serie: "", texto: desc || "" };
  }
  // El crédito del ambiente se lee del proyecto: nombre y lugar reales
  function credito(amb) {
    if (!amb) return "";
    var p = amb.proy ? proyDe(amb.proy) : null;
    return p ? p.nombre + " · " + p.lugar : (amb.cred || "");
  }
  function waSeccion(c) {
    return "https://wa.me/" + CO.wa + "?text=" + encodeURIComponent(
      "Hola ALTESA, vi la sección de " + c.n + " en la vitrina del sitio y quisiera más información.");
  }

  var PALABRAS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
                  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete",
                  "dieciocho", "diecinueve", "veinte"];
  function conCifras(t) {
    var n = C.categorias.length, w = PALABRAS[n] || String(n);
    return String(t || "").split("{N}").join(w.charAt(0).toUpperCase() + w.slice(1)).split("{n}").join(w);
  }

  /* ---- Guion: portada, una pantalla por sección y cierre ---------------------- */
  var guion = R.secciones || {};
  var slides = [{ tipo: "intro", clip: R.intro.clip, gancho: conCifras(R.intro.gancho), linea: conCifras(R.intro.linea) }]
    .concat(C.categorias.map(function (c) {
      var g = guion[c.id] || {};
      return {
        tipo: "seccion", cat: c, clip: g.clip,
        gancho: g.gancho || esc(c.n),
        linea: g.linea || partir(c.desc).texto,
        chips: g.chips || [],
        ambiente: g.ambiente
      };
    }))
    .concat([{ tipo: "cierre", clip: R.cierre.clip, gancho: R.cierre.gancho, linea: R.cierre.linea }]);

  slides.forEach(function (s) {
    // Sin clip, la pantalla usa la foto de portada de la categoría
    s.poster = s.clip ? "img/reel/" + s.clip + ".jpg" : (s.cat ? "img/" + s.cat.img : "");
  });

  /* ---- Armado de una pantalla ------------------------------------------------ */
  function accion(clase, icono, texto, attrs) {
    return '<button class="ract ' + clase + '" type="button" ' + (attrs || "") + ">" +
           icono + "<span>" + texto + "</span></button>";
  }

  function cartaHTML(s) {
    var intro = s.tipo === "intro";
    return '<p class="rs__num">' + (intro
              ? "Vitrina ALTESA · " + C.categorias.length + " secciones"
              : "Fin del recorrido") + "</p>" +
      '<h2 class="rs__gancho">' + s.gancho + "</h2>" +
      '<p class="rs__linea">' + esc(s.linea) + "</p>" +
      '<div class="rs__acts">' + (intro
        ? '<button class="btn" type="button" data-next><span>Empezar</span>' + ARW + "</button>"
        : '<a class="btn" id="cierreWa" href="#" target="_blank" rel="noopener"><span>Cotizar por WhatsApp</span>' + ARW + "</a>" +
          '<button class="btn btn--ghost" type="button" data-inicio><span>Volver al inicio</span></button>') +
      "</div>";
  }

  function seccionHTML(s) {
    var c = s.cat, prods = prodsDe(c.id), amb = credito(s.ambiente);
    return '<p class="rs__cat">' + esc(c.num + " · " + c.n) + "</p>" +
      '<h2 class="rs__gancho">' + s.gancho + "</h2>" +
      '<p class="rs__linea">' + esc(s.linea) + "</p>" +
      (s.chips.length ? '<div class="rs__chips">' + s.chips.map(function (x) {
        return "<span>" + esc(x) + "</span>"; }).join("") + "</div>" : "") +
      '<button class="rs__prod" type="button" data-catalogo="' + esc(c.id) + '">' +
        '<span class="rs__pila">' + prods.slice(0, 3).map(function (p) {
          return '<img src="' + esc(miniatura(p)) + '" alt="" loading="lazy" decoding="async" data-fb="' +
                 esc(fotoProd(p)) + '">'; }).join("") + "</span>" +
        '<span class="rs__prod__txt"><b>Ver el catálogo</b><small>' + cuantos(prods.length) + "</small></span>" +
      "</button>" +
      (amb ? '<span class="rs__amb">Ambiente · <b>' + esc(amb) + "</b></span>" : "");
  }

  function carrilHTML(c) {
    return '<div class="rs__rail">' +
      accion("ract--cat", IC.cat, "Catálogo", 'data-catalogo="' + esc(c.id) + '"') +
      accion("ract--share", IC.share, "Enviar", 'data-share="' + esc(c.id) + '"') +
      '<a class="ract ract--wa" href="' + waSeccion(c) + '" target="_blank" rel="noopener">' +
        IC.wa + "<span>WhatsApp</span></a>" +
    "</div>";
  }

  function slideHTML(s, i) {
    var seccion = s.tipo === "seccion";
    var ancla = seccion ? s.cat.id : (s.tipo === "cierre" ? "final" : "");
    return '<section class="rs' + (seccion ? "" : " rs--card") + '" data-i="' + i + '"' +
             (ancla ? ' id="' + esc(ancla) + '"' : "") + ">" +
      '<div class="rs__in">' +
        '<div class="rs__media" data-media>' +
          '<img src="' + esc(s.poster) + '" alt="" ' + (i < 2 ? 'fetchpriority="high"' : 'loading="lazy"') +
            ' decoding="async"' + (seccion ? ' data-fb="img/' + esc(s.cat.img) + '"' : "") + ">" +
          (s.clip ? '<video data-src="video/reel/' + esc(s.clip) + '.mp4" muted loop playsinline ' +
                    'preload="none" aria-hidden="true" tabindex="-1"></video>' : "") +
          '<div class="rs__scrim"></div>' +
          '<div class="rs__bar"><i></i></div>' +
          '<div class="rs__pause"><span>' + IC.play + "</span></div>" +
          (seccion ? carrilHTML(s.cat) : "") +
        "</div>" +
        '<div class="rs__info">' + (seccion ? seccionHTML(s) : cartaHTML(s)) + "</div>" +
      "</div></section>";
  }

  /* ---- Montaje ----------------------------------------------------------------- */
  feed.innerHTML = slides.map(slideHTML).join("");

  var secs   = $$(".rs", feed);
  var vids   = secs.map(function (s) { return $("video", s); });
  var bgs    = $$("#reelBg i");
  var pager  = document.getElementById("pager");
  var ticks  = document.getElementById("ticks");
  var cart   = document.getElementById("reelCart");
  var hint   = document.getElementById("hint");
  var actual = -1, bgTurno = 0;
  var pila   = [];                       // cajones abiertos, el último encima

  document.getElementById("reelAviso").textContent = R.aviso;
  ticks.innerHTML = secs.map(function () { return "<i></i>"; }).join("");
  var tickEls = $$("i", ticks);

  /* ---- Video: solo la activa y sus vecinas ----------------------------------- */
  var autoOK = !document.documentElement.classList.contains("motion-off");

  function cargar(i) {
    var v = vids[i];
    if (v && !v.src && v.dataset.src) { v.src = v.dataset.src; v.load(); }
  }
  function soltar(i) {
    var v = vids[i];
    if (!v || !v.src) return;
    v.pause(); v.removeAttribute("src"); v.load();
    v.classList.remove("is-on");
    $("i", $(".rs__bar", secs[i])).style.width = "0";
  }
  function reproducir(i) {
    var v = vids[i]; if (!v) return;
    cargar(i);
    var pr = v.play();
    if (pr && pr.catch) pr.catch(function () { /* el navegador lo bloqueó */ });
    secs[i].classList.remove("is-paused");
  }

  vids.forEach(function (v, i) {
    if (!v) return;
    // El clip aparece sobre el póster cuando de verdad corre: sin fundido a
    // negro mientras carga, y si el archivo falta queda la foto.
    v.addEventListener("playing", function () { v.classList.add("is-on"); });
    // `timeupdate` dispara ~4 veces por segundo: basta para la barra, sin un
    // bucle de animación permanente gastando batería.
    v.addEventListener("timeupdate", function () {
      if (!v.duration) return;
      $("i", $(".rs__bar", secs[i])).style.width = (v.currentTime / v.duration * 100).toFixed(2) + "%";
    });
  });

  function activar(i) {
    if (i === actual) return;
    actual = i;

    for (var k = 0; k < vids.length; k++) {
      if (Math.abs(k - i) <= 1) cargar(k); else soltar(k);
      if (k !== i && vids[k]) vids[k].pause();
      secs[k].classList.remove("is-paused");
    }
    if (autoOK && !pila.length) reproducir(i);

    // Fondo ambiental: alterna las dos capas para que el cambio disuelva
    var capa = bgs[bgTurno % 2], otra = bgs[(bgTurno + 1) % 2];
    capa.style.backgroundImage = 'url("' + slides[i].poster + '")';
    capa.classList.add("is-on"); otra.classList.remove("is-on");
    bgTurno++;

    tickEls.forEach(function (t, k) { t.classList.toggle("is-on", k === i); });
    if (i > 0 && hint && !hint.hidden) hint.hidden = true;

    var s = slides[i];
    var h = s.tipo === "seccion" ? s.cat.id : (s.tipo === "cierre" ? "final" : "");
    try { history.replaceState(history.state, "", h ? "#" + h : location.pathname + location.search); } catch (e) {}
  }

  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio > 0.6) activar(+e.target.dataset.i);
    });
  }, { root: feed, threshold: [0.61] });
  secs.forEach(function (s) { io.observe(s); });

  /* ---- Navegación -------------------------------------------------------------- */
  function ir(d) {
    var i = Math.max(0, Math.min(secs.length - 1, actual + d));
    secs[i].scrollIntoView({ behavior: "smooth", block: "center" });
  }
  $$("[data-go]", pager).forEach(function (b) {
    b.addEventListener("click", function () { ir(+b.getAttribute("data-go")); });
  });
  var sig = $("[data-next]", feed);
  if (sig) sig.addEventListener("click", function () { ir(1); });
  var inicio = $("[data-inicio]", feed);
  if (inicio) inicio.addEventListener("click", function () {
    secs[0].scrollIntoView({ behavior: "smooth", block: "center" });
  });

  function alternarPausa() {
    var v = vids[actual]; if (!v || !v.src) return;
    if (v.paused) reproducir(actual); else v.pause();
    secs[actual].classList.toggle("is-paused", v.paused);
  }

  // Un toque sobre el clip lo pausa. Los botones del carril viven dentro del
  // clip, así que se excluyen: tocar «Catálogo» no debe pausar nada.
  secs.forEach(function (sec, i) {
    $("[data-media]", sec).addEventListener("click", function (e) {
      if (e.target.closest(".rs__rail")) return;
      if (i === actual) alternarPausa();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (pila.length) return;                              // el cajón manda
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); ir(1); }
    if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); ir(-1); }
    if (e.key === " ") { e.preventDefault(); alternarPausa(); }
    if (e.key === "Enter" && (document.activeElement === document.body || document.activeElement === feed)) {
      var s = slides[actual];
      if (s && s.tipo === "seccion") { e.preventDefault(); abrirCatalogo(s.cat.id); }
    }
  });

  /* ---- Catálogo de la sección, aquí dentro ----------------------------------- */
  var panel = null;

  function abrirCatalogo(cid) {
    var c = catPorId[cid]; if (!c) return;
    var prods = prodsDe(cid), d = partir(c.desc);
    if (!panel) panel = A.Drawer("catDrawer", "Catálogo");

    panel.head.textContent = "Catálogo · " + c.corta;
    panel.body.innerHTML =
      '<div class="cp">' +
        (d.serie ? '<p class="cp__serie">' + esc(d.serie) + "</p>" : "") +
        '<h3 class="cp__n">' + esc(c.n) + "</h3>" +
        '<p class="cp__desc">' + esc(d.texto) + "</p>" +
        '<p class="cp__cuenta">' + cuantos(prods.length) + "</p>" +
        '<ul class="cp__lista">' + prods.map(function (p) {
          var nv = (p.variantes || []).length;
          var ref = [p.sku, nv > 1 ? nv + " variantes" : ""].filter(Boolean).join(" · ");
          return '<li class="cp__item">' +
            '<button class="cp__abrir" type="button" data-ficha="' + esc(p.id) + '">' +
              '<img src="' + esc(miniatura(p)) + '" alt="" loading="lazy" decoding="async" data-fb="' + esc(fotoProd(p)) + '">' +
              '<span class="cp__txt"><b>' + esc(p.n) + "</b><small>" + esc(p.tag) + "</small>" +
                (ref ? "<em>" + esc(ref) + "</em>" : "") + "</span>" +
            "</button>" +
            '<button class="pcard__add cp__add" type="button" data-add="' + esc(p.id) + '"></button>' +
          "</li>";
        }).join("") + "</ul>" +
      "</div>";
    panel.foot.innerHTML =
      '<a class="btn btn--ghost" href="' + waSeccion(c) + '" target="_blank" rel="noopener">' +
        "<span>Consultar esta sección por WhatsApp</span>" + ARW + "</a>";

    $$("[data-ficha]", panel.body).forEach(function (b) {
      b.addEventListener("click", function () { A.CATALOGO.detail(b.getAttribute("data-ficha")); });
    });
    $$("[data-add]", panel.body).forEach(function (b) {
      b.addEventListener("click", function () { SEL.toggle(b.getAttribute("data-add")); });
    });
    SEL.syncButtons();                                    // + o ✓ según la selección
    panel.open();
  }

  $$("[data-catalogo]", feed).forEach(function (b) {
    b.addEventListener("click", function () { abrirCatalogo(b.getAttribute("data-catalogo")); });
  });

  /* ---- Cajones: el «atrás» del teléfono cierra el de arriba --------------------
     Cada cajón que se abre (catálogo de la sección, ficha encima, selección)
     agrega una entrada al historial. El «atrás» consume una y cierra solo el
     cajón de arriba; cerrar con la X o tocando fuera devuelve la entrada. El
     clip queda en pausa mientras haya algún cajón abierto. */
  var cierrePorAtras = false, atrasPropio = false;
  document.addEventListener("cajon:abierto", function (e) {
    pila.push(e.target);
    try { history.pushState({ cajon: pila.length }, "", location.href); } catch (err) {}
    if (vids[actual]) vids[actual].pause();
  });
  document.addEventListener("cajon:cerrado", function (e) {
    var k = pila.indexOf(e.target);
    if (k > -1) pila.splice(k, 1);
    if (cierrePorAtras) cierrePorAtras = false;          // el «atrás» ya consumió su entrada
    else if (history.state && history.state.cajon) { atrasPropio = true; history.back(); }
    if (!pila.length && autoOK) reproducir(actual);
  });
  window.addEventListener("popstate", function () {
    if (atrasPropio) { atrasPropio = false; return; }    // lo pidió el cierre de arriba
    var arriba = pila[pila.length - 1];
    if (arriba) { cierrePorAtras = true; $(".drawer__x", arriba).click(); }
  });

  /* ---- Selección: la misma del resto del sitio --------------------------------- */
  SEL.enVitrina = true;          // la selección vacía ofrece «Seguir viendo»

  function enlaceWa() {
    var items = SEL.prods();
    var lineas = items.map(function (p, i) { return (i + 1) + ". " + p.n + " (" + p.sku + ")"; }).join("\n");
    return "https://wa.me/" + CO.wa + "?text=" + encodeURIComponent(
      "Hola ALTESA, me interesa cotizar los siguientes productos:\n\n" + lineas +
      "\n\nQuedo atento(a) a su respuesta.");
  }

  function sincronizar() {
    var n = SEL.ids.length;
    document.getElementById("selOpen").classList.toggle("is-on", n > 0);
    document.getElementById("reel").classList.toggle("has-cart", n > 0);
    cart.hidden = n === 0;
    if (n) {
      document.getElementById("cartN").textContent = n;
      document.getElementById("cartWa").href = enlaceWa();
    }
    var cw = document.getElementById("cierreWa");
    if (cw) cw.href = n ? enlaceWa() : "https://wa.me/" + CO.wa + "?text=" +
      encodeURIComponent("Hola ALTESA, vi la vitrina del sitio y quiero información del catálogo 2026.");
  }

  // SEL.save() corre en cada cambio: desde el catálogo de la sección, la ficha
  // o el cajón de la selección
  var guardarOriginal = SEL.save;
  SEL.save = function () { guardarOriginal.apply(SEL, arguments); sincronizar(); };

  document.getElementById("cartOpen").addEventListener("click", function () {
    document.getElementById("selOpen").click();
  });

  /* ---- Enviar una sección ----------------------------------------------------- */
  $$("[data-share]", feed).forEach(function (b) {
    b.addEventListener("click", function () {
      var c = catPorId[b.getAttribute("data-share")];
      var url = location.origin + location.pathname + "#" + c.id;
      var datos = { title: "ALTESA · " + c.n, text: c.n + " en la vitrina de ALTESA", url: url };
      if (navigator.share) { navigator.share(datos).catch(function () {}); return; }
      var ok = function () {
        var s = $("span", b), antes = s.textContent;
        s.textContent = "Copiado";
        setTimeout(function () { s.textContent = antes; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, function () {});
      else ok();
    });
  });

  /* ---- Movimiento reducido: ofrecer el video en lugar de esconderlo ---------- */
  if (!autoOK) {
    var aviso = document.createElement("div");
    aviso.className = "reel__cart";
    aviso.style.bottom = "calc(env(safe-area-inset-bottom) + 4.2rem)";
    aviso.innerHTML = '<button type="button" style="pointer-events:none">' + IC.play +
      '<span style="margin-left:.1rem">Su equipo pide menos movimiento</span></button>' +
      '<a href="?motion=on">Reproducir los clips</a>';
    document.getElementById("reel").appendChild(aviso);
  }

  /* ---- Arranque ----------------------------------------------------------------- */
  sincronizar();

  // #cortinas abre esa sección. Los enlaces que ya se compartieron apuntaban a
  // un producto (#cerradura-v5-face): se llevan a la sección de ese producto.
  var destino = decodeURIComponent(location.hash.replace("#", ""));
  var prod = C.productos.filter(function (p) { return p.id === destino; })[0];
  if (prod) destino = prod.cat;
  var idx = destino ? secs.map(function (s) { return s.id; }).indexOf(destino) : -1;
  if (idx > 0) {
    secs[idx].scrollIntoView({ block: "center" });
    activar(idx);
  } else {
    activar(0);
    if (hint) {
      hint.hidden = false;
      setTimeout(function () { hint.hidden = true; }, 6000);
    }
  }

  // La pista de gesto se retira al primer desplazamiento
  feed.addEventListener("scroll", function () {
    if (hint && !hint.hidden && feed.scrollTop > 40) hint.hidden = true;
  }, { passive: true });

  // Al volver de otra pestaña, retomar el clip activo si no hay cajón encima
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && autoOK && !pila.length) reproducir(actual);
    else if (vids[actual]) vids[actual].pause();
  });

})();
