"""Procedural chrome-and-lime sculpture renders (placeholder art direction).

Pure numpy sphere tracer — no external assets. Produces the hero orb, project
covers and service previews in the reference's visual language: dark studio,
mirror chrome, acid-lime light trails. Replace with real work before launch.

usage: python3 scripts/render.py <out_dir> [name ...]
"""
import sys, os, math
import numpy as np
from PIL import Image, ImageFilter

LIME = np.array([0.78, 1.0, 0.18])
INK = np.array([0.02, 0.02, 0.02])


def norm(v):
    return v / np.linalg.norm(v, axis=-1, keepdims=True).clip(1e-9)


def rot_x(p, a):
    c, s = math.cos(a), math.sin(a)
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    return np.stack([x, c * y - s * z, s * y + c * z], -1)


def rot_y(p, a):
    c, s = math.cos(a), math.sin(a)
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    return np.stack([c * x + s * z, y, -s * x + c * z], -1)


def rot_z(p, a):
    c, s = math.cos(a), math.sin(a)
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    return np.stack([c * x - s * y, s * x + c * y, z], -1)


def sd_torus(p, R, r):
    q = np.sqrt(p[:, 0] ** 2 + p[:, 2] ** 2) - R
    return np.sqrt(q ** 2 + p[:, 1] ** 2) - r


def sd_sphere(p, c, r):
    return np.linalg.norm(p - c, axis=-1) - r


def sd_round_box(p, b, r):
    q = np.abs(p) - (np.array(b) - r)
    return np.linalg.norm(np.maximum(q, 0), axis=-1) + np.minimum(q.max(-1), 0) - r


def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)


def twist_y(p, k):
    a = k * p[:, 1]
    c, s = np.cos(a), np.sin(a)
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    return np.stack([c * x - s * z, y, s * x + c * z], -1)


# ---------- scenes -------------------------------------------------------
def scene_hero(p):  # twisted ribbon torus
    q = rot_x(rot_z(p, 0.35), 1.05)
    ang = np.arctan2(q[:, 2], q[:, 0])
    rad = np.sqrt(q[:, 0] ** 2 + q[:, 2] ** 2) - 1.05
    # local frame of the tube, twisted along the ring → ribbon
    a = ang * 1.5
    c, s = np.cos(a), np.sin(a)
    u = c * rad - s * q[:, 1]
    v = s * rad + c * q[:, 1]
    box = np.stack([np.abs(u) - 0.42, np.abs(v) - 0.11], -1)
    d = np.linalg.norm(np.maximum(box, 0), axis=-1) + np.minimum(box.max(-1), 0) - 0.06
    core = sd_sphere(p, np.array([0.0, 0.0, 0.0]), 0.42)
    return np.minimum(d * 0.7, core)


def scene_alpha(p):  # chrome torus + orbiting pearl
    q = rot_x(rot_z(p, -0.5), 1.2)
    return np.minimum(sd_torus(q, 1.0, 0.36), sd_sphere(p, np.array([0.95, 0.75, -0.4]), 0.26))


def scene_beta(p):  # stacked blob
    d = sd_sphere(p, np.array([0.0, -0.75, 0.0]), 0.72)
    d = smin(d, sd_sphere(p, np.array([0.12, 0.25, 0.0]), 0.55), 0.35)
    d = smin(d, sd_sphere(p, np.array([-0.05, 1.05, 0.05]), 0.38), 0.3)
    return d


def scene_gamma(p):  # twisted tall bar
    q = twist_y(rot_z(p, 0.18), 1.1)
    return sd_round_box(q, [0.42, 1.45, 0.42], 0.12) * 0.75


def scene_delta(p):  # gyroid sphere
    q = rot_y(rot_x(p, 0.4), 0.6) * 4.2
    g = (np.sin(q[:, 0]) * np.cos(q[:, 1]) + np.sin(q[:, 1]) * np.cos(q[:, 2]) + np.sin(q[:, 2]) * np.cos(q[:, 0]))
    shell = np.abs(g) / 4.2 / 1.7 - 0.05
    return np.maximum(sd_sphere(p, np.zeros(3), 1.2), shell)


def scene_cube(p):
    q = rot_y(rot_x(p, 0.62), 0.78)
    return sd_round_box(q, [0.85, 0.85, 0.85], 0.1)


def scene_rings(p):
    q1 = rot_x(p, 1.3)
    q2 = rot_z(rot_x(p, 0.25), 0.9)
    return np.minimum(sd_torus(q1, 1.0, 0.13), sd_torus(q2, 0.72, 0.13))


def scene_capsule(p):
    q = rot_z(p, 0.55)
    y = np.clip(q[:, 1], -1.0, 1.0)
    d = np.sqrt(q[:, 0] ** 2 + (q[:, 1] - y) ** 2 + q[:, 2] ** 2) - 0.48
    return np.minimum(d, sd_sphere(p, np.array([-0.85, -0.95, 0.3]), 0.22))


# ---------- environment --------------------------------------------------
def env(d, lime_az=0.6):
    x, y, z = d[:, 0], d[:, 1], d[:, 2]
    col = np.tile(INK, (len(d), 1)) * (0.6 + 0.4 * np.clip(y, 0, 1))[:, None]
    # overhead softbox (white)
    soft = np.exp(-((x * 1.6) ** 2 + ((z + 0.1) * 2.2) ** 2) * 2.0) * np.clip(y, 0, 1) ** 2
    col += soft[:, None] * np.array([1.0, 1.0, 0.97]) * 2.2
    # key strip (white) on the left
    az = np.arctan2(x, -z)
    strip = np.exp(-((az + 1.1) * 7) ** 2) * np.exp(-(y * 1.5) ** 2)
    col += strip[:, None] * 1.4
    # lime strips — the signature light trails
    s1 = np.exp(-((az - lime_az) * 9) ** 2) * np.clip(1 - np.abs(y), 0, 1)
    s2 = np.exp(-((y + 0.25) * 12) ** 2) * np.clip(1 - np.abs(az) / 3, 0, 1)
    col += (s1 * 2.6 + s2 * 1.1)[:, None] * LIME
    # floor bounce
    col += (np.clip(-y, 0, 1) ** 3 * 0.05)[:, None] * LIME
    return col


def background(w, h, glow=(0.62, 0.45)):
    yy, xx = np.mgrid[0:h, 0:w]
    u = xx / w - glow[0]
    v = yy / h - glow[1]
    r = np.sqrt(u ** 2 * (w / h) ** 2 + v ** 2)
    base = np.ones((h, w, 3)) * INK
    g = np.exp(-(r / 0.42) ** 2)[..., None]
    base = base * (1 - g) + np.array([0.09, 0.125, 0.07]) * g
    vig = np.clip(1 - (np.sqrt((xx / w - .5) ** 2 + (yy / h - .5) ** 2) * 1.1) ** 2, 0.55, 1)[..., None]
    return base * vig


def render(sdf, w, h, cam_z=-4.4, fov=0.62, lime_az=0.6, glow=(0.6, 0.45), ss=1.5, offset=(0, 0)):
    W, H = int(w * ss), int(h * ss)
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float64)
    aspect = W / H
    u = ((xs + 0.5) / W * 2 - 1) * aspect * fov + offset[0]
    v = -((ys + 0.5) / H * 2 - 1) * fov + offset[1]
    rd = norm(np.stack([u, v, np.ones_like(u) * 1.6], -1).reshape(-1, 3))
    ro = np.tile(np.array([0.0, 0.0, cam_z]), (len(rd), 1))
    n = len(rd)
    t = np.zeros(n)
    hit = np.zeros(n, bool)
    alive = np.ones(n, bool)
    steps = np.zeros(n)
    for _ in range(140):
        idx = np.nonzero(alive)[0]
        if len(idx) == 0:
            break
        p = ro[idx] + rd[idx] * t[idx, None]
        d = sdf(p)
        t[idx] += d
        steps[idx] += 1
        h_ = d < 0.0015
        hit[idx[h_]] = True
        far = t[idx] > 9
        alive[idx[h_ | far]] = False
    img = background(W, H, glow).reshape(-1, 3)
    hi = np.nonzero(hit)[0]
    if len(hi):
        p = ro[hi] + rd[hi] * t[hi, None]
        e = 0.0015
        k = np.array([[1, -1, -1], [-1, -1, 1], [-1, 1, -1], [1, 1, 1]], float)
        nrm = sum(k[i] * sdf(p + k[i] * e)[:, None] for i in range(4))
        nrm = norm(nrm)
        vdir = rd[hi]
        refl = vdir - 2 * (vdir * nrm).sum(-1, keepdims=True) * nrm
        cos = np.clip(-(vdir * nrm).sum(-1), 0, 1)
        fres = 0.72 + 0.28 * (1 - cos) ** 5
        c = env(refl, lime_az) * fres[:, None] * np.array([0.95, 0.96, 0.98])
        # rim of lime on grazing edges facing right
        rim = (1 - cos) ** 3 * np.clip(nrm[:, 0] * 0.8 + 0.2, 0, 1)
        c += rim[:, None] * LIME * 0.9
        ao = np.clip(1 - steps[hi] / 140 * 1.4, 0.35, 1)
        c *= ao[:, None]
        img[hi] = c
    img = img / (1 + img * 0.55)  # soft tonemap (linear → display)
    img = np.clip(img, 0, 1) ** (1 / 2.2)
    # background is authored in display space so it lands on the brand hexes
    bg = background(W, H, glow).reshape(-1, 3)
    img[~hit] = bg[~hit]
    # soft contact shadow / edge darkening around the object
    img = img.reshape(H, W, 3)
    im = Image.fromarray((img * 255).astype(np.uint8))
    bloom = im.filter(ImageFilter.GaussianBlur(radius=int(18 * ss)))
    im = Image.blend(im, Image.fromarray(np.maximum(np.asarray(im), np.asarray(bloom))), 0.35)
    return im.resize((w, h), Image.LANCZOS)


JOBS = {
    # name: (scene, w, h, kwargs)
    "hero-orb": (scene_hero, 1400, 1400, dict(cam_z=-4.6, glow=(0.5, 0.5), lime_az=0.7)),
    "project-alpha": (scene_alpha, 1600, 1600, dict(cam_z=-5.0, glow=(0.55, 0.5))),
    "project-beta": (scene_beta, 1600, 1600, dict(cam_z=-5.4, glow=(0.5, 0.45), lime_az=-0.4)),
    "project-gamma": (scene_gamma, 1600, 1600, dict(cam_z=-5.6, glow=(0.45, 0.5), lime_az=0.9)),
    "project-delta": (scene_delta, 1600, 1600, dict(cam_z=-4.6, glow=(0.55, 0.5), lime_az=0.3)),
    "service-ai": (scene_cube, 720, 1280, dict(cam_z=-6.2, glow=(0.5, 0.45))),
    "service-ugc": (scene_capsule, 720, 1280, dict(cam_z=-6.0, glow=(0.5, 0.5), lime_az=-0.5)),
    "service-video": (scene_rings, 720, 1280, dict(cam_z=-5.8, glow=(0.5, 0.5), lime_az=0.9)),
    "service-performance": (scene_gamma, 720, 1280, dict(cam_z=-6.0, glow=(0.5, 0.5), lime_az=-0.2)),
    "service-brand": (scene_beta, 720, 1280, dict(cam_z=-6.4, glow=(0.5, 0.5), lime_az=0.5)),
}

if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    names = sys.argv[2:] or list(JOBS)
    for name in names:
        scene, w, h, kw = JOBS[name]
        im = render(scene, w, h, **kw)
        im.save(os.path.join(out, name + ".png"))
        print("rendered", name, flush=True)
