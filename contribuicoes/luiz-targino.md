# Luiz Targino — T10 — Revisar o cálculo da rota

**Integrante:** Luiz Targino (@LuizTargino01)
**Tarefa:** T10 — Revisar o cálculo da rota
**Apoio ou revisão:** João Pohlmann

> Edite só este arquivo, pela sua própria conta do GitHub. Troque cada `[preencher]` pelo que você fez e viu. Os passos de cada teste estão no [`TESTES.md`](../TESTES.md).

## O que revisar no código

- [ ] Em `regras.js`: `calcularCustoTrecho` (distância + penalidade, bloqueio sem rampa e trecho interditado).
- [ ] Em `regras.js`: `listarCaminhos` e `calcularRota` (escolhe o menor custo e, no empate, a menor distância).

## Conta à mão

Some distância + penalidade de cada trecho da rota escolhida e confira com a tela.

| Caso | Rota esperada | Custo calculado à mão | Distância (sem penalidade) |
|---|---|---|---|
| Cadeirante, E1 → E4 | E1 → E2 → E3 → E4 | [preencher] | [preencher] |
| Carrinho de bebê, E1 → E4 | E1 → E2 → E3 → E4 | [preencher] | [preencher] |
| Idoso, E1 → E4 | E1 → E2 → E4 | [preencher] | [preencher] |
| Idoso, E1 → E4, T1 interditado | E1 → E3 → E4 | [preencher] | [preencher] |

## Testes manuais

| Teste | Ação | Resultado esperado | Data | O que apareceu na tela | Situação | Print |
|---|---|---|---|---|---|---|
| M02 (CA02) | Cadeirante, E1 → E4. Calcular. | E1 → E2 → E3 → E4 (T1, T5, T4), 280 m, sem alertas, apoio em E2. | [preencher] | [preencher] | [preencher: Aprovado ou Reprovado] | [preencher: ex. `evidencias/M02-luiz.png`] |
| M03 (CA03) | Carrinho de bebê, E1 → E4. Calcular. | E1 → E2 → E3 → E4, 280 m, sem alertas. | [preencher] | [preencher] | [preencher] | [preencher] |
| M04 (CA04) | Idoso, E1 → E4. Calcular. | E1 → E2 → E4 (T1, T2), 200 m, alerta de paralelepípedo em T2, apoio em E2. | [preencher] | [preencher] | [preencher] | [preencher] |
| M05 (CA05) | Marcar T1 interditado. Idoso, E1 → E4. Calcular. | E1 → E3 → E4 (T3, T4), 250 m, alerta de degrau em T3. | [preencher] | [preencher] | [preencher] | [preencher] |
| M06 (CA06) | Com T1 marcado, Cadeirante, E1 → E4. Calcular. | Mensagem de que não existe rota acessível; nenhuma rota exibida. | [preencher] | [preencher] | [preencher] | [preencher] |

## Como conferi

[preencher: em poucas frases, o que você abriu, o que comparou e com o quê]

## Problemas encontrados

[preencher: escreva "Nenhum" ou descreva o que estava diferente do esperado]

---

Conferido por [preencher: seu nome] em [preencher: data].
