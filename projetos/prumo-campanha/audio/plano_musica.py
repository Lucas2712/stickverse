# Gera N (início de cada fala), a grade de batidas do vídeo e a trilha editada nos tempos fortes.
# Uso: python3 -I audio/plano_musica.py <faixa.ogg> <beats.npy>
import json,sys,subprocess,numpy as np,os
src,bp=sys.argv[1],sys.argv[2]; beats=np.load(bp)
R=os.path.dirname(os.path.abspath(__file__))+'/..'
P=json.load(open(R+'/remotion/src/audio/palavras.json'))
end=[c['palavras'][-1]['e'] for c in P]
GAP=[0.3,0.8,0.35,0.35,0.4,0.9]
def mkN(d4=0,d5=0):
    N=[0.2]
    for i,g in enumerate(GAP): N.append(N[-1]+end[i]+g)
    N[3]+=d4; N[4]+=d4+d5; N[5]+=d4+d5; N[6]+=d4+d5
    return N
def w(c,word,N,k=1):
    import unicodedata,re
    norm=lambda s: re.sub(r'[^\w]','',unicodedata.normalize('NFD',s.lower()).encode('ascii','ignore').decode())
    n=0
    for x in P[c-1]['palavras']:
        if norm(x['w'])==norm(word):
            n+=1
            if n==k: return N[c-1]+x['s']
snap=lambda t: float(beats[np.argmin(abs(beats-t))])
m2,m3,m4=snap(72.9),snap(154.3),snap(281.6)
def V2of(N): return N[1]+[x for x in P[1]['palavras'] if x['w'].startswith('negócio')][0]['e']-0.15+0.45
best=None
for d4 in np.arange(-0.2,0.21,0.02):
  for d5 in np.arange(-0.2,0.21,0.02):
    N=mkN(d4,d5); V2=V2of(N); vb=np.array([V2+(b-m2) for b in beats if m2<=b<=m2+60])
    ev=[w(4,'acompanhar',N)+0.45,w(4,'organizar',N),w(4,'receitas',N),w(4,'despesas',N),w(4,'visualizar',N)+0.35,w(4,'compromissos',N),w(5,'responsabilidades',N),w(5,'dinheiro',N)-0.15]
    err=sum(min(abs(vb-e)) for e in ev)
    if best is None or err<best[0]: best=(err,d4,d5)
N=mkN(best[1],best[2]); V2=V2of(N)
V3=N[4]+end[4]+0.45                       # mesa/retorno (ato 6) começa na virada brilhante
vb3=[V3+(b-m3) for b in beats if m3<=b<=m3+20]
V4=min(vb3,key=lambda x: abs(x-(N[6]-0.75)))
fr=N[1]+[x for x in P[1]['palavras'] if x['w']=='fica'][0]['s']
dur=round(max(V4+(288.88-m4)+0.1, N[6]+end[6]+2.3),2)
out=R+'/audio/trilha/trilha-editada.wav'
segs=[(0.0,fr+0.15,0.0,0.8,0.15,""),(fr-0.15,V2+0.04,fr-0.15,0.15,0.04,"lowpass=f=1100,volume=0.6,"),(m2,m2+(V3-V2)+0.05,V2,0.01,0.06,""),(m3,m3+(V4-V3)+0.6,V3,0.02,0.6,""),(m4,288.88,V4,0.6,1.2,"")]
inp=[];fl=[]
for i,(a,b,v,fi,fo,flt) in enumerate(segs):
    inp+=["-i",src]; d=b-a; ms=int(round(v*1000))
    fl.append(f"[{i}:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,{flt}afade=t=in:d={fi},afade=t=out:st={d-fo:.3f}:d={fo},adelay={ms}|{ms}[s{i}]")
fl.append("".join(f"[s{i}]" for i in range(len(segs)))+f"amix=inputs={len(segs)}:normalize=0,atrim=0:{dur},loudnorm=I=-18:TP=-2:LRA=11[o]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fl),"-map","[o]","-ar","48000","-ac","2",out],check=True)
vb=[float(b) for b in beats if b<fr+0.15]+[V2+(b-m2) for b in beats if m2<=b<m2+(V3-V2)]+[V3+(b-m3) for b in beats if m3<=b<m3+(V4-V3)]+[V4+(b-m4) for b in beats if m4<=b<=288.9]
json.dump({"N":[round(x,3) for x in N],"DURACAO":dur,"V2":round(V2,3),"V3":round(V3,3),"V4":round(V4,3),"freeze":round(fr,3),"musica":{"m2in":m2,"m3in":m3,"m4in":m4},"beats":[round(x,3) for x in vb]},open(R+'/remotion/src/audio/musica.json','w'))
print("N",[round(x,2) for x in N],"V2",round(V2,2),"V3",round(V3,2),"V4",round(V4,2),"DURACAO",dur,"erro batidas",round(best[0],2))
