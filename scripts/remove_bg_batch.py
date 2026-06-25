"""Batch background removal: raw-*.png -> *-cut.png (true transparent, cropped to content)."""
from rembg import remove, new_session
from PIL import Image
import os

GEN = r"D:\Sites\Clienti\43. CarEval\careval-web\public\images\generated"

# (source raw file, output cutout file)
JOBS = [
    ("raw-accident.png", "accident-cut.png"),
    ("raw-fleet.png", "fleet-cut.png"),
    ("raw-trophy.png", "trophy-cut.png"),
    ("raw-money.png", "money-cut.png"),
    ("raw-seal.png", "seal-cut.png"),
    ("raw-docs.png", "docs-cut.png"),
    ("raw-inspect.png", "inspect-cut.png"),
]

session = new_session("isnet-general-use")

for src_name, dst_name in JOBS:
    src = os.path.join(GEN, src_name)
    dst = os.path.join(GEN, dst_name)
    if not os.path.exists(src):
        print(f"SKIP (missing): {src_name}")
        continue
    img = Image.open(src).convert("RGBA")
    out = remove(
        img,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=270,
        alpha_matting_background_threshold=20,
        alpha_matting_erode_size=11,
    )
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(dst)
    print(f"OK {dst_name}  {out.size}")

print("ALL DONE")
