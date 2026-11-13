# v3 · plano musical narrativo: tensão → abafado → SILÊNCIO → queda na marca → pulso → virada → resolução
# Uso: python3 -I audio/plano_musica_v3.py audio/trilha/ambiant-hope-original.ogg audio/trilha/ambiant-hope-beats.npy
import json,sys,subprocess,numpy as np,os,re,unicodedata
src,bp=sys.argv[1],sys.argv[2]; beats=np.load(bp)
R=os.path.dirname(os.path.abspath(__file__))+'/..'
P=json.load(open(R+'/remotion/src/audio/palavras.json'))
end=[c['palavras'][-1]['e'] for c in P]
SIL=0.6                                   # silêncio antes da marca
GAP=[0.35,0.15+SIL+0.7,0.45,0.45,0.45,0.85]
norm=lambda s: re.sub(r'[^\w]','',unicodedata.normalize('NFD',s.lower()).encode('ascii','ignore').decode())
def w(c,word,N,k=1):
    n=0
    for x in P[c-1]['palavras']:
        if norm(x['w'])==norm(word):
            n+=1
            if n==k: return N[c-1]+x['s']
def mkN(d4=0,d5=0):
    N=[0.3]
    for i,g in enumerate(GAP): N.append(N[-1]+end[i]+g)
    N[3]+=d4; N[4]+=d4+d5; N[5]+=d4+d5; N[6]+=d4+d5
    return N
snap=lambda t: float(beats[np.argmin(abs(beats-t))])
m2,m3,m4=snap(72.9),snap(154.3),snap(280.4)
REV=lambda N: N[1]+end[1]+0.15+SIL      # revelação da marca = fim do silêncio
best=None
for d4 in np.arange(-0.2,0.21,0.02):
  for d5 in np.arange(-0.2,0.21,0.02):
    N=mkN(d4,d5); V2=REV(N); vb=np.array([V2+(b-m2) for b in beats if m2<=b<=m2+70])
    ev=[w(4,'acompanhar',N),w(4,'organizar',N),w(4,'receitas',N),w(4,'despesas',N),w(4,'visualizar',N),w(4,'compromissos',N),w(4,'simples',N),w(4,'organizada',N),w(5,'visão',N),w(5,'responsabilidades',N)]
    err=sum(min(abs(vb-e)) for e in ev)
    if best is None or err<best[0]: best=(err,d4,d5)
N=mkN(best[1],best[2]); V2=REV(N)
fr=w(2,'fica',N); e2=N[1]+end[1]
vb2=[V2+(b-m2) for b in beats if m2<=b<=m2+80]
V3=min(vb2,key=lambda x: abs(x-(w(5,'enxergar',N)-0.1)))     # virada brilhante: «enxergar com mais clareza»
vb3=[V3+(b-m3) for b in beats if m3<=b<=m3+30]
V4=min(vb3,key=lambda x: abs(x-(N[6]-0.8)))                   # resolução: bússola final
dur=round(max(V4+(288.88-m4)+0.1, N[6]+end[6]+2.6),2)
out=R+'/audio/trilha/trilha-editada.wav'
rs=max(0.0,fr-3.0)
segs=[ # (m_in, m_out, v_in, fade_in, fade_out, filtro)
 (0.0, rs+0.1, 0.0, 0.8, 0.1, ""),
 (rs, fr+0.12, rs, 0.1, 0.06, f"highpass=f=180,volume=1.15,"),          # tensão: subida mais seca até o congelamento
 (fr, e2+0.15, fr, 0.06, 0.35, "lowpass=f=700,volume=0.55,"),            # congelado: abafado, enquanto a bússola procura
 (m2, m2+(V3-V2)+0.05, V2, 0.005, 0.05, ""),                               # QUEDA na marca (depois de 0,6 s de silêncio)
 (m3, m3+(V4-V3)+0.6, V3, 0.01, 0.6, ""),                                  # virada brilhante
 (m4, 288.88, V4, 0.6, 1.0, ""),                                          # resolução real da faixa
]
inp=[];fl=[]
for i,(a,b,v,fi,fo,flt) in enumerate(segs):
    inp+=["-i",src]; d=b-a; ms=int(round(v*1000))
    fl.append(f"[{i}:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,{flt}afade=t=in:d={fi},afade=t=out:st={max(0,d-fo):.3f}:d={fo},adelay={ms}|{ms}[s{i}]")
fl.append("".join(f"[s{i}]" for i in range(len(segs)))+f"amix=inputs={len(segs)}:normalize=0,atrim=0:{dur},loudnorm=I=-18:TP=-2:LRA=11[o]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fl),"-map","[o]","-ar","48000","-ac","2",out],check=True)
vb=[float(b) for b in beats if b<fr]+[V2+(b-m2) for b in beats if m2<=b<m2+(V3-V2)]+[V3+(b-m3) for b in beats if m3<=b<m3+(V4-V3)]+[V4+(b-m4) for b in beats if m4<=b<=288.9]
json.dump({"N":[round(float(x),3) for x in N],"DURACAO":dur,"V2":round(V2,3),"V3":round(V3,3),"V4":round(V4,3),"freeze":round(fr,3),"silencio":[round(e2+0.15,3),round(V2,3)],"musica":{"m2in":m2,"m3in":m3,"m4in":m4},"beats":[round(x,3) for x in vb]},open(R+'/remotion/src/audio/musica.json','w'))
print("N",[round(float(x),2) for x in N],"| freeze",round(fr,2),"| silêncio",round(e2+0.15,2),"→",round(V2,2),"| virada",round(V3,2),"| final",round(V4,2),"| dur",dur)
