# Créditos de áudio · VÉRIA

Todos os sons foram gerados especificamente para este projeto no **ElevenLabs** (conta gratuita: uso não
comercial, atribuição obrigatória). Nenhum som de terceiros, nenhuma biblioteca externa.

| Arquivo | Origem | Uso |
|---|---|---|
| audio/narracao/narracao.mp3 | ElevenLabs TTS · voz Matilda · eleven_v3 | narração |
| audio/narracao/v1-sarah/ | ElevenLabs TTS · voz Sarah · eleven_multilingual_v2 | primeira versão (substituída) |
| audio/trilha/stems/01-pulso-escuro.mp3 … 08-assinatura.mp3 | ElevenLabs Sound Effects v2 (8 stems, 4–10 s, loops) | trilha arranjada em src/audio/Trilha.tsx |
| audio/sfx/*.mp3 (15 arquivos) | ElevenLabs Sound Effects v2 (prompts em ferramentas/gerar_sfx.sh) | efeitos presos a eventos visuais |

Observação: a API de música do ElevenLabs (Eleven Music) é só para planos pagos (testado: erro 402), e o
OpenArt não tem geração de música. Por isso a trilha foi montada com stems do gerador de efeitos.
