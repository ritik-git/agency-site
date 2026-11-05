"""Image pipeline: renders/*.png → static/img responsive AVIF + WebP variants,
plus founder placeholder, Open Graph image and favicon set.

usage: python3 scripts/images.py
Real photography/case-study media: drop a PNG/JPG into renders/ under the same
name (e.g. project-alpha.png) and re-run; crops are taken from the centre.
"""
import os, json
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "renders")
OUT = os.path.join(ROOT, "static", "img")
ICONS = os.path.join(ROOT, "static", "icons")
FONTS = "/usr/share/fonts/opentype/inter"
os.makedirs(OUT, exist_ok=True)
os.makedirs(ICONS, exist_ok=True)

manifest = {}


def crop_ratio(im, rw, rh, focus=(0.5, 0.5)):
    w, h = im.size
    target = rw / rh
    if w / h > target:
        nw = int(h * target)
        x = int((w - nw) * focus[0])
        return im.crop((x, 0, x + nw, h))
    nh = int(w / target)
    y = int((h - nh) * focus[1])
    return im.crop((0, y, w, y + nh))


def export(im, name, widths, quality=72):
    im = im.convert("RGB")
    out = []
    for w in widths:
        if w > im.width:
            continue
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=quality, method=6)
        r.save(os.path.join(OUT, f"{name}-{w}.avif"), "AVIF", quality=quality - 14, speed=6)
        out.append(w)
    manifest[name] = {"widths": out, "w": im.width, "h": im.height}


def founder_placeholder(w=1600, h=2000):
    """Neutral B&W studio silhouette — an honest stand-in, not a fake person."""
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    bg = 0.10 + 0.16 * np.exp(-(((xx - w * 0.62) / (w * 0.55)) ** 2 + ((yy - h * 0.3) / (h * 0.5)) ** 2))
    img = Image.fromarray((np.clip(bg, 0, 1) * 255).astype(np.uint8)).convert("L")
    sil = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(sil)
    cx = w * 0.5
    d.ellipse((cx - w * 0.17, h * 0.2, cx + w * 0.17, h * 0.2 + w * 0.42), fill=255)  # head
    d.rectangle((cx - w * 0.07, h * 0.2 + w * 0.36, cx + w * 0.07, h * 0.58), fill=255)  # neck
    d.ellipse((cx - w * 0.48, h * 0.55, cx + w * 0.48, h * 1.25), fill=255)  # shoulders
    sil = sil.filter(ImageFilter.GaussianBlur(6))
    body = Image.new("L", (w, h), 18)
    img = Image.composite(body, img, sil)
    # rim light on the right edge of the silhouette
    edge = sil.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(10))
    rim = np.asarray(edge).astype(float) * (xx / w > 0.5)
    rim[:40, :] = 0; rim[-40:, :] = 0; rim[:, -40:] = 0  # ignore image-border edges
    arr = np.clip(np.asarray(img).astype(float) + rim * 0.9, 0, 255)
    noise = np.random.default_rng(3).normal(0, 4, arr.shape)
    return Image.fromarray(np.clip(arr + noise, 0, 255).astype(np.uint8)).convert("RGB")


def og_image():
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), (5, 5, 5))
    g = np.zeros((H, W, 3))
    yy, xx = np.mgrid[0:H, 0:W]
    m = np.exp(-(((xx - W * .78) / 380) ** 2 + ((yy - H * .45) / 300) ** 2))[..., None]
    g = np.array([5, 5, 5]) * (1 - m) + np.array([0x17, 0x20, 0x12]) * m
    im = Image.fromarray(g.astype(np.uint8))
    orb = Image.open(os.path.join(SRC, "hero-orb.png")).convert("RGB").resize((420, 420), Image.LANCZOS)
    mask = Image.new("L", (420, 420), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 419, 419), fill=255)
    im.paste(orb, (740, 105), mask)
    d = ImageDraw.Draw(im)
    disp = ImageFont.truetype(f"{FONTS}/InterDisplay-SemiBold.otf", 92)
    mono = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 20)
    d.rectangle((72, 72, 108, 108), fill=(199, 255, 47))
    d.text((80, 70), "A", font=ImageFont.truetype(f"{FONTS}/InterDisplay-Bold.otf", 32), fill=(7, 7, 7))
    d.text((124, 80), "ADVERBRIGHT / MEDIA", font=mono, fill=(245, 245, 241))
    y = 190
    for i, line in enumerate(["WE MAKE ADS", "PEOPLE", "ACTUALLY", "STOP FOR."]):
        d.text((68, y), line, font=disp, fill=(199, 255, 47) if i == 3 else (245, 245, 241))
        y += 84
    im.save(os.path.join(ROOT, "static", "og-image.jpg"), "JPEG", quality=86)


def favicons():
    for s in (32, 180, 192, 512):
        im = Image.new("RGB", (s, s), (5, 5, 5))
        d = ImageDraw.Draw(im)
        pad = round(s * 0.12)
        d.rectangle((pad, pad, s - pad, s - pad), fill=(199, 255, 47))
        f = ImageFont.truetype(f"{FONTS}/InterDisplay-Bold.otf", round(s * 0.62))
        bbox = d.textbbox((0, 0), "A", font=f)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        d.text(((s - tw) / 2 - bbox[0], (s - th) / 2 - bbox[1]), "A", font=f, fill=(7, 7, 7))
        im.save(os.path.join(ICONS, f"icon-{s}.png"))


if __name__ == "__main__":
    hero = Image.open(os.path.join(SRC, "hero-orb.png"))
    export(hero, "hero-orb", [360, 560, 840, 1120])
    for p in ("alpha", "beta", "gamma", "delta"):
        im = Image.open(os.path.join(SRC, f"project-{p}.png"))
        export(crop_ratio(im, 4, 5), f"project-{p}-portrait", [480, 800, 1200])
        export(crop_ratio(im, 7, 5), f"project-{p}-landscape", [480, 800, 1200, 1600])
        export(crop_ratio(im, 16, 9), f"project-{p}-wide", [800, 1200, 1600])
        export(crop_ratio(im, 9, 16), f"project-{p}-story", [480, 720])
    for s in ("ai", "ugc", "video", "performance", "brand"):
        export(Image.open(os.path.join(SRC, f"service-{s}.png")), f"service-{s}", [240, 480])
    export(founder_placeholder(), "founder-placeholder", [480, 800, 1200], quality=70)
    og_image()
    favicons()
    with open(os.path.join(OUT, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)
    total = sum(os.path.getsize(os.path.join(OUT, x)) for x in os.listdir(OUT))
    print("images:", len(os.listdir(OUT)), "files,", round(total / 1024), "KB")
