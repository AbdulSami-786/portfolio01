"""
Import the print / brand design work from "Portfolio (1)" into the site.

  python scripts/import-designs.py

For every design it picks ONE clean image (no studio-logo header), resizes it
and writes two WebP files into public/media/design/<slug>/:

    NN.webp      full size (max 1600px wide) - lightbox
    NN-sm.webp   small (720px wide)          - grid thumbnail

It also writes src/data/designs.json (paths + sizes). Titles and descriptions
live in src/data/site.js, so re-running this never overwrites your text.

To use the versions that carry the studio logo header instead, set USE_LOGO_VERSION.
"""
import json
import os
import re
import shutil

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "Portfolio (1)")
OUT = os.path.join(ROOT, "public", "media", "design")
MANIFEST = os.path.join(ROOT, "src", "data", "designs.json")

USE_LOGO_VERSION = False
FULL_W, THUMB_W = 1600, 720


def files(folder, pattern, exclude=None):
    """Files in SRC/folder whose name matches `pattern`, in natural order."""
    d = os.path.join(SRC, folder)
    out = [f for f in os.listdir(d) if re.fullmatch(pattern, f, re.I) and os.path.isfile(os.path.join(d, f))]
    if exclude:
        out = [f for f in out if not re.fullmatch(exclude, f, re.I)]
    key = lambda s: [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]
    return [os.path.join(folder, f) for f in sorted(out, key=key)]


# slug -> source files (one per design). Left out on purpose: the "-logo" copies,
# duplicate backdrops, zips, mock-up sheets and the folders that need your OK
# (branding, Presentation, Brochure 10-14, stock-looking Menu files).
SETS = {
    "banners": files("Banners/Banners", r"\d+\.png"),
    "trade-show-booths": files("Booth/booth", r"\d+b\.png"),
    "brochures": files("Brochure/Brochure", r"0\d\.png"),
    "business-cards": files("Business Card/business card", r"(01|02)[a-f]?\.png", exclude=r"01g\.png")
    + files("Business Card", r"02g\.png"),
    "flyers": files("Flyer/FLYER", r"Design \d+\.png"),
    "infographics": files("Infographic/infographics", r"\d+b\.png"),
    "labels": files("Label/Label", r"\d+B\.png"),
    "letterheads": files("Letterhead/LH", r"\d+\.png"),
    "logo-design": files("Logo/logo", r"\d+\.png"),
    "menu-design": [
        os.path.join("Menu Design", f)
        for f in [
            "01b.png",
            "22c73705-53e3-4db6-9424-5b80090ab898.png",
            "25cdd1af-98e8-4577-b05b-cba9b52c8de1.png",
            "4e16aa23-f055-479f-b0fe-653521ba2f60.png",
            "5cccd9cc-48b7-421d-8f76-fd8f14efa5ef.png",
            "64264ff3-93aa-4925-b660-c815650a3de5.png",
            "77b3fcff-4f12-460f-ad46-5c904a81b88b.png",
            "8f6d07c9-19c7-489f-a2c5-40e1bb7ab677.png",
            "fdfd.png",
        ]
    ],
    "packaging": files("Packaging/Packaging", r"\d+\.png"),
    "posters": files("poster/Poster", r"\d+\.png"),
    "signage": files("Signage/Signage", r"\d+\.png", exclude=r"01s\.png") + files("Signage", r"06\.png"),
    "social-media": files("Social Media", r"\d+\.png"),
    "standees": files("Standee/Standee", r"\d+\.png"),
}


def natural(p):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", os.path.basename(p))]


def save(im, path, width):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(path, "WEBP", quality=82, method=6)
    return im.size


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    manifest = {}
    total = 0
    for slug, paths in SETS.items():
        # signage: the extra 06.png lives one level up, so re-sort by design number
        paths = sorted(paths, key=lambda p: natural(re.sub(r"^0*", "", os.path.basename(p))))
        d = os.path.join(OUT, slug)
        os.makedirs(d)
        items = []
        for i, rel in enumerate(paths, 1):
            src = os.path.join(SRC, rel)
            if USE_LOGO_VERSION:
                stem, ext = os.path.splitext(src)
                for cand in (stem + "-logo" + ext, stem + "LOGO" + ext, stem + "logo" + ext, stem + "-LOGO" + ext):
                    if os.path.exists(cand):
                        src = cand
                        break
            n = f"{i:02d}"
            im = Image.open(src).convert("RGB")
            w, h = save(im, os.path.join(d, f"{n}.webp"), FULL_W)
            save(im, os.path.join(d, f"{n}-sm.webp"), THUMB_W)
            items.append(
                {
                    "src": f"/media/design/{slug}/{n}.webp",
                    "thumb": f"/media/design/{slug}/{n}-sm.webp",
                    "w": w,
                    "h": h,
                    "from": rel.replace("\\", "/"),
                }
            )
        manifest[slug] = items
        total += len(items)
        print(f"{slug:20s} {len(items):3d}")
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1)
    mb = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(OUT) for f in fs) / 1e6
    print(f"\n{total} designs, {mb:.1f} MB written to public/media/design")


main()
