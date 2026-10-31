#!/usr/bin/env python3
"""Gera a narração do Ep. 1 de ÚLTIMO SINAL com o ElevenLabs e monta a faixa final.

Uso:
    ELEVENLABS_API_KEY=... python3 roteiros/tts/gerar_narracao.py

Vozes (opcional): ELEVEN_VOICE_NARRADOR, ELEVEN_VOICE_TV, ELEVEN_VOICE_MAE,
ELEVEN_VOICE_OSWALD com o voice_id de cada voz da sua biblioteca.

Saída em roteiros/tts/saida/: um MP3 por fala + narracao_ep01.wav com todas as
falas posicionadas nos tempos do roteiro (precisa de ffmpeg).
"""
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

API = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128"
MODEL = "eleven_multilingual_v2"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "saida")
DURACAO_TOTAL = 92

# voice_id padrão = vozes prontas do ElevenLabs; troque pelas da sua biblioteca.
VOZES = {
    "NARRADOR": {
        "voice_id": os.environ.get("ELEVEN_VOICE_NARRADOR", "pNInz6obpgDQGcFmaJgB"),
        "settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.15},
        "filtro": "acompressor=threshold=-18dB:ratio=3,aecho=0.8:0.5:30:0.15",
    },
    "TV": {
        "voice_id": os.environ.get("ELEVEN_VOICE_TV", "21m00Tcm4TlvDq8ikWAM"),
        "settings": {"stability": 0.6, "similarity_boost": 0.75, "style": 0.0},
        # som de alto-falante pequeno, mais baixo que a narração
        "filtro": "highpass=f=300,lowpass=f=3000,volume=-6dB",
    },
    "MAE": {
        "voice_id": os.environ.get("ELEVEN_VOICE_MAE", "EXAVITQu4vr4xnSDxMaL"),
        "settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.2},
        "filtro": "volume=-2dB",
    },
    "OSWALD": {
        "voice_id": os.environ.get("ELEVEN_VOICE_OSWALD", "VR6AewLTigWG4xSOukaG"),
        "settings": {"stability": 0.4, "similarity_boost": 0.75, "style": 0.3},
        # abafado, atrás da porta
        "filtro": "lowpass=f=1800,volume=-2dB",
    },
}

# (início em segundos, voz, texto, estabilidade opcional)
FALAS = [
    (0, "NARRADOR", 'Ninguém sabia… <break time="0.5s"/> que aquele era o Dia 1.'),
    (4, "TV", "…casos de agressão em três hospitais da cidade. As autoridades pedem calma e que…"),
    (9, "MAE", 'Plantão vai atrasar. Tranca a porta. <break time="0.5s"/> Te amo.'),
    (16, "NARRADOR", 'Você mora no quarto andar… <break time="0.5s"/> em cima da lavanderia do senhor Óswald.'),
    (21, "NARRADOR", 'Às seis e catorze… <break time="1.0s"/> a cidade apaga.'),
    (26, "NARRADOR", 'Lá embaixo… <break time="0.5s"/> alguém grita.'),
    (31, "NARRADOR", 'Um homem pula em outro. <break time="0.5s"/> No meio da rua.'),
    (36, "NARRADOR", 'Helicópteros. <break time="0.5s"/> Fogo no horizonte. <break time="0.5s"/> E na ponte… luzes militares.'),
    (47, "NARRADOR", 'Você liga pra sua mãe. <break time="0.5s"/> Chama… <break time="0.5s"/> chama… <break time="1.0s"/> caixa postal.'),
    (52, "NARRADOR", 'Então… <break time="1.0s"/> três batidas na porta.'),
    (56, "NARRADOR", 'Pelo olho mágico… <break time="0.5s"/> o senhor Óswald.'),
    (60, "OSWALD", 'Kai… me deixa entrar. <break time="0.5s"/> Um deles me pegou.', 0.6),
    (65, "NARRADOR", 'Regra número um. <break time="1.0s"/> No Dia 1… <break time="0.5s"/> todo mundo ainda parece gente.'),
    (71, "TV", "…os mordidos… mudam em minutos… não se aproxi—"),
    (76, "NARRADOR", 'Do outro lado… <break time="1.0s"/> a respiração dele muda.'),
    (80, "OSWALD", 'Kai… <break time="1.0s"/> por favor.', 0.25),
    (84, "NARRADOR", 'Ele te conhece desde que você era criança. <break time="1.0s"/> Você abre… <break time="0.5s"/> ou deixa ele lá fora?'),
    (88, "NARRADOR", 'Comenta aí embaixo. <break time="0.5s"/> Dia 2… amanhã.'),
]


def gerar(chave, voz, texto, estabilidade, destino):
    cfg = VOZES[voz]
    settings = dict(cfg["settings"])
    if estabilidade is not None:
        settings["stability"] = estabilidade
    corpo = json.dumps({"text": texto, "model_id": MODEL, "voice_settings": settings}).encode()
    req = urllib.request.Request(
        API.format(voice_id=cfg["voice_id"]),
        data=corpo,
        headers={"xi-api-key": chave, "Content-Type": "application/json", "Accept": "audio/mpeg"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r, open(destino, "wb") as f:
            f.write(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Erro {e.code} gerando '{texto[:40]}…': {e.read().decode(errors='replace')}")


def montar(arquivos):
    entradas, filtros, rotulos = [], [], []
    for i, (inicio, voz, caminho) in enumerate(arquivos):
        entradas += ["-i", caminho]
        ms = int(inicio * 1000)
        filtros.append(f"[{i}:a]{VOZES[voz]['filtro']},adelay={ms}|{ms}[a{i}]")
        rotulos.append(f"[a{i}]")
    filtros.append(
        f"{''.join(rotulos)}amix=inputs={len(rotulos)}:normalize=0,"
        f"apad=whole_dur={DURACAO_TOTAL},alimiter=limit=0.9[out]"
    )
    destino = os.path.join(OUT, "narracao_ep01.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", *entradas, "-filter_complex", ";".join(filtros),
         "-map", "[out]", "-ar", "44100", "-ac", "2", destino],
        check=True,
    )
    return destino


def main():
    chave = os.environ.get("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit("Defina ELEVENLABS_API_KEY.")
    os.makedirs(OUT, exist_ok=True)
    arquivos = []
    for n, (inicio, voz, texto, *resto) in enumerate(FALAS, 1):
        destino = os.path.join(OUT, f"{n:02d}_{inicio:02d}s_{voz.lower()}.mp3")
        if not os.path.exists(destino):
            print(f"[{n:02d}/{len(FALAS)}] {voz}: {texto[:50]}")
            gerar(chave, voz, texto, resto[0] if resto else None, destino)
        arquivos.append((inicio, voz, destino))
    print("Faixa montada:", montar(arquivos))


if __name__ == "__main__":
    main()
