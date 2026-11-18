# AVELÉ · Filme institucional de 30 s (storyboard e notas)

1920 × 1080, 30 fps, H.264 + AAC 256 kbps. Arquivo: `AVELE-filme-institucional-30s.mp4`.
Versão web (1600 px, 4 MB): `08-Website/assets/avele-filme-30s.mp4`.

| Tempo | Cena | Imagem | Movimento | Música |
|---|---|---|---|---|
| 0,0–4,4 | Atmosfera | Seda champagne em movimento | Empurrão lento + deriva; “AVELÉ · Maison de parfum” | Piano solo, Dmaj9 arpejado |
| 4,4–7,5 | Atmosfera | Silhueta atrás da cortina | Subida lenta; “O que fica quando você sai.” | Bm9 |
| 7,5–10,0 | A gota | Macro: gota caindo da pétala | Zoom até a gota | Gmaj7, cordas entram |
| 10,0–12,1 | Frasco | Monograma da tampa, reflexo passando | Close + varredura de luz | A6sus |
| 12,1–14,0 | Frasco | Etiqueta SILLAGE | Pan lento | F#m7 |
| 14,0–15,6 | Frasco | Frasco inteiro | Recuo | Gmaj7 |
| 15,5–19,2 | Identidade | Letras A-V-E-L-E sobem; o acento cai em diagonal no É | Montagem do logotipo | Em9 → A7sus4; nota aguda na queda da gota |
| 19,2–25,8 | Fragrâncias | ROSÉE, ÉCLAT, OMBRE, HÉRITAGE, AUBE, SILLAGE (1,12 s cada) | Cortes suaves, nome + família | Um acorde por corte, cordas em crescendo |
| 25,8–30,0 | Assinatura | Coleção sobre mármore; logotipo, gota e “L’élégance est une essence.” | Escurecimento, fade final | Resolução em Ré, segunda “gota”, fade |

## Notas honestas

- O briefing pedia o filme; ele foi renderizado de fato, quadro a quadro, a partir de `filme/filme.html`.
- A trilha é **sintetizada** (piano e cordas aditivos em numpy, reverb por convolução). Claude não ouve
  áudio: loudness medido em −15,4 LUFS integrado e pico de −1,0 dBTP, mas o timbre e a mixagem precisam
  do seu ouvido. Para uma versão de produção, troque por piano e cordas gravados ou gerados num serviço
  de música (o `trilha.py` documenta harmonia e pontos de sincronia para guiar a regravação).
- Este filme segue o briefing do projeto AVELÉ (16:9, com trilha), não o padrão de vídeos verticais
  sem música de fundo do canal.
