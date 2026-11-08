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
| `servidor_mcp.py` | servidor MCP por stdio (JSON-RPC 2.0) com 7 ferramentas de leitura; valida protocolo e argumentos antes de qualquer consulta |
| `teste_offline.py` | 41 testes sem rede (qualquer tentativa de conexão faz o teste falhar) |
| `../ferramentas/instagram.py` | as mesmas consultas pela linha de comando, mais `relatorio` |

Dois servidores no `.mcp.json`, com as mesmas ferramentas:

- **`instagram`** (padrão): conexão real, **bloqueada** até a autorização (devolve "conexão real ainda não autorizada").
- **`instagram-simulado`** (`--simulado`): dados fictícios, sem rede, para testar as ferramentas pelo Claude. Toda resposta
  começa com `[SIMULADO: dados fictícios, nenhuma conexão com o Instagram]`, e o servidor se identifica como
  `studio-matteu-instagram-simulado`. O modo simulado nunca usa o transporte de rede.

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

## Protocolo MCP e argumentos

- Cada mensagem é validada: `jsonrpc` "2.0", `id` texto ou inteiro, `method` texto, `params` objeto; lotes e mensagens
  acima de 1 MB são recusados; notificações nunca executam ferramentas.
- Argumentos validados pelo esquema de cada ferramenta **antes** de criar o cliente: IDs só com dígitos (1 a 30),
  `limite` 1–50, `dias` 1–30, booleanos de verdade (nada de `"sim"`, `1` ou `"10"`), e argumentos desconhecidos recusados.
  As funções de `api.py` repetem a validação (defesa em profundidade, também para a linha de comando).
- Erros: argumentos e recusas trazem só a explicação da regra; erros da Meta viram "HTTP, código e categoria" (a mensagem
  da Meta é descartada, porque pode repetir parâmetros ou identificadores); erros internos viram uma frase genérica, e o
  tipo do erro vai só para stderr. Nunca há rastro (*traceback*) na resposta.

## Proxy e cofre: o que foi verificado (sem token)

Confirmado nesta sessão, sem chamar o Instagram:

- O proxy do ambiente fica em `HTTPS_PROXY` (local, que encaminha a um proxy de saída com política) e reemite o TLS
  com uma CA própria (`SSL_CERT_FILE`).
- Os servidores MCP iniciados pelo Claude Code herdam essas variáveis (verificado no processo do servidor ElevenLabs
  em execução).
- O `urllib` do Python usa `HTTPS_PROXY` por padrão e `graph.instagram.com` não está na lista `NO_PROXY`, então as
  chamadas do nosso servidor passariam pelo proxy.
- Os testes conferem que o pedido sai como `GET`, para `graph.instagram.com`, com `Authorization: Bearer
  proxy-injected` e sem `access_token` na URL.

**Não confirmado (limitação):** se o proxy de saída vai mesmo **substituir** o valor de `Authorization` para
`graph.instagram.com`.

- A injeção é configurada por host e por nome de cabeçalho no cofre do ambiente. Hoje só existe a regra da ElevenLabs
  (`api.elevenlabs.io`, cabeçalho `xi-api-key`). Não existe regra para o Instagram, e sem token isso não pode ser
  testado.
- A documentação da plataforma diz que o proxy substitui um valor fictício no cabeçalho, mas isso não foi observado
  para o nosso caso.
- O sucesso da ElevenLabs não prova o caso do Instagram, porque o cabeçalho e o host são outros.

**Proposta segura para a etapa de conexão real (só com autorização):**

1. Salvar o token pelo formulário seguro do cofre, preso a `graph.instagram.com`, cabeçalho `Authorization` e prefixo
   `Bearer`.
2. Fazer **uma** leitura mínima (`GET /me?fields=user_id,username,account_type`) pelo nosso cliente. Um erro 190 ou
   401 indica que a injeção não funcionou.
3. Se não funcionar, parar e reavaliar. Não guardar token em arquivo nem em variável de ambiente (ali ele fica em
   texto). Considerar o suporte da plataforma ou outro mecanismo oficial.

**Risco a considerar:** a injeção vale para **qualquer** pedido a `graph.instagram.com` feito dentro da sessão, de
qualquer programa e com qualquer método. A garantia de "somente leitura" está no nosso código, não no proxy.

- Por isso, o token da fase de leitura deve ter as **permissões mínimas**: `instagram_business_basic` e
  `instagram_business_manage_insights`.
- Ler comentários exige `instagram_business_manage_comments`, que também permitiria responder ou excluir. Essa
  decisão fica com o usuário.
- `instagram_business_content_publish` e `instagram_business_manage_messages` ficam de fora.

## Dados e privacidade

- **Comentários:** o texto aparece só na resposta ao chat; não é gravado em disco nem registrado.
- **Registro de consultas** (`dados/consultas.jsonl`, fora do git): só data, tipo de consulta (`perfil`, `midias`,
  `insights`...) e resultado (`ok`, `erro <código>`, `recusado`). Sem IDs de comentários, textos, nomes de usuário
  ou conteúdo de mensagens.
  - **Concorrência:** trava exclusiva (`fcntl.flock`) entre MCP e linha de comando.
  - **Escrita:** cada linha é **acrescentada** (`O_APPEND`), nunca reescrita.
  - **Poda:** entradas com mais de **30 dias** são removidas num arquivo temporário trocado de forma atômica
    (`os.replace`), sem risco de deixar o registro truncado.
  - **Permissões:** pasta 700, arquivo e trava 600; modos errados são corrigidos.
  - **Proteções:** links simbólicos e pasta de outro dono são recusados. Se o registro falhar, a consulta continua e
    aparece só um aviso sem conteúdo em stderr.
- **Relatórios** (`dados/relatorios/`, fora do git): só quando pedidos. Contêm **apenas datas, tipos e métricas
  numéricas** (sem legendas, comentários ou qualquer texto de publicação). São criados já com permissão 600, e um
  relatório existente nunca é sobrescrito.
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
