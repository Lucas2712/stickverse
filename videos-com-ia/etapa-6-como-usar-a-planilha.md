# Etapa 6 · Como usar a planilha de controle

Arquivo: `etapa-6-planilha-de-controle.csv` (30 linhas, uma por dia de campanha).

## Como abrir

- **Google Planilhas (recomendado, funciona no iPhone):** sheets.google.com → Arquivo → Importar →
  Fazer upload → escolha o arquivo → **Tipo de separador: Ponto e vírgula** → Importar dados.
- **Excel (computador):** abra o arquivo direto. Ele já usa ponto e vírgula, o padrão do Excel em português.
- **Numbers (iPhone/Mac):** abra o arquivo pelo app Arquivos.

As fórmulas só usam contas simples (+, −, ×, ÷), justamente para funcionar em qualquer um desses programas.

## O que você preenche (todo dia)

| Coluna | De onde tirar |
|---|---|
| Data | O dia |
| Gasto anúncios (R$) | Gerenciador de Anúncios → "Valor usado" do dia |
| Cliques no link | Gerenciador de Anúncios → "Cliques no link" |
| Visualizações da página | Gerenciador de Anúncios → "Visualizações da página de destino" |
| Checkouts iniciados | Gerenciador de Anúncios ou relatório da Kiwify/Hotmart |
| Vendas curso / bump / upsell | Relatório de vendas da Kiwify/Hotmart (quantidade de cada um) |
| Valor líquido recebido (R$) | Relatório da plataforma: o valor **depois das taxas** (é o que de fato cai para você) |
| Reembolsos (R$) | Relatório da plataforma: valor devolvido no dia |
| Observações | O que você mudou ("pausei o anúncio 2", "troquei o gancho") |

## O que a planilha calcula sozinha

| Coluna | Conta |
|---|---|
| Faturamento bruto | vendas do curso × 37 + bumps × 14,90 + upsells × 47 |
| Custo por venda | gasto ÷ vendas do curso |
| Lucro do dia | valor líquido − reembolsos − gasto em anúncios |
| Gasto acumulado | soma do gasto até aquele dia |
| Lucro acumulado | soma do lucro até aquele dia (o número mais importante) |

**Atenção:**
- **Dia sem nenhuma venda:** a coluna "Custo por venda" mostra o próprio gasto do dia (para não aparecer
  erro de divisão por zero). Leia como "gastei isso e ainda não vendi".
- **Se mudar algum preço**, atualize a fórmula da coluna "Faturamento bruto" (os valores 37, 149/10 e 47).
  O 149/10 é o jeito de escrever 14,90 que funciona tanto no Excel quanto no Google Planilhas.
- **Reembolso** pode aparecer dias depois da venda. Lance no dia em que ele aconteceu.

## Como ler os números (resumo da Etapa 5)

1. **Lucro acumulado subindo:** a campanha está se pagando. Pode aumentar o orçamento em até 20% a cada 3 dias.
2. **Lucro acumulado caindo e já passou do limite de teste (R$ 175):** pausar e rever o criativo e a página.
3. **Muitos cliques e poucos checkouts:** o problema está na página de vendas.
4. **Muitos checkouts e poucas vendas:** o problema está no checkout (preço, forma de pagamento, confiança).
5. **Poucos cliques:** o problema está no começo do vídeo do anúncio.
