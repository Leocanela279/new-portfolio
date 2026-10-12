"""
Generates the colour ASCII panorama of Athens used as the footer background.

    python3 scripts/generate-athens-ascii.py [--print]

Outputs, for a wide (desktop) and a tall (phone/tablet) composition:
  - src/components/layout/athens-ascii.ts   the characters
  - src/assets/ascii/athens-<name>.png       one pixel per character: its colour

On the page the text is painted with the PNG through `background-clip: text`,
scaled with `image-rendering: pixelated`, so every character gets exactly the
colour of its cell. One text node and one tiny image instead of thousands of
coloured spans.

Buildings are hand-drawn ASCII sprites; rock, hills and haze are filled from
height profiles with a density ramp. Colours follow the site's palette, plus
the blue and red the Greeks actually painted on their temples. A fixed seed
keeps the output stable between runs.
"""

from __future__ import annotations

import json
import math
import random
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OPAQUE = "`"  # inside a sprite: "draw a blank here", hiding what is behind
RAMP = " .:-=+*#%@"

RGB = tuple[int, int, int]


def hex_rgb(h: str) -> RGB:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def mix(a: RGB, b: RGB, t: float) -> RGB:
    t = max(0.0, min(1.0, t))
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))  # type: ignore[return-value]


# Palette ── warm marble and dusk, readable on the ivory page (#F8F7F4).
C = {k: hex_rgb(v) for k, v in dict(
    ink="#4a4640",
    star_gold="#b07a2e",
    star_blue="#4f6f9a",
    star_rose="#a8645c",
    formula="#7a5a34",
    formula_alt="#46638c",
    planet="#a0743c",
    planet_light="#d1a25c",
    ring="#5f4a35",
    ridge_far="#8d86ad",
    ridge_near="#7f8aa8",
    sea="#3f7590",
    sea_light="#6c9cb3",
    hill="#6f7a44",
    hill_dark="#55603a",
    rock_top="#ad7a42",
    rock_base="#6e4c31",
    wall="#8a6640",
    marble="#bf8f45",
    marble_shade="#94693a",
    marble_light="#d3a65a",
    greek_blue="#2f5590",
    greek_red="#a63d2a",
    stone="#8d7354",
    roof="#b0462b",
    roof_light="#c45a35",
    dome="#2f62a0",
    window="#d08f1f",
    window_dark="#4f3d2e",
    cypress="#2c4a2e",
    cypress_light="#3e6338",
    olive="#66784a",
    olive_trunk="#6d5a48",
    bird="#6b6760",
    sky_top="#7a83b4",
    sky_mid="#b08cae",
    sky_low="#d98a55",
    tympanum="#2f5590",
    cella="#5a3f28",
    whitewash="#b8975f",
    field="#968a4e",
    field_dark="#76703f",
).items()}


class Canvas:
    def __init__(self, cols: int, rows: int, seed: int):
        self.cols, self.rows = cols, rows
        self.chars = [[" "] * cols for _ in range(rows)]
        self.colors: list[list[RGB]] = [[C["ink"]] * cols for _ in range(rows)]
        self.rng = random.Random(seed)

    def set(self, r: int, c: int, ch: str, color: RGB):
        if 0 <= r < self.rows and 0 <= c < self.cols:
            self.chars[r][c] = ch
            self.colors[r][c] = color

    def put(self, r: int, c: int, text: str, color, fill=None):
        """Write text; `color` is an RGB or a function of the character.
        OPAQUE cells become `fill` (a (char, colour) pair) or a blank."""
        for i, ch in enumerate(text):
            if ch == " ":
                continue
            if ch == OPAQUE:
                fch, fcol = fill or (" ", C["ink"])
                self.set(r, c + i, fch, fcol)
            else:
                self.set(r, c + i, ch, color(ch) if callable(color) else color)

    def sprite(self, r: int, c: int, art: str, color, fill=None):
        for i, line in enumerate(art.strip("\n").split("\n")):
            self.put(r + i, c, line, color, fill)

    def sprite_bottom(self, base_row: int, c: int, art: str, color, fill=None):
        lines = art.strip("\n").split("\n")
        self.sprite(base_row - len(lines) + 1, c, art, color, fill)

    def fill_profile(self, c0, c1, top, bottom, density, color, keep=False):
        """Fill columns c0..c1 between top(c) and bottom(c) from the ramp."""
        for c in range(max(0, c0), min(self.cols, c1 + 1)):
            t, b = int(round(top(c))), int(round(bottom(c)))
            for r in range(max(0, t), min(self.rows, b + 1)):
                d = max(0.0, min(0.999, density(r, c)))
                ch = RAMP[int(d * len(RAMP))]
                if keep and ch == " ":
                    continue
                self.set(r, c, ch, color(r, c))

    def text(self) -> str:
        return "\n".join("".join(row).rstrip() for row in self.chars)

    def image(self) -> Image.Image:
        img = Image.new("RGB", (self.cols, self.rows))
        img.putdata([px for row in self.colors for px in row])
        return img


# ─── Sprites ────────────────────────────────────────────────────────────

def parthenon(columns: int) -> str:
    """Pediment with sculpture, painted frieze, columns, stepped stylobate."""
    spacing = 6
    width = columns * spacing + 3
    center = width // 2
    rows = []
    ped_h = 4
    for k in range(ped_h):
        half = round((k + 1) * (center / ped_h))
        left, right = center - half, center + half
        line = [" "] * width
        line[left] = "/"
        line[min(width - 1, right)] = "\\"
        for x in range(left + 1, min(width - 1, right)):
            line[x] = OPAQUE
        if k == ped_h - 1:
            for x in range(left + 3, right - 2, 5):
                line[x] = "o" if (x // 5) % 2 else "A"
        rows.append("".join(line))
    rows.append("/" + "_" * (width - 2) + "\\")
    rows.append("|" + "=" * (width - 2) + "|")
    frieze = ("|||" + "::") * (width // 5 + 1)  # triglyphs and metopes
    rows.append("|" + frieze[: width - 2] + "|")
    rows.append("|" + "-" * (width - 2) + "|")
    capital = [" "] * width
    for i in range(columns):
        x = 1 + i * spacing
        capital[x : x + 3] = list("[=]")
    rows.append("".join(capital))
    for h in range(6):
        shaft = [" "] * width
        for i in range(columns):
            x = 1 + i * spacing
            shaft[x : x + 3] = list("|:|")
            for gap in range(x + 3, min(width, x + spacing)):
                shaft[gap] = "." if (h + gap) % 7 == 0 else OPAQUE
        rows.append("".join(shaft))
    rows.append("_" * width)
    rows.append("[" + "#" * (width - 2) + "]")
    rows.append("=" * (width + 2))
    rows = [" " + r for r in rows[:-1]] + [rows[-1]]
    return "\n".join(rows)


def parthenon_color(ch: str) -> RGB:
    if ch in "Ao":
        return C["greek_red"]
    if ch == "|":
        return C["marble"]
    if ch == ":":
        return C["marble_shade"]
    if ch in "[]=":
        return C["marble_light"]
    if ch == "#":
        return C["marble_shade"]
    if ch == ".":
        return C["marble_shade"]
    return C["marble"]


def frieze_color(ch: str) -> RGB:
    """Triglyphs blue, metopes red: how the frieze was actually painted."""
    return C["greek_blue"] if ch == "|" else C["greek_red"]


ERECHTHEION = r"""
 ______________
|==============|_______
|``````````````|=======|
 o`` o`` o`` o`|```````|
 |`` |`` |`` |`|`[]`[]`|
_|___|___|___|_|_______|
"""

PROPYLAEA = r"""
  __________
 /__________\
 |==========|
 |`|``|``|`||
 |`|``|``|`||
_|_|__|__|_||_
"""

CHAPEL = r"""
  +
 /^\
 |#|
"""

CYPRESS = r"""
  ^
 /#\
 |#|
/###\
 |#|
/###\
  |
"""

CYPRESS_SMALL = r"""
 ^
/#\
|#|
 |
"""

OLIVE = r"""
  .:%%:.
 :%#%%#%:
 '%%#%%'
   '|'
    |
"""

BROKEN_COLUMN = r"""
 _____
[=====]
 |:::|
 |:::|
 |:::|
 |:::|
 |:::|
 |:::|
 |:::|
 |:::|
_|:::|_
"""

BROKEN_COLUMN_SHORT = r"""
  ___
 /:::\
 |:::|
 |:::|
 |:::|
_|:::|_
"""

PLANET = r"""
          .--------.
       .'  .   :    '.
  -----:---:---:----:------
 '    :   .   '    .   :    '
  ------------------------
       '.   :    .   .'
          '--------'
"""

BIRDS = ["v", "^v^", "v  v", "~v~"]


def house(width: int, height: int, roof: str, rng: random.Random) -> str:
    rows = []
    if roof == "pitch":
        h = max(2, width // 4)
        for k in range(h):
            half = round((k + 1) * (width / 2) / h)
            line = [" "] * width
            left = max(0, width // 2 - half)
            right = min(width - 1, width // 2 + half - 1)
            line[left] = "/"
            line[right] = "\\"
            for x in range(left + 1, right):
                line[x] = "=" if k < h - 1 else "_"
            rows.append("".join(line))
    elif roof == "flat":
        rows.append(" " + "_" * (width - 2) + " ")
    else:  # dome
        rows.append(" " * (width // 2 - 1) + ".-." + " " * (width - width // 2 - 2))
        rows.append(" " * (width // 2 - 2) + "(" + "@" * 3 + ")" + " " * (width - width // 2 - 3))
        rows.append(" " + "_" * (width - 2) + " ")
    for k in range(height):
        inner = []
        for x in range(width - 2):
            if k == height - 1:
                inner.append("_")
            elif k % 2 == 0 and x % 4 == 1 and rng.random() < 0.75:
                inner.append("#" if rng.random() < 0.4 else "o")
            else:
                inner.append(":")
        rows.append("|" + "".join(inner) + "|")
    return "\n".join(rows)


def house_color(roof: str):
    roof_tone = C["roof"] if random.random() < 0.6 else C["roof_light"]

    def color(ch: str) -> RGB:
        if ch in "/\\=":
            return roof_tone
        if ch == ":":
            return C["whitewash"]
        if ch in "().-@":
            return C["dome"]
        if ch == "o":
            return C["window"]
        if ch == "#":
            return C["window_dark"]
        return C["stone"]

    return color


def tree_color(ch: str) -> RGB:
    if ch in "^/\\":
        return C["cypress_light"]
    return C["cypress"]


def olive_color(ch: str) -> RGB:
    return C["olive_trunk"] if ch in "|'" else C["olive"]


def column_color(ch: str) -> RGB:
    return C["marble_shade"] if ch == ":" else C["stone"]


def planet_color(ch: str) -> RGB:
    return C["ring"] if ch == "-" else (C["planet_light"] if ch in ".'" else C["planet"])


def city(cv: Canvas, base_rows: list[int], c0: int, c1: int, scale: float):
    rng = cv.rng
    random.seed(rng.random())
    for depth, base in enumerate(base_rows):
        c = c0 - rng.randint(0, 6)
        while c < c1:
            if rng.random() < 0.16:
                tree = CYPRESS if depth == len(base_rows) - 1 else CYPRESS_SMALL
                cv.sprite_bottom(base, c, tree, tree_color)
                c += 5
                continue
            w = rng.randint(int(7 * scale), int(14 * scale)) + depth * 2
            h = rng.randint(2, 3 + depth)
            roof = rng.choices(["pitch", "flat", "dome"], [6, 3, 1.4])[0]
            cv.sprite_bottom(base, c, house(w, h, roof, rng), house_color(roof))
            c += w + rng.randint(-1, 2)


def sky_colour(t: float) -> RGB:
    """Dusk: lavender overhead, mauve, then a warm glow at the horizon."""
    return mix(C["sky_top"], C["sky_mid"], t / 0.6) if t < 0.6 else mix(C["sky_mid"], C["sky_low"], (t - 0.6) / 0.4)


def sky(cv: Canvas, bottom: int, density: float):
    rng = cv.rng
    for r in range(0, bottom):
        t = r / max(1, bottom)
        for c in range(cv.cols):
            # Fine texture that thickens towards the horizon glow.
            d = (0.12 + 0.26 * t) * (0.55 + rng.random())
            if d > 0.18:
                cv.set(r, c, ":" if d > 0.32 else ".", sky_colour(t))
    tones = [C["star_gold"], C["star_blue"], C["star_rose"], C["star_gold"]]
    for r in range(0, bottom):
        fall = 1 - r / max(1, bottom)
        for c in range(cv.cols):
            if rng.random() < density * 0.5 * (0.35 + fall):
                cv.set(r, c, rng.choices(["*", "+", "'"], [3, 2, 1])[0], rng.choice(tones))


def planet(cv: Canvas, pr: int, pc: int, radius: int):
    """A ringed planet lit from the upper left. Cells are ~0.6 as wide as tall,
    so the disc is stretched horizontally to stay round on screen."""
    ry, rx = radius, radius / 0.6
    ring_rx, ring_ry = rx * 2.0, radius * 0.42
    for r in range(pr - radius - 2, pr + radius + 3):
        for c in range(int(pc - ring_rx) - 1, int(pc + ring_rx) + 2):
            dy, dx = (r - pr) / ry, (c - pc) / rx
            in_disc = dx * dx + dy * dy <= 1
            e = ((c - pc) / ring_rx) ** 2 + ((r - pr) / ring_ry) ** 2
            on_ring = 0.78 < e < 1.12
            if on_ring and (not in_disc or r > pr):  # behind the disc above, in front below
                cv.set(r, c, "=" if e < 0.95 else "-", C["ring"])
            elif in_disc:
                light = max(0.0, min(1.0, 0.62 - 0.5 * (dx + dy) / 1.4))
                ch = "@" if light < 0.35 else ("%" if light < 0.6 else "#")
                cv.set(r, c, ch, mix(C["ring"], C["planet_light"], light))
            elif 1 < dx * dx + dy * dy < 1.25 and dy < 0.2:
                cv.set(r, c, ".", C["planet_light"])  # a thin glow on the lit limb


def formulas(cv: Canvas, placements):
    """Formulas written into the sky, each on a small cleared band."""
    for i, (r, c, text) in enumerate(placements):
        cv.put(r, c - 1, OPAQUE * (len(text) + 2), C["ink"])
        cv.put(r, c, text, C["formula"] if i % 2 == 0 else C["formula_alt"])


# ─── Composition ────────────────────────────────────────────────────────

def scene(cols: int, rows: int, L: dict, seed: int) -> Canvas:
    cv = Canvas(cols, rows, seed)
    rng = cv.rng

    sky(cv, L["ridge"] - 2, L["stars"])

    # Hymettus on the horizon, hazy and blue with distance.
    ridge = lambda c: L["ridge"] + 3 * math.sin(c / 17 + 1) + 1.6 * math.sin(c / 6.3)
    cv.fill_profile(
        0, cols - 1, ridge, lambda c: ridge(c) + 9,
        lambda r, c: 0.22 + 0.22 * rng.random() - (r - ridge(c)) * 0.012,
        lambda r, c: mix(C["ridge_far"], C["ridge_near"], (r - ridge(c)) / 9),
    )
    # The plain below: fields and olive groves in a loose texture.
    cv.fill_profile(
        0, cols - 1, lambda c: ridge(c) + 10, lambda c: L["ground"],
        lambda r, c: 0.16 + 0.3 * rng.random(),
        lambda r, c: C["field"] if (c // 3 + r) % 5 else C["field_dark"],
    )
    for c in range(cols):
        cv.set(int(round(ridge(c))) - 1, c, "_" if rng.random() < 0.5 else ".", C["ridge_far"])

    # The sea towards Piraeus.
    s0, s1, sr = L["sea"]
    for r in range(sr, sr + 4):
        for c in range(s0, s1):
            if (r + c * 3) % 5 == 0:
                cv.set(r, c, "~", C["sea"])
            else:
                cv.set(r, c, "-" if (c + r) % 2 else "=", C["sea_light"] if r == sr else C["sea"])

    # Lycabettus and its chapel.
    if L.get("lycabettus"):
        lc, lw, lpeak = L["lycabettus"]
        lyc_top = lambda c: lpeak + ((c - lc) / (lw / 2)) ** 2 * (L["ground"] - lpeak) * 0.9
        cv.fill_profile(
            lc - lw // 2, lc + lw // 2, lyc_top, lambda c: L["ground"],
            lambda r, c: min(0.62, 0.16 + 0.28 * rng.random() + (0.1 if c > lc else 0) + (r - lpeak) * 0.004),
            lambda r, c: C["hill_dark"] if c > lc else C["hill"],
        )
        cv.sprite_bottom(lpeak - 1, lc - 2, CHAPEL, lambda ch: C["greek_blue"] if ch == "+" else C["stone"])

    # The Acropolis rock: steep sides, flat top, fortification wall.
    a0, a1, top, base = L["acropolis"]

    def rock_top(c):
        if c < a0 + 8:
            return top + (a0 + 8 - c) * 1.6
        if c > a1 - 8:
            return top + (c - (a1 - 8)) * 1.4
        return top

    cv.fill_profile(
        a0 - 10, a1 + 10, rock_top, lambda c: base,
        lambda r, c: min(0.78, 0.3 + 0.3 * rng.random() + (r - top) * 0.008 + (0.1 if c > (a0 + a1) / 2 else 0)),
        lambda r, c: mix(C["rock_top"], C["rock_base"], (r - top) / max(1, base - top) + (0.15 if c > (a0 + a1) / 2 else 0)),
    )
    for c in range(a0 - 10, a1 + 11):
        t = int(round(rock_top(c)))
        ch = "/" if c < a0 + 8 else ("\\" if c > a1 - 8 else "_")
        cv.set(t, c, ch, C["rock_top"])
    for k, r in enumerate(range(top + 1, top + 4)):
        brick = "__|" if k % 2 == 0 else "_|_"
        cv.put(r, a0 + 8, (brick * cols)[: a1 - a0 - 16], C["wall"])

    # Monuments on the plateau. The frieze row is painted blue and red.
    p_art = parthenon(L["parthenon_columns"])
    p_lines = p_art.split("\n")
    p_width = max(len(line) for line in p_lines)
    p_c = L["parthenon_center"] - p_width // 2
    p_top = top - len(p_lines) + 1
    cv.sprite(p_top, p_c, p_art, parthenon_color, fill=(";", C["cella"]))
    for k in range(4):  # the pediment's tympanum was painted blue
        cv.put(p_top + k, p_c, p_lines[k], lambda ch: C["marble_light"] if ch in "Ao" else C["marble"], fill=("=", C["tympanum"]))
    cv.put(p_top + 6, p_c, p_lines[6], frieze_color)
    if L.get("erechtheion"):
        cv.sprite_bottom(top, p_c + p_width + 2, ERECHTHEION, lambda ch: C["greek_red"] if ch == "o" else C["marble"], fill=(";", C["cella"]))
    cv.sprite_bottom(top + 3, a0 + 1, PROPYLAEA, lambda ch: C["marble_light"] if ch in "=_" else C["marble"], fill=(";", C["cella"]))

    # The city, then foreground ruins and trees.
    city(cv, L["city_rows"], 0, cols, L["house_scale"])
    for r, c, kind in L["foreground"]:
        art = {"column": BROKEN_COLUMN, "column_short": BROKEN_COLUMN_SHORT, "olive": OLIVE}[kind]
        cv.sprite_bottom(r, c, art, olive_color if kind == "olive" else column_color)

    formulas(cv, L["formulas"])
    for i, (r, c) in enumerate(L["birds"]):
        cv.put(r, c, BIRDS[i % len(BIRDS)], C["bird"])
    pr, pc = L["planet"]
    planet(cv, pr, pc, L.get("planet_radius", 5))
    return cv


DESKTOP = dict(
    stars=0.011,
    ridge=78,
    ground=110,
    sea=(0, 60, 80),
    lycabettus=(208, 46, 88),
    acropolis=(60, 175, 86, 104),
    parthenon_columns=8,
    parthenon_center=116,
    erechtheion=True,
    city_rows=[99, 104, 109],
    house_scale=1.0,
    foreground=[(109, 2, "column"), (109, 14, "olive"), (109, 230, "column_short"), (109, 218, "olive")],
    formulas=[
        (31, 96, "e^(i*pi) + 1 = 0"),
        (45, 112, "a^2 + b^2 = c^2"),
        (53, 192, "sum 1/n^2 = pi^2/6"),
        (58, 128, "V - E + F = 2"),
        (63, 186, "3 + 10/71 < pi < 3 + 1/7"),
        (42, 204, "phi = (1 + sqrt 5) / 2"),
        (66, 96, "H = -sum p log2 p"),
    ],
    birds=[(61, 140), (63, 146), (60, 152), (70, 176)],
    planet=(50, 152),
    planet_radius=7,
)

MOBILE = dict(
    stars=0.013,
    ridge=206,
    ground=250,
    sea=(0, 22, 207),
    lycabettus=(122, 26, 212),
    acropolis=(14, 120, 214, 236),
    parthenon_columns=6,
    parthenon_center=62,
    erechtheion=True,
    city_rows=[231, 240, 249],
    house_scale=0.8,
    foreground=[(249, 0, "column_short"), (249, 124, "column_short")],
    # Phones show roughly rows 90–250; these sit in the gaps between the text.
    formulas=[
        (100, 46, "e^(i*pi) + 1 = 0"),
        (157, 58, "a^2 + b^2 = c^2"),
        (196, 8, "V - E + F = 2"),
    ],
    birds=[(190, 96), (193, 102), (188, 108)],
    planet=(104, 106),
    planet_radius=7,
)


def main():
    scenes = {"desktop": scene(240, 110, DESKTOP, seed=7), "mobile": scene(132, 250, MOBILE, seed=11)}

    assets = ROOT / "src/assets/ascii"
    assets.mkdir(parents=True, exist_ok=True)
    for name, cv in scenes.items():
        cv.image().save(assets / f"athens-{name}.png", optimize=True)

    out = ROOT / "src/components/layout/athens-ascii.ts"
    parts = ["// Generated by scripts/generate-athens-ascii.py — edit the script, not this file.\n"]
    for name, cv in scenes.items():
        const = "athens" + name.capitalize()
        parts.append(
            f"\nexport const {const} = {{\n  cols: {cv.cols},\n  rows: {cv.rows},\n  text: {json.dumps(cv.text())},\n}};\n"
        )
    out.write_text("".join(parts))
    print("wrote", out.relative_to(ROOT), "and", ", ".join(f"athens-{n}.png" for n in scenes))

    if "--print" in sys.argv:
        for cv in scenes.values():
            print(cv.text())
            print("-" * 80)


if __name__ == "__main__":
    main()
