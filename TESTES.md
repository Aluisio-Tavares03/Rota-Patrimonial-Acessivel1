# Testes da v0.1 — Rota Patrimonial Acessível

Há dois tipos de teste:

1. **Testes automáticos das regras** (`tests.html`): chamam as funções de `regras.js` diretamente, sem clicar na tela.
2. **Testes manuais da interface** (este roteiro): alguém da equipe abre o `index.html`, faz as ações e anota o que viu.

## Como os resultados foram obtidos

- **Execução automatizada (19/11/2026):** `tests.html` e os passos de interface abaixo foram executados por um script no navegador Chromium (Playwright), que clicou nos campos e leu o texto do resultado. A coluna "Observado" registra o que esse script leu na tela.
- **Execução manual pela equipe:** cada responsável repete os passos, salva um print em `evidencias/` (por exemplo `evidencias/M02.png`) e troca o texto entre colchetes da coluna "Manual (equipe)" pela data e pelo resultado, com um commit no próprio nome.

Um teste só deve ser marcado como aprovado na execução manual depois que alguém da equipe realmente fizer os passos e ver o resultado esperado.

## Testes automáticos (`tests.html`)

Resultado da execução de 19/11/2026: **21 de 21 aprovados**.

| Teste | O que verifica | Esperado | Observado |
|---|---|---|---|
| CA01 | Perfis disponíveis | Cadeirante, Idoso, Carrinho de bebê | Igual ao esperado |
| CA02 | Cadeirante E1 → E4 | E1 → E2 → E3 → E4 (T1, T5, T4), 280 m, sem alertas, apoio em E2 | Igual ao esperado |
| CA03 | Carrinho E1 → E4 | E1 → E2 → E3 → E4 (T1, T5, T4), 280 m, sem alertas | Igual ao esperado (também mostra apoio em E2) |
| CA03b | Custo escolhido do carrinho | 280 (a rota curta custaria 400) | 280 |
| CA04 | Idoso E1 → E4 | E1 → E2 → E4 (T1, T2), 200 m, alerta de paralelepípedo em T2, apoio em E2 | Igual ao esperado |
| CA05 | T1 interditado, idoso | E1 → E3 → E4 (T3, T4), 250 m, alerta de degrau em T3 | Igual ao esperado |
| CA06 | T1 interditado, cadeirante | Mensagem de que não existe rota acessível conhecida | Igual ao esperado |
| CA07a/b/c | Perfil "4", "abc" e vazio | Mensagem de perfil inválido | Igual ao esperado |
| CA08 | Saída igual à chegada | Mensagem de que saída e chegada precisam ser diferentes | Igual ao esperado |
| RN02 | Ponto inexistente (E9) | Mensagem de ponto inválido | Igual ao esperado |
| RN03a/b/c | Custo de T2 cadeirante, T3 carrinho, T3 idoso | 400, 450, 200 | 400, 450, 200 |
| RN04 | T3 para cadeirante | Bloqueado | Bloqueado |
| RN05 | T1 interditado para idoso | Bloqueado | Bloqueado |
| RN06 | Dois caminhos de custo 300 (mapa de teste A, B, C) | Vence A → C → B, 250 m | A → C → B, 250 m |
| RN07 | Distância sem penalidade (idoso) | custo 250, distância 200 | custo 250, distância 200 |
| SENTIDO | Cadeirante E4 → E1 | E4 → E3 → E2 → E1, 280 m | Igual ao esperado |
| MAPA | Simular interdição não altera o mapa original | T1 continua liberado | T1 continua liberado |

Para repetir: abra `tests.html` no navegador e confira o placar no topo.

## Testes manuais da interface

Antes de cada teste: abra `index.html` (ou recarregue a página) e deixe "Simular trecho interditado" sem nenhum trecho marcado, a não ser que o passo peça.

| Teste | Entrada ou ação | Resultado esperado | Observado (execução automatizada, 19/11/2026) | Manual (equipe) |
|---|---|---|---|---|
| M01 (CA01) | Abrir a página e olhar o item "1. Seu perfil" e as listas de pontos. | Três perfis: Cadeirante, Idoso, Carrinho de bebê. Listas com E1 a E4. | Três perfis e pontos E1 a E4 exibidos. | Responsável: Eric Guzik. [data, resultado e print] |
| M02 (CA02) | Escolher Cadeirante, saída E1, chegada E4. Clicar em "Calcular rota". | Rota E1 → E2 → E3 → E4 (T1, T5, T4), 280 m, sem alertas, apoio em E2. | Rota E1 → E2 → E3 → E4, trechos T1, T5, T4, 280 m, nenhum alerta, apoio em E2. | Responsável: Luiz Targino. [data, resultado e print] |
| M03 (CA03) | Escolher Carrinho de bebê, saída E1, chegada E4. Calcular. | Rota E1 → E2 → E3 → E4, 280 m, sem alertas. | Rota E1 → E2 → E3 → E4, 280 m, nenhum alerta, custo 280, apoio em E2. | Responsável: Luiz Targino. [data, resultado e print] |
| M04 (CA04) | Escolher Idoso, saída E1, chegada E4. Calcular. | Rota E1 → E2 → E4 (T1, T2), 200 m, alerta de paralelepípedo em T2, apoio em E2. | Rota E1 → E2 → E4, 200 m, "Alerta: paralelepípedo" em T2, custo 250, apoio em E2. | Responsável: Luiz Targino. [data, resultado e print] |
| M05 (CA05) | Abrir "Simular trecho interditado", marcar T1. Escolher Idoso, E1, E4. Calcular. | Rota E1 → E3 → E4 (T3, T4), 250 m, alerta de degrau em T3. | Rota E1 → E3 → E4, 250 m, "Alerta: sem rampa (degrau)" em T3, sem pontos de apoio. | Responsável: Luiz Targino. [data, resultado e print] |
| M06 (CA06) | Com T1 marcado, escolher Cadeirante, E1, E4. Calcular. | Mensagem de que não existe rota acessível conhecida para cadeirante, sem rota. | "Não existe rota acessível conhecida para o perfil Cadeirante entre esses pontos." Nenhuma rota exibida. | Responsável: Luiz Targino. [data, resultado e print] |
| M07 (CA07) | Recarregar a página e clicar em "Calcular rota" sem escolher perfil. | Mensagem de perfil inválido, pedindo a escolha. | "Perfil inválido. Escolha cadeirante, idoso ou carrinho de bebê." | Responsável: Eric Guzik. [data, resultado e print] |
| M08 (CA08) | Escolher um perfil e o mesmo ponto (E2) como saída e chegada. Calcular. | Mensagem de que saída e chegada precisam ser diferentes. | "Saída e chegada precisam ser diferentes. Escolha de novo." O resultado anterior continua na tela. | Responsável: Eric Guzik. [data, resultado e print] |

Observação sobre o CA07: na tela, o perfil é escolhido em botões de opção, então não dá para digitar "4" ou "abc". Esses valores são testados direto na função `validarPerfil` (testes CA07a e CA07b do `tests.html`). Na tela, o caso possível é não escolher nenhum perfil (M07).
