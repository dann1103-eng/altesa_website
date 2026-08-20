/* =========================================================================
   ALTESA — guion del feed vertical (/reel.html)
   ---------------------------------------------------------------------------
   Selección curada del catálogo: 14 productos, uno o dos por sistema. La
   ficha técnica NO se repite aquí — `pid` apunta al producto real de
   data-catalogo.js y de ahí salen nombre, SKU, specs y foto. Este archivo
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
      gancho: "Siete sistemas,<br>uno por uno.",
      linea: "Catorce piezas del catálogo 2026 con el ambiente donde trabajan. " +
             "Deslice, guarde lo que le sirva y pida la cotización por WhatsApp. " +
             "Los clips son una muestra de formato armada con fotografía propia; " +
             "el video de producto está pendiente de producción.",
      ambiente: { cred: "Central de monitoreo ALTESA · Colonia Escalón" } },

    { pid: "mixpad-x-pro", clip: "centrales-panel", cat: "Centrales",
      gancho: "Una pared.<br>Todo el sistema.",
      linea: "Luz, clima, cortinas, cámaras y portero conviven en una pantalla de 12.3 pulgadas junto a la puerta.",
      chips: ["Pantalla 12.3\"", "Zigbee 3.0", "Videoportero"],
      ambiente: { proy: "portal-la-riviera", cred: "Portal la Riviera · San Salvador" } },

    { pid: "cerradura-v5-face", clip: "seguridad-chapa", cat: "Seguridad",
      gancho: "La puerta<br>reconoce la cara.",
      linea: "Rostro, huella, clave, NFC y códigos de un solo uso para el huésped que llega de noche.",
      chips: ["Rostro + huella", "Código temporal", "5000 mAh"],
      ambiente: { proy: "cabanas-ataco", cred: "Cabañas Ataco · Concepción de Ataco" } },

    { pid: "sopro-s10-tira-cob-alta-intensidad", clip: "iluminacion-tira", cat: "Iluminación",
      gancho: "Luz corrida,<br>sin puntos.",
      linea: "Tira COB de línea continua con CRI≥90: la madera se ve madera y la piel se ve piel.",
      chips: ["COB continua", "CRI ≥ 90", "Regulable"],
      ambiente: { proy: "cabanas-ataco", cred: "Cabañas Ataco · Concepción de Ataco" } },

    { pid: "spotlight-magnetico-8w", clip: "magnetico-spot", cat: "Magnético",
      gancho: "Se orienta<br>con la mano.",
      linea: "Acento dirigido de 8W sobre riel de 48V. Se gira, se desliza y se cambia de sitio sin herramienta.",
      chips: ["8W dirigible", "Riel 48V", "Sin herramienta"],
      ambiente: { proy: "ila-studio", cred: "ILA Studio · San Benito" } },

    { pid: "motor-de-cortina-db28", clip: "cortinas-motor", cat: "Cortinas",
      gancho: "Se abren solas<br>con el amanecer.",
      linea: "Segunda generación del motor DB28: marcha silenciosa sobre riel cortado a la medida del vano.",
      chips: ["Ultra silencioso", "Riel a medida", "Zigbee"],
      ambiente: { proy: "cortinas-tuz", cred: "Cortinas TUZ · Colonia Escalón" } },

    { pid: "sensor-de-presencia-mixsense", clip: "seguridad-presencia", cat: "Seguridad",
      gancho: "Detecta<br>a quien está quieto.",
      linea: "Radar milimétrico más infrarrojo: la sala sigue encendida mientras alguien continúe sentado adentro.",
      chips: ["Radar mmWave", "Ángulo 70°", "Empotrado ø70"],
      ambiente: { proy: "compassion", cred: "Compassion · San Salvador" } },

    { pid: "halo-plafon-de-diseno", clip: "iluminacion-plafon", cat: "Iluminación",
      gancho: "Un anillo de luz<br>con filo dorado.",
      linea: "Plafón de diseño para comedores y recibidores donde la luminaria se mira tanto como ilumina.",
      chips: ["Plafón de diseño", "Detalle dorado", "Luz difusa"],
      ambiente: { proy: "ila-studio", cred: "ILA Studio · San Benito" } },

    { pid: "defy-smart-panel", clip: "interruptores-defy", cat: "Interruptores",
      gancho: "El gateway va<br>dentro del interruptor.",
      linea: "Pantalla de 2.41 pulgadas, tres circuitos y la red Zigbee de la casa naciendo en ese mismo punto de la pared.",
      chips: ["Gateway Zigbee", "3 circuitos", "Gris o naranja"],
      ambiente: { proy: "palmira", cred: "Palmira · San Salvador" } },

    { pid: "camara-exterior-s3-4mp", clip: "seguridad-camara", cat: "Seguridad",
      gancho: "4 megapíxeles<br>en el perímetro.",
      linea: "Lente F1.6 para leer la noche, sello IP66 para el invierno y PoE para dejar un solo cable.",
      chips: ["4MP · 2560×1440", "F1.6 nocturna", "IP66 · PoE"],
      ambiente: { proy: "la-florida", cred: "La Florida · La Libertad" } },

    { pid: "riel-magnetico-2-m", clip: "magnetico-riel", cat: "Magnético",
      gancho: "Dos metros<br>de infraestructura.",
      linea: "Empotrado o superficial. Encima entra cualquier módulo del sistema y la sala se reconfigura en minutos.",
      chips: ["2000 mm", "Empotrable", "Todos los módulos"],
      ambiente: { proy: "ila-studio", cred: "ILA Studio · San Benito" } },

    { pid: "mixswitch-bach", clip: "interruptores-bach", cat: "Interruptores",
      gancho: "Ocho teclas,<br>ocho decisiones.",
      linea: "Cada tecla llama una escena o un circuito. El frente sale y entra: el acabado cambia con la instalación puesta.",
      chips: ["8 teclas", "800W por circuito", "Frente intercambiable"],
      ambiente: { proy: "casa-lp", cred: "Casa LP · San Salvador" } },

    { pid: "bm2-audio-de-techo-hi-fi", clip: "audio-techo", cat: "Audio",
      gancho: "El techo<br>suena.",
      linea: "Par maestro y esclavo empotrados a ras del cielo falso: 185 mm de corte y ningún equipo a la vista.",
      chips: ["Hi-Fi ø200 mm", "Corte 185 mm", "Maestro + esclavo"],
      ambiente: { proy: "legion", cred: "Legión · San Salvador" } },

    { pid: "mixpad-4-ai-matter", clip: "centrales-ai", cat: "Centrales",
      gancho: "Del tamaño<br>de un interruptor.",
      linea: "Cabe en la caja de un apagador y gobierna hasta 256 dispositivos. Con Matter suma también marcas ajenas.",
      chips: ["Pantalla 4\"", "256 dispositivos", "Matter"],
      ambiente: { proy: "casa-lp", cred: "Casa LP · San Salvador" } },

    { pid: "cortina-de-luz-3d-2a-gen", clip: "cortinas-luz3d", cat: "Cortinas",
      gancho: "50 kilos de cortina,<br>60 vueltas por minuto.",
      linea: "Motor rotativo para cortinas de efecto lumínico en vestíbulos y fachadas interiores.",
      chips: ["Carga 50 kg", "60 r/min", "Torque 1.2 N·m"],
      ambiente: { proy: "cortinas-tuz", cred: "Cortinas TUZ · Colonia Escalón" } },

    { tipo: "cierre", clip: "cierre",
      gancho: "¿Ya tiene<br>su lista?",
      linea: "Envíela por WhatsApp con un toque y el equipo responde con precios, tiempos y visita técnica.",
      ambiente: { cred: "Showroom ALTESA · Colonia Escalón" } }

  ]
};
