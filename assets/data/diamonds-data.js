// Dados do Planejador de Diamantes (Conquista de Diamantes).
// Cada diamante exige personagens de uma classe. Base: dima do Lionheart (Gla-Database) + Wiki GLA.
// Sprites reaproveitados de assets/img/characters/<id>.png.
"use strict";

window.DIAMONDS_DATA = {
  // Cada diamante -> classe exigida. sprite = id do personagem em assets/img/characters.
  diamonds: [
    { key: "barbanegra", name: "Barba Negra", sprite: "marshall_teach", reqClass: "Supernova" },
    { key: "doflamingo", name: "Doflamingo", sprite: "doflamingo", reqClass: "Atirador" },
    { key: "hancock", name: "Boa Hancock", sprite: "boa_hancock", reqClass: "Mulher" },
    { key: "ivankov", name: "Emporio Ivankov", sprite: "emporio_ivankov", reqClass: "Suporte" },
    { key: "jinbe", name: "Jinbe", sprite: "jinbe", reqClass: "Tanque" },
    { key: "kizaru", name: "Kizaru", sprite: "borsalino_kizaru", reqClass: "Marinheiro" },
    { key: "kuma", name: "Bartholomew Kuma", sprite: "bartholomew_kuma", reqClass: "Realeza" },
    { key: "mihawk", name: "Dracule Mihawk", sprite: "dracule_mihawk", reqClass: "Cortante" },
    { key: "shanks", name: "Shanks", sprite: "shanks", reqClass: "Chapeu de Palha" },
    { key: "enel", name: "Enel", sprite: "enel", reqClass: "Enel" }
  ],

  // Personagens e suas classes (as classes de diamante sao as que importam para otimizar).
  chars: [
    { name: "Scratchmen Apoo", id: "scratchmen_apoo", classes: ["Atirador", "Suporte", "Supernova"] },
    { name: "Baby 5", id: "baby_5", classes: ["Atirador", "Cortante", "Mulher"] },
    { name: "Bartolomeo", id: "bartolomeo", classes: [] },
    { name: "Bastille", id: "bastille", classes: ["Cortante", "Tanque", "Marinheiro"] },
    { name: "Bellamy", id: "bellamy", classes: [] },
    { name: "Jewelry Bonney", id: "jewelry_bonney", classes: ["Suporte", "Supernova", "Mulher", "Realeza"] },
    { name: "Brook", id: "brook", classes: ["Cortante", "Suporte", "Chapeu de Palha"] },
    { name: "Capone Gang Bege", id: "capone_bege", classes: ["Atirador", "Supernova"] },
    { name: "Carrot", id: "carrot", classes: ["Cortante", "Mulher"] },
    { name: "Tony Tony Chopper", id: "chopper", classes: ["Suporte", "Chapeu de Palha"] },
    { name: "Crocodile", id: "crocodile", classes: ["Tanque"] },
    { name: "Dalmatian", id: "dalmatian", classes: ["Cortante", "Marinheiro"] },
    { name: "X Drake", id: "x_drake", classes: ["Supernova", "Marinheiro"] },
    { name: "Franky", id: "franky", classes: ["Atirador", "Chapeu de Palha"] },
    { name: "Basil Hawkins", id: "basil_hawkins", classes: ["Supernova"] },
    { name: "Hina", id: "hina", classes: ["Marinheiro", "Mulher"] },
    { name: "Vinsmoke Ichiji", id: "vinsmoke_ichiji", classes: ["Realeza"] },
    { name: "Jesus Burgess", id: "jesus_burgess", classes: ["Tanque"] },
    { name: "Eustass Kid", id: "eustass_kid", classes: ["Atirador", "Tanque", "Supernova"] },
    { name: "Killer", id: "killer", classes: ["Cortante", "Supernova"] },
    { name: "Koala", id: "koala", classes: ["Mulher"] },
    { name: "Leo e Mansherry", id: "leo_mansherry", classes: ["Suporte", "Realeza", "Mulher"] },
    { name: "Monkey D. Luffy", id: "monkey_luffy", classes: ["Chapeu de Palha", "Supernova"] },
    { name: "Marguerite", id: "margareth", classes: ["Atirador", "Mulher"] },
    { name: "Gecko Moria", id: "gecko_moria", classes: ["Cortante", "Suporte"] },
    { name: "Nami", id: "nami", classes: ["Chapeu de Palha", "Mulher"] },
    { name: "Vinsmoke Niji", id: "vinsmoke_niji", classes: ["Atirador", "Realeza"] },
    { name: "Perona", id: "perona", classes: ["Suporte", "Mulher"] },
    { name: "Rebecca", id: "rebecca", classes: ["Cortante", "Tanque", "Realeza", "Mulher"] },
    { name: "Vinsmoke Reiju", id: "vinsmoke_reiju", classes: ["Suporte", "Realeza", "Mulher"] },
    { name: "Nico Robin", id: "nico_robin", classes: ["Chapeu de Palha", "Mulher"] },
    { name: "Ryuma", id: "ryuma", classes: ["Cortante"] },
    { name: "Vinsmoke Sanji", id: "vinsmoke_sanji", classes: ["Chapeu de Palha", "Realeza"] },
    { name: "Smoker", id: "smoker", classes: ["Tanque", "Marinheiro"] },
    { name: "Urouge", id: "urouge", classes: ["Tanque", "Supernova"] },
    { name: "Trafalgar Law", id: "trafalgar_law", classes: ["Cortante", "Supernova"] },
    { name: "Usopp", id: "usopp", classes: ["Atirador", "Chapeu de Palha"] },
    { name: "Van Augur", id: "van_augur", classes: ["Atirador"] },
    { name: "Vinsmoke Yonji", id: "vinsmoke_yonji", classes: ["Tanque", "Realeza"] },
    { name: "Roronoa Zoro", id: "roronoa_zoro", classes: ["Cortante", "Chapeu de Palha", "Supernova"] },
    { name: "Kalifa", id: "kalifa", classes: ["Suporte", "Mulher"] },
    { name: "Jabra", id: "jabra", classes: ["Cortante"] },
    { name: "Kaku", id: "kaku", classes: ["Atirador", "Cortante"] },
    { name: "Rob Lucci", id: "rob_lucci", classes: [] },
    { name: "Blueno", id: "blueno", classes: [] },
    { name: "Satori", id: "satori", classes: ["Enel"] },
    { name: "Gedatsu", id: "gedatsu", classes: ["Enel"] },
    { name: "Ohm", id: "ohm", classes: ["Enel"] },
    { name: "Shura", id: "shura", classes: ["Enel"] }
  ]
};
