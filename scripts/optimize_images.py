"""Generate web-optimized derivatives of the project's original photos.

Usage:  python3 scripts/optimize_images.py
Requires Pillow. Originals live in assets/originals/ (never modified);
derivatives are written to public/images/ as WebP + JPEG fallback.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "originals"
OUT = ROOT / "public" / "images"

# original filename -> semantic name used by the app
MAP = {
    "pexels-sahilcaptures-35645519.jpg": "nursing-training",
    "pexels-stephentcandrews-9408869.jpg": "patient-monitor",
    "pexels-tara-winstead-7722912.jpg": "anatomy-models-wide",
    "pexels-tara-winstead-7722916.jpg": "anatomy-models-tall",
    "pexels-tima-miroshnichenko-5407237.jpg": "stethoscope-notebook",
}
WIDTHS = [640, 1280, 1920]

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src_name, name in MAP.items():
        im = ImageOps.exif_transpose(Image.open(SRC / src_name)).convert("RGB")
        for w in WIDTHS:
            if w > im.width:
                continue
            h = round(im.height * w / im.width)
            r = im.resize((w, h), Image.LANCZOS)
            r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=78, method=6)
            if w == 1280:
                r.save(OUT / f"{name}-{w}.jpg", "JPEG", quality=80, optimize=True, progressive=True)
        print("ok", name, im.size)

if __name__ == "__main__":
    main()
