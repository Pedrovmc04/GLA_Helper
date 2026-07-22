// Dados da Corrida Colosseum (fonte: Wiki GLA). Recomendacoes de picks fornecidas pelo usuario.
// tier: "gold" = estrelas de ouro, "silver" = estrelas de prata. stars = quantidade.
// Sprites: assets/img/characters/<id>.png. Estrelas: assets/img/xp/<tier>_tier.png.
"use strict";

window.COLISEUM_DATA = {
  info: [
    "Conteudo especial com 62 batalhas: o objetivo e vencer o campeao, Sabo. As batalhas sao divididas em ligas de 4 oponentes; a final tem 3 partes, depois Jesus Burgess e por fim Sabo.",
    "Voce so pode usar um personagem por batalha e precisa de ate 62 personagens diferentes. Nao vale repetir (incluindo versoes pre e pos-timeskip) nem usar o mesmo personagem do oponente (batalha espelhada).",
    "Dificuldade semelhante ao modo dificil dos Wanted Pirates. Recomendado: personagens nivel 110 com set aprimorado ate +12.",
    "5 tentativas por semana. Antes de iniciar uma batalha da para falar com o NPC Gatz e sair sem perder tentativa. As tentativas resetam toda sexta-feira a meia-noite (UTC-3).",
    "Checkpoint e sempre o oponente atual: se perder, continua nele ate vencer ou acabar as tentativas.",
    "Acesso em Alabasta East, cidade de Alubarna (a leste do palacio). Fale com o NPC Gatz e escolha \"Participar\"."
  ],

  rewardsTotal: [
    "1x Pedra do Despertar",
    "6x Icones de Perfil Especiais",
    "12x Tokens de Timeskip",
    "222x Medalha Dinamica de Diamante",
    "400x Fragmentos do Sabo (desbloqueia e leva ate 4 estrelas)"
  ],

  leftovers: ["Kid", "Moria", "Todos os Diamantes", "Alvida", "Jango", "Luffy Pre", "Perona"],

  leagues: [
    {
      id: "L", name: "Liga L", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Alvida", npcId: "alvida", pickName: "Buchi", pickId: "bucchi_sham", stars: 5, tier: "silver" },
        { npcName: "Morgan", npcId: "morgan", pickName: "Croco", pickId: "crocodile", stars: 4, tier: "gold" },
        { npcName: "Mohji", npcId: "mohji", pickName: "Kuroobi", pickId: "kuroobi", stars: 5, tier: "silver" },
        { npcName: "Cabaji", npcId: "cabaji", pickName: "Brook", pickId: "brook", stars: 4, tier: "gold" }
      ]
    },
    {
      id: "K", name: "Liga K", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Buggy", npcId: "buggy", pickName: "Gedatsu", pickId: "gedatsu", stars: 5, tier: "silver" },
        { npcName: "Jango", npcId: "jango", pickName: "Mr. 3", pickId: "mr_3", stars: 5, tier: "silver" },
        { npcName: "Buchi", npcId: "bucchi_sham", pickName: "Morgan", pickId: "morgan", stars: 5, tier: "silver" },
        { npcName: "Kuro", npcId: "kuro", pickName: "Pearl", pickId: "pearl", stars: 5, tier: "silver" }
      ]
    },
    {
      id: "J", name: "Liga J", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Pearl", npcId: "pearl", pickName: "Bepo", pickId: "bepo", stars: 5, tier: "silver" },
        { npcName: "Gin", npcId: "gin", pickName: "Tashigi", pickId: "tashigi", stars: 5, tier: "silver" },
        { npcName: "Krieg", npcId: "don_krieg", pickName: "Kuro", pickId: "kuro", stars: 5, tier: "silver" },
        { npcName: "Chew", npcId: "chew", pickName: "Apoo", pickId: "scratchmen_apoo", stars: 5, tier: "gold" }
      ]
    },
    {
      id: "I", name: "Liga I", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Hatchan", npcId: "hatchan", pickName: "Usopp", pickId: "usopp", stars: 4, tier: "gold" },
        { npcName: "Kuroobi", npcId: "kuroobi", pickName: "Basil", pickId: "basil_hawkins", stars: 4, tier: "gold" },
        { npcName: "Arlong", npcId: "arlong", pickName: "Dalmatian", pickId: "dalmatian", stars: 4, tier: "gold" },
        { npcName: "Eric", npcId: "eric", pickName: "Nami Pre", pickId: "nami", stars: 4, tier: "gold" }
      ]
    },
    {
      id: "H", name: "Liga H", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Mr. 5", npcId: "mr_5", pickName: "Chew", pickId: "chew", stars: 5, tier: "silver" },
        { npcName: "Mr. 4", npcId: "mr_4", pickName: "Law", pickId: "trafalgar_law", stars: 4, tier: "gold" },
        { npcName: "Goldenweek", npcId: "miss_goldenweek", pickName: "Mr. 2", pickId: "mr_2", stars: 5, tier: "silver" },
        { npcName: "Mr. 3", npcId: "mr_3", pickName: "Satori", pickId: "satori", stars: 5, tier: "silver" }
      ]
    },
    {
      id: "G", name: "Liga G", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Mr. 2", npcId: "mr_2", pickName: "Burgess", pickId: "jesus_burgess", stars: 4, tier: "gold" },
        { npcName: "Doublefinger", npcId: "miss_doublefinger", pickName: "Mr. 1", pickId: "mr_1", stars: 5, tier: "silver" },
        { npcName: "Mr. 1", npcId: "mr_1", pickName: "Zala", pickId: "miss_doublefinger", stars: 5, tier: "silver" },
        { npcName: "Crocodile", npcId: "crocodile", pickName: "Krieg", pickId: "don_krieg", stars: 5, tier: "silver" }
      ]
    },
    {
      id: "F", name: "Liga F", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Wapol", npcId: "wapol", pickName: "Cabaji", pickId: "cabaji", stars: 5, tier: "silver" },
        { npcName: "Daddy", npcId: "daddy_masterson", pickName: "Arlong", pickId: "arlong", stars: 5, tier: "silver" },
        { npcName: "Tashigi", npcId: "tashigi", pickName: "Mr. 5", pickId: "mr_5", stars: 5, tier: "silver" },
        { npcName: "Smoker", npcId: "smoker", pickName: "Killer", pickId: "killer", stars: 5, tier: "gold" }
      ]
    },
    {
      id: "E", name: "Liga E", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Hina", npcId: "hina", pickName: "Ichiji", pickId: "vinsmoke_ichiji", stars: 5, tier: "gold" },
        { npcName: "Drake", npcId: "x_drake", pickName: "Bellamy", pickId: "bellamy", stars: 4, tier: "gold" },
        { npcName: "Bastille", npcId: "bastille", pickName: "Mr. 4", pickId: "mr_4", stars: 5, tier: "silver" },
        { npcName: "Dalmatian", npcId: "dalmatian", pickName: "Goldenweek", pickId: "miss_goldenweek", stars: 5, tier: "silver" }
      ]
    },
    {
      id: "D", name: "Liga D", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Bepo", npcId: "bepo", pickName: "Gin", pickId: "gin", stars: 5, tier: "silver" },
        { npcName: "Law", npcId: "trafalgar_law", pickName: "Niji", pickId: "vinsmoke_niji", stars: 5, tier: "gold" },
        { npcName: "Hawkins", npcId: "basil_hawkins", pickName: "Wapol", pickId: "wapol", stars: 5, tier: "silver" },
        { npcName: "Capone", npcId: "capone_bege", pickName: "Carrot", pickId: "carrot", stars: 4, tier: "gold" }
      ]
    },
    {
      id: "C", name: "Liga C", reward: "12x Medalha de Diamante",
      rows: [
        { npcName: "Apoo", npcId: "scratchmen_apoo", pickName: "Daddy", pickId: "daddy_masterson", stars: 5, tier: "silver" },
        { npcName: "Urouge", npcId: "urouge", pickName: "Koala", pickId: "koala", stars: 4, tier: "gold" },
        { npcName: "Killer", npcId: "killer", pickName: "Drake", pickId: "x_drake", stars: 4, tier: "gold" },
        { npcName: "Kid", npcId: "eustass_kid", pickName: "Mohji", pickId: "mohji", stars: 5, tier: "silver" }
      ]
    },
    {
      id: "B", name: "Liga B", reward: "12x Medalha de Diamante + 1x Icone de Perfil",
      rows: [
        { npcName: "Vivi", npcId: "vivi", pickName: "Robin", pickId: "nico_robin", stars: 4, tier: "gold" },
        { npcName: "Rebecca", npcId: "rebecca", pickName: "Reiju", pickId: "vinsmoke_reiju", stars: 4, tier: "gold" },
        { npcName: "Perona", npcId: "perona", pickName: "Yonji", pickId: "vinsmoke_yonji", stars: 4, tier: "gold" },
        { npcName: "Leo", npcId: "leo_mansherry", pickName: "Chopper", pickId: "chopper", stars: 4, tier: "gold" }
      ]
    },
    {
      id: "A", name: "Liga A", reward: "1x Pedra do Despertar Especial + 1x Icone de Perfil",
      rows: [
        { npcName: "Yonji", npcId: "vinsmoke_yonji", pickName: "Ohm", pickId: "ohm", stars: 5, tier: "silver" },
        { npcName: "Niji", npcId: "vinsmoke_niji", pickName: "Buggy", pickId: "buggy", stars: 5, tier: "silver" },
        { npcName: "Reiju", npcId: "vinsmoke_reiju", pickName: "Vivi", pickId: "vivi", stars: 5, tier: "silver" },
        { npcName: "Ichiji", npcId: "vinsmoke_ichiji", pickName: "Zoro", pickId: "roronoa_zoro", stars: 4, tier: "gold" }
      ]
    },
    {
      id: "F1", name: "Final - Parte 1", reward: "30x Medalha de Diamante + 4x Token de Timeskip + 1x Icone de Perfil",
      rows: [
        { npcName: "Bonney", npcId: "jewelry_bonney", pickName: "Leo", pickId: "leo_mansherry", stars: 4, tier: "gold" },
        { npcName: "Usopp", npcId: "usopp", pickName: "Eric", pickId: "eric", stars: 5, tier: "silver" },
        { npcName: "Nami", npcId: "nami", pickName: "Urouge", pickId: "urouge", stars: 4, tier: "gold" },
        { npcName: "Chopper", npcId: "chopper", pickName: "Hatchan", pickId: "hatchan", stars: 5, tier: "silver" }
      ]
    },
    {
      id: "F2", name: "Final - Parte 2", reward: "30x Medalha de Diamante + 4x Token de Timeskip + 1x Icone de Perfil",
      rows: [
        { npcName: "Brook", npcId: "brook", pickName: "Ryuma", pickId: "ryuma", stars: 4, tier: "gold" },
        { npcName: "Franky", npcId: "franky", pickName: "Sanji", pickId: "vinsmoke_sanji", stars: 4, tier: "gold" },
        { npcName: "Robin", npcId: "nico_robin", pickName: "Franky", pickId: "franky", stars: 5, tier: "gold" },
        { npcName: "Sanji", npcId: "vinsmoke_sanji", pickName: "Hina", pickId: "hina", stars: 4, tier: "gold" }
      ]
    },
    {
      id: "F3", name: "Final - Parte 3", reward: "30x Medalha de Diamante + 4x Token de Timeskip + 1x Icone de Perfil",
      rows: [
        { npcName: "Zoro", npcId: "roronoa_zoro", pickName: "Bastille", pickId: "bastille", stars: 4, tier: "gold" },
        { npcName: "Luffy", npcId: "monkey_luffy", pickName: "Smoker", pickId: "smoker", stars: 4, tier: "gold" },
        { npcName: "Koala", npcId: "koala", pickName: "Rebecca", pickId: "rebecca", stars: 4, tier: "gold" },
        { npcName: "Barto", npcId: "bartolomeo", pickName: "Van Augur", pickId: "van_augur", stars: 4, tier: "gold" }
      ]
    },
    {
      id: "CH", name: "Final - Campeao", reward: "400x Fragmentos do Sabo + 1x Icone de Perfil",
      rows: [
        { npcName: "Burguess", npcId: "jesus_burgess", pickName: "Barto", pickId: "bartolomeo", stars: 4, tier: "gold" },
        { npcName: "Sabo", npcId: "sabo", pickName: "Capone", pickId: "capone_bege", stars: 5, tier: "gold" }
      ]
    }
  ]
};
