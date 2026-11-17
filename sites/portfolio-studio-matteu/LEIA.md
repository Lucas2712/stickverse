# Portfólio Studio Matteu

Site do Studio Matteu montado sobre a landing page **Kairo** (ProfitizeBuild): um enxame de cursores monta a página
na frente de quem visita. Vite sem framework, GSAP, Anton, Caveat e Manrope (Fontsource, licença OFL).

    npm ci            # instala as versões travadas
    npm run dev       # http://localhost:5300 (?pronto abre já montada)
    npm run build     # gera dist/ para Vercel, Netlify, Hostinger...

## O que foi personalizado
- Marca, textos, números, trajetória, ferramentas, contato e o símbolo: um "M" preto no bloco vermelho em `nav.html`, no logo da abertura em `src/motion/enxame.js` e em `public/favicon.svg`.
- Foto do hero: foto real do fundador (`fonte/retrato-matteu.webp`), recortada com o SAM da Meta (Apache 2.0)
  e salva em `public/img/matteu-perfil.webp`.
- Telas dos projetos e o storyboard do comparador: composições feitas em HTML para este site
  (`public/img/proj-*.webp`, `wire-pulso.webp`). Projetos fictícios.
- Logos das ferramentas: Simple Icons (CC0). Adobe, Midjourney e Runway não estão no Simple Icons e viraram
  ícones genéricos (camadas, filme, pena, imagem, faísca, quadros).

## Pendente
- Contato: WhatsApp (11) 95201-4743 e Instagram @studiomatteu. Sem e-mail, agenda e Behance por enquanto:
  o botão "Começar uma conversa" e o formulário abrem o WhatsApp.
- Números, projetos, formação e trajetória são fictícios: revisar antes de publicar como site real.

## Celular (otimização de 17/11/2026)
Tudo o que é do celular fica em `src/styles/celular.css`, carregado por último; o desktop não muda.
- A escala acompanha a largura de 360 a 430 px; títulos com `text-wrap: balance` (sem palavra sozinha).
- Projetos no carrossel lateral com encaixe, com imagens 4:5 próprias do celular (`public/img/*-v.webp`, via
  `<picture>`); o comparador também fica em 4:5.
- Cinzas clareados para leitura (`--texto-2` #cdc6c5, `--texto-3` #aaa2a1) e o pé do PORTFÓLIO menos escuro.
- Áreas de toque de 44 px (nav, abas, rodapé, botões da barra) e margens seguras do iPhone (notch e indicador).
- Celular deitado: o hero segue a largura em vez de espremer na altura.

## Projetos
- 01 **Kavora** (app de gestão de hotel), 02 **MIO Creative** e 03 **Most Used Apps** (cortado em 12,28 s, antes da
  assinatura final): motion, vertical 9:16, 2026. Kavora foi trabalho para cliente (etiqueta "Cliente"); os outros dois, "Estudo". Cada card roda `public/video/<nome>.mp4` em loop,
  sem som, só enquanto aparece na tela (`src/motion/videos.js`); o link abre `<nome>-som.mp4`, com som. Originais em
  `fonte/`. As abas ficaram Todos · Motion.
- Formato: `--ar`/`--arm` em cada card é a proporção da tela; no desktop as telas de uma linha ficam com a mesma
  altura, no celular o carrossel é uma tira de cards da mesma altura.
- Textos: os cinzas (`--texto-2`, `--texto-3`) viraram branco a pedido; nada de palavra escura no site.
- O comparador "Do rascunho. Ao ar." mostra o **Lume**, projeto conceito (luminária inteligente) desenhado em HTML para
  o site: storyboard (`wire-lume`) e quadros finais (`proj-lume`), 16:10 no desktop e 4:5 no celular (`-v`).
- "Ver o caso Kavora", no pé do hero, abre o vídeo do Kavora com som.
- No comparador, um agente arrasta a alça de um lado para o outro e repete a cada ~4,5 s enquanto ele está na tela,
  até a pessoa arrastar a alça ela mesma (`arrasta` em `enxame.js`; `comparador` em `interface.js`).
- Cor do texto: `base.css` define a cor e o tema escuro no `:root` e no `body`, porque a hospedagem do Artifact envolve
  a página num esqueleto com `body { color: #000; background: #fff }`.
- Tour contínuo (`tour` em `enxame.js`): segue rápido (`RITMO`, 0,75 tela/s vezes a velocidade da barra) quando
  tudo à vista já está pronto, desacelera sem parar (`RITMO_MONTA`) enquanto há camada por montar à vista e, durante o Tour, os agentes trabalham 1,4×
  mais rápido (`AGENTES_NO_TOUR`). Qualquer toque, roda do mouse ou tecla interrompe.
- Os testes dos agentes (arraste do comparador, filtro, sanfona) saem quando o componente está pelo menos 3/4 visível,
  e o Tour desacelera até a primeira demonstração acontecer.
- Celular: o carrossel dos projetos anda sozinho para o lado (26 px/s, `src/motion/carrossel.js`), para ao toque,
  volta a andar 5 s depois e, no fim, desliza de volta ao primeiro card.
