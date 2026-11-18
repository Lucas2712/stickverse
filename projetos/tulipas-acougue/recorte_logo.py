# extrai a logo Tulipas (branco + amarelo) da imagem enviada; a faixa SUPERMERCADOS mantém as letras vermelhas
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
im=np.array(Image.open("referencias/logo-tulipas.jpg").convert("RGB")).astype(float)
r,g,b=im[...,0],im[...,1],im[...,2]
white=(r>215)&(g>205)&(b>200)
yel=(r>200)&(g>130)&(b<140)&(r-b>80)
m=white|yel
m[:90]=False; m[680:]=False
lab,n=nd.label(nd.binary_dilation(m,iterations=2)); sz=nd.sum(m,lab,range(1,n+1))
m&=np.isin(lab,[i+1 for i,s in enumerate(sz) if s>300])
ys,xs=np.where(m); print("bbox",xs.min(),ys.min(),xs.max(),ys.max())
# faixa: linhas onde o amarelo ocupa larga extensão
rows=[y for y in range(im.shape[0]) if yel[y].sum()>250]; print("faixa",rows[0],rows[-1])
band=np.zeros_like(m); band[rows[0]:rows[-1]+1]=True
fill=nd.binary_fill_holes(yel&band)|nd.binary_closing(yel&band,iterations=6)
fill&=band
a=(m|fill).astype(float)
# suaviza bordas com a mistura real: alfa proporcional à distância do vermelho do fundo
ac=np.clip(nd.gaussian_filter(a,0.7),0,1)
out=im.copy()
red=fill&~yel&~white; out[red]=[200,30,35]
x0,y0,x1,y1=xs.min()-6,ys.min()-6,xs.max()+7,ys.max()+7
rgba=np.dstack([out,ac*255]).astype(np.uint8)[y0:y1,x0:x1]
I=Image.fromarray(rgba)
I=I.resize((I.width*2,I.height*2),Image.LANCZOS).filter(ImageFilter.UnsharpMask(2,60,2))
I.save("imagens/logo-tulipas.png"); print(I.size)
