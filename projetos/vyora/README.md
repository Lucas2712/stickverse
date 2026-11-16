# VYORA · comercial de portfólio (Studio Matteu)

Comercial vertical de 41,4 s (1080×1920, 30 fps; abertura de 2,4 s com o avião + 39 s de filme) para a marca fictícia **VYORA**, aplicativo de viagens com
inteligência artificial. Feito em **React + Remotion** (projeto isolado nesta pasta; não usa o motor do estúdio).

## Como renderizar

    cd projetos/vyora
    npm install
    npm run rascunho      # meia resolução, para conferir
    npm run final         # saida/vyora.mp4 (render do Remotion + ganho final de volume; usa /opt/pw-browsers/chromium)

## Organização

    src/Raiz.jsx              composição do Remotion (carrega a fonte Inter)
    src/Vyora.jsx             linha do tempo em tela cheia: abertura do avião, 9 cenas e as 4 faixas de áudio
    src/lib.jsx               tempo absoluto (useT), curvas, <Cena>, texto cinético, toque
    src/audio.js              arquivos, volumes, fades e ducking da trilha
    src/componentes/          Logo, Icones, App (peças da interface)
    src/cenas/C0Aviao         abertura: o avião passa antes da narração
    src/cenas/C1…C9           uma cena por arquivo, com os tempos da narração
    src/dados/mapa.json       pontos do mapa (Natural Earth 1:110m; gerar_mapa.mjs)
    public/imagens            avião (recortado), céu e passageira, gerados no OpenArt
    public/fontes             Inter variável + licença OFL
    public/audio              avião, narração, trilha e faixa de efeitos
    som/eventos.json          mapa de sound design (tempo, tipo, cena, movimento)
    musica/                   faixa original e candidatas com licença conferida
    storyboard.*              storyboard aprovado · transcricao.md / palavras.json: tempos da narração

Créditos de áudio em `CREDITOS-SONS.md`.
