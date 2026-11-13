# Identidade visual · Prumo, campanha «Seu negócio precisa de direção»

- **Conceito:** direção. O fio de prumo vira **bússola**: no começo tudo aponta para lados diferentes; com o Prumo, tudo se orienta na vertical.
- **Assinatura visual exclusiva — a bússola** (`remotion/src/components/Compass.jsx`): mostrador com 60 marcações que entram em cascata e inclinação 3D; o peso do prumo é a agulha (com contrapeso), gira 1,5 volta desacelerando, procura a direção com oscilação amortecida e trava apontando para baixo; reflexo de luz cruza o vidro; o disco vira o quadrado arredondado azul do ícone. Aparece duas vezes: no caos congelado (≈24,8 s) e no encerramento.
- **Assinatura sonora:** `assinatura_logo` (clique de trava + acorde de vidro) e `assinatura_bussola` (agulha de latão girando, trava, sino de vidro), com o clique alinhado ao quadro exato da trava.
- **Paleta:** cinza `#F5F5F7`, branco, grafite `#1D1D1F`, azul `#0071E3` (gradiente `#0058B8 → #2997FF`), vermelho `#FF3B30` só no ato do problema, sem a madeira da mesa (v1).
- **Tipografia:** Inter Display (títulos, Semibold/Bold) e Inter Text (interface).
- **Aberturas 2D** (`Cards2D.jsx`, `A_Abertura.jsx`, `G_Retorno.jsx`): as 4 frentes da rotina (Clientes, Vendas, Pagamentos, Operação) em cards com micro-animação; no ato 1 são soterradas por tarefas e notificações; no ato 6 voltam alinhadas com ✓ e o card «Finanças · Prumo» entra resolvido. (A mesa 3D da v1 foi retirada a pedido do usuário.)
- **Ritmo:** 60 fps; todas as animações 45% mais rápidas (`SPEED` em `animations/motion.js`).
- **Interface conceitual** (`AppUI.jsx`, `Screens.jsx`): Início, Movimentações (com filtro Receitas/Despesas), Agenda (compromissos + lembrete), Pessoal/Negócio, Reserva de impostos, Relatório do mês com categorias. Valores sempre «R$ •••»; selo «Demonstração · dados ilustrativos».
