/*
 * regras.js — Regras de negócio da v0.1 (RN01 a RN09).
 *
 * Nenhuma função deste arquivo acessa a página (DOM). Todas recebem
 * dados por parâmetro e devolvem um resultado, para que possam ser
 * testadas em tests.html sem clicar em nada.
 *
 * Depende de mapa.js (PERFIS, BLOQUEADO), que deve ser carregado antes.
 */

// RN01: o perfil deve ser um dos três disponíveis.
function validarPerfil(perfil) {
  if (typeof perfil !== "string" || !Object.prototype.hasOwnProperty.call(PERFIS, perfil)) {
    return { valido: false, mensagem: "Perfil inválido. Escolha cadeirante, idoso ou carrinho de bebê." };
  }
  return { valido: true, mensagem: "" };
}

// RN02: saída e chegada devem existir no mapa e ser diferentes.
function validarPontos(saida, chegada, mapa) {
  const existe = (p) => typeof p === "string" && Object.prototype.hasOwnProperty.call(mapa.pontos, p);
  if (!existe(saida)) {
    return { valido: false, mensagem: "Ponto de saída inválido. Escolha um ponto do mapa." };
  }
  if (!existe(chegada)) {
    return { valido: false, mensagem: "Ponto de chegada inválido. Escolha um ponto do mapa." };
  }
  if (saida === chegada) {
    return { valido: false, mensagem: "Saída e chegada precisam ser diferentes. Escolha de novo." };
  }
  return { valido: true, mensagem: "" };
}

/*
 * RN03, RN04 e RN05: custo de um trecho para um perfil.
 * Devolve um número (distância + penalidades) ou BLOQUEADO.
 */
function calcularCustoTrecho(trecho, perfil, penalidades) {
  // RN05: interditado vale para todos os perfis.
  if (trecho.interditado) {
    return BLOQUEADO;
  }

  const regra = penalidades[perfil];
  let custo = trecho.distancia;

  if (trecho.piso === "paralelepipedo") {
    custo = custo + regra.paralelepipedo;
  }

  if (!trecho.rampa) {
    // RN04: para o cadeirante, trecho sem rampa é bloqueado.
    if (regra.semRampa === BLOQUEADO) {
      return BLOQUEADO;
    }
    custo = custo + regra.semRampa;
  }

  return custo;
}

// Dado um trecho e o ponto onde a pessoa está, devolve o outro ponto.
function outraPonta(trecho, ponto) {
  return trecho.a === ponto ? trecho.b : trecho.a;
}

/*
 * Lista todos os caminhos simples (sem repetir ponto) entre saída e
 * chegada, usando apenas trechos não bloqueados para o perfil.
 *
 * Como o mapa da v0.1 tem só 4 pontos e 5 trechos, testar todos os
 * caminhos é simples de entender e de conferir à mão. Para um mapa
 * grande, o algoritmo de Dijkstra seria mais adequado.
 */
function listarCaminhos(saida, chegada, perfil, mapa) {
  const caminhos = [];

  function explorar(pontoAtual, pontosVisitados, trechosUsados) {
    if (pontoAtual === chegada) {
      caminhos.push({ pontos: pontosVisitados.slice(), trechos: trechosUsados.slice() });
      return;
    }
    for (const trecho of mapa.trechos) {
      if (trecho.a !== pontoAtual && trecho.b !== pontoAtual) continue;
      const proximo = outraPonta(trecho, pontoAtual);
      if (pontosVisitados.includes(proximo)) continue;
      if (calcularCustoTrecho(trecho, perfil, mapa.penalidades) === BLOQUEADO) continue;

      pontosVisitados.push(proximo);
      trechosUsados.push(trecho);
      explorar(proximo, pontosVisitados, trechosUsados);
      pontosVisitados.pop();
      trechosUsados.pop();
    }
  }

  explorar(saida, [saida], []);
  return caminhos;
}

// Gera os alertas de um trecho (RN08).
function alertasDoTrecho(trecho) {
  const alertas = [];
  if (trecho.piso === "paralelepipedo") alertas.push("paralelepípedo");
  if (!trecho.rampa) alertas.push("sem rampa (degrau)");
  return alertas;
}

/*
 * Função principal: calcula a rota de menor custo (RN06).
 *
 * Devolve um objeto:
 *  - { ok: false, erro: "..." } quando a entrada é inválida (RN01, RN02);
 *  - { ok: true, encontrada: false, mensagem: "..." } quando não há rota (RN09);
 *  - { ok: true, encontrada: true, pontos, trechos, custoTotal,
 *      distanciaTotal, apoios } quando há rota.
 */
function calcularRota(perfil, saida, chegada, mapa) {
  const perfilOk = validarPerfil(perfil);
  if (!perfilOk.valido) return { ok: false, erro: perfilOk.mensagem };

  const pontosOk = validarPontos(saida, chegada, mapa);
  if (!pontosOk.valido) return { ok: false, erro: pontosOk.mensagem };

  const caminhos = listarCaminhos(saida, chegada, perfil, mapa);

  // RN09: nenhum caminho sem trechos bloqueados.
  if (caminhos.length === 0) {
    return {
      ok: true,
      encontrada: false,
      mensagem: "Não existe rota acessível conhecida para o perfil " + PERFIS[perfil] + " entre esses pontos."
    };
  }

  let melhor = null;
  for (const caminho of caminhos) {
    // RN03: custo total é a soma dos custos dos trechos.
    let custo = 0;
    // RN07: distância é a soma das distâncias reais, sem penalidades.
    let distancia = 0;
    for (const trecho of caminho.trechos) {
      custo = custo + calcularCustoTrecho(trecho, perfil, mapa.penalidades);
      distancia = distancia + trecho.distancia;
    }

    // RN06: menor custo; em empate, menor distância.
    const ehMelhor =
      melhor === null ||
      custo < melhor.custoTotal ||
      (custo === melhor.custoTotal && distancia < melhor.distanciaTotal);

    if (ehMelhor) {
      melhor = { pontos: caminho.pontos, trechosUsados: caminho.trechos, custoTotal: custo, distanciaTotal: distancia };
    }
  }

  // Monta os trechos na ordem percorrida, com sentido e alertas (RNF03, RN08).
  const trechos = melhor.trechosUsados.map((trecho, i) => ({
    id: trecho.id,
    de: melhor.pontos[i],
    para: melhor.pontos[i + 1],
    distancia: trecho.distancia,
    piso: trecho.piso === "paralelepipedo" ? "paralelepípedo" : "regular",
    rampa: trecho.rampa ? "sim" : "não (degrau)",
    custo: calcularCustoTrecho(trecho, perfil, mapa.penalidades),
    alertas: alertasDoTrecho(trecho)
  }));

  // Pontos de apoio que ficam na rota (incluindo saída e chegada).
  const apoios = melhor.pontos
    .filter((p) => mapa.pontos[p].apoio)
    .map((p) => ({ ponto: p, descricao: mapa.pontos[p].apoio }));

  return {
    ok: true,
    encontrada: true,
    pontos: melhor.pontos,
    trechos: trechos,
    custoTotal: melhor.custoTotal,
    distanciaTotal: melhor.distanciaTotal,
    apoios: apoios
  };
}

// RNF02: distâncias em metros, como números inteiros.
function formatarDistancia(metros) {
  return Math.round(metros) + " m";
}

/*
 * Cria uma cópia do mapa com alguns trechos interditados (RN05),
 * sem alterar o mapa original. Usada pela simulação de interdição
 * da interface e pelos testes de CA05 e CA06.
 */
function mapaComInterdicoes(mapa, idsInterditados) {
  return {
    pontos: mapa.pontos,
    penalidades: mapa.penalidades,
    trechos: mapa.trechos.map((t) => Object.assign({}, t, {
      interditado: t.interditado || idsInterditados.includes(t.id)
    }))
  };
}
