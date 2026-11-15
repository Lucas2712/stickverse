# VYORA · comercial de portfólio (Studio Matteu)

Comercial vertical de 39 s (1080×1920, 30 fps) para a marca fictícia **VYORA**, aplicativo de viagens com
inteligência artificial. Feito em **React + Remotion** (projeto isolado nesta pasta; não usa o motor do estúdio).

## Como renderizar

    cd projetos/vyora
    npm install
    npm run rascunho      # meia resolução, para conferir
    npm run render        # saida/vyora.mp4 (usa o Chromium do ambiente em /opt/pw-browsers/chromium)

## Organização

    src/Raiz.jsx              composição do Remotion (carrega a fonte Inter)
    src/Vyora.jsx             linha do tempo: bancada, tela vertical, 9 cenas e as 3 faixas de áudio
    src/lib.jsx               tempo absoluto (useT), curvas, <Cena>, texto cinético, toque
    src/audio.js              arquivos, volumes, fades e ducking da trilha
    src/componentes/          Logo, Icones, App (peças da interface), Bancada
    src/cenas/C1…C9           uma cena por arquivo, com os tempos da narração
    src/dados/mapa.json       pontos do mapa (Natural Earth 1:110m; gerar_mapa.mjs)
    public/imagens            avião (recortado), céu e passageira, gerados no OpenArt
    public/fontes             Inter variável + licença OFL
    public/audio              narração, trilha e faixa de efeitos
    som/eventos.json          mapa de sound design (tempo, tipo, cena, movimento)
    musica/                   faixa original e candidatas com licença conferida
    storyboard.*              storyboard aprovado · transcricao.md / palavras.json: tempos da narração

Créditos de áudio em `CREDITOS-SONS.md`.
