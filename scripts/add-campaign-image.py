"""Prepare a campaign screenshot for the Campaign Showcase.

usage: python scripts/add-campaign-image.py <screenshot> <slug>
  e.g. python scripts/add-campaign-image.py "C:/Downloads/meta-oct.png" campaign-06

Writes
  static/img/<slug>-<w>.{avif,webp}   carousel sizes (640/960/1280 wide, never upscaled),
                                      registered in static/img/manifest.json
  static/campaigns/<slug>.webp        full-resolution original — loaded ONLY when the
                                      visitor opens the full-screen viewer
Then add an entry with the same slug to `showcase.campaigns` in content/site.mjs.

Privacy: blur customer names, emails, phone numbers and account IDs BEFORE running this.
Needs Pillow with AVIF support (pip install pillow).
"""
import json, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
src, slug = Path(sys.argv[1]), sys.argv[2]
im = Image.open(src).convert("RGB")
W, H = im.size

img_dir = ROOT / "static/img"
orig_dir = ROOT / "static/campaigns"; orig_dir.mkdir(exist_ok=True)

widths = [w for w in (640, 960, 1280) if w <= W] or [W]
for w in widths:
    r = im.resize((w, round(H * w / W)), Image.LANCZOS)
    r.save(img_dir / f"{slug}-{w}.webp", quality=82, method=6)
    r.save(img_dir / f"{slug}-{w}.avif", quality=60, speed=4)

# Original for the lightbox: cap at 2560 wide, high quality (text in dashboards must stay crisp).
o = im if W <= 2560 else im.resize((2560, round(H * 2560 / W)), Image.LANCZOS)
o.save(orig_dir / f"{slug}.webp", quality=90, method=6)

man_path = img_dir / "manifest.json"
manifest = json.loads(man_path.read_text("utf8"))
manifest[slug] = {"widths": widths, "w": W, "h": H, "original": f"campaigns/{slug}.webp", "ow": o.width, "oh": o.height}
man_path.write_text(json.dumps(manifest, indent=1), "utf8")
print(f"{slug}: {W}x{H} -> sizes {widths}, original {(orig_dir / f'{slug}.webp').stat().st_size // 1024} KB")
