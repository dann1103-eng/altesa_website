# -*- coding: utf-8 -*-
"""
ALTESA — clips verticales para /reel.html
===========================================================================
Arma los videos 9:16 del feed a partir de las FOTOS PROPIAS de ALTESA
(proyectos, galería, hero). Sin material de archivo ajeno, sin licencias
de terceros: se reencuadran las fotos del dossier a formato vertical y se
les da movimiento lento tipo Ken Burns.

Cada clip = 3 tramos A -> B -> A encadenados con disolvencia. El tercer
tramo termina exactamente en el encuadre inicial, así el `loop` del <video>
no da un salto visible.

Salidas
    public/video/reel/<slug>.mp4    720x1280, H.264, sin audio, ~10 s
    public/img/reel/<slug>.jpg      póster 540x960 (primer fotograma)

Cuando lleguen videos reales del cliente, se sustituye el .mp4 con el mismo
nombre y el sitio no necesita ningún otro cambio.

Uso
    python tools/reel_media.py            # solo los que faltan
    python tools/reel_media.py --force    # rehace todo
===========================================================================
"""
import os, sys, subprocess, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB  = os.path.join(ROOT, "public")
IMG  = os.path.join(PUB, "img")
WORK = os.path.join(ROOT, "tools", "_work", "reel")
OUTV = os.path.join(PUB, "video", "reel")
OUTP = os.path.join(IMG, "reel")

from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

# ---- Lienzo y tiempos ---------------------------------------------------
CW, CH   = 1080, 1920      # composición en alta; el video sale a 720x1280
VW, VH   = 720, 1280
FPS      = 24
SEG      = 4.2             # segundos por tramo
FADE     = 0.9             # disolvencia entre tramos
CRF      = 30

# ---- Guion de los clips -------------------------------------------------
# slug: (foto A, foto B)  — rutas relativas a public/img/
CLIPS = {
    "centrales-panel":   ("proyectos/portal-la-riviera-03.jpg", "proyectos/compassion-02.jpg"),
    "centrales-ai":      ("proyectos/casa-lp-02.jpg",           "proyectos/legion-02.jpg"),
    "interruptores-defy":("proyectos/palmira-03.jpg",           "proyectos/compassion-04.jpg"),
    "interruptores-bach":("proyectos/casa-lp-03.jpg",           "proyectos/portal-la-riviera-04.jpg"),
    "iluminacion-plafon":("proyectos/ila-studio-05.jpg",        "proyectos/ila-studio-08.jpg"),
    "iluminacion-tira":  ("proyectos/cabanas-ataco-06.jpg",     "proyectos/cabanas-ataco-01.jpg"),
    "magnetico-spot":    ("proyectos/ila-studio-07.jpg",        "proyectos/ila-studio-06.jpg"),
    "magnetico-riel":    ("proyectos/ila-studio-01.jpg",        "proyectos/ila-studio-02.jpg"),
    "seguridad-chapa":   ("proyectos/cabanas-ataco-05.jpg",     "hero/hero-op1-chapa-ataco.jpg"),
    "seguridad-camara":  ("proyectos/la-florida-01.jpg",        "proyectos/la-florida-03.jpg"),
    "seguridad-presencia":("proyectos/compassion-04.jpg",       "proyectos/compassion-02.jpg"),
    "cortinas-motor":    ("proyectos/cortinas-tuz-01.jpg",      "proyectos/cortinas-tuz-02.jpg"),
    "cortinas-luz3d":    ("proyectos/cortinas-tuz-03.jpg",      "proyectos/cortinas-tuz-04.jpg"),
    "audio-techo":       ("proyectos/legion-03.jpg",            "proyectos/legion-04.jpg"),
    "intro":             ("galeria/puerta-del-alma.jpg",        "galeria/showroom-exhibidor.jpg"),
    "cierre":            ("galeria/equipo-showroom.jpg",        "galeria/showroom-exhibidor.jpg"),
}


def ffmpeg():
    exe = shutil.which("ffmpeg")
    if not exe:
        sys.exit("Falta ffmpeg en el PATH. Instalar con: winget install Gyan.FFmpeg")
    return exe


def composicion(ruta, destino):
    """Reencuadra una foto a 9:16: relleno desenfocado detrás, foto nítida
    encima. Conserva el encuadre del fotógrafo en lugar de recortarlo."""
    im = Image.open(ruta).convert("RGB")

    # Las fotos del dossier son 16:9 o 5:4. En un lienzo vertical quedarían
    # como una franja diminuta, así que a las apaisadas se les recorta el
    # centro a 3:4 antes de componer. Con eso la foto nítida ocupa ~73% del
    # alto del clip: en móvil, donde el video va a sangre, las bandas
    # desenfocadas quedan reducidas a un borde y no a media pantalla.
    if im.width / im.height > 0.75:
        nw = int(im.height * 0.75)
        off = (im.width - nw) // 2
        im = im.crop((off, 0, off + nw, im.height))
    w, h = im.size

    # Fondo: la misma foto cubriendo el lienzo, desenfocada y apagada
    esc = max(CW / w, CH / h) * 1.12
    bg = im.resize((int(w * esc), int(h * esc)), Image.LANCZOS)
    bg = bg.crop(((bg.width - CW) // 2, (bg.height - CH) // 2,
                  (bg.width - CW) // 2 + CW, (bg.height - CH) // 2 + CH))
    bg = bg.filter(ImageFilter.GaussianBlur(38))
    bg = ImageEnhance.Brightness(bg).enhance(0.72)
    bg = ImageEnhance.Color(bg).enhance(0.72)

    # Frente: la foto completa, ancho casi total del lienzo
    fw = int(CW * 0.97)
    fh = int(h * fw / w)
    if fh > CH * 0.92:                       # verticales: limitar por alto
        fh = int(CH * 0.92); fw = int(w * fh / h)
    fg = im.resize((fw, fh), Image.LANCZOS)
    fx, fy = (CW - fw) // 2, (CH - fh) // 2

    # Sombra suave bajo la foto para despegarla del fondo
    sombra = Image.new("L", (CW, CH), 0)
    ImageDraw.Draw(sombra).rectangle([fx + 14, fy + 22, fx + fw - 14, fy + fh + 10], fill=150)
    sombra = sombra.filter(ImageFilter.GaussianBlur(34))
    bg = Image.composite(Image.new("RGB", (CW, CH), (8, 8, 12)), bg, sombra)

    bg.paste(fg, (fx, fy))

    # Viñeta: concentra la mirada al centro y deja respirar los textos
    vin = Image.new("L", (CW, CH), 0)
    d = ImageDraw.Draw(vin)
    d.rectangle([0, 0, CW, CH], fill=92)
    d.ellipse([-CW * 0.35, CH * 0.06, CW * 1.35, CH * 0.94], fill=0)
    vin = vin.filter(ImageFilter.GaussianBlur(190))
    bg = Image.composite(Image.new("RGB", (CW, CH), (6, 6, 9)), bg, vin)

    bg.save(destino, "JPEG", quality=93, optimize=True)
    return destino


def tramo(idx, z0, z1, px, py):
    """Filtro de un tramo: zoom lineal de z0 a z1 con deriva lateral."""
    n = int(SEG * FPS)
    z = "%.5f+(%.5f)*on/%d" % (z0, z1 - z0, n)
    return (
        "[{i}:v]scale={W}:{H},"
        "zoompan=z='{z}':d=1:x='iw/2-(iw/zoom/2)+({px})*on/{n}':"
        "y='ih/2-(ih/zoom/2)+({py})*on/{n}':s={W}x{H}:fps={fps},"
        "setsar=1[v{i}];"
    ).format(i=idx, W=VW, H=VH, z=z, px=px, py=py, n=n, fps=FPS)


def construir(slug, fa, fb, force=False):
    dest = os.path.join(OUTV, slug + ".mp4")
    post = os.path.join(OUTP, slug + ".jpg")
    if os.path.exists(dest) and os.path.exists(post) and not force:
        print("  = %-22s ya existe" % slug); return

    ca = composicion(os.path.join(IMG, fa), os.path.join(WORK, slug + "-a.jpg"))
    cb = composicion(os.path.join(IMG, fb), os.path.join(WORK, slug + "-b.jpg"))

    # A (acerca) -> B (aleja) -> A (aleja hasta el encuadre inicial)
    fc = (tramo(0, 1.00, 1.13,  26, -18) +
          tramo(1, 1.13, 1.00, -24,  16) +
          tramo(2, 1.13, 1.00, -26,  18) +
          "[v0][v1]xfade=transition=fade:duration={f}:offset={o1}[x1];"
          "[x1][v2]xfade=transition=fade:duration={f}:offset={o2}[vo]"
          ).format(f=FADE, o1=SEG - FADE, o2=2 * SEG - 2 * FADE)

    cmd = [ffmpeg(), "-y", "-loglevel", "error",
           "-framerate", str(FPS), "-loop", "1", "-t", str(SEG), "-i", ca,
           "-framerate", str(FPS), "-loop", "1", "-t", str(SEG), "-i", cb,
           "-framerate", str(FPS), "-loop", "1", "-t", str(SEG), "-i", ca,
           "-filter_complex", fc, "-map", "[vo]",
           "-c:v", "libx264", "-preset", "slow", "-crf", str(CRF),
           "-pix_fmt", "yuv420p", "-profile:v", "main", "-level", "3.1",
           "-g", str(FPS * 2), "-movflags", "+faststart", "-an", dest]
    subprocess.run(cmd, check=True)

    # Póster = primer fotograma, mismo encuadre con el que arranca el video
    Image.open(ca).resize((540, 960), Image.LANCZOS).save(post, "JPEG", quality=78, optimize=True)
    print("  + %-22s %5d KB" % (slug, os.path.getsize(dest) // 1024))


def main():
    force = "--force" in sys.argv
    for d in (WORK, OUTV, OUTP):
        os.makedirs(d, exist_ok=True)
    print("Clips del reel ->", OUTV)
    for slug, (fa, fb) in CLIPS.items():
        for f in (fa, fb):
            if not os.path.exists(os.path.join(IMG, f)):
                sys.exit("Falta la foto: img/" + f)
        construir(slug, fa, fb, force)
    total = sum(os.path.getsize(os.path.join(OUTV, f)) for f in os.listdir(OUTV))
    print("Total video: %.1f MB en %d clips" % (total / 1048576, len(CLIPS)))


if __name__ == "__main__":
    main()
