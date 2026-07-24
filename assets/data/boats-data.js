// Dados do Planejador de Barcos.
// Barco 6 / Arsenal Lv6, refinaria, skins e precos: base no Labophase (dados de jogo).
// Barcos 2-5 (kit de upgrade): base no Barcos.txt do usuario.
// Precos em Berries (matéria-prima). Chaves em EN para casar com os sprites.
"use strict";

window.BOATS_DATA = {
  // Preco em Berries de cada item comprável (matéria-prima e itens diretos).
  itemValues: {
    low_grade_cotton: 5, wood_log: 10, copper_ore: 15, gun_powder: 30, cotton: 75,
    oak_log: 100, iron_ore: 150, expert_gun_powder: 300, advanced_cotton: 110,
    mahogany_log: 150, steel_ore: 225, superior_gun_powder: 450, professional_cotton: 160,
    adam_log: 200, titanium_ore: 300, refined_gun_powder: 650, cola: 200, gun_barrel: 350,
    cannon_ball: 750, big_cola: 300, steel_cannon_ball: 1125, battery: 500,
    flammable_liquid: 500, air_tank: 500, oil_can: 500, poison_mushroom: 500,
    superior_gun_barrel: 525, blueprint: 5000, expert_oil_can: 700, expert_gun_barrel: 725,
    alkaline_battery: 700
  },

  // Refinado -> [{ key, qty }] (materia-prima ou refinado inferior).
  refinery: {
    wood_planks: [{ key: "wood_log", qty: 10 }],
    copper_ingot: [{ key: "copper_ore", qty: 8 }],
    low_grade_cloth: [{ key: "low_grade_cotton", qty: 16 }],
    low_grade_rope: [{ key: "low_grade_cloth", qty: 2 }],
    copper_nail: [{ key: "copper_ingot", qty: 1 }],
    oak_planks: [{ key: "oak_log", qty: 10 }],
    iron_ingot: [{ key: "iron_ore", qty: 8 }],
    cloth: [{ key: "cotton", qty: 16 }],
    rope: [{ key: "cloth", qty: 2 }],
    iron_nail: [{ key: "iron_ingot", qty: 1 }],
    mahogany_planks: [{ key: "mahogany_log", qty: 10 }],
    steel_ingot: [{ key: "steel_ore", qty: 8 }],
    advanced_cloth: [{ key: "advanced_cotton", qty: 16 }],
    advanced_rope: [{ key: "advanced_cloth", qty: 2 }],
    steel_nail: [{ key: "steel_ingot", qty: 1 }],
    adam_planks: [{ key: "adam_log", qty: 10 }],
    titanium_ingot: [{ key: "titanium_ore", qty: 9 }],
    professional_cloth: [{ key: "professional_cotton", qty: 16 }],
    professional_rope: [{ key: "professional_cloth", qty: 2 }],
    titanium_nail: [{ key: "titanium_ingot", qty: 1 }]
  },

  // Arsenal Lv6: output -> [{ key, qty }] (pode referenciar outros itens do arsenal).
  arsenal: {
    ship_upgrade_kit: [{ key: "cannon", qty: 1 }, { key: "sail", qty: 1 }, { key: "hull", qty: 1 }],
    cannon: [{ key: "mahogany_planks", qty: 2 }, { key: "advanced_rope", qty: 1 }, { key: "steel_ingot", qty: 2 }, { key: "steel_nail", qty: 2 }, { key: "superior_gun_powder", qty: 25 }, { key: "steel_cannon_ball", qty: 4 }],
    sail: [{ key: "mahogany_log", qty: 30 }, { key: "advanced_cloth", qty: 6 }, { key: "advanced_rope", qty: 2 }, { key: "steel_nail", qty: 2 }, { key: "big_cola", qty: 5 }],
    hull: [{ key: "mahogany_planks", qty: 11 }, { key: "steel_ingot", qty: 3 }, { key: "steel_nail", qty: 4 }],
    fire_cannon: [{ key: "flammable_liquid", qty: 30 }, { key: "cannon", qty: 1 }],
    acid_cannon: [{ key: "poison_mushroom", qty: 30 }, { key: "cannon", qty: 1 }],
    shotgun: [{ key: "adam_planks", qty: 1 }, { key: "titanium_ingot", qty: 2 }, { key: "titanium_nail", qty: 2 }, { key: "professional_rope", qty: 1 }, { key: "refined_gun_powder", qty: 15 }, { key: "big_cola", qty: 10 }],
    chain_shot: [{ key: "adam_planks", qty: 1 }, { key: "titanium_ingot", qty: 2 }, { key: "titanium_nail", qty: 2 }, { key: "professional_rope", qty: 1 }, { key: "refined_gun_powder", qty: 15 }, { key: "steel_cannon_ball", qty: 3 }],
    ram: [{ key: "adam_planks", qty: 7 }, { key: "titanium_ingot", qty: 3 }, { key: "titanium_nail", qty: 2 }, { key: "big_cola", qty: 9 }],
    machine_gun: [{ key: "adam_planks", qty: 1 }, { key: "titanium_ingot", qty: 1 }, { key: "refined_gun_powder", qty: 20 }, { key: "expert_gun_barrel", qty: 18 }],
    speed_up: [{ key: "adam_planks", qty: 2 }, { key: "titanium_nail", qty: 2 }, { key: "professional_cloth", qty: 4 }, { key: "professional_rope", qty: 1 }, { key: "big_cola", qty: 20 }],
    heavy_cannon: [{ key: "adam_planks", qty: 2 }, { key: "titanium_ingot", qty: 2 }, { key: "professional_rope", qty: 1 }, { key: "refined_gun_powder", qty: 15 }, { key: "steel_cannon_ball", qty: 8 }],
    explosive_barrel: [{ key: "adam_planks", qty: 1 }, { key: "refined_gun_powder", qty: 20 }, { key: "titanium_nail", qty: 2 }, { key: "professional_rope", qty: 2 }],
    oil_barrel: [{ key: "adam_planks", qty: 1 }, { key: "expert_oil_can", qty: 25 }, { key: "titanium_nail", qty: 2 }, { key: "professional_rope", qty: 1 }],
    speed_burst: [{ key: "adam_planks", qty: 2 }, { key: "titanium_nail", qty: 1 }, { key: "professional_cloth", qty: 4 }, { key: "big_cola", qty: 30 }],
    armor_up: [{ key: "adam_planks", qty: 10 }, { key: "titanium_ingot", qty: 2 }, { key: "titanium_nail", qty: 2 }],
    poison_bomb: [{ key: "poison_mushroom", qty: 25 }, { key: "titanium_ingot", qty: 2 }, { key: "titanium_nail", qty: 2 }, { key: "expert_gun_barrel", qty: 15 }],
    flamethrower: [{ key: "flammable_liquid", qty: 25 }, { key: "adam_planks", qty: 2 }, { key: "titanium_ingot", qty: 2 }, { key: "titanium_nail", qty: 2 }, { key: "expert_gun_barrel", qty: 5 }, { key: "refined_gun_powder", qty: 8 }],
    bombardier: [{ key: "titanium_ingot", qty: 4 }, { key: "titanium_nail", qty: 3 }, { key: "expert_gun_barrel", qty: 6 }, { key: "refined_gun_powder", qty: 20 }],
    bubble: [{ key: "adam_planks", qty: 4 }, { key: "air_tank", qty: 25 }, { key: "professional_cloth", qty: 2 }, { key: "professional_rope", qty: 2 }],
    sonar: [{ key: "alkaline_battery", qty: 18 }, { key: "adam_planks", qty: 4 }, { key: "titanium_nail", qty: 3 }, { key: "professional_cloth", qty: 3 }],
    smoke_bomb: [{ key: "titanium_ingot", qty: 4 }, { key: "titanium_nail", qty: 3 }, { key: "refined_gun_powder", qty: 4 }, { key: "expert_gun_barrel", qty: 12 }],
    call_reinforcement: [{ key: "blueprint", qty: 1 }, { key: "adam_planks", qty: 4 }, { key: "adam_log", qty: 8 }, { key: "professional_rope", qty: 2 }, { key: "professional_cloth", qty: 2 }, { key: "big_cola", qty: 6 }, { key: "refined_gun_powder", qty: 5 }, { key: "expert_gun_barrel", qty: 2 }, { key: "steel_cannon_ball", qty: 2 }],
    dive: [{ key: "adam_planks", qty: 7 }, { key: "air_tank", qty: 25 }, { key: "professional_rope", qty: 2 }],
    coup_do_burst: [{ key: "air_tank", qty: 25 }, { key: "adam_planks", qty: 2 }, { key: "titanium_nail", qty: 1 }, { key: "professional_cloth", qty: 1 }, { key: "professional_rope", qty: 1 }, { key: "big_cola", qty: 30 }],
    mortar: [{ key: "adam_planks", qty: 2 }, { key: "titanium_ingot", qty: 3 }, { key: "professional_rope", qty: 1 }, { key: "refined_gun_powder", qty: 15 }, { key: "steel_cannon_ball", qty: 8 }],
    reflect: [{ key: "adam_planks", qty: 3 }, { key: "air_tank", qty: 30 }, { key: "professional_cloth", qty: 2 }, { key: "professional_rope", qty: 2 }]
  },

  arsenalOrder: [
    "ship_upgrade_kit", "cannon", "sail", "hull", "fire_cannon", "acid_cannon", "shotgun",
    "chain_shot", "ram", "machine_gun", "speed_up", "heavy_cannon", "explosive_barrel",
    "oil_barrel", "speed_burst", "armor_up", "poison_bomb", "flamethrower", "bombardier",
    "bubble", "sonar", "smoke_bomb", "call_reinforcement", "dive", "coup_do_burst", "mortar", "reflect"
  ],

  // Skins: output -> [{ key(ink), qty }]. Tintas nao sao compraveis (sem preco).
  skins: {
    blanco: [{ key: "white_ink", qty: 5 }],
    ashes: [{ key: "white_ink", qty: 2 }, { key: "black_ink", qty: 2 }],
    quartz: [{ key: "purple_ink", qty: 5 }],
    topaz: [{ key: "yellow_ink", qty: 5 }],
    ruby: [{ key: "red_ink", qty: 5 }],
    sapphire: [{ key: "blue_ink", qty: 5 }],
    emerald: [{ key: "green_ink", qty: 5 }],
    pure: [{ key: "white_ink", qty: 15 }, { key: "black_ink", qty: 3 }],
    classic: [{ key: "black_ink", qty: 14 }, { key: "white_ink", qty: 2 }],
    exotic: [{ key: "yellow_ink", qty: 16 }, { key: "purple_ink", qty: 15 }, { key: "white_ink", qty: 9 }],
    venomous: [{ key: "purple_ink", qty: 17 }, { key: "blue_ink", qty: 12 }],
    cursed: [{ key: "black_ink", qty: 45 }, { key: "white_ink", qty: 20 }],
    turquoise: [{ key: "blue_ink", qty: 26 }, { key: "green_ink", qty: 18 }],
    vermillion: [{ key: "red_ink", qty: 24 }, { key: "yellow_ink", qty: 17 }],
    carmesin: [{ key: "red_ink", qty: 16 }, { key: "white_ink", qty: 10 }, { key: "black_ink", qty: 10 }],
    burly_wood: [{ key: "black_ink", qty: 20 }, { key: "yellow_ink", qty: 20 }, { key: "red_ink", qty: 15 }],
    chartreuse: [{ key: "green_ink", qty: 25 }, { key: "black_ink", qty: 10 }],
    pinky: [{ key: "purple_ink", qty: 30 }, { key: "white_ink", qty: 20 }],
    holy: [{ key: "yellow_ink", qty: 20 }, { key: "black_ink", qty: 15 }, { key: "white_ink", qty: 5 }]
  },

  skinOrder: [
    "blanco", "ashes", "quartz", "topaz", "ruby", "sapphire", "emerald", "pure", "classic",
    "exotic", "venomous", "cursed", "turquoise", "vermillion", "carmesin", "burly_wood",
    "chartreuse", "pinky", "holy"
  ],

  inks: ["white_ink", "black_ink", "purple_ink", "yellow_ink", "red_ink", "blue_ink", "green_ink"],

  // Barcos 2-5 (kit de upgrade). Fonte: Barcos.txt. Chaves EN.
  lowBoats: {
    "5": {
      cannon: [{ key: "oak_planks", qty: 2 }, { key: "rope", qty: 1 }, { key: "iron_ingot", qty: 2 }, { key: "iron_nail", qty: 2 }, { key: "expert_gun_powder", qty: 25 }, { key: "cannon_ball", qty: 4 }],
      sail: [{ key: "oak_log", qty: 30 }, { key: "cloth", qty: 7 }, { key: "rope", qty: 2 }, { key: "iron_nail", qty: 2 }, { key: "cola", qty: 5 }],
      hull: [{ key: "oak_planks", qty: 11 }, { key: "iron_ingot", qty: 3 }, { key: "iron_nail", qty: 4 }]
    },
    "4": {
      cannon: [{ key: "oak_planks", qty: 2 }, { key: "rope", qty: 1 }, { key: "iron_ingot", qty: 2 }, { key: "iron_nail", qty: 2 }, { key: "expert_gun_powder", qty: 20 }, { key: "cannon_ball", qty: 2 }],
      sail: [{ key: "oak_log", qty: 30 }, { key: "cloth", qty: 5 }, { key: "rope", qty: 2 }, { key: "iron_nail", qty: 2 }, { key: "cola", qty: 5 }],
      hull: [{ key: "oak_planks", qty: 8 }, { key: "iron_ingot", qty: 3 }, { key: "iron_nail", qty: 4 }]
    },
    "3": {
      cannon: [{ key: "wood_planks", qty: 9 }, { key: "low_grade_rope", qty: 6 }, { key: "copper_ingot", qty: 25 }, { key: "copper_nail", qty: 8 }, { key: "gun_powder", qty: 135 }, { key: "cannon_ball", qty: 5 }],
      sail: [{ key: "wood_log", qty: 160 }, { key: "low_grade_cloth", qty: 102 }, { key: "low_grade_rope", qty: 18 }, { key: "copper_nail", qty: 7 }, { key: "cola", qty: 5 }],
      hull: [{ key: "wood_planks", qty: 90 }, { key: "copper_ingot", qty: 15 }, { key: "copper_nail", qty: 25 }]
    },
    "2": {
      cannon: [{ key: "low_grade_rope", qty: 1 }, { key: "copper_ingot", qty: 3 }, { key: "copper_nail", qty: 1 }, { key: "gun_powder", qty: 22 }],
      sail: [{ key: "wood_planks", qty: 1 }, { key: "wood_log", qty: 20 }, { key: "low_grade_cloth", qty: 8 }, { key: "low_grade_rope", qty: 2 }, { key: "copper_nail", qty: 2 }],
      hull: [{ key: "wood_planks", qty: 8 }, { key: "copper_ingot", qty: 2 }, { key: "copper_nail", qty: 2 }]
    }
  },

  // Nomes em pt-BR (fallback: chave prettificada).
  labels: {
    // Materia-prima / itens
    low_grade_cotton: "Algodao de Baixa Qualidade", wood_log: "Tora de Madeira", copper_ore: "Minerio de Cobre",
    gun_powder: "Polvora", cotton: "Algodao", oak_log: "Tora de Carvalho", iron_ore: "Minerio de Ferro",
    expert_gun_powder: "Polvora Melhorada", advanced_cotton: "Algodao Avancado", mahogany_log: "Tora de Mogno",
    steel_ore: "Minerio de Aco", superior_gun_powder: "Polvora Superior", professional_cotton: "Algodao Profissional",
    adam_log: "Tora de Adam", titanium_ore: "Minerio de Titanio", refined_gun_powder: "Polvora Refinada",
    cola: "Cola", gun_barrel: "Cano de Arma", cannon_ball: "Bala de Canhao", big_cola: "Cola Grande",
    steel_cannon_ball: "Bala de Canhao de Aco", battery: "Bateria", flammable_liquid: "Liquido Inflamavel",
    air_tank: "Tanque de Ar", oil_can: "Lata de Oleo", poison_mushroom: "Cogumelo Venenoso",
    superior_gun_barrel: "Cano de Arma Superior", blueprint: "Planta (Blueprint)", expert_oil_can: "Lata de Oleo Melhorada",
    expert_gun_barrel: "Cano de Arma Melhorado", alkaline_battery: "Bateria Alcalina",
    // Refinados
    wood_planks: "Prancha de Madeira", copper_ingot: "Lingote de Cobre", low_grade_cloth: "Pano de Baixa Qualidade",
    low_grade_rope: "Corda de Baixa Qualidade", copper_nail: "Prego de Cobre", oak_planks: "Prancha de Carvalho",
    iron_ingot: "Lingote de Ferro", cloth: "Pano", rope: "Corda", iron_nail: "Prego de Ferro",
    mahogany_planks: "Prancha de Mogno", steel_ingot: "Lingote de Aco", advanced_cloth: "Pano Avancado",
    advanced_rope: "Corda Avancada", steel_nail: "Prego de Aco", adam_planks: "Prancha de Adam",
    titanium_ingot: "Lingote de Titanio", professional_cloth: "Pano Profissional", professional_rope: "Corda Profissional",
    titanium_nail: "Prego de Titanio",
    // Arsenal
    ship_upgrade_kit: "Kit de Upgrade", cannon: "Canhao", sail: "Vela", hull: "Casco",
    fire_cannon: "Canhao de Fogo", acid_cannon: "Canhao de Acido", shotgun: "Escopeta", chain_shot: "Tiro de Corrente",
    ram: "Ariete", machine_gun: "Metralhadora", speed_up: "Aumento de Velocidade", heavy_cannon: "Canhao Pesado",
    explosive_barrel: "Barril Explosivo", oil_barrel: "Barril de Oleo", speed_burst: "Impulso de Velocidade",
    armor_up: "Reforco de Armadura", poison_bomb: "Bomba de Veneno", flamethrower: "Lanca-Chamas",
    bombardier: "Bombardeiro", bubble: "Bolha", sonar: "Sonar", smoke_bomb: "Bomba de Fumaca",
    call_reinforcement: "Chamar Reforcos", dive: "Mergulho", coup_do_burst: "Coup de Burst", mortar: "Morteiro", reflect: "Refletir",
    // Skins
    blanco: "Blanco", ashes: "Cinzas", quartz: "Quartzo", topaz: "Topazio", ruby: "Rubi", sapphire: "Safira",
    emerald: "Esmeralda", pure: "Puro", classic: "Classico", exotic: "Exotico", venomous: "Venenoso",
    cursed: "Amaldicoado", turquoise: "Turquesa", vermillion: "Vermilion", carmesin: "Carmesim",
    burly_wood: "Burly Wood", chartreuse: "Chartreuse", pinky: "Rosa", holy: "Sagrado",
    // Tintas
    white_ink: "Tinta Branca", black_ink: "Tinta Preta", purple_ink: "Tinta Roxa", yellow_ink: "Tinta Amarela",
    red_ink: "Tinta Vermelha", blue_ink: "Tinta Azul", green_ink: "Tinta Verde"
  }
};
