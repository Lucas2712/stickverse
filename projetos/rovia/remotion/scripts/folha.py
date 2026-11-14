# junta PNGs numa folha com rótulo de tempo: python3 scripts/folha.py saida.jpg colunas arquivos...
import sys
from PIL import Image, ImageDraw
out, cols, fs = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert("RGB") for f in fs]
w, h = 270, 480
rows = (len(ims) + cols - 1) // cols
c = Image.new("RGB", (cols * w + (cols - 1) * 6, rows * h + (rows - 1) * 6), (255, 0, 255))
for i, (im, f) in enumerate(zip(ims, fs)):
    im = im.resize((w, h)); d = ImageDraw.Draw(im)
    lab = f.split("q_")[-1].replace(".png", "")
    d.rectangle([0, 0, 60, 22], fill=(255, 0, 0)); d.text((4, 4), lab, fill=(255, 255, 255))
    c.paste(im, ((i % cols) * (w + 6), (i // cols) * (h + 6)))
c.save(out, quality=88)
