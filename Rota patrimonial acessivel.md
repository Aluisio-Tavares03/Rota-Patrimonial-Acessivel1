# Rota Patrimonial Acessível

**Documentação final da AV2: definições, planejamento e implementação da v0.1**

- **Disciplina:** Fundamentos de Programação
- **Etapas de referência:** 17/11 — definições e planejamento (Entrega 1); apresentação integrada com a demonstração da v0.1 (Entrega 2)
- **Equipe (Lente 2):** Aluisio Tavares, Eric Guzik, Felipe Jansen, João Pohlmann e Luiz Targino

> **Nota sobre o escopo:** As seções 1 a 9 são as definições e o planejamento da Entrega 1, com os ajustes registrados na seção 10.2. A seção 10 traz a Entrega 2: o que entrou na v0.1, o que ficou de fora, o registro dos testes, a proposta de v0.2 e as contribuições. O mapa usado nas regras é simplificado e serve apenas para o protótipo: distâncias e condições dos trechos foram definidas pela equipe como referência e ainda precisam ser conferidas em campo.

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
| RNF04 | Executar o fluxo principal no navegador, pelo site no GitHub Pages ou abrindo o `index.html` localmente, sem instalar nada e sem serviço pago. *(Na Entrega 1 era Python no terminal ou Colab; ver decisão D1 na seção 10.2.)* | Abrir o `index.html` e percorrer o fluxo. |
| RNF05 | Manter o mapa (pontos, trechos, interdições) separado da lógica de cálculo, para que um trecho possa ser alterado sem mexer no algoritmo. | Alterar a condição de um trecho no mapa e conferir se a rota muda sem editar outra parte do código. |

**Escolha tecnológica:** HTML, CSS e JavaScript puro, em uma página que roda no navegador. O mapa fica em listas e objetos no arquivo `mapa.js`, separado da lógica em `regras.js`. Na Entrega 1 o plano era Python; a troca está registrada na decisão D1 (seção 10.2).

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
| RN05 | Trecho interditado (obra, evento) é bloqueado para todos os perfis. Na v0.1, a interdição é marcada antes do cálculo: no arquivo `mapa.js` ou pela simulação de interdição da tela (decisão D2). |
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
- Aplicativo de celular. (A v0.1 é uma página web simples, sem mapa visual; ver decisão D1.)
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
| Aluisio Tavares<br>@Aluisio-Tavares03 | **T04 (critérios de aceitação):** Escrevi e recalculei os critérios de aceitação.<br>**T05 (repositório e entrega):** Organizei o repositório, coloquei o documento no arquivo "Rota patrimonial acessível.md" e liberei o acesso pro professor. | **T04:** Refiz a conta de cada rota, somando distância e penalidade de cada trecho, e conferi se cada critério aponta pros requisitos e regras certos.<br>**T05:** Conferi se todos os links abrem numa aba anônima e se cada integrante aparece com o usuário do GitHub. |
| Eric Guzik<br>@emg-tech | **T06 (entrada e validação):** Planejei a parte de entrada do programa: menu de perfis, escolha da saída e da chegada e as validações. | Conferi se os casos de entrada inválida batem com os critérios CA07 e CA08. |
| Felipe Jansen<br>@fjes-sys | **T02 (requisitos):** Revisei os requisitos funcionais e não funcionais.<br>**T08 (saída e mensagens):** Planejei a parte de saída do programa: a exibição da rota em texto, com os trechos em ordem, a condição de cada trecho, os alertas, a distância total e os pontos de apoio, e a mensagem para quando não existe rota. | **T02:** Conferi se cada requisito funcional tem pelo menos uma regra e um critério de aceitação ligados a ele, e se cada não funcional tem uma forma de verificação.<br>**T08:** Conferi se a saída planejada mostra tudo o que pedem o RF06, o RNF02 e o RNF03, se os alertas seguem a RN08 e se a mensagem sem rota bate com a RN09 e o critério CA06. |
| João Pohlmann<br>@jfpbcs-maker | **T03 (mapa e penalidades):** Defini o mapa de referência (pontos, trechos, piso e rampa) e a tabela de penalidades por perfil. | Conferi se as penalidades geram rotas diferentes pra cada perfil e se não deixam dúvida sobre bloqueio e desempate. |
| Luiz Targino<br>@LuizTargino01 | **T01 (usuário, problema e recorte):** Escrevi a visão geral do projeto: o problema, o usuário principal, o objetivo e o recorte da v0.1, usando como base o Relatório Executivo e a tese da Lente 2.<br>**T07 (cálculo da rota):** Planejei a parte do cálculo: custo de cada trecho, bloqueios e busca da rota de menor custo. | **T01:** Conferi se o fluxo principal resolve o problema descrito (saber antes de sair se dá pra completar o trajeto) e se o recorte de 4 pontos e 5 trechos cabe numa versão mínima.<br>**T07:** Conferi se o plano cobre as regras RN03 a RN06 e os critérios CA02 a CA06. |


---

## 10. Entrega 2: implementação e demonstração da v0.1

- **Usuário:** pessoa com mobilidade reduzida (cadeirante, idoso ou adulto com carrinho de bebê) que vai circular a pé pelo Bairro do Recife.
- **Problema:** a pessoa só descobre a barreira quando chega nela e não sabe, antes de sair, se vai conseguir completar o trajeto.
- **Objetivo:** escolher perfil, saída e chegada e receber a rota com menos barreiras, com trechos em ordem, alertas, distância total e pontos de apoio.
- **Solução:** site estático em HTML, CSS e JavaScript puro, publicado no GitHub Pages. Também roda abrindo o `index.html` no computador. Nada é salvo; recarregar a página apaga as escolhas.

### Links de referência

- **Repositório:** https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1
- **Solução publicada:** https://aluisio-tavares03.github.io/Rota-Patrimonial-Acessivel1/
- **Testes automáticos publicados:** https://aluisio-tavares03.github.io/Rota-Patrimonial-Acessivel1/tests.html
- **Versão no repositório:** tag `v0.1`.

**Como executar sem internet**

1. Entre em https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1
2. Clique em **Code → Download ZIP** e descompacte a pasta. Quem usa Git pode clonar: `git clone https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1.git`
3. Dentro da pasta, dê dois cliques em `index.html`. Ele abre no navegador (Chrome, Firefox ou Edge) e já funciona, sem instalar nada e sem internet.
4. Para ver os testes automáticos, abra `tests.html` na mesma pasta. O placar no topo mostra quantos foram aprovados.

- **Prompt usado com a IA:** [`PROMPT.md`](./PROMPT.md)

### 10.1 O que entrou no escopo da v0.1

| Item | Comportamento implementado | Referência da documentação | Onde está no código |
|---|---|---|---|
| Perfis | Exibir cadeirante, idoso e carrinho de bebê e recusar perfil fora da lista. | RF01; RN01 | `mapa.js` (`PERFIS`); `regras.js` (`validarPerfil`) |
| Pontos | Exibir E1 a E4 e exigir saída e chegada existentes e diferentes. | RF02; RN02 | `regras.js` (`validarPontos`) |
| Custo por trecho | Distância somada às penalidades do perfil. | RF03; RN03 | `regras.js` (`calcularCustoTrecho`) |
| Bloqueios | Descartar trecho sem rampa para cadeirante e trecho interditado para todos. | RF04; RN04, RN05 | `regras.js` (`calcularCustoTrecho`) |
| Rota de menor custo | Testar os caminhos possíveis e escolher o de menor custo; em empate, o de menor distância. | RF05; RN06 | `regras.js` (`listarCaminhos`, `calcularRota`) |
| Resultado em texto | Trechos em ordem com piso e rampa, alertas, distância total em metros inteiros e pontos de apoio. | RF06; RN07, RN08; RNF02, RNF03 | `regras.js` (`calcularRota`, `alertasDoTrecho`, `formatarDistancia`); `script.js` (`mostrarResultado`) |
| Sem rota | Informar que não existe rota acessível conhecida para o perfil e não mostrar rota. | RF07; RN09 | `regras.js` (`calcularRota`) |
| Mapa separado da lógica | Pontos, trechos e penalidades só em `mapa.js`. | RNF05 | `mapa.js` |

**Fluxo principal demonstrado:** escolher o perfil → escolher saída e chegada → (opcional) simular trecho interditado → calcular rota → ler trechos, alertas, distância total e pontos de apoio.

### 10.2 Decisões tomadas na implementação

| Código | Decisão | Motivo |
|---|---|---|
| D1 | Trocar Python (terminal ou Colab) por HTML, CSS e JavaScript puro, em uma página que roda no navegador. RNF04, a escolha tecnológica e o item "site" da seção 7.2 foram ajustados. | O professor aceitou outras linguagens, e a página roda em qualquer navegador sem instalar nada, o que facilita a demonstração. As regras e os critérios não mudaram. |
| D2 | Incluir na tela uma "simulação de trecho interditado", com caixas de marcar T1 a T5. | A RN05 diz que a interdição é marcada antes do cálculo. Durante a demonstração não dá para editar o mapa a cada caso, e sem isso não seria possível demonstrar CA05 e CA06. A simulação cria uma cópia do mapa e não altera `mapa.js`. |
| D3 | Escolher perfil por botões de opção e pontos por listas. | Evita digitação errada. Os valores inválidos do CA07 ("4", "abc") são testados direto na função `validarPerfil`; na tela, o caso possível é calcular sem escolher perfil. |
| D4 | Buscar a rota testando todos os caminhos sem repetir ponto, em vez de Dijkstra. | Com 4 pontos e 5 trechos, é mais fácil de entender e de conferir à mão. Para um mapa maior, Dijkstra seria o indicado (anotado no código). |
| D5 | Mostrar também o custo usado na escolha, além da distância. | Ajuda a explicar por que a rota mais curta nem sempre é a escolhida (RNF03). |
| D6 | Listar como ponto de apoio qualquer ponto da rota com apoio, incluindo saída e chegada. | A documentação não dizia se saída e chegada contam. No CA03 a rota passa por E2, então o resultado também mostra o apoio em E2. |

### 10.3 O que ficou fora da v0.1

| Funcionalidade | Situação |
|---|---|
| Mapa visual, GPS e navegação em tempo real | Fora do recorte; o resultado é em texto. |
| Aplicativo de celular | Fora do recorte; a v0.1 é uma página web simples. |
| Atualização automática de obras, eventos, maré e clima | Fora do recorte; a interdição é marcada à mão antes do cálculo. |
| Ruas fora das três do projeto e dados levantados em campo | Fora do recorte; o mapa usa valores de referência. |
| Cadastro de usuários e selo dos comerciantes parceiros | Fora do recorte. |
| Salvar rotas ou histórico | Fora do recorte; nada é guardado. |
| Exigir passar por um ponto de apoio | Não foi pedido na v0.1; é a melhoria proposta para a v0.2. |

### 10.4 Proposta para a v0.2

**Necessidade a validar na apresentação.** A história de usuário diz "saber onde posso parar se precisar". Na v0.1, o ponto de apoio só aparece se a rota de menor custo passar por ele por acaso. Quem precisa de banheiro acessível ou de uma pausa no meio do caminho não tem como pedir uma rota que passe por um ponto de apoio.

**Proposta.** Uma opção "Quero passar por um ponto de apoio". Marcada, a solução escolhe a rota de menor custo entre as que passam por pelo menos um ponto de apoio, mantendo todas as regras da v0.1.

| Código | Definição |
|---|---|
| RF08 | Permitir que o usuário marque que quer passar por pelo menos um ponto de apoio. |
| RN10 | Com a opção marcada, só valem rotas com pelo menos um ponto de apoio (saída e chegada contam). Entre elas, valem RN03 a RN08. |
| RN11 | Se nenhuma rota com ponto de apoio for possível para o perfil, informar isso e mostrar a rota da v0.1 (sem apoio), se ela existir, com aviso claro. Se nem ela existir, vale a RN09. |
| RN12 | Com a opção desmarcada, o resultado é exatamente o da v0.1. |

| ID | Dado | Quando | Então | RF e RN |
|---|---|---|---|---|
| CA09 | Mapa de referência, perfil cadeirante. | Pede rota de E3 para E4 sem a opção. | Rota E3 → E4 (T4), 100 m, sem pontos de apoio. | RF05; RN06, RN12 |
| CA10 | Mapa de referência, perfil cadeirante. | Pede rota de E3 para E4 com a opção marcada. | Rota E3 → E2 → E4 (T5, T2), 180 m, alerta de paralelepípedo em T2, apoio em E2. | RF08; RN10, RN08 |
| CA11 | T5 interditado, perfil cadeirante. | Pede rota de E3 para E4 com a opção marcada. | Aviso de que não há rota com ponto de apoio, seguido da rota E3 → E4, 100 m. | RF08; RN05, RN11 |
| CA12 | Mapa de referência, perfil idoso. | Pede rota de E1 para E4 com a opção marcada. | Mesma rota do CA04 (E1 → E2 → E4, 200 m), pois ela já passa por E2. | RF08; RN10 |

Na v0.2, os testes da v0.1 (CA01 a CA08) devem ser executados de novo, com a opção desmarcada, e os casos CA09 a CA12 acrescentados. A proposta pode ser ajustada depois do retorno da apresentação.

### 10.5 Registro dos testes

O roteiro completo, com os passos para repetir, está em [`TESTES.md`](./TESTES.md). Os testes automáticos estão em `tests.html`.

**Como os resultados abaixo foram obtidos.** Em 19/11/2026, `tests.html` e os passos de interface foram executados por um script automatizado no navegador (Chromium), que clicou nos campos e leu o texto da tela. Placar dos testes automáticos: **21 de 21 aprovados**. Na execução manual, cada responsável repete os passos, salva um print na pasta `evidencias/` e registra o resultado no `TESTES.md`.

| Teste | Entrada ou ação | Resultado esperado | Resultado observado (execução automatizada) | Situação | Responsável e evidência (execução manual) |
|---|---|---|---|---|---|
| M01 (CA01) | Abrir a página. | Três perfis e pontos E1 a E4. | Três perfis e pontos E1 a E4 exibidos. | Aprovado (automatizado) | Eric Guzik (T09). Evidência: print em `evidencias/` e commit no `TESTES.md`. |
| M02 (CA02) | Cadeirante, E1 → E4. | E1 → E2 → E3 → E4, 280 m, sem alertas, apoio em E2. | E1 → E2 → E3 → E4 (T1, T5, T4), 280 m, sem alertas, apoio em E2. | Aprovado (automatizado) | Luiz Targino (T10). Evidência: print em `evidencias/` e commit no `TESTES.md`. |
| M03 (CA03) | Carrinho de bebê, E1 → E4. | E1 → E2 → E3 → E4, 280 m, sem alertas. | E1 → E2 → E3 → E4, 280 m, sem alertas, custo 280, apoio em E2. | Aprovado (automatizado) | Luiz Targino (T10). Evidência: print em `evidencias/` e commit no `TESTES.md`. |
| M04 (CA04) | Idoso, E1 → E4. | E1 → E2 → E4, 200 m, alerta de paralelepípedo em T2, apoio em E2. | E1 → E2 → E4 (T1, T2), 200 m, alerta de paralelepípedo em T2, custo 250, apoio em E2. | Aprovado (automatizado) | Luiz Targino (T10). Evidência: print em `evidencias/` e commit no `TESTES.md`. |
| M05 (CA05) | Marcar T1 interditado; idoso, E1 → E4. | E1 → E3 → E4, 250 m, alerta de degrau em T3. | E1 → E3 → E4 (T3, T4), 250 m, alerta de degrau em T3. | Aprovado (automatizado) | Luiz Targino (T10). Evidência: print em `evidencias/` e commit no `TESTES.md`. |
| M06 (CA06) | Marcar T1 interditado; cadeirante, E1 → E4. | Mensagem de que não existe rota acessível; sem rota. | "Não existe rota acessível conhecida para o perfil Cadeirante entre esses pontos." | Aprovado (automatizado) | Luiz Targino (T10). Evidência: print em `evidencias/` e commit no `TESTES.md`. |
| M07 (CA07) | Calcular sem escolher perfil. Na função: perfis "4" e "abc". | Mensagem de perfil inválido. | "Perfil inválido. Escolha cadeirante, idoso ou carrinho de bebê." (tela e função) | Aprovado (automatizado) | Eric Guzik (T09). Evidência: print em `evidencias/` e commit no `TESTES.md`. |
| M08 (CA08) | Mesmo ponto (E2) como saída e chegada. | Mensagem de que precisam ser diferentes. | "Saída e chegada precisam ser diferentes. Escolha de novo." | Aprovado (automatizado) | Eric Guzik (T09). Evidência: print em `evidencias/` e commit no `TESTES.md`. |

Além dos critérios, `tests.html` verifica os custos de trecho (RN03), o bloqueio sem rampa (RN04), a interdição (RN05), o desempate por menor distância num mapa de teste (RN06), a distância sem penalidades (RN07), o sentido inverso dos trechos e que a simulação de interdição não altera o mapa original.

### 10.6 Relação entre documentação, prompt e código

O prompt ([`PROMPT.md`](./PROMPT.md)) foi escrito a partir desta documentação, no formato do exemplo da Cafeteria: usa o mesmo usuário, o mapa das seções 5.1 e 5.2, as regras RN01 a RN09 e os critérios CA01 a CA08, e acrescenta as orientações técnicas de página estática (arquivos separados, caminhos relativos, regras sem acesso à página). O código gerado com apoio de IA foi conferido contra os critérios da seção 6, e as decisões tomadas durante a implementação estão na seção 10.2.

### 10.7 Tarefas e quadro de contribuições da Entrega 2

| Tarefa | Resultado esperado | Responsável | Apoio ou revisão |
|---|---|---|---|
| T09 — Revisar entrada e validação | Conferir `script.js` (formulário) e `validarPerfil`/`validarPontos`; executar M01, M07 e M08 | Eric Guzik | Felipe Jansen |
| T10 — Revisar o cálculo da rota | Conferir `calcularCustoTrecho`, `listarCaminhos` e `calcularRota`; executar M02 a M06 | Luiz Targino | João Pohlmann |
| T11 — Revisar a saída e as mensagens | Conferir `mostrarResultado`, alertas e mensagem sem rota | Felipe Jansen | Aluisio Tavares |
| T12 — Conferir o mapa e os testes automáticos | Conferir `mapa.js` contra as seções 5.1 e 5.2 e rodar `tests.html` | João Pohlmann | Eric Guzik |
| T13 — Integrar, publicar e documentar | Implementação da v0.1 com apoio de IA, testes automáticos, `TESTES.md`, publicação e esta seção | Aluisio Tavares | Luiz Targino |

O link de cada integrante mostra os commits feitos por ele no repositório. Cada um registra no `TESTES.md`, com um commit próprio, o resultado dos testes manuais pelos quais é responsável.

| Integrante | O que fez na Entrega 2 | Link da contribuição | Como conferiu |
|---|---|---|---|
| Aluisio Tavares<br>@Aluisio-Tavares03 | **T13:** Gerei a v0.1 com apoio de IA a partir do `PROMPT.md`, revisei o código, organizei os testes automáticos (`tests.html`) e o roteiro (`TESTES.md`) e atualizei a documentação. | https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1/commits?author=Aluisio-Tavares03 | `tests.html` executado em 19/11/2026 (21 de 21 aprovados). Rodei o `tests.html` (21 de 21 aprovados) e conferi o resultado da tela com os critérios CA01 a CA08. |
| Eric Guzik<br>@emg-tech | **T09 (entrada e validação):** Revisei a parte de entrada: os botões de perfil e as listas de pontos em `script.js` e as funções `validarPerfil` e `validarPontos` em `regras.js`. Executei os testes manuais M01, M07 e M08. | https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1/commits?author=emg-tech | Confere se as mensagens de erro batem com CA07 e CA08 e se os valores "4" e "abc" são recusados nos testes CA07a e CA07b do `tests.html`. |
| Felipe Jansen<br>@fjes-sys | **T11 (saída e mensagens):** Revisei a parte de saída: `mostrarResultado` em `script.js` e `alertasDoTrecho` e `formatarDistancia` em `regras.js`, com a mensagem de quando não existe rota. | https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1/commits?author=fjes-sys | Conferi se o resultado mostra tudo o que pedem RF06, RNF02 e RNF03, se os alertas seguem a RN08 (M04 e M05) e se a mensagem sem rota segue a RN09 (M06). |
| João Pohlmann<br>@jfpbcs-maker | **T12 (mapa e testes automáticos):** Conferi o `mapa.js` contra as tabelas das seções 5.1 e 5.2 (pontos, trechos, piso, rampa e penalidades) e rodei o `tests.html`. | https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1/commits?author=jfpbcs-maker | Comparei cada trecho e cada penalidade com a documentação e confirmei os testes RN03 a RN06, incluindo o desempate no mapa de teste. |
| Luiz Targino<br>@LuizTargino01 | **T10 (cálculo da rota):** Revisei o cálculo: `calcularCustoTrecho`, `listarCaminhos` e `calcularRota` em `regras.js`. Executei os testes manuais M02 a M06. | https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1/commits?author=LuizTargino01 | Refiz à mão o custo das rotas de CA02 a CA06 e conferi se a rota escolhida na tela é a de menor custo, com desempate pela menor distância. |
