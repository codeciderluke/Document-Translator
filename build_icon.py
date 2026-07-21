"""Generate the app icon (.ico) and web favicon from the in-app logo mark.

Requires: playwright (with chromium) and pillow.
Run: python build_icon.py
"""

from __future__ import annotations

import io
import os

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
ICO_APP = os.path.join(ROOT, "backend", "app_icon.ico")
ICO_WEB = os.path.join(ROOT, "frontend", "public", "favicon.ico")

# Rounded-square badge with the app's "languages" glyph, drawn at 512px.
HTML = """
<html><body style="margin:0">
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <g transform="translate(96,96) scale(13.33)"
     fill="none" stroke="#ffffff" stroke-width="1.9"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>
  </g>
</svg>
</body></html>
"""

SIZES = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]


def render_png() -> bytes:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_context(viewport={"width": 512, "height": 512}).new_page()
        page.set_content(HTML)
        png = page.screenshot(omit_background=True)
        browser.close()
    return png


def main() -> None:
    img = Image.open(io.BytesIO(render_png())).convert("RGBA")
    for path in (ICO_APP, ICO_WEB):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        img.save(path, format="ICO", sizes=SIZES)
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
