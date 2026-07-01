// Dados do Sistema de Boost (Wiki GLA). Expostos em window.BOOST_DATA.
"use strict";

window.BOOST_DATA = {
  // Pity: para cada nivel "+N" (1..16), chance de sucesso (%) e tentativa garantida.
  PITY: [
    { level: 1,  chance: 35, guaranteed: 3 },
    { level: 2,  chance: 30, guaranteed: 4 },
    { level: 3,  chance: 25, guaranteed: 5 },
    { level: 4,  chance: 20, guaranteed: 6 },
    { level: 5,  chance: 22, guaranteed: 5 },
    { level: 6,  chance: 18, guaranteed: 6 },
    { level: 7,  chance: 14, guaranteed: 8 },
    { level: 8,  chance: 10, guaranteed: 11 },
    { level: 9,  chance: 10, guaranteed: 11 },
    { level: 10, chance: 9,  guaranteed: 12 },
    { level: 11, chance: 8,  guaranteed: 13 },
    { level: 12, chance: 7,  guaranteed: 15 },
    { level: 13, chance: 6,  guaranteed: 17 },
    { level: 14, chance: 5,  guaranteed: 21 },
    { level: 15, chance: 4,  guaranteed: 26 },
    { level: 16, chance: 3,  guaranteed: 34 }
  ],

  // Cristais consumidos por tentativa, por tipo de equipamento.
  CRYSTALS_PER_ATTEMPT: {
    cabeca: 2, perna: 2, emblema: 2,
    corpo: 4, arma: 4, acessorio: 4
  },

  ITEM_LABEL: {
    cabeca: "Cabeca", perna: "Perna", emblema: "Emblema",
    corpo: "Corpo", arma: "Arma", acessorio: "Acessorio"
  },

  // Faixa de cristal por nivel de melhoria.
  CRYSTAL_TIERS: [
    { key: "sky",     label: "Cristal do Ceu",   cls: "sky",     min: 1,  max: 4 },
    { key: "sage",    label: "Cristal do Sabio", cls: "sage",    min: 5,  max: 8 },
    { key: "crimson", label: "Cristal Carmesim", cls: "crimson", min: 9,  max: 12 },
    { key: "radiant", label: "Cristal Radiante", cls: "radiant", min: 13, max: 16 }
  ],

  // Transferencia de melhoria (custo em gemas) por nivel e tipo.
  TRANSFER: {
    4:  { cabeca: 1,  corpo: 2,  perna: 1,  emblema: 1,  arma: 2,  acessorio: 2 },
    8:  { cabeca: 3,  corpo: 5,  perna: 3,  emblema: 3,  arma: 5,  acessorio: 5 },
    12: { cabeca: 6,  corpo: 10, perna: 6,  emblema: 6,  arma: 10, acessorio: 10 },
    16: { cabeca: 10, corpo: 15, perna: 10, emblema: 10, arma: 15, acessorio: 15 }
  },

  // Reembolso de cristais (item +16) por tipo de cristal e tipo de equipamento.
  REFUND: {
    sky:     { cabeca: 8,  corpo: 18, perna: 8,  emblema: 8,  arma: 18, acessorio: 18 },
    sage:    { cabeca: 14, corpo: 26, perna: 14, emblema: 14, arma: 26, acessorio: 26 },
    crimson: { cabeca: 2,  corpo: 4,  perna: 2,  emblema: 2,  arma: 4,  acessorio: 4 },
    radiant: { cabeca: 0,  corpo: 1,  perna: 0,  emblema: 0,  arma: 1,  acessorio: 1 }
  },

  // Reforja: chances por raridade.
  REFORGE: {
    weapon: { material: "chaotic",   matLabel: "Cristal Caotico",   chances: { comum: 80, rara: 17, epica: 3 } },
    gear:   { material: "distorted", matLabel: "Cristal Deturpado", chances: { comum: 15, rara: 75, epica: 10 } }
  },

  RARITY_LABEL: { comum: "Comum", rara: "Rara", epica: "Epica" },

  // Faixas de preco por gema, conforme quantidade total comprada.
  GEM_TIERS: [
    { min: 1,   max: 99,       price: 0.97 },
    { min: 100, max: 199,      price: 0.95 },
    { min: 200, max: Infinity, price: 0.90 }
  ],

  SITE_CASHBACK: 0.025,
  APP_BONUS_TIERS: [
    { min: 400, bonus: 0.15 },
    { min: 200, bonus: 0.10 },
    { min: 100, bonus: 0.05 },
    { min: 0,   bonus: 0.00 }
  ]
};
