#!/usr/bin/env python3
"""Regenerates resources/ artwork for Lumina. Needs Pillow.

    python3 scripts/make-icons.py
    npx capacitor-assets generate --android

Everything is drawn from the same palette the game uses, so the launcher
icon, the splash and the island in-game stay in step.
"""
from PIL import Image, ImageDraw, ImageFilter
import math, random, os

SKY_TOP = (20, 24, 48)
SKY_LOW = (60, 63, 107)
ROCK, ROCK_D = (96, 101, 158), (44, 47, 88)
TOPSOIL = (120, 126, 184)
GRASS, GRASS_D = (122, 186, 152), (96, 158, 128)
GLOW, LEAF, PETAL = (242, 192, 120), (143, 217, 182), (216, 167, 196)

OUT = os.path.join(os.path.dirname(__file__), "..", "resources")


def sky(size, top=SKY_TOP, bot=SKY_LOW):
    img = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        t = y / size
        d.line([(0, y), (size, y)],
               fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    return img


def stars(img, n, seed=7):
    r = random.Random(seed)
    d = ImageDraw.Draw(img, "RGBA")
    s = img.size[0]
    for _ in range(n):
        x, y = r.uniform(0, s), r.uniform(0, s * .52)
        rad = r.uniform(s * 0.0014, s * 0.0034)
        d.ellipse([x - rad, y - rad, x + rad, y + rad],
                  fill=(238, 240, 251, int(r.uniform(55, 185))))


def underside(cx, cy, w, seed=4):
    """Ragged rock that tapers to a point — an island, not a plant pot."""
    r = random.Random(seed)
    depth, pts, N = w * 1.55, [], 9
    for i in range(N + 1):
        t = i / N
        half = w * ((1 - t) ** 0.75) * (1 + 0.22 * math.sin(math.pi * t))
        pts.append((cx - half + r.uniform(-w * .04, w * .04), cy + depth * t))
    pts.append((cx + r.uniform(-w * .05, w * .05), cy + depth * 1.06))
    for i in range(N, -1, -1):
        t = i / N
        half = w * ((1 - t) ** 0.75) * (1 + 0.22 * math.sin(math.pi * t))
        pts.append((cx + half + r.uniform(-w * .04, w * .04), cy + depth * t))
    return pts


def build(img, cx, cy, w, transparent=False):
    size = img.size
    if not transparent:
        glow = Image.new("RGBA", size, (0, 0, 0, 0))
        ImageDraw.Draw(glow).ellipse(
            [cx - w * 1.9, cy - w * 1.4, cx + w * 1.9, cy + w * 0.9], fill=GLOW + (44,))
        img.paste(Image.alpha_composite(
            img.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(w * 0.5))
        ).convert("RGB"), (0, 0))

    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).polygon(underside(cx, cy, w), fill=255)
    grad = Image.new("RGB", size)
    gd = ImageDraw.Draw(grad)
    y0, y1 = int(cy), int(cy + w * 1.7)
    for y in range(size[1]):
        t = min(1, max(0, (y - y0) / max(1, (y1 - y0))))
        gd.line([(0, y), (size[0], y)],
                fill=tuple(int(ROCK[i] + (ROCK_D[i] - ROCK[i]) * t) for i in range(3)))
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    layer.paste(grad.convert("RGBA"), (0, 0), mask)
    merged = Image.alpha_composite(img.convert("RGBA"), layer)
    img.paste(merged.convert("RGB") if img.mode == "RGB" else merged, (0, 0))

    d = ImageDraw.Draw(img, "RGBA")
    d.ellipse([cx - w, cy - w * 0.30, cx + w, cy + w * 0.30], fill=TOPSOIL)
    d.ellipse([cx - w * .93, cy - w * .27, cx + w * .93, cy + w * .21], fill=GRASS)
    d.ellipse([cx - w * .93, cy - w * .02, cx + w * .93, cy + w * .21], fill=GRASS_D + (90,))

    hy = cy - w * 0.90
    d.line([(cx, cy - w * 0.06), (cx, hy)], fill=LEAF, width=max(3, int(w * 0.075)))
    d.ellipse([cx - w * .40, cy - w * .50, cx - w * .04, cy - w * .28], fill=LEAF)
    d.ellipse([cx + w * .04, cy - w * .68, cx + w * .42, cy - w * .46], fill=LEAF)
    return hy


def flower(img, cx, hy, r, halo=True):
    if halo:
        h = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(h).ellipse([cx - r * 2.4, hy - r * 2.4, cx + r * 2.4, hy + r * 2.4],
                                  fill=GLOW + (70,))
        img.paste(Image.alpha_composite(
            img.convert("RGBA"), h.filter(ImageFilter.GaussianBlur(r * 0.9))
        ).convert("RGB"), (0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    for i in range(5):
        a = math.pi * 2 * i / 5 - math.pi / 2
        px, py = cx + math.cos(a) * r * 0.74, hy + math.sin(a) * r * 0.74
        d.ellipse([px - r * .54, py - r * .54, px + r * .54, py + r * .54], fill=PETAL)
    d.ellipse([cx - r * .40, hy - r * .40, cx + r * .40, hy + r * .40], fill=(255, 248, 235))


def main():
    S = 1024
    icon = sky(S); stars(icon, 72)
    cx, cy, w = S * .5, S * .52, S * .255
    flower(icon, cx, build(icon, cx, cy, w), w * .34)
    icon.save(os.path.join(OUT, "icon.png"))

    # adaptive-icon foreground: island only, inside the 66% safe zone
    fg = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    cx2, cy2, w2 = S * .5, S * .54, S * .19
    flower(fg, cx2, build(fg, cx2, cy2, w2, transparent=True), w2 * .34, halo=False)
    fg.save(os.path.join(OUT, "icon-foreground.png"))
    Image.new("RGB", (S, S), SKY_TOP).save(os.path.join(OUT, "icon-background.png"))

    for name, (a, b), sd in [("splash", (SKY_TOP, (45, 52, 96)), 3),
                             ("splash-dark", ((9, 11, 20), (24, 28, 54)), 5)]:
        SP = 2732
        im = sky(SP, a, b); stars(im, 230, seed=sd)
        cx3, cy3, w3 = SP * .5, SP * .50, SP * .11
        flower(im, cx3, build(im, cx3, cy3, w3), w3 * .34)
        im.save(os.path.join(OUT, name + ".png"))

    print("wrote icon.png, icon-foreground.png, icon-background.png, splash.png, splash-dark.png")


if __name__ == "__main__":
    main()
