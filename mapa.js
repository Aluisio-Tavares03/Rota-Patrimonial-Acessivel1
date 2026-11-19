/*
 * mapa.js — Dados do mapa de referência da v0.1 (RNF05).
 *
 * Este arquivo guarda SOMENTE dados: pontos, trechos e penalidades.
 * A lógica de cálculo fica em regras.js. Para mudar a condição de um
 * trecho (por exemplo, marcar uma interdição), altere este arquivo e
 * não mexa no algoritmo.
 *
 * Os valores são de referência, definidos pela equipe para o protótipo,
 * e ainda precisam ser conferidos em campo.
 */

// Perfis aceitos (RN01). A chave é o identificador usado no código.
const PERFIS = {
  cadeirante: "Cadeirante",
  idoso: "Idoso",
  carrinho: "Carrinho de bebê"
};

// Pontos de referência (seção 5.1 da documentação).
const PONTOS = {
  E1: { nome: "Praça do Arsenal", apoio: null },
  E2: { nome: "Esquina na Rua do Bom Jesus", apoio: "Estabelecimento parceiro com banheiro acessível" },
  E3: { nome: "Esquina na Rua da Moeda", apoio: null },
  E4: { nome: "Destino de referência", apoio: null }
};

// Trechos. Podem ser percorridos nos dois sentidos.
// piso: "regular" ou "paralelepipedo"; rampa: true (tem rampa) ou false (degrau).
// interditado: true bloqueia o trecho para todos os perfis (RN05).
const TRECHOS = [
  { id: "T1", a: "E1", b: "E2", distancia: 100, piso: "regular",        rampa: true,  interditado: false },
  { id: "T2", a: "E2", b: "E4", distancia: 100, piso: "paralelepipedo", rampa: true,  interditado: false },
  { id: "T3", a: "E1", b: "E3", distancia: 150, piso: "regular",        rampa: false, interditado: false },
  { id: "T4", a: "E3", b: "E4", distancia: 100, piso: "regular",        rampa: true,  interditado: false },
  { id: "T5", a: "E2", b: "E3", distancia: 80,  piso: "regular",        rampa: true,  interditado: false }
];

// Penalidades por perfil (seção 5.2). BLOQUEADO indica que o perfil
// não pode usar o trecho (RN04).
const BLOQUEADO = "bloqueado";

const PENALIDADES = {
  cadeirante: { paralelepipedo: 300, semRampa: BLOQUEADO },
  carrinho:   { paralelepipedo: 200, semRampa: 300 },
  idoso:      { paralelepipedo: 50,  semRampa: 50 }
};

// Mapa completo, usado pela interface e pelos testes.
const MAPA_REFERENCIA = {
  pontos: PONTOS,
  trechos: TRECHOS,
  penalidades: PENALIDADES
};
