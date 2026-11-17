# Portfólio Studio Matteu

Site do Studio Matteu montado sobre a landing page **Kairo** (ProfitizeBuild): um enxame de cursores monta a página
na frente de quem visita. Vite sem framework, GSAP, Anton, Caveat e Manrope (Fontsource, licença OFL).

    npm ci            # instala as versões travadas
    npm run dev       # http://localhost:5300 (?pronto abre já montada)
    npm run build     # gera dist/ para Vercel, Netlify, Hostinger...

## O que foi personalizado
- Marca, textos, números, projetos (Pulso, Órbita, Sintético), trajetória, ferramentas, contato, símbolo "M" e favicon.
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
- 01 a 03, Motion, estudos autorais em vídeo (2026), com a etiqueta "Estudo" (nenhum foi encomendado pelas marcas
  que aparecem): **Smart Retries** (Stripe, 1:1), **MIO Creative** (9:16) e **Most Used Apps** (9:16). Cada card roda
  `public/video/<nome>.mp4` em loop, sem som, só enquanto aparece na tela (`src/motion/videos.js`); o link abre
  `<nome>-som.mp4`, com som. Originais em `fonte/`.
- 04 Órbita (Comerciais) e 05 Sintético (IA): fictícios, imagens geradas em HTML.
- Formato: `--ar` em cada card é a proporção da tela. No desktop as telas de uma linha ficam com a mesma altura
  (1:1 + 9:16 + 9:16, depois 16:10 + 16:10); no celular o carrossel é uma tira com a mesma altura (`--arm`).
- O comparador "Do rascunho. Ao ar." ainda mostra o Pulso fictício (storyboard + quadros).
