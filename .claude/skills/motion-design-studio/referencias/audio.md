# Áudio

## Canais
| Canal | Origem | Controle |
|---|---|---|
| Narração | arquivo do ElevenLabs (`narracao.mp3`) | `audio.volumes.narracao` |
| Música | arquivo enviado pelo usuário (opcional) | `audio.volumes.musica`, `audio.musica`, `audio.ducking` |
| Efeitos | sintetizados no navegador (Web Audio) | `audio.volumes.efeitos` |

Sem arquivo de música → `audio.musica: null`. Não gere, não sintetize e não procure música.
O player mostra um controle de volume só para os canais que existem. A exportação final é
normalizada para −14 LUFS (padrão das redes).

## Música
```json
"musica": { "arquivo": "musica.mp3", "inicio": 0.0, "corte": 12.5, "fadeIn": 0.6, "fadeOut": 1.5 },
"ducking": { "ativo": true, "reducao": 0.4 }
```
- `inicio`: segundo do vídeo em que a música entra. `corte`: segundo do arquivo usado como começo.
- `reducao`: ganho da música durante a fala (0,4 = cerca de −8 dB).
- Marque no storyboard: entrada, viradas, pico e final. Se o usuário der BPM, uma batida = 60/BPM s;
  alinhe trocas de cena e impactos a batidas (múltiplos de 2 ou 4).

## Efeitos (tipos disponíveis)
| Tipo | Uso |
|---|---|
| `whoosh` | transição, câmera rápida |
| `swoosh` | passagem curta, chicote |
| `riser` | tensão subindo antes de revelação (1,2 s antes do impacto) |
| `swell` | abertura de espaço, recuo de câmera |
| `pop` | entrada de card/chip |
| `blip` | itens pequenos em sequência |
| `tick` | checklist marcando |
| `key` | digitação (um por tecla, ganho 0,8–1) |
| `click` | clique de cursor |
| `send` | enviar mensagem, botão |
| `flip` | virar/girar elemento |
| `boom` | palavra de impacto, título |
| `hit` | corte seco, número grande |
| `chime` | conquista, sucesso |
| `ding` | notificação |
| `glitch` | erro, alerta, falha |

Regras: todo efeito está colado a um evento visual; no máximo 1 impacto (`boom`/`hit`) a cada ~4 s;
digitação em `key` com 11–14 teclas/s.

## Narração mais rápida
1. Guarde o original como `narracao-original.mp3`.
2. Corte as pausas pelos tempos de `palavras.json`: mantenha até ~0,22 s dentro da frase e ~0,34 s
   depois de `.`, `?` ou `:` (fades de 12 ms em cada emenda para não estalar).
3. Aplique `atempo=1.10` a `1.15` (preserva o tom; acima de 1,2 começa a soar acelerado).
4. Rode `transcrever.py` de novo: todos os tempos mudam.

## Efeitos sonoros reais (Real SFX + Openverse + Earshot) · regra do canal: sem música

O padrão do canal é **narração + efeitos sonoros, nunca música**. Os efeitos sintetizados no navegador (tabela acima)
continuam sendo o rascunho e a prévia do player; a entrega final pode trocar todos por sons reais, numa faixa separada:

```
python3 studio/ferramentas/montar.py projetos/<nome>
python3 studio/ferramentas/sfx_real.py projetos/<nome>        # -voz.mp4 → Real SFX → -sfx-real.mp4 + faixa de efeitos WAV
```
- Os eventos vêm de `MDS.SFX` (o mesmo `sfx: [...]` das cenas). Mapa: whoosh/swoosh→whoosh, riser/swell→riser, pop/blip→pop,
  tick, click/send→click, flip→wipe, boom/hit→hit, chime/ding→chime, glitch, key (teclas seguidas viram um trecho de digitação).
- A narração nunca é alterada e fica protegida (`--voice-safe` do Real SFX). `exportar.js --sem-efeitos --sem-musica` gera a base.
- Saídas: `saida/<nome>-sfx-real.mp4`, `saida/sfx-real/<nome>-sfx-real_sfx_track.wav` (faixa separada), `critica.txt`
  (notas de sincronia, audibilidade, fala, etc.; corrija o que ficar abaixo de 8 e diga ao usuário o que ouvir) e
  `projetos/<nome>/CREDITOS-SONS.md`.
- `exportar.js --trilhas` também salva narração e efeitos sintetizados em `saida/trilhas/`.

**Biblioteca** (`studio/sons/`, registrada no Real SFX como `estudio`, tier main):
- `earshot/<tipo>/`: 252 efeitos feitos em código pelo Earshot (MIT), com `catalog.csv`. Regenerar: `biblioteca_earshot.py`.
- `openverse/<tipo>/`: sons reais baixados por `sons.py` (abaixo). Depois de adicionar sons:
  `cd .claude/skills/real-sfx && python3 scripts/build_index.py && python3 scripts/listen.py tag-index`.
- `creditos.json`: nome, autor, origem, licença, link, data da conferência de cada arquivo.

**Openverse** (`studio/ferramentas/sons.py`): `buscar "whoosh"` lista CC0 primeiro e CC BY depois;
`baixar <id> --tipo whoosh` só baixa depois de **conferir a licença na página de origem** (Freesound ou Wikimedia
Commons). Regras: CC0/PDM primeiro; CC BY só sem alternativa CC0 e com atribuição; **proibidos NC, ND e SA**;
sem confirmação na origem, o arquivo não entra. Limite atual: o Freesound devolve 403 ao servidor de nuvem
(o bloqueio é do próprio site, não da nossa rede), então quase nada do Openverse pode ser conferido e baixado.
Não contorne. Alternativa: o usuário baixa no celular e envia, e a licença é registrada à mão em `creditos.json`.

**Earshot** (`earshot` no terminal): `earshot sfx list/render/check` cria um efeito sob medida (duração, pico, tom) quando
a biblioteca não tem; `earshot describe/match ARQ` descreve um som em palavras; `earshot timeline SAIDA.mp4 --video ...`
e `earshot sheet` mostram a escuta sincronizada com a imagem; `earshot critique` compara com filmes profissionais.
Comandos com modelos levam ~20 s para carregar. Nada disso substitui o ouvido do usuário.

### Efeitos mais altos (pedido do usuário)
- `sfx_real.py projetos/<nome> --efeitos N` sobe **todos** os efeitos N dB (a voz continua protegida pelo `--voice-safe`).
  `--voz-leve` deixa a voz abafar menos os efeitos (mais alto ainda, mas tende a cobrir palavras).
- Série Juninho: o usuário prefere efeitos fortes e muitos. Padrão aprovado no ep. 2: `--efeitos 8` (ducking normal), com os sons que encostam na voz ~6 dB mais baixos e
  ~3 eventos/s. Depois de subir, leia `critica.txt` → "Every moment on top of the voice" e baixe/remova só esses sons.
