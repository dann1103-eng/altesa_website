/* =========================================================================
   ALTESA — comportamiento del sitio
   Sin dependencias, sin módulos: funciona abriendo el HTML directamente.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- Datos de contacto (fuente única) -------------------------------- */
  var CO = {
    tel:  "+503 7841-9621",
    telH: "+50378419621",
    wa:   "50378419621",
    mail: "Monitoreo@altesa.com.sv",
    dir:  "83 Av. Norte, Edificio López Pinaud #634,<br>Colonia Escalón, San Salvador, El Salvador.",
    fb:   "https://www.facebook.com/Altesa-S-A-de-C-V-102385241423445"
  };

  var NAV = [
    ["index.html",         "Inicio"],
    ["catalogo.html",      "Catálogo"],
    ["proyectos.html",     "Proyectos"],
    ["servicios.html",     "Servicios"],
    ["profesionales.html", "Profesionales"],
    ["contacto.html",      "Contacto"]
  ];

  /* ---- Iconos ---------------------------------------------------------- */
  var I = {
    mark: '<svg class="hdr__mark" viewBox="0 0 44 37" aria-hidden="true"><defs><linearGradient id="am" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8479F"/><stop offset="1" stop-color="#8E1F66"/></linearGradient></defs><path d="M22 1.5 43 35.5H31.2L22 19.4 12.8 35.5H1z" fill="url(#am)"/><path d="M22 21.6 27.7 31.5H16.3z" fill="#1B1B21"/></svg>',
    arw:  '<svg class="arw" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true"><path d="M0 5h12M8.5 1.2 12.8 5 8.5 8.8" stroke="currentColor" stroke-width="1.3"/></svg>',
    x:    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.4"/></svg>',
    plus: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" stroke-width="1.5"/></svg>',
    chk:  '<svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"><path d="M1 5l3.6 3.6L12 1.2" stroke="currentColor" stroke-width="1.6"/></svg>',
    srch: '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><circle cx="6.2" cy="6.2" r="5" stroke="currentColor" stroke-width="1.3"/><path d="M10 10l4 4" stroke="currentColor" stroke-width="1.3"/></svg>',
    bag:  '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 4.5h11l-.9 10h-9.2z" stroke="currentColor" stroke-width="1.2"/><path d="M5.5 6.5v-3a2.5 2.5 0 015 0v3" stroke="currentColor" stroke-width="1.2"/></svg>',
    prev: '<svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9 1L3 7l6 6" stroke="currentColor" stroke-width="1.4"/></svg>',
    next: '<svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M5 1l6 6-6 6" stroke="currentColor" stroke-width="1.4"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2"/><path d="M8 7.2v4.2M8 4.6v.9" stroke="currentColor" stroke-width="1.4"/></svg>'
  };

  /* ---- Preferencia de movimiento ----------------------------------------
     Por defecto sigue al sistema operativo. El visitante puede forzarla desde
     el control del pie o con ?motion=on / ?motion=off en la URL; la elección
     queda guardada. Así el sitio respeta la accesibilidad por defecto sin
     impedir que quien quiera ver el movimiento lo active.
     ---------------------------------------------------------------------- */
  var MOTION_KEY = "altesa_movimiento";
  function sistemaReduce() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function motionPref() {
    try {
      var url = new URLSearchParams(location.search).get("motion");
      if (url === "on" || url === "off") { localStorage.setItem(MOTION_KEY, url); return url; }
      var v = localStorage.getItem(MOTION_KEY);
      if (v === "on" || v === "off") return v;
    } catch (e) {}
    return sistemaReduce() ? "off" : "auto";
  }
  function aplicarMotion() {
    var p = motionPref(), root = document.documentElement;
    root.classList.toggle("motion-on", p === "on");
    root.classList.toggle("motion-off", p === "off");
    return p;
  }
  function motionActivo() { return aplicarMotion() !== "off"; }
  aplicarMotion();

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); };

  /* ---- Fallback global de imágenes ------------------------------------- */
  document.addEventListener("error", function (e) {
    var el = e.target;
    if (!el || el.tagName !== "IMG" || !el.dataset.fb || el.dataset.fbDone) return;
    el.dataset.fbDone = "1";
    el.src = el.dataset.fb;
    var host = el.closest("[data-hasph]");
    if (host) host.setAttribute("data-ph", "1");
  }, true);

  function imgTag(src, alt, fallback, cls) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async"' +
           (fallback ? ' data-fb="' + esc(fallback) + '"' : "") +
           (cls ? ' class="' + cls + '"' : "") + ">";
  }
  function catDe(id) {
    return ((window.ALTESA_CAT || {}).categorias || []).filter(function (c) { return c.id === id; })[0] || {};
  }
  function prodSrc(p) { return "img/productos/" + (p.img || p.id + ".jpg"); }
  function prodFb(p)  { return "img/placeholder/" + (catDe(p.cat).ph || "control") + ".svg"; }
  // Bloques clave (categorías, mosaico): cargar de inmediato, no en diferido.
  function eager(html) { return html.split('loading="lazy"').join('loading="eager"'); }
  // Miniatura 720px para rejillas y listas; la original 1600px queda para
  // hero, ficha y lightbox. Las fotos de producto del cliente no tienen thumb.
  function th(src) {
    if (src.indexOf("img/proyectos/") === 0) return src.replace("img/proyectos/", "img/proyectos/th/");
    if (src.indexOf("img/productos/") === 0) return src.replace("img/productos/", "img/productos/th/");
    return src;
  }

  /* ---- Header / Footer -------------------------------------------------- */
  function mountChrome() {
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var hdr = document.createElement("header");
    hdr.className = "hdr";
    hdr.innerHTML =
      '<div class="wrap hdr__in">' +
        '<a class="pill hdr__brand" href="index.html" aria-label="ALTESA Smart Monitoring, inicio">' + I.mark +
          '<span class="hdr__word"><b>ALTESA</b><span>Smart Monitoring</span></span></a>' +
        '<nav class="pill nav" id="nav">' +
          NAV.map(function (n) {
            return '<a href="' + n[0] + '"' + (n[0] === here ? ' aria-current="page"' : "") + '>' + n[1] + "</a>";
          }).join("") +
        "</nav>" +
        '<div class="pill hdr__cta">' +
          '<button class="selbtn" id="selOpen" type="button">' + I.bag +
            "<span>Mi selección</span>" +
            '<span class="selbtn__n" id="selN" data-n="0"></span></button>' +
          '<button class="burger" id="burger" type="button" aria-label="Menú" aria-expanded="false"><i></i></button>' +
        "</div>" +
      "</div>";
    document.body.insertBefore(hdr, document.body.firstChild);

    var ftr = document.createElement("footer");
    ftr.className = "ftr";
    ftr.innerHTML =
      '<div class="wrap">' +
        '<div class="ftr__top">' +
          "<div><div class='ftr__brand'>" + I.mark.replace('class="hdr__mark" ', "") +
            "<b>ALTESA</b></div>" +
            "<p>Integramos iluminación, cortinas, seguridad, audio y control en un solo sistema. 26 años instalando y monitoreando en El Salvador.</p></div>" +
          "<div><h4>Catálogo</h4><ul>" +
            (window.ALTESA_CAT ? window.ALTESA_CAT.categorias.slice(0, 6).map(function (c) {
              return '<li><a href="catalogo.html#' + c.id + '">' + esc(c.corta) + "</a></li>"; }).join("") : "") +
          "</ul></div>" +
          "<div><h4>Empresa</h4><ul>" +
            NAV.slice(1).map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + "</a></li>"; }).join("") +
          "</ul></div>" +
          "<div><h4>Contacto</h4><address>" + CO.dir +
            '<br><br><a href="tel:' + CO.telH + '">' + CO.tel + "</a>" +
            '<br><a href="mailto:' + CO.mail + '">' + CO.mail + "</a>" +
            '<br><a href="' + CO.fb + '" target="_blank" rel="noopener">Facebook</a>' +
          "</address></div>" +
        "</div>" +
        '<div class="ftr__bot"><span>© ' + new Date().getFullYear() +
          " ALTESA · Grupo López &amp; Pinaud</span><span>San Salvador, El Salvador</span>" +
          '<button class="motionbtn" id="motionBtn" type="button" aria-pressed="false">' +
            "<i></i><span>Animaciones</span></button>" +
          "<span>Fotografía: Rodrigo Galo</span></div>" +
      "</div>";
    document.body.appendChild(ftr);

    // Control de movimiento
    var mb = $("#motionBtn");
    var pintarMB = function () {
      var on = motionActivo();
      mb.setAttribute("aria-pressed", on ? "true" : "false");
      mb.title = on ? "Animaciones activadas — clic para reducirlas"
                    : "Animaciones reducidas" + (sistemaReduce() ? " por tu sistema" : "") +
                      " — clic para activarlas";
    };
    mb.addEventListener("click", function () {
      var ahora = motionActivo() ? "off" : "on";
      try { localStorage.setItem(MOTION_KEY, ahora); } catch (e) {}
      aplicarMotion(); pintarMB();
      // El carrusel y la marquesina reevalúan su auto-avance
      window.dispatchEvent(new Event("altesa:motion"));
    });
    pintarMB();

    var b = $("#burger");
    b.addEventListener("click", function () {
      var open = document.body.classList.toggle("is-open");
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#nav a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("is-open"); });
    });

    // Encabezado: cristal al bajar, se oculta al hacer scroll hacia abajo
    // y reaparece al subir (comportamiento del nav flotante de Habitline).
    var last = 0;
    var filtros = null;
    var onScroll = function () {
      var y = window.scrollY;
      hdr.classList.toggle("is-stuck", y > 24);
      var down = y > last && y > 420;
      if (!document.body.classList.contains("is-open")) hdr.classList.toggle("is-hidden", down);
      last = y;

      // La barra de filtros se pega justo debajo del encabezado; cuando este
      // se oculta, sube hasta el borde. Sin esto queda flotando en el aire.
      if (filtros === null) filtros = $(".filters") || false;
      if (filtros) {
        var alto = hdr.classList.contains("is-hidden") ? 10 : hdr.offsetHeight + 8;
        document.documentElement.style.setProperty("--stick-top", alto + "px");
        var r = filtros.getBoundingClientRect();
        filtros.classList.toggle("is-stuck", Math.abs(r.top - alto) < 2);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ---- Sistema de movimiento -------------------------------------------
     Entrada por opacidad + desplazamiento, escalonada entre hermanos,
     disparada al entrar en viewport y ejecutada una sola vez.
     [data-mo-group]  → escalona automáticamente a sus hijos directos
     [data-mo]        → anima el elemento (variantes: blur, scale, left, right, mask)
     ---------------------------------------------------------------------- */
  function motion() {
    // Escalonado automático dentro de cada grupo
    $$("[data-mo-group]").forEach(function (g) {
      var variante = g.getAttribute("data-mo-group") || "";
      Array.prototype.forEach.call(g.children, function (child, i) {
        if (!child.hasAttribute("data-mo") && !child.hasAttribute("data-rv")) {
          child.setAttribute("data-mo", variante);
        }
        if (!child.style.getPropertyValue("--i")) child.style.setProperty("--i", i);
      });
    });

    var els = $$("[data-mo], [data-rv], .lightline, .rail");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("is-in"); });
      $$("[data-odo]").forEach(rollOdometer);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        if (en.target.hasAttribute("data-odo")) rollOdometer(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
    $$("[data-odo]").forEach(function (e) { io.observe(e); });

    // Red de seguridad: si el observer no llega a disparar (pestaña en segundo
    // plano, motor sin render), nada debe quedarse invisible dentro de la vista.
    window.addEventListener("load", function () {
      setTimeout(function () {
        $$("[data-mo]:not(.is-in), [data-rv]:not(.is-in)").forEach(function (e) {
          var r = e.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) e.classList.add("is-in");
        });
        $$("[data-odo]").forEach(function (e) {
          var r = e.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) rollOdometer(e);
        });
      }, 1200);
    });

    parallax();
  }

  /* Parallax ligero de imágenes marcadas con .par */
  function parallax() {
    var items = $$(".par");
    if (!items.length) return;
    var ticking = false;
    function frame() {
      if (!motionActivo()) { items.forEach(function (el) { el.style.transform = ""; }); return; }
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh;      // -1 .. 1
        var amt = +(el.getAttribute("data-par") || 26);
        el.style.transform = "translate3d(0," + (p * amt).toFixed(2) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }, { passive: true });
    frame();
  }

  /* ---- Contador de dígitos rodantes -------------------------------------- */
  function buildOdometer(host) {
    var valor = host.getAttribute("data-odo") || "0";
    host.innerHTML = valor.split("").map(function (ch, i) {
      if (!/[0-9]/.test(ch)) return '<span class="odo__fix">' + esc(ch) + "</span>";
      var reel = "";
      for (var d = 0; d <= 9; d++) reel += "<i>" + d + "</i>";
      // arranca en 0 y rueda hasta el dígito final
      return '<span class="odo__d"><span class="odo__r" style="--k:' + i +
             '" data-target="' + ch + '">' + reel + "</span></span>";
    }).join("");
  }
  function rollOdometer(host) {
    $$(".odo__r", host).forEach(function (reel) {
      var d = +reel.getAttribute("data-target");
      reel.style.transform = "translateY(-" + d + "em)";
    });
  }

  /* ---- Acordeón ---------------------------------------------------------- */
  function accordions() {
    $$(".acc").forEach(function (acc) {
      var solaUna = acc.hasAttribute("data-solo");
      $$(".acc__q", acc).forEach(function (q) {
        q.addEventListener("click", function () {
          var item = q.closest(".acc__item");
          var abierto = item.classList.contains("is-open");
          if (solaUna) $$(".acc__item", acc).forEach(function (o) {
            o.classList.remove("is-open");
            $(".acc__q", o).setAttribute("aria-expanded", "false");
          });
          item.classList.toggle("is-open", !abierto);
          q.setAttribute("aria-expanded", !abierto ? "true" : "false");
        });
      });
    });
  }

  /* ---- Lightbox ---------------------------------------------------------- */
  var LB = {
    set: [], i: 0, el: null,
    build: function () {
      if (this.el) return;
      var d = document.createElement("div");
      d.className = "lb"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
      d.innerHTML =
        '<button class="lb__x" type="button" aria-label="Cerrar">' + I.x + "</button>" +
        '<button class="lb__nav lb__prev" type="button" aria-label="Anterior">' + I.prev + "</button>" +
        '<button class="lb__nav lb__next" type="button" aria-label="Siguiente">' + I.next + "</button>" +
        '<div><img alt=""><p class="lb__cap"></p></div>';
      document.body.appendChild(d);
      this.el = d;
      $(".lb__x", d).addEventListener("click", this.close.bind(this));
      $(".lb__prev", d).addEventListener("click", this.go.bind(this, -1));
      $(".lb__next", d).addEventListener("click", this.go.bind(this, 1));
      d.addEventListener("click", function (e) { if (e.target === d) LB.close(); });
      document.addEventListener("keydown", function (e) {
        if (!d.classList.contains("is-on")) return;
        if (e.key === "Escape") LB.close();
        if (e.key === "ArrowLeft") LB.go(-1);
        if (e.key === "ArrowRight") LB.go(1);
      });
    },
    open: function (set, i) {
      this.build(); this.set = set; this.i = i; this.render();
      this.el.classList.add("is-on"); document.body.style.overflow = "hidden";
    },
    go: function (d) { this.i = (this.i + d + this.set.length) % this.set.length; this.render(); },
    render: function () {
      var it = this.set[this.i];
      $(".lb img", this.el).src = it.src;
      $(".lb img", this.el).alt = it.cap || "";
      $(".lb__cap", this.el).textContent = (this.i + 1) + " / " + this.set.length + (it.cap ? " · " + it.cap : "");
      var multi = this.set.length > 1;
      $(".lb__prev", this.el).style.display = multi ? "grid" : "none";
      $(".lb__next", this.el).style.display = multi ? "grid" : "none";
    },
    close: function () { this.el.classList.remove("is-on"); document.body.style.overflow = ""; }
  };

  /* ---- Drawer genérico --------------------------------------------------- */
  function Drawer(id, title) {
    var scrim = document.createElement("div"); scrim.className = "scrim";
    var d = document.createElement("aside");
    d.className = "drawer"; d.id = id;
    d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-label", title);
    d.innerHTML =
      '<div class="drawer__hd"><h2>' + esc(title) + '</h2>' +
        '<button class="drawer__x" type="button" aria-label="Cerrar">' + I.x + "</button></div>" +
      '<div class="drawer__bd"></div><div class="drawer__ft"></div>';
    document.body.appendChild(scrim); document.body.appendChild(d);

    var api = {
      el: d, scrim: scrim,
      body: $(".drawer__bd", d), foot: $(".drawer__ft", d), head: $(".drawer__hd h2", d),
      open: function () {
        d.classList.add("is-on"); scrim.classList.add("is-on");
        document.body.style.overflow = "hidden"; api.body.scrollTop = 0;
      },
      close: function () {
        d.classList.remove("is-on"); scrim.classList.remove("is-on");
        if (!$(".drawer.is-on")) document.body.style.overflow = "";
      }
    };
    $(".drawer__x", d).addEventListener("click", api.close);
    scrim.addEventListener("click", api.close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && d.classList.contains("is-on")) api.close();
    });
    return api;
  }

  /* ---- Mi selección ------------------------------------------------------ */
  var SEL = {
    key: "altesa_seleccion_v1", ids: [], drawer: null,
    load: function () {
      try { this.ids = JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { this.ids = []; }
    },
    save: function () {
      try { localStorage.setItem(this.key, JSON.stringify(this.ids)); } catch (e) {}
      this.badge(); this.syncButtons();
    },
    has: function (id) { return this.ids.indexOf(id) > -1; },
    toggle: function (id) {
      var i = this.ids.indexOf(id);
      if (i > -1) this.ids.splice(i, 1); else this.ids.push(id);
      this.save();
      if (this.drawer && this.drawer.el.classList.contains("is-on")) this.render();
    },
    badge: function () {
      var n = $("#selN"); if (!n) return;
      n.textContent = this.ids.length ? this.ids.length : "";
      n.setAttribute("data-n", this.ids.length);
    },
    syncButtons: function () {
      var self = this;
      $$("[data-add]").forEach(function (b) {
        var on = self.has(b.getAttribute("data-add"));
        b.classList.toggle("is-on", on);
        b.innerHTML = on ? I.chk : I.plus;
        b.setAttribute("aria-label", (on ? "Quitar de" : "Agregar a") + " mi selección");
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    },
    prods: function () {
      if (!window.ALTESA_CAT) return [];
      var all = window.ALTESA_CAT.productos, out = [];
      this.ids.forEach(function (id) {
        var p = all.filter(function (x) { return x.id === id; })[0];
        if (p) out.push(p);
      });
      return out;
    },
    render: function () {
      var items = this.prods(), d = this.drawer;
      d.head.textContent = "Mi selección (" + items.length + ")";
      if (!items.length) {
        d.body.innerHTML =
          '<div class="sel__empty">' + I.bag.replace('width="15" height="15"', 'width="40" height="40"') +
          "<p>Todavía no hay productos en tu selección.</p>" +
          '<p style="margin-top:.6rem"><a class="linkline" href="catalogo.html">Ir al catálogo ' + I.arw + "</a></p></div>";
        d.foot.innerHTML = "";
        return;
      }
      d.body.innerHTML = '<div class="sel__list">' + items.map(function (p) {
        return '<div class="sel__item">' +
          imgTag(th(prodSrc(p)), p.n, prodFb(p)) +
          "<div><b>" + esc(p.n) + "</b><small>" + esc(p.sku) + "</small></div>" +
          '<button class="sel__rm" type="button" data-rm="' + p.id + '" aria-label="Quitar ' + esc(p.n) + '">' + I.x + "</button>" +
        "</div>";
      }).join("") + "</div>";

      var lines = items.map(function (p, i) { return (i + 1) + ". " + p.n + " (" + p.sku + ")"; }).join("\n");
      var msg = "Hola ALTESA, me interesa cotizar los siguientes productos:\n\n" + lines +
                "\n\nQuedo atento(a) a su respuesta.";
      d.foot.innerHTML =
        '<a class="btn btn--lg" href="https://wa.me/' + CO.wa + "?text=" + encodeURIComponent(msg) +
          '" target="_blank" rel="noopener"><span>Solicitar cotización</span>' + I.arw + "</a>" +
        '<a class="btn btn--ghost" href="mailto:' + CO.mail + "?subject=" +
          encodeURIComponent("Solicitud de cotización — " + items.length + " productos") +
          "&body=" + encodeURIComponent(msg) + '"><span>Enviar por correo</span></a>' +
        '<button class="linkline" type="button" id="selClear" style="justify-self:start;color:var(--tx-mid)">Vaciar selección</button>';

      $$("[data-rm]", d.body).forEach(function (b) {
        b.addEventListener("click", function () { SEL.toggle(b.getAttribute("data-rm")); });
      });
      $("#selClear").addEventListener("click", function () { SEL.ids = []; SEL.save(); SEL.render(); });
    },
    init: function () {
      this.load(); this.badge(); this.syncButtons();
      this.drawer = Drawer("selDrawer", "Mi selección");
      var self = this;
      var btn = $("#selOpen");
      if (btn) btn.addEventListener("click", function () { self.render(); self.drawer.open(); });
    }
  };

  /* ---- Catálogo ---------------------------------------------------------- */
  var CATALOGO = {
    cat: "todas", amb: "todos", q: "", drawer: null,
    init: function () {
      var grid = $("#pgrid"); if (!grid || !window.ALTESA_CAT) return;
      this.grid = grid;
      this.drawer = Drawer("prodDrawer", "Ficha de producto");
      this.buildFilters();
      var h = location.hash.replace("#", "");
      if (h && window.ALTESA_CAT.categorias.some(function (c) { return c.id === h; })) this.cat = h;
      this.sync(); this.render();

      // ?p=<id> abre directamente esa ficha: el enlace de un producto es compartible
      var pid = new URLSearchParams(location.search).get("p");
      if (pid && window.ALTESA_CAT.productos.some(function (x) { return x.id === pid; })) {
        var self = this;
        setTimeout(function () { self.detail(pid); }, 120);
      }
    },
    buildFilters: function () {
      var C = window.ALTESA_CAT, self = this;
      $("#chipsCat").innerHTML =
        '<button class="chip" type="button" data-c="todas">Todas</button>' +
        C.categorias.map(function (c) {
          var n = C.productos.filter(function (p) { return p.cat === c.id; }).length;
          return '<button class="chip" type="button" data-c="' + c.id + '">' + esc(c.corta) + " · " + n + "</button>";
        }).join("");
      $("#chipsAmb").innerHTML =
        '<button class="chip" type="button" data-a="todos">Todos</button>' +
        C.tipos.map(function (t) {
          var n = C.productos.filter(function (p) { return p.tipo === t; }).length;
          return '<button class="chip" type="button" data-a="' + esc(t) + '">' + esc(t) + " · " + n + "</button>";
        }).join("");

      $$("#chipsCat .chip").forEach(function (b) {
        b.addEventListener("click", function () {
          self.cat = b.getAttribute("data-c");
          history.replaceState(null, "", self.cat === "todas" ? location.pathname : "#" + self.cat);
          self.sync(); self.render();
        });
      });
      $$("#chipsAmb .chip").forEach(function (b) {
        b.addEventListener("click", function () { self.amb = b.getAttribute("data-a"); self.sync(); self.render(); });
      });
      var s = $("#q"), t;
      s.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () { self.q = s.value.trim().toLowerCase(); self.render(); }, 140);
      });
      $("#clear").addEventListener("click", function () {
        self.cat = "todas"; self.amb = "todos"; self.q = ""; s.value = "";
        history.replaceState(null, "", location.pathname);
        self.sync(); self.render();
      });
    },
    sync: function () {
      var self = this;
      $$("#chipsCat .chip").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-c") === self.cat ? "true" : "false"); });
      $$("#chipsAmb .chip").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-a") === self.amb ? "true" : "false"); });
    },
    match: function (p) {
      if (this.cat !== "todas" && p.cat !== this.cat) return false;
      if (this.amb !== "todos" && p.tipo !== this.amb) return false;
      if (this.q) {
        var hay = [p.n, p.tag, p.sku, p.tipo, (p.prot || []).join(" "), p.desc || "",
                   (p.variantes || []).map(function (v) { return v.n + " " + v.sku; }).join(" ")
                  ].join(" ").toLowerCase();
        if (hay.indexOf(this.q) < 0) return false;
      }
      return true;
    },
    render: function () {
      var C = window.ALTESA_CAT, self = this;
      var list = C.productos.filter(function (p) { return self.match(p); });
      var catName = function (id) {
        var c = C.categorias.filter(function (x) { return x.id === id; })[0]; return c ? c.corta : id; };

      $("#count").textContent = list.length + (list.length === 1 ? " producto" : " productos");

      if (!list.length) {
        this.grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><b>Sin resultados</b>' +
          "<p>Probá con otra categoría, otro ambiente o un término más corto.</p></div>";
        return;
      }

      this.grid.innerHTML = list.map(function (p) {
        return '<article class="pcard" data-hasph>' +
          '<button class="pcard__media" type="button" data-open="' + p.id + '" aria-label="Ver ficha de ' + esc(p.n) + '">' +
            imgTag(th(prodSrc(p)), p.n, prodFb(p)) +
            '<span class="pcard__ph">Foto pendiente</span><span class="pcard__sweep"></span>' +
          "</button>" +
          '<div class="pcard__body">' +
            '<span class="pcard__cat">' + esc(catName(p.cat)) + "</span>" +
            '<h3><button type="button" data-open="' + p.id + '" style="text-align:left">' + esc(p.n) + "</button></h3>" +
            "<p>" + esc(p.tag) + "</p>" +
            '<div class="pcard__foot">' +
              '<div class="badges">' + (p.prot || []).slice(0, 2).map(function (b) {
                var cls = /zigbee/i.test(b) ? " badge--zig" : /matter/i.test(b) ? " badge--mat" : "";
                return '<span class="badge' + cls + '">' + esc(b) + "</span>"; }).join("") +
                ((p.variantes || []).length > 1
                  ? '<span class="badge badge--var">' + p.variantes.length + " variantes</span>" : "") +
              "</div>" +
              '<button class="pcard__add" type="button" data-add="' + p.id + '"></button>' +
            "</div>" +
          "</div></article>";
      }).join("");

      $$("[data-open]", this.grid).forEach(function (b) {
        b.addEventListener("click", function () { self.detail(b.getAttribute("data-open")); });
      });
      $$("[data-add]", this.grid).forEach(function (b) {
        b.addEventListener("click", function () { SEL.toggle(b.getAttribute("data-add")); });
      });
      SEL.syncButtons();
    },
    detail: function (id) {
      var C = window.ALTESA_CAT;
      var p = C.productos.filter(function (x) { return x.id === id; })[0]; if (!p) return;
      var c = catDe(p.cat);
      var d = this.drawer;
      d.head.textContent = c.corta || "Producto";

      var vars = p.variantes || [];
      // Acabados/colores: eje visual con foto propia por opción
      var acabados = [];
      vars.forEach(function (v) {
        if (v.acabado && acabados.indexOf(v.acabado) < 0) acabados.push(v.acabado);
      });

      function filaSku(v) {
        return '<tr><td>' + esc(v.n) + "</td><td><code>" + esc(v.sku) + "</code></td></tr>";
      }

      d.body.innerHTML =
        '<div class="dt" data-hasph>' +
          '<div class="dt__media" id="dtMedia">' + imgTag(prodSrc(p), p.n, prodFb(p)) + "</div>" +
          '<div class="badges">' + (p.prot || []).map(function (b) {
            var cls = /zigbee/i.test(b) ? " badge--zig" : /matter/i.test(b) ? " badge--mat" : "";
            return '<span class="badge' + cls + '">' + esc(b) + "</span>"; }).join("") + "</div>" +
          "<h3>" + esc(p.n) + "</h3>" +
          (p.sku ? '<div class="dt__sku">SKU · ' + esc(p.sku) + "</div>" : "") +
          '<p class="dt__desc">' + esc(
             (acabados.length > 1 &&
              (vars.filter(function (v) { return v.acabado === acabados[0]; })[0] || {}).nota) ||
             p.desc || p.tag) + "</p>" +

          (acabados.length > 1
            ? '<h4 class="dt__h4">' + esc(p.eje || "Acabado") + "</h4>" +
              '<div class="vopts" id="vopts">' + acabados.map(function (a, i) {
                var v = vars.filter(function (x) { return x.acabado === a; })[0];
                return '<button class="vopt' + (i === 0 ? " is-on" : "") + '" type="button" data-ac="' + esc(a) + '"' +
                       (v && v.nota ? ' data-nota="' + esc(v.nota) + '"' : "") +
                       (v && v.img ? ' data-img="img/productos/' + esc(v.img) + '"' : "") + ">" +
                       (v && v.img ? imgTag(th("img/productos/" + v.img), a, prodFb(p)) : "") +
                       "<span>" + esc(a) + "</span></button>";
              }).join("") + "</div>"
            : "") +

          (vars.length
            ? '<h4 class="dt__h4">Modelos disponibles</h4>' +
              '<table class="vtab" id="vtab"><thead><tr><th>Modelo</th><th>Código</th></tr></thead><tbody>' +
              (acabados.length > 1
                ? vars.filter(function (v) { return v.acabado === acabados[0]; }).map(filaSku).join("")
                : vars.map(filaSku).join("")) +
              "</tbody></table>"
            : "") +

          (p.specs && p.specs.length
            ? '<h4 class="dt__h4">Especificaciones</h4><ul class="speclist">' +
              p.specs.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>"
            : "") +

          '<h4 class="dt__h4">Sistema</h4><div class="taglist">' +
            '<span class="tag">' + esc(c.n || "") + "</span>" +
            (p.tipo ? '<span class="tag">' + esc(p.tipo) + "</span>" : "") + "</div>" +
        "</div>";

      // Cambiar de acabado repinta la foto y la tabla de códigos
      $$("#vopts .vopt", d.body).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("#vopts .vopt", d.body).forEach(function (o) { o.classList.remove("is-on"); });
          b.classList.add("is-on");
          var ac = b.getAttribute("data-ac"), im = b.getAttribute("data-img");
          if (im) $("#dtMedia img", d.body).src = im;
          var nota = b.getAttribute("data-nota"), pd = $(".dt__desc", d.body);
          if (nota && pd) pd.textContent = nota;
          var tb = $("#vtab tbody", d.body);
          if (tb) tb.innerHTML = vars.filter(function (v) { return v.acabado === ac; }).map(filaSku).join("");
        });
      });

      var on = SEL.has(p.id);
      var ref = p.sku || (vars[0] && vars[0].sku) || "";
      d.foot.innerHTML =
        '<button class="btn btn--lg" type="button" id="dtAdd"><span>' +
          (on ? "Quitar de mi selección" : "Agregar a mi selección") + "</span>" + (on ? I.x : I.plus) + "</button>" +
        '<a class="btn btn--ghost" href="https://wa.me/' + CO.wa + "?text=" +
          encodeURIComponent("Hola ALTESA, quisiera información sobre: " + p.n + (ref ? " (" + ref + ")" : "")) +
          '" target="_blank" rel="noopener"><span>Consultar por WhatsApp</span>' + I.arw + "</a>";

      $("#dtAdd").addEventListener("click", function () { SEL.toggle(p.id); CATALOGO.detail(p.id); });
      d.open();
    }
  };

  /* ---- Categorías (home) -------------------------------------------------- */
  function mountCategorias(sel, limit) {
    var host = $(sel); if (!host || !window.ALTESA_CAT) return;
    var C = window.ALTESA_CAT;
    host.innerHTML = eager(C.categorias.slice(0, limit || 99).map(function (c, i) {
      var n = C.productos.filter(function (p) { return p.cat === c.id; }).length;
      return '<a class="cat" href="catalogo.html#' + c.id + '">' +
        '<span class="cat__img">' + imgTag(th("img/" + c.img), c.n, "img/placeholder/" + (c.ph || "control") + ".svg") + "</span>" +
        '<span class="cat__n">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<h3>" + esc(c.n) + "</h3><p>" + esc(c.desc) + "</p>" +
        '<span class="cat__count">' + n + " referencias " + I.arw + "</span>" +
        '<span class="cat__bar"></span></a>';
    }).join(""));
  }

  /* ---- Proyectos ---------------------------------------------------------- */
  var PROY = {
    drawer: null,
    init: function () {
      var host = $("#plist"); if (!host || !window.ALTESA_PROY) return;
      var self = this;
      this.drawer = Drawer("proyDrawer", "Proyecto");
      host.innerHTML = window.ALTESA_PROY.map(function (p) {
        return '<article class="prow">' +
          '<div class="prow__n">' + String(p.n).padStart(2, "0") + "</div>" +
          '<div class="prow__info"><h3><button type="button" data-p="' + p.id + '" style="text-align:left">' +
            esc(p.nombre) + "</button></h3>" +
            '<div class="prow__meta"><em>' + esc(p.tipo) + "</em><span>" + esc(p.lugar) + "</span>" +
            "<span>" + esc(p.ano) + "</span></div>" +
            '<div class="prow__sys badges">' + p.sistemas.map(function (s) {
              return '<span class="badge">' + esc(s) + "</span>"; }).join("") + "</div></div>" +
          '<button class="prow__media" type="button" data-p="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '">' +
            imgTag(th("img/proyectos/" + p.hero), p.nombre, "img/placeholder/proyecto.svg") + "</button>" +
        "</article>";
      }).join("");
      $$("[data-p]", host).forEach(function (b) {
        b.addEventListener("click", function () { self.detail(b.getAttribute("data-p")); });
      });
    },
    detail: function (id) {
      var p = window.ALTESA_PROY.filter(function (x) { return x.id === id; })[0]; if (!p) return;
      var d = this.drawer;
      d.head.textContent = "Proyecto " + String(p.n).padStart(2, "0");
      d.body.innerHTML =
        '<div class="dt">' +
          '<div class="dt__media">' + imgTag("img/proyectos/" + p.hero, p.nombre, "img/placeholder/proyecto.svg") + "</div>" +
          '<div class="prow__meta" style="margin:0 0 .3rem"><em>' + esc(p.tipo) + "</em><span>" +
            esc(p.lugar) + "</span><span>" + esc(p.ano) + "</span></div>" +
          "<h3>" + esc(p.nombre) + "</h3>" +
          '<p class="dt__desc">' + esc(p.detalle) + "</p>" +
          '<h4 class="dt__h4">Sistemas instalados</h4><div class="taglist">' +
            p.sistemas.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</div>" +
          '<h4 class="dt__h4">Galería</h4><div class="pgal" id="pgal">' +
            p.fotos.map(function (f, i) {
              return '<button type="button" data-i="' + i + '" aria-label="Ampliar foto ' + (i + 1) + '">' +
                imgTag(th("img/proyectos/" + f), p.nombre + " — foto " + (i + 1), "img/placeholder/proyecto.svg") + "</button>";
            }).join("") + "</div>" +
        "</div>";
      d.foot.innerHTML =
        '<a class="btn btn--lg" href="contacto.html"><span>Quiero algo así</span>' + I.arw + "</a>";

      var set = p.fotos.map(function (f, i) {
        return { src: "img/proyectos/" + f, cap: p.nombre + " · " + (i + 1) }; });
      $$("#pgal button").forEach(function (b) {
        b.addEventListener("click", function () { LB.open(set, +b.getAttribute("data-i")); });
      });
      d.open();
    }
  };

  /* ---- Marquesina de proyectos: dos filas en sentidos opuestos ------------- */
  function mountMarquee(sel) {
    var host = $(sel); if (!host || !window.ALTESA_PROY) return;
    var P = window.ALTESA_PROY;
    var mitad = Math.ceil(P.length / 2);
    var filas = [P.slice(0, mitad), P.slice(mitad)];

    function tarjeta(p) {
      return '<a class="mqc" href="proyectos.html#' + p.id + '" aria-label="' + esc(p.nombre) + '">' +
        imgTag(th("img/proyectos/" + p.hero), p.nombre, "img/placeholder/proyecto.svg") +
        '<span class="mqc__cap"><span>' + esc(p.tipo) + " · " + esc(p.lugar) + "</span>" +
        "<b>" + esc(p.nombre) + "</b></span></a>";
    }
    host.className = "mq";
    host.innerHTML = filas.map(function (fila, i) {
      // El contenido se duplica exacto: el bucle a -50% queda sin costura.
      var cards = fila.map(tarjeta).join("");
      return '<div class="mq__row' + (i === 1 ? " mq__row--r" : "") + '">' + cards + cards + "</div>";
    }).join("");
    $$("img", host).forEach(function (im) { im.loading = "eager"; });
  }

  /* ---- Coverflow de categorías -------------------------------------------- */
  function mountCoverflow(sel) {
    var host = $(sel); if (!host || !window.ALTESA_CAT) return;
    var C = window.ALTESA_CAT, cats = C.categorias;
    var activo = Math.floor(cats.length / 2);
    var timer = null;

    host.className = "cf";
    host.innerHTML =
      '<div class="cf__stage">' +
        cats.map(function (c, i) {
          var n = C.productos.filter(function (p) { return p.cat === c.id; }).length;
          return '<button class="cf__item" type="button" data-i="' + i + '" data-n="' + n +
                 '" aria-label="' + esc(c.n) + '">' +
                 '<span class="cf__badge">' + String(i + 1).padStart(2, "0") + "</span>" +
                 imgTag(th("img/" + c.img), c.n, "img/placeholder/" + (c.ph || "control") + ".svg") + "</button>";
        }).join("") +
      "</div>" +
      '<div class="cf__info" id="cfInfo"><h3></h3><p></p>' +
        '<div class="cf__meta"><b></b><span>referencias en esta línea</span></div></div>' +
      '<div class="cf__ctrl">' +
        '<button class="cf__arrow" type="button" data-go="-1" aria-label="Anterior">' + I.prev + "</button>" +
        '<div class="cf__dots">' + cats.map(function (_, i) {
          return '<button class="cf__dot" type="button" data-dot="' + i + '" aria-label="Ir a ' + (i + 1) + '"></button>';
        }).join("") + "</div>" +
        '<button class="cf__arrow" type="button" data-go="1" aria-label="Siguiente">' + I.next + "</button>" +
      "</div>";

    var items = $$(".cf__item", host);
    var info = $("#cfInfo", host);
    $$("img", host).forEach(function (im) { im.loading = "eager"; });

    function pintar(cambiaTexto) {
      var w = host.clientWidth;
      var sep = Math.max(120, Math.min(265, w * 0.185));
      items.forEach(function (el, i) {
        var d = i - activo, a = Math.abs(d);
        el.style.transform =
          "translate(-50%,-50%) translateX(" + (d * sep) + "px) translateZ(" + (-a * 240) + "px)" +
          " rotateY(" + (d * -34) + "deg) scale(" + (1 - a * 0.04) + ")";
        el.style.opacity = a > 3 ? 0 : 1;
        el.style.pointerEvents = a > 3 ? "none" : "auto";
        el.style.zIndex = 100 - a;
        el.classList.toggle("is-active", i === activo);
      });
      $$(".cf__dot", host).forEach(function (d, i) { d.classList.toggle("is-on", i === activo); });

      var c = cats[activo];
      var aplicar = function () {
        $("h3", info).textContent = c.n;
        $("p", info).textContent = c.desc;
        $(".cf__meta b", info).textContent = items[activo].getAttribute("data-n");
        info.classList.remove("is-swap");
      };
      if (cambiaTexto === false) { aplicar(); return; }
      info.classList.add("is-swap");
      setTimeout(aplicar, 200);
    }

    function ir(d, manual) {
      activo = (activo + d + cats.length) % cats.length;
      pintar();
      if (manual) reiniciar();
    }
    function reiniciar() {
      clearInterval(timer);
      if (!motionActivo()) return;
      timer = setInterval(function () { ir(1); }, 4200);
    }
    window.addEventListener("altesa:motion", reiniciar);

    items.forEach(function (el) {
      el.addEventListener("click", function () {
        var i = +el.getAttribute("data-i");
        if (i === activo) { location.href = "catalogo.html#" + cats[i].id; return; }
        activo = i; pintar(); reiniciar();
      });
    });
    $$("[data-go]", host).forEach(function (b) {
      b.addEventListener("click", function () { ir(+b.getAttribute("data-go"), true); });
    });
    $$("[data-dot]", host).forEach(function (b) {
      b.addEventListener("click", function () { activo = +b.getAttribute("data-dot"); pintar(); reiniciar(); });
    });
    host.addEventListener("mouseenter", function () { clearInterval(timer); });
    host.addEventListener("mouseleave", reiniciar);
    host.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") ir(-1, true);
      if (e.key === "ArrowRight") ir(1, true);
    });
    window.addEventListener("resize", function () { pintar(false); }, { passive: true });

    pintar(false);
    reiniciar();
  }

  /* ---- Mosaico destacado (home) -------------------------------------------- */
  function mountMosaico(sel, ids) {
    var host = $(sel); if (!host || !window.ALTESA_PROY) return;
    var cls = ["m-a", "m-b", "m-c", "m-d"];
    host.innerHTML = eager(ids.map(function (id, i) {
      var p = window.ALTESA_PROY.filter(function (x) { return x.id === id; })[0]; if (!p) return "";
      return '<a class="mtile ' + cls[i % 4] + '" href="proyectos.html#' + p.id + '">' +
        imgTag("img/proyectos/" + p.hero, p.nombre, "img/placeholder/proyecto.svg") +
        '<span class="mtile__cap"><span>' + esc(p.tipo) + " · " + esc(p.lugar) + "</span><b>" +
        esc(p.nombre) + "</b></span></a>";
    }).join(""));
  }

  /* ---- Arranque ------------------------------------------------------------ */
  function boot() {
    mountChrome();
    SEL.init();
    mountCategorias("#cats", 9);
    mountCoverflow("#coverflow");
    mountMarquee("#mqProyectos");
    mountMosaico("#mosaico", ["casa-lp", "legion", "cerro-mar", "ila-studio"]);
    PROY.init();
    CATALOGO.init();
    $$("[data-odo]").forEach(buildOdometer);
    accordions();
    motion();

    // Abrir proyecto si viene por hash
    var h = location.hash.replace("#", "");
    if (h && $("#plist") && window.ALTESA_PROY &&
        window.ALTESA_PROY.some(function (p) { return p.id === h; })) {
      setTimeout(function () { PROY.detail(h); }, 350);
    }

    // Formularios de demostración
    $$("form[data-demo]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = f.querySelector("[data-ok]");
        if (ok) { ok.hidden = false; ok.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
        f.reset();
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.ALTESA = { LB: LB, SEL: SEL, CO: CO, I: I };
})();
