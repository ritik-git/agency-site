"""Encode the ad reel: source videos -> web MP4s + AVIF/WebP posters.

usage: python scripts/encode-reel.py <source-dir> [ffmpeg-exe]

Reads REEL below (output slug <- source filename, poster time), writes:
  static/video/<slug>.mp4                 540x960 max, 30fps, H.264 CRF 26 capped at 1 Mbps, AAC 96k, +faststart
  static/img/<slug>-<w>.{avif,webp}       posters, registered in static/img/manifest.json
Re-running skips videos that are already encoded (delete the .mp4 to force).
Needs Pillow with AVIF support (pip install pillow) and ffmpeg (pip install imageio-ffmpeg).
"""
import json, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1])
try:
    FF = sys.argv[2]
except IndexError:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()

REEL = [  # (slug, source file, poster second)
    ("reel-01", "WhatsApp Video 2026-11-17 at 5.06.55 PM.mp4", 1.0),
    ("reel-02", "WhatsApp Video 2026-11-17 at 5.06.54 PM (1).mp4", 1.0),
    ("reel-03", "WhatsApp Video 2026-11-17 at 5.06.56 PM.mp4", 1.0),
    ("reel-04", "WhatsApp Video 2026-11-17 at 5.06.56 PM (1).mp4", 1.0),
    ("reel-05", "WhatsApp Video 2026-11-17 at 5.06.57 PM.mp4", 1.0),
    ("reel-06", "WhatsApp Video 2026-11-17 at 5.06.54 PM.mp4", 1.0),
    ("reel-07", "WhatsApp Video 2026-11-17 at 5.06.55 PM (2).mp4", 1.0),
    ("reel-08", "WhatsApp Video 2026-11-17 at 5.06.56 PM (2).mp4", 1.0),
    ("reel-09", "WhatsApp Video 2026-11-17 at 5.06.53 PM (1).mp4", 1.0),
    ("reel-10", "WhatsApp Video 2026-11-17 at 5.07.25 PM.mp4", 1.0),
    ("reel-11", "WhatsApp Video 2026-11-17 at 5.06.53 PM.mp4", 1.0),
    ("reel-12", "WhatsApp Video 2026-11-17 at 5.06.57 PM (1).mp4", 1.0),
    ("reel-13", "WhatsApp Video 2026-11-17 at 5.06.55 PM (1).mp4", 1.0),
]
POSTER_WIDTHS = (360, 540)

vid_dir = ROOT / "static/video"; vid_dir.mkdir(exist_ok=True)
img_dir = ROOT / "static/img"
man_path = img_dir / "manifest.json"
manifest = json.loads(man_path.read_text("utf8"))

def run(args):
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)

for slug, name, t in REEL:
    src = SRC / name
    out = vid_dir / f"{slug}.mp4"
    if not out.exists():
        run(["-i", str(src),
             "-vf", "fps=30,scale='min(540,iw)':-2:flags=lanczos",
             "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-maxrate", "1M", "-bufsize", "2M", "-profile:v", "high", "-pix_fmt", "yuv420p",
             "-g", "60", "-movflags", "+faststart",
             "-c:a", "aac", "-b:a", "96k", "-ac", "2", str(out)])
    with tempfile.TemporaryDirectory() as td:
        frame = Path(td) / "f.png"
        run(["-ss", str(t), "-i", str(src), "-frames:v", "1", str(frame)])
        im = Image.open(frame).convert("RGB")
    widths = [w for w in POSTER_WIDTHS if w <= im.width] or [im.width]
    for w in widths:
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(img_dir / f"{slug}-{w}.webp", quality=76, method=6)
        r.save(img_dir / f"{slug}-{w}.avif", quality=52, speed=4)
    manifest[slug] = {"widths": widths, "w": im.width, "h": im.height}
    print(f"{slug}: {out.stat().st_size / 1e6:.2f} MB, poster {widths}", flush=True)

man_path.write_text(json.dumps(manifest, indent=1), "utf8")
