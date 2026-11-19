# VÉRTICE · Sneaker Boutique Premium
**Identidade visual completa e campanha de lançamento · Studio Matteu**
Assinatura: **BEYOND THE ORDINARY.**

> Projeto conceitual e autoral. VÉRTICE é uma marca fictícia: não há clientes, parcerias, vendas ou certificações reais.
> Os sneakers são apresentados como produtos **selecionados** pela boutique, sem marcas de terceiros.

## Conceito em uma linha
*Vértice* é o ponto mais alto de uma forma, onde duas linhas se encontram e uma direção é decidida. A marca é o encontro entre curadoria e cultura.
O símbolo V é uma cunha espessa (movimento, direção) e uma lâmina fina que sobe um módulo acima dela (elevação), ambas a 24°. O mesmo ângulo
redesenha o acento do É no logotipo, gera os identificadores de coleção (1, 2, 3 lâminas e o V completo) e as linhas do sistema gráfico.

## Sistema
| | |
|---|---|
| Paleta | Obsidian #171717 · Ivory #E9E4DA · Concrete #85827D · Champagne #A98C63 |
| Tipografia | Instrument Serif (títulos, logotipo redesenhado) + Inter / Inter Display (texto, legendas, dados). Ambas SIL OFL 1.1 |
| Coleções | ESSENTIAL `/` · URBAN `//` · ARCHIVE `///` · LIMITED `V` |
| Numeração | `VRT·<coleção>·<temporada>·<nº>` — ex.: `VRT·LTD·FW26·001`, Nº 001 / 250 |

## Pastas
| Pasta | Conteúdo |
|---|---|
| 01_BRAND_STRATEGY | Estratégia em PDF (7 p.) + páginas JPG + versão em português (.md) |
| 02_LOGO_AND_IDENTITY | Horizontal, centralizado (com e sem assinatura), símbolo, logotipo, versão etiqueta — em Obsidian, Ivory, branco puro, Champagne e Concrete. SVG + PNG transparente. Pranchas de construção, área de proteção e redução mínima |
| 03_GRAPHIC_ELEMENTS | Padrão monograma (tile SVG contínuo), linhas a 24°, molduras editoriais, identificadores de coleção, sistema de numeração |
| 04_COLOR_AND_TYPOGRAPHY | Paleta (JPG, JSON, CSS, SVG), combinações aprovadas, espécime e hierarquia tipográfica |
| 05_SNEAKER_COLLECTIONS | 4 coleções × 5 peças: apresentação, campanha, editorial, card de identificação, aplicação do sistema + visão geral |
| 06_PACKAGING | 10 itens: caixa preta, caixa marfim, papel de seda, sacola preta, sacola marfim, etiqueta, cartão de agradecimento, cartão de autenticidade e curadoria, adesivos (artes planas + mockups) |
| 07_STATIONERY | Papel timbrado A4, envelope DL, cartão de visita (frente e verso), cartão de cumprimentos + mockup |
| 08_CAMPAIGN | 3 cartazes, 3 anúncios de produto, 2 editoriais, 1 arte de lançamento, 1 peça de encerramento |
| 09_INSTAGRAM | 12 publicações × 3 formatos (1080×1080, 1080×1350, 1080×1920) = 36 arquivos + composição do perfil |
| 10_PHOTOGRAPHIC_DIRECTION | 12 imagens-mestre em JPG + princípios, faça/não faça, ficha técnica e moodboard |
| 11_MOCKUPS | Caixas, sacolas, papelaria, unboxing, papel de seda (fotografias com a marca aplicada) |
| 12_BEHANCE_PRESENTATION | 17 pranchas JPG (2400 px) na ordem de publicação + PDF único |
| 13_BRAND_GUIDELINES | Manual de identidade em PDF A4 paisagem (28 p., texto vetorial) + páginas JPG |
| 14_SOURCE_FILES | Scripts Python/JS que geram tudo, HTML editável de cada peça, fontes + licenças, fotos originais, camadas de tinta |

## Como editar e reconstruir
Cada peça tem um HTML editável em `14_SOURCE_FILES/html/`. O logotipo e o símbolo são definidos em
`14_SOURCE_FILES/scripts/brand.py` (geometria) e textos em `content.py`. Para regenerar tudo:

    bash 14_SOURCE_FILES/scripts/build_all.sh

Requer Python 3 (Pillow, numpy, scipy, fontTools, brotli) e Node com Playwright/Chromium.

## Créditos e origem das imagens
- Fotografias: geradas com IA (OpenArt · GPT Image 2.5) sob direção de arte do Studio Matteu; tênis sem marcas identificáveis.
- Aplicação da marca nas fotos de embalagem e papelaria: composição digital (impressão multiplicada sobre a textura do papel; hot stamping simulado).
- Fontes: Instrument Serif (The Instrument Serif Project Authors) e Inter (The Inter Project Authors), SIL Open Font License 1.1.
- Valores CMYK são conversões de referência; validar com prova de impressão.
