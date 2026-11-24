# Rota Patrimonial Acessível — v0.1

Protótipo da disciplina Fundamentos de Programação (AV2). A documentação completa está em [docs/Rota patrimonial acessivel.md](./docs/Rota%20patrimonial%20acessivel.md).

## Objetivo, usuário e escopo

- **Usuário:** pessoa com mobilidade reduzida (cadeirante, idoso ou adulto com carrinho de bebê), ou quem a acompanha, que vai circular a pé pelo Bairro do Recife.
- **Problema:** a pessoa só descobre a barreira (paralelepípedo, degrau, falta de rampa) quando chega nela.
- **Objetivo:** escolher o perfil, a saída e a chegada e receber, antes de sair, a rota com menos barreiras para aquele perfil, com os trechos em ordem, a condição de cada trecho, os alertas, a distância total e os pontos de apoio.
- **Escopo da v0.1:** uma rota por vez, em um mapa fixo de 4 pontos e 5 trechos, com 3 perfis e resposta em texto. Não é um aplicativo de navegação.

## Como executar

**Pelo site (GitHub Pages):** https://aluisio-tavares03.github.io/Rota-Patrimonial-Acessivel1/ — os testes automáticos ficam em https://aluisio-tavares03.github.io/Rota-Patrimonial-Acessivel1/tests.html

**No seu computador, sem internet:**

1. Entre em https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1
2. Clique em **Code → Download ZIP** e descompacte a pasta. Quem usa Git pode clonar: `git clone https://github.com/Aluisio-Tavares03/Rota-Patrimonial-Acessivel1.git`
3. Dentro da pasta, dê dois cliques em `index.html`. Ele abre no navegador (Chrome, Firefox ou Edge) e já funciona, sem instalar nada e sem internet.
4. Para ver os testes automáticos, abra `tests.html` na mesma pasta. O placar no topo mostra quantos foram aprovados.

Todos os caminhos são relativos (`./styles.css`, `./regras.js`) e não há nada a instalar, então basta abrir o arquivo. O site é publicado pelo GitHub Pages a partir da branch `main`, pasta raiz (Settings → Pages → Deploy from a branch).

## Organização do código

| Arquivo | O que tem |
|---|---|
| `mapa.js` | Só dados: perfis, pontos, trechos e penalidades (RNF05). Para mudar um trecho, mexa só aqui. |
| `regras.js` | Regras de negócio, sem acessar a página. Pode ser testado sozinho. |
| `script.js` | Interface: lê o formulário, chama `calcularRota` e mostra o resultado. |
| `index.html` / `styles.css` | Página e visual. |
| `tests.html` / `tests.js` | Testes automáticos das regras. |
| `TESTES.md` | Roteiro dos testes manuais da interface e registro do que foi observado. |
| `PROMPT.md` | Pedido usado para gerar a primeira versão do código com apoio de IA. |

### Onde está cada regra (`regras.js`)

| Regra | Função |
|---|---|
| RN01 — perfil válido | `validarPerfil` |
| RN02 — pontos existentes e diferentes | `validarPontos` |
| RN03, RN04, RN05 — custo do trecho, bloqueio sem rampa para cadeirante, interdição | `calcularCustoTrecho` |
| RN06 — menor custo, desempate por menor distância | `calcularRota` (laço que escolhe `melhor`) |
| RN07 — distância sem penalidades | `calcularRota` (variável `distancia`) |
| RN08 — alertas de paralelepípedo e degrau | `alertasDoTrecho` |
| RN09 — sem rota acessível | `calcularRota` (quando `caminhos` fica vazio) |

Como funciona o cálculo: `listarCaminhos` testa todos os caminhos sem repetir ponto entre a saída e a chegada, pulando os trechos bloqueados para o perfil. Depois `calcularRota` soma o custo de cada caminho e fica com o menor. Como o mapa tem só 4 pontos, dá para conferir tudo à mão. Em um mapa grande, o algoritmo de Dijkstra seria o indicado.

A interface (`script.js`) só lê o perfil, a saída, a chegada e as interdições marcadas, chama `calcularRota(perfil, saida, chegada, mapa)` e escreve na tela o objeto que a função devolve.

## Limitações

- Protótipo educacional. Distâncias e condições dos trechos são valores de referência, ainda não conferidos em campo.
- Mapa fixo, sem mapa visual, GPS ou navegação em tempo real.
- A interdição de trechos é uma simulação marcada na tela antes do cálculo. Não há atualização automática de obras ou eventos.
- Nada é salvo: ao recarregar a página, as escolhas são apagadas.

## Versão

A entrega da v0.1 é identificada pela tag `v0.1`. Quando houver uma v0.2, a tag `v0.1` continua apontando para esta versão.
