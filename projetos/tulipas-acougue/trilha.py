#!/usr/bin/env python3
"""Trilha original do comercial (composta em código, sem amostras de terceiros).
120 BPM, 15 s. Batida = 0,5 s. Estrutura presa aos cortes do storyboard:
 0,0–0,5 riser · 0,5 impacto da logo · 1,5 AÇOUGUE! · 1,5–2,5 virada de caixa
 2,5–11,0 groove (bumbo 4/4, palmas 2 e 4, chimbal, baixo, metais) · 6,75 e 11,0 viradas
 11,5 retorno no encerramento · 14,0 impacto final + cauda até 15,0
Saída: musica.wav (48 kHz estéreo) → musica.mp3
"""
import numpy as np, subprocess
from scipy import signal
SR=48000; DUR=15.0; N=int(SR*DUR); B=0.5
L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(7)
def t_(d): return np.arange(int(SR*d))/SR
def put(x,t,g=1.0,pan=0.0):
    i=int(t*SR); x=x[:max(0,N-i)]
    if i<0 or len(x)==0: return
    L[i:i+len(x)]+=x*g*np.sqrt(0.5*(1-pan)); R[i:i+len(x)]+=x*g*np.sqrt(0.5*(1+pan))
def lpv(x,f0,f1,k,t):
    w=np.exp(-t*k); return lp(x,f0)*w+lp(x,f1)*(1-w)
def lp(x,f,o=2): b,a=signal.butter(o,f/(SR/2),'low'); return signal.lfilter(b,a,x)
def hp(x,f,o=2): b,a=signal.butter(o,f/(SR/2),'high'); return signal.lfilter(b,a,x)
def bp(x,f1,f2): b,a=signal.butter(2,[f1/(SR/2),f2/(SR/2)],'band'); return signal.lfilter(b,a,x)
def noise(d): return rng.uniform(-1,1,int(SR*d))
def kick(big=False):
    t=t_(0.55 if big else 0.38); f=48+ (170 if big else 130)*np.exp(-t*28)
    x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*(5 if big else 8.5))
    x[:int(.004*SR)]+=hp(noise(.004),2000)*.6
    return np.tanh(x*1.6)
def snare():
    t=t_(.25); tone=np.sin(2*np.pi*190*t)*np.exp(-t*30)
    n=bp(noise(.25),1500,9000)*np.exp(-t*18); return tone*.5+n*.8
def clap():
    t=t_(.3); x=np.zeros(len(t))
    for k,o in enumerate([0,.011,.022,.034]):
        i=int(o*SR); m=len(t)-i; x[i:]+=bp(noise(.3),900,6000)[:m]*np.exp(-t[:m]*(60 if k<3 else 14))
    return x*.7
def hat(open_=False):
    d=.22 if open_ else .05; t=t_(d); return hp(noise(d),7000,4)*np.exp(-t*(14 if open_ else 70))
def crash(d=2.2):
    t=t_(d); return hp(noise(d),4500,2)*np.exp(-t*2.2)*.6
def saw(f,d,det=0.0):
    t=t_(d); return signal.sawtooth(2*np.pi*f*(1+det)*t)
def bassnote(f,d):
    t=t_(d); x=saw(f,d)*.6+np.sin(2*np.pi*f/2*t)*.7
    env=np.minimum(1,t/.004)*np.exp(-t*3.5)
    return np.tanh(lpv(x,1600,700,14,t)*env*1.4)
def stab(freqs,d=.22):
    t=t_(d); x=sum(saw(f,d,dt) for f in freqs for dt in (-.006,0,.007))/ (len(freqs)*3)
    env=np.minimum(1,t/.006)*np.exp(-t*9)
    return lpv(x,4400,900,5,t)*env*2.2
def riser(d):
    t=t_(d); f=np.exp(np.linspace(np.log(200),np.log(5000),len(t)))
    n=noise(d); y=np.zeros_like(n)
    for s in range(0,len(n),2400):
        e=min(len(n),s+2400); fc=f[s]; y[s:e]=bp(n[max(0,s-2400):e],fc*.7,min(fc*1.4,20000))[-(e-s):]
    return y*(t/d)**2
def boom(d=1.6):
    t=t_(d); x=np.sin(2*np.pi*np.cumsum(38+70*np.exp(-t*9))/SR)*np.exp(-t*2.4)
    return np.tanh(x*2)
# notas (Mi menor): E1=41.2
E1,G1,A1,B1,D2=41.2,49.0,55.0,61.7,73.4
CH={'Em':[164.8,196.0,246.9,329.6],'C':[130.8,196.0,261.6,329.6],'D':[146.8,220.0,293.7,370.0],'Bm':[123.5,185.0,246.9,293.7]}
PROG=['Em','C','D','Bm']
# ---- abertura ----
put(riser(.5),0.0,.35,0); put(boom(),0.5,.9); put(crash(2.5),0.5,.55,-.2); put(kick(True),0.5,1.0)
put(stab(CH['Em'],.5),0.5,.55,.1)
put(kick(True),1.5,.9); put(crash(1.5),1.5,.35,.25); put(stab(CH['Em'],.4),1.5,.6)
for k in range(8): put(snare(),1.5+k*.125+ (0 if k<4 else 0),.25+.06*k, (-.4 if k%2 else .4))
put(riser(1.0),1.5,.25)
# ---- groove ----
def groove(a,b,bar0=0):
    t=a; i=0
    while t<b-1e-6:
        beat=i%4; bar=(bar0+i//4)
        put(kick(),t,.95)
        if beat in (1,3): put(clap(),t,.55,.05); put(snare(),t,.3)
        put(hat(),t+.25,.22,.35); put(hat(),t+.125,.09,-.3); put(hat(),t+.375,.09,-.3)
        if beat==3: put(hat(True),t+.25,.15,.35)
        ch=PROG[bar%4]; root={'Em':41.2,'C':65.4,'D':73.4,'Bm':61.7}[ch]
        put(bassnote(root,.24),t+.25,.55); put(bassnote(root*2,.12),t+.375,.25)
        if beat in (0,): put(stab(CH[ch],.2),t,.42,-.15)
        if beat==2: put(stab(CH[ch],.15),t+.25,.32,.15)
        t+=B; i+=1
groove(2.5,6.75,0)
for k in range(4): put(snare(),6.75+k*.0625,.3+.08*k,.3*(-1)**k)
put(riser(.25),6.75,.3)
put(crash(1.6),7.0,.4,.2); groove(7.0,11.0,2)
put(riser(.5),11.0,.35); put(snare(),11.0,.3); put(snare(),11.25,.4)
put(kick(True),11.5,1.0); put(boom(1.2),11.5,.6); put(crash(2),11.5,.5,-.2); put(stab(CH['Em'],.4),11.5,.5)
groove(12.0,14.0,0)
put(kick(True),14.0,1.0); put(boom(1.0),14.0,.9); put(crash(1.0),14.0,.6); put(stab(CH['Em'],.9),14.0,.7)
# ---- sidechain (bombeia com o bumbo nos trechos com groove) ----
env=np.ones(N); 
for tk in np.arange(2.5,14.0,B):
    i=int(tk*SR); d=int(.18*SR); env[i:i+d]=np.minimum(env[i:i+d],0.55+0.45*np.linspace(0,1,d)**1.5)
# reverb curta
ir=noise(.9)*np.exp(-t_(.9)*6); ir=lp(ir,6000); ir/=np.abs(ir).sum()**.5*8
rl=signal.fftconvolve(L,ir)[:N]; rr=signal.fftconvolve(R,ir[::-1])[:N]
L2=L+rl*.25; R2=R+rr*.25
fade=np.ones(N); i=int(14.6*SR); fade[i:]=np.linspace(1,0,N-i)**2
mix=np.stack([L2,R2],1)*fade[:,None]
mix=np.tanh(mix*1.2)/np.tanh(1.2); mix/=np.abs(mix).max()*1.12
import wave
w=wave.open("musica.wav","wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype('<i2').tobytes()); w.close()
subprocess.run(["ffmpeg","-v","error","-y","-i","musica.wav","-b:a","192k","musica.mp3"],check=True)
print("ok musica.mp3")
