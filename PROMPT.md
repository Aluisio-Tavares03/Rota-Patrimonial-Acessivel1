# Prompt — Rota Patrimonial Acessível | v0.1 para GitHub Pages

Pedido usado para gerar a primeira versão do código com apoio de IA, seguindo o modelo do exemplo "Cafeteria Pedido Certo". O código gerado foi revisado e testado pela equipe; o registro está em `TESTES.md`.

---

Você é uma pessoa desenvolvedora front-end experiente, com atenção a requisitos e código didático. Implemente a **v0.1 da Rota Patrimonial Acessível**, um protótipo educacional que indica a rota com menos barreiras para pessoas com mobilidade reduzida em um mapa simplificado do Bairro do Recife.

Priorize um fluxo funcional, regras corretas, código compreensível por estudantes iniciantes e testes reproduzíveis. Siga os requisitos abaixo sem inventar novas funcionalidades.

## 1. Contexto, usuário e objetivo

No Bairro do Recife, as calçadas históricas têm paralelepípedo solto, degraus e trechos sem rampa. Quem tem mobilidade reduzida só descobre a barreira quando chega nela.

O usuário é a **pessoa com mobilidade reduzida (cadeirante, idoso ou adulto com carrinho de bebê)**, ou quem a acompanha. Ela escolhe o perfil, o ponto de saída e o ponto de chegada e recebe a rota de menor custo para o seu perfil, com trechos em ordem, condição de cada trecho, alertas, distância total e pontos de apoio.

A aplicação calcula **uma rota por vez**, em mapa fixo.

## 2. Tecnologia

- Somente **HTML, CSS e JavaScript puro**, sem backend, banco de dados, framework, build ou bibliotecas externas.
- `index.html` na raiz, caminhos relativos (`./styles.css`), scripts clássicos carregados em ordem, sem `fetch`.
- Funcionar abrindo o `index.html` localmente e no GitHub Pages.
- Nada é salvo; recarregar a página apaga as escolhas.

## 3. Mapa fixo (separado da lógica, em `mapa.js`)

Pontos: E1 Praça do Arsenal; E2 Esquina na Rua do Bom Jesus (ponto de apoio: estabelecimento parceiro com banheiro acessível); E3 Esquina na Rua da Moeda; E4 Destino de referência.

| Trecho | Liga | Distância | Piso | Rampa |
|---|---|---|---|---|
| T1 | E1 e E2 | 100 m | Regular | Sim |
| T2 | E2 e E4 | 100 m | Paralelepípedo | Sim |
| T3 | E1 e E3 | 150 m | Regular | Não (degrau) |
| T4 | E3 e E4 | 100 m | Regular | Sim |
| T5 | E2 e E3 | 80 m | Regular | Sim |

Trechos valem nos dois sentidos. Penalidades: paralelepípedo +300 cadeirante, +200 carrinho, +50 idoso; sem rampa: bloqueado para cadeirante, +300 carrinho, +50 idoso.

## 4. Regras de negócio

- **RN01:** perfil deve ser cadeirante, idoso ou carrinho de bebê; validar na lógica.
- **RN02:** saída e chegada devem existir no mapa e ser diferentes.
- **RN03:** custo do trecho = distância + penalidades do perfil.
- **RN04:** para cadeirante, trecho sem rampa é bloqueado.
- **RN05:** trecho interditado é bloqueado para todos. A interdição é marcada no mapa antes do cálculo; ofereça na tela uma simulação de interdição para a demonstração, sem alterar o mapa original.
- **RN06:** escolher a rota de menor custo total; em empate, a de menor distância.
- **RN07:** a distância exibida é a soma das distâncias reais, sem penalidades, em metros inteiros.
- **RN08:** trecho com paralelepípedo ou sem rampa na rota aparece com alerta.
- **RN09:** sem rota sem bloqueios, informar que não existe rota acessível conhecida para o perfil e não exibir rota.

## 5. Organização do código

Separe dados (`mapa.js`), regras (`regras.js`, sem DOM) e interface (`script.js`). Funções com parâmetros e retorno para validar perfil e pontos, calcular custo do trecho, calcular a rota e formatar a distância. Como o mapa é pequeno, pode testar todos os caminhos simples; explique isso em comentário.

## 6. Critérios de aceitação e testes

Implemente `tests.html` + `tests.js` (JavaScript puro, reutilizando as funções de `regras.js`), mostrando esperado, observado e aprovado/reprovado, cobrindo CA01 a CA08 da documentação, os custos de trecho, o bloqueio, a interdição e o desempate por distância. Em `TESTES.md`, descreva os passos manuais e **diferencie testes preparados de resultados observados**.

## 7. Arquivos

`index.html`, `styles.css`, `mapa.js`, `regras.js`, `script.js`, `tests.html`, `tests.js`, `README.md`, `TESTES.md`.

**Não implemente a v0.2 e não trate geração de código como comprovação de funcionamento.**
