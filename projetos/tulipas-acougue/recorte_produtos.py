# recorta produtos dos encartes: máscara por distância à cor do fundo, tira etiqueta/rótulo e preenche por difusão
import numpy as np, sys, os
from PIL import Image, ImageFilter
from scipy import ndimage as nd
R="/workspace/stickverse/projetos/tulipas-acougue/"
P={ # nome: (arquivo, caixa do produto, caixa do rótulo)
 "acem":("encarte-bovinos",(110,495,570,800),(312,584,418,632)),
 "paleta":("encarte-bovinos",(595,535,1125,790),(880,582,996,628)),
 "mocoto":("encarte-bovinos",(90,795,580,1100),(337,916,469,965)),
 "rabo":("encarte-bovinos",(625,810,1135,1100),(892,916,1100,962)),
 "peito":("encarte-frango-suino",(60,475,565,785),(316,577,539,623)),
 "coxa":("encarte-frango-suino",(595,515,1125,785),(894,534,1074,627)),
 "pernil":("encarte-frango-suino",(85,835,580,1100),(336,909,571,957)),
 "linguica":("encarte-frango-suino",(645,810,1135,1100),(879,859,1034,957)),
}
META={}
for nome,(arq,cx,lb) in P.items():
    im=np.array(Image.open(R+"referencias/"+arq+".jpg").convert("RGB")).astype(float)
    x0,y0,x1,y1=cx; c=im[y0:y1,x0:x1].copy(); h,w,_=c.shape
    r,g,b=c[...,0],c[...,1],c[...,2]
    yel=(r>190)&(g>135)&(b<130)&(r-b>90)
    yel=nd.binary_opening(yel,iterations=2)
    lab,n=nd.label(yel); 
    if n: 
        sizes=nd.sum(yel,lab,range(1,n+1)); yel=lab==(1+int(np.argmax(sizes)))
    yy,xx=np.where(yel); tb=(xx.min(),yy.min(),xx.max(),yy.max())
    tag=np.zeros((h,w),bool)
    tag[max(0,tb[1]-4):tb[3]+5, max(0,tb[0]-4):]=True   # etiqueta até a borda direita (o preço some atrás da etiqueta nova)
    lx0,ly0,lx1,ly1=lb[0]-x0-6,lb[1]-y0-6,lb[2]-x0+6,lb[3]-y0+6
    tag[max(0,ly0):ly1, max(0,lx0):lx1]=True
    bg=np.array([96,21,14.])
    d=np.sqrt(((c-bg)**2*np.array([1,2,2])).sum(-1))
    fg=(d>48)&~tag
    fg=nd.binary_opening(fg,iterations=2)
    lab,n=nd.label(fg); sizes=nd.sum(fg,lab,range(1,n+1))
    keep=np.isin(lab,[i+1 for i,s in enumerate(sizes) if s>0.04*sizes.max()])
    a=nd.gaussian_filter(nd.binary_erosion(keep,iterations=1).astype(float),1.0)
    rgba=np.dstack([np.clip(c,0,255),a*255]).astype(np.uint8)
    Image.fromarray(rgba).save(R+"imagens/"+nome+".png")
    ty=min(max(0,tb[1]-4),max(0,ly0)); tx=min(max(0,tb[0]-4),max(0,lx0))
    META[nome]={"w":w,"h":h,"tag":[int(max(0,tb[0]-4)),int(max(0,tb[1]-4)),int(w),int(tb[3]+5)],"rot":[int(max(0,lx0)),int(max(0,ly0)),int(min(w,lx1)),int(ly1)]}
import json; json.dump(META,open(R+"imagens/recortes.json","w"),indent=1); print(META)
