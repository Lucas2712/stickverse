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
