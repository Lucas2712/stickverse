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
- Contato: e-mail, WhatsApp, agenda, Instagram e Behance estão com marcadores (`contato@exemplo.com`, `[preencher]`).
- Números, projetos, formação e trajetória são fictícios: revisar antes de publicar como site real.

## Celular (otimização de 17/11/2026)
Tudo o que é do celular fica em `src/styles/celular.css`, carregado por último; o desktop não muda.
- A escala acompanha a largura de 360 a 430 px; títulos com `text-wrap: balance` (sem palavra sozinha).
- Projetos no carrossel lateral com encaixe, com imagens 4:5 próprias do celular (`public/img/*-v.webp`, via
  `<picture>`); o comparador também fica em 4:5.
- Cinzas clareados para leitura (`--texto-2` #cdc6c5, `--texto-3` #aaa2a1) e o pé do PORTFÓLIO menos escuro.
- Áreas de toque de 44 px (nav, abas, rodapé, botões da barra) e margens seguras do iPhone (notch e indicador).
- Celular deitado: o hero segue a largura em vez de espremer na altura.
