/* =========================================================================
   ALTESA — guion del feed vertical (/reel.html)
   ---------------------------------------------------------------------------
   Selección curada del catálogo: 14 productos, al menos uno por categoría.
   La ficha técnica NO se repite aquí — `pid` apunta al producto real de
   data-catalogo.js y de ahí salen nombre, SKU, categoría, specs y foto. Este archivo
   guarda solo lo propio del feed: el clip, el gancho y el ambiente.

   Campos por diapositiva de producto
     pid       id del producto en window.ALTESA_CAT.productos
     clip      nombre del .mp4 en /video/reel/ (y del póster en /img/reel/)
     gancho    titular corto, lo primero que se lee
     linea     una frase de apoyo
     chips     3 datos duros; si se omite, se toman las specs del catálogo
     ambiente  proyecto de donde salen las fotos del clip — se acredita en
               pantalla para que nadie lea el clip como "este SKU va aquí"

   Para reemplazar un clip por video real del cliente: dejar el .mp4 en
   public/video/reel/<clip>.mp4 con el mismo nombre. Nada más cambia.
   ========================================================================= */

window.ALTESA_REEL = {

  aviso: "Muestra de formato · clips armados con fotografía propia de ALTESA",

  slides: [

    { tipo: "intro", clip: "intro",
      gancho: "Once sistemas,<br>uno por uno.",
      linea: "Catorce piezas del catálogo 2026 con el ambiente donde trabajan. " +
             "Deslice, guarde lo que le sirva y pida la cotización por WhatsApp. " +
             "Los clips son una muestra de formato armada con fotografía propia; " +
             "el video de producto está pendiente de producción.",
      ambiente: { cred: "Central de monitoreo ALTESA · Colonia Escalón" } },

    { pid: "mixpad-x-pro", clip: "centrales-panel",
      gancho: "Una pared.<br>Todo el sistema.",
      linea: "Luz, clima, cortinas, cámaras y portero conviven en una pantalla de 12.3 pulgadas junto a la puerta.",
      chips: ["Pantalla 12.3\"", "Zigbee 3.0", "Videoportero"],
      ambiente: { proy: "portal-la-riviera", cred: "Portal la Riviera · San Salvador" } },

    { pid: "cerradura-v5-face", clip: "seguridad-chapa",
      gancho: "La puerta<br>reconoce la cara.",
      linea: "Rostro, huella, clave, NFC y códigos de un solo uso para el huésped que llega de noche.",
      chips: ["Rostro + huella", "Código temporal", "5000 mAh"],
      ambiente: { proy: "cabanas-ataco", cred: "Cabañas Ataco · Concepción de Ataco" } },

    { pid: "sopro-s10-tira-cob-alta-intensidad", clip: "iluminacion-tira",
      gancho: "Luz corrida,<br>sin puntos.",
      linea: "Tira COB de línea continua con CRI≥90: la madera se ve madera y la piel se ve piel.",
      chips: ["COB continua", "CRI ≥ 90", "Regulable"],
      ambiente: { proy: "cabanas-ataco", cred: "Cabañas Ataco · Concepción de Ataco" } },

    { pid: "spotlight-magnetico", clip: "magnetico-spot",
      gancho: "Se orienta<br>con la mano.",
      linea: "Acento dirigido de 15W u 8W sobre riel de 48V. Se gira, se desliza y se cambia de sitio sin herramienta.",
      chips: ["15W u 8W", "Riel 48V", "Sin herramienta"],
      ambiente: { proy: "ila-studio", cred: "ILA Studio · San Benito" } },

    { pid: "kit-genie-cortina-3-m-4-m", clip: "cortinas-motor",
      gancho: "Se abren solas<br>con el amanecer.",
      linea: "Kit completo con motor Wi-Fi y riel extensible hasta 4 metros, para cortinas de hasta 40 kg y con instalación simplificada.",
      chips: ["Riel hasta 4 m", "Carga 40 kg", "Wi-Fi"],
      ambiente: { proy: "cortinas-tuz", cred: "Cortinas TUZ · Colonia Escalón" } },

    { pid: "sensor-de-presencia-mixsense", clip: "seguridad-presencia",
      gancho: "Detecta<br>a quien está quieto.",
      linea: "Radar milimétrico más infrarrojo: la sala sigue encendida mientras alguien continúe sentado adentro.",
      chips: ["Radar mmWave", "Ángulo 70°", "Empotrado ø70"],
      ambiente: { proy: "compassion", cred: "Compassion · San Salvador" } },

    { pid: "halo-plafon-de-diseno", clip: "iluminacion-plafon",
      gancho: "Un anillo de luz<br>con filo dorado.",
      linea: "Plafón de diseño para comedores y recibidores donde la luminaria se mira tanto como ilumina.",
      chips: ["Plafón de diseño", "Detalle dorado", "Luz difusa"],
      ambiente: { proy: "ila-studio", cred: "ILA Studio · San Benito" } },

    { pid: "defy-smart-panel", clip: "interruptores-defy",
      gancho: "El gateway va<br>dentro del interruptor.",
      linea: "Pantalla de 2.41 pulgadas, tres circuitos y la red Zigbee de la casa naciendo en ese mismo punto de la pared.",
      chips: ["Gateway Zigbee", "3 circuitos", "Gris o naranja"],
      ambiente: { proy: "palmira", cred: "Palmira · San Salvador" } },

    { pid: "camara-exterior-s3-4mp", clip: "seguridad-camara",
      gancho: "4 megapíxeles<br>en el perímetro.",
      linea: "Lente F1.6 para leer la noche, sello IP66 para el invierno y PoE para dejar un solo cable.",
      chips: ["4MP · 2560×1440", "F1.6 nocturna", "IP66 · PoE"],
      ambiente: { proy: "la-florida", cred: "La Florida · La Libertad" } },

    { pid: "riel-magnetico-2-m", clip: "magnetico-riel",
      gancho: "Dos metros<br>de infraestructura.",
      linea: "Empotrado o superficial. Encima entra cualquier módulo del sistema y la sala se reconfigura en minutos.",
      chips: ["2000 mm", "Empotrable", "Todos los módulos"],
      ambiente: { proy: "ila-studio", cred: "ILA Studio · San Benito" } },

    { pid: "mixswitch-bach", clip: "interruptores-bach",
      gancho: "Ocho teclas,<br>ocho decisiones.",
      linea: "Cada tecla llama una escena o un circuito. El frente sale y entra: el acabado cambia con la instalación puesta.",
      chips: ["8 teclas", "800W por circuito", "Frente intercambiable"],
      ambiente: { proy: "casa-lp", cred: "Casa LP · San Salvador" } },

    { pid: "bm2-audio-de-techo-hi-fi", clip: "audio-techo",
      gancho: "El techo<br>suena.",
      linea: "Par maestro y esclavo empotrados a ras del cielo falso: 185 mm de corte y ningún equipo a la vista.",
      chips: ["Hi-Fi ø200 mm", "Corte 185 mm", "Maestro + esclavo"],
      ambiente: { proy: "legion", cred: "Legión · San Salvador" } },

    { pid: "mixpad-m5", clip: "centrales-ai",
      gancho: "Alexa, dentro<br>de la pared.",
      linea: "Panel de voz con Alexa integrada, dimming táctil y cuatro circuitos: la casa responde a la voz sin un parlante aparte.",
      chips: ["Alexa integrada", "4 circuitos", "Wi-Fi · Zigbee"],
      ambiente: { proy: "casa-lp", cred: "Casa LP · San Salvador" } },

    { pid: "magic-dot-control-ir-universal", clip: "clima",
      gancho: "Su aire acondicionado,<br>ahora inteligente.",
      linea: "Magic Dot aprende los códigos del control remoto y suma al sistema el equipo que ya está instalado: aire, TV o proyector, sin cambiar nada.",
      chips: ["Aprendizaje IR", "A/A, TV, proyector", "Wi-Fi"],
      ambiente: { proy: "cabanas-ataco", cred: "Cabañas Ataco · Concepción de Ataco" } },

    { tipo: "cierre", clip: "cierre",
      gancho: "¿Ya tiene<br>su lista?",
      linea: "Envíela por WhatsApp con un toque y el equipo responde con precios, tiempos y visita técnica.",
      ambiente: { cred: "Showroom ALTESA · Colonia Escalón" } }

  ]
};
