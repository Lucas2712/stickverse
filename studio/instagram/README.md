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
| `teste_offline.py` | testes sem rede (qualquer tentativa de conexão faz o teste falhar) |
| `../ferramentas/instagram.py` | as mesmas consultas pela linha de comando, mais `relatorio` |

Dois servidores no `.mcp.json`, com as mesmas ferramentas:

- **`instagram`** (padrão): conexão real, **bloqueada** até a autorização (devolve "conexão real ainda não autorizada").
- **`instagram-simulado`** (`--simulado`): dados fictícios, sem rede, para testar as ferramentas pelo Claude. Toda resposta
  começa com `[SIMULADO: dados fictícios, nenhuma conexão com o Instagram]`, e o servidor se identifica como
  `studio-matteu-instagram-simulado`. O modo simulado nunca usa o transporte de rede, e o `ig_status` simulado responde
  `"conectado": false`, `"modo": "simulado"` e um aviso de que a conta real não está conectada (a conta aparece só como
  `conta_ficticia`).

Ferramentas MCP: `ig_status`, `ig_perfil`, `ig_publicacoes`, `ig_publicacao`, `ig_comentarios`, `ig_metricas_conta`,
`ig_cota_publicacao`. Não existe ferramenta para publicar, responder, enviar, ocultar, excluir, agendar ou alterar
configurações.

    python3 -I studio/instagram/teste_offline.py                       # testes offline
    python3 studio/ferramentas/instagram.py --simulado relatorio        # demonstração com dados fictícios

## Segurança

- **Token:** nunca em arquivo, variável, log ou chat. As chamadas levam o marcador `Authorization: Bearer proxy-injected`,
  que o proxy do ambiente "stickverse" deverá trocar pelo valor guardado no cofre. **Essa troca ainda não foi
  verificada para `graph.instagram.com`** (ver "Proxy e cofre" abaixo).
- **Renovação:** o token do painel da Meta vale 60 dias. A renovação pela API devolveria o token em texto, por isso ela é
  feita gerando um token novo no painel (a cada ~55 dias) e salvando no formulário seguro do cofre.
- **Somente leitura em três camadas:** só o método GET existe; caminhos de escrita (`media_publish`, `messages`,
  `conversations`, `refresh_access_token`...) são recusados; parâmetros que poderiam mudar o método (`method`, `_method`)
  ou levar credenciais (`access_token`) são recusados.
- **Paginação:** só pelo cursor `after`; a URL `next` da resposta nunca é seguida.
- **Sem redirecionamentos:** o transporte real usa um opener com redirecionamento desligado. Qualquer resposta 3xx é
  recusada na hora (erro "redirecionamento recusado"), então o cabeçalho `Authorization` nunca é reenviado a outro destino,
  nem a outro caminho do mesmo host.
- **Limite de resposta:** respostas de sucesso até 2 MB e corpos de erro até 64 KB. Se o `Content-Length` já passa do
  limite, a resposta é recusada sem ler nada; sem `Content-Length`, a leitura para em limite + 1 byte e a resposta é recusada.
- **Falhas de conexão** (DNS, tempo esgotado, conexão recusada ou interrompida) viram "falha de conexão", sem detalhes.
- **Erros:** passam por `limpar()`, que remove tokens de mensagens e URLs.

## Protocolo MCP e argumentos

- `initialize` negocia a versão: aceita `2025-06-18`, `2025-03-26` e `2024-11-05`, devolvendo a mesma versão pedida;
  para qualquer outra, responde com a mais recente suportada (`2025-06-18`), e o cliente decide se continua.
  `protocolVersion` ausente ou inválido é recusado (-32602).
- Cada mensagem é validada: `jsonrpc` "2.0", `id` texto ou inteiro, `method` texto, `params` objeto; lotes e mensagens
  acima de 1 MB são recusados; notificações nunca executam ferramentas.
- Argumentos validados pelo esquema de cada ferramenta **antes** de criar o cliente: IDs só com dígitos (1 a 30),
  `limite` 1–50, `dias` 1–30, booleanos de verdade (nada de `"sim"`, `1` ou `"10"`), e argumentos desconhecidos recusados.
  As funções de `api.py` repetem a validação (defesa em profundidade, também para a linha de comando).
- Erros: argumentos e recusas trazem só a explicação da regra; erros da Meta viram "HTTP, código e categoria" (a mensagem
  da Meta é descartada, porque pode repetir parâmetros ou identificadores); erros internos viram uma frase genérica, e o
  tipo do erro vai só para stderr. Nunca há rastro (*traceback*) na resposta.

## Proxy e cofre: o que foi verificado (sem token, sem conexão)

**Situação: a injeção do token para o Instagram NÃO foi verificada.** A conexão real continua bloqueada
(`CONEXAO_REAL_AUTORIZADA = False`), `graph.instagram.com` não está liberado e nenhuma tentativa de conexão foi
feita para testar o mecanismo.

O que foi observado localmente (sem rede) diz respeito só ao **caminho** que um pedido faria, não à injeção:

- O ambiente define `HTTPS_PROXY` (proxy local que encaminha a um proxy de saída com política) e uma CA própria
  (`SSL_CERT_FILE`).
- Os processos dos nossos servidores (`servidor_mcp.py` e `servidor_mcp.py --simulado`), iniciados pelo Claude Code,
  têm essas variáveis no ambiente. Só os nomes foram conferidos; nenhum valor foi lido.
- O `urllib` do Python usa `HTTPS_PROXY` por padrão e `graph.instagram.com` não está em `NO_PROXY`.
- Os testes conferem, com a conexão substituída por um capturador, que o pedido sairia como `GET`, para
  `graph.instagram.com`, com `Authorization: Bearer proxy-injected` e sem `access_token` na URL.

**Ainda não verificado, sem prova:**

- Que o proxy de saída **substitui** o cabeçalho `Authorization` em pedidos a `graph.instagram.com`.
- Que essa substituição acontece para pedidos do nosso servidor Python.

A integração da ElevenLabs **não comprova** isso. Ela usa outro host (`api.elevenlabs.io`) e outro cabeçalho
(`xi-api-key`), e o fato de os processos herdarem as variáveis do proxy só mostra por onde o pedido passa, não que
um segredo será injetado. Hoje não existe regra de injeção para o Instagram no cofre do ambiente.

**Proposta para a etapa de conexão real (somente com autorização expressa):**

1. O usuário salva o token pelo formulário seguro do cofre, preso a `graph.instagram.com`, cabeçalho
   `Authorization`, prefixo `Bearer`.
2. O token é gerado com **apenas `instagram_business_basic` e `instagram_business_manage_insights`**, por decisão
   do usuário. Sem `instagram_business_manage_comments` nesta primeira conexão: a leitura de comentários será
   avaliada à parte, e até lá `ig_comentarios` deve responder com erro de permissão. Também sem
   `instagram_business_content_publish` e sem `instagram_business_manage_messages`.
3. Uma única leitura mínima (`GET /me?fields=user_id,username,account_type`) pelo nosso cliente. Erro 190 ou 401
   indica que a injeção não funcionou: parar e reavaliar. Não guardar o token em arquivo nem em variável de ambiente
   (ficaria em texto).

**Risco a considerar:** uma regra de injeção vale para **qualquer** pedido a `graph.instagram.com` feito na sessão,
por qualquer programa e com qualquer método. A garantia de "somente leitura" está no nosso código, não no proxy.
Por isso o token deve ter as permissões mínimas acima, que não permitem publicar, comentar nem enviar mensagens.

## Dados e privacidade

- **Comentários:** o texto aparece só na resposta ao chat; não é gravado em disco nem registrado.
- **Registro de consultas, um arquivo por modo** (fora do git): `dados/consultas-real.jsonl` e
  `dados/consultas-simulado.jsonl` (os testes usam `consultas-teste.jsonl` numa pasta temporária). Cada modo tem sua
  própria trava, e consultas reais e simuladas nunca se misturam. Conteúdo: só data, tipo de consulta (`perfil`, `midias`,
  `insights`...) e resultado (`ok`, `erro <código>`, `recusado`). Sem IDs de comentários, textos, nomes de usuário
  ou conteúdo de mensagens.
  - **Concorrência:** trava exclusiva (`fcntl.flock`) entre MCP e linha de comando.
  - **Escrita:** cada linha é **acrescentada** (`O_APPEND`), nunca reescrita.
  - **Poda:** entradas com mais de **30 dias** são removidas num arquivo temporário trocado de forma atômica
    (`os.replace`), sem risco de deixar o registro truncado.
  - **Permissões:** pasta 700, arquivo e trava 600; modos errados são corrigidos.
  - **Proteções:** o registro e a trava são conferidos também quando já existem, pelo próprio descritor aberto.
    São recusados: link simbólico, FIFO ou pasta no lugar do arquivo, link físico extra e arquivo de outro dono.
    A pasta é recusada se for link simbólico ou de outro dono. Se o registro falhar, a consulta continua e
    aparece só um aviso sem conteúdo em stderr.
- **Relatórios** (`dados/relatorios/`, fora do git): só quando pedidos. Contêm **apenas datas, tipos e métricas
  numéricas** (sem nome de usuário, legendas, comentários ou qualquer texto de publicação). São criados já com permissão 600, e um
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

**Regra para as fases com escrita (lição da auditoria, item M3):** a aprovação de qualquer ação que altere a conta
(publicar, agendar, responder, enviar, ocultar, excluir) **não pode** depender de um código que o próprio agente consiga
calcular (como o resumo SHA-256 do pedido usado na ElevenLabs). Um código assim só prova que o pedido executado é o
pedido mostrado; não é autorização humana. A aprovação precisa vir do usuário, e a barreira técnica precisa existir fora
do alcance do agente, por exemplo com bloqueio (`deny`) das ferramentas de escrita no `.claude/settings.json`, liberadas
uma a uma pelo usuário. O desenho exato será proposto e aprovado antes da fase de publicação.
