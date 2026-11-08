# Instagram do Studio Matteu · fase 1 (somente leitura)

Integração própria com a **API oficial da Meta**, no modo **Instagram API com login do Instagram** (`graph.instagram.com`,
v27.0), para a conta profissional de **Criador de conteúdo**. Não usa servidores MCP de terceiros, scraping nem métodos
não oficiais. Python padrão: nenhuma dependência instalada.

**Estado atual: só testes offline.** A conexão real está bloqueada em `api.py` (`CONEXAO_REAL_AUTORIZADA = False`), o
domínio `graph.instagram.com` não está liberado na rede do ambiente e nenhum token foi criado. Nada aqui altera a conta.

## Arquivos

| arquivo | função |
|---|---|
| `api.py` | cliente HTTP somente leitura: lista fechada de caminhos, campos, métricas e parâmetros; recusa qualquer escrita antes de sair da máquina |
| `servidor_mcp.py` | servidor MCP por stdio (JSON-RPC 2.0) com 7 ferramentas de leitura; `--simulado` usa dados fictícios |
| `teste_offline.py` | 19 testes sem rede (qualquer tentativa de conexão faz o teste falhar) |
| `../ferramentas/instagram.py` | as mesmas consultas pela linha de comando, mais `relatorio` |

Ferramentas MCP: `ig_status`, `ig_perfil`, `ig_publicacoes`, `ig_publicacao`, `ig_comentarios`, `ig_metricas_conta`,
`ig_cota_publicacao`. Não existe ferramenta para publicar, responder, enviar, ocultar, excluir, agendar ou alterar
configurações.

    python3 -I studio/instagram/teste_offline.py                       # testes offline
    python3 studio/ferramentas/instagram.py --simulado relatorio        # demonstração com dados fictícios

## Segurança

- **Token:** nunca em arquivo, variável, log ou chat. As chamadas levam o marcador `Authorization: Bearer proxy-injected`,
  que o proxy do ambiente "stickverse" troca pelo valor guardado no cofre (mesmo modelo da ElevenLabs).
- **Renovação:** o token do painel da Meta vale 60 dias. A renovação pela API devolveria o token em texto, por isso ela é
  feita gerando um token novo no painel (a cada ~55 dias) e salvando no formulário seguro do cofre.
- **Somente leitura em três camadas:** só o método GET existe; caminhos de escrita (`media_publish`, `messages`,
  `conversations`, `refresh_access_token`...) são recusados; parâmetros que poderiam mudar o método (`method`, `_method`)
  ou levar credenciais (`access_token`) são recusados.
- **Paginação:** só pelo cursor `after`; a URL `next` da resposta nunca é seguida.
- **Erros:** passam por `limpar()`, que remove tokens de mensagens e URLs.

## Dados e privacidade

- **Comentários:** o texto aparece só na resposta ao chat; não é gravado em disco nem registrado.
- **Registro de consultas** (`dados/consultas.jsonl`, fora do git, permissão 600): só data, tipo de consulta
  (`perfil`, `midias`, `insights`...) e resultado (`ok`, `erro <código>`, `recusado`). Sem IDs de comentários, textos,
  nomes de usuário ou conteúdo de mensagens. Entradas com mais de **30 dias** são apagadas a cada nova consulta.
- **Relatórios** (`dados/relatorios/`, fora do git): só quando pedidos; contêm números da conta e das próprias
  publicações, nunca comentários ou dados de terceiros.
- **Histórico de métricas:** sem banco próprio (decisão do usuário). Vale o que a API guarda: métricas por publicação
  por até 2 anos; totais da conta consultados em janelas de até 30 dias.
- O container da nuvem é temporário: o que fica em `dados/` some quando a sessão termina.

## Limitações conhecidas (documentação oficial)

- Os dados da Meta podem atrasar até 48 h; várias métricas estão marcadas como "em desenvolvimento".
- `follower_count` e `online_followers` só existem com 100+ seguidores; `online_followers` cobre os últimos 30 dias.
- Os webhooks exigem app publicado, verificação de empresa e acesso avançado: aqui as atualizações virão de consultas.
- A API mostra só as 20 mensagens mais recentes de cada conversa (fase de mensagens).
- Na publicação (fase futura), a mídia precisa estar num link HTTPS público: o envio direto de arquivo só existe no
  login do Facebook.

## Próximas fases (dependem de autorização expressa)

Conexão real (app na Meta criado pelo usuário, liberação de `graph.instagram.com`, token no cofre) → inteligência e
calendário → publicação com aprovação → agendamento → comentários → mensagens.
