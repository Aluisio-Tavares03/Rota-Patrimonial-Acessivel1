# Rota Patrimonial Acessível

**Primeira entrega da AV2: definições e planejamento da v0.1**

- **Disciplina:** Fundamentos de Programação
- **Etapa de referência:** 17/11 — definições e planejamento
- **Equipe (Lente 2):** Aluisio Tavares, Eric Guzik, Felipe Jansen, João Pohlmann e Luiz Targino

> **Nota sobre o escopo desta entrega:** Este documento cobre só a primeira entrega da AV2. Ainda não tem implementação, demonstração nem resultado de testes. O mapa usado nas regras é simplificado e serve apenas para o protótipo: distâncias e condições dos trechos foram definidas pela equipe como referência e ainda precisam ser conferidas em campo.

---

## 1. Visão Geral do Projeto

- **Nome:** Rota Patrimonial Acessível.
- **Contexto e problema:** No Bairro do Recife, as calçadas históricas têm paralelepípedo solto, degraus e trechos sem rampa. Quem tem mobilidade reduzida só descobre a barreira quando chega nela e, muitas vezes, acaba descendo para a rua, disputando espaço com os carros. O problema não é só a calçada ruim: é que a pessoa não consegue saber, antes de sair, se vai conseguir completar o trajeto inteiro.
- **Usuário principal:** Pessoa com mobilidade reduzida (ou quem a acompanha) que vai circular a pé pelo Bairro do Recife: cadeirante, idoso ou adulto empurrando carrinho de bebê.
- **Objetivo:** Permitir que o usuário informe seu perfil, o ponto de saída e o ponto de chegada, e receba a rota com menos barreiras para o seu perfil, com os trechos em ordem, a distância total, os alertas de cada trecho e os pontos de apoio no caminho.
- **Recorte da implementação:** A v0.1 vai calcular uma rota por vez, em um mapa fixo e simplificado de 4 pontos e 5 trechos dentro do recorte das três ruas do projeto (Rua do Bom Jesus, Rua da Moeda e Praça do Arsenal), com 3 perfis de usuário e resposta em texto. Não pretende ser um aplicativo de navegação.

## 2. História de Usuário

> "Como pessoa com mobilidade reduzida que vai circular pelo Bairro do Recife, quero informar meu perfil, de onde saio e aonde vou, para saber antes de sair por quais trechos consigo passar e onde posso parar se precisar."

## 3. Requisitos Funcionais

Requisitos funcionais descrevem o que a solução deve fazer.

| Código | Requisito | Prioridade para a v0.1 |
|---|---|---|
| RF01 | Exibir os perfis disponíveis (cadeirante, idoso, carrinho de bebê) e pedir que o usuário escolha um. | Essencial |
| RF02 | Exibir os pontos de referência do mapa e pedir o ponto de saída e o ponto de chegada. | Essencial |
| RF03 | Calcular o custo de cada trecho de acordo com o perfil escolhido. | Essencial |
| RF04 | Desconsiderar os trechos bloqueados para o perfil escolhido e os trechos interditados. | Essencial |
| RF05 | Encontrar a rota de menor custo entre a saída e a chegada. | Essencial |
| RF06 | Exibir a rota em texto: trechos em ordem, condição de cada trecho, distância total e pontos de apoio no caminho. | Essencial |
| RF07 | Informar quando não existe rota possível para o perfil escolhido. | Essencial |

## 4. Requisitos Não Funcionais

Requisitos não funcionais descrevem condições de qualidade e uso.

| Código | Requisito | Como verificar |
|---|---|---|
| RNF01 | Apresentar perfis, pontos, orientações e mensagens em português. | Conferir os textos do fluxo principal. |
| RNF02 | Exibir distâncias em metros, como números inteiros. | Conferir a distância de cada trecho e a total no resultado. |
| RNF03 | Mostrar no resultado a condição de cada trecho (piso e rampa), e não só a rota final. | Verificar se o usuário consegue entender por que a rota foi escolhida. |
| RNF04 | Executar o fluxo principal em Python, no terminal ou no Google Colab, sem exigir serviço pago nem internet além do próprio ambiente. | Rodar o programa nesse ambiente e percorrer o fluxo. |
| RNF05 | Manter o mapa (pontos, trechos, interdições) separado da lógica de cálculo, para que um trecho possa ser alterado sem mexer no algoritmo. | Alterar a condição de um trecho no mapa e conferir se a rota muda sem editar outra parte do código. |

**Escolha tecnológica:** Python, com o mapa guardado em listas e dicionários, como visto nas aulas.

## 5. Regras de Negócio

Regras de negócio descrevem as condições que determinam o comportamento da solução.

### 5.1 Mapa de Referência da v0.1

#### Pontos de referência

| Ponto | Descrição | Ponto de apoio |
|---|---|---|
| E1 | Praça do Arsenal (saída dos exemplos) | Não |
| E2 | Esquina na Rua do Bom Jesus | Sim: estabelecimento parceiro com banheiro acessível |
| E3 | Esquina na Rua da Moeda | Não |
| E4 | Destino de referência | Não |

#### Trechos

| Trecho | Liga | Distância | Piso | Rampa nas pontas |
|---|---|---|---|---|
| T1 | E1 e E2 | 100 m | Regular | Sim |
| T2 | E2 e E4 | 100 m | Paralelepípedo | Sim |
| T3 | E1 e E3 | 150 m | Regular | Não (degrau) |
| T4 | E3 e E4 | 100 m | Regular | Sim |
| T5 | E2 e E3 | 80 m | Regular | Sim |

> **Observação:** Os valores são de referência, definidos para o protótipo. Os trechos podem ser percorridos nos dois sentidos.

### 5.2 Penalidades por Perfil

| Condição do trecho | Cadeirante | Carrinho de bebê | Idoso |
|---|---|---|---|
| Paralelepípedo | +300 | +200 | +50 |
| Sem rampa (degrau) | Bloqueado | +300 | +50 |

### 5.3 Regras Gerais

| Código | Regra |
|---|---|
| RN01 | O perfil deve ser um dos três disponíveis (cadeirante, idoso, carrinho de bebê). Qualquer outra entrada é inválida. |
| RN02 | Saída e chegada devem ser pontos existentes no mapa e diferentes entre si. |
| RN03 | O custo de um trecho é a sua distância em metros somada às penalidades do perfil escolhido, conforme a tabela acima. |
| RN04 | Para o cadeirante, trecho sem rampa é bloqueado e não pode fazer parte da rota. |
| RN05 | Trecho interditado (obra, evento) é bloqueado para todos os perfis. Na v0.1, a interdição é marcada no mapa antes de rodar o programa. |
| RN06 | A rota escolhida é a de menor custo total. Em caso de empate no custo, vale a de menor distância. |
| RN07 | A distância exibida é a soma das distâncias reais dos trechos, sem as penalidades. |
| RN08 | Todo trecho com paralelepípedo ou sem rampa que faça parte da rota aparece com um alerta no resultado. |
| RN09 | Se não houver rota sem trechos bloqueados, o programa informa que não existe rota acessível conhecida para aquele perfil e não exibe rota. |

> **Exemplo de distinção:** "calcular a rota" é uma funcionalidade; "o cadeirante nunca passa por trecho sem rampa, e o idoso passa pagando +50" é a regra que orienta esse cálculo.

## 6. Critérios de Aceitação

Os critérios descrevem o que precisa acontecer para considerar uma funcionalidade atendida. Nesta entrega, são expectativas planejadas, não afirmações de que a solução já foi implementada ou testada.

| Código | Situação e ação | Resultado esperado | Referências |
|---|---|---|---|
| CA01 | Ao iniciar, o usuário consulta os perfis. | São exibidos os três perfis: cadeirante, idoso e carrinho de bebê. | RF01; RN01 |
| CA02 | Cadeirante pede rota de E1 para E4. | Rota E1 → E2 → E3 → E4 (T1, T5, T4), 280 m, sem alertas, com ponto de apoio em E2. | RF03–RF06; RN03, RN04, RN06, RN07 |
| CA03 | Carrinho de bebê pede rota de E1 para E4. | Rota E1 → E2 → E3 → E4, 280 m, sem alertas. A rota mais curta (E1 → E2 → E4, 200 m) custa 400 por causa do paralelepípedo e perde para a de custo 280. | RF03–RF06; RN03, RN06 |
| CA04 | Idoso pede rota de E1 para E4. | Rota E1 → E2 → E4 (T1, T2), 200 m, com alerta de paralelepípedo em T2 e ponto de apoio em E2. | RF03–RF06; RN03, RN06, RN08 |
| CA05 | Com T1 interditado, idoso pede rota de E1 para E4. | Rota E1 → E3 → E4 (T3, T4), 250 m, com alerta de degrau em T3. | RF04–RF06; RN05, RN08 |
| CA06 | Com T1 interditado, cadeirante pede rota de E1 para E4. | O programa informa que não existe rota acessível conhecida para cadeirante e não exibe rota. | RF04, RF07; RN04, RN05, RN09 |
| CA07 | O usuário digita um perfil que não existe (ex.: "4" ou "abc"). | O programa informa que o perfil é inválido e pede a escolha de novo. | RF01; RN01 |
| CA08 | O usuário escolhe o mesmo ponto como saída e chegada. | O programa informa que saída e chegada precisam ser diferentes e pede de novo. | RF02; RN02 |

## 7. Escopo da v0.1

### 7.1 Deve estar incluído

- Mapa fixo com os 4 pontos e 5 trechos de referência.
- Escolha de perfil, saída e chegada, com validação.
- Cálculo do custo por trecho com as penalidades de cada perfil.
- Bloqueio de trechos sem rampa para cadeirante e de trechos interditados.
- Escolha da rota de menor custo, com desempate pela menor distância.
- Resultado em texto com trechos, alertas, distância total e pontos de apoio.
- Mensagem quando não existe rota.

### 7.2 Não faz parte desta versão

- Mapa visual, GPS ou navegação em tempo real.
- Aplicativo de celular ou site.
- Atualização automática de obras, eventos, maré ou clima.
- Ruas fora do recorte das três ruas do projeto.
- Dados levantados em campo (a v0.1 usa valores de referência).
- Cadastro de usuários e o selo dos comerciantes parceiros.

### 7.3 Fluxo principal planejado

1. O usuário escolhe o perfil.
2. Informa o ponto de saída e o ponto de chegada.
3. O programa calcula o custo de cada trecho para aquele perfil e descarta os bloqueados.
4. O programa encontra a rota de menor custo.
5. O programa exibe os trechos em ordem, os alertas, a distância total e os pontos de apoio.

**Condição de sucesso do recorte:** percorrer esse fluxo para os três perfis e obter, para cada um, uma rota coerente com as regras e com os critérios de aceitação. Não é necessário construir um aplicativo de navegação.

## 8. Backlog e Divisão de Responsabilidades

O responsável conduz a tarefa, mas não precisa fazer sozinho. Ajustar os nomes conforme a divisão combinada no grupo.

| Tarefa | Resultado esperado | Responsável | Apoio ou revisão | Previsão |
|---|---|---|---|---|
| T01 — Consolidar usuário, problema e recorte | Definições coerentes com a tese da Lente 2 | Luiz Targino | Toda a equipe | Até 16/11 |
| T02 — Revisar requisitos funcionais e não funcionais | Requisitos sem contradição com as regras e o escopo | Felipe Jansen | Aluisio Tavares | Até 16/11 |
| T03 — Definir mapa de referência e penalidades | Pontos, trechos e penalidades fechados e justificados | João Pohlmann | Eric Guzik | Até 16/11 |
| T04 — Conferir critérios de aceitação | Rotas e distâncias dos exemplos recalculadas e ligadas às regras | Aluisio Tavares | Luiz Targino | Até 16/11 |
| T05 — Organizar repositório, acessos e entrega | Repositório com o professor, integrantes identificados e links conferidos | Aluisio Tavares | Luiz Targino | Até 16/11 |
| T06 — Planejar entrada e validação | Divisão da implementação do menu de perfis e pontos (RF01, RF02) | Eric Guzik | Felipe Jansen | Planejar até 17/11 |
| T07 — Planejar o cálculo da rota | Divisão da implementação do custo por trecho e da busca da rota (RF03–RF05) | Luiz Targino | João Pohlmann | Planejar até 17/11 |
| T08 — Planejar a saída e as mensagens | Divisão da implementação do resultado em texto e da mensagem sem rota (RF06, RF07) | Felipe Jansen | Aluisio Tavares | Planejar até 17/11 |

## 9. Registro Individual de Contribuição

Cada integrante registra o que fez de verdade e como conferiu.

| Integrante | O que fez nesta etapa | Como conferiu |
|---|---|---|
| Aluisio Tavares<br>@Aluisio-Tavares03 | **T04 (critérios de aceitação):** Escrevi e recalculei os critérios de aceitação.<br>**T05 (repositório e entrega):** Organizei o repositório, coloquei o documento no arquivo "Rota patrimonial acessivel.md" e liberei o acesso pro professor. | **T04:** Refiz a conta de cada rota, somando distância e penalidade de cada trecho, e conferi se cada critério aponta pros requisitos e regras certos.<br>**T05:** Conferi se todos os links abrem numa aba anônima e se cada integrante aparece com o usuário do GitHub. |
| Eric Guzik<br>@emg-tech | **T06 (entrada e validação):** Planejei a parte de entrada do programa: menu de perfis, escolha da saída e da chegada e as validações. | Conferi se os casos de entrada inválida batem com os critérios CA07 e CA08. |
| Felipe Jansen<br>@fjes-sys | **T02 (requisitos):** Revisei os requisitos funcionais e não funcionais.<br>**T08 (saída e mensagens):** Planejei a parte de saída do programa: a exibição da rota em texto, com os trechos em ordem, a condição de cada trecho, os alertas, a distância total e os pontos de apoio, e a mensagem para quando não existe rota. | **T02:** Conferi se cada requisito funcional tem pelo menos uma regra e um critério de aceitação ligados a ele, e se cada não funcional tem uma forma de verificação.<br>**T08:** Conferi se a saída planejada mostra tudo o que pedem o RF06, o RNF02 e o RNF03, se os alertas seguem a RN08 e se a mensagem sem rota bate com a RN09 e o critério CA06. |
| João Pohlmann<br>@jfpbcs-maker | **T03 (mapa e penalidades):** Defini o mapa de referência (pontos, trechos, piso e rampa) e a tabela de penalidades por perfil. | Conferi se as penalidades geram rotas diferentes pra cada perfil e se não deixam dúvida sobre bloqueio e desempate. |
| Luiz Targino<br>@LuizTargino01 | **T01 (usuário, problema e recorte):** Escrevi a visão geral do projeto: o problema, o usuário principal, o objetivo e o recorte da v0.1, usando como base o Relatório Executivo e a tese da Lente 2.<br>**T07 (cálculo da rota):** Planejei a parte do cálculo: custo de cada trecho, bloqueios e busca da rota de menor custo. | **T01:** Conferi se o fluxo principal resolve o problema descrito (saber antes de sair se dá pra completar o trajeto) e se o recorte de 4 pontos e 5 trechos cabe numa versão mínima.<br>**T07:** Conferi se o plano cobre as regras RN03 a RN06 e os critérios CA02 a CA06. |

