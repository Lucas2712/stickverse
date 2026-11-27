# Instagram Agent Skill (instalada só neste projeto)

Origem: https://github.com/Jakeschincariol/instagram-agent-skill (commit d03c56b), licença MIT
(Copyright (c) 2026 Jake Schincariol, texto em `LICENSE-instagram-agent-skill`).

- As 13 skills estão em `.claude/skills/ig-*` (comandos `/ig-reel`, `/ig-caption`, `/ig-plan` etc.).
- Única mudança em relação ao original: a pasta de dados `~/.claude/instagram/` virou `.claude/instagram/`
  (dentro do repositório), porque o contêiner da nuvem é apagado entre sessões e a pasta do usuário se perde.
- `voice.md` é o modelo original, ainda em branco: precisa ser preenchido com a voz do perfil
  (ou mandar 3 reels e pedir "escreve meu voice.md a partir destes").
- Feitas para inglês: ganchos, nota de gancho e o humanizador funcionam melhor em inglês.
- Nada é postado, curtido ou enviado: as skills só escrevem; quem posta é o usuário.

## Conexão com o perfil
A @prendeflix está conectada pelo conector **Windsor.ai** (do usuário, plano de teste: só os últimos 30 dias).
Usar só para LER (perfil, legendas, alcance, comentários). O conector também permite postar, comentar, responder
e apagar: nunca usar essas ações sem pedido explícito do usuário para aquele post.
