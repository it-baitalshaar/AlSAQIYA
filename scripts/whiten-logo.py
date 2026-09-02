"""Replace the logo's black backdrop with a white background."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "al-saqiya-logo.jpg"
DST_PNG = ROOT / "public" / "al-saqiya-logo.png"
DST_JPG = ROOT / "public" / "al-saqiya-logo.jpg"

# Near-black pixels connected to the canvas edge are treated as backdrop.
THRESHOLD = 38


def is_backdrop(r: int, g: int, b: int) -> bool:
    return r <= THRESHOLD and g <= THRESHOLD and b <= THRESHOLD


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    w, h = img.size
    pixels = img.load()
    visited = [[False] * w for _ in range(h)]
    backdrop = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            r, g, b, _ = pixels[x, y]
            if is_backdrop(r, g, b):
                queue.append((x, y))
                visited[y][x] = True
    for y in range(h):
        for x in (0, w - 1):
            if visited[y][x]:
                continue
            r, g, b, _ = pixels[x, y]
            if is_backdrop(r, g, b):
                queue.append((x, y))
                visited[y][x] = True

    while queue:
        x, y = queue.popleft()
        backdrop[y][x] = True
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h or visited[ny][nx]:
                continue
            r, g, b, _ = pixels[nx, ny]
            if is_backdrop(r, g, b):
                visited[ny][nx] = True
                queue.append((nx, ny))

    out = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    src = img.load()
    dest = out.load()

    for y in range(h):
        for x in range(w):
            if backdrop[y][x]:
                dest[x, y] = (255, 255, 255, 255)
            else:
                dest[x, y] = src[x, y]

    out.save(DST_PNG, "PNG")
    out.convert("RGB").save(DST_JPG, "JPEG", quality=95)
    print(f"Wrote {DST_PNG} and {DST_JPG} ({w}x{h})")


if __name__ == "__main__":
    main()
