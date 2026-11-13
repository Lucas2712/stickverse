# Mixagem final fora do Remotion, com os mesmos dados (falas, efeitos+ganhos, trilha com arco e ducking de cues.js)
import json,subprocess,sys,numpy as np
d=json.load(open(sys.argv[1])); out=sys.argv[2]; SR=48000; DUR=d['DURACAO']; n=int(DUR*SR)
def load(p):
    raw=subprocess.run(["ffmpeg","-v","error","-i",p,"-ac","2","-ar",str(SR),"-f","f32le","-"],capture_output=True,check=True).stdout
    return np.frombuffer(raw,np.float32).reshape(-1,2)
mix=np.zeros((n,2),np.float32)
def put(x,t,g=1.0):
    i=int(round(t*SR)); 
    if i<0: x=x[-i:]; i=0
    m=min(len(x),n-i); 
    if m>0: mix[i:i+m]+=x[:m]*g
for i,t in enumerate(d['N']): put(load(f"public/audio/cena{i+1}.mp3"),t)          # narração
for t,nome,g,*_ in d['sfx']: put(load(f"public/sfx/{nome}.wav"),t,g)               # efeitos
mus=load("public/audio/trilha.wav")[:n]                                             # trilha com arco × ducking
tt=np.arange(len(mus))/SR; M=d['MUS']; N=d['N']
arco=np.interp(tt,[0,M['freeze'],M['V2'],M['V2']+0.01,N[3],M['V3'],M['V4'],DUR],[0.7,0.95,0.95,1.15,0.95,1.2,1.1,1.0])
duck=np.ones_like(tt)
for a,b in zip(N,d['FIMS']):
    dist=np.where(tt<a,a-tt,np.where(tt>b,tt-b,0)); duck=np.minimum(duck,np.interp(dist,[0,0.3],[0.38,1]))
mix[:len(mus)]+=mus*(0.5*arco*duck)[:,None]
subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","2","-i","-","-c:a","pcm_s24le",out],input=mix.tobytes(),check=True)
print("ok",out,round(DUR,2),"s | pico",round(float(np.abs(mix).max()),3))
