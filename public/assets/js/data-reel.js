/* =========================================================================
   ALTESA — guion de la vitrina vertical (/reel.html)
   ---------------------------------------------------------------------------
   Una pantalla por sección del catálogo, en el mismo orden que catalogo.html.
   Las secciones NO se enumeran aquí: salen de data-catalogo.js, así que una
   categoría nueva aparece sola en la vitrina, con su foto de portada. Este
   archivo solo pone el guion de cada una.

   Campos por sección (todos opcionales)
     clip      nombre del .mp4 en /video/reel/ (y del póster en /img/reel/).
               Sin clip se muestra la foto de portada de la categoría.
     gancho    titular corto; sin él se usa el nombre de la categoría
     linea     una frase de apoyo; sin ella, la descripción de la categoría
     chips     dos o tres datos duros
     ambiente  { proy: id } de data-proyectos.js: el proyecto de donde salen
               las fotos del clip. Nombre y lugar se leen de ahí.

   En la portada, {N} y {n} se reemplazan por el número de secciones en
   palabras («Once» y «once»).

   Para usar video real del cliente: dejar el .mp4 en public/video/reel/ con
   el nombre de la sección (cortinas.mp4, tiras.mp4…). Nada más cambia.
   ========================================================================= */

window.ALTESA_REEL = {

  aviso: "Muestra de formato · clips armados con fotografía propia de ALTESA",

  intro: {
    clip: "intro",
    gancho: "{N} sistemas,<br>uno por uno.",
    linea: "Las {n} secciones del catálogo 2026, cada una con el ambiente donde trabaja. " +
           "Abra el catálogo de la que le interese, guarde lo que le sirva y pida la " +
           "cotización por WhatsApp. Los clips son una muestra de formato armada con " +
           "fotografía propia; el video de producto está pendiente de producción."
  },

  secciones: {

    centrales: { clip: "centrales",
      gancho: "Una pared.<br>Todo el sistema.",
      linea: "Paneles táctiles que reúnen luz, escenas, portero y voz en un solo punto de la pared: del MixPad X Pro de 12.3 pulgadas al M5 con Alexa integrada.",
      chips: ["Hasta 12.3\"", "Zigbee · Matter", "Alexa"],
      ambiente: { proy: "portal-la-riviera" } },

    interruptores: { clip: "interruptores",
      gancho: "La pared también<br>se diseña.",
      linea: "Cinco series —Defy, Bach, MixSwitch, Gauss y Touch Pro— en gris, blanco, dorado y negro, con escenas y control por voz.",
      chips: ["5 series", "4 acabados"],
      ambiente: { proy: "casa-lp" } },

    iluminacion: { clip: "iluminacion",
      gancho: "Luz de calidad<br>arquitectónica.",
      linea: "Spotlights antideslumbrantes, downlights y plafones de diseño, con intensidad y temperatura de color desde la app, los paneles o la voz.",
      chips: ["Antideslumbrante", "Temperatura regulable"],
      ambiente: { proy: "ila-studio" } },

    tiras: { clip: "tiras",
      gancho: "Luz corrida,<br>sin puntos.",
      linea: "Tiras COB de alto CRI, kits RGB y bicolor para cielos falsos, muebles y nichos, con controladores a la medida del proyecto.",
      chips: ["CRI ≥ 90", "RGB y bicolor"],
      ambiente: { proy: "legion" } },

    magnetico: { clip: "magnetico",
      gancho: "Se orienta<br>con la mano.",
      linea: "Proyectores, lineales y spotlights sobre riel de 48V: se colocan, deslizan y reconfiguran sin herramientas, empotrados o suspendidos.",
      chips: ["Riel 48V", "Sin herramientas"],
      ambiente: { proy: "cerro-mar" } },

    chapas: { clip: "chapas",
      gancho: "La puerta<br>reconoce la cara.",
      linea: "Acceso sin llaves con huella, clave, NFC y códigos de un solo uso para el huésped que llega de noche. La V5 Face suma rostro y videoportero.",
      chips: ["Huella · rostro", "Código temporal"],
      ambiente: { proy: "cabanas-ataco" } },

    sensores: { clip: "sensores",
      gancho: "Presencia, humo,<br>gas y agua.",
      linea: "Radar de presencia, movimiento, puertas y ventanas, humo, gas, fugas de agua, temperatura y un botón de emergencia: cada aviso puede disparar una automatización.",
      chips: ["Zigbee", "Radar mmWave"],
      ambiente: { proy: "compassion" } },

    camaras: { clip: "camaras",
      gancho: "4 megapíxeles<br>en el perímetro.",
      linea: "Cámara exterior de 4 MP con sello IP66 y PoE, e interior motorizada de 2K con giro de 350° y audio de dos vías.",
      chips: ["4MP · IP66", "2K · 350°"],
      ambiente: { proy: "la-florida" } },

    cortinas: { clip: "cortinas",
      gancho: "Se abren solas<br>con el amanecer.",
      linea: "Kit Genie con riel extensible hasta 4 metros y motor tubular para enrollables y screen, sincronizados con la luz del día.",
      chips: ["Riel hasta 4 m", "Enrollables y screen"],
      ambiente: { proy: "cortinas-tuz" } },

    audio: { clip: "audio",
      gancho: "El techo<br>suena.",
      linea: "Parlantes Hi-Fi empotrados a ras del cielo falso, con pares esclavos para llevar la música a cada zona.",
      chips: ["Hi-Fi ø200 mm", "Por zonas"],
      ambiente: { proy: "portales-del-bosque" } },

    clima: { clip: "clima",
      gancho: "Su aire acondicionado,<br>ahora inteligente.",
      linea: "Magic Dot aprende los códigos del control remoto y suma al sistema el equipo que ya está instalado: aire, TV o proyector, sin cambiar nada.",
      chips: ["Aprendizaje IR", "Wi-Fi"],
      ambiente: { proy: "cabanas-ataco" } }

  },

  cierre: {
    clip: "cierre",
    gancho: "¿Ya tiene<br>su lista?",
    linea: "Envíela por WhatsApp con un toque y el equipo responde con precios, tiempos y visita técnica."
  }
};
