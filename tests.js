/*
 * tests.js — Testes automáticos das regras, em JavaScript puro.
 *
 * Usa as MESMAS funções de regras.js e os MESMOS dados de mapa.js que
 * a aplicação. Nada aqui copia a implementação das regras.
 * Cada teste compara o resultado esperado com o observado.
 */

const resultadosTestes = [];

function registrar(id, descricao, esperado, observado) {
  const esperadoTxt = JSON.stringify(esperado);
  const observadoTxt = JSON.stringify(observado);
  resultadosTestes.push({
    id: id,
    descricao: descricao,
    esperado: esperadoTxt,
    observado: observadoTxt,
    aprovado: esperadoTxt === observadoTxt
  });
}

// Resume uma rota em um objeto fácil de comparar.
function resumoRota(r) {
  if (!r.ok) return { erro: r.erro };
  if (!r.encontrada) return { semRota: r.mensagem };
  return {
    rota: r.pontos.join(" → "),
    trechos: r.trechos.map((t) => t.id).join(", "),
    distancia: formatarDistancia(r.distanciaTotal),
    alertas: r.trechos.filter((t) => t.alertas.length).map((t) => t.id + ": " + t.alertas.join(" e ")),
    apoios: r.apoios.map((a) => a.ponto)
  };
}

const mapa = MAPA_REFERENCIA;
const mapaT1Interditado = mapaComInterdicoes(MAPA_REFERENCIA, ["T1"]);

// ---------- Critérios de aceitação da documentação ----------

registrar("CA01", "Os três perfis estão disponíveis",
  ["Cadeirante", "Idoso", "Carrinho de bebê"],
  Object.values(PERFIS));

registrar("CA02", "Cadeirante, E1 para E4",
  { rota: "E1 → E2 → E3 → E4", trechos: "T1, T5, T4", distancia: "280 m", alertas: [], apoios: ["E2"] },
  resumoRota(calcularRota("cadeirante", "E1", "E4", mapa)));

registrar("CA03", "Carrinho de bebê, E1 para E4",
  { rota: "E1 → E2 → E3 → E4", trechos: "T1, T5, T4", distancia: "280 m", alertas: [], apoios: ["E2"] },
  resumoRota(calcularRota("carrinho", "E1", "E4", mapa)));

registrar("CA03b", "Carrinho: custo escolhido 280 (a rota curta E1 → E2 → E4 custaria 400)",
  280,
  calcularRota("carrinho", "E1", "E4", mapa).custoTotal);

registrar("CA04", "Idoso, E1 para E4",
  { rota: "E1 → E2 → E4", trechos: "T1, T2", distancia: "200 m", alertas: ["T2: paralelepípedo"], apoios: ["E2"] },
  resumoRota(calcularRota("idoso", "E1", "E4", mapa)));

registrar("CA05", "T1 interditado, idoso, E1 para E4",
  { rota: "E1 → E3 → E4", trechos: "T3, T4", distancia: "250 m", alertas: ["T3: sem rampa (degrau)"], apoios: [] },
  resumoRota(calcularRota("idoso", "E1", "E4", mapaT1Interditado)));

registrar("CA06", "T1 interditado, cadeirante, E1 para E4",
  { semRota: "Não existe rota acessível conhecida para o perfil Cadeirante entre esses pontos." },
  resumoRota(calcularRota("cadeirante", "E1", "E4", mapaT1Interditado)));

registrar("CA07a", "Perfil \"4\" é recusado",
  { erro: "Perfil inválido. Escolha cadeirante, idoso ou carrinho de bebê." },
  resumoRota(calcularRota("4", "E1", "E4", mapa)));

registrar("CA07b", "Perfil \"abc\" é recusado",
  { erro: "Perfil inválido. Escolha cadeirante, idoso ou carrinho de bebê." },
  resumoRota(calcularRota("abc", "E1", "E4", mapa)));

registrar("CA07c", "Perfil vazio (nenhum escolhido) é recusado",
  { erro: "Perfil inválido. Escolha cadeirante, idoso ou carrinho de bebê." },
  resumoRota(calcularRota("", "E1", "E4", mapa)));

registrar("CA08", "Saída igual à chegada é recusada",
  { erro: "Saída e chegada precisam ser diferentes. Escolha de novo." },
  resumoRota(calcularRota("idoso", "E2", "E2", mapa)));

// ---------- Testes diretos das regras ----------

registrar("RN02", "Ponto que não existe no mapa é recusado",
  { erro: "Ponto de chegada inválido. Escolha um ponto do mapa." },
  resumoRota(calcularRota("idoso", "E1", "E9", mapa)));

registrar("RN03a", "Custo de T2 (paralelepípedo) para cadeirante: 100 + 300",
  400, calcularCustoTrecho(TRECHOS[1], "cadeirante", PENALIDADES));

registrar("RN03b", "Custo de T3 (degrau) para carrinho: 150 + 300",
  450, calcularCustoTrecho(TRECHOS[2], "carrinho", PENALIDADES));

registrar("RN03c", "Custo de T3 (degrau) para idoso: 150 + 50",
  200, calcularCustoTrecho(TRECHOS[2], "idoso", PENALIDADES));

registrar("RN04", "T3 (sem rampa) é bloqueado para cadeirante",
  BLOQUEADO, calcularCustoTrecho(TRECHOS[2], "cadeirante", PENALIDADES));

registrar("RN05", "Trecho interditado é bloqueado até para o idoso",
  BLOQUEADO, calcularCustoTrecho(mapaT1Interditado.trechos[0], "idoso", PENALIDADES));

// Mapa de teste (não é o mapa real) com dois caminhos de MESMO custo.
// O trecho direto vem primeiro na lista, para garantir que o desempate
// não depende da ordem em que os caminhos são encontrados.
const mapaEmpate = {
  pontos: { A: { nome: "A", apoio: null }, B: { nome: "B", apoio: null }, C: { nome: "C", apoio: null } },
  penalidades: PENALIDADES,
  trechos: [
    { id: "X1", a: "A", b: "B", distancia: 300, piso: "regular", rampa: true, interditado: false },
    { id: "X2", a: "A", b: "C", distancia: 175, piso: "paralelepipedo", rampa: true, interditado: false },
    { id: "X3", a: "C", b: "B", distancia: 75, piso: "regular", rampa: true, interditado: false }
  ]
};
const rotaEmpate = calcularRota("idoso", "A", "B", mapaEmpate);
registrar("RN06", "Empate de custo (300 x 300): vence a menor distância",
  { rota: "A → C → B", custo: 300, distancia: "250 m" },
  { rota: rotaEmpate.pontos.join(" → "), custo: rotaEmpate.custoTotal, distancia: formatarDistancia(rotaEmpate.distanciaTotal) });

const rotaIdoso = calcularRota("idoso", "E1", "E4", mapa);
registrar("RN07", "Distância exibida não inclui penalidades (idoso: custo 250, distância 200)",
  { custo: 250, distancia: 200 },
  { custo: rotaIdoso.custoTotal, distancia: rotaIdoso.distanciaTotal });

registrar("SENTIDO", "Trechos valem nos dois sentidos: cadeirante, E4 para E1",
  { rota: "E4 → E3 → E2 → E1", trechos: "T4, T5, T1", distancia: "280 m", alertas: [], apoios: ["E2"] },
  resumoRota(calcularRota("cadeirante", "E4", "E1", mapa)));

registrar("MAPA", "Interditar no teste não altera o mapa original",
  false, MAPA_REFERENCIA.trechos[0].interditado);
