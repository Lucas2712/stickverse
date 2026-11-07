# stickverse · Studio Matteu

Repositório do **Studio Matteu**, marca premium de criação audiovisual, motion design,
inteligência artificial e tecnologia. Aqui são produzidos vídeos verticais (1080×1920, 30 fps)
de motion design, feitos em HTML/CSS/JS e exportados em MP4. O usuário trabalha pelo iPhone,
no app do Claude. Fale sempre em **português**.

**Marca:** **Studio Matteu** é a identidade oficial. Sempre que a marca for citada (cartelas, créditos,
textos, assinaturas), use esse nome; não use nomes antigos ou provisórios da página. A assinatura
**não precisa aparecer em todos os vídeos**: onde e como aplicá-la segue a direção criativa de cada projeto.

## Antes de qualquer vídeo

- O método completo está na Skill **`.claude/skills/motion-design-studio/`** (SKILL.md + `referencias/`).
  Carregue a Skill e siga o fluxo dela. Este arquivo não repete as regras; só aponta para elas e
  registra as preferências permanentes. Se algo aqui divergir da Skill, vale este arquivo.
- Leia `referencias/estilo-canal.md` (linguagem de edição) e `referencias/direcoes-usadas.md`
  (identidades já usadas, que não podem ser reaproveitadas automaticamente).
- Efeitos sonoros reais: `referencias/audio.md`, seção "Efeitos sonoros reais".

## Regras permanentes

1. **Storyboard primeiro.** Nada é programado antes da aprovação do usuário (storyboard + direção de arte).

2. **Narração e áudio.** Preservar o áudio original: não acelerar, não reescrever e não cortar palavras
   automaticamente. Não remover silêncios sem necessidade e sem a aprovação do usuário.
   **Sem música de fundo:** só narração e efeitos sonoros presos a eventos visuais, com a voz sempre
   em primeiro plano.

3. **Tipografia (preferência permanente, pode ser a mesma em todos os vídeos).**
   - **SF Pro Display** nos títulos e textos de impacto.
   - **SF Pro Text** nas legendas e textos explicativos.
   - Pesos **Regular, Medium, Semibold e Bold**, conforme a hierarquia.
   - **Inter** (Inter Display nos títulos, Inter Text no corpo, com os mesmos pesos) como alternativa
     quando a SF Pro não estiver disponível no ambiente ou não puder ser usada legalmente. A licença da
     Apple restringe a SF Pro a maquetes de interfaces dos sistemas da Apple; sem licença que permita
     vídeo publicado, use o Inter e avise o usuário.

4. **Identidade visual.** Cada vídeo mantém a mesma qualidade, o ritmo dinâmico e a linguagem
   profissional, mas **varia** cores, fundos, composições, elementos gráficos, layouts e animações
   de acordo com o assunto. A tipografia não precisa mudar. **Nunca reutilizar automaticamente** a
   identidade visual de um vídeo anterior; registrar cada direção nova em `direcoes-usadas.md`.

5. **Referências de vídeo.** Servem principalmente para orientar ritmo, velocidade, dinâmica de edição
   e qualidade das animações. Não copiar a identidade visual nem a composição delas.

6. **Interfaces e marcas reais.** Nos tutoriais, usar **capturas de tela e gravações reais** das
   ferramentas (como o Claude) quando necessário. Não inventar interfaces, botões ou funcionalidades.
   Não reproduzir logotipos ou identidades visuais de terceiros como se fossem a identidade do
   Studio Matteu. Não inventar dados: números e fatos vêm do roteiro ou de fonte do usuário.

7. **Licenças.** Fontes com licença que permita vídeo publicado, com o arquivo de licença no projeto.
   Sons: CC0 primeiro, CC BY só com atribuição; proibidos NC, ND e SA; licença conferida na página de
   origem; créditos em `studio/sons/creditos.json` e `projetos/<nome>/CREDITOS-SONS.md`.

8. **Verificar antes de executar.** Antes de rodar qualquer comando, confirmar que a ferramenta e as
   dependências dela existem no ambiente (arquivo, binário, módulo, modelo, fonte). Não presumir que algo
   está instalado ou funcionando só porque aparece documentado aqui ou na Skill. Se faltar, avisar o
   usuário e só então instalar ou preparar.

9. **Revisar antes de entregar** (relatório + todas as folhas de quadros) e dizer com franqueza o que
   não foi verificado. Claude não ouve áudio: a mixagem final depende do ouvido do usuário.

10. **Consultar o usuário** antes de gastar créditos (OpenArt), liberar rede ou mudar algo que afete
    todos os projetos.

## Onde fica cada coisa

    .claude/skills/motion-design-studio/   a Skill (regras, referências, fluxo)
    .claude/skills/real-sfx/               Real SFX (Clipwing, MIT) com config apontando para studio/sons
    studio/motor, studio/componentes        motor de animação e componentes
    studio/ferramentas/                     novo_projeto · transcrever · storyboard · montar · revisar · exportar
                                            sfx_real · sons (Openverse) · biblioteca_earshot · preparar_ambiente.sh
    studio/sons/                            biblioteca de efeitos (Earshot + Openverse) com catálogo e créditos
    projetos/<nome>/                        um vídeo por pasta; saida/ fica fora do git

As outras pastas (`video/`, `roteiros/`, `entregas/`, `desmontagem/`) são da série anterior
"Último Sinal" e de análises de referência: não mexer nelas sem pedido.

## Comandos principais

Conferir antes se a ferramenta e as dependências estão presentes (regra 8).

    python3 studio/ferramentas/novo_projeto.py <nome> "Título"
    python3 -I studio/ferramentas/transcrever.py projetos/<nome>
    python3 studio/ferramentas/storyboard.py projetos/<nome>          # storyboard.json → .md + .html
    python3 studio/ferramentas/montar.py projetos/<nome>
    node studio/ferramentas/revisar.js projetos/<nome>                # NODE_PATH=$(npm root -g)
    python3 studio/ferramentas/sfx_real.py projetos/<nome> [--realce 7]   # MP4 final com efeitos reais

## Ambiente

- Use o ambiente de nuvem **"stickverse"**: o script de preparação instala o transcritor (Whisper),
  o Earshot com seus modelos e o classificador do Real SFX. Se `/opt/mds/whisper-small/model.bin`
  ou `earshot` faltarem, rode `bash studio/ferramentas/preparar_ambiente.sh`.
- **Início de cada sessão de produção (contingência autorizada):** leia `/opt/mds/estado.txt`. Se
  `earshot-modelos` ou `yamnet` não estiverem "ok" (ou o arquivo faltar), rode
  `bash studio/ferramentas/preparar_ambiente.sh --testar` (baixa os modelos de novo, sem dependências novas,
  confere o SHA-256 do YAMNet e testa Earshot, YAMNet e a biblioteca). Só considere o ambiente pronto com todos
  os itens "ok"; se algo falhar, mostre `/opt/mds/preparacao.log` e avise o usuário da limitação antes de produzir.
- Rede liberada: OpenArt (imagens), Openverse, Freesound, Wikimedia, Hugging Face e PyTorch.
  O Freesound bloqueia servidores de nuvem (403): não contornar.

## Entrega e git

- Publicar o HTML como Artifact (mesmo caminho = mesmo link), enviar o MP4 pelo app e fazer commit +
  push de `projetos/<nome>/` e de qualquer mudança em `studio/` ou na Skill.
- Mudanças no estúdio devem ser opcionais e compatíveis: não quebrar projetos antigos nem substituir
  ferramentas sem autorização do usuário.
