/*
 * script.js — Interface da v0.1.
 *
 * Este arquivo só lê o formulário, chama as funções de regras.js e
 * mostra o retorno na página. Nenhuma regra de negócio fica aqui.
 *
 * Depende de mapa.js e regras.js, carregados antes.
 */

const elForm = document.getElementById("form-rota");
const elPerfis = document.getElementById("lista-perfis");
const elSaida = document.getElementById("saida");
const elChegada = document.getElementById("chegada");
const elInterdicoes = document.getElementById("lista-interdicoes");
const elMensagem = document.getElementById("mensagem");
const elResultado = document.getElementById("resultado");

function nomePonto(id) {
  return id + " — " + PONTOS[id].nome;
}

// Monta as opções de perfil (RF01) e de pontos (RF02).
function montarFormulario() {
  for (const id of Object.keys(PERFIS)) {
    const rotulo = document.createElement("label");
    rotulo.className = "opcao";
    rotulo.innerHTML = '<input type="radio" name="perfil" value="' + id + '"> ' + PERFIS[id];
    elPerfis.appendChild(rotulo);
  }

  for (const select of [elSaida, elChegada]) {
    select.appendChild(new Option("Selecione um ponto", ""));
    for (const id of Object.keys(PONTOS)) {
      select.appendChild(new Option(nomePonto(id), id));
    }
  }

  for (const trecho of TRECHOS) {
    const rotulo = document.createElement("label");
    rotulo.className = "opcao";
    rotulo.innerHTML = '<input type="checkbox" name="interditado" value="' + trecho.id + '"> ' +
      trecho.id + " (" + trecho.a + " ↔ " + trecho.b + ")";
    elInterdicoes.appendChild(rotulo);
  }
}

// Preenche as tabelas do mapa de referência a partir de mapa.js.
function montarTabelasDoMapa() {
  const corpoPontos = document.querySelector("#tabela-pontos tbody");
  for (const id of Object.keys(PONTOS)) {
    const linha = corpoPontos.insertRow();
    linha.insertCell().textContent = id;
    linha.insertCell().textContent = PONTOS[id].nome;
    linha.insertCell().textContent = PONTOS[id].apoio ? "Sim: " + PONTOS[id].apoio : "Não";
  }

  const corpoTrechos = document.querySelector("#tabela-trechos tbody");
  for (const t of TRECHOS) {
    const linha = corpoTrechos.insertRow();
    linha.insertCell().textContent = t.id;
    linha.insertCell().textContent = t.a + " e " + t.b;
    linha.insertCell().textContent = formatarDistancia(t.distancia);
    linha.insertCell().textContent = t.piso === "paralelepipedo" ? "Paralelepípedo" : "Regular";
    linha.insertCell().textContent = t.rampa ? "Sim" : "Não (degrau)";
  }

  // Penalidades também vêm de mapa.js, para a tela nunca ficar diferente do cálculo.
  const corpoPenalidades = document.querySelector("#tabela-penalidades tbody");
  const condicoes = [["paralelepipedo", "Paralelepípedo"], ["semRampa", "Sem rampa (degrau)"]];
  for (const [chave, nome] of condicoes) {
    const linha = corpoPenalidades.insertRow();
    const titulo = document.createElement("th");
    titulo.scope = "row";
    titulo.textContent = nome;
    linha.appendChild(titulo);
    for (const perfil of ["cadeirante", "carrinho", "idoso"]) {
      const valor = PENALIDADES[perfil][chave];
      linha.insertCell().textContent = valor === BLOQUEADO ? "Bloqueado" : "+" + valor;
    }
  }
}

function mostrarMensagem(texto) {
  elMensagem.textContent = texto;
  elMensagem.classList.toggle("erro", texto !== "");
}

function lerPerfilEscolhido() {
  const marcado = elForm.querySelector('input[name="perfil"]:checked');
  return marcado ? marcado.value : "";
}

function lerInterdicoes() {
  return Array.from(elForm.querySelectorAll('input[name="interditado"]:checked')).map((c) => c.value);
}

// Escreve o resultado em texto (RF06, RF07).
function mostrarResultado(perfil, interditados, resultado) {
  elResultado.innerHTML = "";

  const resumo = document.createElement("p");
  resumo.className = "resumo-pedido";
  resumo.textContent = "Perfil: " + PERFIS[perfil] +
    (interditados.length ? " · Trechos interditados: " + interditados.join(", ") : "");
  elResultado.appendChild(resumo);

  if (!resultado.encontrada) {
    const aviso = document.createElement("p");
    aviso.className = "sem-rota";
    aviso.textContent = resultado.mensagem;
    elResultado.appendChild(aviso);
    return;
  }

  const caminho = document.createElement("p");
  caminho.className = "caminho";
  caminho.textContent = "Rota: " + resultado.pontos.join(" → ");
  elResultado.appendChild(caminho);

  const lista = document.createElement("ol");
  lista.className = "trechos";
  for (const t of resultado.trechos) {
    const item = document.createElement("li");
    let texto = t.id + ": " + nomePonto(t.de) + " até " + nomePonto(t.para) +
      " · " + formatarDistancia(t.distancia) + " · piso " + t.piso + " · rampa: " + t.rampa;
    item.textContent = texto;
    if (t.alertas.length) {
      const alerta = document.createElement("strong");
      alerta.className = "alerta";
      alerta.textContent = " Alerta: " + t.alertas.join(" e ") + ".";
      item.appendChild(alerta);
    }
    lista.appendChild(item);
  }
  elResultado.appendChild(lista);

  const total = document.createElement("p");
  total.className = "total";
  total.textContent = "Distância total: " + formatarDistancia(resultado.distanciaTotal);
  elResultado.appendChild(total);

  const custo = document.createElement("p");
  custo.className = "detalhe";
  custo.textContent = "Custo usado na escolha (distância + penalidades do perfil): " + resultado.custoTotal;
  elResultado.appendChild(custo);

  const apoio = document.createElement("p");
  apoio.textContent = resultado.apoios.length
    ? "Pontos de apoio no caminho: " + resultado.apoios.map((a) => a.ponto + " (" + a.descricao + ")").join("; ")
    : "Pontos de apoio no caminho: nenhum.";
  elResultado.appendChild(apoio);
}

elForm.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const perfil = lerPerfilEscolhido();
  const interditados = lerInterdicoes();
  const mapa = mapaComInterdicoes(MAPA_REFERENCIA, interditados);
  const resultado = calcularRota(perfil, elSaida.value, elChegada.value, mapa);

  // Entrada inválida: mostra a orientação e mantém o resultado anterior.
  if (!resultado.ok) {
    mostrarMensagem(resultado.erro);
    return;
  }

  mostrarMensagem("");
  mostrarResultado(perfil, interditados, resultado);
});

montarFormulario();
montarTabelasDoMapa();
