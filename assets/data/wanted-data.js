// Dados de Wanted Pirates (match-ups / counters). Fonte: ThePlayerLost (via Labophase).
// Exposto em window.WANTED_DATA como [{ wanted, options: [counters...] }].
"use strict";

var WANTED_PIRATES_CSV = `Wanted Pirate,Opcao 1,Opcao 2,Opcao 3,Opcao 4,Opcao 5,Opcao 6
Alvida,Tashigi,Hina,Ryuma,Kizaru,Sabo,
Arlong,Dalmatian,Drake,Luffy TS,,,
Baby 5,Burgess,Franky Pre,Drake,Hina,,
Basil Hawkins,Franky Pre,Wapol,Luffy TS,Aokiji,Kuma,Kid
Bellamy,Koala,Reiju,Kid,Hina,Smoker,Tashigi
Bepo,Gin,Tashigi,Blueno,Mr. 2,,
Brook,Bellamy,Smoker,Usopp Pre,Drake,,
Buchi e Sham,Ichiji,Morgan,Drake,Hina,Sanji Pre,Zoro Pre
Buggy,Morgan,Ichiji,Smoker,Capone,,
Cabaji,Gin,Reiju,Kid,,,
Capone Gang Bege,Rebecca,Carrot,Killer,,,
Chew,Robin Pre,Van Augur,Capone,,,
Chopper,Drake,Hina,Ichiji,Bepo,,
Don Krieg,Van Augur,Kuro,Capone,,,
Eustass Kid,Basil,Drake,,,,
Franky,Nami TS,Law,Kuma,Ace,Mihawk,Capone
Gin,Drake,Zoro Pre,Kuma,,,
Hatchan,Zoro TS,Drake,Usopp Pre,Mr. 2,Shura,
Jango,Usopp TS,Van Augur,Nami TS,Kaku,Capone,
Jesus Burgess,Bartolomeo,Hina,Mr. 5,Ace,Capone,Law
Jewelry Bonney,Usopp Pre,Usopp TS,Shura,Mr. 2,Eric,
Killer,Drake,Burgess,,,,
Koala,Ryuma,Drake,,,,
Kuro,Luffy Pre,Bastille,Mr. 1,Drake,Burgess,Kaku
Kuroobi,Wapol,Law,Hawkins,Drake,Kuma,
Leo e Mansherry,Morgan,Usopp Pre,Reiju,BN,Mr. 2,Van Augur
Miss Doublefinger,Drake,Akainu,Luffy Pre,Mr. 1,Kid,Bastille
Miss Goldenweek,Ace,Van Augur,Gedatsu,Mr. 2,Shura,Doffy
Mohji,Drake,Luffy TS,Blueno,Hina,Mr. 5,Rob Lucci
Monkey D. Luffy,Crocodile,Nami TS,Luffy TS,Doffy,Bepo,
Mr. 1,Drake,Law,Hina,Smoker,,
Mr. 2,Franky Pre,Burgess,Drake,Kuma,Doffy,Capone
Mr. 3,Van Augur,Gedatsu,Usopp TS,Ace,Kaku,Enel
Mr. 4,Law,Nami TS,BN,Luffy TS,Drake,Akainu
Mr. 5,Chew,Van Augur,Usopp TS,Doffy,Kaku,
Nami,Hina,Rebecca,Urouge,Killer,Tashigi,Van Augur
Nico Robin,Aokiji,Smoker,Van Augur,Hina (5*),Franky Pre (5*),
Pearl,Law,Bepo,Hina,Tashigi,Blueno,Rob Lucci
Perona,Urouge,Tashigi,Bastille,Akainu,Kid,Smoker
Rebecca,Reiju,Hawkins,,,,
Roronoa Zoro,Drake,Luffy TS,Bastille,Smoker,,
Ryuma,Ohm,Drake,Bastille,Franky Pre (5*),,
Scratchmen Apoo,Niji,Nami TS,Van Augur,Doffy,,
Trafalgar Law,Nami TS,Van Augur,Robin Pre,Ohm,,
Urouge,Koala,Drake,Nami TS,Mr. 5,,
Usopp,Eric,Van Augur,Usopp TS,Doffy,Chew,
Van Augur,Drake,Franky Pre,Rebecca,Burgess,,
Vinsmoke Ichiji,Bepo,Law,Drake,Bellamy,Doffy,
Vinsmoke Niji,Buggy,Nami TS,Doffy,Van Augur,,
Vinsmoke Sanji,Hina,Ohm,Carrot,,,
Vinsmoke Yonji,Franky Pre,Leo,Ohm,Hina,Drake,Hawkins
Vinsmoke Reiju,Usopp Pre,Van Augur,Usopp TS,Enel,Uta,Niji
Wapol,Drake,Zoro Pre,Usopp TS,Law,Hawkins,Mihawk
X-Drake,Drake,Hancock,Bellamy,Ryuma,,`;

// Aliases nome -> id do sprite (assets/img/characters/<id>.png).
window.WANTED_ICON_ALIASES = {
  ace: "portgas_ace",
  apoo: "scratchmen_apoo",
  basil: "basil_hawkins",
  bn: "marshall_teach",
  buchi_sham: "bucchi_sham",
  capone: "capone_bege",
  capone_gang_bege: "capone_bege",
  buchi_e_sham: "bucchi_sham",
  daddy: "daddy_masterson",
  daddy_masterson: "daddy_masterson",
  burgess: "jesus_burgess",
  burguess: "jesus_burgess",
  doffy: "doflamingo",
  drake: "x_drake",
  franky_pre: "franky",
  frankypre: "franky",
  garp: "monkey_garp",
  hancock: "boa_hancock",
  hawkins: "basil_hawkins",
  ichiji: "vinsmoke_ichiji",
  ivankov: "emporio_ivankov",
  kid: "eustass_kid",
  kizaru: "borsalino_kizaru",
  kuma: "bartholomew_kuma",
  law: "trafalgar_law",
  leo: "leo_mansherry",
  leo_e_mansherry: "leo_mansherry",
  luffy: "monkey_luffy",
  luffy_pre: "monkey_luffy",
  luffy_ts: "monkey_luffy_ts",
  lucci: "rob_lucci",
  marguerite: "margareth",
  margareth: "margareth",
  monkey_d_luffy: "monkey_luffy",
  moria: "gecko_moria",
  mr1: "mr_1",
  mr2: "mr_2",
  mr3: "mr_3",
  mr4: "mr_4",
  mr5: "mr_5",
  bonney: "jewelry_bonney",
  niji: "vinsmoke_niji",
  nami_ts: "nami_ts",
  rayleigh: "silvers_rayleigh",
  mihawk: "dracule_mihawk",
  reiju: "vinsmoke_reiju",
  robin: "nico_robin",
  robin_ts: "nico_robin_ts",
  robin_pre: "nico_robin",
  sanji: "vinsmoke_sanji",
  sanji_ts: "vinsmoke_sanji_ts",
  sanji_pre: "vinsmoke_sanji",
  teach: "marshall_teach",
  yonji: "vinsmoke_yonji",
  usopp_pre: "usopp",
  usopp_ts: "usopp_ts",
  zoro: "roronoa_zoro",
  zoro_pre: "roronoa_zoro",
  zoro_ts: "roronoa_zoro_ts",
  x_drake: "x_drake"
};

window.WANTED_DATA = WANTED_PIRATES_CSV
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(function (line) { return line.split(",").map(function (part) { return part.trim(); }); })
  .map(function (cols) {
    return {
      wanted: cols[0] || "",
      options: cols.slice(1, 7).map(function (v) { return v || ""; }).filter(Boolean)
    };
  })
  .filter(function (row) { return row.wanted; });
