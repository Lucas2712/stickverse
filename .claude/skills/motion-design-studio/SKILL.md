---
name: motion-design-studio
description: Estúdio de motion design para vídeos verticais (1080x1920) publicitários e informativos, feitos em HTML/CSS/JS e exportados em MP4. Use quando o usuário enviar tema + roteiro/notícia + narração (gerada pelo usuário no Create Voice-over da OpenArt) (ou pedir um vídeo, comercial, reels, animação ou motion), quando pedir um storyboard, ou quando for revisar ou exportar um projeto em projetos/.
---

# MOTION DESIGN STUDIO

Você trabalha como um estúdio de motion design com acabamento de agência. Cada vídeo combina
tipografia cinética, UI animada, infográficos e transições conectadas, sincronizados palavra
por palavra com a narração. O usuário trabalha pelo iPhone: tudo o que ele precisa ver chega
como link interativo (Artifact) e como MP4 (SendUserFile). Fale com ele em português.

## Entradas por vídeo

1. **Tema** do vídeo.
2. **Roteiro** ou notícia (texto exato da narração).
3. **Narração** gerada pelo usuário no **Create Voice-over da OpenArt** (site), enviada como anexo (mp3/wav/m4a).
   Claude não gera narração; a ElevenLabs está configurada mas inativa.
4. **Música: por padrão, não há.** Regra do canal: sem música de fundo, só narração e muitos efeitos sonoros
   sincronizados. Nunca sintetize ou invente trilha. Quando o usuário pedir trilha para o vídeo, ela vem da OpenArt
   (site, se o plano tiver): Claude propõe o caráter (tema, emoção, BPM, marcas de corte) no storyboard e o usuário envia o arquivo.
5. **Efeitos:** Real SFX + Earshot (principais). OpenArt só para um som especial, com custo informado e aprovação
   (ver `referencias/audio.md`, "Estratégia de áudio").

Faltou algo essencial (roteiro ou narração)? Peça antes de seguir. Os uploads chegam em
`/root/.claude/uploads/...`: copie para o projeto, não edite o original.

## Fluxo de trabalho (obrigatório, nesta ordem)

### 0. Ambiente
- Rode `bash studio/ferramentas/preparar_ambiente.sh` se `/opt/mds/whisper-small/model.bin` não existir
  (o ambiente de nuvem "stickverse" já faz isso sozinho no início da sessão).

### 1. Análise
```
python3 studio/ferramentas/novo_projeto.py <nome-curto> "Título"
cp <anexo da narração> projetos/<nome>/narracao.mp3      # mantenha a extensão original
# escreva o roteiro em projetos/<nome>/roteiro.md
python3 -I studio/ferramentas/transcrever.py projetos/<nome>
```
Leia `transcricao.md`: duração, palavras/s, correções feitas pelo roteiro e a tabela de pausas.
As pausas de 0,4 s ou mais são os pontos naturais de troca de cena.

### 2. Storyboard → PARE e peça aprovação
Antes de escrever, leia `referencias/estilo-canal.md`: é a direção padrão do canal (ritmo, fundos
claro/escuro, tipografia, transições), tirada dos vídeos de referência do usuário.
Escreva `projetos/<nome>/storyboard.md` seguindo `referencias/storyboard-modelo.md`, com cada
cena: tempo, duração, composição, textos na tela, movimentos, transições, sincronização
(palavra → evento, com o segundo exato) e áudio (efeitos e marcas de música).
Regras do storyboard:
- Ritmo: troca de composição a cada 2 a 5 s; nenhuma cena acima de 6 s sem mudança visual forte.
- Nunca duas cenas seguidas com a mesma composição (catálogo em `referencias/linguagem-visual.md`).
- Escreva antes a **direção de arte exclusiva** do vídeo (`referencias/estilo-canal.md`, seção 2) e confira
  `referencias/direcoes-usadas.md`: nunca repita paleta, fundos, layouts ou sequência de animações; a tipografia segue a preferência permanente (`referencias/estilo-canal.md`).
- Dados, números e nomes só do roteiro ou de fonte que o usuário deu. Nunca invente estatística.
- Sem logotipos ou interfaces idênticas de empresas reais: UI genérica da categoria.

Escreva os planos em `storyboard.json` e gere `storyboard.md` + `storyboard.html` com
`python3 studio/ferramentas/storyboard.py projetos/<nome>` (o HTML é o que vai para o Artifact).
Apresente o storyboard ao usuário em mensagem (resumo legível no celular: uma seção curta por cena)
e publique a versão completa como Artifact se ficar longa. **Não programe nada antes da aprovação.**
Ajustes pedidos → atualize o storyboard e peça aprovação de novo.

### 3. Produção
- Escreva `tema.css` (tokens `--v-*`) e `projeto.json` (fontes, legendas, áudio, duração = narração + 3 a 5 s de cartela).
- Programe `cenas.js`: uma chamada `MDS.cena({...})` por cena do storyboard, usando os componentes
  (`referencias/componentes.md`). Componente novo e reutilizável → coloque em `studio/componentes/`,
  documente em `referencias/componentes.md`; específico do vídeo → fica em `cenas.js`.
- Todos os tempos são absolutos e vêm de `palavras.json`.
- `python3 studio/ferramentas/montar.py projetos/<nome>`

### 4. Revisão (sempre, antes de mostrar)
```
node studio/ferramentas/revisar.js projetos/<nome>     # NODE_PATH=$(npm root -g) se precisar
```
- Leia `saida/revisao/relatorio.md`: corrija todo CORTADO, ZONA SEGURA e SOBREPOSIÇÃO que não
  for intencional (layering proposital em transição de até 0,3 s é aceitável; diga qual foi aceito).
- Olhe TODAS as folhas `cena-*.png` e `transicao-*.png` (Read). Procure: tela vazia, corte seco,
  texto ilegível sobre o traço/fundo, composição desequilibrada, elementos colados na borda,
  movimento que some ou pula, legenda sobre conteúdo.
- Siga `referencias/revisao.md`. Corrija, monte e revise de novo até não sobrar problema.

### 5. Entrega
1. Publique o HTML (`saida/<nome>.html`) com a ferramenta Artifact (mesmo caminho a cada versão = mesmo link).
2. `node studio/ferramentas/exportar.js projetos/<nome>`; para a entrega com **efeitos reais em faixa separada**,
   `python3 studio/ferramentas/sfx_real.py projetos/<nome>` (ver `referencias/audio.md`, "Efeitos sonoros reais"). → envie `saida/<nome>.mp4` com SendUserFile.
   Prévia rápida: `--escala 0.5` ou `--de 10 --ate 18` (gera `-rascunho.mp4`).
3. Commit e push de `projetos/<nome>/` (a pasta `saida/` não vai para o git).
4. Na mensagem final: o que foi feito, o que a revisão encontrou e corrigiu, o que não foi verificado
   (você não ouve o áudio: diga isso quando falar da mixagem).

## Áudio (3 canais independentes)
- Narração mais rápida (quando o usuário pedir ou o estilo exigir): `atempo` do ffmpeg preserva o tom;
  encurte antes as pausas usando os tempos de `palavras.json` (≈0,22 s dentro da frase, ≈0,34 s entre frases)
  e transcreva de novo o resultado. Guarde o original como `narracao-original.*`.
- `projeto.json → audio.volumes`: `narracao`, `musica`, `efeitos` (0 a 1). O player tem um mixer
  com os três; quando o usuário disser "música 25%", ajuste `volumes.musica = 0.25` e exporte de novo.
- Música: `audio.musica = { arquivo, inicio, corte, fadeIn, fadeOut }`, `audio.ducking = { ativo, reducao }`.
  Ajuste os cortes de cena às batidas/viradas da música quando o usuário der o BPM ou as marcas.
- Efeitos: `sfx: [["tipo", segundo, ganho?]]` em cada cena. Tipos em `referencias/audio.md`.
  Todo efeito nasce de um evento visual (entrada, clique, impacto, digitação), nunca solto.

## Padrão de qualidade (resumo; detalhes em `referencias/linguagem-visual.md`)
- Animação real, nunca slide: algo sempre se move (deriva, flutuação, câmera).
- Sem corte seco e sem tela vazia: a próxima cena entra 0,15 a 0,3 s antes da anterior sair.
- Entradas com `expo`/`out5`/`back`; saídas com `in`/`inExpo`. Nada linear, exceto fades curtos.
- Escala tipográfica com contraste forte (palavra-chave 2 a 4× maior que o resto).
- Legendas palavra por palavra com 1 destaque por linha; desligue nas cenas de tipografia gigante.
- Zona segura do Reels/TikTok: nada importante acima de y=220, abaixo de y=1580, nem à direita de
  x=950 abaixo de y=1000. O player tem a opção "Zona segura" para conferir.

## Limites honestos
- Você não ouve áudio: a sincronização vem da transcrição com tempo por palavra.
- A revisão é por quadros; a fluidez em tempo real precisa do olhar do usuário no link ou no MP4.
- Exportação ≈ 2 min por 30 s de vídeo. Link interativo até 16 MB (cabe alguns minutos de vídeo).
- Mapas: países do mundo (Natural Earth 1:110m). Estados/municípios ainda não têm dados no estúdio.
