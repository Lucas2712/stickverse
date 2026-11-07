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
