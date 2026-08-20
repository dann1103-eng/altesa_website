/* =========================================================================
   ALTESA — Vitrina vertical (/reel.html)
   ---------------------------------------------------------------------------
   Feed de desplazamiento vertical con un producto destacado por pantalla.
   Reutiliza «Mi selección» de site.js: lo que se guarda aquí aparece en el
   resto del sitio y viaja en el mismo mensaje de WhatsApp.

   Carga de video: solo se le pone `src` a la diapositiva activa y a sus dos
   vecinas. Las demás quedan en póster, así el feed abre con una descarga de
   ~90 KB en lugar de los 8 MB de todos los clips.
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

  var IC = {
    bag:   '<svg width="25" height="25" viewBox="0 0 16 16" fill="none"><path d="M2.5 4.5h11l-.9 10h-9.2z" stroke="currentColor" stroke-width="1.15"/><path d="M5.5 6.5v-3a2.5 2.5 0 015 0v3" stroke="currentColor" stroke-width="1.15"/></svg>',
    bagOn: '<svg width="25" height="25" viewBox="0 0 16 16" fill="none"><path d="M2.5 4.5h11l-.9 10h-9.2z" fill="currentColor"/><path d="M5.5 6.5v-3a2.5 2.5 0 015 0v3" stroke="currentColor" stroke-width="1.3"/><path d="M5.6 9.4l1.7 1.7 3.3-3.4" stroke="#0B0B0E" stroke-width="1.3"/></svg>',
    info:  '<svg width="25" height="25" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.6" stroke="currentColor" stroke-width="1.15"/><path d="M8 7.1v4.3M8 4.5v1" stroke="currentColor" stroke-width="1.4"/></svg>',
    share: '<svg width="25" height="25" viewBox="0 0 16 16" fill="none"><path d="M8 10.6V1.9M5 4.7L8 1.7l3 3" stroke="currentColor" stroke-width="1.2"/><path d="M3.4 7.6v5.9c0 .5.4.9.9.9h7.4c.5 0 .9-.4.9-.9V7.6" stroke="currentColor" stroke-width="1.2"/></svg>',
    wa:    '<svg width="25" height="25" viewBox="0 0 16 16" fill="none"><path d="M8 1.9a6 6 0 00-5.2 9L2 14.4l3.6-.8A6 6 0 108 1.9z" stroke="currentColor" stroke-width="1.15"/><path d="M6.1 5.4c.2-.1.5 0 .6.2l.5 1c.1.2 0 .4-.1.5l-.4.4c.4.8.9 1.3 1.7 1.7l.4-.4c.1-.1.3-.2.5-.1l1 .5c.2.1.3.4.2.6-.3.6-1 .9-1.6.7-1.7-.5-2.9-1.7-3.4-3.4-.2-.6.1-1.3.6-1.7z" fill="currentColor"/></svg>',
    heart: '<svg width="104" height="104" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.6-4.7-9.6-9C1 9 2.4 5.5 5.8 4.6 8 4 10.3 5 12 7.1 13.7 5 16 4 18.2 4.6 21.6 5.5 23 9 21.6 12c-2 4.3-9.6 9-9.6 9z"/></svg>',
    play:  '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6L19 12z"/></svg>'
  };

  function prodDe(id) {
    return C.productos.filter(function (p) { return p.id === id; })[0];
  }
  function catDe(id) {
    return C.categorias.filter(function (c) { return c.id === id; })[0] || {};
  }
  function proyDe(id) {
    return (window.ALTESA_PROY || []).filter(function (p) { return p.id === id; })[0];
  }
  function fotoProd(p) {
    return "img/productos/th/" + (p.img || p.id + ".jpg");
  }
  function waUno(p) {
    var t = "Hola ALTESA, vi el " + p.n + " (" + p.sku + ") en la vitrina del sitio " +
            "y quisiera cotizarlo.";
    return "https://wa.me/" + CO.wa + "?text=" + encodeURIComponent(t);
  }

  /* ---- Armado de una diapositiva ---------------------------------------- */
  function accion(clase, icono, texto, attrs) {
    return '<button class="ract ' + clase + '" type="button" ' + (attrs || "") + '>' +
           icono + "<span>" + texto + "</span></button>";
  }

  function slideHTML(s, i, total) {
    var p = s.pid ? prodDe(s.pid) : null;
    var esCarta = !p;
    var poster = "img/reel/" + s.clip + ".jpg";

    /* --- Bloque de texto --- */
    var txt = "";
    if (esCarta) {
      txt = '<p class="rs__num">' + (s.tipo === "intro"
              ? "Vitrina ALTESA · " + (total - 2) + " destacados"
              : "Fin del recorrido") + "</p>" +
            '<h2 class="rs__gancho">' + s.gancho + "</h2>" +
            '<p class="rs__linea">' + esc(s.linea) + "</p>" +
            '<div class="rs__acts">' +
              (s.tipo === "intro"
                ? '<button class="btn" type="button" data-next><span>Empezar</span>' +
                  '<svg class="arw" width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 5h12M8.5 1.2 12.8 5 8.5 8.8" stroke="currentColor" stroke-width="1.3"/></svg></button>' +
                  '<a class="btn btn--ghost" href="catalogo.html"><span>Catálogo completo</span></a>'
                : '<a class="btn" id="cierreWa" href="#" target="_blank" rel="noopener"><span>Cotizar por WhatsApp</span>' +
                  '<svg class="arw" width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 5h12M8.5 1.2 12.8 5 8.5 8.8" stroke="currentColor" stroke-width="1.3"/></svg></a>' +
                  '<a class="btn btn--ghost" href="catalogo.html"><span>Ver los 101 productos</span></a>') +
            "</div>";
    } else {
      var chips = s.chips || (p.specs || []).slice(0, 3);
      var proy = s.ambiente && s.ambiente.proy ? proyDe(s.ambiente.proy) : null;
      var amb = s.ambiente && s.ambiente.cred
        ? (proy ? '<a class="rs__amb" href="proyectos.html#' + proy.id + '">' : '<span class="rs__amb">') +
          "Ambiente · <b>" + esc(s.ambiente.cred) + "</b>" + (proy ? "</a>" : "</span>")
        : "";

      txt = '<p class="rs__cat">' + esc(s.cat || catDe(p.cat).corta || "") + "</p>" +
            '<h2 class="rs__gancho">' + s.gancho + "</h2>" +
            '<p class="rs__linea">' + esc(s.linea) + "</p>" +
            '<div class="rs__chips">' + chips.map(function (c) {
              return "<span>" + esc(c) + "</span>"; }).join("") + "</div>" +
            '<a class="rs__prod" href="catalogo.html?p=' + esc(p.id) + '">' +
              '<img src="' + esc(fotoProd(p)) + '" alt="' + esc(p.n) + '" loading="lazy" decoding="async" ' +
                'data-fb="img/productos/' + esc(p.img || p.id + ".jpg") + '">' +
              "<div><b>" + esc(p.n) + "</b><small>" + esc(p.sku) + "</small></div></a>" +
            amb;
    }

    /* --- Carril de acciones --- */
    var rail = "";
    if (p) {
      rail = '<div class="rs__rail">' +
        accion("ract--add", IC.bag, "Guardar", 'data-toggle="' + esc(p.id) + '" aria-pressed="false"') +
        accion("ract--info", IC.info, "Ficha", 'data-ficha="' + esc(p.id) + '"') +
        accion("ract--share", IC.share, "Enviar", 'data-share="' + esc(p.id) + '"') +
        '<a class="ract ract--wa" href="' + waUno(p) + '" target="_blank" rel="noopener">' +
          IC.wa + "<span>WhatsApp</span></a>" +
      "</div>";
    }

    var ancla = p ? p.id : (s.tipo === "cierre" ? "final" : "");
    return '<section class="rs' + (esCarta ? " rs--card" : "") + '" data-i="' + i + '"' +
             (ancla ? ' id="' + esc(ancla) + '"' : "") + '>' +
      '<div class="rs__in">' +
        '<div class="rs__media" data-media>' +
          '<img src="' + esc(poster) + '" alt="' + esc(esCarta ? "Instalación ALTESA" :
              "Ambiente con " + p.n) + '" ' + (i < 2 ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">' +
          '<video data-src="video/reel/' + esc(s.clip) + '.mp4" muted loop playsinline ' +
            'preload="none" aria-hidden="true" tabindex="-1"></video>' +
          '<div class="rs__scrim"></div>' +
          '<div class="rs__bar"><i></i></div>' +
          '<div class="rs__pause"><span>' + IC.play + "</span></div>" +
          '<div class="rs__pop">' + IC.heart + "</div>" +
          rail +
        "</div>" +
        '<div class="rs__info">' + txt + "</div>" +
      "</div></section>";
  }

  /* ---- Montaje ----------------------------------------------------------- */
  var slides = R.slides;
  feed.innerHTML = slides.map(function (s, i) { return slideHTML(s, i, slides.length); }).join("");

  var secs   = $$(".rs", feed);
  var vids   = secs.map(function (s) { return $("video", s); });
  var bgs    = $$("#reelBg i");
  var pager  = document.getElementById("pager");
  var ticks  = document.getElementById("ticks");
  var cart   = document.getElementById("reelCart");
  var hint   = document.getElementById("hint");
  var actual = 0, bgTurno = 0;

  document.getElementById("reelAviso").textContent = R.aviso;
  ticks.innerHTML = secs.map(function () { return "<i></i>"; }).join("");
  var tickEls = $$("i", ticks);

  /* ---- Video: solo la activa y sus vecinas ------------------------------- */
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

  function activar(i) {
    if (i === actual && vids[i] && vids[i].src) return;
    actual = i;

    for (var k = 0; k < vids.length; k++) {
      if (Math.abs(k - i) <= 1) cargar(k); else soltar(k);
      if (k !== i && vids[k]) vids[k].pause();
      secs[k].classList.remove("is-paused");
    }
    if (autoOK) reproducir(i);

    // Fondo ambiental: alterna las dos capas para que el cambio disuelva
    var url = "img/reel/" + slides[i].clip + ".jpg";
    var capa = bgs[bgTurno % 2], otra = bgs[(bgTurno + 1) % 2];
    capa.style.backgroundImage = 'url("' + url + '")';
    capa.classList.add("is-on"); otra.classList.remove("is-on");
    bgTurno++;

    tickEls.forEach(function (t, k) { t.classList.toggle("is-on", k === i); });
    if (i > 0 && hint && !hint.hidden) hint.hidden = true;

    var s = slides[i];
    var h = s.pid || (s.tipo === "intro" ? "" : "final");
    try { history.replaceState(null, "", h ? "#" + h : location.pathname); } catch (e) {}
  }

  function reproducir(i) {
    var v = vids[i]; if (!v) return;
    var pr = v.play();
    if (pr && pr.catch) pr.catch(function () { /* el navegador lo bloqueó */ });
    v.classList.add("is-on");
    secs[i].classList.remove("is-paused");
  }

  /* La barra de avance escucha al clip. `timeupdate` dispara ~4 veces por
     segundo: suficiente para la barra y sin el bucle de animación permanente
     que estaría gastando batería en el teléfono. */
  vids.forEach(function (v, i) {
    if (!v) return;
    v.addEventListener("timeupdate", function () {
      if (!v.duration) return;
      $("i", $(".rs__bar", secs[i])).style.width =
        (v.currentTime / v.duration * 100).toFixed(2) + "%";
    });
  });

  /* ---- Observador de la diapositiva en pantalla -------------------------- */
  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio > 0.6) activar(+e.target.dataset.i);
    });
  }, { root: feed, threshold: [0.61] });
  secs.forEach(function (s) { io.observe(s); });

  /* ---- Navegación --------------------------------------------------------- */
  function ir(d) {
    var i = Math.max(0, Math.min(secs.length - 1, actual + d));
    secs[i].scrollIntoView({ behavior: "smooth", block: "center" });
  }
  $$("[data-go]", pager).forEach(function (b) {
    b.addEventListener("click", function () { ir(+b.getAttribute("data-go")); });
  });
  var next = $("[data-next]", feed);
  if (next) next.addEventListener("click", function () { ir(1); });

  document.addEventListener("keydown", function (e) {
    if ($(".drawer.is-on")) return;                     // el cajón manda
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); ir(1); }
    if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); ir(-1); }
    if (e.key === " ")  { e.preventDefault(); alternarPausa(); }
    if (e.key === "g" || e.key === "G") { var b = $(".ract--add", secs[actual]); if (b) b.click(); }
  });

  function alternarPausa() {
    var v = vids[actual]; if (!v || !v.src) return;
    if (v.paused) { reproducir(actual); } else { v.pause(); }
    secs[actual].classList.toggle("is-paused", v.paused);
  }

  /* ---- Gestos sobre el clip: un toque pausa, dos guardan ------------------ */
  secs.forEach(function (sec, i) {
    var media = $("[data-media]", sec);
    var add   = $(".ract--add", sec);
    var t = null;

    media.addEventListener("click", function () {
      if (t) {                                          // segundo toque
        clearTimeout(t); t = null;
        if (add && !add.classList.contains("is-on")) add.click();
        else if (add) { golpe(sec); }                   // ya estaba guardado
        return;
      }
      t = setTimeout(function () { t = null; if (i === actual) alternarPausa(); }, 260);
    });
  });

  function golpe(sec) {
    var pop = $(".rs__pop", sec);
    pop.classList.remove("is-on");
    void pop.offsetWidth;                                // reinicia la animación
    pop.classList.add("is-on");
  }

  /* ---- Selección: misma que el resto del sitio ---------------------------- */
  $$("[data-toggle]", feed).forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.getAttribute("data-toggle");
      var seAgrega = !SEL.has(id);
      SEL.toggle(id);
      if (seAgrega) golpe(b.closest(".rs"));
    });
  });

  function sincronizar() {
    $$("[data-toggle]", feed).forEach(function (b) {
      var on = SEL.has(b.getAttribute("data-toggle"));
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = (on ? IC.bagOn : IC.bag) +
                    "<span>" + (on ? "Guardado" : "Guardar") + "</span>";
    });

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

  function enlaceWa() {
    var items = SEL.prods();
    var lineas = items.map(function (p, i) { return (i + 1) + ". " + p.n + " (" + p.sku + ")"; }).join("\n");
    return "https://wa.me/" + CO.wa + "?text=" + encodeURIComponent(
      "Hola ALTESA, me interesa cotizar los siguientes productos:\n\n" + lineas +
      "\n\nQuedo atento(a) a su respuesta.");
  }

  // SEL.save() corre en cada cambio, venga del feed o del cajón lateral
  var guardarOriginal = SEL.save;
  SEL.save = function () { guardarOriginal.apply(SEL, arguments); sincronizar(); };

  document.getElementById("cartOpen").addEventListener("click", function () {
    document.getElementById("selOpen").click();
  });

  /* ---- Ficha y compartir --------------------------------------------------- */
  $$("[data-ficha]", feed).forEach(function (b) {
    b.addEventListener("click", function () {
      location.href = "catalogo.html?p=" + b.getAttribute("data-ficha");
    });
  });

  $$("[data-share]", feed).forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.getAttribute("data-share"), p = prodDe(id);
      var url = location.origin + location.pathname + "#" + id;
      var datos = { title: "ALTESA · " + p.n, text: p.n + " (" + p.sku + ")", url: url };
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

  /* ---- Movimiento reducido: ofrecer el video en lugar de esconderlo ------- */
  if (!autoOK) {
    var aviso = document.createElement("div");
    aviso.className = "reel__cart";
    aviso.style.bottom = "calc(env(safe-area-inset-bottom) + 4.2rem)";
    aviso.innerHTML = '<button type="button" style="pointer-events:none">' + IC.play +
      '<span style="margin-left:.1rem">Su equipo pide menos movimiento</span></button>' +
      '<a href="?motion=on">Reproducir los clips</a>';
    document.getElementById("reel").appendChild(aviso);
  }

  /* ---- Arranque ------------------------------------------------------------ */
  sincronizar();

  var destino = location.hash.replace("#", "");
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

  // Al volver de otra pestaña, retomar el clip activo
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && autoOK) reproducir(actual);
    else if (vids[actual]) vids[actual].pause();
  });

})();
