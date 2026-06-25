"""Remove background from generated car image -> true transparent PNG."""
import sys
from rembg import remove, new_session
from PIL import Image

src = r"D:\Sites\Clienti\43. CarEval\careval-web\public\images\generated\car-raw.png"
dst = r"D:\Sites\Clienti\43. CarEval\careval-web\public\images\generated\car-cutout.png"

session = new_session("isnet-general-use")  # high-quality general segmentation

img = Image.open(src).convert("RGBA")
out = remove(
    img,
    session=session,
    alpha_matting=True,
    alpha_matting_foreground_threshold=270,
    alpha_matting_background_threshold=20,
    alpha_matting_erode_size=11,
)

# Crop to content bounding box so the car fills the frame
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)

out.save(dst)
print(f"OK -> {dst}  size={out.size}")
